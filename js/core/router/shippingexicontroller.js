function ShippingExiController() {
	this.init();
}

ShippingExiController.prototype.loadNavigationPanel = ExiController.prototype.loadNavigationPanel;

ShippingExiController.prototype.setPageBackground = function() {
};

ShippingExiController.prototype.notFound = function() {
};


ShippingExiController.prototype.loadShipmentsNavigationPanel = function(listView) {
	/** Cleaning up navigation panel * */
	EXI.clearNavigationPanel();
	EXI.setLoadingNavigationPanel(true);
	
	var onSuccess = function(sender, data) {
		data = BUI.groupBy(data, function(item){return item["Shipping_shippingId"];});
		var curated = [];
		for(var i = 0; i < data.length; i++){
			curated.push(data[i][0]);
		}
		curated.sort(function(a,b){return b.Shipping_shippingId - a.Shipping_shippingId;});
		
		/** Load panel * */
		EXI.addNavigationPanel(listView);
		/** Load data * */
		listView.load(curated);
		EXI.setLoadingNavigationPanel(false);
	};
	
	/** Handle error * */
	var onError = function(sender, data) {
		EXI.setLoadingNavigationPanel(false);
	};
	
	/** Load data data * */
	return EXI.getDataAdapter({ onSuccess : onSuccess, onError : onError });
};

ShippingExiController.prototype.init = function() {
	var _this = this;

		function setPageBackground() {
			_this.setPageBackground();
		}
		function notFound() {
			_this.notFound();
		}

		function loadNavigationPanel(listView) {
			return _this.loadNavigationPanel(listView);
		}
		
		var listView = null;
		var adapter = null;

		function loadShipmentNavigationList(){
			var listView = new ShippingListView();
			/** When selected move to hash * */
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/shipping/" + selected[0].Shipping_shippingId  + "/main";
			});
			adapter = _this.loadShipmentsNavigationPanel(listView);
			adapter.proposal.shipping.getShippings();
		}
		
		Path.map("#/proposal/shipping/nav?nomain").to(function() {
			loadShipmentNavigationList();
		});

		Path.map("#/proposal/shipping/nav").to(function() {
			loadShipmentNavigationList();
			EXI.addMainPanel(new ShippingWelcomeMainView());
		});
		
		Path.map("#/proposal/addresses/nav").to(function() {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new AddressListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/proposal/address/" + selected[0].labContactId + "/main";
			});
			
			EXI.addNavigationPanel(listView);
			
			adapter = loadNavigationPanel(listView);
			adapter.proposal.shipping.getLabContacts();
			
			/** Loading welcome page **/
			EXI.addMainPanel(new AddressWelcomeMainView());
			
		}).enter(this.setPageBackground);
	
		Path.map("#/shipping/:shippingId/main").to(function() {
			var mainView = new ShippingMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['shippingId']);
		}).enter(this.setPageBackground);

		Path.map("#/shipping/main").to(function() {
			var mainView = new ShippingMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);
		
		Path.map("#/proposal/address/:lacontactId/main").to(function() {
			var mainView = new AddressMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['lacontactId']);
		}).enter(this.setPageBackground);
		
};
