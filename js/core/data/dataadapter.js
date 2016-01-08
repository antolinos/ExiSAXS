/**
 * Super class for all the data adapters
 * Based on $ and Event it will make a GET/POST call to an given URL
 * if success then onSuccess will be notified otherwise on Error will be notified
 * 
 * Example:
 * 
 * function successed (sender, data){
 * 	alert("It worked");
 * }
 * var adapter = new DataAdapter({async : true, onSuccess: successed }).get("http://example.com/get")
 * 
 * 
**/
function DataAdapter(args) {
	this.async = true;
	this.onSuccess = new Event(this);
	this.onError = new Event(this);
	
	if (args != null) {
		if (args.async != null) {
			this.async = args.async;
		}
		if (args.onSuccess != null) {
			this.onSuccess.attach(args.onSuccess);
		}
		if (args.onError != null) {
			this.onError.attach(args.onError);
		}
	}
	
}

/**
 * Input: url = "http://server.com/{token}/proposal/{proposal}/shipment/list"
 * Output will be the url with the strings {token} and {proposal} replaced by the values connection.token and connection.proposal
 */
DataAdapter.prototype.getUrl = function(connection, url){
	return connection.url + url.replace("{token}", connection.token).replace("{proposal}", connection.proposal).replace("{username}", connection.username);
};


DataAdapter.prototype.get = function(url){
	var _this = this;

	if (EXI != null){
		EXI.setLoading();
	}

	var connections = EXI.credentialManager.getConnections();
	if (connections.length == 1){
		$.ajax({
			  url: this.getUrl(connections[0], url),
			  type: 'get',
			  async : this.async,
			  dataType 	: 'json',
			  statusCode: {
		            400 : function(){
		                BUI.showError('400 : bad request');
		            },
		            401 : function(){
		                EXI.setError('401 : Unauthorized. Your session is not valid or may have expired');
		            },
		            403 : function(){
		                BUI.showError('403 : forbidden');
		            },
		            404 : function(){
		                BUI.showError('404 : not found');
		            },
		            415 : function(){
		                BUI.showError('415 : type not allowed');
		            },
		            500 : function(){
		                BUI.showError('500 : internal server error');
		            }
		        },
			  success: function(data){ 
				  _this.onSuccess.notify(data);
				  if (EXI != null){
					  EXI.setLoading(false);
				  }
			  },
			  error: function(error){
				  _this.onError.notify(error);
				   EXI.setError(error.responseText);
			  }
			});
	}
	else{
		BUI.showError("Number of connections > 1");
	}
	

//	if (connections.length == 2){
//		function success(dataset1, dataset2){
//			 _this.onSuccess.notify(dataset1[0].concat(dataset2[0]));
//			 if (exiSAXS != null){
//				  exiSAXS.setLoading(false);
//			 }
//		}
//		function error(error){
//			 _this.onError.notify(error);
//			  _this.onError.notify(error);
//			  if (exiSAXS != null){
//				  exiSAXS.setError(error.responseText);
//			  }
//		}
//		$.when( 
//				$.ajax({
//							url: connections[0].url + url.replace("%TOKEN%", connections[0].token).replace("%PROPOSAL%", connections[0].proposal).replace("%USER%", connections[0].username),
//							async : this.async,
//							type: 'get'
//						}), 
//			    $.ajax({
//			    	url: connections[1].url + url.replace("%TOKEN%", connections[1].token).replace("%PROPOSAL%", connections[1].proposal).replace("%USER%", connections[1].username),
//			    			async : this.async,
//			    			type: 'get'
//					 })
//			)
//		  .then( success, error);
//	}
};

DataAdapter.prototype.post = function(url, data){
	var _this = this;
	/** exiSAXS could be not defined yed **/
	if (EXI != null){
		EXI.setLoading();
	}
	var connections = EXI.credentialManager.getConnections();
	 url = this.getUrl(connections[0], url);
	 $.ajax({
		  type: "POST",
		  url: url,
		  data: data,
		  success: function(data){ 
			  _this.onSuccess.notify(data);
			  if (EXI != null){
				  EXI.setLoading(false);
			  }
		  },
		  error: function(error){
			  _this.onError.notify(error);
			  if (EXI != null){
				  EXI.setError(error);
			  }
		  }
	});
	 
};


