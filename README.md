# Wong Ding Jie
## Consesys Developers Programme 2018
## Bounty dApp

### Project Description
This is a dApp for posting, accepting and completing jobs.

## Dev Notes:
- There will be errors in the test. Please see Test Notes below.
- Please update metamask to the latest version.

- I could not access the EthPM website. It just could not load up for me.
- I have tried to use IPFS for user profile photos but I could not access
the IPFS nodes in the ipfs web, even with the IPFS companion.

## Flow:
1st User can add a job and will have to pay in the amount that is offered for the job.
I.e. If I post a "Web Building Job Request" for 2.3 ETH, I will have to pay 2.3 ETH
to the smart contract. The 2.3 ETH is locked into a variable called Promised Balance.
This is to ensure that there is enough ETH to pay the person who accepts and completes the job.

Refreshing the page will show the new job posting listed.

2nd User (with a different address) can accept the job, and it will also be listed in the page.

Upon completion of the job, the amount in ETH is immediately transfered from the Job Poster's balance to the completing user. Job Poster's locked balance will be reduced accordingly.

Finally, 2nd user is able to withdraw ETH out from the smart contract.

### Emergency Stop
Emergency Stop (Circuit Breaker) can only be done by contract owner.



### How to set up and use with Ubuntu

Start Ganache with "ganache-cli". The default port for ganache-cli is 8545.
If you are using ganache gui, the default is port is 7545.

Change directory to bounty-app

Run truffle commands:

`truffle compile`

`truffle migrate --reset`


### Run Lite-Server

`npm run dev`

URL in the browser would be:

`localhost:3000`

### Use Metamask for transactions
- On localhost:8545 network in Metamask

# Protections in place

### Solidity Pragma locked
- Ensure that the contract can be compiled.

### Rentrancy protection
- Complete all internal calculations and transfers before .transfer()

### Overflow protection
- Prevents transactions from taking place if uint balances overflows

### Underflow protection
- Similar to Overflow

### Circuit Breaker
- Emergency stop by Contract Creator

### Crosssite-Scripting protection

# More things to add for Real dApp:
Speed Bumps

# Testing
### Starting the test
`truffle test`

### Testing notes
The Truffle test with the emergency stop(circuit breaker) function will fail. 
But it dApp works as intended, the contract also works well with Remix.

If we want to have a successful test run, we can remove isAdmin modifier from the 
toggleContractActive() function in the contract

### Please feel free to create an issue for questions thanks!
:D