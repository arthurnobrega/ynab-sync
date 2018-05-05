import { API } from 'ynab'
import inquirer from 'inquirer'
import chalk from 'chalk'

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

async function createTransaction(budgetId, transaction) {
  let transactionResponse
  try {
    transactionResponse = await ynabAPI.transactions.createTransaction(budgetId, transaction)
  } catch (e) {
    console.log(chalk.red(e))
  }

  return transactionResponse
}

async function askForBudget(budgets) {
  const { budgetId } = await inquirer.prompt([{
    type: 'list',
    name: 'budgetId',
    message: 'Which YNAB budget do you want to sync?',
    choices: budgets.map(b => ({ value: b.id, name: `${b.name} (${b.id})` })),
  }])
  return budgets.filter(budget => budget.id === budgetId)
}

async function askForAccount(accounts) {
  const { accountId } = await inquirer.prompt([{
    type: 'list',
    name: 'accountId',
    message: 'Which YNAB account do you want to sync?',
    choices: accounts.map(a => ({ value: a.id, name: `${a.name} (${a.id})` })),
  }])
  return accounts.filter(account => account.id === accountId)
}

export default async function executeYnabFlow({ action }) {
  // TODO: in the future, also include login/token to YNAB
  const { transient } = action
  let { budget, account } = action
  if (budget && account) {
    console.log(chalk.blue(`YNAB budget ${budget.name}`))
    console.log(chalk.blue(`Account ${account.name}`))
  } else {
    const budgets = await getBudgets()
    budget = await askForBudget(budgets)
    const accounts = await getAccounts(budget.id)
    account = await askForAccount(accounts)
  }

  // TODO: Remove this selection of only first transaction
  const nubankTransaction = transient.transactions[0]
  const transaction = {
    account_id: account.id,
    date: nubankTransaction.time,
    amount: -(nubankTransaction.amount * 10),
    memo: nubankTransaction.description,
    cleared: 'cleared',
    approved: true,
    import_id: nubankTransaction.id,
  }

  await createTransaction(budget.id, { transaction })

  return {
    action: {
      ...action,
      budget,
      account,
    },
  }
}
