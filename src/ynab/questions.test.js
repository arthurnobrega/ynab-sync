import { askForBudget, askForAccount, askForConfirm } from './questions'
import budgets from '../__mocks__/data/ynabBudgets.json'
import accounts from '../__mocks__/data/ynabAccounts.json'
import transactions from '../__mocks__/data/ynabTransactions.json'
import { FLOWTYPES } from '../.'

describe('YNAB questions', () => {
  it('should return budget', async () => {
    const budget = await askForBudget(budgets.data.budgets)

    expect(budget).toHaveProperty('id')
    expect(budget).toHaveProperty('name')
    expect(budget).toHaveProperty('date_format')
  })

  it('should return account', async () => {
    const account = await askForAccount(accounts.data.accounts)

    expect(account).toHaveProperty('id')
    expect(account).toHaveProperty('name')
    expect(account).toHaveProperty('type')
  })

  it('should return confirmation', async () => {
    const budget = await askForBudget(budgets.data.budgets)
    const account = await askForAccount(accounts.data.accounts)

    const confirm = await askForConfirm({
      account,
      budget,
      flowType: FLOWTYPES[0],
    }, transactions.data.transactions)

    expect(confirm).toBeTruthy()
  })
})
