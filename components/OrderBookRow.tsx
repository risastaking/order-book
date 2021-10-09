import React from 'react'
import { round } from '../formats'
import { Order } from '../modules/order-book/OrderBook'

type OrderBookRowProps = {
  order: Order;
  maxTotal: number;
};

export const OrderBookRow = ({ order, maxTotal }: OrderBookRowProps) => {
    const percentWidth = round((order.total / maxTotal) * 100) + '%'

    return <svg width="100%" height="15">
        <rect x="0" y="0" width={percentWidth} height="100%" fill="#33b5e5" />
        <text x="10%" y="50%" dominantBaseline="middle" textAnchor="left">
            {order.price}
        </text>
        <text x="40%" y="50%" dominantBaseline="middle" textAnchor="left">
            {order.size}
        </text>
        <text x="70%" y="50%" dominantBaseline="middle" textAnchor="left">
            {order.size}
        </text>
    </svg>

//   return (
//     <div
//       style={{
//         width: percentWidth,
//         backgroundColor: "#33b5e5",
//       }}
//     >
//       <span style={{ flexGrow: 1, maxWidth: "30%" }}>{order.price}</span>
//       <span style={{ flexGrow: 1, maxWidth: "30%" }}>{order.size} </span>
//       <span style={{ flexGrow: 1, maxWidth: "30%" }}>{order.total}</span>
//     </div>
//   );
}
