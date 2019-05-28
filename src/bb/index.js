import BB from 'bb-api';
import md5 from 'md5';
import {
  askForUsername,
  askForPassword,
  defaultFilter,
  askForFilter,
  askForSavingsAccount,
  askForCreditCard,
} from './questions';

const bb = new BB();

function parseTransactions(transactions) {
  return transactions.map(transaction => {
    const { description: memo, date, amount: sourceAmount } = transaction;
    const amount = parseInt(sourceAmount * 1000, 10);

    return {
      date,
      memo,
      amount: parseInt(sourceAmount * 1000, 10),
      import_id: md5(JSON.stringify({ date, memo, amount })),
    };
  });
}

function parseFilter(filter) {
  const [year, month] = filter.split('-');

  return { year, month };
}

export default async function executeBBFlow({ args = null, ...action }) {
  const data = {};
  const username = action.username || (await askForUsername());

  const password = (args && args.password) || (await askForPassword(username));

  let filters = [];
  if (args && args.syncLastTwoMonths) {
    filters.push(defaultFilter(true));
    filters.push(defaultFilter());
  } else if (args && args.yesToAllOnce) {
    filters.push(defaultFilter());
  } else {
    filters.push(await askForFilter());
  }
  filters = filters.map(f => parseFilter(f));

  if (!bb.isLoggedIn()) {
    await bb.login({ ...username, password });
  }

  const { flow } = action;
  let transactions = [];

  if (!flow.type || flow.type === 'checking') {
    transactions = await Promise.all(
      filters.map(filter => bb.checking.getTransactions(filter)),
    );
  } else if (flow.type === 'savings') {
    const savingsAccounts = await bb.savings.getAccounts();
    const savingsAccount = action.savingsAccountVariation
      ? savingsAccounts.find(
          s => s.variation === action.savingsAccountVariation,
        )
      : await askForSavingsAccount(savingsAccounts);

    data.savingsAccountVariation = savingsAccount.variation;

    transactions = await Promise.all(
      filters.map(filter => savingsAccount.getTransactions(filter)),
    );
  } else if (flow.type === 'credit-card') {
    const creditCards = await bb.creditCard.getCards();
    const creditCard = action.creditCardNumber
      ? creditCards.find(s => s.cardNumber === action.creditCardNumber)
      : await askForCreditCard(creditCards);

    data.creditCardNumber = creditCard.cardNumber;

    const creditCardBills = (await creditCard.getBills()).filter(b =>
      filters.map(f => `${f.month}${f.year}`).includes(b.billDate.slice(2)),
    );

    transactions = await Promise.all(
      creditCardBills.map(b => b.getTransactions()),
    );
  }

  transactions = transactions.reduce((acc, item) => acc.concat(item), []);

  const balance = await bb.checking.getBalance();
  return {
    ...action,
    ...data,
    balance,
    username,
    transactions: parseTransactions(transactions),
  };
}
