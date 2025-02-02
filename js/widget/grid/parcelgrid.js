/**
 * A shipment may contains one or more cases where stock solutions and sample plates are stored
 * 
 * @height
 * @btnEditVisible
 * @btnRemoveVisible
 * 
 * #onEditButtonClicked
 * #onAddButtonClicked
 * #onRemoveButtonClicked
 * #onDuplicateButtonClicked
 */
function ParcelGrid(args) {
	this.height = 100;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
	}

	/** Events **/
	this.onSuccess = new Event(this);
	this.onAdd = new Event(this);
	this.onRemove = new Event(this);
}




ParcelGrid.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add New Parcel',
		disabled : false,
		handler : function(widget, event) {
			_this.edit();
		}
	}));
	

	return actions;
};



ParcelGrid.prototype.load = function(shipment) {
	var _this = this;
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;
	
	this.parcelForms = [];
	
	this.panel.removeAll();
	
	this.dewars.sort(function(a,b){return a.dewarId - b.dewarId;});
	
	
	for ( var i in this.dewars) {
		var parcelForm = new ParcelForm({height : 300});
		this.panel.insert(parcelForm.getPanel());
		parcelForm.load(this.dewars[i]);
		
		parcelForm.onSavedClick.attach(function(sender, dewar){
			var adapter = new DataAdapter();
			_this.panel.setLoading();
			var onSuccess = (function(sender, shipment) {
				//_this.load(shipment);
				window.close();
				_this.panel.setLoading(false);
			});
			dewar["sessionId"] = dewar.firstExperimentId;
			dewar["shippingId"] = _this.shipment.shippingId;
			EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar( _this.shipment.shippingId, dewar);
			
		});
		
		this.parcelForms.push(parcelForm);
	}
};


ParcelGrid.prototype.edit = function(dewar) {
	var _this = this;
	var caseForm = new CaseForm();
	
	var window = Ext.create('Ext.window.Window', {
	    title: 'Parcel',
	    height: 450,
	    width: 600,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	caseForm.getPanel(dewar)
	    ],
	    listeners : {
			afterrender : function(component, eOpts) {
				if (_this.puck != null){
						_this.render(_this.puck);
				}
			}
	    },
	    buttons : [ {
						text : 'Save',
						handler : function() {
							var adapter = new DataAdapter();
							_this.panel.setLoading();
							var dewar = caseForm.getDewar();
							var onSuccess = (function(sender, shipment) {
								_this.load(shipment);
								_this.panel.setLoading(false);
								window.close();
							});
							dewar["sessionId"] = dewar.firstExperimentId;
							dewar["shippingId"] = _this.shipment.shippingId;
							EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
	});
	window.show();
	
};


ParcelGrid.prototype.getPanel = function() {
	var _this = this;

	
	this.panel = Ext.create('Ext.panel.Panel', {
		cls : 'border-grid',
		height : 800,
		autoScroll : true
		
	});

	this.panel.addDocked({
		height : 45,
		xtype : 'toolbar',
		items : _this._getTopButtons(),
		cls : 'exi-top-bar'
	});

	return this.panel;
};

