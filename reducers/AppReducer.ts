import React from "react"
import { AppState } from "../types/App"

export enum ActionType {
    START = 'start',
    STOP = 'stop',
}
type Action =
    | { type: ActionType.START; value: React.Dispatch<any> }
    | { type: ActionType.STOP; value: React.MutableRefObject<WebSocket> }

export const AppReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case ActionType.START:
            let socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
            socket.onopen = () =>
                socket.send(
                    JSON.stringify({
                        event: 'subscribe',
                        feed: state.feed,
                        product_ids: [state.productId],
                    })
                )
            socket.onmessage = (event: MessageEvent) => {
                requestAnimationFrame(() => {
                    let eventData = JSON.parse(event.data)
                    action.value({
                        type: eventData?.event || eventData?.feed,
                        value: eventData,
                    })
                })
            }
            return {
                ...state,
                socket: socket,
            }
        case ActionType.STOP:
            action.value?.current?.close()
            return {
                ...state,
                socket: null,
                info: null,
                subscribed: null,
                book: null,
            }
        default:
            return state
    }
}
