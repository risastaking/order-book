import React from 'react'
import { Order } from '../types/OrderBook'
import { OrderBookRow } from './OrderBookRow'

type OrderBookChartProps = {
    orders: Order[];
    side: 'bid' | 'ask';
  };
export const OrderBookChart = ({ orders, side}: OrderBookChartProps): JSX.Element =>
    <div className="order-book-chart" style={{minHeight: '20vh', minWidth: '320px'}}>
        {orders.map((o: Order) => (
            <OrderBookRow
                key={o.price}
                order={o}
                side={side}
            />
        ))}
    </div>