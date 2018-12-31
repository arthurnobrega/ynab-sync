import { setLoginToken, requestNewToken, getBillByMonth } from './middleware';
import nubankToken from '../__mocks__/data/nubankToken.json';

describe('Nubank middleware', () => {
  test('should set token and return it', async () => {
    const {
      access_token: accessToken,
      refresh_before: refreshBefore,
      _links: links,
    } = nubankToken;

    const token = await setLoginToken(nubankToken);

    expect(token).toHaveProperty('access_token', accessToken);
    expect(token).toHaveProperty('refresh_before', refreshBefore);
    expect(token).toHaveProperty('_links', links);
  });

  test('should return new token', async () => {
    const token = await requestNewToken('45678932158');

    expect(token).toHaveProperty('access_token');
    expect(token).toHaveProperty('refresh_before');
    expect(token).toHaveProperty('_links');
  });

  test('should return bill by month', async () => {
    const { bill } = await getBillByMonth('2018-05');

    expect(bill).toHaveProperty('state');
    expect(bill).toHaveProperty('line_items');
  });
});
