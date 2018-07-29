import inquirer from 'inquirer'
import { format, isDate, parse, differenceInYears, isFuture } from 'date-fns'

export async function askForUsername() {
  const { username } = await inquirer.prompt([{
    type: 'string',
    name: 'username',
    message: 'Type in the Nubank username:',
    validate: (answer) => {
      if (!(/^[0-9]{11}$/.test(answer))) {
        return 'That\'s an invalid username, try again'
      }
      return true
    },
  }])
  return username
}

export async function askForPassword(username) {
  const { password } = await inquirer.prompt([{
    type: 'password',
    name: 'password',
    message: `Please enter a password for Nubank username "${username}"`,
    validate: (answer) => {
      if (answer.length < 1) {
        return 'You must type in the password, try again'
      }
      return true
    },
  }])
  return password
}

export function defaultFilter() {
  return format(new Date(), 'YYYY-MM')
}

export async function askForFilter() {
  const { filter } = await inquirer.prompt([{
    type: 'string',
    name: 'filter',
    message: 'From which date do you want to import (YYYY-MM):',
    default: defaultFilter,
    validate: (answer) => {
      if (!(/^[0-9]{4}-[0-9]{2}$/.test(answer))) {
        return 'That\'s an invalid format, try again'
      }
      const parsedAnswer = parse(answer)
      if (!isDate(parsedAnswer)) {
        return 'That\'s an invalid date, try again'
      }
      if (differenceInYears(new Date(), parsedAnswer) >= 100) {
        return 'That\'s too far in the past, try again'
      }
      if (isFuture(parsedAnswer)) {
        return 'That\'s in the future, no time travels allowed, try again'
      }
      return true
    },
  }])

  return filter
}
