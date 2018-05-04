import chalk from 'chalk'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'

async function main(options) {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return
  }

  try {
    const transactions = await executeNubankFlow()
    await executeYnabFlow(transactions)
  } catch (e) {
    console.log(chalk.red(e.toString()))

    return null
  }
}

main()
