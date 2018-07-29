import { askForBudget, askForAccount, askForConfirm } from './questions'
import { getBudgets, getAccounts, importTransactions } from './middleware'

export default async function executeYnabFlow(_action, transactions) {
  // TODO: also include login/token to YNAB
  let { args, ...action } = _action
  const budget = action.budget || await askForBudget(await getBudgets())
  const account = action.account || await askForAccount(await getAccounts(budget.id))

  action = { ...action, budget, account }
  const confirm = (args && args.yesToAllOnce) ? true : await askForConfirm(action, transactions)

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
