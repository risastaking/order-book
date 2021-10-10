import React from 'react'
import { asNumber, asPrice } from '../formats'
import { Order } from '../types/OrderBook'

type OrderBookCellProps = {
  order: Order;
  side: 'bid' | 'ask';
};

export const OrderBookCell = ({ order, side}: OrderBookCellProps) : JSX.Element => {
    const color = side === 'bid' ? 'rgba(62, 121, 68, 1)' : 'rgba(209, 31, 61, 1)'

    return  <div
        style={{
            background: `linear-gradient(var(--gradient-direction), ${color} ${order.percentOfBook}, transparent ${order.percentOfBook})`,

        }}>
        <span> {asPrice(order.price)}</span>
        <span>{asNumber(order.size)}</span>
        <span>{asNumber(order.total)}</span>
    </div>

}
