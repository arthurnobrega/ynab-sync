import chalk from 'chalk'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'

async function main(options) {
  try {
    const transactions = await executeNubankFlow()
    await executeYnabFlow(transactions)
  } catch (e) {
    console.log(chalk.red(e.toString()))

    return null
  }
}

main()
