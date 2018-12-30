import chalk from 'chalk';
import yargs from 'yargs';
import executeYnabFlow from './ynab';
import db, { initializeDb } from './db';
import FLOWS from './flows';
import { printBalance } from './helpers';
import {
  askForFlowType,
  askForActionType,
  askForSavedActionsToRun,
  askToSaveAction,
  askForSavedActionsToDelete,
} from './questions';

initializeDb();

const { argv } = yargs
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
  });

export async function executeAction({ action, args }) {
  let flow = (action && action.flowType) || (await askForFlowType(FLOWS));
  flow = FLOWS.find(f => f.id === flow.id);

  const { transactions, ...remainingProps } = await flow.execute({
    ...action,
    flowType: flow,
    args: {
      ...args,
      password: args ? args[flow.passwordCommand] : '',
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
      flowType: { ...flow, execute: undefined },
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

export default async function main({ actionType = null, args = {} }) {
  if (!process.env.YNAB_TOKEN) {
    console.log(chalk.red('Set your YNAB_TOKEN. Please read the README.md.'));
    return false;
  }

  const initialActionType = args.yesToAllOnce ? 'FAVORITE' : actionType;
  const runActionType = initialActionType || (await askForActionType());

  switch (runActionType) {
    case 'NEW':
      await executeAction({ args });

      if (!args.yesToAllOnce) {
        main();
      }

      break;

    case 'FAVORITE': {
      const savedActions = db.get('favoriteActions').value();

      const actions =
        args && args.yesToAllOnce
          ? savedActions
          : await askForSavedActionsToRun(savedActions);
      await executeActionArray({ actions, args });

      if (!args.yesToAllOnce) {
        main();
      }

      break;
    }

    case 'DELETE': {
      const savedActions = db.get('favoriteActions').value();

      const actions = await askForSavedActionsToDelete(savedActions);
      actions.forEach(favoriteAction => {
        db.get('favoriteActions')
          .remove({ id: favoriteAction.id })
          .write();
      });

      if (!args.yesToAllOnce) {
        main();
      }

      break;
    }

    default:
  }

  return false;
}

// Run main if it was called by shell
if (require.main === module) {
  if (argv.syncLastTwoMonths) {
    argv.yesToAllOnce = true;
  }

  if (argv.yesToAllOnce) {
    main({ args: argv });
  } else {
    main();
  }
}
