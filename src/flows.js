import executeNubankFlow from './nubank';
import executeBBFlow from './bb';

export default [
  {
    id: 'nubank',
    type: 'credit-card',
    name: 'Nubank Credit Card',
    execute: executeNubankFlow,
    passwordCommand: 'nubankPassword',
  },
  {
    id: 'nubank',
    type: 'checking',
    name: 'Nubank NuConta',
    execute: executeNubankFlow,
    passwordCommand: 'nubankPassword',
  },
  {
    id: 'bb',
    type: 'checking',
    name: 'Banco do Brasil Checking',
    execute: executeBBFlow,
    passwordCommand: 'bbPassword',
  },
  {
    id: 'bb',
    type: 'savings',
    name: 'Banco do Brasil Savings',
    execute: executeBBFlow,
    passwordCommand: 'bbPassword',
  },
  {
    id: 'bb',
    type: 'credit-card',
    name: 'Banco do Brasil Credit Card',
    execute: executeBBFlow,
    passwordCommand: 'bbPassword',
  },
];
