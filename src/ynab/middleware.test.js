import { getBudgets, getAccounts, importTransactions } from './middleware';

describe('YNAB middleware', () => {
  test('should return budgets', async () => {
    const budgets = await getBudgets();

    expect(budgets).toHaveLength(2);
    expect(budgets[0]).toHaveProperty('id');
    expect(budgets[0]).toHaveProperty('name');
    expect(budgets[0]).toHaveProperty('date_format');
  });

  test('should return accounts', async () => {
    const accounts = await getAccounts();

    expect(accounts).toHaveLength(3);
    expect(accounts[0]).toHaveProperty('id');
    expect(accounts[0]).toHaveProperty('name');
    expect(accounts[0]).toHaveProperty('type');
  });

  test('should create transactions', async () => {
    await expect(importTransactions()).resolves.toEqual({});
  });
});
