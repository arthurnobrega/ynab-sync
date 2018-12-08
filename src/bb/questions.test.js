import { askForUsername, askForPassword, askForFilter } from './questions';

describe('BB questions', () => {
  test('should return username', async () => {
    const username = await askForUsername();

    expect(username).toHaveProperty('branch', '12345');
    expect(username).toHaveProperty('account', '123456');
  });

  test('should return password', async () => {
    const username = await askForUsername();
    const password = await askForPassword(username);

    expect(password).toEqual('12345678');
  });

  test('should return filter', async () => {
    const filter = await askForFilter();

    expect(filter).toEqual('2018-01');
  });
});
