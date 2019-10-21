/**
 * @author CC009905
 * Load the sub headers next
 */
function sortNhiqmSubHdr(){
	//AMI
	if (amiDisplayIndicator == 1) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 1) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 1) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 1) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 1) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 1) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 1) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 1) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 1) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 1) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 1) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 1) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 1) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 1) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort
	//AMI
	if (amiDisplayIndicator == 2) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 2) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 2) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 2) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 2) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 2) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 2) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 2) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 2) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 2) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 2) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 2) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 2) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 2) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 3
	//AMI
	if (amiDisplayIndicator == 3) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 3) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 3) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 3) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 3) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 3) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 3) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 3) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 3) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 3) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 3) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 3) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 3) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 3) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 4
	//AMI
	if (amiDisplayIndicator == 4) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 4) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 4) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 4) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 4) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 4) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 4) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 4) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 4) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 4) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 4) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 4) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 4) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 4) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 5
	//AMI
	if (amiDisplayIndicator == 5) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 5) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 5) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 5) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 5) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 5) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 5) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 5) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 5) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 5) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 5) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 5) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 5) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 5) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 6
	//AMI
	if (amiDisplayIndicator == 6) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 6) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 6) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 6) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 6) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 6) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 6) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 6) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 6) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 6) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 6) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 6) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 6) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 6) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 7
	//AMI
	if (amiDisplayIndicator == 7) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 7) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 7) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 7) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 7) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 7) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 7) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 7) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 7) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 7) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 7) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 7) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 7) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 7) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 8
	//AMI
	if (amiDisplayIndicator == 8) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 8) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 8) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 8) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 8) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 8) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 8) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 8) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 8) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 8) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 8) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 8) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 8) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 8) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 9
	//AMI
	if (amiDisplayIndicator == 9) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 9) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 9) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 9) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 9) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 9) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 9) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 9) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 9) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 9) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 9) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 9) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 9) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 9) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 10
	//AMI
	if (amiDisplayIndicator == 10) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 10) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 10) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 10) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 10) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 10) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 10) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 10) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 10) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 10) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 10) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 10) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 10) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 10) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 11
	//AMI
	if (amiDisplayIndicator == 11) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 11) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 11) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 11) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 11) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 11) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 11) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 11) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 11) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 11) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 11) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 11) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 11) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 11) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 12
	//AMI
	if (amiDisplayIndicator == 12) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 12) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 12) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 12) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 12) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 12) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 12) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 12) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 12) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 12) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 12) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 12) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 12) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 12) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort 13
	//AMI
	if (amiDisplayIndicator == 13) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 13) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 13) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 13) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 13) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 13) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 13) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 13) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 13) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 13) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 13) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 13) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 13) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 13) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
	//next sort14
	//AMI
	if (amiDisplayIndicator == 14) {
		//ED
		htmlTable += '<td id="secsubcolAMI1" class="subhdrs CellWidth80">ED</td>';
		//Inpatient
		htmlTable += '<td id="secsubcolAMI2" class="subhdrs CellWidth80">Inpatient</td>';
		//Discharge
		htmlTable += '<td id="secsubcolAMI3" class="subhdrs CellWidth80">Discharge</td>';
		//PreOp
		htmlTable += '<td id="secsubcolAMI4" class="subhdrs CellWidth80">PreOp</td>';
		//PostOp
		htmlTable += '<td id="secsubcolAMI5" class="subhdrs CellWidth80">PostOp</td>';
		//Status
		htmlTable += '<td id="secsubcolAMI6" class="subhdrs CellWidth100">';
		htmlTable += '<a href="" onclick="javascript:this.blur();return sortTable(';
		htmlTable += "'offTblBdy', 8, true);";
		htmlTable += '" title="Sort by Status" class="LinkText">Status</a>';
		htmlTable += '</td>';
	}
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 14) {
			//ED
			htmlTable += '<td id="secsubcolHeartFailure1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolHeartFailure2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolHeartFailure3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolHeartFailure4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolHeartFailure5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolHeartFailure6" style="display:none;" class="CellWidth0"></td>';
		}
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 14) {
				//ED
				htmlTable += '<td id="secsubcolPneumonia1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolPneumonia2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolPneumonia3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolPneumonia4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolPneumonia5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolPneumonia6" style="display:none;" class="CellWidth0"></td>';
			}
	//Children's Asthma
	if (cacDisplayIndicator == 14) {
		//ED
		htmlTable += '<td id="secsubcolChildrensAsthma1" class="tabhdrs2g CellWidth40"></td>';
		//Inpatient
		htmlTable += '<td id="secsubcolChildrensAsthma2" style="display:none;" class="CellWidth0"></td>';
		//Discharge
		htmlTable += '<td id="secsubcolChildrensAsthma3" style="display:none;" class="CellWidth0"></td>';
		//PreOp
		htmlTable += '<td id="secsubcolChildrensAsthma4" style="display:none;" class="CellWidth0"></td>';
		//PostOp
		htmlTable += '<td id="secsubcolChildrensAsthma5" style="display:none;" class="CellWidth0"></td>';
		//Status
		htmlTable += '<td id="secsubcolChildrensAsthma6" style="display:none;" class="CellWidth0"></td>';
	}
	//VTE
	else 
		if (vteDisplayIndicator == 14) {
			//ED
			htmlTable += '<td id="secsubcolVTE1" class="tabhdrs2g CellWidth40"></td>';
			//Inpatient
			htmlTable += '<td id="secsubcolVTE2" style="display:none;" class="CellWidth0"></td>';
			//Discharge
			htmlTable += '<td id="secsubcolVTE3" style="display:none;" class="CellWidth0"></td>';
			//PreOp
			htmlTable += '<td id="secsubcolVTE4" style="display:none;" class="CellWidth0"></td>';
			//PostOp
			htmlTable += '<td id="secsubcolVTE5" style="display:none;" class="CellWidth0"></td>';
			//Status
			htmlTable += '<td id="secsubcolVTE6" style="display:none;" class="CellWidth0"></td>';
		}
		//Stroke
		else 
			if (strokeDisplayIndicator == 14) {
				//ED
				htmlTable += '<td id="secsubcolStroke1" class="tabhdrs2g CellWidth40"></td>';
				//Inpatient
				htmlTable += '<td id="secsubcolStroke2" style="display:none;" class="CellWidth0"></td>';
				//Discharge
				htmlTable += '<td id="secsubcolStroke3" style="display:none;" class="CellWidth0"></td>';
				//PreOp
				htmlTable += '<td id="secsubcolStroke4" style="display:none;" class="CellWidth0"></td>';
				//PostOp
				htmlTable += '<td id="secsubcolStroke5" style="display:none;" class="CellWidth0"></td>';
				//Status
				htmlTable += '<td id="secsubcolStroke6" style="display:none;" class="CellWidth0"></td>';
			}
			//SCIP
			else 
				if (scipDisplayIndicator == 14) {
					//ED
					htmlTable += '<td id="secsubcolSCIP1" class="tabhdrs2g CellWidth40"></td>';
					//Inpatient
					htmlTable += '<td id="secsubcolSCIP2" style="display:none;" class="CellWidth0"></td>';
					//Discharge
					htmlTable += '<td id="secsubcolSCIP3" style="display:none;" class="CellWidth0"></td>';
					//PreOp
					htmlTable += '<td id="secsubcolSCIP4" style="display:none;" class="CellWidth0"></td>';
					//PostOp
					htmlTable += '<td id="secsubcolSCIP5" style="display:none;" class="CellWidth0"></td>';
					//Status
					htmlTable += '<td id="secsubcolSCIP6" style="display:none;" class="CellWidth0"></td>';
				}
				//Pressure Ulcers
				else 
					if (pressureUlcerDisplayIndicator == 14) {
						//Assessment
						htmlTable += '<td id="secsubcolPressureUlcers1" class="tabhdrs2g CellWidth40"></td>';
						//Interventions
						htmlTable += '<td id="secsubcolPressureUlcers2" style="display:none;" class="CellWidth0"></td>';
						//Pressure Ulcers
						htmlTable += '<td id="secsubcolPressureUlcers3" style="display:none;" class="CellWidth0"></td>';
					}
					//CRI
					else 
						if (criDisplayIndicator == 14) {
							//Assessment
							htmlTable += '<td id="secsubcolCRI1" class="tabhdrs2g CellWidth40"></td>';
							//Interventions
							htmlTable += '<td id="secsubcolCRI2" style="display:none;" class="CellWidth0"></td>';
							//Signs & Symptoms Infection
							htmlTable += '<td id="secsubcolCRI3" style="display:none;" class="CellWidth0"></td>';
						}
						//Falls
						else 
							if (fallsDisplayIndicator == 14) {
								//Assessment
								htmlTable += '<td id="secsubcolFalls1" class="tabhdrs2g CellWidth40"></td>';
								//Interventions
								htmlTable += '<td id="secsubcolFalls2" style="display:none;" class="CellWidth0"></td>';
								//Falls
								htmlTable += '<td id="secsubcolFalls3" style="display:none;" class="CellWidth0"></td>';
							}
							//Falls - Pediatric
							else 
								if (pediatricFallsDisplayIndicator == 14) {
									//Assessment
									htmlTable += '<td id="secsubcolFallsPediatric1" class="tabhdrs2g CellWidth40"></td>';
									//Interventions
									htmlTable += '<td id="secsubcolFallsPediatric2" style="display:none;" class="CellWidth0"></td>';
									//Falls
									htmlTable += '<td id="secsubcolFallsPediatric3" style="display:none;" class="CellWidth0"></td>';
								}
								//Pain
								else 
									if (painIndicator == 14) {
										//Assessment
										htmlTable += '<td id="secsubcolPain1" class="tabhdrs2g CellWidth40"></td>';
										//Interventions
										htmlTable += '<td id="secsubcolPain2" style="display:none;" class="CellWidth0"></td>';
										//Pain
										htmlTable += '<td id="secsubcolPain3" style="display:none;" class="CellWidth0"></td>';
									}
									//Pain - Pediatric
									else 
										if (pedPainIndicator == 14) {
											//Assessment
											htmlTable += '<td id="secsubcolPedPain1" class="tabhdrs2g CellWidth40"></td>';
											//Interventions
											htmlTable += '<td id="secsubcolPedPain2" style="display:none;" class="CellWidth0"></td>';
											//Pain
											htmlTable += '<td id="secsubcolPedPain3" style="display:none;" class="CellWidth0"></td>';
										}
										//Skin - Pediatric  
										else 
											if (pSkinIndicator == 14) {
												//Risk Assessment
												htmlTable += '<td id="secsubcolpSkin1" class="tabhdrs2g CellWidth40"></td>';
												//Integrity Assessment
												htmlTable += '<td id="secsubcolpSkin2" style="display:none;" class="CellWidth0"></td>';
												//Interventions
												htmlTable += '<td id="secsubcolpSkin3" style="display:none;" class="CellWidth0"></td>';
												//Skin Impairment
												htmlTable += '<td id="secsubcolpSkin4" style="display:none;" class="CellWidth0"></td>';
											}
}		