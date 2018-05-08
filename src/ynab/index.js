import { API } from 'ynab'
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

async function askForBudget(budgets) {
  const { budgetId } = await inquirer.prompt([{
    type: 'list',
    name: 'budgetId',
    message: 'Which YNAB budget do you want to sync?',
    choices: budgets.map(b => ({ value: b.id, name: `${b.name} (${b.id})` })),
  }])

  return budgets.find(budget => budget.id === budgetId)
}

async function askForAccount(accounts) {
  const { accountId } = await inquirer.prompt([{
    type: 'list',
    name: 'accountId',
    message: 'Which YNAB account do you want to sync?',
    choices: accounts.map(a => ({ value: a.id, name: `${a.name} (${a.id})` })),
  }])

  return accounts.find(account => account.id === accountId)
}

async function askForConfirm(transactions) {
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Do you confirm importing ${transactions.length} transactions from Nubank to YNAB?`,
    default: true,
  }])
  return confirm
}

export default async function executeYnabFlow({ action }) {
  // TODO: also include login/token to YNAB
  const { transient } = action
  let { budget, account } = action

  if (!(budget && account)) {
    const budgets = await getBudgets()
    budget = await askForBudget(budgets)
    const accounts = await getAccounts(budget.id)
    account = await askForAccount(accounts)
  }

  const confirm = await askForConfirm(transient.transactions)

  if (confirm) {
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
          memo: nubankTransaction.title,
          import_id: nubankTransaction.id,
        }
      })

    await bulkCreateTransactions(budget.id, parsedTransactions)

    return {
      action: {
        ...action,
        budget,
        account,
      },
    }
  }

  return null
}
