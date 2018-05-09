import executeNubankFlow from '.'

describe('Nubank flow', () => {
  it('should return array of transactions in correct', async () => {
    const { username, transactions } = await executeNubankFlow()

    expect(username).toEqual('45678932158')
    expect(transactions.length).toEqual(3)
    expect(transactions[0]).toHaveProperty('import_id')
    expect(transactions[0]).toHaveProperty('amount')
    expect(transactions[0]).toHaveProperty('date')
    expect(transactions[0]).toHaveProperty('payee_name')
    expect(transactions[0]).toHaveProperty('memo')
  })
})
