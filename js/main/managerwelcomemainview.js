

function ManagerWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Home";
	this.closable = false;
	
	
	this.proposalGrid = new ProposalGrid({
		height : 500
	});
	
	var _this = this;
	this.proposalGrid.onSelected.attach(function(sender, proposal){
		_this.panel.setLoading(true);
		_this.activeProposal(proposal);
		_this.panel.setLoading(false);
		
	});
	
	this.timeLineWidget = new SessionTimeLineWidget();
	
	this.timeLineWidget.onSelected.attach(function(sender, record){
		EXI.setLoadingMainPanel();
		var onSuccess = function(sender, proposals){
			if (proposals.length > 0){
				_this.activeProposal(proposals[0]);
				EXI.setLoadingMainPanel(false);
				if ((record.group == "BM29") || (record.group == "BM12")){
				  	location.hash = "/session/nav/" + record.sessionId +"/session";
				}
				else{
				  	location.hash = "/mx/datacollection/session/" + record.sessionId + "/main";
				}
			}
			else{
				BUI.showError("No proposal Found");
			}
			
		} ;
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.proposal.getProposalBySessionId(record.sessionId);
	});
}

ManagerWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;
ManagerWelcomeMainView.prototype.getContainer = MainView.prototype.getContainer;

ManagerWelcomeMainView.prototype.activeProposal = function(proposal) {
	EXI.credentialManager.setActiveProposal(this.username, proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber);
	EXI.proposalManager.get(true);
};


ManagerWelcomeMainView.prototype.getContainer = function() {
	this.panel =  Ext.createWidget('tabpanel',
			{
				plain : true,
				margin : '20 0 0 10',
				items : [
					{
						tabConfig : {
							title : 'Calendar'
						},
						items : [
						         {
							xtype : 'container',
							layout : 'fit',
							padding : 20,
							items : [ 
											         this.timeLineWidget.getPanel()
							]
						}
						] 
					},
					{
						tabConfig : {
							title : 'Proposal'
						},
						items : [
						         {
							xtype : 'container',
							layout : 'fit',
							padding : 20,
							cls : 'border-grid',
							items : [ 
							        
							         {
							        	 html : '<div class="welcome-title"><h2>Please select a proposal</h2></div>'
							         },
							         this.proposalGrid.getPanel()
							]
						}
						]
					}
					
			]});
			return this.panel;
	};
	

ManagerWelcomeMainView.prototype.loadUserView = function() {
	var _this = this;
	var onSuccess = function(sender, proposals){
		_this.proposalGrid.load(proposals);
		if (proposals.length == 1){
			_this.activeProposal( proposals[0]);
		}
		_this.proposalGrid.panel.setLoading(false);
	};
	_this.proposalGrid.panel.setLoading();
	EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};

ManagerWelcomeMainView.prototype.loadSessions = function() {
	this.timeLineWidget.loadSessions(moment().startOf('year').format("YYYYMMDD"),moment().endOf('year').add(1, 'days').format("YYYYMMDD"));
	//this.timeLineWidget.loadSessions(moment().startOf('month').format("YYYYMMDD"),moment().endOf('month').format("YYYYMMDD"));
};

ManagerWelcomeMainView.prototype.load = function(username) {
	this.username = username;
	/** Loading proposals depending on your role **/
	this.loadUserView();
	this.loadSessions();
};
