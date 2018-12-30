import BB from 'bb-api';
import md5 from 'md5';
import {
  askForUsername,
  askForPassword,
  defaultFilter,
  askForFilter,
} from './questions';

const bb = new BB();

async function getTransactionsFromDate({ flow, filter }) {
  const filterParts = filter.split('-');

  let response = null;
  if (!flow.type || flow.type === 'checking') {
    response = await bb.checking.getTransactions({
      year: filterParts[0],
      month: filterParts[1],
    });
  } else if (flow.type === 'savings') {
    const savingsAccounts = await bb.savings.getAccounts();

    response = await savingsAccounts[0].getTransactions({
      year: filterParts[0],
      month: filterParts[1],
    });
  }

  return response.map(transaction => {
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

export default async function executeBBFlow({ args = null, ...action }) {
  const username = action.username || (await askForUsername());

  const password = (args && args.password) || (await askForPassword(username));

  const filters = [];
  if (args && args.syncLastTwoMonths) {
    filters.push(defaultFilter(true));
    filters.push(defaultFilter());
  } else if (args && args.yesToAllOnce) {
    filters.push(defaultFilter());
  } else {
    filters.push(await askForFilter());
  }

  await bb.login({ ...username, password });

  const transactions = (await Promise.all(
    filters.map(filter =>
      getTransactionsFromDate({ flow: action.flow, filter }),
    ),
  )).reduce((acc, item) => acc.concat(item), []);

  const balance = await bb.checking.getBalance();
  return {
    ...action,
    balance,
    username,
    transactions,
  };
}
