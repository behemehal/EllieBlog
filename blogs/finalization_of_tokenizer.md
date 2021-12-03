---
publisher: @ahmtcn123
title: Finalization of tokenizer
updated_at: false
updated_by: false
description: Tokenizer build finally complete
date: 4.12.2021-00.56
---
## Finalization of tokenizer

Tokenizer elements and types are now complete. We're seeing massive improvements in our benchmars like we promissed (#55)

Here is the benchmark results between v3.7.3 and tokenizer beta build:
```sh
Benchmark #1: .\ellie_tokenizer.exe .\test.ei
  Time (mean ± σ):      23.0 ms ±   1.1 ms    [User: 1.4 ms, System: 2.9 ms]
  Range (min … max):    21.8 ms …  27.9 ms    105 runs

Benchmark #2: .\ellie_parser.exe .\test.ei
  Time (mean ± σ):     235.3 ms ±   8.1 ms    [User: 0.0 ms, System: 2.1 ms]
  Range (min … max):   221.9 ms … 247.6 ms    12 runs
```

## Syntax and API changes:

### Constructor Syntax;
Class constructors (co)'s syntax changed for the last time.

Old syntax

```ellie
class Test {
    co Test(param1, param2) {
        //A code
     };
}
class Test {
    co Test(param1, param2);
}
```

New syntax

```ellie
class Test {
    co(param1, param2) {
        //A code
     };
}
class Test {
    co(param1, param2);
}
```

### API Change in `Future`;

Future type is now non-std item. Instead of restricting access to std items we decided to give support for platforms whom supports it.  As for results future.ei and thread.ei removed from std [8b0b6ba2adb727c84d20bbda9fdf906ee4894a0b](https://github.com/behemehal/Ellie-Language/commit/8b0b6ba2adb727c84d20bbda9fdf906ee4894a0b)

Thanks for support, we're curious about your opinion about these updates please let us know
