import { AppActionType, AppAction, AppState } from '../types/App'

export const AppReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
    case AppActionType.START:
        return {
            ...state,
            socket: action.value,
        }
    default:
        return state
    }
}

