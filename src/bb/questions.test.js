import {
  askForUsername,
  askForPassword,
  askForFilter,
  askForSavingsAccount,
  askForCreditCard,
  askForBill,
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

  test('returns specific credit card', async () => {
    const creditCards = [
      {
        brand: 'VISA',
        modality: '74',
        cardAccountNumber: '12345678',
        cardNumber: '0000123456781111',
      },
      {
        brand: 'VISA',
        modality: '1',
        cardAccountNumber: '12345679',
        cardNumber: '0000123456781112',
      },
    ];
    const creditCard = await askForCreditCard(creditCards);

    expect(creditCard).toMatchObject({
      brand: 'VISA',
      modality: '74',
      cardAccountNumber: '12345678',
      cardNumber: '0000123456781111',
    });
  });

  test('returns opened bill of credit card', async () => {
    const bills = [
      {
        status: 'opened',
        cardAccountNumber: '12345678',
        billDate: '25022018',
      },
      {
        status: 'closed',
        cardAccountNumber: '12345678',
        billId: '123123123',
        billDate: '25012018',
      },
    ];
    const creditCard = await askForBill(bills);

    expect(creditCard).toMatchObject({
      status: 'opened',
      cardAccountNumber: '12345678',
      billDate: '25022018',
    });
  });
});
