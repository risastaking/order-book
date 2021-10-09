import { useState, useCallback, useEffect, useRef } from 'react'
import { FeedEvent } from '../types/events'

type WebSocketOptions = {
    onOpen: () => void;
    onMessage: (event: MessageEvent) => void;
    onClose: () => void;
    onError: (error: Event) => void;
    reconnect?: boolean;
};
export type WebSocketHook = {
    sendJson: (event: FeedEvent) => void;
};

export const useWebSocket = (
    url: string,
    { onMessage, onOpen, onClose, onError, reconnect = true }: WebSocketOptions
): WebSocketHook => {
    const [shouldReconnect, setShouldReconnect] = useState(reconnect)
    const websocket = useRef<unknown>(null)

    const initialize = useCallback(() => {
        const ws = new WebSocket(url)
        ws.onopen = () => onOpen?.()
        ws.onmessage = (event) => onMessage?.(event)
        ws.onerror = (error) => onError?.(error)
        ws.onclose = () => (shouldReconnect ? initialize() : onClose?.())
        websocket.current = ws
    }, [onClose, onError, onMessage, onOpen, shouldReconnect, url])

    useEffect(() => {
        initialize()
        return () => {
            setShouldReconnect(false)
            websocket.current?.close()
        }
    }, [])
    return {
        sendJson: (data: FeedEvent) =>
            websocket.current.send(JSON.stringify(data)),
    } as WebSocketHook
}
