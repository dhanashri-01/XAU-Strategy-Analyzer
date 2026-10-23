# XAUUSD Strategy Analyzer

A Python-based trading strategy analysis and backtesting system designed to evaluate a Fibonacci retracement strategy for **Gold (XAUUSD)** using historical market data. The system identifies directional price movements, applies Fibonacci levels, validates entries using lower-timeframe confirmation, and evaluates trading performance through backtesting.

## Overview

The XAUUSD Strategy Analyzer evaluates a rule-based trading strategy using historical gold price data. It focuses on identifying consecutive directional candlesticks, calculating Fibonacci retracement zones, and generating trade signals based on predefined entry, stop-loss, and risk-to-reward rules.

The analyzer supports historical performance evaluation across multiple periods, helping traders understand the strategy's behavior under different market conditions.

## Key Features

- **Historical Data Analysis:** Analyze XAUUSD price data using historical OHLC candlestick data.
- **Fibonacci Retracement:** Identify Fibonacci levels based on consecutive directional 5-minute candles.
- **Entry Validation:** Evaluate retracement entries around the 0.5 Fibonacci level.
- **1-Minute Confirmation:** Use a lower-timeframe confirmation candle to validate potential entries.
- **Stop-Loss Management:** Define stop-loss levels using Fibonacci retracement zones.
- **Risk-to-Reward Analysis:** Evaluate trades using a predefined 1:2 risk-to-reward ratio.
- **Trading Session Filters:** Restrict trade setups to London and New York killzones.
- **Daily Trade Limit:** Limit trade frequency to a maximum of two trades per day.
- **Backtesting:** Evaluate historical performance across different time periods.
- **Performance Metrics:** Calculate total trades, winning trades, losing trades, win rate, net risk-to-reward profit, returns, and drawdown when supported by the backtesting implementation.

## Strategy Logic

The strategy follows a rule-based process:

1. **Identify directional movement:** Detect five or more consecutive bullish or bearish 5-minute candles.
2. **Calculate Fibonacci levels:** Draw Fibonacci retracement levels across the identified candle sequence.
3. **Wait for retracement:** Monitor price as it retraces toward the 0.5 Fibonacci level.
4. **Validate the entry:** Check the 1-minute confirmation candle and the configured Fibonacci-zone conditions.
5. **Define risk:** Place the stop-loss according to the selected Fibonacci retracement zone.
6. **Set the target:** Apply the configured risk-to-reward ratio of 1:2.
7. **Apply session filters:** Consider valid setups only during the configured London and New York trading sessions.
8. **Control trade frequency:** Enforce the maximum of two trades per day.
9. **Evaluate performance:** Record trade outcomes and calculate backtesting metrics.

> **Note:** Exact entry, confirmation, and stop-loss conditions should match the strategy rules implemented in the source code. Backtesting results depend on the historical data, execution assumptions, spread, and slippage.

## Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| Data Processing | Pandas, NumPy |
| Market Data | Historical XAUUSD OHLC data, including CSV exports |
| Strategy Analysis | Fibonacci retracement and rule-based trade logic |
| Backtesting | Custom Python backtesting engine |
| Visualization | Matplotlib, if enabled |
| Development Environment | VS Code or Jupyter Notebook / Google Colab |

*The libraries listed above should be adjusted to match the project's actual dependencies.*

## Project Structure

A suggested project structure is shown below. Adapt the filenames to your repository.

```text
XAUUSD-Strategy-Analyzer/
├── data/
│   └── historical_xauusd.csv
├── notebooks/
│   └── strategy_analysis.ipynb
├── src/
│   ├── data_loader.py
│   ├── fibonacci.py
│   ├── strategy.py
│   ├── backtester.py
│   └── performance.py
├── results/
│   └── backtest_results.csv
├── requirements.txt
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or a compatible Python version
- Historical XAUUSD price data
- pip package manager
- VS Code, Jupyter Notebook, or Google Colab

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/XAUUSD-Strategy-Analyzer.git
cd XAUUSD-Strategy-Analyzer
```

Replace `YOUR_USERNAME` with your GitHub username and update the repository URL if necessary.

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

On macOS or Linux:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

If a `requirements.txt` file is available:

```bash
pip install -r requirements.txt
```

Otherwise, install the libraries required by your implementation. For a typical data-analysis workflow:

```bash
pip install pandas numpy matplotlib
```

### 4. Prepare Historical Data

Place the historical gold price data in the configured data directory.

The dataset should contain OHLC data, typically including:

- Timestamp
- Open
- High
- Low
- Close
- Volume, if available

Ensure timestamps are parsed correctly and converted to the timezone used by the strategy's session filters. The exact CSV column names should match those expected by the data loader.

### 5. Run the Analyzer

Run the project's actual entry-point script or notebook. For example, if the entry point is `main.py`:

```bash
python main.py
```

If the implementation uses a Jupyter Notebook, open the notebook and execute its cells in order.

*The command above is illustrative; use the actual entry point present in the repository.*

## Backtesting and Performance Evaluation

The analyzer can be used to evaluate the strategy over different historical periods, provided sufficient market data is available.

Important performance metrics include:

| Metric | Description |
|---|---|
| Total Trades | Number of trades executed by the backtest |
| Winning Trades | Trades that reached the profit target or otherwise closed profitably |
| Losing Trades | Trades that closed at a loss |
| Win Rate | Percentage of trades that were profitable |
| Net R Profit | Net profit expressed in units of initial trade risk |
| Total Return | Percentage change in account equity |
| Maximum Drawdown | Largest peak-to-trough decline in account equity |

### Win Rate

\[
\text{Win Rate} =
\frac{\text{Winning Trades}}{\text{Total Trades}}\times100
\]

### Risk-to-Reward Ratio

A 1:2 risk-to-reward ratio means the intended reward is twice the initial risk.

For example, if a trade risks ₹500, its intended reward is ₹1,000 before transaction costs.

Actual outcomes can differ because of slippage, spread, gaps, or execution constraints.

## Data Sources

The analyzer can work with historical market data exported from compatible trading platforms or downloaded from supported data providers.

Possible sources include:

- Dukascopy historical data
- MetaTrader 5 historical data exports
- Broker-provided XAUUSD CSV files

Data formats and price conventions can vary between providers. Ensure the selected dataset has the correct timeframe, timezone, and bid/ask assumptions.

## Important Considerations

- Historical performance does not guarantee future profitability.
- Backtests can be affected by look-ahead bias, data quality, and unrealistic execution assumptions.
- Spread, commission, slippage, and bid/ask differences can materially affect results.
- Session boundaries must account for timezone changes, including daylight saving time where applicable.
- Avoid tuning strategy parameters solely to maximize performance on the same dataset used for evaluation.
- Use out-of-sample testing and forward testing before considering live deployment.

## Future Improvements

Potential enhancements include:

- Interactive performance dashboards
- Equity curve and drawdown visualization
- Detailed trade-by-trade reports
- Automated comparison across historical periods
- Walk-forward and out-of-sample testing
- More realistic spread, commission, and slippage simulation
- Live market-data integration
- MetaTrader 5 execution integration with appropriate risk controls

## Disclaimer

This project is intended for educational, research, and strategy-testing purposes only. It does not provide financial advice or guarantee trading profits. Gold and other financial instruments involve substantial risk. Validate all results independently before making trading decisions.

## Author

**Dhanashri Patil**

