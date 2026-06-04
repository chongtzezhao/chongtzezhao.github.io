---
title: "65% of My Backtest's Fills Never Happened"
description: "A market-making backtest looked bad. The strategy was not the first thing I distrusted; the fill model was."
date: 2026-06-05
tags: [microstructure, backtesting, validation]
math: false
draft: false
---

The first version of the strategy looked dead.

I was testing an Avellaneda-Stoikov style market-making model on a perpetuals order book. Nothing exotic: quote around a reservation price, manage inventory, let the spread pay for adverse selection and noise. The first backtest came back with a Sharpe around **-3.5**.

That is usually a clean answer. Bad strategy. Move on.

But the result depended on one assumption I did not trust yet: how the simulator decided that my order had filled.

Backtests tend to make the strategy feel like the thing under examination. You look at parameters, inventory skew, spread, volatility, risk aversion, and so on. But in market-making, the most important line in the whole system can be much lower-level:

> When does the simulator say I got filled?

If that line is wrong, the rest of the backtest is built on sand.

## A touch is not a trade

The first fill model was touch-based. If my bid or ask was touched by the market, the backtest counted the order as filled.

That sounds reasonable until you stare at an order book for a while.

A price touch is not the same thing as a trade. The best bid or ask can move to your level for a moment and vanish. A quote update can make it look as if your order was reachable without any execution actually happening. Queue position matters. Cancellations matter. The order book can churn around your quote while no aggressive order ever consumes you.

For many strategies, a slightly optimistic fill model is bad. For market-making, it is existential. Your entire P&L is made out of fills. If the simulator hallucinates fills, it is not adding noise around the result. It is changing the object being measured.

The venue I was studying did not expose a clean public trade stream, so I could not simply compare simulated fills against an official tape. But it did expose enough order-book updates to ask a different question:

> Can I infer likely trades from changes in the book, and use that as a stricter fill model?

So I built a parallel fill model from order-book deltas. Instead of assuming that every touch was an execution, I inferred trade-like events from the way liquidity disappeared from the book, then ran the identical strategy through both fill models.

Same data. Same strategy. Different definition of a fill.

## The result got stranger

The Sharpe went from about **-3.5** to about **+28.1**.

That is not a victory lap. A Sharpe that high is itself a warning label.

The important result was not "+28.1 Sharpe." I did not read that as evidence of a money printer. I read it as evidence that the first backtest and the second backtest were measuring different worlds.

The gap was the finding.

Under the touch-based model, roughly **65% of the fills were phantom**: fills that appeared in the simulator but were not supported by the stricter trade-inference model. The first result had not proved that the strategy was bad. It had proved that the simulator's fill assumption was dominating the experiment.

That is a deeply uncomfortable place to be, but it is also useful. If changing one low-level execution assumption can flip the entire conclusion, then I do not yet have a strategy verdict. I have a measurement problem.

## Why phantom fills are so dangerous

A phantom fill is not just an extra row in a trade log.

It changes inventory. It changes realized spread. It changes future quotes. It changes risk. It changes the apparent relationship between market state and execution. Once a fake fill enters a market-making simulation, the strategy starts reacting to a position it would not have had in reality.

That means the error compounds.

Suppose the market briefly touches my bid and moves away. A touch-based model may say I bought. The strategy now thinks it is long, so it adjusts future quotes to manage that inventory. In reality, I may still be flat. The simulated strategy and the real strategy have already diverged.

This is one reason market-making backtests can feel so treacherous. The backtest is not merely estimating whether your quotes are good. It is also simulating a private execution history, and that private history changes the future behavior of the strategy.

If the private history is fake, the rest of the path is fake too.

## The redesign was less glamorous, and better

After seeing the fill gap, I changed the design.

The original version updated quotes aggressively. That made the strategy more exposed to transient touches: lots of short-lived quotes, lots of book churn, lots of opportunities for the simulator to count a touch as a fill.

I moved toward a more static quote design. The goal was not to maximize simulated activity. The goal was to reduce the surface area where the fill model could lie.

Fills dropped by about **96%**.

The backtest still looked positive, with Sharpe around **+7.46**, which I would also treat with caution. But the important improvement was not the headline number. It was that the result depended less on a fragile fill interpretation. Fewer fills meant fewer opportunities for phantom execution to dominate the conclusion.

That is not as exciting as optimizing a strategy until the curve looks smooth. It is much closer to what I actually want from research: make the measurement less fake before asking whether the idea works.

## The lesson I kept

I used to think of fill modeling as an implementation detail.

I now think of it as one of the first things to attack.

Before I ask whether a strategy has edge, I want to know:

- What does the backtest count as a fill?
- Does a touch imply execution, or only reachability?
- Is queue position modeled?
- Are fills supported by trades, book deltas, or just price levels?
- How much of the result survives a stricter fill model?
- Does the strategy create quote churn that the simulator mistakes for execution?

These questions are not cleanup. They are the experiment.

A backtest is full of places to fool yourself: leakage, transaction costs, bad data, overfit parameters. But for a market-making strategy, the fill model is the highest-leverage lie surface I have found. If it is wrong, P&L is downstream of fiction.

So my default order of suspicion changed:

1. Distrust the fill.
2. Then distrust the cost model.
3. Then distrust the data.
4. Then maybe start forming an opinion about the strategy.

The strategy is the tempting thing to debate. The apparatus is the thing that decides whether the debate means anything.

In this case, the backtest did not teach me that the first strategy was bad, or that the second one was good. It taught me something more useful:

**Before trusting a market-making backtest, interrogate how it decides that you traded at all.**
