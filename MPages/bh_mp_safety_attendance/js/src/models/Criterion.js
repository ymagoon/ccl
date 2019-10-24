/**
 * Criterion contains Application-level variables passed in from PrefMaint.exe.
 */
var Criterion = {
	
	position_cd : 0,
	personnel_id : 0,
	image_size : 3,
	debug_mode_ind : 0,	
	debug_level_ind: 0,
	unloadParams : function() {
		try {
				this.position_cd = m_criterionJSON.CRITERION.POSITION_CD; 
				this.personnel_id = m_criterionJSON.CRITERION.PRSNL_ID; 
				this.image_size = m_criterionJSON.CRITERION.IMAGE_SIZE; 
				this.debug_mode_ind = m_criterionJSON.CRITERION.DEBUG_IND ;
				this.debug_level_ind= m_criterionJSON.CRITERION.DEBUG_LEVEL_IND;
			} catch (e) {
			errmsg(e.message, "unloadParams()");
		}
	}	
};
