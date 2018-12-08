import { askForUsername, askForPassword, askForFilter } from './questions';

describe('Nubank questions', () => {
  test('should return username', async () => {
    const username = await askForUsername();

    expect(username).toEqual('45678932158');
  });

  test('should return password', async () => {
    const password = await askForPassword('45678932158');

    expect(password).toEqual('123456');
  });

  test('should return filter', async () => {
    const filter = await askForFilter();

    expect(filter).toEqual('2018-01');
  });
});
