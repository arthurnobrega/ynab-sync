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
      name: op.name,
    })),
  }])
  console.log(chalk.green(`favOps ${favoriteOps}`))
  return favoriteOps
}

async function askForFavoriteOpsToDelete() {
  const favoriteOpsDb = db.get('favoriteOperations').value()
  const { favoriteOps } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'favoriteOps',
    message: 'Which favorite operations would you like to DELETE?',
    choices: favoriteOpsDb.map(op => ({
      value: op.id,
      name: op.name,
    })),
  }])

  favoriteOps.forEach((id) => {
    db.get('favoriteOperations')
      .remove({ id })
      .write()
  })
}

async function executeSync() {
  try {
    const transactions = await executeNubankFlow()
    await executeYnabFlow(transactions)
  } catch (e) {
    console.log(chalk.red(e.toString()))
  }
}

async function askForOperationType() {
  const { operationType } = await inquirer.prompt([{
    type: 'list',
    name: 'operationType',
    message: 'What would you like to do?',
    choices: [
      {
        value: 'NEW',
        name: 'Start a new operation',
      },
      {
        value: 'FAVORITE',
        name: 'Use favorite operations',
      },
      {
        value: 'DELETE',
        name: 'Delete favorite operations',
      },
      {
        value: 'EXIT',
        name: 'Exit',
      },
    ],
  }])
  return operationType
}

async function main() {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return
  }

  let endWhile = false;
  while (!endWhile) {
    const opType = await askForOperationType()
    switch (opType) {
      case 'NEW':
        await executeSync()
        endWhile = true
        break

      case 'FAVORITE':
        await askForFavoriteOpsToRun()
        endWhile = true
        break

      case 'DELETE':
        await askForFavoriteOpsToDelete()
        break

      default:
        endWhile = true
        break
    }
  }

}

main()
