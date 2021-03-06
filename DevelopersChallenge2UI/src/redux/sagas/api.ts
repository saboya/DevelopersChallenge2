import { SagaIterator } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import { BalanceActions, TransactionActions } from '../actions';
import Balance from '../types/Balance'
import Transaction from '../types/Transaction';

const defaultOptions: RequestInit = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'GET',
}

function * uploadOfxFilesActionHandler (apiUrl: string, action: ActionType<typeof TransactionActions.uploadRequest>) {
  const formData = new FormData();

  action.payload.map((file, index) => {
    formData.append('files', file);
  });

  const requestInit = {
    method: 'POST',
    body: formData,
  }

  try {
    const response = (yield call(fetch, apiUrl + '/api/ofx/uploadFiles', requestInit)) as Response
    if (response.ok) {
      yield put(TransactionActions.uploadSuccess([]))
      yield put(TransactionActions.listRequest())
      yield put(BalanceActions.listRequest())
    }
  } catch(e) {
    console.log(e)
  }
}

function * listBalancesActionHandler (apiUrl: string, action: ActionType<typeof TransactionActions.listRequest>): SagaIterator {
  const response = yield call(fetch, apiUrl + '/api/balance', defaultOptions)

  yield put(BalanceActions.listSuccess((yield response.json()) as Balance[]))
}

function * listTransactionsActionHandler (apiUrl: string, action: ActionType<typeof TransactionActions.listRequest>): SagaIterator {
  const response = yield call(fetch, apiUrl + '/api/transactions', defaultOptions)

  yield put(TransactionActions.listSuccess((yield response.json()) as Transaction[]))
}

function * NiboApiRequestsaga (apiUrl: string) {
  yield takeEvery(getType(TransactionActions.uploadRequest), uploadOfxFilesActionHandler, apiUrl)
  yield takeEvery(getType(TransactionActions.listRequest), listTransactionsActionHandler, apiUrl)
  yield takeEvery(getType(BalanceActions.listRequest), listBalancesActionHandler, apiUrl)
}

export default NiboApiRequestsaga
