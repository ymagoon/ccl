var NurseUnitDialogViewSingleton = (function(){
			
	return{
		createNurseUnitDialogView : function(nurseUnitModel, listView){
				var nurseUnitDialogView = new NurseUnitDialogView({model:nurseUnitModel, listView: listView});
			return nurseUnitDialogView;
		}
	}
})();


