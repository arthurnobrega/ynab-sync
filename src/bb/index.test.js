import executeBBFlow from '.';

describe('BB flow', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('Checking', () => {
    test('returns array of transactions in correct form', async () => {
      const flow = {
        id: 'bb',
        type: 'checking',
        name: 'BB Checking',
        execute: executeBBFlow,
      };

      const { username, transactions } = await executeBBFlow({ flow });

      expect(username).toMatchObject({
        branch: '12345',
        account: '123456',
      });

      expect(transactions).toHaveLength(3);
      expect(transactions[0]).toMatchObject({
        amount: 1024510,
        date: new Date('2018-01-01T00:00:00Z'),
        import_id: 'b88d56ca71621022bcfae1588ce3ef11',
        memo: 'Checking Transaction 1',
      });
    });
  });

  describe('Savings', () => {
    test('returns array of transactions in correct form', async () => {
      const flow = {
        id: 'bb',
        type: 'savings',
        name: 'BB Savings',
        execute: executeBBFlow,
      };

      const { username, transactions } = await executeBBFlow({ flow });

      expect(username).toMatchObject({
        branch: '12345',
        account: '123456',
      });

      expect(transactions).toHaveLength(3);
      expect(transactions[0]).toMatchObject({
        amount: 10510,
        date: new Date('2018-01-01T00:00:00Z'),
        import_id: '1620f8dfa0bc0c673f49579ec9acb870',
        memo: 'Savings Transaction 1',
      });
    });
  });

  describe('Credit Card', () => {
    test('returns array of transactions in correct form', async () => {
      const flow = {
        id: 'bb',
        type: 'credit-card',
        name: 'BB Credit Card',
        execute: executeBBFlow,
      };

      const { username, transactions } = await executeBBFlow({ flow });

      expect(username).toMatchObject({
        branch: '12345',
        account: '123456',
      });

      expect(transactions).toHaveLength(3);
      expect(transactions[0]).toMatchObject({
        amount: 11510,
        date: new Date('2018-01-01T00:00:00Z'),
        import_id: 'cffaffd717c3fbdc04d261f978cb7e49',
        memo: 'Credit Card Transaction 1',
      });
    });
  });
});
