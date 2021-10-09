const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const numberFormat = new Intl.NumberFormat()

export const round = (value: number): number => Math.round(value * 100) / 100
export const asPrice = (value: number): string => priceFormat.format(value)
export const asNumber = (value: number): string => numberFormat.format(value)
