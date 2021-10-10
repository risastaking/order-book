import React from 'react'
import { asNumber, asPrice } from '../formats'
import { Order } from '../types/OrderBook'

type OrderBookRowProps = {
  order: Order;
  side: 'bid' | 'ask';
};

export const OrderBookRow = ({ order, side}: OrderBookRowProps) : JSX.Element => {

    return <svg className={side}>
        <rect width={order.percentOfBook} />
        <text x="10%" >
            {asPrice(order.price)}
        </text>
        <text x="40%">
            {asNumber(order.size)}
        </text>
        <text x="70%">
            {asNumber(order.total)}
        </text>
    </svg>
}
