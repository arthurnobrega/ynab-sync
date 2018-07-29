import executeNubankFlow from '.'

describe('Nubank card flow', () => {
  it('should return array of transactions in correct form', async () => {
    const flowType = {
      id: 'nubank-card',
      name: 'Nubank Credit Card',
      execute: executeNubankFlow,
    }
    const { username, transactions } = await executeNubankFlow({ flowType })

    expect(username).toEqual('45678932158')
    expect(transactions.length).toEqual(3)
    expect(transactions[0]).toHaveProperty('import_id')
    expect(transactions[0]).toHaveProperty('amount')
    expect(transactions[0]).toHaveProperty('date')
    expect(transactions[0]).toHaveProperty('memo')
  })
})
