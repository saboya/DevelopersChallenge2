import { ActionType, createAction } from 'typesafe-actions'
import Transaction from '../types/Transaction'

const LIST_REQUEST = '@nibo/transaction/LIST_REQUEST'
const LIST_SUCCESS = '@nibo/transaction/LIST_SUCCESS'
const UPLOAD_REQUEST = '@nibo/transaction/UPLOAD_REQUEST'
const UPLOAD_SUCCESS = '@nibo/transaction/UPLOAD_SUCCESS'

export const TransactionActions = {
  listRequest: createAction(LIST_REQUEST, resolve => {
    return () => resolve(null)
  }),
  listSuccess: createAction(LIST_SUCCESS, resolve => {
    return (transactionList: Transaction[]) => resolve(transactionList)
  }),
  uploadRequest: createAction(UPLOAD_REQUEST, resolve => {
    return (files: File[]) => resolve(files)
  }),
  uploadSuccess: createAction(UPLOAD_SUCCESS, resolve => {
    return (transactionList: Transaction[]) => resolve(transactionList)
  }),
}

export type TransactionActionTypes = ActionType<typeof TransactionActions>
