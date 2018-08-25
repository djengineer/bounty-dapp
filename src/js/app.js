ModalControl = {
  show : function(){
    // Get the modal
        var modal = document.getElementById('myModal');
        var c = document.getElementById('modal-content').children;
        $(c[1]).html(`<div class="alert alert-success" role="alert">
              SUCCESS
             </div>`);
        c[1].style.color = 'green';
        $(c[2]).html(`Transaction successfully <b>CONFIRMED</b> by the block!<br>If in doubt,please look at the <span style="font-weight: bold;color:orange;font-size:1.2em;">Metamask</span> transaction and wait for the transaction to be <br>
          <span style="font-weight: bold;color:grey;font-size:1.3em;">CONFIRMED</span>`);
        modal.style.display = "block";
  },
  show_withdraw_error : function(){
    // Get the modal
        var modal = document.getElementById('myModal');
        var modalcontent = document.getElementById('modal-content');
        modalcontent.style.borderColor = 'rgb(104, 11, 50)';
        var c = document.getElementById('modal-content').children;
        $(c[1]).html(`<div class="alert alert-danger" role="alert">
          Error
          </div>`);
        c[1].style.color = 'red';
        c[2].style.fontSize = '2em';
        $(c[2]).html(`There was an error in withdrawing.<br>Please check that <span style='color:green;'>available balances</span> are more than the <span style='color:red;'>promised(locked) balances</span>.`);
        modal.style.display = "block";

  },
  show_general_error : function(){
    // Get the modal
        var modal = document.getElementById('myModal');
        var modalcontent = document.getElementById('modal-content');
        modalcontent.style.borderColor = 'rgb(104, 11, 50)';
        var c = document.getElementById('modal-content').children;
        $(c[1]).html(`<div class="alert alert-danger" role="alert">
          Error
          </div>`);
        c[1].style.color = 'red';
        c[2].style.fontSize = '2em';
        $(c[2]).html(`There was an error in the transaction.<br>If you did not cancel the transaction in <span style="font-weight: bold;color:orange;font-size:1.2em;">Metamask</span>, please check if Gas, Gas Price and other relavant parameters are correct.`);
        modal.style.display = "block";

  },
  show_spinner: function(){
    var modal = document.getElementById('spinnermodal');
    modal.style.display = "block";
  },
  close_spinner:function(){
    var modal = document.getElementById('spinnermodal');
    modal.style.display = "none";
  },
};


App = {
  web3Provider: null,
  contracts: {},

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    }
    web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Bounty.json', function(data) {
      //console.log("Data is : " + JSON.stringify(data));
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BountyArtifact = data;
      App.contracts.Bounty = TruffleContract(BountyArtifact);

      // Set the provider for our contract
      App.contracts.Bounty.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      //return App.showAllJobs();
      //App.showAcceptedJobs()
      return App.showAllDisplays();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#add-user-submit', App.addUser);
    $(document).on('click', '#show-all-users-btn', App.showAllUsers);
    $(document).on('click', '#show-my-address-btn', App.showMyAddress);
    $(document).on('click', '#show-my-balance-btn', App.showMyBalance);
    $(document).on('click', '#show-my-promised-balance-btn', App.showMyPromisedBalance);
    $(document).on('click', '#add-job-submit', App.addJob);
    $(document).on('click', '.btn-accept-job', App.acceptJob);
    $(document).on('click', '.btn-complete-job', App.completeJob);
    $(document).on('click', '#withdraw-eth-btn', App.withdrawEth);
    $(document).on('click', '#e-stop-btn', App.eStop);
  },
  waitForConfirmation:function(){
    ModalControl.show_spinner();
    // assume latest block is latest confirmed
    
    web3.eth.filter('latest',function(error,result){
      if(!error){
        ModalControl.close_spinner();
        ModalControl.show();
        console.log(result);
      }else if(error){
        ModalControl.close_spinner();
        ModalControl.show_general_error();
      }
    });
  },
  showAllDisplays: function(){
      console.log("show all displays");
      App.showAllJobs().then(App.showAcceptedJobs()).then(App.showStatus());
      
    
  },//show all dispsplay
  showStatus: function(){
    console.log("Show All User Clicked");
    var bountyInstance;
    App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        return bountyInstance.checkActive.call();
        }).then(function(status){
            if(status == true){
              $('#ContractStatus').html('<div class="alert alert-danger" role="alert">Contract is stopped by circuit breaker.</div>');
            }else if(status==false){
              $('#ContractStatus').html('<div class="alert alert-success" role="alert">Contract is running.</div>');
            }else{
              $('#ContractStatus').html('<div class="alert alert-warning" role="alert">Unable to get contract status.</div>');
            }
            });
  },
  showAllUsers: function(){
    console.log("Show All User Clicked");
    var bountyInstance;
    App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        return bountyInstance.getAllUser.call();
        }).then(function(users){
            console.log("users:" + JSON.stringify(users));
            console.log("users length:" + JSON.stringify(users.length));
            document.getElementById('user_data').innerHTML = JSON.stringify(users);
            });
  },
  /*
  showMyAddress:function(){
    console.log("Show My Address Clicked");
    var bountyInstance;
    App.contracts.Bounty.deployed().then(function(instance) {
      bountyInstance = instance;
      console.log("Instance called");
      return bountyInstance.getMyAddress.call();
    }).then(function(address){
      console.log(address);
      document.getElementById('my_address').innerHTML = address;
    });
  },*/
  showMyAddress:function(event){
    event.preventDefault();
    console.log("Show My Address Clicked");
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      var bountyInstance;
      App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        return bountyInstance.getMyAddress.call({from:account});
      }).then(function(address){
        console.log(address);
        document.getElementById('my_address').innerHTML = address;
      });
    });//web3
  },
  showMyBalance:function(event){
    event.preventDefault();
    console.log("Show My Balance Clicked");
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      var bountyInstance;
      App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        return bountyInstance.GetMyBalance.call({from:account});
      }).then(function(balance){
        console.log(balance);
        document.getElementById('my_balance').innerHTML = web3.fromWei(balance,'ether')+" ETH";
      });
    });//web3
  },
  showMyPromisedBalance:function(event){
    event.preventDefault();
    console.log("Show My Promsied Balance Clicked");
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      var bountyInstance;
      App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        return bountyInstance.GetMyPromisedAmount.call({from:account});
      }).then(function(balance){
        console.log(balance);
        document.getElementById('my_promised_balance').innerHTML = web3.fromWei(balance,'ether')+" ETH";
      });
    });//web3
  },
  addUser:function(event){
    event.preventDefault();
    var bountyInstance;
    web3.eth.getAccounts(function(error, accounts) {
      
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      console.log("account: "+account);
      console.log("Add User Submit Clicked");
      App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        var form = document.getElementById('add-user-form');
        var fname = form.elements[0].value;
        var lname = form.elements[1].value;
        var age = form.elements[2].value;
        var email = form.elements[3].value;
        console.log("fname: " + fname);
        console.log("lname: " + lname);
        console.log("age: " + age);
        console.log("email: " + email);
        //return bountyInstance.getMyAddress.call();
        return bountyInstance.AddUser(age,fname,lname,email,{from: account});

      }).then(function(response){
        App.waitForConfirmation();
      }).catch(function(err) {
        console.log(err.message);
      });;
    });//get web3 account
  },//add user
  addJob:function(event){
    console.log("Add job submit cliced");
    event.preventDefault();
    var bountyInstance;
    web3.eth.getAccounts(function(error, accounts) {
      
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      console.log("account: "+account);
      App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        var form = document.getElementById('add-job-form');
        var job_title = form.elements[0].value;
        var job_desc = form.elements[1].value;
        var job_price = form.elements[2].value;
        console.log("b price tilte: " + escape(job_title));
        console.log("job desc: " + escape(job_desc));
        console.log("age: " + job_price);
        job_price_wei = web3.toWei(job_price, 'ether');
        //return bountyInstance.getMyAddress.call();
        return bountyInstance.AddJob(job_title,job_desc,{from: account,value: job_price_wei,gas:900000,gasPrice:1000000000});

      }).then(function(response){
        console.log(response);
        
        App.waitForConfirmation();
        //document.getElementById('add_job_form_status').innerHTML = "success";
        
      }).catch(function(err) {
        console.log(err.message);
      });;
    });//get web3 account
  },//add job
  showAllJobs:async function(){
   // event.preventDefault();
    console.log("Show All Jobs Called");
    var jobs = [];
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      
      App.contracts.Bounty.deployed().then(function(instance) {
        var bountyInstance;
        bountyInstance = instance;
        let get_count = new Promise((resolve,reject)=>{
                              var a = bountyInstance.JobsCount.call({from:account});
                              if(error){
                                reject(error);
                              }else{
                                resolve(a);
                              }
                          });
        get_count.then(function(count){
          for(var i=0;i<count;i++){
            let get_data = new Promise((resolve,reject)=>{
                              var data = bountyInstance.ShowJobs.call(i,{from:account});
                              if(error){
                                reject(error);
                              }else{
                                resolve(data);
                              }
                          });

            get_data.then(function(data){
              //console.log(data);
                jobs_table = document.getElementById('jobs_view_all');

                var row = jobs_table.insertRow();

                var cell0 = row.insertCell(0);
                $(cell0).text(data[0]);

                var cell1 = row.insertCell(1);
                $(cell1).text(data[1]);

                var cell2 = row.insertCell(2);
                $(cell2).text(data[2]);
                
                var cell3 = row.insertCell(3);
                $(cell3).text(web3.fromWei(data[3],'ether'));
                  //action buttons
                var cell4 = row.insertCell(4);
                if(data[4] != true){
                cell4.innerHTML = `<button class="btn btn-success btn-accept-job" data-job-id="`+data[0]+`">Accept</button>`;
                } else if(data[4] == true){
                cell4.innerHTML = `<button class="btn btn-danger" disabled>Taken</button>`;
  
                }
                console.log('done');
                return true;
                
            });

          };
          
        });
        
         
      });// instance
    }).catch(function(err) {
      console.log(err.message);
    });;//web3
  },// show all jobs
  acceptJob:function(event){
    // event.preventDefault();
    console.log("Show Accept Jobs Called");
    var job_id = $(this).attr('data-job-id');
    btn = this;
    console.log(job_id);
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      };
    var account = accounts[0];
      console.log("account: "+account);
      App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        
        return bountyInstance.AcceptJob(job_id,{gas:2000000,gasPrice:1000000000});
      }).then(function(response){
        App.waitForConfirmation();
        console.log(response);
        console.log(btn);
        btn.disabled = true;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-danger');
        btn.innerHTML = "Taken";
      });


    });//web3
  },//accept jobs
  showAcceptedJobs:async function(){
   // event.preventDefault();
    console.log("Show All Accepted Jobs Called");
    var jobs = [];
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      };
      var account = accounts[0];
      
      App.contracts.Bounty.deployed().then(function(instance) {
        var bountyInstance;
        bountyInstance = instance;
        let get_ids = new Promise((resolve,reject)=>{
                              var a = bountyInstance.MyAcceptedJobsID.call({from:account});
                              if(error){
                                reject(error);
                              }else{
                                resolve(a);
                              }
                          });
        get_ids.then(function(job_ids){
          job_ids.forEach(function(i) {
            let get_data = new Promise((resolve,reject)=>{
                              var data = bountyInstance.ShowMyAcceptedJobs.call(i,{from:account});
                              if(error){
                                reject(error);
                              }else{
                                console.log(data);
                                resolve(data);
                              }
                          });

            get_data.then(function(data){
                jobs_table = document.getElementById('accepted_jobs_view_all');

                var row = jobs_table.insertRow();

                var cell0 = row.insertCell(0);
                $(cell0).text(data[0]);

                var cell1 = row.insertCell(1);
                $(cell1).text(data[1]);

                var cell2 = row.insertCell(2);
                $(cell2).text(data[2]);
                
                var cell3 = row.insertCell(3);
                $(cell3).text(web3.fromWei(data[3],'ether'));
                
                  //action buttons
                var cell4 = row.insertCell(4);
                console.log(data[4]);
                if(data[4] != true){
                cell4.innerHTML = `<button class="btn btn-primary btn-complete-job" data-job-id="`+data[0]+`">Complete</button>`;
                } else if(data[4] == true){
                cell4.innerHTML = `<button class="btn btn-danger" disabled>Completed</button>`;
  
                }
                return true;
            });

          });
          
        });
        
         
      });// instance
    }).catch(function(err) {
      console.log(err.message);
    });;//web3
  },// show accepted jobs
  completeJob : function(){
    console.log('completeJob called');
    btn = this;
    job_id = $(this).attr('data-job-id');
    App.contracts.Bounty.deployed().then(function(instance) {
        var bountyInstance;
        bountyInstance = instance;
        return bountyInstance.CompleteJob(job_id,{gas:200000,gasPrice:1000000000});
    }).then(function(response){
        App.waitForConfirmation();
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        btn.innerHTML = "Completed";
    });
  },//complete job
  withdrawEth : function(){
    console.log('Withdraw ETH called');

    App.contracts.Bounty.deployed().then(function(instance) {
        var bountyInstance;
        bountyInstance = instance;
        return bountyInstance.Withdraw({gas:2000000,gasPrice:1000000000});
    }).then(function(response){
        App.waitForConfirmation();
        
    }).catch(function(err){
      ModalControl.close_spinner();
      ModalControl.show_withdraw_error();
    });
  },//complete job
  eStop: function(){
    console.log("eStop Clicked");
    var bountyInstance;
    App.contracts.Bounty.deployed().then(function(instance) {
        bountyInstance = instance;
        console.log("Instance called");
        return bountyInstance.toggleContractActive();
        }).then(function(users){
            App.waitForConfirmation();
            });
  },// E STOP
};//APP

$(function() {
  $(window).on('load',function() {
    App.init();
  });
});
