import { askForBudget, askForAccount, askForConfirm } from './questions'
import { getBudgets, getAccounts, importTransactions } from './middleware'

export default async function executeYnabFlow(flow, _action, transactions) {
  // TODO: also include login/token to YNAB
  let action = { ..._action }

  if (!action.budget || !action.account) {
    const budgets = await getBudgets()
    const budget = await askForBudget(budgets)
    const accounts = await getAccounts(budget.id)
    const account = await askForAccount(accounts)

    action = { ..._action, budget, account }
  }

  const confirm = await askForConfirm(flow, action, transactions)

  if (!confirm) {
    return null
  }

  const parsedTransactions = transactions.map(transaction => ({
    ...transaction,
    approved: false,
    cleared: 'cleared',
    account_id: action.account.id,
  }))

  try {
    await importTransactions(action.budget.id, parsedTransactions)
  } catch (e) {
    console.log(e)
    return null
  }

  return action
}
