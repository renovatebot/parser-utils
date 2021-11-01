# Renovate parser utils

Code parsing library filling the gap between ad-hoc regular expressions and parsers generated with complete grammar description.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/renovatebot/parser-utils/blob/main/LICENSE)
[![Trunk](https://github.com/renovatebot/parser-utils/actions/workflows/trunk.yml/badge.svg)](https://github.com/renovatebot/parser-utils/actions/workflows/trunk.yml)

## Motivation

We are creating Renovate as a multi-language tool for keeping dependency versions up to date.
While most package managers can rely on the programming language they're written in, we need some uniform way to deal with the variety of dependency description conventions using only TypeScript.

Some package managers use the relatively simple JSON format, like Node.js for example.
Other tools, mostly related to DevOps, use the more elaborate YAML format.
The trickiest thing is to deal with dependencies described by particular programming languages: for example, Gemfiles and Podfiles are written in Ruby, `build.gradle` files use Groovy, `sbt` leverages Scala, while `bazel` created its own language Starlark.

One approach is to use regular expressions, which is very easy but doesn't scale well to cover all syntactic variations.
For example, we want to treat string literals `'foobar'`, `"foobar"` and `"""foobar"""` as equivalent.

Another approach could be that we describe languages with tools like [PEG.js](https://github.com/pegjs/pegjs) or [nearley.js](https://github.com/kach/nearley).
Although these are great tools, this approach has downsides for our use-case:

- We have to define and test the complete grammar for each language, even if we're interested mostly in string literals, variable definitions and their scopes
- Even small source errors lead to rejecting the whole file, while we want to skip the fragments that are misunderstood by the parser
- We still would need to deal with a variety of language-specific AST tree formats, which may or may not have things in common.

The `parser-utils` library is an attempt to fill the gap between the approaches mentioned above.
We leverage the [moo](https://github.com/no-context/moo) library to produce tokens, which we group into the tree available for your queries.
The query API is inspired by [parsimmon](https://github.com/jneen/parsimmon), though it operates on the token level instead of the raw character sequence.

### Goals

- _Be good enough for source code written well enough._
- Go much further than is possible with regular expressions.
- Respect location info. Once something interesting is found, it can be located in the source test via offset info. Once something is written, it should not affect the whole document formatting.
- Incorporate poorly recognized fragments into the output and continue parsing.
- Expressive API which helps you focus on syntactic structure, not the space or quote variations.
- Allow to define a language of interest quickly. Provide definitions for popular languages out-of-the-box.

### Non-goals

- Catch all syntactic edge-cases
- Compete with parsing tools with strict grammar definitions

## Install

```sh
npm install @renovatebot/parser-utils
```

or

```sh
yarn add @renovatebot/parser-utils
```

## Details

The library is divided to several abstraction levels following from the lowest to the highest one:

### [`lib/lexer`](https://github.com/renovatebot/parser-utils/tree/main/lib/lexer)

Configures [moo](https://github.com/no-context/moo) tokenizer for specific language features such as:

- Brackets: `()`, `{}`, `[]`, etc
- Strings: `'foo'`, `"bar"`, `"""baz"""`, etc
- Templates: `${foo}`, `{{bar}}`, `$(baz)`, etc
- Single-line comments: `#...`, `//...`, etc
- Multi-line comments: `/*...*/`, `(*...*)`, etc
- Identifiers: `foo`, `Bar`, `_baz123`, etc
- Line joins: if the line ends with `\`, the next one will be treated as its continuation

You can refer to `LexerConfig` interface for more details. Also check out [usage example for Python](https://github.com/renovatebot/parser-utils/blob/main/lib/lang/python.ts).

### [`lib/parser`](https://github.com/renovatebot/parser-utils/tree/main/lib/tree)

This layer responsible for transforming token sequence to the nested tree with the tokens as leafs.

## Contributing

Add link to CONTRIBUTING.md file that will explain how to get started developing for this package.
This can be done once things stabilize enough for us to accept external contributions.
