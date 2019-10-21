var NewPatientDialogViewSingleton = (function(){
	
	var newPatientDialogView = new NewPatientDialogView({model:new NewPatientModel});
		
	return{
		createNewPatientDialogView : function(patientCollection){
			if(_.isEmpty(newPatientDialogView)){
				newPatientDialogView = new NewPatientDialogView({model:new NewPatientModel,patients:patientCollection,patientlists:patientCollection.patientListsModel});
			}
			else{
				newPatientDialogView.model = new NewPatientModel;
				newPatientDialogView.patients = patientCollection;
				newPatientDialogView.patientlists = patientCollection.patientListsModel;
				newPatientDialogView.render();
			}
			return newPatientDialogView;
		}
	}
})();
