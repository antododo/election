
# Election App

## Dependencies
Install these prerequisites to follow along with the tutorial. See free video tutorial or a full explanation of each prerequisite.
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/


## Step 1. Install dependencies
```
$ npm install
```
## Step 2. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance. See free video tutorial for full explanation.


## Step 3. Compile & Deploy Election Smart Contract
`$ truffle migrate --compile-all --reset`
You must migrate the election smart contract each time your restart ganache.

## Step 4. Configure Metamask
- Unlock Metamask
- Connect metamask to your local Etherum blockchain provided by Ganache.
- Import an account provided by ganache.

## Step 5. Run the Front End Application
```
$ cd client
$ npm start
```
Visit this URL in your browser: http://localhost:3000

## Credit
https://github.com/dappuniversity/election/tree/2019_update

