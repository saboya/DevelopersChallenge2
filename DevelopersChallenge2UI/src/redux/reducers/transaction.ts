import { getType } from 'typesafe-actions'
import { TransactionActions, TransactionActionTypes } from '../actions'
import Transaction from '../types/Transaction'

export interface TransactionState {
  readonly byId: { readonly [key: string]: Readonly<Transaction> }
  readonly list: ReadonlyArray<Transaction['id']>
}

const initialState: TransactionState = {
  list: [],
  byId: {},
}

const addTransactionReducer = (state: TransactionState, transaction: Transaction) => {
  return {
    byId: { ...state.byId, [transaction.id]: transaction },
    list: state.list.includes(transaction.id) ? state.list : [...state.list, transaction.id],
  }
}

const reducer = (state: TransactionState = initialState, action: TransactionActionTypes) => {
  switch (action.type) {
    case getType(TransactionActions.listSuccess):
    case getType(TransactionActions.uploadSuccess):
      return action.payload.reduce(addTransactionReducer, state)
  }

  return state
}

export default reducer
