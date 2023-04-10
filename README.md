# Ethereum Kickstarter

Kickstarter clone with Ethereum and Solidity.

## Prerequisites

1. [Node.js](https://nodejs.org/en/)
2. MetaMask Chrome extension
3. Setup Sepolia test network in MetaMask
4. Get some test ether from [Sepolia Faucet](https://www.infura.io/faucet)

## How to run?

1. Install [Truffle](http://truffleframework.com/)
2. Install node modules: `npm install`
3. Signup for [Infura](https://infura.io/) and get an API key
4. Update the `infuraKey` in `ethereum/deploy.js` and `ethereum/web3.js` files
5. Deploy contracts in the ethereum folder: `node deploy.js`
6. Copy the address of the contract and paste it in the `ethereum/factory.js` file
7. Run the server: `npm start`
8. Go to `http://localhost:3000`
