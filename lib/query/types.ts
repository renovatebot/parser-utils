import type { NumberToken, OperatorToken, SymbolToken } from '../lexer/types';
import type { Cursor, Tree, TreeType } from '../parser/types';

export interface Checkpoint<Ctx> {
  cursor: Cursor;
  context: Ctx;
  endOfLevel?: true;
}

export type SymMatcherValue = string | RegExp | null;
export type SymMatcherHandler<Ctx> = (ctx: Ctx, token: SymbolToken) => Ctx;
export interface SymMatcherOptions<Ctx> {
  value: SymMatcherValue;
  handler: SymMatcherHandler<Ctx> | null;
}

export type OpMatcherValue = string | RegExp | null;
export type OpMatcherHandler<Ctx> = (ctx: Ctx, token: OperatorToken) => Ctx;
export interface OpMatcherOptions<Ctx> {
  value: OpMatcherValue;
  handler: OpMatcherHandler<Ctx> | null;
}

export type NumMatcherValue = string | RegExp | null;
export type NumMatcherHandler<Ctx> = (ctx: Ctx, token: NumberToken) => Ctx;
export interface NumMatcherOptions<Ctx> {
  value: NumMatcherValue;
  handler: NumMatcherHandler<Ctx> | null;
}

export interface SeqMatcherOptions<Ctx> {
  matchers: Matcher<Ctx>[];
}

export type TreeNodeMatcherType = TreeType | null;
export type TreeNodeMatcherHandler<Ctx, T = Tree> = (ctx: Ctx, tree: T) => Ctx;
export interface TreeNodeMatcherOptions<Ctx, T = Tree> {
  type: TreeNodeMatcherType;
  preHandler: TreeNodeMatcherHandler<Ctx, T> | null;
}

export interface TreeNodeWalkingMatcherOptions<Ctx, T = Tree>
  extends TreeNodeMatcherOptions<Ctx, T> {
  matcher: Matcher<Ctx>;
  postHandler: TreeNodeMatcherHandler<Ctx, T> | null;
}

export interface Matcher<Ctx> {
  match(checkpoint: Checkpoint<Ctx>): Checkpoint<Ctx> | null;
  nextMatch(): Checkpoint<Ctx> | null;
}

export interface ManyMatcherOptions<Ctx> {
  matcher: Matcher<Ctx>;
  min: number;
  max: number | null;
}

export interface AltMatcherOptions<Ctx> {
  matchers: Matcher<Ctx>[];
}
