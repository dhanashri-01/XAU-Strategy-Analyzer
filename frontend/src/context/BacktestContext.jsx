import { createContext, useContext, useState } from "react";

const BacktestContext = createContext();

export function BacktestProvider({ children }) {

    const [backtest, setBacktest] = useState(null);

    return (
        <BacktestContext.Provider
            value={{
                backtest,
                setBacktest
            }}
        >
            {children}
        </BacktestContext.Provider>
    );
}

export function useBacktest() {
    return useContext(BacktestContext);
}