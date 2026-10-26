## Same strategy for Last 5 years using 5M confirmation
import pandas as pd
import json
import sys
import io

# -------------------------------
# Receive data from Node.js
# -------------------------------
# Assumes: argv[1] = path to CSV, argv[2] = JSON string of settings
# e.g. python strategy_fixed.py data.csv '{"fastEMA":20, ...}'

csv_path = sys.argv[1]
settings = json.loads(sys.argv[2])

fastEMA = int(settings["fastEMA"])
slowEMA = int(settings["slowEMA"])

minCandles = int(settings["minCandles"])

fibLevel = float(settings["fibLevel"])

slRatio = float(settings["slRatio"])

rr = float(settings["rr"])

londonStart = int(settings["londonStart"].split(":")[0])
londonEnd = int(settings["londonEnd"].split(":")[0])

newYorkStart = int(settings["newYorkStart"].split(":")[0])
newYorkEnd = int(settings["newYorkEnd"].split(":")[0])

trendFilter = settings["trendFilter"]
confirmation = settings["confirmation"]
fib618 = settings["fib618"]

bullishEnabled = settings["bullish"]
bearishEnabled = settings["bearish"]

# -------------------------------
# LOAD CSV
try:
    data = pd.read_csv(io.BytesIO(sys.stdin.buffer.read())) if csv_path == "-" else pd.read_csv(csv_path)
except Exception as error:
    raise ValueError(f"Could not read the CSV file: {error}") from error

data.columns = data.columns.astype(str).str.strip()
columns_by_name = {column.lower(): column for column in data.columns}
time_column = next(
    (columns_by_name[name] for name in ("time (eet)", "time", "datetime", "timestamp", "date") if name in columns_by_name),
    None,
)
if time_column is None:
    raise ValueError("CSV needs a timestamp column named Time, Time (EET), Date, Datetime, or Timestamp.")

rename_columns = {time_column: "Time"}
for required_column in ("Open", "High", "Low", "Close"):
    source_column = columns_by_name.get(required_column.lower())
    if source_column is not None:
        rename_columns[source_column] = required_column

data.rename(columns=rename_columns, inplace=True)
missing_columns = [column for column in ("Time", "Open", "High", "Low", "Close") if column not in data.columns]
if missing_columns:
    raise ValueError(f"CSV is missing required columns: {', '.join(missing_columns)}.")

if "Volume" not in data.columns:
    data["Volume"] = 0

timestamps = pd.to_datetime(data["Time"], errors="coerce")
if timestamps.isna().any():
    raise ValueError("Some values in the CSV timestamp column could not be parsed.")
if timestamps.dt.tz is None:
    timestamps = timestamps.dt.tz_localize("Europe/Helsinki", ambiguous="infer", nonexistent="shift_forward")
else:
    timestamps = timestamps.dt.tz_convert("Europe/Helsinki")

data["Time"] = timestamps
data.set_index("Time", inplace=True)
data = data[["Open", "High", "Low", "Close", "Volume"]]

# 2. TIMEZONE FIX
# -------------------------------
data = data.tz_convert("Europe/London")

data['Hour'] = data.index.hour
data['Date'] = data.index.date

data.reset_index(drop=True, inplace=True)

# -------------------------------
# 3. KILLZONE FILTER
# -------------------------------
def is_killzone(hour):
    return (
        londonStart <= hour < londonEnd
    ) or (
        newYorkStart <= hour < newYorkEnd
    )


data = data[data['Hour'].apply(is_killzone)].reset_index(drop=True)

# -------------------------------
# 4. EMA
# -------------------------------

data["EMA"] = data["Close"].ewm(span=fastEMA).mean()


def is_uptrend(df, i):
    return i > 0 and df.loc[i, 'Close'] > df.loc[i, 'EMA']


def is_downtrend(df, i):
    return i > 0 and df.loc[i, 'Close'] < df.loc[i, 'EMA']


# -------------------------------
# 5. DETECT BLOCKS
# -------------------------------
def detect_blocks(df):
    blocks = []
    i = 0

    while i < len(df) - 1:
        count = 1

        if df.loc[i, 'Close'] > df.loc[i, 'Open']:
            direction = 'bullish'
        elif df.loc[i, 'Close'] < df.loc[i, 'Open']:
            direction = 'bearish'
        else:
            i += 1
            continue

        j = i + 1
        while j < len(df):
            if direction == 'bullish' and df.loc[j, 'Close'] > df.loc[j, 'Open']:
                count += 1
            elif direction == 'bearish' and df.loc[j, 'Close'] < df.loc[j, 'Open']:
                count += 1
            else:
                break
            j += 1

        if count >= minCandles:
            blocks.append((i, j - 1, direction))

        i = j

    return blocks


# -------------------------------
# 6. FIB LEVELS
# -------------------------------
def fib_levels(df, start, end, direction):

    high = df.loc[start:end, "High"].max()
    low = df.loc[start:end, "Low"].min()

    if direction == "bullish":
        entry = high - fibLevel * (high - low)
        sl = high - slRatio * (high - low)
        tp = entry + rr * (entry - sl)
        level_0618 = high - 0.618 * (high - low)
    else:
        entry = low + fibLevel * (high - low)
        sl = low + slRatio * (high - low)
        tp = entry - rr * (sl - entry)
        level_0618 = low + 0.618 * (high - low)

    return entry, sl, tp, level_0618


# -------------------------------
# 7. BACKTEST
# -------------------------------
trades = []
trade_count_per_day = {}

blocks = detect_blocks(data)

last_direction = None
last_entry = last_sl = last_tp = None

for start, end, direction in blocks:

    date = data.loc[end, 'Date']

    if date not in trade_count_per_day:
        trade_count_per_day[date] = 0

    if trade_count_per_day[date] >= 2:
        continue

    if direction == "bullish" and not bullishEnabled:
        continue
    if direction == "bearish" and not bearishEnabled:
        continue

    entry, sl, tp, level_0618 = fib_levels(data, start, end, direction)
    last_direction, last_entry, last_sl, last_tp = direction, entry, sl, tp

    for i in range(end + 1, len(data)):

        if data.loc[i, 'Date'] != date:
            break

        if trade_count_per_day[date] >= 2:
            break

        # Trend filter
        if trendFilter:
            if direction == "bullish" and not is_uptrend(data, i):
                continue
            if direction == "bearish" and not is_downtrend(data, i):
                continue

        high = data.loc[i, 'High']
        low = data.loc[i, 'Low']
        close = data.loc[i, 'Close']

        # TOUCH 0.5
        if low <= entry <= high:

            # 0.618 CLOSE CONDITION FILTER
            if fib618:
                if direction == "bullish" and close < level_0618:
                    continue
                if direction == "bearish" and close > level_0618:
                    continue
        else:
            # price hasn't reached the entry level yet, keep waiting
            continue

        if i + 1 >= len(data):
            break

        next_open = data.loc[i + 1, 'Open']
        next_close = data.loc[i + 1, 'Close']

        confirm = (
            (direction == "bullish" and next_close > next_open) or
            (direction == "bearish" and next_close < next_open)
        )

        if confirmation and not confirm:
            break

        result = None

        for j in range(i + 2, len(data)):

            if data.loc[j, 'Date'] != date:
                break

            future_high = data.loc[j, 'High']
            future_low = data.loc[j, 'Low']

            if direction == "bullish":
                if future_low <= sl:
                    result = -1
                    break
                elif future_high >= tp:
                    result = 2
                    break
            else:
                if future_high >= sl:
                    result = -1
                    break
                elif future_low <= tp:
                    result = 2
                    break

        if result is not None:
            trades.append(result)
            trade_count_per_day[date] += 1

        # only one entry attempt per block, whether or not it resolved
        break

# -------------------------------
# 8. RESULTS
# -------------------------------
total_trades = len(trades)
wins = trades.count(2)
losses = trades.count(-1)

win_rate = (wins / total_trades) * 100 if total_trades > 0 else 0
net_profit = sum(trades)

output = {
    "signal": last_direction.upper() if last_direction else "NO SIGNAL",
    "entry": round(float(last_entry), 2) if last_entry is not None else None,
    "stopLoss": round(float(last_sl), 2) if last_sl is not None else None,
    "target": round(float(last_tp), 2) if last_tp is not None else None,
    "accuracy": round(win_rate, 2),
    "wins": wins,
    "losses": losses,
    "trades": total_trades,
    "netRR": round(float(net_profit), 2) if isinstance(net_profit, (int, float)) else net_profit,

    "equityCurve": [],     # we'll populate this
    "tradeLog": []         # we'll populate this
}
print(json.dumps(output))
