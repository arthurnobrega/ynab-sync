import BB from 'bb-api'
import md5 from 'md5'
import { askForUsername, askForPassword, defaultFilter, askForFilter } from './questions'

const bb = new BB()

async function processBBData(filter) {
  const filterParts = filter.split('-')

  let response = await bb.getTransactions({ year: filterParts[0], month: filterParts[1] })
  if (response.length === 0) {
    // try again - paliativo pq a primeira consulta do BB agora retorna uma mensagem de alerta
    // 'Esta versão do aplicativo não será mais suportada ....'
    response = await bb.getTransactions({ year: filterParts[0], month: filterParts[1] })
  }

  const transactions = response.map((transaction) => {
    const { description: memo, date, amount: sourceAmount } = transaction
    const amount = parseInt(sourceAmount * 1000, 10)

    return {
      date,
      memo,
      amount,
      import_id: md5(JSON.stringify({ date, memo, amount })),
    }
  })

  return transactions
}

export default async function executeBBFlow(_action = {}) {
  const { args, ...action } = _action
  const username = action.username || await askForUsername()

  const password = (args && args.password) || await askForPassword(username)

  const filters = []
  if (args && args.syncLastTwoMonths) {
    filters.push(defaultFilter(true))
    filters.push(defaultFilter())
  } else if (args && args.yesToAllOnce) {
    filters.push(defaultFilter())
  } else {
    filters.push(await askForFilter())
  }

  await bb.login({ ...username, password })

  const result = await Promise
    .all(filters.map(date => processBBData(date)))

  const transactions = result
    .reduce((acc, item) => acc.concat(item), [])

  const balance = await bb.getBalance()
  return {
    ...action,
    balance,
    username,
    transactions,
  }
}
