import executeBBFlow from '.'

describe('BB flow', () => {
  it('should return array of transactions in correct form', async () => {
    const { username, transactions } = await executeBBFlow()

    expect(username).toHaveProperty('branch', '12345')
    expect(username).toHaveProperty('account', '123456')
    expect(transactions.length).toEqual(3)
    expect(transactions[0]).not.toHaveProperty('import_id')
    expect(transactions[0]).toHaveProperty('amount')
    expect(transactions[0]).toHaveProperty('date')
    expect(transactions[0]).toHaveProperty('memo')
  })
})
