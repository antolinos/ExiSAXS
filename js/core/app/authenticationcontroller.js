function AuthenticationManager(){
	this.onSuccess = new Event(this);
	this.onError = new Event(this);
}

/**
 * url to an ISPyB instance http://pc593.embl.fr:8080/ispyb-ws/rest
 * @param user
 * @param password
 * @param url
 */
AuthenticationManager.prototype.login = function(user, password, url, site){
	var _this = this;
	var fn = function onSuccess(sender, data) {
		_this.onSuccess.notify({
			user : user,
			roles : data.roles,
			token : data.token,
			url : url
	});
	};
		
	var err = function(sender, data) {
		EXI.setError("Permission denied");
		BUI.showError("Your credentials are invalid");
	};
	
	EXI.getDataAdapter({
		onSuccess :fn,
		onError :err
	}).proposal.authentication.authenticate(user, password, url, site);
	
	
	
};

