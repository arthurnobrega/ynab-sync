import inquirer from 'inquirer';
import { isDate, parse, differenceInYears, isFuture } from 'date-fns';

export async function askForUsername() {
  const { bbBranch } = await inquirer.prompt([
    {
      type: 'string',
      name: 'bbBranch',
      message: 'Type in your BB branch number:',
      validate: answer => {
        if (!/^[0-9]{5}$/.test(answer)) {
          return "That's an invalid branch number, try again";
        }
        return true;
      },
    },
  ]);

  const { bbAccount } = await inquirer.prompt([
    {
      type: 'string',
      name: 'bbAccount',
      message: 'Type in your BB account number:',
      validate: answer => {
        if (!/^[0-9]{6,7}$/.test(answer)) {
          return "That's an invalid account number, try again";
        }
        return true;
      },
    },
  ]);
  return {
    branch: bbBranch,
    account: bbAccount,
  };
}

export async function askForPassword(username) {
  const { bbPassword } = await inquirer.prompt([
    {
      type: 'password',
      name: 'bbPassword',
      message: `Please enter a password for BB account "${username.branch} / ${
        username.account
      }"`,
      validate: answer => {
        if (answer.length < 1) {
          return 'You must type in the password, try again';
        }
        return true;
      },
    },
  ]);
  return bbPassword;
}

export function defaultFilter() {
  const date = new Date().toISOString().split('T')[0];
  return date.substring(0, 7);
}

export async function askForFilter() {
  const { filter } = await inquirer.prompt([
    {
      type: 'string',
      name: 'filter',
      message: 'From which date do you want to import (YYYY-MM):',
      default: defaultFilter,
      validate: answer => {
        if (!/^[0-9]{4}-[0-9]{2}$/.test(answer)) {
          return "That's an invalid format, try again";
        }
        const parsedAnswer = parse(answer);
        if (!isDate(parsedAnswer)) {
          return "That's an invalid date, try again";
        }
        if (differenceInYears(new Date(), parsedAnswer) >= 100) {
          return "That's too far in the past, try again";
        }
        if (isFuture(parsedAnswer)) {
          return "That's in the future, no time travels allowed, try again";
        }

        return true;
      },
    },
  ]);

  return filter;
}

export async function askForSavingsAccount(accounts) {
  const { bbSavingsAccount } = await inquirer.prompt([
    {
      type: 'list',
      name: 'bbSavingsAccount',
      message: 'Select the savings account:',
      choices: accounts.map(a => ({ value: a, name: a.description })),
    },
  ]);

  return bbSavingsAccount;
}

export async function askForCreditCard(creditCards) {
  const { bbCreditCard } = await inquirer.prompt([
    {
      type: 'list',
      name: 'bbCreditCard',
      message: 'Select the credit card:',
      choices: creditCards.map(a => ({
        value: a,
        name: `${a.brand} - ${a.cardNumber}`,
      })),
    },
  ]);

  return bbCreditCard;
}
