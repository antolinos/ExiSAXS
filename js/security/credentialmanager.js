function CredentialManager(){
	this.onLogin = new Event(this);
	this.onLogout = new Event(this);
	this.onActiveProposalChanged = new Event(this);
}

CredentialManager.prototype.addCredential = function(username, roles, token, url){
	var credential = new Credential(username, roles, token, url, []);
	/** Writing to ExtLocalStorage * */
	if (localStorage.getItem("credentials") == null) {
		localStorage.setItem("credentials", "[]");
	}
	var credentials = this.getCredentials();
	credentials.push(credential);
	localStorage.setItem("credentials", JSON.stringify(credentials));
	this.onLogin.notify(credential);
};

CredentialManager.prototype.getCredentials = function(username, roles, token, url){
	var credentials = [];
	if (JSON.parse(localStorage.getItem("credentials")) != null){
		credentials = JSON.parse(localStorage.getItem("credentials"));
	}
	return credentials;
};

CredentialManager.prototype.getConnections = function(username, roles, token, url){
	var credentials = this.getCredentials();
	var connectors = [];
	for (var i = 0; i < credentials.length; i++) {
		if (credentials[i].activeProposals.length > 0){
			for (var j = 0; j < credentials[i].activeProposals.length; j++) {
				connectors.push({
					username : credentials[i].username,
					url : credentials[i].url,
					token : credentials[i].token,
					proposal : credentials[i].activeProposals[j] });
			}
		}
		else{
				connectors.push({
					username : credentials[i].username,
					url : credentials[i].url,
					token : credentials[i].token,
					proposal : null 
				});
		}
	}
	return connectors;
};

CredentialManager.prototype.getCredentialByUserName = function(username, roles, token, url){
	var credentials = this.getCredentials();
	for (var i = 0; i < credentials.length; i++) {
		if (credentials[i].username == username) {
			return new Credential(
					credentials[i].username, 
					credentials[i].roles, 
					credentials[i].token, 
					credentials[i].url,
					credentials[i].activeProposals);
		}
	}
};

CredentialManager.prototype.logout = function(username, roles, token, url){
	localStorage.removeItem('credentials');
	this.onLogout.notify();
};

CredentialManager.prototype.setActiveProposal = function(username, proposal){
	var credentials = this.getCredentials();
	for (var i = 0; i < credentials.length; i++) {
		if (credentials[i].username.toLowerCase() == username.toLowerCase()) {
			credentials[i].activeProposals = [proposal];
			localStorage.setItem("credentials", JSON.stringify(credentials));
			this.onActiveProposalChanged.notify();
		}
	}
};

//
//var this = {
//	onUserAdded : new Event(this),
//	onActiveProposalChanged : new Event(this),
//	addCredential : function(username, roles, token, url) {
//		var credential = new Credential(username, roles, token, url, []);
//		/** Writing to ExtLocalStorage * */
//		if (localStorage.getItem("credentials") == null) {
//			localStorage.setItem("credentials", "[]");
//		}
//		var credentials = this.getCredentials();
//		credentials.push(credential);
//		localStorage.setItem("credentials", JSON.stringify(credentials));
//		this.onUserAdded.notify(credential);
//	},
//
//	getCredentials : function() {
//		return JSON.parse(localStorage.getItem("credentials"));
//	},
//	getConnections : function() {
//		var credentials = this.getCredentials();
//		var connectors = [];
//		for (var i = 0; i < credentials.length; i++) {
//			if (credentials[i].activeProposals.length > 0){
//				for (var j = 0; j < credentials[i].activeProposals.length; j++) {
//					connectors.push({
//						username : credentials[i].username,
//						url : credentials[i].url,
//						token : credentials[i].token,
//						proposal : credentials[i].activeProposals[j] });
//				}
//			}
//			else{
//					connectors.push({
//						username : credentials[i].username,
//						url : credentials[i].url,
//						token : credentials[i].token,
//						proposal : null 
//					});
//			}
//		}
//		return connectors;
//	},
//	getCredentialByUserName : function(username) {
//		var credentials = this.getCredentials();
//		for (var i = 0; i < credentials.length; i++) {
//			if (credentials[i].username == username) {
//				return new Credential(credentials[i].username, credentials[i].roles, credentials[i].token, credentials[i].url,
//						credentials[i].activeProposals);
//			}
//		}
//	},
//	logout : function() {
//		// return JSON.parse(localStorage.getItem("credentials"));
//		localStorage.removeItem('credentials');
//	},
//	setActiveProposal : function(username, proposal) {
//		var credentials = this.getCredentials();
//		for (var i = 0; i < credentials.length; i++) {
//			if (credentials[i].username.toLowerCase() == username.toLowerCase()) {
//				credentials[i].activeProposals.push(proposal);
//				localStorage.setItem("credentials", JSON.stringify(credentials));
//				this.onActiveProposalChanged.notify();
//			}
//		}
//	} };