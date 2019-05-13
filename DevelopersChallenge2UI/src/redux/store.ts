import { applyMiddleware, createStore, combineReducers, Middleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { StateType } from 'typesafe-actions'

import { TransactionActionTypes } from './actions'
import TransactionReducer from './reducers/transaction'
import AppSaga from './sagas/app'

const reducers = {
  transaction: TransactionReducer,
}

export type RootActionsType = TransactionActionTypes

export type StoreState = StateType<typeof reducers>

const sagaMiddleware = createSagaMiddleware()

const middlewares: Middleware[] = [sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createLogger } = require('redux-logger')

  const loggerMiddleware = createLogger({
    collapsed: true,
    timestamp: true,
  })

  middlewares.push(loggerMiddleware)
}

type RootReducer = typeof reducers[keyof typeof reducers]

export const Store = createStore(
  combineReducers<RootReducer, RootActionsType>(reducers),
  applyMiddleware(...middlewares),
)

sagaMiddleware.run(AppSaga)

export default Store
