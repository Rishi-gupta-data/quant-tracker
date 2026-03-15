// ═══════════════════════════════════════════════════════
//  RISHI'S QUANT TRACKER — App Data
// ═══════════════════════════════════════════════════════

const APP_DATA = {

  phases: [
    {
      id: 0, num: "0", color: "#e65100", light: "#fff3e0",
      title: "Revision Sprint",
      subtitle: "Solidify existing Python/Finance skills",
      weeks: "Week 1", hours: 20,
      weeks_count: 1,
      topics: ["Pandas for Finance (resample, rolling, log returns)", "NumPy covariance matrix from scratch", "Portfolio variance formula (wᵀΣw)", "Statistics on stock returns (skewness, kurtosis)", "GitHub README for all 4 existing projects"]
    },
    {
      id: 1, num: "1", color: "#1a4f8a", light: "#eef4ff",
      title: "Quant Math",
      subtitle: "GBM, Monte Carlo, Portfolio Theory",
      weeks: "Weeks 2–4", hours: 60,
      weeks_count: 3,
      topics: ["Probability for Trading (fat tails, log-normal)", "Geometric Brownian Motion (dS = μS dt + σS dW)", "Monte Carlo Simulation (1000 price paths)", "Mean-Variance Portfolio Theory (Markowitz)", "Efficient Frontier & Max Sharpe Portfolio", "PyPortfolioOpt implementation"]
    },
    {
      id: 2, num: "2", color: "#1b6caa", light: "#e8f4fd",
      title: "Time Series & Econometrics",
      subtitle: "ARIMA, GARCH, Pairs Trading, Risk Metrics",
      weeks: "Weeks 5–10", hours: 120,
      weeks_count: 6,
      topics: ["Stationarity & ADF Test", "ACF/PACF Interpretation", "ARIMA Modelling & Walk-forward Forecast", "GARCH(1,1) Volatility Modelling", "Cointegration & Engle-Granger Test", "Pairs Trading (Z-score signals)", "CAPM, Beta & Alpha", "VaR, CVaR, Sharpe, Sortino, Calmar"]
    },
    {
      id: 3, num: "3", color: "#2481c5", light: "#e3f2fd",
      title: "Financial Markets & Derivatives",
      subtitle: "Options, Black-Scholes, Greeks, Microstructure",
      weeks: "Weeks 11–16", hours: 120,
      weeks_count: 6,
      topics: ["Market Microstructure (order book, bid-ask, slippage)", "Options Basics (call/put payoffs, intrinsic vs time value)", "Black-Scholes Model (BSM formula + Python implementation)", "The Greeks (Delta, Gamma, Theta, Vega, Rho)", "Implied Volatility Surface", "Futures & Cost-of-Carry Model", "Options Strategies (straddle, iron condor, bull spread)"]
    },
    {
      id: 4, num: "4", color: "#2e86de", light: "#e8f1fc",
      title: "Backtesting Systems",
      subtitle: "Backtrader, VectorBT, Walk-Forward Validation",
      weeks: "Weeks 17–20", hours: 80,
      weeks_count: 4,
      topics: ["Event-Driven Architecture (Data→Signal→Broker)", "Backtrader Framework", "Walk-Forward Validation", "Transaction Cost Modelling (STT, brokerage, impact)", "VectorBT Vectorized Backtesting", "PyFolio Tearsheet & Performance Attribution"]
    },
    {
      id: 5, num: "5", color: "#2e7d32", light: "#e8f5e9",
      title: "Machine Learning for Trading",
      subtitle: "Feature Engineering, Purged CV, XGBoost, Regime Detection",
      weeks: "Weeks 21–28", hours: 160,
      weeks_count: 8,
      topics: ["Alpha Factor Engineering (momentum, vol, sector strength)", "Forward Return Labels & Lookahead Bias", "Information Coefficient (IC) Analysis", "Purged K-Fold Cross-Validation", "XGBoost & LightGBM for Return Prediction", "SHAP Feature Importance", "Hyperparameter Tuning (Optuna)", "HMM Regime Detection", "Risk Parity Portfolio Optimisation", "FinBERT Sentiment Signal"]
    },
    {
      id: 6, num: "6", color: "#e65100", light: "#fff3e0",
      title: "Algo Trading Systems",
      subtitle: "Kite Connect API, Risk Manager, Live Paper Trading",
      weeks: "Weeks 29–34", hours: 120,
      weeks_count: 6,
      topics: ["Zerodha Kite Connect API", "WebSocket Live Tick Streaming", "Event-Driven Live Trading Architecture", "Risk Manager (Kelly, VaR limits, circuit breakers)", "Position Sizing & Sector Exposure Controls", "TWAP/VWAP Execution Algorithms", "Streamlit Monitoring Dashboard"]
    },
    {
      id: 7, num: "7", color: "#6a1b9a", light: "#f3e5f5",
      title: "Deep Learning & RL for Finance",
      subtitle: "LSTM, RL Trading Agents, FinGPT",
      weeks: "Weeks 35–40", hours: 120,
      weeks_count: 6,
      topics: ["Neural Network Fundamentals (backprop, dropout, batch norm)", "LSTM for Financial Time Series", "Multi-step Forecasting & Attention", "Reinforcement Learning (Q-learning, DQN, PPO)", "Custom OpenAI Gym Trading Environment", "FinRL Library", "FinGPT & LLM Trading Agents"]
    },
    {
      id: 8, num: "★", color: "#c62828", light: "#ffebee",
      title: "Capstone Projects",
      subtitle: "3 Job-Ready Portfolio Projects",
      weeks: "Weeks 41–43", hours: 60,
      weeks_count: 3,
      topics: ["Capstone A: Systematic Indian Equity Strategy", "Capstone B: Live Options & Algo Dashboard", "Capstone C: RL Agent Research Paper (SSRN)"]
    }
  ],

  flashcards: [
    // Phase 1
    { id: "fc1", phase: 1, q: "What is the formula for Geometric Brownian Motion?", a: "dS = μS dt + σS dW\n\nWhere:\n• μ = drift (expected return)\n• σ = volatility\n• dW = Wiener process increment (random shock)\n• S = stock price" },
    { id: "fc2", phase: 1, q: "Why are stock prices modelled as log-normal rather than normal?", a: "Stock prices cannot go below zero, so they follow a log-normal distribution. Log returns (ln(St/S0)) are approximately normally distributed, but price levels are log-normal.\n\nKey: log-normal is bounded below at 0, matching the reality of limited liability." },
    { id: "fc3", phase: 1, q: "What is the portfolio variance formula in matrix form?", a: "σ²p = wᵀ Σ w\n\nWhere:\n• w = vector of portfolio weights\n• Σ = covariance matrix of returns\n• wᵀ = transpose of weights vector\n\nScalar form for 2 assets: σ²p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁₂" },
    { id: "fc4", phase: 1, q: "What is the Sharpe Ratio and what does it measure?", a: "Sharpe = (Rp - Rf) / σp\n\nWhere:\n• Rp = portfolio return\n• Rf = risk-free rate\n• σp = portfolio standard deviation\n\nMeasures excess return per unit of total risk. Higher is better. >1 is considered good, >2 is excellent." },
    { id: "fc5", phase: 1, q: "What is the Max Sharpe portfolio and how do you find it?", a: "The portfolio on the efficient frontier with the highest Sharpe ratio. Geometrically, it's where the Capital Market Line is tangent to the efficient frontier.\n\nIn Python: use PyPortfolioOpt's EfficientFrontier().max_sharpe() method.\n\nAlso called the Tangency Portfolio." },
    // Phase 2
    { id: "fc6", phase: 2, q: "What is a stationary time series?", a: "A series whose statistical properties (mean, variance, autocorrelation) do not change over time.\n\nFormal: A process Xt is weakly stationary if:\n1. E[Xt] = μ (constant mean)\n2. Var(Xt) = σ² (constant variance)\n3. Cov(Xt, Xt+k) depends only on k, not t\n\nImportant: Most raw price series are NOT stationary; returns often are." },
    { id: "fc7", phase: 2, q: "What does the ADF (Augmented Dickey-Fuller) test do?", a: "Tests whether a time series has a unit root (i.e., is non-stationary).\n\nH₀: Series has a unit root (non-stationary)\nH₁: Series is stationary\n\nIf p-value < 0.05 → reject H₀ → series IS stationary\nIf p-value > 0.05 → fail to reject H₀ → series is NON-stationary\n\nIn Python: statsmodels.tsa.stattools.adfuller()" },
    { id: "fc8", phase: 2, q: "What is GARCH(1,1) and what problem does it solve?", a: "GARCH = Generalised AutoRegressive Conditional Heteroskedasticity.\n\nSolves: stock return volatility is not constant — it clusters (high vol follows high vol).\n\nGARCH(1,1) formula:\nσ²t = ω + α·ε²t-1 + β·σ²t-1\n\nWhere α+β < 1 for stationarity. Used for volatility forecasting and VaR estimation." },
    { id: "fc9", phase: 2, q: "What is cointegration? How does it differ from correlation?", a: "Two non-stationary series are cointegrated if a linear combination is stationary.\n\nCorrelation: measures the direction/strength of movement.\nCointegration: measures long-run equilibrium relationship.\n\nTwo stocks can be uncorrelated but cointegrated (or vice versa).\n\nPairs trading relies on cointegration: when the spread reverts to mean, we trade.\n\nTest: Engle-Granger test (statsmodels.coint())" },
    { id: "fc10", phase: 2, q: "What is Value at Risk (VaR) and CVaR?", a: "VaR(α): Maximum loss not exceeded with probability (1-α) over a time horizon.\nExample: 1-day 95% VaR = ₹10,000 means only 5% chance of losing more than ₹10k in a day.\n\nCVaR (Conditional VaR / Expected Shortfall): Expected loss GIVEN that loss exceeds VaR. More conservative than VaR — captures tail risk better.\n\nCVaR ≥ VaR always." },
    // Phase 3
    { id: "fc11", phase: 3, q: "Write the Black-Scholes call option pricing formula.", a: "C = S·N(d₁) - K·e^(-rT)·N(d₂)\n\nWhere:\nd₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)\nd₂ = d₁ - σ√T\n\n• S = current stock price\n• K = strike price\n• r = risk-free rate\n• T = time to expiry (years)\n• σ = volatility\n• N(·) = cumulative normal distribution" },
    { id: "fc12", phase: 3, q: "What are the 5 main option Greeks?", a: "Δ Delta: Rate of change of option price with respect to underlying price. Call delta ∈ (0,1), Put delta ∈ (-1,0).\n\nΓ Gamma: Rate of change of Delta with underlying price. Peaks at-the-money.\n\nΘ Theta: Time decay — option value lost per day. Always negative for long options.\n\nν Vega: Sensitivity to implied volatility. Increases as expiry approaches.\n\nρ Rho: Sensitivity to interest rates. Less important in practice." },
    { id: "fc13", phase: 3, q: "What is implied volatility (IV) and the IV smile?", a: "Implied Volatility: The volatility value that, plugged into BSM, gives the observed market price.\n\nIV ≠ Historical Vol. IV reflects market's expectation of future volatility.\n\nIV Smile: When you plot IV vs strike price, it forms a 'smile' or 'skew' — OTM puts typically have higher IV (put skew) because of demand for downside protection.\n\nVol surface = IV plotted across strikes AND expiries." },
    { id: "fc14", phase: 3, q: "What is Delta hedging?", a: "Creating a portfolio that is insensitive to small movements in the underlying price.\n\nIf you're long a call (Δ = 0.5), you short 0.5 shares of the underlying → net delta = 0.\n\nThe hedge must be rebalanced continuously (in theory) as delta changes — this is called 'dynamic hedging'.\n\nGamma measures how fast delta changes → high gamma = hedge needs frequent rebalancing." },
    // Phase 4
    { id: "fc15", phase: 4, q: "What is lookahead bias in backtesting?", a: "Using information in a backtest that would NOT have been available at the time of the trade.\n\nCommon examples:\n• Using today's closing price to generate today's signal (should use yesterday's)\n• Using the full dataset to compute normalization parameters before splitting\n• Survivorship bias (only backtesting stocks that still exist)\n\nLookahead bias inflates Sharpe ratio. Can make a losing strategy appear profitable." },
    { id: "fc16", phase: 4, q: "Why is standard k-fold CV wrong for financial time series?", a: "Standard k-fold randomly shuffles data — future observations can end up in the training set, creating leakage.\n\nFor time series:\n1. Walk-forward: train on past, test on immediate future, roll forward\n2. Purged CV: remove observations around the test period to prevent label leakage from overlapping windows\n3. Embargo: additional buffer after test set to remove any residual leakage\n\nWithout this, reported Sharpe can be 2-5x too high." },
    // Phase 5
    { id: "fc17", phase: 5, q: "What is Purged K-Fold Cross-Validation?", a: "A time-series aware CV method by Lopez de Prado.\n\nProblem: Financial labels (e.g., 5-day forward return) overlap in time → standard CV leaks future info into training set.\n\nSolution:\n1. Purging: Remove training observations whose labels overlap with test period\n2. Embargo: Remove additional observations immediately after test set\n\nResult: Honest estimate of out-of-sample performance. Standard CV inflates Sharpe by 2-5x." },
    { id: "fc18", phase: 5, q: "What is the Information Coefficient (IC) in factor investing?", a: "IC = Spearman rank correlation between predicted factor scores and actual forward returns.\n\nIC = 0: factor has zero predictive power\nIC > 0.05: considered good in practice\nIC > 0.10: excellent\n\nICIR (IC Information Ratio) = mean(IC) / std(IC)\n\nUsed to evaluate individual alpha factors before building ML models on them." },
    { id: "fc19", phase: 5, q: "What is SHAP and why use it for trading models?", a: "SHAP = SHapley Additive exPlanations.\n\nExplains individual predictions: for each prediction, SHAP assigns a contribution value to each feature.\n\nIn trading:\n• Identify which factors drove each trade signal\n• Detect feature instability across time periods\n• Find when model behaviour changes (regime shifts)\n• Required for explaining models to risk managers\n\nIn Python: shap.TreeExplainer() for tree-based models (XGBoost, LightGBM)." },
    // Phase 6
    { id: "fc20", phase: 6, q: "What is the Kelly Criterion for position sizing?", a: "Optimal fraction of capital to bet to maximise long-run growth rate.\n\nKelly fraction: f* = (bp - q) / b\n\nWhere:\n• b = net odds (profit per unit bet)\n• p = probability of win\n• q = 1 - p (probability of loss)\n\nIn practice: use half-Kelly (f*/2) for reduced drawdown.\n\nWarning: Full Kelly can lead to 50%+ drawdowns. Most professional traders use fractional Kelly." },
    { id: "fc21", phase: 6, q: "What is TWAP execution and when is it used?", a: "TWAP = Time-Weighted Average Price.\n\nSplits a large order equally across N time intervals to achieve average execution close to the time-weighted price.\n\nUse when: you want to minimise timing risk and avoid market impact from placing large orders.\n\nAlternative: VWAP (Volume-Weighted Average Price) — executes proportional to market volume at each interval. Better for liquid stocks." },
    // Phase 7
    { id: "fc22", phase: 7, q: "How does an LSTM differ from a simple RNN?", a: "Simple RNN suffers from vanishing gradients — can't learn long-term dependencies.\n\nLSTM solves this with 3 gates:\n• Forget gate: decides what to discard from cell state\n• Input gate: decides what new info to store\n• Output gate: decides what to output\n\nCell state (Ct) acts as a 'highway' allowing gradients to flow back unimpeded.\n\nFor finance: LSTM can theoretically remember patterns from 20-50 time steps back." },
    { id: "fc23", phase: 7, q: "What is Proximal Policy Optimization (PPO) in RL?", a: "PPO is an on-policy RL algorithm that updates the policy by taking small, controlled steps.\n\nKey idea: Clip the policy update so the new policy doesn't deviate too much from old policy.\n\nObjective: L_CLIP = E[min(r·Â, clip(r, 1-ε, 1+ε)·Â)]\n\nWhere r = π_new/π_old (probability ratio) and Â = advantage estimate.\n\nIn trading: PPO learns a buy/sell policy directly from historical price data in a simulated environment." },
  ],

  quizQuestions: [
    // Phase 1
    { id: "q1", phase: 1, difficulty: "medium",
      q: "If a portfolio has weights [0.6, 0.4] and asset volatilities [0.2, 0.3] with correlation 0.5, what is portfolio volatility?",
      options: ["19.7%", "21.0%", "22.4%", "25.0%"],
      answer: 0,
      explanation: "σ²p = (0.6)²(0.2)² + (0.4)²(0.3)² + 2(0.6)(0.4)(0.5)(0.2)(0.3)\n= 0.0144 + 0.0144 + 0.0144 = 0.0388\nσp = √0.0388 ≈ 0.197 = 19.7%" },
    { id: "q2", phase: 1, difficulty: "easy",
      q: "In the GBM formula dS = μS dt + σS dW, what does the term σS dW represent?",
      options: ["The drift component (expected growth)", "The random shock component (volatility)", "The risk-free rate", "The dividend yield"],
      answer: 1,
      explanation: "σS dW is the stochastic (random) component:\n• σ = volatility\n• S = current price\n• dW = Wiener process increment (random normal shock)\n\nThe μS dt term is the deterministic drift." },
    { id: "q3", phase: 1, difficulty: "hard",
      q: "The efficient frontier shows the set of portfolios that:",
      options: ["Have the highest return for a given risk level", "Have the lowest risk for a given return level", "Both of the above — maximise return AND minimise risk simultaneously", "Have zero correlation between assets"],
      answer: 2,
      explanation: "The efficient frontier is the set of optimal portfolios that offer the highest expected return for a defined level of risk OR the lowest risk for a given expected return. Both conditions define the same curve." },
    // Phase 2
    { id: "q4", phase: 2, difficulty: "easy",
      q: "In the ADF test, if the p-value is 0.03, you conclude the series is:",
      options: ["Non-stationary (has unit root)", "Stationary (no unit root)", "Cointegrated", "ARCH-effect present"],
      answer: 1,
      explanation: "ADF H₀ = unit root (non-stationary). p-value = 0.03 < 0.05, so we REJECT H₀ → the series IS stationary." },
    { id: "q5", phase: 2, difficulty: "medium",
      q: "GARCH(1,1) is used primarily to model:",
      options: ["Mean of returns", "Autocorrelation in returns", "Volatility clustering in returns", "Long-memory in prices"],
      answer: 2,
      explanation: "GARCH models the conditional variance (volatility), specifically the clustering phenomenon — periods of high volatility tend to be followed by high volatility, and low by low. This is called 'volatility clustering' or ARCH effect." },
    { id: "q6", phase: 2, difficulty: "hard",
      q: "In pairs trading, the z-score of the spread is computed as: z = (spread - μ) / σ. You go LONG the spread when:",
      options: ["z > +2 (spread is very wide above mean)", "z < -2 (spread is very narrow below mean)", "z = 0 (spread at mean)", "z > +1 (spread slightly above mean)"],
      answer: 1,
      explanation: "Long the spread = expect it to widen back to mean.\nIf z < -2, spread is below mean → you expect it to RISE → go long.\nIf z > +2, spread is above mean → you expect it to FALL → go short.\nExit when z returns to 0." },
    // Phase 3
    { id: "q7", phase: 3, difficulty: "easy",
      q: "Theta (Θ) for a long call option is typically:",
      options: ["Positive — option gains value over time", "Negative — option loses value over time", "Zero — time has no effect", "Positive for ITM, negative for OTM"],
      answer: 1,
      explanation: "Theta is always NEGATIVE for long option positions. Time decay erodes extrinsic (time) value. This is why option buyers are fighting against time — every day that passes costs them money, all else equal." },
    { id: "q8", phase: 3, difficulty: "medium",
      q: "The implied volatility 'smile' shows that OTM puts typically have higher IV than ATM options because:",
      options: ["OTM puts are more liquid", "There is excess demand for downside protection (hedging)", "OTM puts have higher gamma", "The BSM model is perfectly accurate"],
      answer: 1,
      explanation: "Institutional investors and portfolio managers pay a premium for OTM puts as insurance against market crashes. This excess demand drives up their prices, which inflates their implied volatility above what BSM would predict for a log-normal world." },
    // Phase 4
    { id: "q9", phase: 4, difficulty: "medium",
      q: "Walk-forward analysis in backtesting refers to:",
      options: ["Testing strategy on data before training data", "Repeatedly training on past data and testing on the next unseen period, rolling forward", "Using future data to calibrate parameters", "Optimising parameters on the full dataset"],
      answer: 1,
      explanation: "Walk-forward: train on period 1-100, test on 101-120. Then train on 1-120, test on 121-140. Etc.\n\nThis mimics real-world deployment and gives an honest out-of-sample estimate." },
    // Phase 5
    { id: "q10", phase: 5, difficulty: "hard",
      q: "Purged Cross-Validation removes training samples near the test set boundary because:",
      options: ["They have lower returns", "Their labels overlap in time with the test set, causing data leakage", "They are outliers", "They increase training time"],
      answer: 1,
      explanation: "When labels use forward returns (e.g., 5-day return), training samples near the test boundary have labels that use prices INSIDE the test set. This creates leakage. Purging removes these contaminated samples. Embargo adds an extra buffer zone after the test period." },
    { id: "q11", phase: 5, difficulty: "medium",
      q: "An IC (Information Coefficient) of 0.07 for a factor means:",
      options: ["The factor is useless — 7% correlation is negligible", "The factor has decent predictive power — IC >0.05 is considered good", "The factor has perfect predictive power", "The factor is inversely predictive"],
      answer: 1,
      explanation: "IC of 0.07 (Spearman rank correlation between factor and forward returns) is considered good in practice. Financial markets are noisy. Most institutional quant funds target IC of 0.05-0.10 across their factor library." },
    // Phase 6
    { id: "q12", phase: 6, difficulty: "medium",
      q: "The Kelly Criterion gives the fraction of capital to bet. A 'half-Kelly' approach means:",
      options: ["Betting twice the Kelly fraction", "Betting half the Kelly fraction for lower drawdown risk", "Only betting when you have >50% win rate", "Using Kelly only in bull markets"],
      answer: 1,
      explanation: "Full Kelly maximises long-run geometric growth but produces large drawdowns (~50%+). Half-Kelly (bet 50% of Kelly fraction) reduces expected drawdown significantly while sacrificing some long-term growth. Most professional traders use 1/4 to 1/2 Kelly." },
    // Phase 7
    { id: "q13", phase: 7, difficulty: "medium",
      q: "In an LSTM, the 'forget gate' decides:",
      options: ["What new information to add to the cell state", "Which part of the cell state to discard", "What to output from the LSTM cell", "The learning rate for backpropagation"],
      answer: 1,
      explanation: "Forget gate: ft = σ(Wf·[ht-1, xt] + bf)\nOutput ∈ (0,1). Values near 0 = forget. Values near 1 = keep.\n\nThis allows LSTMs to 'forget' irrelevant past information (e.g., patterns from a different market regime)." },
    { id: "q14", phase: 7, difficulty: "hard",
      q: "In PPO's clipped objective, the clipping mechanism ensures:",
      options: ["Faster convergence", "The policy update doesn't deviate too far from the current policy", "Higher exploration rate", "Lower memory usage"],
      answer: 1,
      explanation: "PPO clips the probability ratio r = π_new/π_old to stay within [1-ε, 1+ε] (typically ε=0.2). This prevents destructively large policy updates — a key problem in earlier RL methods like TRPO. Result: stable training without a trust-region constraint." },
  ],

  weeklyTasks: [
    { week: 1, phase: 0, tasks: [
      { id: "w1t1", text: "Rerun Yahoo Finance stock project, add log returns", day: "Mon" },
      { id: "w1t2", text: "Implement portfolio variance formula from scratch (NumPy)", day: "Wed" },
      { id: "w1t3", text: "Plot Nifty 50 return distribution vs normal curve", day: "Thu" },
      { id: "w1t4", text: "Add README to all 4 GitHub projects", day: "Fri" },
      { id: "w1t5", text: "Saturday Project: Nifty-Portfolio-Analytics → GitHub", day: "Sat" },
      { id: "w1t6", text: "Sunday: Anki setup + load Phase 1 flashcards", day: "Sun" },
    ]},
    { week: 2, phase: 1, tasks: [
      { id: "w2t1", text: "Study: Fat tails vs normal distribution in finance", day: "Mon" },
      { id: "w2t2", text: "Study: Log-normal distribution (why stock prices use it)", day: "Tue" },
      { id: "w2t3", text: "Code: Plot Nifty returns with skewness & kurtosis (scipy.stats)", day: "Wed" },
      { id: "w2t4", text: "Study: Basic VaR intuition (parametric & historical)", day: "Thu" },
      { id: "w2t5", text: "Code: Compute 95% historical VaR for a stock", day: "Fri" },
      { id: "w2t6", text: "Saturday Project: Return distribution analysis notebook", day: "Sat" },
    ]},
    { week: 3, phase: 1, tasks: [
      { id: "w3t1", text: "Study: GBM formula dS = μS dt + σS dW (derivation)", day: "Mon" },
      { id: "w3t2", text: "Study: Wiener process / Brownian motion intuition", day: "Tue" },
      { id: "w3t3", text: "Code: GBM stock path simulator in Python (single path)", day: "Wed" },
      { id: "w3t4", text: "Code: 1000-path Monte Carlo simulation for Nifty", day: "Thu" },
      { id: "w3t5", text: "Code: Monte Carlo option pricing (European call)", day: "Fri" },
      { id: "w3t6", text: "Saturday Project: GBM-Monte-Carlo-Simulator → GitHub", day: "Sat" },
    ]},
    { week: 4, phase: 1, tasks: [
      { id: "w4t1", text: "Study: Markowitz Mean-Variance framework", day: "Mon" },
      { id: "w4t2", text: "Code: wᵀΣw portfolio variance from scratch", day: "Tue" },
      { id: "w4t3", text: "Code: PyPortfolioOpt efficient frontier plot (5 Nifty stocks)", day: "Wed" },
      { id: "w4t4", text: "Code: Max Sharpe portfolio weights", day: "Thu" },
      { id: "w4t5", text: "REVISION: GBM + Portfolio theory — redo from memory", day: "Fri" },
      { id: "w4t6", text: "Saturday Project: Portfolio Risk Dashboard → GitHub", day: "Sat" },
    ]},
  ],

};

// localStorage keys are now managed in js/db.js
