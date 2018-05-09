import chalk from 'chalk'
import db from '../db'
import { askForPassword, askForUsername, askForFilter } from './questions'
import { setLoginToken, requestNewToken, getBillByMonth } from './middleware'

export default async function executeNubankFlow(action = {}) {
  const username = action.username || await askForUsername()

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

    setLoginToken(record.token)
  } else {
    const password = await askForPassword(username)
    const token = await requestNewToken(username, password)

    db.get('nubankTokens')
      .push({ username, token })
      .write()
  }

  const filter = await askForFilter()
  const { bill } = await getBillByMonth(filter)

  return bill.line_items.map(transaction => ({
    import_id: transaction.id,
    amount: -1 * transaction.amount * 10,
    date: transaction.post_date,
    payee_name: transaction.title,
    memo: transaction.title,
  }))
}
