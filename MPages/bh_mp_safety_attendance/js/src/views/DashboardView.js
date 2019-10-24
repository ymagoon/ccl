/**
 * Dashboard View is the main view for a patient list
 * @author Aaron Nordyke - AN015953
 * @requires Backbone,Underscore,jQuery,Mustache
 * File "translation.safety.json"
					Namespaces used: 
						"NewPatientHandlebar".
 */
var DashboardView = Backbone.View.extend({
	
	tagName : "table",
	
	/**
	 * CSS class name
	 */
	className : "patient-dashboard",

	tbody : $("<tbody></tbody"),

	template : TemplateLoader.compileFromFile(template_static_path + "templates/_NewPatient.handlebar.html"),
	
	patientViews : [],

	events:{
		"click .new-patient" : "addNewPatient"
	},
	/**
	 * Initializes View.  Renders on Collection "add" and "sort" events.
	 */
	initialize : function() {
		_.bindAll(this);
		this.collection = this.options.collection;
		this.collection.bind("finished-loading",this.render);
		this.collection.bind("sort", this._render);
		this.thead = new DashboardHeaderView({
			model : this.collection
		});
	},

	/**
	 * Render View HTML
	 * @returns {DashboardView} this view
	 */
	render : function() {
		this._render();
		
		var patientAddFlag = this.collection.addFlag;
		
		if(patientAddFlag == 0)
		{
			this.attachAddedPatientViews();
		}
		
		
		return this;
	},

	_render : function(){
		var $el = $(this.el),
				patients = this.collection.models;

		//detach elements for re-insertion
		$el.find("thead").detach();
		$el.find("tbody").detach();
		$el.find("tfoot").detach();
		$el.append(this.thead.el);

		//detach any patient views
		for(var i = 0,l = patients.length;i<l;i++){
			if(patients[i].view){
				$(patients[i].view.el).detach();
			}
		}
		$el.append(this.tbody);
		this.attachPatientViews();
		$el.cellspacing = 0;
		$el.append(this.template({}));
		$el.find("tfoot").i18n();//splitting i18n()
		
		return this;
	},

	/**
	 * Attach Patient Views to Dashboard View
	 */
	attachPatientViews : function() {
		var tbody = this.tbody,
				thatCollection = this.collection,
				i = 1,
				patients = this.collection.models;
				
		for(var i = 0,l = patients.length;i<l;i++){
			if(!patients[i].view) {
				var patientView = new PatientView({
					model : patients[i],
					collection : thatCollection
				});				
			}
			tbody.append(patients[i].view.el);
		}
	},

	attachAddedPatientViews : function(){
		var addedPatients = WindowStorage.get("AddedPatients");
		if(addedPatients!=="undefined"){
			try{
				addedPatients = jQuery.parseJSON(addedPatients);
				var that = this;
				// console.log(addedPatients);
				var foundPtlist = _.detect(addedPatients, function(ptlist){
					// console.log("ptlist.selectedList");
					// console.log(ptlist.selectedList);
					// console.log('ptListModel.get("selectedList")');
					// console.log(ptListModel.get("selectedList"));
					return _.isEqual(ptlist.selectedList, that.collection.patientListsModel.get("selectedList"));
				});
				// console.log(foundPtlist);
				if(foundPtlist){
					var jsonObj = {
						"pt_cnt" : foundPtlist.addedPatients.length,
						"page_cnt" : 0,
						"patients" : []
					};
					_.each(foundPtlist.addedPatients, function(patient){
						var ptObj = {
							"PAGENUM": 1,
							"PTQUALIND": 0,
							"PT_ID": patient.person_id,
							"ENCNTR_ID": patient.encntr_id,
							"ENCNTR_TYPECD": patient.encntr_type_cd,
							"NAME": patient.name,
							"FIN": patient.fin,
							"MRN": patient.mrn,
							"AGE": patient.age,
							"BIRTH_DT": patient.birth_dt,
							"BIRTHDTJS": patient.birth_dt_js,
							"GENDER": patient.gender,
							"ORG_ID": patient.org_id,
							"FACILITY": patient.facility,
							"FACILITYCD": patient.facility_cd,
							"NURSE_UNIT": patient.nurse_unit,
							"NURSE_UNITCD": patient.nurse_unit_cd,
							"ROOM": patient.room,
							"BED": patient.bed,
							"LOS": patient.length_of_stay,
							"ADMIT_DT": patient.admit_dt,
							"ADMITDTJS": patient.admit_dt_js
						};
						jsonObj.patients.push(ptObj);
					});
					// console.log(jsonObj);
					var newPtModel = new NewPatientModel(jsonObj);
					newPtModel.patients = this.collection;
					newPtModel.getBhInfo(newPtModel.mode.SKIP_DUPLICATE_PATIENT_ALERT);
					
				}
			}
			catch(err){
				alert(err.message);
			}
		}

	},

	addNewPatient : function(){
		var newPatientDialog = NewPatientDialogViewSingleton.createNewPatientDialogView(this.collection);
		newPatientDialog.open();
	}
});
