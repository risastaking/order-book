import React from 'react'
import { Order } from '../types/OrderBook'
import { OrderBookCell as OrderBookCell } from './OrderBookCell'

type OrderBookChartProps = {
    orders: Order[];
    side: 'bid' | 'ask';
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

