import React from 'react'
import { asNumber, asPrice } from '../formats'
import { Order } from '../types/OrderBook'

type OrderBookRowProps = {
  order: Order;
};

export const OrderBookRow = ({ order }: OrderBookRowProps) : JSX.Element => {

    return <svg>
        <rect width={order.percentOfBook} />
        <text x="10%">
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
