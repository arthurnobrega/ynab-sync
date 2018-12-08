import ynabBudgets from './data/ynabBudgets.json';
import ynabAccounts from './data/ynabAccounts.json';

export class API {
  budgets = {
    getBudgets: () => Promise.resolve(ynabBudgets),
  };

  accounts = {
    getAccounts: () => Promise.resolve(ynabAccounts),
  };

  transactions = {
    bulkCreateTransactions: () => Promise.resolve({}),
  };
}

export function fool() {}
