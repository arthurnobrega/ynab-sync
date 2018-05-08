import { API } from 'ynab'
import { format } from 'date-fns'
import inquirer from 'inquirer'

const ynabAPI = new API(process.env.YNAB_TOKEN)

async function getBudgets() {
  const budgetsResponse = await ynabAPI.budgets.getBudgets()
  const { budgets } = budgetsResponse.data

  return budgets
}

async function getAccounts(budgetId) {
  const accountsResponse = await ynabAPI.accounts.getAccounts(budgetId)
  const { accounts } = accountsResponse.data

  return accounts
}

async function bulkCreateTransactions(budgetId, transactions) {
  let response
  try {
    response = await ynabAPI.transactions.bulkCreateTransactions(budgetId, { transactions })
  } catch (e) {
    console.log(e)
  }

  return response
}

async function askForBudget(_budgets) {
  const budgets = _budgets
  const { budgetId } = await inquirer.prompt([{
    type: 'list',
    name: 'budgetId',
    message: 'Which YNAB budget do you want to sync?',
    choices: budgets
      .sort((b1, b2) => b1.name > b2.name)
      .map(b => ({ value: b.id, name: `${b.name}` })),
  }])

  return budgets.find(budget => budget.id === budgetId)
}

async function askForAccount(_accounts) {
  const accounts = _accounts
  const { accountId } = await inquirer.prompt([{
    type: 'list',
    name: 'accountId',
    message: 'Which YNAB account do you want to sync?',
    choices: accounts
      .sort((a1, a2) => a1.name > a2.name)
      .map(a => ({ value: a.id, name: `${a.name}` })),
  }])

  return accounts.find(account => account.id === accountId)
}

async function askForConfirm(action) {
  const {
    username,
    account,
    budget,
    transient,
  } = action
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Do you confirm importing ${transient.transactions.length} transactions from Nubank ${username} to YNAB ${account.name} (${budget.name})?`,
    default: true,
  }])
  return confirm
}

export default async function executeYnabFlow({ action: _action }) {
  // TODO: also include login/token to YNAB
  let action = { ..._action }
  const { transient } = action
  let { budget, account } = action

  if (!(budget && account)) {
    const budgets = await getBudgets()
    budget = await askForBudget(budgets)
    const accounts = await getAccounts(budget.id)
    account = await askForAccount(accounts)
    action = { ...action, budget, account }
  }

  const confirm = await askForConfirm(action)

  if (confirm) {
    const syncDate = format(new Date(), 'YYYY-MM-DD HH:mm')
    const parsedTransactions = transient.transactions
      .map((nubankTransaction) => {
        const amount = -1 * nubankTransaction.amount * 10

        return {
          amount,
          approved: false,
          cleared: 'cleared',
          account_id: account.id,
          date: nubankTransaction.post_date,
          payee_name: nubankTransaction.title,
          memo: `Synced on ${syncDate}`,
          import_id: nubankTransaction.id,
        }
      })

    await bulkCreateTransactions(budget.id, parsedTransactions)

    return { action }
  }

  return null
}
