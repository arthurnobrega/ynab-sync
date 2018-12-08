import chalk from 'chalk';
import numeral from 'numeral';
import 'yargs';
import executeYnabFlow from './ynab';
import executeNubankFlow from './nubank';
import executeBBFlow from './bb';
import db, { initializeDb } from './db';
import {
  askForFlowType,
  askForActionType,
  askForSavedActionsToRun,
  askToSaveAction,
  askForSavedActionsToDelete,
  describeUsername,
} from './questions';

initializeDb();

export const FLOWTYPES = [
  {
    id: 'nubank-card',
    name: 'Nubank Credit Card',
    execute: executeNubankFlow,
    passwordCommand: 'nubankPassword',
  },
  {
    id: 'nubank-account',
    name: 'NuConta',
    execute: executeNubankFlow,
    passwordCommand: 'nubankPassword',
  },
  {
    id: 'bb',
    name: 'Banco do Brasil',
    execute: executeBBFlow,
    passwordCommand: 'bbPassword',
  },
];

function printBalance(action) {
  if (action.balance) {
    const out = `${action.flowType.name} ${describeUsername(
      action.username,
    )} balance: ${numeral(action.balance).format('$0,0.00')}`;
    const line = '='.repeat(out.length + 8);
    console.log(' ');
    console.log(chalk.green(line));
    console.log(' ');
    console.log(chalk.green(`==  ${out}  ==`));
    console.log(' ');
    console.log(chalk.green(line));
    console.log(' ');
  }
}

export async function executeAction(params = {}) {
  const { action, args } = params;

  let flowType =
    (action && action.flowType) || (await askForFlowType(FLOWTYPES));
  flowType = FLOWTYPES.find(flowT => flowT.id === flowType.id);

  const { transactions, ...remainingProps } = await flowType.execute({
    ...action,
    flowType,
    args: {
      ...args,
      password: args ? args[flowType.passwordCommand] : '',
    },
  });
  let actionOut = await executeYnabFlow(
    { ...remainingProps, args },
    transactions,
  );

  if (!actionOut) {
    return false;
  }

  printBalance(actionOut);

  if (!actionOut.id) {
    const save = await askToSaveAction();

    if (!save) {
      return false;
    }
  }

  if (actionOut.id) {
    db.get('favoriteActions')
      .remove({ id: action.id })
      .write();
  } else {
    actionOut = { ...actionOut, id: new Date().getTime() };
  }

  db.get('favoriteActions')
    .push({
      ...actionOut,
      transactions: undefined,
      flowType: { ...flowType, execute: undefined },
      when: new Date().getTime(),
    })
    .write();

  return true;
}

async function executeActionArray({ actions, args }) {
  let result = Promise.resolve();
  actions.forEach(action => {
    result = result.then(() => executeAction({ action, args }));
  });
  return result;
}

async function main(params = {}) {
  if (!process.env.YNAB_TOKEN) {
    console.log(
      chalk.red(
        'You need to set YNAB_TOKEN environment variable. Please read the README.md.',
      ),
    );
    return false;
  }

  const savedActions = db.get('favoriteActions').value();

  const { args } = params;
  const actionType = params.actionType || (await askForActionType());
  switch (actionType) {
    case 'NEW':
      await executeAction({ args });

      if (!args || !args.yesToAllOnce) {
        main();
      }

      break;

    case 'FAVORITE': {
      const actions =
        args && args.yesToAllOnce
          ? savedActions
          : await askForSavedActionsToRun(savedActions);
      await executeActionArray({ actions, args });

      if (!args || !args.yesToAllOnce) {
        main();
      }

      break;
    }

    case 'DELETE': {
      const actions = await askForSavedActionsToDelete(savedActions);
      actions.forEach(favoriteAction => {
        db.get('favoriteActions')
          .remove({ id: favoriteAction.id })
          .write();
      });

      if (!args || !args.yesToAllOnce) {
        main();
      }

      break;
    }

    default:
      return false;
  }

  return true;
}

export { main as default };

// Run main if it was called by shell
if (require.main === module) {
  const args = require('yargs') // eslint-disable-line
    .option('bbPassword', {
      default: '',
    })
    .option('nubankPassword', {
      default: '',
    })
    .option('yesToAllOnce', {
      alias: 'y',
      default: false,
    })
    .option('syncLastTwoMonths', {
      alias: 'fullSync',
      default: false,
    }).argv;

  if (args.syncLastTwoMonths) {
    args.yesToAllOnce = true;
  }

  if (args.yesToAllOnce) {
    main({ args, actionType: 'FAVORITE' });
  } else {
    main();
  }
}
