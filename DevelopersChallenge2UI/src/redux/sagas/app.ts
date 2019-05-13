import { fork, put } from 'redux-saga/effects'
import NiboApiRequestsaga from './api'

import { TransactionActions } from '../actions';

export const NIBO_API_URL = (
  (process.env.NIBO_API_HOST || ('//' + window.location.hostname))
  + (process.env.NIBO_API_PORT || window.location.port)
)

function * NiboAppSaga () {
  yield fork(NiboApiRequestsaga, NIBO_API_URL)
  yield put(TransactionActions.listRequest())
}

export default NiboAppSaga
