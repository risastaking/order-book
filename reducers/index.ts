import { AppState } from '../types/App'
import { Action } from './AppReducer'
import { FeedAction } from './FeedReducer'

export const combineReducers =
    (...reducers: ((state: AppState, action: Action | FeedAction ) => AppState)[]) =>
        (state: AppState, action: Action | FeedAction) =>
            reducers.reduce((newState, reducer) => reducer(newState, action), state)

export { AppReducer } from './AppReducer'
export { FeedReducer } from './FeedReducer'
