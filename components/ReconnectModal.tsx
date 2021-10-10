import React from 'react'
import { ProductId } from '../types/App'

type ReconnectModalProps = {
    subscribed: boolean | null,
    productId: ProductId,
    handleReconnect: () => void,
  };

export const ReconnectModal = ({ subscribed, productId, handleReconnect }: ReconnectModalProps) =>
    <div className={`modal ${subscribed === false ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content has-text-centered">
            <h1 className="title has-text-white">Reconnect</h1>
            <h2 className="is-size-3 has-text-white">Your session was disconnected.</h2>
            <p>
                <button className="button is-primary" onClick={handleReconnect}>Reconnect to {productId}</button>
            </p>
        </div>
        <button className="modal-close is-large" onClick={handleReconnect} aria-label="close"></button>
    </div>