

function ShippingMainView() {
	
	MainView.call(this);
	
	var _this = this;
	this.shipmentForm = new ShipmentForm();

	this.shipmentForm.onSaved.attach(function(sender, shipment){
		location.hash = "#/proposal/shipping/nav?nomain";
	});
	
	/*this.caseGrid = new CaseGrid({
		height : 300
	});
	
	this.caseGrid.onRemove.attach(function(sender, dewar){
		var onSuccess = function(sender){
			_this.load(_this.shippingId);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess:onSuccess}).proposal.dewar.removeDewar(_this.shippingId, dewar.dewarId );
	});*/
	
	this.parcelGrid = new ParcelGrid({
		height : 300
	});
}

ShippingMainView.prototype.getPanel = MainView.prototype.getPanel;
ShippingMainView.prototype.getContainer = MainView.prototype.getContainer;

ShippingMainView.prototype.getContainer = function() {
	this.tabPanel =  Ext.createWidget('tabpanel',
			{
				margin : 10,
				defaults : {
						anchor : '100%'
				},
				items : [
				     	{
							tabConfig : {
								title : 'Delivery Details'
							},
							items : [ 
							         	this.shipmentForm.getPanel()
							]
						},
						{
							tabConfig : {
								id : this.id + "grid",
								title : 'Parcels',
								icon : '../images/icon/shipping.png'
							},
							items : [ 
							         	this.parcelGrid.getPanel()
							]
						}
					]
			});

	return this.tabPanel;

};


ShippingMainView.prototype.load = function(shippingId) {
	this.shippingId = shippingId;
	
	if (shippingId == null){
		Ext.getCmp(this.id + "grid").disable(true);
	}
	this.panel.setTitle("Shipment");
	var _this = this;
	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){
			_this.shipmentForm.load(shipment);
			_this.parcelGrid.load(shipment);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getShipment(shippingId);
	}
};
