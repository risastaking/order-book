import React from 'react'
import { Order } from '../types/OrderBook'
import { OrderBookCell as OrderBookCell } from './OrderBookCell'
import './OrderBookChart.scss'

type OrderBookChartProps = {
    orders: Order[];
  };
export const OrderBookChart = ({ orders}: OrderBookChartProps): JSX.Element =>
    <section className="order-book-chart">
        <header>
            <span></span>
            <span>Price</span>
            <span>Size</span>
            <span>Total</span>
        </header>
        <article>
            {orders.map((o: Order) => (
                <OrderBookCell
                    key={o.price}
                    order={o}
                />
            ))}
        </article>
    </section>

