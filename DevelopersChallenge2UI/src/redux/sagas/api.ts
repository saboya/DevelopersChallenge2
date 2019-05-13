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
    const response = yield call(fetch, apiUrl + '/api/transactions/upload_ofx_files', requestInit)
    const transactions = (yield response.json()) as Transaction[]

    yield put(TransactionActions.uploadSuccess(transactions))
  } catch(e) {
    console.log(e)
  }
}

function * listActionHandler (apiUrl: string, action: ActionType<typeof TransactionActions.listRequest>): SagaIterator {
  const response = yield call(fetch, apiUrl + '/api/transactions', defaultOptions)

  yield put(TransactionActions.listSuccess((yield response.json()) as Transaction[]))
}

function * NiboApiRequestsaga (apiUrl: string) {
  yield takeEvery(getType(TransactionActions.uploadRequest), uploadOfxFilesActionHandler, apiUrl)
  yield takeEvery(getType(TransactionActions.listRequest), listActionHandler, apiUrl)
}

export default NiboApiRequestsaga
