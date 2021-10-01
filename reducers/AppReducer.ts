import { OrderBook } from '../types/order-book'

export const AppReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'start':
            let socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
            socket.onopen = () =>
                socket.send(
                    JSON.stringify({
                        event: 'subscribe',
                        feed: state.feed,
                        product_ids: [state.productId],
                    })
                )
            socket.onmessage = (event: any) => {
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
        case 'stop':
            action.value?.current?.close()
            return {
                ...state,
                socket: null,
                info: null,
                subscribed: null,
                book: { bids: [], asks: [] } as OrderBook,
            }
        default:
            return state
    }
}
