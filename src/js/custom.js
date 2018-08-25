ModalControl = {
	show : function(){
		// Get the modal
        var modal = document.getElementById('myModal');
        modal.style.display = "block";
	},
	show_withdraw_error : function(){
		// Get the modal
        var modal = document.getElementById('myModal');
        modal.style.'border-color' = 'red';
        modal.h2.innerHTML = "ERROR";
        modal.h2.style.color = 'red';
        modal.style.display = "block";

	}
};
