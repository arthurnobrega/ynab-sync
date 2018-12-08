import inquirer from 'inquirer';
import executeNubankFlow from '.';
import savedActions from '../__mocks__/data/savedActions.json';

describe('Nubank card flow', () => {
  test('should return array of transactions in correct form', async () => {
    const flowType = {
      id: 'nubank-card',
      name: 'Nubank Credit Card',
      execute: executeNubankFlow,
    };
    const { username, transactions } = await executeNubankFlow({ flowType });

    expect(username).toEqual('45678932158');
    expect(transactions).toHaveLength(3);
    expect(transactions[0]).toHaveProperty('import_id');
    expect(transactions[0]).toHaveProperty('amount');
    expect(transactions[0]).toHaveProperty('date');
    expect(transactions[0]).toHaveProperty('memo');
  });

  test('should execute nubank credit card action without questions', async () => {
    const spy = jest.spyOn(inquirer, 'prompt');
    const response = await executeNubankFlow({
      ...savedActions[0],
      args: {
        yesToAllOnce: true,
        password: '123456',
      },
    });

    expect(spy).not.toHaveBeenCalled();
    expect(response).not.toHaveProperty('args');
  });

  // test('should execute nubank account action without questions', async () => {
  //   const spy = jest.spyOn(inquirer, 'prompt')
  //   const response = await executeNubankFlow({
  //     ...savedActions[1],
  //     args: {
  //       yesToAllOnce: true,
  //       password: '123456',
  //     },
  //   })

  //   expect(spy).not.toHaveBeenCalled()
  //   expect(response).not.toHaveProperty('args')
  // })
});
