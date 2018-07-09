import chalk from 'chalk'
import numeral from 'numeral'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'
import executeBBFlow from './bb'
import db, { initializeDb } from './db'
import { askForFlowType, askForActionType, askForSavedActionsToRun, askToSaveAction, askForSavedActionsToDelete, describeUsername } from './questions'

initializeDb()

export const flowTypes = [
  {
    id: 'nubank-card',
    name: 'Nubank Credit Card',
    execute: executeNubankFlow,
  },
  {
    id: 'nubank-account',
    name: 'NuConta',
    execute: executeNubankFlow,
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    execute: executeBBFlow,
  },
]

function printBalance(action) {
  if (action.balance) {
    const out = `${action.flowType.name} ${describeUsername(action.username)} balance: ${numeral(action.balance).format('$0,0.00')}`
    const line = '='.repeat(out.length + 8)
    console.log(' ')
    console.log(chalk.green(line))
    console.log(' ')
    console.log(chalk.green(`==  ${out}  ==`))
    console.log(' ')
    console.log(chalk.green(line))
    console.log(' ')
  }
}

export async function executeAction(action = {}) {
  let flowType = action.flowType || await askForFlowType(flowTypes)
  flowType = flowTypes.find(flowT => flowT.id === flowType.id)

  const { transactions, ...remainingProps } = await flowType.execute({ ...action, flowType })
  let actionOut = await executeYnabFlow(remainingProps, transactions)

  if (!actionOut) {
    return false
  }

  printBalance(actionOut)

  if (!actionOut.id) {
    const save = await askToSaveAction()

    if (!save) {
      return false
    }
  }

  if (actionOut.id) {
    db.get('favoriteActions')
      .remove({ id: action.id })
      .write()
  } else {
    actionOut = { ...actionOut, id: new Date().getTime() }
  }

  db.get('favoriteActions')
    .push({
      ...actionOut,
      transactions: undefined,
      flowType: { ...flowType, execute: undefined },
      when: new Date().getTime(),
    })
    .write()

  return true
}

async function executeActionArray(favoriteActions) {
  let result = Promise.resolve()
  favoriteActions.forEach((act) => {
    result = result.then(() => executeAction(act))
  })
  return result
}

async function main(action = {}) {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return false
  }

  const savedActions = db
    .get('favoriteActions')
    .value()

  const newActionType = action.actionType || await askForActionType()
  switch (newActionType) {
    case 'NEW':
      await executeAction()
      main()
      break

    case 'FAVORITE': {
      const actions = await askForSavedActionsToRun(savedActions)
      await executeActionArray(actions)
      main()
      break
    }

    case 'DELETE': {
      const actions = await askForSavedActionsToDelete(savedActions)
      actions.forEach((favoriteAction) => {
        db.get('favoriteActions')
          .remove({ id: favoriteAction.id })
          .write()
      })
      main()
      break
    }

    default:
      return false
  }

  return true
}

export { main as default }

// Run main if it was called by shell
if (require.main === module) {
  main()
}
