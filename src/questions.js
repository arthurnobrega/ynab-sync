import inquirer from 'inquirer'
import { distanceInWords } from 'date-fns'

export async function askForFlowType(flowTypes) {
  const { flowType } = await inquirer.prompt([{
    type: 'list',
    name: 'flowType',
    message: 'Select an integration type:',
    choices: flowTypes.map(value => ({ value, name: value.name })),
  }])

  return flowType
}

export async function askForActionType() {
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

function describeAction(action) {
  let usernameText

  if (typeof action.username === 'object') {
    usernameText = Object.values(action.username).join(' / ')
  } else {
    usernameText = action.username
  }

  return `${action.flowType.name} ${usernameText} => YNAB ${action.account.name} (${action.budget.name})`
}

function actionsToChoices(actions, checked = true) {
  const now = new Date()
  let dateSeparator

  return actions
    .slice()
    .sort((act1, act2) => act1.when <= act2.when)
    .reduce((oldAcc, action) => {
      const accumulator = [...oldAcc]
      const newDtSep = ` = ${distanceInWords(action.when, now)} ago = `
      if (!dateSeparator || dateSeparator.localeCompare(newDtSep) !== 0) {
        dateSeparator = newDtSep
        accumulator.push(new inquirer.Separator(dateSeparator))
      }
      accumulator.push({
        value: action,
        checked,
        name: describeAction(action),
      })

      return accumulator
    }, [])
}

export async function askForSavedActionsToRun(savedActions) {
  const { actionsToRun } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'actionsToRun',
    message: 'Which favorite actions would you like to run?',
    choices: actionsToChoices(savedActions),
  }])

  return actionsToRun
}

export async function askForSavedActionsToDelete(savedActions) {
  const { actionsToDelete } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'actionsToDelete',
    message: 'Which favorite actions would you like to DELETE?',
    choices: actionsToChoices(savedActions, false),
  }])

  return actionsToDelete
}

export async function askToSaveAction() {
  const { save } = await inquirer.prompt([{
    type: 'confirm',
    name: 'save',
    message: 'Would you like to save this action as a favorite?',
    default: true,
  }])

  return save
}
