const pad = n => n.toString().padStart(2, '0');

export default function BB() {
  return {
    login: () => {},
    isLoggedIn: () => false,
    checking: {
      getTransactions: ({ year, month }) => [
        {
          date: new Date(`${year}-${pad(month)}-01T00:00:00Z`),
          description: 'Checking Transaction 1',
          amount: 1024.51,
        },
        {
          date: new Date(`${year}-${pad(month)}-03T00:00:00Z`),
          description: 'Checking Transaction 2',
          amount: -57.2,
        },
        {
          date: new Date(`${year}-${pad(month)}-05T00:00:00Z`),
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
              date: new Date(`${year}-${pad(month)}-01T00:00:00Z`),
              description: 'Savings Transaction 1',
              amount: 10.51,
            },
            {
              date: new Date(`${year}-${pad(month)}-03T00:00:00Z`),
              description: 'Savings Transaction 2',
              amount: -17.2,
            },
            {
              date: new Date(`${year}-${pad(month)}-05T00:00:00Z`),
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
              status: 'opened',
              cardAccountNumber: '12345678',
              billDate: '25022018',
              getTransactions: () => [
                {
                  type: 'payment',
                  date: new Date(`2018-01-01T00:00:00Z`),
                  description: 'Credit Card Transaction 1',
                  amount: 11.51,
                },
                {
                  type: 'atSight',
                  date: new Date(`2018-01-03T00:00:00Z`),
                  description: 'Credit Card Transaction 2',
                  amount: -7.2,
                },
                {
                  type: 'installment',
                  date: new Date(`2018-01-05T00:00:00Z`),
                  description: 'Credit Card Transaction 3',
                  amount: -8.31,
                },
              ],
            },
            {
              status: 'closed',
              cardAccountNumber: '12345678',
              billId: '123123123',
              billDate: '25012018',
              getTransactions: () => [
                {
                  type: 'payment',
                  date: new Date(`2018-01-01T00:00:00Z`),
                  description: 'Credit Card Transaction 1',
                  amount: 11.51,
                },
                {
                  type: 'atSight',
                  date: new Date(`2018-01-03T00:00:00Z`),
                  description: 'Credit Card Transaction 2',
                  amount: -7.2,
                },
                {
                  type: 'installment',
                  date: new Date(`2018-01-05T00:00:00Z`),
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
