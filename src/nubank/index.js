import chalk from 'chalk'
import db from '../db'
import { askForPassword, askForUsername, defaultFilter, askForFilter } from './questions'
import { setLoginToken, requestNewToken, getBillByMonth, getCheckingBalance, getCheckingTransactions } from './middleware'

async function processNubankCardData(filter) {
  try {
    const { bill } = await getBillByMonth(filter)

    let balance = 0
    if (bill.summary.total_balance) {
      balance = -1 * ((bill.summary.total_balance - bill.summary.paid) / 100)
    }

    const transactions = bill.line_items.map((transaction) => {
      const { index, charges, title } = transaction
      return {
        import_id: transaction.id,
        amount: parseInt(-1 * transaction.amount * 10, 10),
        date: transaction.post_date,
        memo: charges !== 1 ? `${title}, ${index + 1}/${charges}` : title,
      }
    })

    return { balance, transactions }
  } catch (error) {
    console.error(error)
  }

  return {
    transactions: [],
    balance: 0,
  }
}

async function getNubankCardData(args) {
  const filters = []

  if (args && args.syncLastTwoMonths) {
    filters.push(defaultFilter(true))
    filters.push(defaultFilter())
  } else if (args && args.yesToAllOnce) {
    filters.push(defaultFilter())
  } else {
    filters.push(await askForFilter())
  }

  const result = await Promise
    .all(filters.map(date => processNubankCardData(date)))

  const response = result
    .reduce((acc, item) => ({
      transactions: acc.transactions.concat(item.transactions),
      balance: acc.balance + item.balance,
    }), {
      transactions: [],
      balance: 0,
    })

  return response
}

async function getNubankAccountData() {
  const checkTrans = await getCheckingTransactions()

  const checkBalance = await getCheckingBalance()
  const balance = checkBalance.data.viewer.savingsAccount.currentSavingsBalance.netAmount
  const transactions = checkTrans.data.viewer.savingsAccount.feed.reduce((acc, transaction) => {
    if (transaction.amount) {
      const sign = transaction.__typename !== 'TransferInEvent' ? -1 : +1

      return [
        ...acc,
        {
          import_id: transaction.id,
          amount: parseInt(sign * transaction.amount * 1000, 10),
          date: transaction.postDate,
          memo: `${transaction.title} ${transaction.detail}`,
        },
      ]
    }

    return acc
  }, [])

  return { balance, transactions }
}

export default async function executeNubankFlow(_action = {}) {
  const { args, ...action } = _action
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
    const password = (args && args.password) || await askForPassword(username)
    const token = await requestNewToken(username, password)

    db.get('nubankTokens')
      .push({ username, token })
      .write()
  }

  let response = null
  if (action.flowType.id === 'nubank-card') {
    response = await getNubankCardData(args)
  } else if (action.flowType.id === 'nubank-account') {
    response = await getNubankAccountData()
  }

  const { balance, transactions } = response
  return {
    ...action,
    balance,
    username,
    transactions,
  }
}
