var DateTimeDialogViewSingleton = (function(){
	return{
		createDateTimeDialogView : function(patient){
				var dateTimeDialogView = new DateTimeDialogView({model:patient});
			return dateTimeDialogView;
		}
	}
})();
