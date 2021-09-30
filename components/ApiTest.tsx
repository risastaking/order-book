import React, { useEffect } from 'react'
import OrderBookService from '../services/OrderBookService'

const ApiTest = () => {
    let obs = new OrderBookService()
    useEffect(() => {
        obs.start()

        return () => {
            obs.stop()
        }
    }, [])
    return <div>Test</div>
}

export default ApiTest