function AddressMainView() {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];

	MainView.call(this);

	this.addressForm = new AddressForm({
//		height : 800,
//		collapsed : false,
//		tbar : true
	});
	
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

AddressMainView.prototype.getPanel = MainView.prototype.getPanel;

AddressMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
	    },
	    margin : 15,
	    border: 1,
	    defaults: {
	        labelWidth: 80,
	        flex: 1,
	    },
	    items: [this.addressForm.getPanel([])]
	});
};


AddressMainView.prototype.load = function(labContactId) {
	
	this.panel.setTitle("Address");
	var _this = this;
	var onSuccess = function(sender, data){
		_this.addressForm.load(data);
	};
	
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getLabContactById(labContactId);
	
	
};
