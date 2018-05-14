import chalk from 'chalk'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'
import executeBBFlow from './bb'
import db, { initializeDb } from './db'
import { askForFlowType, askForActionType, askForSavedActionsToRun, askToSaveAction, askForSavedActionsToDelete } from './questions'

initializeDb()

export const flows = [
  {
    type: 'nubank',
    name: 'Nubank',
    execute: executeNubankFlow,
  },
  {
    type: 'bb',
    name: 'Banco do Brasil',
    execute: executeBBFlow,
  },
]

export async function executeAction(flow, action) {
  const { username, transactions } = await flow.execute(action)

  const ynabResponse = await executeYnabFlow(flow, { ...action, username }, transactions)

  if (!ynabResponse) {
    return false
  }

  let actionOut = ynabResponse

  if (!actionOut.id) {
    const save = await askToSaveAction()

    if (!save) {
      return false
    }
  }

  if (actionOut.id) {
    db.get('favoriteActions')
      .remove({ flowType: flow.type, id: action.id })
      .write()
  } else {
    actionOut = { ...actionOut, id: new Date().getTime() }
  }

  db.get('favoriteActions')
    .push({
      flowType: flow.type,
      ...actionOut,
      when: new Date().getTime(),
    })
    .write()

  return true
}

async function executeActionArray(flow, favoriteActions) {
  let result = Promise.resolve()
  favoriteActions.forEach((act) => {
    result = result.then(() => executeAction(flow, act))
  })
  return result
}

async function main(action = {}) {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return false
  }

  const flowType = await askForFlowType()
  const flow = flows.find(f => f.type === flowType)

  const savedActions = db
    .get('favoriteActions')
    .filter({ flowType })
    .value()

  const newActionType = action.actionType || await askForActionType()
  switch (newActionType) {
    case 'NEW':
      await executeAction(flow)
      main()
      break

    case 'FAVORITE': {
      const actions = await askForSavedActionsToRun(flow, savedActions)
      await executeActionArray(flow, actions)
      main()
      break
    }

    case 'DELETE': {
      const actions = await askForSavedActionsToDelete(flow, savedActions)
      actions.forEach((favoriteAction) => {
        db.get('favoriteActions')
          .remove({ flowType, id: favoriteAction.id })
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
