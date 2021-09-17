import { createLang } from '../../lang';
import { lang as pythonLang } from '../../lang/python';
import type { Token } from '../../lexer/types';
import * as q from '../builder';
import type { Checkpoint } from '../types';

const lang = createLang(pythonLang);

type Ctx = string[];

function startCheckpoint(input: string): Checkpoint<Ctx> {
  const cursor = lang.parse(input).down as never;
  return { cursor, context: [] };
}

const handler = (ctx: Ctx, token: Token) => [...ctx, token.value];

describe('query/matchers/seq-matcher', () => {
  describe('Sequential matching', () => {
    it('handles exact sequence match', () => {
      const input = 'foo.bar';
      const checkpoint = startCheckpoint(input);
      const seqMatcher = q.sym(handler).op(handler).sym(handler).build();

      const { context } = seqMatcher.match(checkpoint) ?? {};

      expect(context).toEqual(['foo', '.', 'bar']);
    });

    it('skips spaces', () => {
      const input = 'foo .\tbar\n.   baz';
      const checkpoint = startCheckpoint(input);
      const seqMatcher = q
        .sym(handler)
        .op(handler)
        .sym(handler)
        .op(handler)
        .sym(handler)
        .build();

      const { context } = seqMatcher.match(checkpoint) ?? {};

      expect(context).toEqual(['foo', '.', 'bar', '.', 'baz']);
    });

    it('falsy if query is longer than input', () => {
      const input = 'foo.bar';
      const checkpoint = startCheckpoint(input);
      const seqMatcher = q
        .sym(handler)
        .op(handler)
        .sym(handler)
        .op(handler)
        .sym(handler)
        .build();

      const res = seqMatcher.match(checkpoint);

      expect(res).toBeFalsy();
    });

    it('traverses correctly', () => {
      const input = 'foo; bar; baz;';
      const checkpoint = startCheckpoint(input);
      const seqMatcher = q.sym(handler).op(';').build();

      const res1 = seqMatcher.match(checkpoint);
      expect(res1).toBeTruthy();

      const res2 = seqMatcher.match(res1 as never);
      expect(res2).toBeTruthy();

      const res3 = seqMatcher.match(res2 as never);
      expect(res3).toBeTruthy();
      expect(res3?.context).toEqual(['foo', 'bar', 'baz']);

      const res4 = seqMatcher.match(res3 as never);
      expect(res4).toBeFalsy();
    });
  });
});
