import { loadInputTxt, loadOutputJson } from '../../test/test-utils';
import { lang as pythonLang } from './python';
import { createLang } from '.';

describe('lang/python', () => {
  it('parses tree', () => {
    const input = loadInputTxt('setup.py');
    const lang = createLang(pythonLang);

    const res = lang.parse(input).node;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const expected = loadOutputJson('setup.py', res);
    expect(res).toEqual(expected);
  });
});