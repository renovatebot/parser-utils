import { createLang } from '../lang';
import { createCursor } from '.';

const lang = createLang('python');

describe('parser/tree', () => {
  describe('Playground', () => {
    let cursor = createCursor({
      type: 'root-tree',
      children: [],
    });
    cursor = cursor.appendChild({
      type: '_start',
      col: 1,
      line: 1,
      offset: 0,
      value: '',
    });
    debugger;
  });
  it('works', () => {
    const res = lang.parse('').node;
    expect(res).toEqual({
      type: 'root-tree',
      children: [
        { type: '_start', col: 1, line: 1, offset: 0, value: '' },
        { type: '_end', col: 1, line: 1, offset: 0, value: '' },
      ],
    });
  });
});
