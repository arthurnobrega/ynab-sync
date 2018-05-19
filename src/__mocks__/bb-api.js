export default class BB {}

BB.prototype.login = () => {}

BB.prototype.getTransactions = ({ year, month }) => [
  {
    date: new Date(year, month - 1, 1),
    description: 'Test 1',
    amount: 1024.51,
  },
  {
    date: new Date(year, month - 1, 3),
    description: 'Test 2',
    amount: 57.20,
  },
  {
    date: new Date(year, month - 1, 5),
    description: 'Test 3',
    amount: 98.31,
  },
]

BB.prototype.getBalance = () => 1024.51
