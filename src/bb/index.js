import BB from 'bb-api';
import md5 from 'md5';
import {
  askForUsername,
  askForPassword,
  defaultFilter,
  askForFilter,
} from './questions';

const bb = new BB();

async function processBBDate(filter) {
  const filterParts = filter.split('-');

  const response = await bb.checking.getTransactions({
    year: filterParts[0],
    month: filterParts[1],
  });

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

export default async function executeBBFlow(_action = {}) {
  const { args, ...action } = _action;
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

  const result = await Promise.all(filters.map(date => processBBDate(date)));

  const transactions = result.reduce((acc, item) => acc.concat(item), []);

  const balance = await bb.checking.getBalance();
  return {
    ...action,
    balance,
    username,
    transactions,
  };
}
