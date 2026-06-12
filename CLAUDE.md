## Project Overview

    A theme generator

## General

- Use clean code principles
- Check for code smells and then fix them
- Use a TDD approach

## Clean Code Principles

- Names should reveal intent: prefer `getActiveTheme()` over `getData()`; avoid abbreviations and noise words (`data`, `info`, `tmp`)
- Functions should do one thing, do it well, and do it only — extract when a function mixes levels of abstraction
- Keep functions small; prefer fewer arguments (0-2 ideal, 3 is a smell, more needs a parameter object)
- Avoid side effects hidden behind innocent-looking function names
- Prefer pure functions where possible — easier to test, reason about, and reuse
- Don't repeat yourself (DRY), but don't abstract prematurely — three similar lines beat a wrong abstraction
- Comments should explain *why*, not *what*; well-named code shouldn't need comments to explain what it does
- Keep the code at a consistent level of abstraction within a function (Step-down rule)
- Prefer composition over inheritance; favor small, focused interfaces/types
- Fail fast: validate inputs at boundaries, throw/return early rather than nesting deeply
- Avoid magic numbers/strings — name them as constants

## Code Smells to Watch For

- Long functions/components, large files, deep nesting
- Duplicated logic across components or hooks
- Shotgun surgery (one change requires edits in many unrelated places)
- Feature envy (a function more interested in another module's data than its own)
- Primitive obsession (passing around raw strings/numbers instead of meaningful types)
- Boolean flags/parameters that change a function's behavior — split into separate functions instead
- God objects/components that know and do too much
- Inconsistent naming or mixed abstraction levels in the same file

## TDD Approach

- Follow Red -> Green -> Refactor: write a failing test first, make it pass with the simplest code, then refactor with tests as a safety net
- Write tests that describe behavior, not implementation details — they should survive refactors
- One assertion/concept per test; test names should read like specifications (e.g. "applies dark theme when system preference is dark")
- Cover edge cases and error paths, not just the happy path
- Keep tests fast, isolated, and deterministic — avoid shared mutable state between tests
- Refactor both production code and test code; tests are first-class citizens of the codebase

## General Software Crafting Techniques

- Make the smallest change that solves the problem; avoid speculative generality (YAGNI)
- Leave the code a little better than you found it (Boy Scout Rule), but keep unrelated cleanup out of feature/bugfix commits
- Prefer explicit over clever — readability beats brevity
- Keep commits small, focused, and well-described; each commit should represent one logical change
- Separate concerns: keep UI, state/business logic, and data-fetching layers distinct and independently testable
- Handle errors explicitly and close to where they occur; don't swallow exceptions silently
- Continuously question whether existing abstractions still fit as the codebase grows, and refactor when they don't
