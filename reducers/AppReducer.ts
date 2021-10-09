import React from 'react'
import { AppAction } from '.'
import { WebSocketHook } from '../hooks/useWebSocket'
import { AppState } from '../types/App'

export enum ActionType {
  START = 'start',
  STOP = 'stop',
  TOGGLE = 'TOGGLE'
}
export type Action =
  | { type: ActionType.START, value: WebSocketHook }
  | { type: ActionType.STOP, value: React.Dispatch<any> }

export const AppReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
    case ActionType.START:
        return {
            ...state,
            socket: action.value,
        }
    default:
        return state
    }
}
