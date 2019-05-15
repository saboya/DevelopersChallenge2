import { ActionType, createAction } from 'typesafe-actions'
import Balance from '../types/Balance'

const LIST_REQUEST = '@nibo/balance/LIST_REQUEST'
const LIST_SUCCESS = '@nibo/balance/LIST_SUCCESS'

export const BalanceActions = {
  listRequest: createAction(LIST_REQUEST, resolve => {
    return () => resolve(null)
  }),
  listSuccess: createAction(LIST_SUCCESS, resolve => {
    return (balanceList: Balance[]) => resolve(balanceList)
  }),
}

export type BalanceActionTypes = ActionType<typeof BalanceActions>
