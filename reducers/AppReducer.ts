import React from "react"
import { AppState } from "../types/App"

export enum ActionType {
    START = 'start',
    STOP = 'stop',
    TOGGLE_FEED = 'toggle_feed',
}
type Action =
    | { type: ActionType.START; value: React.Dispatch<any> }
    | { type: ActionType.STOP }
    | { type: ActionType.TOGGLE_FEED; value: React.Dispatch<string> }


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
                socket,
            }
        case ActionType.STOP:
            state.socket?.send(
                JSON.stringify({
                    event: 'unsubscribe',
                    feed: state.feed,
                    product_ids: [state.productId],
                })
            )
            return {
                ...state,
                socket: null,
                info: null,
                subscribed: null,
                book: null,
            }
            case ActionType.TOGGLE_FEED:
                state.socket?.send(
                    JSON.stringify({
                        event: 'unsubscribe',
                        feed: state.feed,
                        product_ids: [state.productId],
                    }))
                    state.socket?.send(
                        JSON.stringify({
                            event: 'subscribe',
                            feed: state.feed,
                            product_ids: ['PI_ETHUSD'],
                        }))
            return {
                ...state,

            }
        default:
            return state
    }
}
