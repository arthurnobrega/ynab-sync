import inquirer from 'inquirer'

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

export async function askForFilter() {
  const { filter } = await inquirer.prompt([{
    type: 'string',
    name: 'filter',
    message: 'If you want to filter transactions, type in the format YYYY-MM (ex: 2018-01), otherwise just press ENTER:',
  }])

  return filter
}
