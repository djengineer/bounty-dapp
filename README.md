# Wong Ding Jie
## Consesys Developers Programme 2018
## Bounty dApp

### Project Description
This is a dApp for posting, accepting and completing jobs.

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

