import BB from 'bb-api';
import md5 from 'md5';
import {
  askForUsername,
  askForPassword,
  defaultFilter,
  askForFilter,
  askForSavingsAccount,
  askForCreditCard,
  askForBill,
} from './questions';

const bb = new BB();

function parseTransactions(transactions) {
  return transactions.map(transaction => {
    const { description: memo, date, amount: sourceAmount } = transaction;
    const amount = parseInt(sourceAmount * 1000, 10);
    const title = memo.match(/[A-Z][A-Z\s]+[A-Z]$/g);
    return {
      date,
      memo,
      payee_name: title ? title[0] : null,
      amount: parseInt(sourceAmount * 1000, 10),
      import_id: md5(JSON.stringify({ date, memo, amount })),
    };
  });
}

function parseFilter(filter) {
  const [year, month] = filter.split('-');

  return { year, month };
}

async function getFilters(args) {
  const filters = [];

  if (args && args.syncLastTwoMonths) {
    filters.push(defaultFilter(true));
    filters.push(defaultFilter());
  } else if (args && args.yesToAllOnce) {
    filters.push(defaultFilter());
  } else {
    filters.push(await askForFilter());
  }
  return filters.map(f => parseFilter(f));
}

export default async function executeBBFlow({ args = null, ...action }) {
  const data = {};
  const { flow } = action;

  const username = action.username || (await askForUsername());
  const password = (args && args.password) || (await askForPassword(username));

  await bb.login({ ...username, password });
  let transactions = [];

  if (!flow.type || flow.type === 'checking') {
    const filters = await getFilters(args);

    transactions = await Promise.all(
      filters.map(filter => bb.checking.getTransactions(filter)),
    );
  } else if (flow.type === 'savings') {
    const filters = await getFilters(args);

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

    const bills = await creditCard.getBills();
    const bill = await askForBill(bills);

    transactions = await bill.getTransactions();
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
