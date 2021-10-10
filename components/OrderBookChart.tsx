import React from 'react'
import { Order } from '../types/OrderBook'
import { OrderBookCell as OrderBookCell } from './OrderBookCell'

type OrderBookChartProps = {
    orders: Order[];
    side: 'bid' | 'ask';
  };
export const OrderBookChart = ({ orders, side}: OrderBookChartProps): JSX.Element =>
    <section className="order-book-chart">
        <header>
            <span>Price</span>
            <span>Size</span>
            <span>Total</span>
        </header>
        <article>
            {orders.map((o: Order) => (
                <OrderBookCell
                    key={o.price}
                    order={o}
                    side={side}
                />
            ))}
        </article>
    </section>

