import { AppState } from '../types/App'
import { Action } from './AppReducer'

export const combineReducers =
    (...reducers: ((state: AppState, action: Action ) => AppState)[]) =>
        (state: any, action: any) =>
            reducers.reduce((newState, reducer) => reducer(newState, action), state)

export { AppReducer } from './AppReducer'
export { FeedReducer } from './FeedReducer'
