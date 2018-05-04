import createNuBank from 'nubank-api'
import inquirer from 'inquirer'
import chalk from 'chalk'
import db from '../db'

const NuBank = createNuBank()

async function askForNubankUsername() {
  const { username } = await inquirer.prompt([{
    type: 'string',
    name: 'username',
    message: 'What is your Nubank username?',
  }])
  return username
}

async function askForNubankPassword(username) {
  const { password } = await inquirer.prompt([{
    type: 'password',
    name: 'password',
    message: `Please enter a password for Nubank username "${username}"`,
  }])
  return password
}

async function requestNewToken(db, username) {
  const password = await askForNubankPassword(username)
  const token = await NuBank.getLoginToken({ login: username, password })

  if (token.error) {
    throw Error(token.error)
  }

  db.get('nubankTokens')
    .push({ username, token })
    .write()
}

// async function askForFilterTransactions(transactions) {
//   const filteredTransactions = period
//       ? transactions.filter(t => t.time.indexOf(period) !== -1)
//       : transactions

//     if (verbose) {
//       console.log(filteredTransactions)
//     }

//     return filteredTransactions
// }

export default async function executeNubankFlow() {
  const username = await askForNubankUsername()

  let record = db.get('nubankTokens')
    .find({ username })
    .value()

  // Deal with expired token
  if (record && (new Date(record.token.refresh_before) < new Date())) {
    db.get('nubankTokens')
      .remove({ username })
      .write()

    record = undefined
  }

  if (record) {
    console.log(chalk.blue(`Using valid NuBank token stored for username ${username}...`))

    NuBank.setLoginToken(record.token)
  } else {
    requestNewToken(db, username)
  }

  const { events: transactions } = await NuBank.getWholeFeed()

  // const transactions = await askForFilterTransactions(transactions)

  return transactions
}
