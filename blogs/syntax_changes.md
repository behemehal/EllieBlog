---
publisher: @ahmtcn123
title: Updates 13.11.2021
description: We have some updates about syntax changes
date: 02.12.2021-00:19
---
# Updates 13.11.2021

## Syntax Changes

As we told in #55, we will rebuild parser and add tokenizer phase before that. We're expecting a performance incrementation at least %22.

### Pending syntax changes

As a goal of building ellie, we made most of the elements easy to type and easy to read. So from now on growableArray type will change to vector. Containing array word made the type complicated. Also some of the definer syntaxes are changed too.

| TypeName                 | Old                               |     New                   |  Example          |
|--------------------------|-----------------------------------|---------------------------|-------------------|
| Array                    | array(type, size)                 | [type, size]              | [int, 3]          |
| Vector                   | growableArray(type)               | [type, *]                 | [int, *]          |
| Collective               | collective(key_type, data_type)   | {key_type, data_type}     | {int, int}        |
| Cloak                    | cloak(first_type, second_type)    | (first_type, second_type) | (int, int)        |
| Nullable                 | _type                             | ?type                     | ?int              |
| ArrowFunction            | @(param_name: type)::type         | @(type):type  | @(int):int |


### Old
```ellie
fn test() > string {}
```

### New
```ellie
fn test() : string {}
```