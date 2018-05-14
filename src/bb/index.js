import BB from 'bb-api'
import { askForUsername, askForPassword, askForFilter } from './questions'

const bb = new BB()

export default async function executeBBFlow(action = {}) {
  const username = action.username || await askForUsername()
  const password = await askForPassword(username)

  const filter = await askForFilter()
  const filterParts = filter.split('-')

  await bb.login({ ...username, password })
  const response = await bb.getTransactions({ year: filterParts[0], month: filterParts[1] })

  const transactions = response.map((transaction) => {
    const { description: memo, date, amount } = transaction
    return {
      date,
      memo,
      amount: parseInt(-1 * amount * 100, 10),
    }
  })

  return {
    username,
    transactions,
  }
}
