import { SagaIterator } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import { TransactionActions } from '../actions';
import Transaction from '../types/Transaction';

const defaultOptions: RequestInit = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'GET',
}

function * listActionHandler (apiUrl: string, action: ActionType<typeof TransactionActions.listRequest>): SagaIterator {
  const response = yield call(fetch, apiUrl + '/api/transactions', defaultOptions)

  yield put(TransactionActions.listSuccess((yield response.json()) as Transaction[]))
}

function * NiboApiRequestsaga (apiUrl: string) {
  yield takeEvery(getType(TransactionActions.listRequest), listActionHandler, apiUrl)
}

export default NiboApiRequestsaga
