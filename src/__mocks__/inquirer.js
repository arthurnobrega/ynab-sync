import ynabBudgets from './data/ynabBudgets.json'
import ynabAccounts from '../__mocks__/data/ynabAccounts.json'

export default {
  prompt: ([{ name }]) => {
    switch (name) {
      // Nubank
      case 'username':
        return { username: '45678932158' }
      case 'password':
        return { password: '123456' }
      case 'filter':
        return { filter: '2018-01' }

      // YNAB
      case 'budget':
        return { budget: ynabBudgets.data.budgets[0] }
      case 'account':
        return { account: ynabAccounts.data.accounts[0] }
      case 'confirm':
        return { confirm: true }

      default:
        return null
    }
  },
}
