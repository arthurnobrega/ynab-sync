import executeNubankFlow from './nubank';
import executeBBFlow from './bb';

export default [
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
