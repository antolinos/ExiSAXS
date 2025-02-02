function GenericDataCollectionPanel(args) {
	this.title = "Generic";
	
}

GenericDataCollectionPanel.prototype.load = function(dataCollectionGroup){
};

GenericDataCollectionPanel.prototype.getColumns = function(){
	return [];
};

GenericDataCollectionPanel.prototype.getPanel = function(dataCollectionGroup){
	
	this.store = Ext.create('Ext.data.Store', {
		fields : ["dataCollectionGroup"]
	});
	this.panel = Ext.create('Ext.grid.Panel', {
		border 		: 1,
		store 		: this.store,
	    columns		: this.getColumns(),
	    features: [{
            id: 'dataCollectionGroup',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{dataCollectionGroup}',
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
	    viewConfig	: {
	        			enableTextSelection: true
	     }
	});
	return this.panel;
};

GenericDataCollectionPanel.prototype._getHTMLZoomImage = function(url, dataCollectionId, imageId) {
	var ref = '#/mx/datacollection/' + dataCollectionId + '/image/' + imageId + '/main';
	return '<a href=' + ref + '><img class="lazy"  data-src=' + url + ' src=' + url + '></a>';
};


GenericDataCollectionPanel.prototype._getHTMLImage = function(url) {
	return '<img class="smalllazy" onclick="myFunction()"  data-src=' + url + ' src=' + url + '>';
};



GenericDataCollectionPanel.prototype.getHTMLTable = function(jsonArray) {
	var table = document.createElement("table");
	for (var i = 0; i < jsonArray.length; i++) {
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		
		td1.appendChild(document.createTextNode(jsonArray[i].key));
		if (jsonArray[i].value == null){
			td1.setAttribute("class", "summary_datacollection_null_parameter");
		}
		
		
		if ((jsonArray[i].value) != null){
			td1.setAttribute("class", "summary_datacollection_parameter_name");
		}

		var td2 = document.createElement("td");
		if ((jsonArray[i].value) != null){
			td2.appendChild(document.createTextNode(jsonArray[i].value));
			td2.setAttribute("class", "summary_datacollection_parameter");
		}
		
		var td3 = document.createElement("td");
		if (jsonArray[i].units != null){
			td3.appendChild(document.createTextNode(jsonArray[i].units));
			td3.setAttribute("class", "summary_datacollection_parameter");
		}
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		table.appendChild(tr);
	}
	return "<table>" + table.innerHTML + "</table>";
};

GenericDataCollectionPanel.prototype.getColumns = function() {
	var _this = this;
	var columns = [
	{
		header : '',
		dataIndex : 'DataCollection_imagePrefix',
		width : 310,
		renderer : function(val, y, record) {
			console.log(EXI.getDataAdapter().mx.dataCollection.getThumbNailById(record.data.lastImageId));
			return _this._getHTMLZoomImage(EXI.getDataAdapter().mx.dataCollection.getThumbNailById(record.data.lastImageId), record.data.DataCollection_dataCollectionId, record.data.lastImageId);
		} 
	},
	{
		header : 'DataCollection',
		dataIndex : 'dataCollectionGroup',
		name : 'dataCollectionGroup',
		flex : 1,
		renderer : function(grid, e, record){
			return _this.getHTMLTable([
			                           {key : "Workflow", value : record.data.Workflow_workflowType},
			                           {key : "Type ", value : record.data.DataCollectionGroup_experimentType},
			                           {key : "Sample Name", value :record.data.BLSample_name},
			                           {key : "Protein", value :record.data.Protein_acronym},
			                           {key : "Images", value :record.data.DataCollection_numberOfImages},
			                           {key : "Prefix", value :record.data.DataCollection_imagePrefix},
			                           {key : "Start", value :record.data.DataCollectionGroup_startTime}
			                           
			]);
		}
	},
	{
		header : 'Acquisition',
		dataIndex : 'dataCollectionGroup',
		name : 'dataCollectionGroup',
		flex : 1,
		renderer : function(grid, e, record){
			return _this.getHTMLTable([
			                          
			                           {key : "Resolution", value :record.data.DataCollection_resolution, units : 'Å'},
			                           {key : "Wavelength", value :record.data.DataCollection_wavelength},
			                           {key : "Flux ", value : Number(record.data.DataCollection_flux).toExponential(), units:'ph/sec'},
			                           {key : "Flux End", value : Number(record.data.DataCollection_flux_end).toExponential(), units:'ph/sec'},
			                           {key : "Φ", value : record.data.DataCollection_phiStart},
			                           {key : "Κ", value : record.data.DataCollection_kappaStart},
			                           {key : "Ω", value : record.data.DataCollection_omegaStart},
			                           {key : "Total Exp. Time", value :record.data.DataCollection_numberOfImages*record.data.DataCollection_exposureTime, units:'s'}
			                          // {key : "Comments", value :record.data.DataCollectionGroup_comments}
			                           
			                           
			                           
			]);
		}
	},
	{
		header : 'Online Data Analysis',
		dataIndex : 'dataCollectionGroup',
		name : 'dataCollectionGroup',
		flex : 1,
		renderer : function(grid, e, record){
			return new ResultSectionDataCollection().getHTML(record.data); 
		}
	},
	{
		header : 'Workflow',
		dataIndex : 'dataCollectionGroup',
		name : 'dataCollectionGroup',
		flex : 1,
		renderer : function(grid, e, record){
			
			return new WorkflowSectionDataCollection().getHTML(record.data); 
			
		}
	},
	{
		header : '',
		dataIndex : 'dataCollectionGroup',
		name : 'dataCollectionGroup',
		width : 160,
		renderer : function(grid, e, record){
			return new CustomSectionDataCollection().getHTML(record.data); 
			
		}
	},
	
	{
		header : 'Crystal Snapshot',
		dataIndex : 'DataCollection_imagePrefix',
		width : 310,
		renderer : function(val, y, record) {
			var html = "<table>"
			var img1 = _this._getHTMLImage(EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 1));
			var img2 = _this._getHTMLImage(EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 2));
			var img3 = _this._getHTMLImage(EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 3));
			var img4 = _this._getHTMLImage(EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 4));
			
			html = html + "<tr><td>" + img1 + "</td><td>" + img2 + "</td><tr>";
			html = html + "<tr><td>" + img3 + "</td><td>" + img4 +"</td><tr>";
			return html + "</table>";
		}
	}
	
	];
	return columns;
};
	

GenericDataCollectionPanel.prototype.load = function(dataCollectionGroup){
	dataCollectionGroup.reverse();
	this.store.loadData(dataCollectionGroup);
};