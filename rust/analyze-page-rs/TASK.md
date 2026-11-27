# Port `analyzePage` to Rust

`analyzePage` (`lib/analyze.ts:2`) took 67% of `node --import tsx bench/bench.mjs`. Port it, and only it, in `src/port.rs` of this crate (/home/hatch/workspace/ship-or-die-100k/teardown-generator/rust/analyze-page-rs). The bindings, the recorded cases and `rust-anything.json` are generated: leave them as they are.

## Rules

- Match the original exactly on every recorded case in `cases.jsonl`: values, errors and their messages, edge cases (empty input, Unicode, large numbers). Read the original first; port its behavior, not a cleaner idea of it.
- No `unwrap`, `expect` or `panic!` outside tests; no `unsafe` without a `// SAFETY:` comment.
- Keep helpers private; only the unit's functions are `pub`.
- Never hard-code recorded outputs or weaken tests; gate checks both.

## Loop

```sh
rust-anything build .
rust-anything diff .     # every recorded case must match
rust-anything gate .     # fmt, clippy, tests, unsafe, API, diff
```

Done when `diff` matches every case and `gate` passes. Do not switch the port on; `rust-anything go` does that once both pass.
