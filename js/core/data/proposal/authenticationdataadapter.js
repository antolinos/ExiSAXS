function AuthenticationDataAdapter(args){
	DataAdapter.call(this, args);
}

AuthenticationDataAdapter.prototype.get = DataAdapter.prototype.get;
AuthenticationDataAdapter.prototype.post = DataAdapter.prototype.post;
AuthenticationDataAdapter.prototype.getUrl = DataAdapter.prototype.getUrl;


AuthenticationDataAdapter.prototype.authenticate = function(user, password, url, site){
	var _this = this;
	
	//var site = "ESRF";
	/** SITE **/
	if (url.indexOf("embl-hamburg") != -1){
		site = "EMBL";
	}
	if (url.indexOf("192.109.31.39") != -1){
		site = "EMBL";
	}

	/**
	In simulation mode as the files are written on the disk
	and ? is a special character we replace ? by _
	**/
	var url = url + '/authenticate?site=' + site;
	if (site == "Simulation"){
		url = url.replace(/\?/g, '_');
	}

	$.ajax({
		  url		: url,
		  type		: 'post',
		  dataType 	: 'json',
		  data: {
			  		login : user,
			  		password : password
		  },
		  success: function(data){
			   _this.onSuccess.notify(data);
		  },
		  error: function(error){
			  _this.onError.notify(error);
		  }
	});
};
