import { Dispatch, SetStateAction } from "react";
import {
    DeltaEvent,
    SubscribedEvent,
    InfoEvent,
    SnapshotEvent
} from "../types/events";
import { OrderBook } from "../types/order-book";

class OrderBookService {
    socket: WebSocket;
    subscribed: boolean = false;
    setBook: Dispatch<SetStateAction<OrderBook>>
    constructor(setBook: Dispatch<SetStateAction<OrderBook>>) {
        this.socket = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
        this.socket.onmessage = this.messageProcessor.bind(this)
        this.setBook = setBook
    }
    start() {
        this.socket.onopen = () => {
            this.socket.send('{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}')
        }
    }
    stop() {
        this.socket.close()
    }
    messageProcessor(event: MessageEvent): DeltaEvent | SnapshotEvent | InfoEvent | SubscribedEvent {
        let message = JSON.parse(event.data)
        switch (message?.event || message?.feed) {
            case 'info':
                console.log('1. info')
                console.log(message as InfoEvent)
                return message as InfoEvent
            case 'subscribed':
                console.log('2. subscribed')
                console.log(message as SubscribedEvent)
                return message as SubscribedEvent
            case 'book_ui_1_snapshot':
                console.log('3. snapshot')
                console.log(message as SnapshotEvent)
                let m = message as SnapshotEvent
                this.setBook({ asks: m.asks, bids: m.bids })
                return message as SnapshotEvent
            case 'book_ui_1':
                console.log('4. delta')
                console.log(message as DeltaEvent)
                return message as DeltaEvent
            default:
                console.error('Unknown message type')
                return message
        }
    }
}

export default OrderBookService
