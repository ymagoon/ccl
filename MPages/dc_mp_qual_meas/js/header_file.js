/**
 * @author CC009905
 * Loads the nhiqm headers in thier respective places.
 */
function sortNhiqmHdr(){
	//AMI
	if (amiDisplayIndicator == 1) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 1) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 1) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 1) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 1) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 1) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 1) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 1) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 1) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 1) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 1) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 1) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 1) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 1) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	
	//**** sort 2
	//AMI
	if (amiDisplayIndicator == 2) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 2) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 2) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 2) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 2) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 2) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 2) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 2) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 2) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 2) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 2) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 2) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 2) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 2) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 3
	//AMI
	if (amiDisplayIndicator == 3) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 3) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 3) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 3) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 3) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 3) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 3) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 3) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 3) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 3) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 3) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 3) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 3) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 3) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 4
	//AMI
	if (amiDisplayIndicator == 4) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 4) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 4) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 4) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 4) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 4) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 4) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 4) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 4) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 4) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 4) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 4) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 4) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 4) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 5
	//AMI
	if (amiDisplayIndicator == 5) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 5) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 5) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 5) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 5) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 5) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 5) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 5) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 5) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 5) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 5) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 5) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 5) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 5) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 6
	//AMI
	if (amiDisplayIndicator == 6) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 6) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 6) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 6) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 6) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 6) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 6) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 6) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 6) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 6) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 6) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 6) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 6) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 6) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 7
	//AMI
	if (amiDisplayIndicator == 7) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 7) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 7) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 7) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 7) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 7) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 7) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 7) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 7) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 7) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 7) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 7) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 7) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 7) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 8
	//AMI
	if (amiDisplayIndicator == 8) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 8) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 8) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 8) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 8) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 8) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 8) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 8) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 8) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 8) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 8) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 8) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 8) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 8) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 9
	//AMI
	if (amiDisplayIndicator == 9) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 9) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 9) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 9) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 9) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 9) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 9) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 9) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 9) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 9) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 9) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 9) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 9) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 9) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 10
	//AMI
	if (amiDisplayIndicator == 10) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 10) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 10) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 10) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 10) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 10) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 10) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 10) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 10) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 10) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 10) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 10) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 10) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 10) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 11
	//AMI
	if (amiDisplayIndicator == 11) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 11) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 11) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 11) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 11) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 11) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 11) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 11) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 11) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 11) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 11) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 11) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 11) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 11) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 12
	//AMI
	if (amiDisplayIndicator == 12) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 12) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 12) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 12) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 12) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 12) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 12) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 12) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 12) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 12) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 12) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 12) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 12) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 12) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 13
	//AMI
	if (amiDisplayIndicator == 13) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 13) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 13) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 13) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 13) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 13) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 13) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 13) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 13) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 13) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 13) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 13) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 13) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 13) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
	//*** sort 14
	//AMI
	if (amiDisplayIndicator == 14) {
		htmlTable += '<td id="secpatlisthdrAMI" colspan="6" class="tabhdrs CellWidth500">';
		htmlTable += '<div id="divAMItext" title="Click to collapse AMI information" class="mainColumn2g" onclick="javascript:expandCollapseAMI();">- AMI</div>';
		htmlTable += '</td>';
	}
	
	//Heart Failure
	else 
		if (heartFailureDisplayIndicator == 14) {
			htmlTable += '<td id="secpatlisthdrHeartFailure" class="tabhdrs2g CellWidth40">'
			htmlTable += '<div id="divHeartFailuretext" title="Click to expand Heart Failure information" class="mainColumn2g" onclick="javascript:expandCollapseHeartFailure();">+</div>';
			htmlTable += '</td>';
		}
		
		//Pneumonia
		else 
			if (pneumoniaDisplayIndicator == 14) {
				htmlTable += '<td id="secpatlisthdrPneumonia" class="tabhdrs2g CellWidth40">';
				htmlTable += '<div id="divPneumoniatext" title="Click to expand Pneumonia information" class="mainColumn2g" onclick="javascript:expandCollapsePneumonia();">+</div>';
				htmlTable += '</td>';
			}
			//Children's Asthma
			else 
				if (cacDisplayIndicator == 14) {
					htmlTable += '<td id="secpatlisthdrChildrensAsthma" class="tabhdrs2g CellWidth40">';
					htmlTable += '<div id="divChildrensAsthmatext" title="Click to expand Children&#39;s Asthma information" class="mainColumn2g" onclick="javascript:expandCollapseChildrensAsthma();">+</div>';
					htmlTable += '</td>';
				}
				//VTE
				else 
					if (vteDisplayIndicator == 14) {
						htmlTable += '<td id="secpatlisthdrVTE" class="tabhdrs2g CellWidth40">';
						htmlTable += '<div id="divVTEtext" title="Click to expand VTE information" class="mainColumn2g" onclick="javascript:expandCollapseVTE();">+</div>';
						htmlTable += '</td>';
					}
					//Stroke
					else 
						if (strokeDisplayIndicator == 14) {
							htmlTable += '<td id="secpatlisthdrStroke" class="tabhdrs2g CellWidth40">';
							htmlTable += '<div id="divStroketext" title="Click to expand Stroke information" class="mainColumn2g" onclick="javascript:expandCollapseStroke();">+</div>';
							htmlTable += '</td>';
						}
						//SCIP
						else 
							if (scipDisplayIndicator == 14) {
								htmlTable += '<td id="secpatlisthdrSCIP" class="tabhdrs2g CellWidth40">';
								htmlTable += '<div id="divSCIPtext" title="Click to expand SCIP information" class="mainColumn2g" onclick="javascript:expandCollapseSCIP();">+</div>';
								htmlTable += '</td>';
							}
							//Pressure Ulcers
							else 
								if (pressureUlcerDisplayIndicator == 14) {
									htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
									htmlTable += '<div id="divPressureUlcerstext" title="Click to expand Pressure Ulcers information" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';
									htmlTable += '</td>';
								}
								//CRI
								else 
									if (criDisplayIndicator == 14) {
										htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
										htmlTable += '<div id="divCRItext" title="Click to expand CRI information" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';
										htmlTable += '</td>';
									}
									//Falls
									else 
										if (fallsDisplayIndicator == 14) {
											htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
											htmlTable += '<div id="divFallstext" title="Click to expand Falls information" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';
											htmlTable += '</td>';
										}
										//Falls - Pediatric
										else 
											if (pediatricFallsDisplayIndicator == 14) {
												htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
												htmlTable += '<div id="divFallsPediatrictext" title="Click to expand Falls &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';
												htmlTable += '</td>';
											}
											//Pain
											else 
												if (painIndicator == 14) {
													htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
													htmlTable += '<div id="divPaintext" title="Click to expand Pain information" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';
													htmlTable += '</td>';
												}
												//Pain - Pediatric
												else 
													if (pedPainIndicator == 14) {
														htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
														htmlTable += '<div id="divPedPaintext" title="Click to expand Pain &#45; Pediatric information" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';
														htmlTable += '</td>';
													}
													//Skin - Pediatric 
													else 
														if (pSkinIndicator == 14) {
															htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
															htmlTable += '<div id="divpSkintext" title="Click to expand Pediatric Skin information" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';
															htmlTable += '</td>';
														}
}