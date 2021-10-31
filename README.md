# Renovate parser utils

Code parsing library filling the gap between ad-hoc regular expressions and parsers generated with complete grammar description.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/renovatebot/parser-utils/blob/main/LICENSE)
[![Trunk](https://github.com/renovatebot/parser-utils/actions/workflows/trunk.yml/badge.svg)](https://github.com/renovatebot/parser-utils/actions/workflows/trunk.yml)

## Motivation

We are creating Renovate as a multi-language tool for keeping dependency versions up to date.
While particular package managers are usually making use of their programming language, we needed some uniform way to deal with the variety of dependency description conventions.

Some package managers use the relatively simple JSON format, like Node.js for example.
Others tools, mostly related to CI/CD world, stick to more elaborate YAML.
But the hardest part is to deal with dependencies described in particular programming languages: for example, Gemfile and Podfile are written in Ruby, `build.gradle` uses Groovy, `sbt` leverages Scala, while `bazel` have created its own language Starlark.

One approach is to use regular expressions, which is very easy but doesn't scale well to cover all syntactic variations.
For example, we want to treat string literals `'foobar'`, `"foobar"` and `"""foobar"""` as equivalent.

With another approach, we may describe languages with tools like [PEG.js](https://github.com/pegjs/pegjs) or [nearley.js](https://github.com/kach/nearley).
Although these are great tools, the approach itself has downsides for our use-case:

- We have to define and test complete grammars for each language, even if we're interested mostly in string literals, variable definitions and their scopes.
- Even small source errors will lead to rejecting the whole file, while we want to just skip the fragments being misunderstood by parser.
- We still would need to deal with variety of language-specific AST tree formats, which may or may not share some common specifics.

This library is an attempt to fill the gap between these two approaches.
It leverages [moo](https://github.com/no-context/moo) tokenizer library, organizes tokens into trees and helps to query them.
The query API is inspired by [parsimmon](https://github.com/jneen/parsimmon), though it operates on parsed tokens instead of raw source code.

## Goals

- _Be good enough for source code written well enough._
- Go much further than it's possible with regular expressions.
- Respect location info. Once something interesting is found, it can be located in source test via offset info. Once something is written, it should not affect whole document formatting.
- Incorporate poorly recognized fragments into the output and just continue parsing.
- Expressive API helping to focus on syntactic structure, not the space or quote styles. When details are necessary, there is a way to specify them too.
- Allow to define a language of interest quickly. Provide definitions for popular languages out of the box.

## Non-goals

- Catch all syntactic edge-cases
- Compete with parsing tools with strict grammar definitions

## Installation

Explain here how to install the package/library.

## Configuration

Explain here how to configure the package/libary.

## Usage

Explain here how to use the package/library.

## Contributing

Add link to CONTRIBUTING.md file that will explain how to get started developing for this package.
This can be done once things stabilize enough for us to accept external contributions.
