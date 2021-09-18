import { loadInputTxt, loadOutputJson } from '../../test/test-utils';
import { StringValueToken } from '../lexer/types';
import * as q from '../query/builder';
import { lang as pythonLang } from './python';
import { createLang } from '.';

const lang = createLang(pythonLang);

describe('lang/python', () => {
  it('does not confuse operator and number literal', () => {
    const value = '.42';
    const res = lang.parse(value).children;
    expect(res).toMatchObject([
      { type: '_start' },
      { type: 'number', value },
      { type: '_end' },
    ]);
  });

  test.each`
    name
    ${'blocks-01.py'}
    ${'blocks-02.py'}
    ${'blocks-03.py'}
    ${'blocks-04.py'}
    ${'setup.py'}
  `('$name', ({ name }) => {
    const input = loadInputTxt(name);

    const res = lang.parse(input).node;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const expected = loadOutputJson(name, res);
    expect(res).toEqual(expected);
  });

  it('supports line joins', () => {
    const input = loadInputTxt('line-join');

    const res = lang.parse(input)?.node;

    expect(res).toMatchObject({
      children: [
        { type: '_start' },
        { type: 'symbol', value: 'foo', offset: 0, line: 1, col: 1 },
        { type: 'whitespace', lineBreaks: 1 },
        { type: 'symbol', value: 'bar', offset: 5, line: 2, col: 1 },
        { type: '_end' },
      ],
    });
  });
});
