import { API } from 'ynab'

const ynabAPI = new API(process.env.YNAB_TOKEN)

export async function getBudgets() {
  const budgetsResponse = await ynabAPI.budgets.getBudgets()
  const { budgets } = budgetsResponse.data

  return budgets
}

export async function getAccounts(budgetId) {
  const accountsResponse = await ynabAPI.accounts.getAccounts(budgetId)
  const { accounts } = accountsResponse.data

  return accounts
}

export async function importTransactions(budgetId, transactions) {
  // Remove future transactions
  const filteredTransactions = transactions.filter(t => new Date(t.date) < new Date())

  const response = await ynabAPI.transactions.bulkCreateTransactions(budgetId, {
    transactions: filteredTransactions,
  })

  return response
}
