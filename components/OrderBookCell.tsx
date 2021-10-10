import React from 'react'
import { asNumber, asPrice } from '../formats'
import { Order } from '../types/OrderBook'

type OrderBookCellProps = {
  order: Order;
};

export const OrderBookCell = ({ order}: OrderBookCellProps) : JSX.Element => {
    return  <div
        style={{
            background: `linear-gradient(var(--gradient-direction), var(--gradient-color) ${order.percentOfBook}, transparent ${order.percentOfBook})`,

        }}>
        <span></span>
        <span>{asPrice(order.price)}</span>
        <span>{asNumber(order.size)}</span>
        <span>{asNumber(order.total)}</span>
    </div>

}
