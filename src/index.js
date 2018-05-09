import chalk from 'chalk'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'
import db, { initializeDb } from './db'
import { askForActionType, askForSavedActionsToRun, askToSaveAction, askForSavedActionsToDelete } from './questions'

initializeDb()

export async function executeAction(action) {
  const { username, transactions } = await executeNubankFlow(action)
  const ynabResponse = await executeYnabFlow({ ...action, username }, transactions)

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
      .remove({ id: action.id })
      .write()
  } else {
    actionOut = { ...actionOut, id: new Date().getTime() }
  }

  db.get('favoriteActions')
    .push({
      ...actionOut,
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

async function main({ actionType }) {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return false
  }

  const savedActions = db
    .get('favoriteActions')
    .value()

  const newActionType = actionType || await askForActionType()
  switch (newActionType) {
    case 'NEW':
      await executeAction()
      main({})
      break

    case 'FAVORITE': {
      const actions = await askForSavedActionsToRun(savedActions)
      await executeActionArray(actions)
      main({})
      break
    }

    case 'DELETE': {
      const actions = await askForSavedActionsToDelete(savedActions)
      actions.forEach((action) => {
        db.get('favoriteActions')
          .remove({ id: action.id })
          .write()
      })
      main({})
      break
    }

    default:
      break
  }

  return true
}

export { main as default }

// Run main if it was called by shell
if (require.main === module) {
  main({})
}
