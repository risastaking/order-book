# order-book
A real-time order book with configurable refresh rate and price levels.

## Configuration

App can be configured by setting variables in the `/config/index.ts` file.

| Configuration           | Description                                               | Default                              |
|-------------------------|-----------------------------------------------------------|--------------------------------------|
| **feedURL**             | The URL of the web socket which provides order data.      | wss://www.cryptofacilities.com/ws/v1 |
| **levelsDeep**          | The number of price levels to display in the depth chart. | 12                                   |
| **viewRefreshInterval** | Number of milliseconds between chart refreshes.           | 700                                  |


## Running the app

Run `npm i` and `npm start` to run the app locally via the Parcel development server.

## Tests

`npm t` will run unit tests to test critical functionality such as order totals and spread calculations.

## Live Demo

https://markdreyer.com/order-book/
