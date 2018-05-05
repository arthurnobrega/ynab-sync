import chalk from 'chalk'
import inquirer from 'inquirer'
import executeYnabFlow from './ynab'
import executeNubankFlow from './nubank'
import db from './db'

async function askToSaveFavorite(_action) {
  let save = true
  let action = _action
  if (!action.id) {
    ({ save } = await inquirer.prompt([{
      type: 'confirm',
      name: 'save',
      message: 'Would you like to save this action as a favorite?',
      default: true,
    }]))
    action = { ...action, id: new Date().getTime() }
  } else {
    db.get('favoriteActions')
      .remove({ id: action.id })
      .write()
  }

  if (save) {
    db.get('favoriteActions')
      .push({
        ...action,
        transient: {},
        when: new Date().getTime(),
      })
      .write()
  }
}

async function askForFavoriteActsToRun() {
  const favoriteActsDb = db.get('favoriteActions').value()
  const { favoriteActsIds } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'favoriteActsIds',
    message: 'Which favorite actions would you like to run?',
    choices: favoriteActsDb.map(act => ({
      value: act.id,
      checked: true,
      name: `Nubank username ${act.username}`,
    })),
  }])
  return favoriteActsDb.filter(act => favoriteActsIds.indexOf(act.id) !== -1)
}

async function askForFavoriteActsToDelete() {
  const favoriteActsDb = db.get('favoriteActions').value()
  const { favoriteActsIds } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'favoriteActsIds',
    message: 'Which favorite actions would you like to DELETE?',
    choices: favoriteActsDb.map(act => ({
      value: act.id,
      name: `Nubank username ${act.username}`,
    })),
  }])

  favoriteActsIds.forEach((id) => {
    db.get('favoriteActions')
      .remove({ id })
      .write()
  })
}

async function executeAction(action) {
  try {
    const { action: actionOut } =
      await executeYnabFlow(await executeNubankFlow({ action }))

    await askToSaveFavorite(actionOut)
  } catch (e) {
    console.log(chalk.red('##############'))
    console.log(chalk.red(e.toString()))
    console.log(chalk.red('##############'))
  }
}

async function executeActionArray(favoriteActions) {
  let result = Promise.resolve()
  favoriteActions.forEach((act) => {
    result = result.then(() => executeAction(act))
  })
  return result
}

async function askForActionType() {
  const { actionType } = await inquirer.prompt([{
    type: 'list',
    name: 'actionType',
    message: 'What would you like to do?',
    choices: [
      { value: 'FAVORITE', name: 'Use favorite actions' },
      { value: 'NEW', name: 'Start new action' },
      { value: 'DELETE', name: 'Delete favorite actions' },
      { value: 'EXIT', name: 'Exit' },
    ],
  }])
  return actionType
}

async function main() {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('You need to set YNAB_TOKEN environment variable. Please read the README.md.'))
    return
  }

  switch (await askForActionType()) {
    case 'NEW':
      await executeAction()
      main()
      break

    case 'FAVORITE':
      await executeActionArray(await askForFavoriteActsToRun())
      main()
      break

    case 'DELETE':
      await askForFavoriteActsToDelete()
      main()
      break

    default:
      break
  }
}

main()
