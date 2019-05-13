import { ActionType, createAction } from 'typesafe-actions'
import Transaction from '../types/Transaction'

const LIST_REQUEST = '@nibo/transaction/LIST_REQUEST'
const LIST_SUCCESS = '@nibp/transaction/LIST_SUCCESS'

export const TransactionActions = {
  listRequest: createAction(LIST_REQUEST, resolve => {
    return () => resolve(null)
  }),
  listSuccess: createAction(LIST_SUCCESS, resolve => {
    return (transactionList: Transaction[]) => resolve(transactionList)
  }),
}

export type TransactionActionTypes = ActionType<typeof TransactionActions>
