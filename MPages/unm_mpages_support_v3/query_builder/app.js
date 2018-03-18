Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath("Ext", "../ext/extjs-4.1.0");

//fix for the table list blowing up more-or-less randomly on expand
Ext.view.AbstractView.prototype.updateIndexes=function(startIndex, endIndex) {
    var ns = this.all.elements,
        records = this.store.getRange(),
        i;

    startIndex = startIndex || 0;
    endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
    
    //this is the magic fixy bit
    endIndex = Math.min(endIndex,records.length-1);

    for (i = startIndex; i <= endIndex; i++) {
        ns[i].viewIndex = i;
        ns[i].viewRecordId = records[i].internalId;
        if (!ns[i].boundView) {
            ns[i].boundView = this.id;
        }
    }
};

//univnm.jslib.ccl_callback.defaults.historySize = 20;
C.options.dontAcl=true;
C.options.helpPanel={
	loader: {
        url: 'help.html',
        autoLoad: true
    }
};

Ext.application({
	name: "MPAGE",
	appFolder: "app",
	requires: [
	],
	controllers: C.controllers.concat(["Main"]),
	
	models: [
		
	],
	stores: [
		"FlatTableData",
		"CustTableData"
	],
	autoCreateViewport: true,
	
	launch: function() {
		this.getController("Main").openQueryTab([
			"-- New Query "
			

			].join("\n")
			
		);
	}
});
