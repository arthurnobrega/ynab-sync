import chalk from 'chalk';
import numeral from 'numeral';

export function formatUsername(username) {
  if (typeof username === 'object') {
    return Object.values(username).join(' / ');
  }

  return username;
}

export function formatAction({ flowType, username, account, budget }) {
  const formattedUsername = formatUsername(username);
  return `${flowType.name} ${formattedUsername} => YNAB ${account.name} (${
    budget.name
  })`;
}

export function printBalance(action) {
  if (action.balance) {
    const out = `${action.flowType.name} ${formatUsername(
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
