import inquirer from 'inquirer'

export async function askForBudget(budgets) {
  const { budget } = await inquirer.prompt([{
    type: 'list',
    name: 'budget',
    message: 'Which YNAB budget do you want to sync?',
    choices: budgets
      .sort((b1, b2) => b1.name > b2.name)
      .map(b => ({ value: b, name: b.name })),
  }])

  return budget
}

export async function askForAccount(accounts) {
  const { account } = await inquirer.prompt([{
    type: 'list',
    name: 'account',
    message: 'Which YNAB account do you want to sync?',
    choices: accounts
      .sort((a1, a2) => a1.name > a2.name)
      .map(a => ({ value: a, name: a.name })),
  }])

  return account
}

export async function askForConfirm(flow, action, transactions) {
  const { username, account, budget } = action

  let usernameText
  if (typeof username === 'object') {
    usernameText = Object.values(username).join(' / ')
  } else {
    usernameText = username
  }

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Do you confirm importing ${transactions.length} transactions from ${flow.name} ${usernameText} to YNAB ${account.name} (${budget.name})?`,
    default: true,
  }])

  return confirm
}
