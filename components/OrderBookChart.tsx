import React from 'react'
import { Order } from '../types/OrderBook'
import { OrderBookRow } from './OrderBookRow';

type OrderBookChartProps = {
    orders: Order[];
    maxTotal: number;
  };
export const OrderBookChart = ({ orders, maxTotal}: OrderBookChartProps): JSX.Element =>
    <div style={{minHeight: '30vh'}}>
        {orders.map((o: Order) => (
            <OrderBookRow
                key={o.price}
                order={o}
                maxTotal={maxTotal}
            />
        ))}
    </div>