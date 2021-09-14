import { createLexer } from '../lexer';
import type { Lexer } from '../lexer/types';
import { createCursor, createTree } from '../parser';
import type { Cursor } from '../parser/types';
import { QueryBuilder } from '../query/types';
import { lang as python } from './python';
import type { LanguageConfig } from './types';

export class Language {
  private lexer: Lexer;

  constructor(readonly config: LanguageConfig) {
    this.lexer = createLexer(config.lexer);
  }

  parse(input: string): Cursor {
    this.lexer.reset(input);
    const root = createTree(this.lexer, this.config.parser);
    return createCursor(root);
  }

  query<Ctx>(
    input: string | Cursor,
    q: QueryBuilder<Ctx>,
    context: Ctx
  ): Ctx | undefined {
    const matcher = q.build();
    const cursor = typeof input === 'string' ? this.parse(input) : input;
    const checkpoint = matcher.match({ cursor, context });
    return checkpoint?.context;
  }
}

type LanguagePreset = 'python';

const languagePresets: Record<LanguagePreset, LanguageConfig> = { python };

export function createLang(key: LanguagePreset): Language;
export function createLang(config: LanguageConfig): Language;
export function createLang(arg1: LanguagePreset | LanguageConfig): Language {
  const config = typeof arg1 === 'string' ? languagePresets[arg1] : arg1;
  return new Language(config);
}
