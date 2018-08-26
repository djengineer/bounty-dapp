pragma solidity 0.4.24;

//////////// NOTES //////////////
/*

Protections in place:
Solidity Pragma locked
Rentrancy protection
Overflow protection
Underflow protection
Circuit Breaker - Emergency stop by Contract Creator

Things to add for Real dApp:
Speed Bumps

*/

// lock pragma

contract Bounty{
	struct User{
		uint age;
		string fname;
		string lname;
		string email;
		address useraddress;
	}
	struct Job{
		address useraddress;//posted by
		uint job_id;
		string job_title;
		string job_description;
		uint job_price;
		bool accepted;
		address accepted_by;
		bool completed;
		bool paid;
	}
	// users variable with User struct as datastructure
	mapping (address => User) users;
	mapping (uint => Job) jobs;

	// array to save user accounts
	address[] public userAccounts;
	uint[] public jobList;
	//uint[] public acceptedjoblist;
	mapping (address => uint[]) myacceptedjoblist;
	// my promised amount locks the amount that is promised to workers
	// is only reduced when job is completed
	mapping (address => uint) mypromisedamount;
	// ETH transfers
	// balances stores ETH in the contract
    mapping (address => uint256) public balances;



	// Circuit Breaker
	bool private stopped = false;
	// msg.sender is the one creating the contract here outside of the functions
	address private owner = msg.sender;

	modifier isAdmin() {
	    require(msg.sender == owner);
	    _;
	}

	function toggleContractActive()
	isAdmin 
	public
	returns(bool success){
	    // You can add an additional modifier that restricts stopping a contract to be based on another action, such as a vote of users
	    stopped = !stopped;
	    return true;
	}

	modifier stopInEmergency { require(!stopped); _; }
	// normal operation and emergency can withdraw
	modifier onlyInEmergency { if (stopped) _; }
	event logAddUser(address accountAddress,uint _age, string _fname, string _lname, string _email);
	event logAddJob(string job_title, string job_description, uint job_price);
	event logJobsCount();
	function checkActive() public view returns(bool stoppedstatus){
		return stopped;
	}
	function AddUser(uint _age, string _fname, string _lname, string _email) 
	  public
	  stopInEmergency
	  returns(bool success)
		{
		User storage user =  users[msg.sender];
		// if new user
		if(bytes(users[msg.sender].fname).length == 0){
			userAccounts.push(msg.sender) - 1;
			user.fname = _fname;
			user.lname = _lname;
			user.email = _email;
			user.age = _age;
			user.useraddress = msg.sender;
		}else if(bytes(users[msg.sender].fname).length != 0){
			// if existing user, edit profile
			user.fname = _fname;
			user.lname = _lname;
			user.email = _email;
			user.age = _age;
			user.useraddress = msg.sender;
		}
		
		
		return (true);

	}
	function getAllUser() view public returns(address[]){
		return userAccounts;
	}
	function getUserData(address accountAddress) view public returns(uint, string, string,string){
		return (users[accountAddress].age,users[accountAddress].fname,users[accountAddress].lname,users[accountAddress].email);
	}
	function getMyAddress() view public returns(address){
		return msg.sender;
	}
	function AddJob(string job_title, string job_description) 
		stopInEmergency
		payable 
		public 
		returns(bool success)
	{
		// overflow protection
    	require(balances[msg.sender] + msg.value > balances[msg.sender]);
		// the number will be used as job id
		uint job_id = jobList.length;
		Job storage job = jobs[job_id];
		job.useraddress = msg.sender;
		job.job_title = job_title;
		job.job_description = job_description;
		job.job_price = msg.value;
		jobList.push(job_id);
		balances[msg.sender] += msg.value;
		mypromisedamount[msg.sender] += msg.value;
		return true;
	}
	function JobsCount() view public returns(uint count){
		return uint(jobList.length);
	}
	function ShowJobList() view public returns(uint[]){
		return jobList;
	}
	function ShowJobs(uint job_id) view public returns(uint,string,string,uint,bool){
		return (job_id,jobs[job_id].job_title,jobs[job_id].job_description,jobs[job_id].job_price,jobs[job_id].accepted);
	}
	function MyAcceptedJobsID() view public returns(uint[] job_ids){
		return myacceptedjoblist[msg.sender];
	}
	function ShowMyAcceptedJobs(uint job_id) view public returns(uint,string,string,uint,bool){
		return (job_id,jobs[job_id].job_title,jobs[job_id].job_description,jobs[job_id].job_price,jobs[job_id].completed);
	}
	function AcceptJob(uint job_id) 
	public 
	stopInEmergency
	returns(bool success){
		require(jobs[job_id].accepted != true);
		myacceptedjoblist[msg.sender].push(job_id);
		jobs[job_id].accepted = true;
		jobs[job_id].accepted_by = msg.sender;
		return true;
	}
	function CompleteJob(uint job_id)
	stopInEmergency
	public
	returns(bool){
		// only the person who accepted can complete it
		require(msg.sender == jobs[job_id].accepted_by);
		// Check if the sender has enough
		uint amount = jobs[job_id].job_price;
		address job_poster = jobs[job_id].useraddress;
    	//uint balance = balances[job_poster];
    	//require(balance >= amount); // will cause error
		jobs[job_id].completed = true;
		balances[job_poster] -= amount;
		mypromisedamount[job_poster] -= amount;
		balances[msg.sender] += amount;
		return true;
	}

    event LogDeposit(address sender, uint amount);
    event LogWithdrawal(address receiver, uint amount);
    event LogTransfer(address sender, address to, uint amount);

    function Deposit() stopInEmergency internal returns(bool) {
    	
        balances[msg.sender] += msg.value;
        emit LogDeposit(msg.sender, msg.value);
        return true;
    }

    function Withdraw() external{
    	uint withdraw_amount = balances[msg.sender] - mypromisedamount[msg.sender];
    	// underflow protection
    	require(balances[msg.sender] - withdraw_amount < balances[msg.sender]);
    	require(balances[msg.sender] > mypromisedamount[msg.sender]);
        balances[msg.sender] -= withdraw_amount;
        msg.sender.transfer(withdraw_amount);
        
    }
    function GetMyPromisedAmount() public view returns(uint){
    	return mypromisedamount[msg.sender];
    }

    function GetMyBalance() public view returns(uint){
    	return balances[msg.sender];
    }

    event LogFallback(address sender);
    function () public{
    	emit LogFallback(msg.sender);
    }

    // fallback function

    
}