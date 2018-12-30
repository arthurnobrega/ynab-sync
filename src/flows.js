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
    name: 'NuConta',
    execute: executeNubankFlow,
    passwordCommand: 'nubankPassword',
  },
  {
    id: 'bb',
    type: 'checking',
    name: 'Banco do Brasil',
    execute: executeBBFlow,
    passwordCommand: 'bbPassword',
  },
];
