pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Bounty.sol";

contract TestBounty {
  Bounty bounty = Bounty(DeployedAddresses.Bounty());
  uint public initialBalance = 1 ether;
  // Testing Adding User
	function testAddUser() public {
	  bool returnedsuccess = bounty.AddUser(12,"DJ","WONG","test@test.com");

	  bool expected = true;

	  Assert.equal(returnedsuccess, expected, "User not successfully saved");
	}
	// Testing Adding Job
	function testAddJob() public{
		bool returnedsuccess = bounty.AddJob.value(0.5 ether)("Job Title","Job Desc");
		bool expected = true;

	  Assert.equal(returnedsuccess, expected, "Job not successfully added");
	}
	// Testing Accepting Jobs
	function testAcceptJob() public{
		bool returnedsuccess = bounty.AcceptJob(0);
		bool expected = true;

	  Assert.equal(returnedsuccess, expected, "Job not successfully accepted");
	}
	// Checking if promised balance is correct
	function testPromisedBalance() public{
		uint returnedsuccess = bounty.GetMyPromisedAmount();
		uint expected = 0.5 ether;

	  Assert.equal(returnedsuccess, expected, "Promised balance is not 0.5 ether");
	}
	// test complete job
	function testCompleteJob() public{
		bool returnedsuccess = bounty.CompleteJob(0);
		bool expected = true;

	  Assert.equal(returnedsuccess, expected, "Job not successfully completed");
	}
	// once completed, the locked balance should have been erased
	function testPromisedBalanceAfterCompleteJob() public{
		uint returnedsuccess = bounty.GetMyPromisedAmount();
		uint expected = 0 ether;

	  Assert.equal(returnedsuccess, expected, "Promised balance is not 0 ether");
	}

	// 
	// isAdmin seems to not work here.
	// isAdmin works in the dApp, so perhaps truffle tests
	// cannot quite handle modifiers maybe?
	//
	// Remove isAdmin from AddJob to run the Stop tests thanks!
	//
	function testEmergencyStop() public{
		bool returnedsuccess = bounty.toggleContractActive();
		bool expected = true;

	  Assert.equal(returnedsuccess, expected, "Not Successfully Toggled");
	}
	// should revert here because the Emergency Stop has been invoked,
	// AddJob should not accept any transaction.
	function testAddJobAfterStop() public{
		bool returnedsuccess = bounty.AddJob.value(0.5 ether)("Job Title","Job Desc");
		bool expected = false;

	  Assert.equal(returnedsuccess, expected, "Problem with Toggling Active");
	}
}