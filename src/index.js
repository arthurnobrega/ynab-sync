import chalk from 'chalk'
import inquirer from 'inquirer'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'
import db from './db'

async function askForFavoriteOpsToRun() {
  const favoriteOpsDb = db.get('favoriteOperations').value()
  const { favoriteOps } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'favoriteOps',
    message: 'Which favorite operations would you like to run?',
    choices: favoriteOpsDb.map(op => ({
      value: op.id,
      checked: true,
      name: `Nubank username ${op.username}`,
    })),
  }])
  return favoriteOpsDb.filter(op => favoriteOps.indexOf(op.id) !== -1)
}

async function askForFavoriteOpsToDelete() {
  const favoriteOpsDb = db.get('favoriteOperations').value()
  const { favoriteOps } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'favoriteOps',
    message: 'Which favorite operations would you like to DELETE?',
    choices: favoriteOpsDb.map(op => ({
      value: op.id,
      name: `Nubank username ${op.username}`,
    })),
  }])

  favoriteOps.forEach((id) => {
    db.get('favoriteOperations')
      .remove({ id })
      .write()
  })
}

async function executeSync(operation) {
  try {
    const transactions = await executeNubankFlow(operation)
    await executeYnabFlow(transactions)
  } catch (e) {
    console.log()
    console.log(chalk.red(e.toString()))
  }
}

async function executeSyncArray(favoriteOps) {
  let result = Promise.resolve()
  favoriteOps.forEach((op) => {
    result = result.then(() => executeSync(op))
  })
  return result
}

async function askForOperationType() {
  const { operationType } = await inquirer.prompt([{
    type: 'list',
    name: 'operationType',
    message: 'What would you like to do?',
    choices: [
      { value: 'FAVORITE', name: 'Use favorite operations' },
      { value: 'NEW', name: 'Start a new operation' },
      { value: 'DELETE', name: 'Delete favorite operations' },
      { value: 'EXIT', name: 'Exit' },
    ],
  }])
  return operationType
}

async function main() {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return
  }

  const opType = await askForOperationType()
  switch (opType) {
    case 'NEW':
      await executeSync()
      main()
      break

    case 'FAVORITE':
      await executeSyncArray(await askForFavoriteOpsToRun())
      main()
      break

    case 'DELETE':
      await askForFavoriteOpsToDelete()
      main()
      break

    default:
      break
  }
}

main()
