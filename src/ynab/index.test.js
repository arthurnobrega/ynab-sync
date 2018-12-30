import inquirer from 'inquirer';
import executeNubankFlow from '../nubank';
import executeBBFlow from '../bb';
import executeYnabFlow from '.';
import FLOWS from '../flows';
import savedActions from '../__mocks__/data/savedActions.json';

describe('YNAB flow', () => {
  test('should return action object for nubank credit card flow', async () => {
    const { transactions, ...remainingProps } = await executeNubankFlow({
      flowType: FLOWS[0],
    });
    const action = await executeYnabFlow(remainingProps, transactions);

    expect(action).toHaveProperty('username');
    expect(action).toHaveProperty('flowType');
    expect(action).toHaveProperty('budget');
    expect(action).toHaveProperty('budget.id');
    expect(action).toHaveProperty('budget.name');
    expect(action).toHaveProperty('account');
    expect(action).toHaveProperty('account.id');
    expect(action).toHaveProperty('account.name');
  });

  test('should return action object for nubank account flow', async () => {
    const { transactions, ...remainingProps } = await executeNubankFlow({
      flowType: FLOWS[1],
    });
    const action = await executeYnabFlow(remainingProps, transactions);

    expect(action).toHaveProperty('username');
    expect(action).toHaveProperty('flowType');
    expect(action).toHaveProperty('budget');
    expect(action).toHaveProperty('budget.id');
    expect(action).toHaveProperty('budget.name');
    expect(action).toHaveProperty('account');
    expect(action).toHaveProperty('account.id');
    expect(action).toHaveProperty('account.name');
  });

  test('should return action object for bb flow', async () => {
    const { transactions, ...remainingProps } = await executeBBFlow({
      flowType: FLOWS[2],
    });
    const action = await executeYnabFlow(remainingProps, transactions);

    expect(action).toHaveProperty('username');
    expect(action.username).toHaveProperty('branch');
    expect(action.username).toHaveProperty('account');
    expect(action).toHaveProperty('flowType');
    expect(action).toHaveProperty('budget');
    expect(action).toHaveProperty('budget.id');
    expect(action).toHaveProperty('budget.name');
    expect(action).toHaveProperty('account');
    expect(action).toHaveProperty('account.id');
    expect(action).toHaveProperty('account.name');
  });

  test('should return action object for bb flow without questions', async () => {
    const spy = jest.spyOn(inquirer, 'prompt');

    const args = { yesToAllOnce: true, password: '12456' };
    const { transactions, ...remainingProps } = await executeBBFlow({
      args,
      ...savedActions[2],
    });
    const action = await executeYnabFlow(
      { ...remainingProps, args },
      transactions,
    );

    expect(spy).not.toHaveBeenCalled();
    expect(action).toHaveProperty('username');
    expect(action.username).toHaveProperty('branch');
    expect(action.username).toHaveProperty('account');
    expect(action).toHaveProperty('flowType');
    expect(action).toHaveProperty('budget');
    expect(action).toHaveProperty('budget.id');
    expect(action).toHaveProperty('budget.name');
    expect(action).toHaveProperty('account');
    expect(action).toHaveProperty('account.id');
    expect(action).toHaveProperty('account.name');
  });
});
