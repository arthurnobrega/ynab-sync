import {
  askForFlowType,
  askForActionType,
  askForSavedActionsToRun,
  askToSaveAction,
  askForSavedActionsToDelete,
} from './questions';
import savedActions from './__mocks__/data/savedActions.json';
import FLOWS from './flows';

describe('Main questions', () => {
  test('should select nubank flow type', async () => {
    const type = await askForFlowType(FLOWS);

    expect(type).toHaveProperty('id');
    expect(type.id).toBe('nubank-card');
  });

  test('should return action type NEW', async () => {
    const actionType = await askForActionType();

    expect(actionType).toBe('NEW');
  });

  test('should return one saved action', async () => {
    const actions = await askForSavedActionsToRun(savedActions);

    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(savedActions[0]);
    expect(actions[0]).toHaveProperty('id');
    expect(actions[0]).toHaveProperty('when');
    expect(actions[0]).toHaveProperty('username');
    expect(actions[0]).toHaveProperty('account');
    expect(actions[0]).toHaveProperty('budget');
  });

  test('should return the second action to remove', async () => {
    const actions = await askForSavedActionsToDelete(savedActions);

    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual(savedActions[1]);
    expect(actions[0]).toHaveProperty('id');
    expect(actions[0]).toHaveProperty('when');
    expect(actions[0]).toHaveProperty('username');
    expect(actions[0]).toHaveProperty('account');
    expect(actions[0]).toHaveProperty('budget');
  });

  test('should confirm to save action', async () => {
    const save = await askToSaveAction();

    expect(save).toBe(true);
  });
});
