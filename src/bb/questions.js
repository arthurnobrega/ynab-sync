import inquirer from 'inquirer'

export async function askForUsername() {
  const { bbBranch } = await inquirer.prompt([{
    type: 'string',
    name: 'bbBranch',
    message: 'Type in your BB branch number:',
    validate: (answer) => {
      if (!(/^[0-9]{5}$/.test(answer))) {
        return 'That\'s an invalid branch number, try again'
      }
      return true
    },
  }])

  const { bbAccount } = await inquirer.prompt([{
    type: 'string',
    name: 'bbAccount',
    message: 'Type in your BB account number:',
    validate: (answer) => {
      if (!(/^[0-9]{6}$/.test(answer))) {
        return 'That\'s an invalid account number, try again'
      }
      return true
    },
  }])
  return {
    branch: bbBranch,
    account: bbAccount,
  }
}

export async function askForPassword(username) {
  const { bbPassword } = await inquirer.prompt([{
    type: 'password',
    name: 'bbPassword',
    message: `Please enter a password for BB account "${username.branch} / ${username.account}"`,
    validate: (answer) => {
      if (answer.length < 1) {
        return 'You must type in the password, try again'
      }
      return true
    },
  }])
  return bbPassword
}

export async function askForFilter() {
  const { filter } = await inquirer.prompt([{
    type: 'string',
    name: 'filter',
    message: 'Type in the filter in the format YYYY-MM (ex: 2018-01):',
    validate: (answer) => {
      if (!(/^[0-9]{4}-[0-9]{2}$/.test(answer))) {
        return 'That\'s an invalid filter, try again'
      }
      return true
    },
  }])

  return filter
}
