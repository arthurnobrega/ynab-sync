import createNuBank from 'nubank-api'
import inquirer from 'inquirer'
import chalk from 'chalk'
import db from '../db'

const NuBank = createNuBank()

async function askForNubankUsername() {
  const { username } = await inquirer.prompt([{
    type: 'string',
    name: 'username',
    message: 'Type in the Nubank username:',
    validate: (answer) => {
      if (!(/^[0-9]{11}$/.test(answer))) {
        return 'That\'s an invalid username, try again'
      }
      return true
    },
  }])
  return username
}

async function askForNubankPassword(username) {
  const { password } = await inquirer.prompt([{
    type: 'password',
    name: 'password',
    message: `Please enter a password for Nubank username "${username}"`,
    validate: (answer) => {
      if (answer.length < 1) {
        return 'You must type in the password, try again'
      }
      return true
    },
  }])
  return password
}

async function requestNewToken(username) {
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

export default async function executeNubankFlow({ action = {} }) {
  let { username } = action
  if (!username) {
    username = await askForNubankUsername()
  }

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
    await requestNewToken(username)
  }

  const { events: transactions } = await NuBank.getWholeFeed()
  // const transactions = await askForFilterTransactions(transactions)

  return {
    action: {
      ...action,
      username,
      transient: { transactions },
    },
  }
}
