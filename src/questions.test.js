import { askForFlowType, askForActionType, askForSavedActionsToRun, askToSaveAction, askForSavedActionsToDelete } from './questions'
import savedActions from './__mocks__/data/savedActions.json'
import { flows } from '.'

describe('Main questions', () => {
  it('should select nubank flow type', async () => {
    const type = await askForFlowType()

    expect(type).toBe('nubank')
  })

  it('should return action type NEW', async () => {
    const actionType = await askForActionType()

    expect(actionType).toBe('NEW')
  })

  it('should return one saved action', async () => {
    const actions = await askForSavedActionsToRun(flows[0], savedActions)

    expect(actions.length).toEqual(1)
    expect(actions[0]).toEqual(savedActions[0])
    expect(actions[0]).toHaveProperty('id')
    expect(actions[0]).toHaveProperty('when')
    expect(actions[0]).toHaveProperty('username')
    expect(actions[0]).toHaveProperty('account')
    expect(actions[0]).toHaveProperty('budget')
  })

  it('should return the second action to remove', async () => {
    const actions = await askForSavedActionsToDelete(flows[0], savedActions)

    expect(actions.length).toEqual(1)
    expect(actions[0]).toEqual(savedActions[1])
    expect(actions[0]).toHaveProperty('id')
    expect(actions[0]).toHaveProperty('when')
    expect(actions[0]).toHaveProperty('username')
    expect(actions[0]).toHaveProperty('account')
    expect(actions[0]).toHaveProperty('budget')
  })

  it('should confirm to save action', async () => {
    const save = await askToSaveAction()

    expect(save).toBe(true)
  })
})
