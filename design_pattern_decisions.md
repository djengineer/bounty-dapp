# Design Patterns

The design pattern follows the Best Practices Guidelines.
Most notedly is the setting of the Pulling Pattern.
## Pulling pattern
Pulling pattern requires the user to withdraw ETH themselves,
instead of automatically pushing ETH into their accounts.


Custom design pattern would be the use of the Promised Balances.

## Locking Balances to ensure payment

The promised balances is used to ensure that the job posters have enough balance to pay the account which accepted and completed the job.

If the account balance is less than or equal to the promised amount, the account in unable to withdraw any more ETH from the smart contract.

## Protection from double entries 

Using the `required()` checks, protection from double entries are enabled.
Please see the comments in Bounty.sol contract for the details 

## Payment Fencing
Only the address which accepted the job can be paid from completing jobs 