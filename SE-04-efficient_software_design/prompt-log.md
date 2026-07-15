# Prompt Log

## Entry 1 - Initial Design

I chose Python for this project because abstract base classes, dataclasses, and unittest support make the design clear without extra tooling.

Initial class model:

- `RateLimiter`: base class/interface with `allow_request(client_id, timestamp)`.
- `FixedWindowRateLimiter`: concrete strategy that extends `RateLimiter`.
- `Client`: stores a client identity and request history.
- `Gateway`: receives a `RateLimiter` through the constructor and delegates request decisions to it.
- `RateLimiterFactory`: builds a limiter strategy from a config object.

The main design patterns are Strategy and Factory. Strategy appears because `Gateway` depends on a `RateLimiter` abstraction, not a specific algorithm. Factory appears because the code can create the correct limiter from configuration without spreading construction logic across the system.

## Entry 2 - AI Pressure Test Prompt

```text
Act as a senior software design reviewer.

I am designing a rate limiter system in Python.

Classes:
- RateLimiter base class with allow_request(client_id, timestamp)
- FixedWindowRateLimiter extends RateLimiter
- Client stores identity and request history
- Gateway accepts a RateLimiter in its constructor and calls it to decide whether a request is allowed
- RateLimiterFactory creates the correct RateLimiter from a config object

Patterns:
- Strategy: Gateway can use any RateLimiter implementation
- Factory: RateLimiterFactory builds the limiter from config

Please pressure-test this design.
Does it violate SOLID principles?
What happens to Gateway if I add Sliding Window or Token Bucket next month?
Where should request history live?
What edge cases should tests cover?
```

## Entry 3 - AI Feedback Summary

The AI said the design mostly follows SOLID because `Gateway` depends on the `RateLimiter` abstraction instead of a concrete limiter. It also said `Gateway` should not change when a new strategy is added, as long as the new strategy implements the same `allow_request` method. That supports the open/closed principle.

The main warning was about request history. If every limiter stores history differently, the `Client` class should not become responsible for algorithm-specific state. The cleaner design is for `Client` to store identity and general request history, while each limiter owns the data structures needed for its algorithm.

The AI also recommended edge-case tests for the exact window boundary, request bursts, unknown clients, factory config errors, and swapping limiter strategies at runtime.

## Entry 4 - Design Iteration

I kept `Gateway` small and dependency-injected. It only knows that a limiter has an `allow_request` method.

I kept `Client` focused on identity and request history, not policy decisions.

I kept algorithm-specific counters or timestamp queues inside each strategy so new limiters can be added without changing `Gateway`.

I added `RateLimiterFactory` to the diagram because construction should be separate from request handling.
