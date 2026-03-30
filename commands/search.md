---
name: blueprint:search
description: >
  Search ADRs by topic, technology, or keyword. Use when: "why did we choose X?", "is there an
  adr about X?", "what did we decide about X?", "search adrs for X", "find decision about auth".
  Searches titles, context, decision sections, and the relationship graph.
---

# Search ADRs

Find ADRs relevant to a topic by searching content and the relationship graph.

## Process

1. Read `state.toml` for ADR directory location
2. Read `relationships.toml` for the ADR dependency graph
3. Parse the search term from the user's query
4. **Search ADR files:**
   - Grep for the term in ADR filenames (title match)
   - Grep for the term within ADR file content (context, decision, consequences sections)
   - Rank by relevance: title match > decision section > context > consequences
5. **Search relationship graph:**
   - Check if the term matches any node labels or edge descriptions in `relationships.toml`
   - Include related ADRs (DEPENDS_ON, CONFLICTS, SUPERSEDES) in results
6. **Present results:**
   - Show matching ADRs with status, title, and the matching snippet (1-2 lines of context)
   - If relationship graph has relevant edges, show them: "ADR-0003 DEPENDS ON ADR-0002"
   - If no matches: "No ADRs found for '[term]'. Run `/blueprint:new \"[term]\"` to create one."
