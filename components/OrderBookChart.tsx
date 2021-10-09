import React from 'react'
import { Order } from '../types/OrderBook'
import { OrderBookRow } from './OrderBookRow'
import './OrderBookChart.css'
type OrderBookChartProps = {
    orders: Order[];
  };
export const OrderBookChart = ({ orders}: OrderBookChartProps): JSX.Element =>
    <div className="order-book-chart" style={{minHeight: '30vh'}}>
        {orders.map((o: Order) => (
            <OrderBookRow
                key={o.price}
                order={o}
            />
        ))}
    </div>