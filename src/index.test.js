import main, { executeAction } from '.';
import savedActions from './__mocks__/data/savedActions.json';

describe('Main', () => {
  test('should return false if passing invalid actionType', async () => {
    const response = await main({ actionType: 'x' });

    expect(response).toBe(false);
  });

  test('should execute favorited nubank action', async () => {
    const response = await executeAction(savedActions[0]);

    expect(response).toBe(true);
  });

  test('should execute favorited bb action', async () => {
    const response = await executeAction(savedActions[0]);

    expect(response).toBe(true);
  });
});
