import inquirer from 'inquirer';
import executeBBFlow from '.';
import savedActions from '../__mocks__/data/savedActions.json';

function getAction({ id, type }) {
  return savedActions.find(({ flow }) => flow.id === id && flow.type === type);
}

describe('BB flow', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('checking', () => {
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
        date: new Date('2018-01-01T02:00:00.000Z'),
        import_id: '588ce4ad79757b8ec4c432e8586b1aba',
        memo: 'Checking Transaction 1',
      });
    });

    test('executes bb action without questions', async () => {
      const spy = jest.spyOn(inquirer, 'prompt');
      const response = await executeBBFlow({
        ...getAction({ id: 'bb', type: 'checking' }),
        args: {
          yesToAllOnce: true,
          password: '123456',
        },
      });

      expect(spy).not.toHaveBeenCalled();
      expect(response).not.toHaveProperty('args');
    });
  });

  describe('savings', () => {
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
        date: new Date('2018-01-01T02:00:00.000Z'),
        import_id: 'eb90c2bcc88d799664e1bea2bb009bd6',
        memo: 'Savings Transaction 1',
      });
    });

    test('executes bb action without questions', async () => {
      const spy = jest.spyOn(inquirer, 'prompt');
      const response = await executeBBFlow({
        ...getAction({ id: 'bb', type: 'savings' }),
        args: {
          yesToAllOnce: true,
          password: '123456',
        },
      });

      expect(spy).not.toHaveBeenCalled();
      expect(response).not.toHaveProperty('args');
    });
  });
});
