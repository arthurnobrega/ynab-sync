import { getBudgets, getAccounts, importTransactions } from './middleware'

describe('YNAB middleware', () => {
  it('should return budgets', async () => {
    const budgets = await getBudgets()

    expect(budgets.length).toEqual(2)
    expect(budgets[0]).toHaveProperty('id')
    expect(budgets[0]).toHaveProperty('name')
    expect(budgets[0]).toHaveProperty('date_format')
  })

  it('should return accounts', async () => {
    const accounts = await getAccounts()

    expect(accounts.length).toEqual(3)
    expect(accounts[0]).toHaveProperty('id')
    expect(accounts[0]).toHaveProperty('name')
    expect(accounts[0]).toHaveProperty('type')
  })

  it('should create transactions', async () => {
    await expect(importTransactions()).resolves.toEqual({})
  })
})
