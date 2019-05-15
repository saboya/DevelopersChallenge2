import { getType } from 'typesafe-actions'
import { BalanceActions, BalanceActionTypes } from '../actions'
import Balance from '../types/Balance'

export interface BalanceState {
  readonly byId: { readonly [key: string]: Readonly<Balance> }
  readonly list: ReadonlyArray<Balance['id']>
}

const initialState: BalanceState = {
  list: [],
  byId: {},
}

const addBalanceReducer = (state: BalanceState, balance: Balance) => {
  return {
    byId: { ...state.byId, [balance.id]: balance },
    list: state.list.includes(balance.id) ? state.list : [...state.list, balance.id],
  }
}

const reducer = (state: BalanceState = initialState, action: BalanceActionTypes) => {
  switch (action.type) {
    case getType(BalanceActions.listSuccess):
      return action.payload.reduce(addBalanceReducer, state)
  }

  return state
}

export default reducer
