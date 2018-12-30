export default function BB() {
  return {
    login: () => {},
    checking: {
      getTransactions: ({ year, month }) => [
        {
          date: new Date(year, month - 1, 1),
          description: 'Checking Transaction 1',
          amount: 1024.51,
        },
        {
          date: new Date(year, month - 1, 3),
          description: 'Checking Transaction 2',
          amount: -57.2,
        },
        {
          date: new Date(year, month - 1, 5),
          description: 'Checking Transaction 3',
          amount: -98.31,
        },
      ],
      getBalance: () => 1024.51,
    },
    savings: {
      getAccounts: () => [
        {
          getTransactions: ({ year, month }) => [
            {
              date: new Date(year, month - 1, 1),
              description: 'Savings Transaction 1',
              amount: 10.51,
            },
            {
              date: new Date(year, month - 1, 3),
              description: 'Savings Transaction 2',
              amount: -17.2,
            },
            {
              date: new Date(year, month - 1, 5),
              description: 'Savings Transaction 3',
              amount: -18.31,
            },
          ],
        },
      ],
    },
    creditCard: {
      getCards: () => [
        {
          getBills: () => [
            {
              cardAccountNumber: '12345678',
              billId: '123123123',
              billDate: '25012018',
              getTransactions: () => [
                {
                  type: 'payment',
                  date: new Date(2018, 0, 1),
                  description: 'Credit Card Transaction 1',
                  amount: 11.51,
                },
                {
                  type: 'atSight',
                  date: new Date(2018, 0, 3),
                  description: 'Credit Card Transaction 2',
                  amount: -7.2,
                },
                {
                  type: 'installment',
                  date: new Date(2018, 0, 5),
                  description: 'Credit Card Transaction 3',
                  amount: -8.31,
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
