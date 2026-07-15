# Prompt Log

## Entry 1 - Agent Plan

### What tools does the agent need, and what does each return?

The research agent needs at least three tools:

1. `search(query)`
   - Purpose: find relevant sources for a research question or sub-topic.
   - Input: a search query string.
   - Returns: a list of search results, where each result includes a title, URL, and short snippet.

2. `fetch(url)`
   - Purpose: retrieve source content from a specific URL.
   - Input: a URL string.
   - Returns: extracted page text, page title, final URL, and an error field if the request fails.

3. `write_report(filename, content)`
   - Purpose: save the final report to disk.
   - Input: a markdown filename and markdown content.
   - Returns: the saved file path, normally inside the `reports/` directory.

At least one tool should be wired through an MCP server. I plan to use a filesystem MCP server for report writing because it has a clear boundary: the agent can write final markdown files into `reports/` without directly mixing file system logic into the agent loop.

### What is the agent's termination condition?

The agent is done when it has enough reliable information to produce the required report structure:

- a short summary
- key findings grouped by sub-topic
- a numbered source list with URLs

The agent should stop when it has fetched and reviewed enough useful sources for each sub-topic, usually at least two useful sources per major sub-topic or at least five useful sources total. It should also stop if additional searches are repeating the same sources or if it has reached a maximum number of tool rounds.

My planned hard limits:

- maximum 4 planning/search/fetch rounds
- maximum 8 fetched URLs
- maximum 1 final call to `write_report`

The agent should not keep searching forever. If it has partial but useful information, it should write a report that clearly states any limitations.

### Three most likely failure modes

1. Irrelevant or low-quality search results
   - The search tool may return SEO pages, outdated pages, or sources that do not answer the question directly.
   - Mitigation: make the agent compare snippets, prefer primary or reputable sources, and reformulate queries when results are weak.

2. Fetch failures, timeouts, redirects, or 403 responses
   - Some URLs may block automated fetching or return incomplete content.
   - Mitigation: the `fetch(url)` tool should return an error field instead of crashing, and the agent should try another source.

3. Context overload before synthesis
   - Long pages can fill the model context before the agent has enough room to reason.
   - Mitigation: fetch should extract concise text, and the agent should summarize each source before fetching more.

Other possible failures:

- duplicate sources appearing in several searches
- old sources that conflict with newer information
- the report being saved outside `reports/`
- the model hallucinating a URL that was never fetched

## Entry 2 - AI Stress-Test Prompt

```text
Act as a senior AI engineering reviewer.

I am designing a terminal-based AI research agent.
The user asks a research question.
The agent plans sub-topics, calls search(query), fetch(url), and write_report(filename, content), then saves a markdown report.

At least one tool will be wired through MCP. I plan to use filesystem MCP for writing reports.

Termination condition:
- enough information for summary, key findings by sub-topic, and numbered source list
- at least five useful sources total or two useful sources per major sub-topic
- stop after four tool rounds or eight fetched URLs

What edge cases am I missing?
What will break first?
What should I change before implementation?
```

## Entry 3 - AI Stress-Test Response Summary

The AI reviewer said the first thing likely to break is source quality. Search results may look relevant but fail to answer the actual question, so the agent needs a way to reject weak sources and search again with a narrower query.

It also warned that `fetch(url)` should never throw unhandled exceptions into the loop. Instead, failed requests should return structured errors so the agent can continue with another source.

The reviewer recommended deduplicating URLs before fetching, storing short source notes after each fetch, and forcing the final report to cite only URLs that were actually fetched.

## Entry 4 - Plan Changes After Stress Test

I will add URL deduplication before fetch calls.

I will make every tool return structured data with either a `success` value or an `error` value.

I will require the final report to use only fetched URLs in the numbered source list.

I will keep the agent loop bounded by tool-round and fetched-URL limits so the system terminates even when the research question is broad.
