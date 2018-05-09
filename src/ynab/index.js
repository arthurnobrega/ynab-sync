import { askForBudget, askForAccount, askForConfirm } from './questions'
import { getBudgets, getAccounts, importTransactions } from './middleware'

export default async function executeYnabFlow(_action, transactions) {
  // TODO: also include login/token to YNAB
  let action = { ..._action }

  if (!action.budget || !action.account) {
    const budgets = await getBudgets()
    const budget = await askForBudget(budgets)
    const accounts = await getAccounts(budget.id)
    const account = await askForAccount(accounts)

    action = { ..._action, budget, account }
  }

  const confirm = await askForConfirm(action, transactions)

  if (!confirm) {
    return null
  }

  const parsedTransactions = transactions.map(nubankTransaction => ({
    ...nubankTransaction,
    approved: false,
    cleared: 'cleared',
    account_id: action.account.id,
  }))

  await importTransactions(action.budget.id, parsedTransactions)

  return action
}
