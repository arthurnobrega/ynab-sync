import ynabBudgets from './data/ynabBudgets.json';
import ynabAccounts from './data/ynabAccounts.json';
import savedActions from './data/savedActions.json';

export default {
  prompt: ([{ name, choices }]) => {
    switch (name) {
      // Main
      case 'flow':
        return {
          flow: {
            id: 'nubank',
            type: 'credit-card',
            name: 'Nubank Credit Card',
            execute: () => {},
          },
        };
      case 'actionType':
        return { actionType: 'NEW' };
      case 'actionsToRun':
        return { actionsToRun: [savedActions[0]] };
      case 'actionsToDelete':
        return { actionsToDelete: [savedActions[1]] };
      case 'save':
        return { save: true };

      // BB
      case 'bbBranch':
        return { bbBranch: '12345' };
      case 'bbAccount':
        return { bbAccount: '123456' };
      case 'bbPassword':
        return { bbPassword: '12345678' };
      case 'bbFilter':
        return { bbFilter: '2018-01' };
      case 'bbSavingsAccount':
        return { bbSavingsAccount: choices[0].value };
      case 'bbCreditCard':
        return { bbCreditCard: choices[0].value };

      // Nubank
      case 'username':
        return { username: '45678932158' };
      case 'password':
        return { password: '123456' };
      case 'filter':
        return { filter: '2018-01' };

      // YNAB
      case 'budget':
        return { budget: ynabBudgets.data.budgets[0] };
      case 'account':
        return { account: ynabAccounts.data.accounts[0] };
      case 'confirm':
        return { confirm: true };

      default:
        return null;
    }
  },
  Separator: class {},
};
