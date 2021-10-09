import { useEffect, useState } from 'react'

export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(!document.hidden)
    const onVisibilityChange = () => setIsVisible(!document.hidden)

    useEffect(() => {
        document.addEventListener('visibilitychange', onVisibilityChange, false)

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [])
    return isVisible
}