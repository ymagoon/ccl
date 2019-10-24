var ActivityDialogViewSingleton = (function(){
	
	var activityDialogView = new ActivityDialogView({model:new ActivityModel});
		
	return{
		createActivityDialogView : function(activityModel,patientModel,activityView, isMultiSelect){
			if(_.isEmpty(activityDialogView)){
				activityDialogView = new ActivityDialogView({model:activityModel,patient:patientModel,activityView:activityView,isMultiSelect:isMultiSelect});
			}
			else{
				activityDialogView.model = activityModel;
				activityDialogView.patient = patientModel;
				activityDialogView.activityView = activityView;
				activityDialogView.isMultiSelect = isMultiSelect;
				activityDialogView.isTabNav = patientModel.collection.patientListsModel.get("tabNavInd")===1?true:false;
				activityDialogView.render();
			}
			return activityDialogView;
		}
	}
})();
