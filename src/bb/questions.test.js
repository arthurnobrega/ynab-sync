import {
  askForUsername,
  askForPassword,
  askForFilter,
  askForSavingsAccount,
} from './questions';

describe('BB questions', () => {
  test('returns username', async () => {
    const username = await askForUsername();

    expect(username).toHaveProperty('branch', '12345');
    expect(username).toHaveProperty('account', '123456');
  });

  test('returns password', async () => {
    const username = await askForUsername();
    const password = await askForPassword(username);

    expect(password).toEqual('12345678');
  });

  test('returns filter', async () => {
    const filter = await askForFilter();

    expect(filter).toEqual('2018-01');
  });

  test('returns savings account', async () => {
    const savingsAccounts = [
      {
        variation: 1,
        description: 'Poupança Ouro - Variação 1',
      },
      {
        variation: 51,
        description: 'Poupança Ouro - Variação 51',
      },
    ];
    const savingsAccount = await askForSavingsAccount(savingsAccounts);

    expect(savingsAccount).toMatchObject({
      variation: 1,
      description: 'Poupança Ouro - Variação 1',
    });
  });
});
