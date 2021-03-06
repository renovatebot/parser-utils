import type { Location as ZipperLocation } from '@thi.ng/zipper';
import type {
  BracketLeftToken,
  BracketRightToken,
  StringEndToken,
  StringStartToken,
  TemplateEndToken,
  TemplateStartToken,
  Token,
} from '../lexer/types';

export interface TreeBase {
  children: Node[];
}

export interface RootTree extends TreeBase {
  type: 'root-tree';
}

export interface WrappedTree extends TreeBase {
  type: 'wrapped-tree';
  startsWith: BracketLeftToken;
  endsWith: BracketRightToken;
}

export interface StringTree extends TreeBase {
  type: 'string-tree';
  startsWith: StringStartToken;
  endsWith: StringEndToken;
}

export interface TemplateTree extends TreeBase {
  type: 'template-tree';
  startsWith: TemplateStartToken;
  endsWith: TemplateEndToken;
}

export interface BlockTree extends TreeBase {
  type: 'block-tree';
}

export type TreeType =
  | 'root-tree'
  | 'wrapped-tree'
  | 'string-tree'
  | 'template-tree'
  | 'block-tree';

export type Tree =
  | RootTree
  | WrappedTree
  | StringTree
  | TemplateTree
  | BlockTree;

export type Node = Tree | Token;

export type Cursor = ZipperLocation<Node>;

export interface ParserConfig {
  useIndentBlocks: boolean;
}
