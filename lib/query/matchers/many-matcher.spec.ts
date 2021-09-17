import { createLang } from '../../lang';
import { lang as pythonLang } from '../../lang/python';
import type { Token } from '../../lexer/types';
import * as q from '../builder';
import type { Checkpoint } from '../types';

const lang = createLang(pythonLang);

type Ctx = string[];

function getInitialCheckpoint(input: string): Checkpoint<Ctx> {
  const cursor = lang.parse(input).down as never;
  return { cursor, context: [] };
}

const handler = (ctx: Ctx, token: Token) => [...ctx, token.value];

describe('query/matchers/many-matcher', () => {
  describe('Repetitions matching', () => {
    it('handles many occurrences', () => {
      const input = '+-+';
      const prevCheckpoint = getInitialCheckpoint(input);
      const manyMatcher = q.many(q.op(handler)).build();

      const nextCheckpoint = manyMatcher.match(prevCheckpoint);

      expect(nextCheckpoint).toMatchObject({
        context: ['+', '-', '+'],
      });
    });

    it('handles spaces', () => {
      const input = '\t \n+    -\t\t+\n\n- \t\n+';
      const prevCheckpoint = getInitialCheckpoint(input);
      const manyMatcher = q.many(q.op(handler)).build();

      const nextCheckpoint = manyMatcher.match(prevCheckpoint);

      expect(nextCheckpoint).toMatchObject({
        context: ['+', '-', '+', '-', '+'],
      });
    });

    it('supports backtracking', () => {
      const prevCheckpoint = getInitialCheckpoint('---x');
      const matcher = q.many(q.op('-', handler)).op('-').sym('x').build();

      const nextCheckpoint = matcher.match(prevCheckpoint);

      expect(nextCheckpoint).toMatchObject({
        context: ['-', '-'],
      });
    });
  });
});
