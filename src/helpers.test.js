import { formatUsername, formatAction } from './helpers';

describe('Global Helpers', () => {
  test('format username', () => {
    expect(formatUsername('teste')).toBe('teste');
    expect(formatUsername({ account: '123', branch: '1234' })).toEqual(
      '123 / 1234',
    );
  });

  test('format action', () => {
    expect(
      formatAction({
        flowType: { name: 'Banco do Brasil' },
        username: { account: '123', branch: '1234' },
        account: { name: 'Conta Corrente BB' },
        budget: { name: 'Meu Budget' },
      }),
    ).toEqual(
      'Banco do Brasil 123 / 1234 => YNAB Conta Corrente BB (Meu Budget)',
    );
  });
});
