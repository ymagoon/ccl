set trace translatelock go
drop program mp_unified_driver:dba go
create program mp_unified_driver:dba

/* REQUEST ***************************************************************************************/
prompt
	"Output to File/Printer/MINE" = "MINE"
	,"Person ID:" = 0.00
	,"Encounter ID:" = 0.00
	,"Personnel ID:" = 0.00
	,"Provider Position Code:" = 0.00
	,"Patient Provider Relationship Code:" = 0.00
	,"Executable in Context:" = ""
	;The static_content location can be overwritten to also identify the base group to utilize when
	;resolving filter Mappings.  For instance http://url.to.staticContent|ALTERNATIVE_BASE_GROUP will
	;utilize the base group of ALTERNATIVE_BASE_GROUP instead of the base group defined in the DM_INFO
	;table.
	,"Static Content Location:" = ""
	;The viewpoint name key may also contains a default view configuration identified by the use
	;of a : in the viewpoint name.  For instance VIEWPOINT_KEY:DEFAULT_VIEW_CAT_MEAN.  This will
	;force the DEFAULT_VIEW_CAT_MEAN mpage view to be the default view loaded in the viewpoint.
	,"Viewpoint Name Key:" = ""
	;Debug Bitmap Definitions
	;2^0 = Browser Dev on/off
	;2^1 = Set US Locale on/off
	;2^2 = Use Custom Component Examples for Testing
	;2^3 = Ignore cached settings
	;2^4 = Allow Dynamic content build
	;2^5 = Enable Edge mode
	;2^6 = Escape token mappings in URLs for use with a cloud content server
	;2^7 = Force off dynamic tab-click loading (override DM_INFO)
	;2^8 = Force on dynamic tab-click loading (override DM_INFO)
	;2^9 = Alva enabled
	,"Debug Bitmap:" = 0

with OUTDEV, PERSON_ID, ENCNTR_ID, PRSNL_ID, POS_CD, PPR_CD, EXECUTABLE, STATIC_CONTENT, CATEGORY_MEAN, DEBUG_MAP

/* DECLARE RECORDS *******************************************************************************/
;The criterion record structure contains basic information about the patients chart opened and the mpage being viewed
free record criterion
record criterion
(
	1 person_id = f8
	1 person_name = vc
	1 person_info
		2 sex_cd = f8
		2 admin_sex_cd = f8
		2 birth_sex_cd = f8
		2 dob = vc
		2 person_name = vc
	1 encntrs[1]
		2 encntr_id = f8
	1 prsnl_id = f8
	1 executable = vc
	1 static_content = vc
	1 position_cd = f8
	1 ppr_cd = f8
	1 debug_ind = i2
	1 help_file_local_ind = i2
	1 category_mean = vc
	1 locale_id = vc
	1 device_location = vc
	1 encntr_override[*]
		2 encntr_id = f8
	1 logical_domain_id = f8
	1 encntr_location
		2 facility_cd = f8
	1 client_tz = i4
	1 is_utc = i2
	1 username = vc
	1 release_identifier = vc
	1 release_version = vc
	1 alva_enabled = i2
	1 scratchpad_cds_alerts_add = i4
	1 static_content_legacy = vc
%i cclsource:mp_code_list.inc
%i cclsource:status_block.inc
)

;Contains the view_type_means and category_means to be used for
;dynamically loading static content
;Populated by way of subroutine 'DetermineViewFilters'
free record view_types
record view_types(
	1 views[*]
		2 view_mean = vc
)

/* INCLUDES **************************************************************************************/
%i cclsource:mp_common.inc
%i cclsource:mp_script_logging.inc
%i cclsource:mp_namespaced_settings_cache.inc
%i cclsource:mp_filter_token_mappings.inc
%i cclsource:mp_i18n_class.inc
%i cclsource:mp_get_flex_id.inc
%i cclsource:mp_retrieve_splunk_hec_config.inc
 
/* DECLARE SUBROUTINES ***************************************************************************/
declare ParseOverloadedCategoryMean(null) = null with protect
declare ParseOverloadedStaticContentLocation(null) = null with protect
declare PopulateCriterionRec(null) = null with protect
declare PopulateLocaleFilePath(null) = null with protect
declare DetermineMPageType(null) = null with protect
declare LoadViewPointSettings(null) = null with protect
declare GetMPageSettings(null) = null with protect
declare GenerateContentRequirements(null) = null with protect
declare GetChartSearchURL(null) = vc with protect
declare GenerateMPageHTML(null) = null with protect
declare GenerateScriptErrorHTML(message = vc) = null with protect
declare GenerateComponentTokens(null) = null with protect
declare ResolveStaticContentURL(null) = null with protect
declare DetermineViewFilters(null) = null with protect
declare DetermineDeferredLoadCompatibility(null) = null with protect
declare GenerateContentURLsByCategory(null) = null with protect
declare GetBindingMappings(null) = vc with protect

/* DECLARE CONSTANTS *****************************************************************************/
declare STATIC_CONTENT_FOLDER = vc with protect, constant("UnifiedContent")
declare CUSTOM_CONTENT_FOLDER = vc with protect, constant("custom_mpage_content")
;; a constant which identifies that a filter_mean or its resulting tokens can not be tied to a single view
;; e.g., they are used in multiple views or are truly unassociated, as in the case of viewpoint utils, etc.
declare UNSPECIFIED_CATEGORY = vc with protect, constant("__UNSPECIFIED_CATEGORY")
/* DECLARE VARIABLES *****************************************************************************/
declare chartSearchFlag = i2 with protect, noconstant(false)
declare componentTokens = vc with protect, noconstant("")
declare escapedTokens = vc with protect, noconstant("")
declare contentServerURL = vc with protect, noconstant("")
declare cssGroupLinkTags = vc with protect, noconstant("")
declare cssReqs = vc with protect, noconstant("")
declare curEncntrType = f8 with protect, noconstant(0)
declare overrideLocaleAsUS = i2 with protect, noconstant(btest($DEBUG_MAP, 1))
declare useCustomComponentExamples = i2 with protect, noconstant(btest($DEBUG_MAP, 2))
declare ignoreCache = i4 with protect, noconstant(btest($DEBUG_MAP, 3))
declare allowDynamicContentBuild = i4 with protect, noconstant(btest($DEBUG_MAP, 4))
declare enableEdgeMode = i4 with protect, noconstant(btest($DEBUG_MAP, 5))
declare contentFromCloud = i4 with protect, noconstant(btest($DEBUG_MAP, 6))
;; a flag which forces OFF deferred view static content loading (override dm_info)
declare forceLegacyContentLoad = i4 with protect, noconstant(btest($DEBUG_MAP, 7))
;; a flag which forces ON deferred view static content loading (override dm_info and 2^7)
declare forceDeferredContentLoad = i4 with protect, noconstant(btest($DEBUG_MAP, 8))
;; a flag for opting into Alva MPages CCL Script Server
declare alvaEnabled = i4 with protect, noconstant(btest($DEBUG_MAP, 9))
;; the final content load flag, determined by dm_info, overridden by bitmask options
declare legacyContentLoad = i4 with protect, noconstant(true)
declare jsGroupScriptTags = vc with protect, noconstant("")
declare javaScriptReqs = vc with protect, noconstant("")
declare loadViewpointFlag = i2 with protect, noconstant(false)
declare loadCustomComponents = i4 with protect, noconstant(true)
declare loadingMPagesReach = i2 with protect, noconstant(false)
declare mpageCatId = f8 with protect, noconstant(0.0)
declare mpageSettingsJSON = vc with protect, noconstant("")
declare renderFunction = vc with protect, noconstant(" ")
declare categoryMean = vc with protect, noconstant("")
declare defaultViewCatMean = vc with protect, noconstant("")
declare defaultViewInd = i4 with protect, noconstant(0)
declare baseGroupId = vc with protect, noconstant("")
declare staticContentURL = vc with protect, noconstant("")
declare cdContentServerURL = vc with protect, noconstant("")
declare utilizeMPages5XMappings = i2 with protect, noconstant(false)
declare baseContentFolder = vc with protect, noconstant(nullterm(""))
declare baseGroupReleaseIdent = vc with protect, noconstant("")
declare baseGroupReleaseVersion = vc with protect, noconstant("")
;; holds JSON containing the urls which need to be loaded for every view
declare viewStaticContentJSON = vc with protect, noconstant("")
;Pulling chartSearchCSS up out of its subroutine so that it can be added after launching the ViewPoint.
declare chartSearchCSS = vc with protect, noconstant("")
declare flexedKeySuffix = vc with protect, noconstant("")
declare requestBindingJSON = vc with protect, noconstant("")
;Used to check if mp_common.inc is imported or not in mp_get_splunk_hec_config script
declare MP_COMMON_IMPORTED = vc with protect

/* BEGIN PROGRAM *********************************************************************************/
;Parse the viewpoint and default view, if present, from the CATEGORY_MEAN param
call ParseOverloadedCategoryMean(null)
call ParseOverloadedStaticContentLocation(null)

;Populate the criterion record structure
call PopulateCriterionRec(null)

;Populate HEC Configuration from DM_INFO table
call GetSplunkHECConfig(null)

;Populate the locale file path location
call PopulateLocaleFilePath(null)

;Determine if we are loading a viewpoint or a standalone MPage
call DetermineMPageType(null)

;Load the page settings as a viewpoint.  Even if we are loading a single view we will
;treat it like a viewpoint with one view.  The one exception to this is MPages Reach
;It does not support the functionality of a viewpoint and still needs to be loaded as a
;standard view.
if(loadingMPagesReach != true)
	call LoadViewPointSettings(null)
endif

;Load the standalone mpage settings or the default viewpoint view settings
call GetMPageSettings(null)
;Generate the token string for all of the components which can be part of this viewpoint or view
if(contentServerURL != "")
	call DetermineDeferredLoadCompatibility(null)
	call GenerateComponentTokens(null)
else
	;; we are loading master-components up-front
	;; thus there is no static content which we can defer the load of
	set legacyContentLoad = true
endif

;Get request bindings
if ( alvaEnabled = 1 )
	set requestBindingJSON =  GetBindingMappings(null)
endif

;Generate the static content requirements
call GenerateContentRequirements(null)

;Generate the final HTML output
call GenerateMPageHTML(null)

/* SUBROUTINES ***********************************************************************************/


/**
 * Returns a JSON object defining any Script Server overrides
 */
subroutine GetBindingMappings(null)
	call log_message("In GetBindingMappings()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare requestBindings = vc with noconstant(""), private

	if (checkprg("MP_GET_BINDING_MAPPINGS")> 0)
		execute mp_get_binding_mappings

		if (validate(mpages_request_bindings))
			set requestBindings = cnvtrectojson(mpages_request_bindings)
		endif
	endif

	call log_message(build("Exit GetBindingMappings(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)

	return (requestBindings)
end

/**
 * This subroutine parses the viewpoint and default view, if present, from the CATEGORY_MEAN param
 */
subroutine ParseOverloadedCategoryMean(null)
    set categoryMean = trim(piece(cnvtupper($CATEGORY_MEAN), ':', 1, ''), 3)
    set defaultViewCatMean = trim(piece(cnvtupper($CATEGORY_MEAN), ':', 2, ''), 3)
    set defaultViewInd = 0

    if (size(defaultViewCatMean, 1) > 0)
        set defaultViewInd = 1
    endif
end

/**
 * This subroutine parses the static content location to see if an alternative static content URL or
 * base group should be used when defining the static content location or which mappings group to
 * utilize when resolving mappings.  Possible combinations and interpretation are shown below
 *
 * See wiki documentation on how this field is being overloaded and its current usages
 * https://wiki.ucern.com/display/associates/Discern+ABU+Development+Liaison+-+MP_UNIFIED_DRIVER+Usage
 **/
subroutine ParseOverloadedStaticContentLocation(null)
	;Attempt to piece the static content url into url and base group
	;If a url exists, replace the current value of the STATIC_CONTENT with that URL
	set staticContentURL = trim(piece($STATIC_CONTENT, '|', 1, ''), 3)
	;If a base group is defined store it in the baseGroupId global
	set baseGroupId = trim(piece($STATIC_CONTENT, '|', 2, ''), 3)
end


/**
 * This subroutine is used to resolve the static content server URL.  There are various scenarios that can take
 * place since this single script is utilized for multiple releases of MPages.  There are multiple scenarios we
 * must handle based on internal development and uptime requirements during package install.  These scenarios
 * are explained in the code below.
 *
 * Further information can be found on the wiki page for this driver
 * https://wiki.ucern.com/display/associates/Discern+ABU+Development+Liaison+-+MP_UNIFIED_DRIVER+Usage
 **/
subroutine ResolveStaticContentURL(null)
	call log_message("In ResolveStaticContentURL()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare subTimer = dq8 with private, noconstant(curtime3)

	;Grab the base group from the DB if one exists.  This will also allow us to determine if we
	;should use MPages 5.X or 6.X mappings
	if(baseGroupId = "")
		set subTimer = CURTIME3
		select into "nl:"
		from dm_info di
		plan di
			where di.info_domain = "INS"
			and di.info_name = "MP_BASE_GROUP"
		detail
			baseGroupId = trim(di.info_char, 3)
		with nocounter
		call log_message(build("ResolveStaticContentURL:Base group identification, Elapsed time:",
		(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

		;Since there is no base group passed in and we didnt find one in the DB we have to use MPages 5.X mappings
		if(baseGroupId = "")
			;MPages 6.X isnt installed so we have to use 5.X mappings
			set utilizeMPages5XMappings = true
		elseif(staticContentURL != '' AND findstring("|", $STATIC_CONTENT) = 0)
			;MPages 6.X is installed but we still want to use 5.X mappings
			set utilizeMPages5XMappings = true
		else
			;MPages 6.X is installed and we want to use 6.X mappings
			set utilizeMPages5XMappings = false
		endif
	else
		;If any value was passed for the baseGroupId we have to use the MPages 6.X mappings
		set utilizeMPages5XMappings = false
	endif

	;Grab the content server url from the DB if one hasnt been passed in
	if(staticContentURL = '')
		set subTimer = CURTIME3
		select into "nl:"
		from dm_info d
		where d.info_domain = "INS"
        and ( d.info_name = "CONTENT_SERVICE_URL" or d.info_name = "CD_CONTENT_SERVICE_URL" )
		detail
            if(d.info_name = "CONTENT_SERVICE_URL")
			contentServerURL = trim(d.info_char, 3)
            endif
            if(d.info_name = "CD_CONTENT_SERVICE_URL")
                cdContentServerURL = trim(d.info_char, 3)
            endif
		with nocounter
		call log_message(build("ResolveStaticContentURL:static_content server query, Elapsed time:",
		(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

		;Check to see if a static content location exists
		if(contentServerURL = "")
			;No static content server or static content file location defined so show an error message
			set _Memory_Reply_String = "No Static Content passed to script or defined in CONTENT_SERVICE_URL"
			go to exit_script
		endif
	endif

	; at this point, contentServerURL will have some value when the alva enabled flag is not set
	; So set the value to static_content_legacy which will be used by custom components
	set criterion->static_content_legacy = contentServerURL

	;We need to check and see if MPages 6.X is installed in the domain.  This will be based on the
	;existence of a base group being defined in the database or having been passed in via the
	;overloaded STATIC_CONTENT parameter
	if(utilizeMPages5xMappings = true)
		;If no alternate static content url has been passed in we need to append the standard static
		; content folder, otherwise we will leave it be
		if(staticContentURL = '')
			set contentServerURL = build2(contentServerURL, "/", STATIC_CONTENT_FOLDER)
			set criterion->static_content = contentServerURL
		elseif(allowDynamicContentBuild = 1)
			;An alternative web server url is passed so we need to populate the contentServerURL
			set contentServerURL = staticContentURL
			set criterion->static_content = contentServerURL
		else
			;The staticContentURL isnt blank, but the caller hasnt indicated that a dynamic build is allowed
			;so we shouldnt populate the contentServerURL
			set criterion->static_content = staticContentURL
		endif

	else
		if(staticContentURL != '')
			;This is the alternative static content url scenario once MPages 6.X is installed
			if(allowDynamicContentBuild = 1)
				set contentServerURL = staticContentURL
				set criterion->static_content = contentServerURL
			else
				set criterion->static_content = staticContentURL
			endif
		else
			;This is the default static content url scenario once MPages 6.X is installed
			set criterion->static_content = contentServerURL
		endif

        if(alvaEnabled = 1 and cdContentServerURL != "")
            ;We are using a continuous delivery content server
            set criterion->static_content = build(cdContentServerURL, "/static")
        endif
		;We only need to grab the base group if we are pulling from a content server
        if(contentServerURL != '' or (alvaEnabled = 1 and cdContentServerURL != ''))
            set subTimer = CURTIME3
			select into "nl:"
			from mp_group mg
				, mp_release mr
			plan mg
				where mg.group_ident = baseGroupId
			join mr
				where mr.mp_release_id = mg.mp_release_id
			detail
				baseContentFolder = build2("/", mg.base_folder)
				baseGroupReleaseIdent = mr.release_ident
				baseGroupReleaseVersion = mg.version_txt
			with nocounter
			call log_message(build("ResolveStaticContentURL:Base group release and base folder, Elapsed time:",
				(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

			if(baseContentFolder = '' OR baseContentFolder = '/')
				;The base group we have either doesnt exist or the DB entry is corrupt
				set _Memory_Reply_String = build2("Base Group ", baseGroupId, " is not valid")
				go to exit_script
			endif

			if(baseGroupReleaseIdent = '')
				;The base group we have either doesnt exist or the DB entry is corrupt
				set _Memory_Reply_String = build2("Base Group ", baseGroupId, " is not associated to a release")
				go to exit_script
			endif
		endif
	endif

	if(validate(debug_ind) = 1)
		if(utilizeMPages5XMappings)
			call echo("Utilizing MPages 5.X component mappings scheme")
		else
			call echo("Utilizing MPages 6.X component mappings scheme")
			call echo(build2("Base Group Id: ", baseGroupId))
		endif
		call echo(build2("Content Server URL: ", contentServerURL))
        call echo(build2("CD Content Server URL: ", cdContentServerURL))
	endif

	call log_message(build("Exit ResolveStaticContentURL(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * This subroutine determines whether or not deferred static content loading should be used
 */
subroutine DetermineDeferredLoadCompatibility(null)
	;; Note: 'legacyContentLoad' defaults to true
	if (forceDeferredContentLoad = true)
		set legacyContentLoad = false
	elseif (forceLegacyContentLoad != true and loadingMPagesReach != true)
		;; if no override flags are passed to the driver, dm_info will determine if this release
		;; is compatible with the deferred content loading scheme
		;; Note: MPages Reach is not contained within a viewpoint and cannot use the deferred loading scheme
		select into "nl:"
		from dm_info d
		where d.info_domain = ^MP_DEFERRED_VIEW_COMPATIBLE^
		and d.info_name = baseGroupReleaseIdent
		if (curqual > 0)
			set legacyContentLoad = false
		endif
	endif
end ; DetermineDeferredLoadCompatibility

/**
 * This subroutine is used to populate the entirety of the the criterion record structure
 */
subroutine PopulateCriterionRec(null)
	call log_message("In PopulateCriterionRec()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare ACTIVE_STATUS = f8 with protect, constant(uar_get_code_by("MEANING", 48, "ACTIVE"))

	declare cnt = i4 with protect, noconstant(0)
	declare subTimer = dq8 with private, noconstant(curtime3)

	;Populate all of the standard fields
	set criterion->person_id = $PERSON_ID
	set criterion->encntr_id = $ENCNTR_ID
	;Ensure a prsnl_id is being set if one is not passed into the script
	set criterion->prsnl_id = $PRSNL_ID
	if(criterion->prsnl_id = 0.0)
		set criterion->prsnl_id = reqinfo->updt_id
	endif
	set criterion->executable = $EXECUTABLE
	;Ensure a position_cd is being set if one is not passed into the script
	set criterion->position_cd = $POS_CD
	if(criterion->position_cd = 0.0)
		set criterion->position_cd = reqinfo->position_cd
	endif
	set criterion->ppr_cd = $PPR_CD
	set criterion->debug_ind = $DEBUG_MAP
	;At this point this value could be a category mean to a single view or to a viewpoint.
	;If it is the viewpoint category mean, it will be overwritten by the default view in
	;the LoadViewPointSettings subroutine
	set criterion->category_mean = cnvtupper(categoryMean)

	;Grab patient specific information if the patient_id has been populated
	if(criterion->person_id > 0.0)
		;Grab patient's sex, admin sex, birth sex and DOB
		set subTimer = CURTIME3
		select into "nl:"
		from person p
			,person_patient pp
		plan p 
			where p.person_id = criterion->person_id
		join pp 
			where pp.person_id = outerjoin(p.person_id)
		order by p.person_id
		detail
			criterion->person_info.dob = trim(format(cnvtdatetimeutc(p.birth_dt_tm, 3),"YYYY-MM-DDTHH:MM:SSZ;3;Q"), 3)
			criterion->person_info.sex_cd = p.sex_cd
			criterion->person_info.admin_sex_cd = p.sex_cd
			criterion->person_info.birth_sex_cd = pp.birth_sex_cd
			criterion->person_info.person_name = p.name_full_formatted
			criterion->logical_domain_id = p.logical_domain_id
			call AddCodeToList(p.sex_cd, criterion)
			call AddCodeToList(pp.birth_sex_cd, criterion)
		with nocounter
		call log_message(build("PopulateCriterionRec:person and person_patient table query, Elapsed time:",
			(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)
		call ERROR_AND_ZERO_CHECK_REC(curqual, "Person and person_patient table query", "GetPatientData", 1, 0, criterion)

		;Grab all of the active encounters for a person
		set subTimer = CURTIME3
		select into "nl:"
		from encounter e
		where e.person_id = criterion->person_id
		and e.active_status_cd = ACTIVE_STATUS
		detail
			cnt = cnt + 1
			if (mod(cnt, 10) = 1)
				stat = alterlist(criterion->encntr_override, cnt + 9)
			endif
			criterion->encntr_override[cnt].encntr_id = e.encntr_id
			;Save the current encounter type for later use if loading a viewpoint
			;Save the facility_cd for later use.
			if(e.encntr_id = criterion->encntrs[1].encntr_id)
				curEncntrType = e.encntr_type_cd
				criterion->encntr_location.facility_cd = e.loc_facility_cd
			endif
		foot report
			stat = alterlist(criterion->encntr_override, cnt)
		with nocounter
		call log_message(build("PopulateCriterionRec:encntr override query, Elapsed time:",
				(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)
		call ERROR_AND_ZERO_CHECK_REC(curqual, "Encounter override query", "GetEncounterOverride", 1, 0, criterion)
	endif

	;Check to see if help files should be accessed locally or should be accessed through the interwebs
	set subTimer = CURTIME3
	select into "nl:"
	from dm_info d
	where d.info_domain = "DATA MANAGEMENT"
	and d.info_name = "HELP LOCATION"
	detail
		criterion->help_file_local_ind = 1
	with nocounter
	call log_message(build("PopulateCriterionRec:help file query, Elapsed time:",
		(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

	;Check to see which version of the Orders API to use (default to new Orders API which fires on Scratchpad Add)
	set criterion->scratchpad_cds_alerts_add = 1
	set subTimer = CURTIME3
	select into "nl:"
	from dm_info d
	where d.info_domain = "INS"
	and d.info_name = "MP_SCRATCHPAD_CDS_ALERTS_ADD"
	and d.info_number = 0.0
	detail
		criterion->scratchpad_cds_alerts_add = 0
	with nocounter
	call log_message(build("PopulateCriterionRec:scratchpad_cds_alerts_add query, Elapsed time:",
		(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

	;Resolve the static content url we will need to utilize to retrieve content
	call ResolveStaticContentURL(null)
	;Add the Base Group release identifier and version to the criterion if it has been populated
	if(baseGroupReleaseIdent != "")
		set criterion->release_identifier = baseGroupReleaseIdent
		set criterion->release_version = baseGroupReleaseVersion
	endif

	;Handle Locale configuration
	;	If the $DEBUG_MAP is defined to override to en_US, re-initialize the mp:i18n object
	if(overrideLocaleAsUS = 1)
		call mp::i18n.initLocale("en_US")
	endif

	set criterion->locale_id = mp::i18n.getLocale(null)

	;Populate the formats to be used for datetime or numeric formatting
	call mp::i18n.generateMasks(null)

	;populate the the current time zone
	set criterion->client_tz = curtimezoneapp

	;set the utc on/off status in criterion object
	set criterion->is_utc = curutc

	;Grab the username of the personnel
	select into "nl:"
	from prsnl p
	where p.person_id = criterion->prsnl_id
	detail
		criterion->username = p.username
	with nocounter

 	;Set indicator if in an Alva environment
 	set criterion->alva_enabled = alvaEnabled

	call log_message(build("Exit PopulateCriterionRec(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * This subroutine is used to determine the location of the locale file.
 * Use the value defined in the MP_I18N class for LocaleFilePath unless it doesn't exist
 * Then we should use the following logic:
 * If the corresponding TRANS row exists in the DM_INFO table and
 * the $DEBUG_MAP is not defined to override to en_US, we will utilize the location retrieve
 * from the DM_INFO table. Otherwise, we will keep utilizing the English locale location
 */
subroutine PopulateLocaleFilePath(null)
	call log_message("In PopulateLocaleFilePath()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = DM12 with protect, constant(systimestamp)

	declare localeFilePath = vc with protect, noconstant("")

	;First, determine if an existing value has been defined in the MP_I18N class for the LocaleFilePath.
	;If so, that means that the LocaleFilePath has been provided by the I18N override logic, and that
	;should be used.
	if(trim(mp::i18n.getLocaleFilePath(null),3) = "")
		if(baseGroupReleaseIdent != '')
			select into 'nl:'
			from dm_info d
			where d.info_domain = 'INS'
			and d.info_name = concat(baseGroupReleaseIdent, '_TRANS')
			detail
				localeFilePath = build2(criterion->static_content, trim(d.info_char, 3))
			with nocounter

			call log_message(concat("PopulateLocaleFilePath: locale file path query, Elapsed time: ", cnvtstring(timestampdiff(
			systimestamp, BEGIN_DATE_TIME),17,4)), LOG_LEVEL_DEBUG)
		endif

		if(localeFilePath = '' or overrideLocaleAsUS = 1)
			set localeFilePath = build2(criterion->static_content, baseContentFolder, '/js/locale/locale.js')
		endif

		call mp::i18n.setLocaleFilePath(localeFilePath)
	endif

	call log_message(concat("Exit PopulateLocaleFilePath(), Elapsed time: ", cnvtstring(timestampdiff(systimestamp,BEGIN_DATE_TIME
	),17,4)), LOG_LEVEL_DEBUG)
end


/**
 * This subroutine is used to determine the type of page being loaded.  If loading a viewpoint
 * the loadViewpointFlag will be set to 1.
 */
subroutine DetermineMPageType(null)
	call log_message("In DetermineMPageType()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private

	declare subTimer = dq8 with private, noconstant(curtime3)
	declare loadMPageFlag = i2 with protect, noconstant(0)

	;Check to see if we are working with a viewpoint and return if we are
	select into "nl:"
	from mp_viewpoint mpv
	where mpv.viewpoint_name_key = criterion->category_mean
	and mpv.active_ind = 1
	detail
		loadViewpointFlag = true
	with nocounter
	call log_message(build("DetermineMPageType:viewpoint query, Elapsed time:",
			(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

	if(loadViewpointFlag = false)
		;Check to see if we are loading an MPage Instead
		set subTimer = CURTIME3
		select into "nl:"
		from br_datamart_category bdc
		where bdc.category_mean = criterion->category_mean
		detail
			loadMPageFlag = true
			;Save off the category id for later use
			mpageCatId = bdc.br_datamart_category_id
			;Determine if we are loading MPagesReach
			if(bdc.category_mean = "MP_REACH_V5" or bdc.category_mean = "MP_REACH")
				loadingMPagesReach = true
			endif
		with nocounter
		call log_message(build("DetermineMPageType:mpage query, Elapsed time:",
			(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)
		;Throw an error if we dont even get a hit on an MPage
		call ERROR_AND_ZERO_CHECK_REC(curqual, "MPage type identification", "DetermineMPageType", 1, 0, criterion)
	endif

	if(mpageCatId = 0.0 AND loadViewpointFlag = false)
		call echo(build2("Invalid view or view identifier: ", $CATEGORY_MEAN))
		call GenerateScriptErrorHTML('Invalid View or Viewpoint Identifier')
		go to exit_script
	endif

	call log_message(build("DetermineMPageType:loadViewpoint=",loadViewpointFlag," loadMPage=",loadMPageFlag),LOG_LEVEL_DEBUG)
	call log_message(build("Exit DetermineMPageType(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * Loads all of the information necessary to render a viewpoint.  This includes MPages View tabs, their locations based
 * on user preferences, the encounter based default view and the flags for various utilities
 */
subroutine LoadViewPointSettings(null)
	call log_message("In LoadViewPointSettings()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare optionsFlag = i4 with protect, noconstant(0)
	declare APP_NUMBER = i4 with protect, constant(3202020) ;3202020(MPages Application Number)

	;Determine if we are loading a single view as a viewpoint or an actual viewpoint
	if(loadViewpointFlag = false)
		set loadViewpointFlag = true
		set optionsFlag = optionsFlag + 2
	endif

	;OUTDEV, VIEWPOINT_KEY, DEFAULT_VIEW_KEY, ENCNTR_ID, PRSNL_ID, POS_CD, OPTIONS, APP_NUMBER
	execute mp_get_viewpoint_settings ^MINE^, categoryMean, defaultViewCatMean,
	    $ENCNTR_ID, $PRSNL_ID, $POS_CD, optionsFlag, APP_NUMBER

	;Set the initial category mean based on the default active view
	set criterion->category_mean = vp_info->active_view_cat_mean

	call log_message(build("Exit LoadViewPointSettings(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * Retreives all of the settings for the default view in an MPage or the standalone mpage
 */
subroutine GetMPageSettings(null)
	call log_message("In GetMPageSettings()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare APP_NUMBER = i4 with protect, constant(3202020) ;3202020(MPages Application Number)

	;Clear the memory reply string in prep for the mpage settings
	set _memory_reply_string = ""
	execute mp_get_mpage_settings ^mine^, criterion->category_mean,
		criterion->prsnl_id, criterion->position_cd, 0, ignoreCache, criterion->encntrs[1].encntr_id, APP_NUMBER

	;Save off the settings in reclear the memory reply string and prepare for the final HTML markup
	set mpageSettingsJSON = replace(_memory_reply_string, ^'^, ^\'^)
	set mpageSettingsJSON = replace(_memory_reply_string, ^\"^, ^\\\"^)
	set _memory_reply_string = ""

	call log_message(build("Exit GetMPageSettings(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * This function is used to create the component token string for use with the MPages static content server
 */
subroutine GenerateComponentTokens(null)
	call log_message("In GenerateComponentTokens()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare subTimer = dq8 with protect, noconstant(CURTIME3)
    declare NOT_FOUND_FILTER_MEAN = vc with constant("<not_found>")

	declare compCnt = i4 with protect, noconstant(0)
	declare compIndx = i4 with protect, noconstant(0)
	declare flexId = f8 with protect, noconstant(0.0)
	declare indx = i4 with protect, noconstant(0)
	declare loadCustCompFlag = i4 with protect, noconstant(false)
	declare qocIndx = i4 with protect, noconstant(0)
	declare grouperViewInd = i4 with protect, noconstant(0)
	declare groupedViewCatMeans = vc with protect, noconstant("mv.viewpoint_name_key in (")
	declare findPosLevelSettings = i2 with protect, noconstant(0)
	declare settingsKey = vc with protect, noconstant("")
	declare pageRecIndx = i4 with protect, noconstant(0)
	declare num = i4 with noconstant(1)

	free record mpage_comp_filters
	record mpage_comp_filters(
		1 filter[*]
			2 filter_mean = vc
	)

	free record page_rec
	record page_rec(
		1 category_id[*]
			2 id = f8
			2 cat_mean = vc
			2 filters_json = vc
			2 components_defined = i4
			2 filters[*]
				3 filter_mean = vc
	)

	;; keep a list of filter_means which are not associated to a specific view
	free record unassociated_filters
	record unassociated_filters(
		1 filter[*]
			2 filter_mean = vc
	)

	;This record is used for the call to getFlexId in mp_get_flex_id.inc
	free record flex_settings
	record flex_settings(
	    1 mpage[*]
	        2 cat_id = f8
	        2 cat_mean = vc
	        2 nurse_unit_flex_id = f8
	        2 building_flex_id = f8
	        2 facility_flex_id = f8
	        2 position_flex_id = f8
	        2 pos_loc_settings_ind = i2
	)


	free record tokenReply
	record tokenReply(
		1 group_cnt = i4
		1 groups[*]
			2 base_folder = vc ;; base folder for the group example: MPages_6_0
			2 mappings_json = vc ;; parameters to be passed into mpages content service
%i cclsource:status_block.inc
	)

	;Grab the filter means for all the components which could be displayed in the view or viewpoint
	;Gather all of the category_ids for the pags we have to check.  MPages Reach still requires
	;that it be loaded as a single view, thus we have to handle that scenario appropriately.
	if(loadingMPagesReach != true)
		set stat = alterlist(page_rec->category_id, size(vp_info->views, 5))
		for(indx = 1 to size(vp_info->views, 5))
			if(vp_info->views[indx].view_type != 4)
				set page_rec->category_id[indx]->id = vp_info->views[indx].view_cat_id
				set page_rec->category_id[indx]->cat_mean = vp_info->views[indx].view_cat_mean
				set page_rec->category_id[indx]->components_defined = false
			endif

			;Check to see if one of the views identified is a grouped view.  Currently this type of view
			;is hardcoded to pull in settings from a well defined viewpoint (Viewpoint Mean "GROUPEDVIEW") so we
			;must also determine all of the views that will be displayed under that viewpoint.
			if(vp_info->views[indx].view_type_mean = "WF_GRP_VIEW")
				set grouperViewInd = 1
				set groupedViewCatMeans = build2(groupedViewCatMeans, '^', vp_info->views[indx].grouped_view_viewpoint_id, '^,')
			endif
		endfor
		;replace the last comma in the built string and finish off the parser string
		set groupedViewCatMeans = trim(replace(groupedViewCatMeans, ",", "", 2), 3)
		set groupedViewCatMeans = build2(groupedViewCatMeans, ")")
	else
		set stat = alterlist(page_rec->category_id, 1)
		set page_rec->category_id[1].id = mpageCatId
		set page_rec->category_id[1].cat_mean = criterion->category_mean
		set page_rec->category_id[1]->components_defined = false
	endif

	;If we have identified that a grouper view is part of our viewpoint, we must pull the settings for
	;the GROUPEDVIEW viewpoint as well.
	if(grouperViewInd)
		select into "nl:"
		from
			mp_viewpoint mv
			,mp_viewpoint_reltn mvr
			,br_datamart_category bdc
		plan mv
			where parser(groupedViewCatMeans)
			and mv.active_ind = 1
		join mvr
			where mvr.mp_viewpoint_id = mv.mp_viewpoint_id
		join bdc
			where bdc.br_datamart_category_id = mvr.br_datamart_category_id
		detail
			indx = size(page_rec->category_id, 5) + 1
			stat = alterlist(page_rec->category_id, indx)
			page_rec->category_id[indx].id = mvr.br_datamart_category_id
			page_rec->category_id[indx].cat_mean = bdc.category_mean
		with nocounter
	endif

	;set up flex_settings
	set stat = alterlist(flex_settings->mpage,size(page_rec->category_id,5))
	for(indx = 1 to size(page_rec->category_id, 5))
		set flex_settings->mpage[indx].cat_id = page_rec->category_id[indx]->id
		set flex_settings->mpage[indx].cat_mean = page_rec->category_id[indx]->cat_mean
	endfor


	;call getFlexId defined in mp_get_flex_id.inc to determine if position or position+location flexing is set up
	call getFlexId(criterion->position_cd, locRecord, flex_settings, "BR_DATAMART_REPORT")

	;Check the cache for already retrieved filters if the ignore cache flag isnt set
	if(ignoreCache != true)
		for(indx = 1 to size(page_rec->category_id, 5))

			;Initialize key with identifier for default settings
			set settingsKey = trim(build2("COMP_FILTER_MAPPINGS|", trim(cnvtstring(page_rec->category_id[indx]->id),3)))

			;Get additional key suffix identifiers if view is flexed by position or position+location
			;defined in mp_get_flex_id.inc
			set flexedKeySuffix = getFlexedSettingsKey(criterion->position_cd
														,flex_settings->mpage[indx].position_flex_id
														,flex_settings->mpage[indx].pos_loc_settings_ind
														,flex_settings->mpage[indx].nurse_unit_flex_id
														,flex_settings->mpage[indx].building_flex_id
														,flex_settings->mpage[indx].facility_flex_id
														,locRecord)

            ;Only use flexed key suffix if it is valid
			if(textlen(trim(flexedKeySuffix)) > 0)
				set settingsKey = build2(settingsKey,flexedKeySuffix)
			endif

			;Try to retrieve the cached settings
			set page_rec->category_id[indx]->filters_json = GetNamespacedSettings("MP", settingsKey)

			if(page_rec->category_id[indx]->filters_json != "")
				;We have cached records so we need to copy them into the master list
				set stat = cnvtjsontorec(page_rec->category_id[indx]->filters_json)
				set stat = movereclist(mpage_comp_filters->filter, comp_filters->filter, 1, size(comp_filters->filter, 5),
					size(mpage_comp_filters->filter,5), 1)
				; copy the filter_means into lists segregated by category_mean
				set stat = movereclist(mpage_comp_filters->filter, page_rec->category_id[indx]->filters, 1, 0,
					size(mpage_comp_filters->filter,5), 1)
					;Clear the record structure for the next iteration
				set stat = initrec(mpage_comp_filters)
			endif
		endfor
	endif

	;This record is used to store all of the ids of all of the components selected to display within the mpages
	;being retrieved
	free record comp_reports
	record comp_reports(
		1 report_list[*]
			2 report_id = f8
	)

	set subTimer = CURTIME3

	;First see if we have pos+loc settings defined and use those instead of position/default settings
	select into "nl:"
	mpage_param_mean = if(bdv.mpage_param_mean = null or bdv.mpage_param_mean = "") "AAA" else bdv.mpage_param_mean endif
	from (dummyt d with seq = value(size(page_rec->category_id, 5)))
	, br_datamart_category bdc
	, br_datamart_report bdr
	, br_datamart_value bdv
	, br_datamart_flex flex1
	, br_datamart_flex flex2
	plan d
		where page_rec->category_id[d.seq].filters_json = ""
	join bdc
		where bdc.br_datamart_category_id = page_rec->category_id[d.seq].id
	join bdr
		where bdr.br_datamart_category_id = bdc.br_datamart_category_id
	join bdv
		where bdv.br_datamart_category_id = bdr.br_datamart_category_id
		and bdv.parent_entity_name = "BR_DATAMART_REPORT"
		and bdv.parent_entity_id = bdr.br_datamart_report_id
	join flex1
		where flex1.br_datamart_flex_id = bdv.br_datamart_flex_id
		and flex1.parent_entity_id in (locRecord->nurseUnitCd, locRecord->buildingCd, locRecord->facilityCd)
	join flex2
		where flex2.br_datamart_flex_id = flex1.grouper_flex_id
		and flex2.parent_entity_id = criterion->position_cd
	order by bdr.br_datamart_category_id, bdr.br_datamart_report_id, mpage_param_mean
	head bdr.br_datamart_report_id
		if(bdv.mpage_param_mean != "mp_vb_component_status")
			compCnt = compCnt + 1
			if(mod(compCnt, 50) = 1)
				stat = alterlist(comp_reports->report_list, compCnt + 49)
			endif
			comp_reports->report_list[compCnt]->report_id = bdr.br_datamart_report_id
			;Mark the pages that have components defined
			page_rec->category_id[d.seq].components_defined = true
		endif
	with nocounter

	for(indx = 1 to size(page_rec->category_id, 5))
		if(page_rec->category_id[indx].components_defined = false)
			set findPosLevelSettings = 1
		endif
	endfor

	;If check is needed as dummyt will default to 1 even if nothing qualifies
	if(findPosLevelSettings = 1)
		select into "nl:"
			mpage_param_mean = if(bdv.mpage_param_mean = null or bdv.mpage_param_mean = "") "AAA" else bdv.mpage_param_mean endif
		from (dummyt d with seq = value(size(page_rec->category_id, 5)))
			, br_datamart_category bdc
			, br_datamart_report bdr
			, br_datamart_value bdv
			, br_datamart_flex bx
		plan d
			where page_rec->category_id[d.seq].filters_json = ""
			and page_rec->category_id[d.seq].components_defined = false
		join bdc
			where bdc.br_datamart_category_id = page_rec->category_id[d.seq].id
		join bdr
			where bdr.br_datamart_category_id = bdc.br_datamart_category_id
		join bdv
			where bdv.br_datamart_category_id = bdr.br_datamart_category_id
			and bdv.parent_entity_name = "BR_DATAMART_REPORT"
			and bdv.parent_entity_id = bdr.br_datamart_report_id
		join bx
			where bx.br_datamart_flex_id = bdv.br_datamart_flex_id
			and bx.parent_entity_id in (criterion->position_cd, 0.0)
		order by bdr.br_datamart_category_id, bx.parent_entity_id desc, bdr.br_datamart_report_id, mpage_param_mean
		head bdr.br_datamart_category_id
			flexId = bx.parent_entity_id
		head bdr.br_datamart_report_id
			;Only grab the component which should be displayed based on the position flexing
			if(flexId = bx.parent_entity_id and bdv.mpage_param_mean != "mp_vb_component_status")
				compCnt = compCnt + 1
				if(mod(compCnt, 50) = 1)
					stat = alterlist(comp_reports->report_list, compCnt + 49)
				endif
				comp_reports->report_list[compCnt]->report_id = bdr.br_datamart_report_id
				;Mark the pages that have components defined
				page_rec->category_id[d.seq].components_defined = true
			endif
		with nocounter
	endif

	set stat = alterlist(comp_reports->report_list, compCnt)

	call log_message(build("GenerateComponentTokens:selected components query, Elapsed time:",
		(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

	;Special logic for pages whose components do not have a BR_DATAMART_REPORT row currently this includes QOC and ICU Dashboard
	select into "nl:"
	from
		(dummyt d with seq = value(size(page_rec->category_id, 5)))
		, br_datamart_category bdc
		, br_datamart_report bdr
	plan d
		where page_rec->category_id[d.seq].filters_json = ""
		and page_rec->category_id[d.seq].components_defined = false
	join bdc
		where bdc.br_datamart_category_id = page_rec->category_id[d.seq].id
		join bdr
			where bdr.br_datamart_category_id = bdc.br_datamart_category_id
		order by bdr.br_datamart_report_id
		head bdr.br_datamart_report_id
			compCnt = compCnt + 1
			if(compCnt > size(comp_reports->report_list, 5))
				stat = alterlist(comp_reports->report_list, compCnt + 5)
			endif
			comp_reports->report_list[compCnt]->report_id = bdr.br_datamart_report_id
		foot report
			stat = alterlist(comp_reports->report_list, compCnt)
		with nocounter

	;For all pages which did not have cached filter mappings we will need to grab them from the DB
	set subTimer = CURTIME3
	select into "nl:"
	from (dummyt d with seq = value(size(page_rec->category_id, 5)))
		, br_datamart_category bdc
		, br_datamart_report bdr
		, br_datamart_report_filter_r rfr
		, br_datamart_filter bdf
	plan d
		where page_rec->category_id[d.seq].filters_json = ""
	join bdc
		where bdc.br_datamart_category_id = page_rec->category_id[d.seq].id
	join bdr
		where bdr.br_datamart_category_id = bdc.br_datamart_category_id
		and expand(indx, 1, size(comp_reports->report_list, 5), bdr.br_datamart_report_id,
			comp_reports->report_list[indx]->report_id)
	join rfr
		where rfr.br_datamart_report_id = bdr.br_datamart_report_id
	join bdf
		where bdf.br_datamart_filter_id = rfr.br_datamart_filter_id
		and bdf.filter_category_mean = "MP_SECT_PARAMS"
	order by bdc.br_datamart_category_id, bdr.br_datamart_report_id
	head bdc.br_datamart_category_id
		;Clear the mpage_comp_filters rec
		stat = initrec(mpage_comp_filters)
		;reset the compCnt
		compCnt = 0

	head bdr.br_datamart_report_id
		compCnt = compCnt + 1
		if(mod(compCnt, 50) = 1)
			stat = alterlist(mpage_comp_filters->filter, compCnt + 49)
		endif
		mpage_comp_filters->filter[compCnt]->filter_mean = bdf.filter_mean
	foot bdc.br_datamart_category_id
		;resize the record structure
		stat = alterlist(mpage_comp_filters->filter, compCnt)

		;Cache the filter mappings for future use
		;Initialize key for default settings
		settingsKey = trim(build2("COMP_FILTER_MAPPINGS|", trim(cnvtstring(bdr.br_datamart_category_id),3)), 3)

	  	;Get additional key suffix identifiers if view is flexed by position or position+location
		;defined in mp_get_flex_id.inc

		flexedKeySuffix = ""

		 pageRecIndx = locateval(indx, 1, size(page_rec->category_id, 5),bdr.br_datamart_category_id,
									 flex_settings->mpage[indx].cat_id)
		if(pageRecIndx>0)
			flexedKeySuffix = getFlexedSettingsKey(criterion->position_cd
													,flex_settings->mpage[pageRecIndx].position_flex_id
													,flex_settings->mpage[pageRecIndx].pos_loc_settings_ind
													,flex_settings->mpage[pageRecIndx].nurse_unit_flex_id
													,flex_settings->mpage[pageRecIndx].building_flex_id
													,flex_settings->mpage[pageRecIndx].facility_flex_id
													,locRecord)
		endif
		;Only use flexed key suffix if it is valid
		if(textlen(trim(flexedKeySuffix)) > 0)
				settingsKey = build2(settingsKey,flexedKeySuffix)
		endif

		stat = CacheNamespacedSettings("MP", settingsKey, cnvtrectojson(mpage_comp_filters))
		;Copy over this mpage's component filters
		stat = movereclist(mpage_comp_filters->filter, comp_filters->filter, 1, size(comp_filters->filter, 5),
				size(mpage_comp_filters->filter,5), 1)
		; also copy the filter_means into lists segregated by category_mean
		stat = movereclist(mpage_comp_filters->filter, page_rec->category_id[d.seq]->filters, 1, 0,
			size(mpage_comp_filters->filter,5), 1)
	with nocounter
	call log_message(build("GenerateComponentTokens:filter mean query, Elapsed time:",
		(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

	;Add the Order selection component to the list if QOC is one of the MPages returned.
	;If present the QOC page will be in the viewpoint record structure.  However if we
	;are loading the MPages Reach pages this will not be populated nor will the QOC view
	;be available
	if(loadingMPagesReach != true)
		set qocIndx = locateval(indx, 1, size(vp_info->views, 5), "MP_COMMON_ORDERS_V4", vp_info->views[indx].view_cat_mean)
	endif

	;If QOC v4 is in our list we always add ORD_SEL_ADD_FAV_FOLDER manually since it is not a component that you can select in Bedrock
	if(qocIndx > 0)
		set indx = size(unassociated_filters->filter, 5) + 1
		set stat = alterlist(unassociated_filters->filter, indx)
		set unassociated_filters->filter[indx].filter_mean = ^ORD_SEL_ADD_FAV_FOLDER^
	endif

	;Add IPASS utility to listing if bedrock viewpoint setting ipass_enabled in vp_info
	;is set to 1
	if(vp_info->ipass_enabled = "1")
		set indx = size(unassociated_filters->filter, 5) + 1
		set stat = alterlist(unassociated_filters->filter, indx)
		set unassociated_filters->filter[indx].filter_mean = ^VP_IPASS^
	endif

	if (validate(vp_info->notifications) = 1)
		;Add VP_NOTIFICATIONS utility to listing if bedrock viewpoint setting NOTIFICATION_CENTER_ENABLED in vp_info
		;is set to 1
		if(validate(vp_info->notifications->notification_center_enabled, 0) = 1)
			set indx = size(unassociated_filters->filter, 5) + 1
			set stat = alterlist(unassociated_filters->filter, indx)
			set unassociated_filters->filter[indx].filter_mean = ^VP_NOTIFICATIONS^
		endif

	    ;Add WF_NOTIF_TOGGLE_RTE utility to listing if bedrock viewpoint setting WF_NOTIF_TOGGLE_RTE in vp_info
		;is set to 1
		if(validate(vp_info->notifications->WF_NOTIF_TOGGLE_RTE, 0) = 1)
			set indx = size(unassociated_filters->filter, 5) + 1
			set stat = alterlist(unassociated_filters->filter, indx)
			set unassociated_filters->filter[indx].filter_mean = ^WF_NOTIF_TOGGLE_RTE^
		endif

		;Add WF_NOTIF_TOGGLE_EXPORD utility to listing if bedrock viewpoint setting WF_NOTIF_TOGGLE_EXPORD in vp_info
		;is set to 1
		if(validate(vp_info->notifications->WF_NOTIF_TOGGLE_EXPORD, 0) = 1)
			set indx = size(unassociated_filters->filter, 5) + 1
			set stat = alterlist(unassociated_filters->filter, indx)
			set unassociated_filters->filter[indx].filter_mean = ^WF_NOTIF_TOGGLE_EXPORD^
		endif

		;Add all the notification filter means to the unassociated_filters
		if (validate(vp_info->notifications->WF_NOTIF_FILTER_MEANS) = 1)
			set num = 1
			set str = piece(vp_info->notifications->WF_NOTIF_FILTER_MEANS, ',', num, NOT_FOUND_FILTER_MEAN, 3)
			while(str != NOT_FOUND_FILTER_MEAN)
				set indx = size(unassociated_filters->filter, 5) + 1
				set stat = alterlist(unassociated_filters->filter, indx)
				set unassociated_filters->filter[indx].filter_mean = str
				set num = num + 1
				set str = piece(vp_info->notifications->WF_NOTIF_FILTER_MEANS, ',', num, NOT_FOUND_FILTER_MEAN, 3)
			endwhile
		endif
	endif

	if (validate(vp_info->voice) = 1)
		;Add VP_VOICE utility to listing if bedrock viewpoint setting WF_VOICE_ENABLED in vp_info
		;is set to 1
		if(validate(vp_info->voice.voice_enabled, 0) = 1)
			set indx = size(unassociated_filters->filter, 5) + 1
			set stat = alterlist(unassociated_filters->filter, indx)
			set unassociated_filters->filter[indx].filter_mean = ^VP_VOICE^
		endif

		;Add all the voice filter means to the unassociated_filters
		if (validate(vp_info->voice->WF_VOICE_CONFIG) = 1)
		  set num = 1
			set str = piece(vp_info->voice->WF_VOICE_CONFIG, ',', num, NOT_FOUND_FILTER_MEAN, 3)
			while(str != NOT_FOUND_FILTER_MEAN)
				set indx = size(unassociated_filters->filter, 5) + 1
				set stat = alterlist(unassociated_filters->filter, indx)
				set unassociated_filters->filter[indx].filter_mean = str
				set num = num + 1
				set str = piece(vp_info->voice->WF_VOICE_CONFIG, ',', num, NOT_FOUND_FILTER_MEAN, 3)
			endwhile
		endif
	endif

	;get the list of filters mappings for the view types, and append to the list of component mappings
	call DetermineViewFilters(null)
	set stat = movereclist(view_types->views, unassociated_filters->filter, 1,
		size(unassociated_filters->filter, 5), size(view_types->views, 5), 1)

	;; merge the component filters and non-component filters for use in the original mappings script
	set stat = movereclist(unassociated_filters->filter, comp_filters->filter, 1,
		size(comp_filters->filter, 5), size(unassociated_filters->filter, 5), 1)
 	if (legacyContentLoad = false)
		call GenerateContentURLsByCategory(null)
	elseif (size(comp_filters->filter, 5) > 0)
		;Filter out duplicates and sort the results in place
		set subTimer = CURTIME3

		select into "nl:"
			filter_mean = substring(1, 30, comp_filters->filter[d.seq].filter_mean)
		from (dummyt d with seq = value(size(comp_filters->filter, 5)))
		plan d
		order by filter_mean
		head report
			compCnt = size(comp_filters->filter, 5)
			;double the size of the record structure
			stat = alterlist(comp_filters->filter, 2 * compCnt)
			compIndx = compCnt
		head filter_mean
			; Check to make sure we should load the custom components files
			; Only match filter_means that belong to the custom-component-o1 artifact
			; Also match with the filter mean for Care Pathways
			if (operator(trim(filter_mean), "REGEXPLIKE", "^(FUSION_|FP_)?CUSTOM_COMP_[0-9]+$")
			     or trim(filter_mean) = "WF_CARE_PATH_COMP")
				loadCustCompFlag = true
			endif
			;Add the unique filter onto the list
			compIndx = compIndx + 1
			comp_filters->filter[compIndx].filter_mean = trim(filter_mean, 3)
		foot report
			;Cut off the first half of the list since we no longer need it
			stat = alterlist(comp_filters->filter, compCnt, 0)
			;Cut off the unused elements
			stat = alterlist(comp_filters->filter, (compIndx - compCnt))
			;Set the final loadCustomComponents indicator
			loadCustomComponents = loadCustCompFlag
		with nocounter
		call log_message(build("GenerateComponentTokens:sort filters, Elapsed time:",
			(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

		;will need to get token string here
		if(utilizeMPages5XMappings)
			set componentTokens = GetFilterMeanTokens(null)
		else
			;execute the script to retrieve the component mappings
			execute mp_retrieve_comp_mappings "NOFORMS", baseGroupReleaseIdent
				with replace("REPLY", "TOKENREPLY"), replace("COMPONENTS_TO_RETRIEVE", "COMP_FILTERS")
            ;Configure dynamic URLs to use Alva or EA
            if(alvaEnabled = 0 or cdContentServerURL = "")
                set dynamicContentContextRoot = criterion->static_content
                set pathAndQueryJs = ^/js/group?^
                set pathAndQueryCss = ^/css/group?^
            else
                set dynamicContentContextRoot = build(cdContentServerURL, "/dynamic")
                set pathAndQueryJs = ^/content/js?tokens=^
                set pathAndQueryCss = ^/content/css?tokens=^
            endif
			;Loop through the reply record structure and generate the final JS and CSS tags
			for(indx = 1 to TOKENREPLY->group_cnt)
				if (contentFromCloud = 1  or (alvaEnabled = 1 and cdContentServerURL != ""))
					set escapedTokens = URLEncode(tokenreply->groups[indx]->mappings_json)

					set jsGroupScriptTags = build2(jsGroupScriptTags,
                        ^<script type='text/javascript' src='^, dynamicContentContextRoot,
                        ^/^, tokenreply->groups[indx]->base_folder, pathAndQueryJs, escapedTokens, ^'></script>^)
					set cssGroupLinkTags = build2(cssGroupLinkTags,
                        ^<link rel='stylesheet' type='text/css' href='^, dynamicContentContextRoot,
                        ^/^, tokenreply->groups[indx]->base_folder, pathAndQueryCss, escapedTokens, ^' />^)
				else
					set jsGroupScriptTags = build2(jsGroupScriptTags,
                        ^<script type='text/javascript' src='^, dynamicContentContextRoot,
                        ^/^, tokenreply->groups[indx]->base_folder, pathAndQueryJs,
                        tokenreply->groups[indx]->mappings_json,^'></script>^)
					set cssGroupLinkTags = build2(cssGroupLinkTags,
                        ^<link rel='stylesheet' type='text/css' href='^, dynamicContentContextRoot,
                        ^/^, tokenreply->groups[indx]->base_folder, pathAndQueryCss,
                        tokenreply->groups[indx]->mappings_json,^' />^)
				endif
			endfor

			;Store a JSON version of the component tokens for debugging
			set componentTokens = cnvtrectojson(TOKENREPLY)
			if(validate(debug_ind) = 1)
				call echo(build2("Base group release ident: ", baseGroupReleaseIdent))
				call echorecord(comp_filters)
				call echorecord(tokenreply)
			endif
		endif

		if(validate(debug_ind) = 1)
			call echo(build2("Component Tokens: ", componentTokens))
		endif
	endif

	;Free all of our record structures
	free record mpage_comp_filters
	free record page_rec
	free record tokenReply
	free record unassociated_filters

	call log_message(build("Exit GenerateComponentTokens(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * Called when view-by-view deferred static content is enabled.
 * Handles tokens JSON generation for the content server on a view-by-view basis
 * Generates the script tag for any content which needs loaded up front
 * Creates the m_view_content_urls json object which the frontend uses to load content for subsequent views
 * NOTE: Only to be called from within the 'GenerateComponentTokens' function
 */
subroutine GenerateContentURLsByCategory(null)
	call log_message("In GenerateContentURLsByCategory()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private

	declare indx = i4 with protect, noconstant(0)
	declare jndx = i4 with protect, noconstant(0)
	declare filter_count = i4 with protect, noconstant(0)
	declare unassociated_count = i4 with protect, noconstant(size(unassociated_filters->filter, 5))

	;; A record which contains the JS and CSS content URLs to be loaded for each view
	;; this will be added as JSON to the document, allowing the frontend to load a view's content on-demand
	free record view_content_urls
	record view_content_urls(
		1 category[*]
			2 cat_mean = vc
			2 group[*]
				3 js_url = vc
				3 css_url = vc
	)

	;; this record is the request structure for mp_retrieve_cat_comp_mappings
	free record component_category_filters
	record component_category_filters(
		1 filter[*]
			2 filter_mean = vc
			2 category_mean = vc
	)


	free record tokenReply
	record tokenReply(
		1 category[*]
			2 category_mean = vc
			2 group_cnt = i4
			2 groups[*]
				3 base_folder = vc ;; base folder for the group example: MPages_6_0
				3 mappings_json = vc ;; parameters to be passed into mpages content service
%i cclsource:status_block.inc
	)

	;; build mass filter_mean_list with associated category_mean
	;; i.e., build the request to mp_retrieve_cat_comp_mappings
	for (indx = 1 to size(page_rec->category_id, 5))
		set stat = alterlist(component_category_filters->filter,
			size(component_category_filters->filter, 5) + size(page_rec->category_id[indx]->filters, 5))
		for (jndx = 1 to size(page_rec->category_id[indx]->filters, 5))
			set filter_count = filter_count + 1
			set component_category_filters->filter[filter_count]->filter_mean =
				page_rec->category_id[indx]->filters[jndx]->filter_mean
			if (legacyContentLoad = true)
				;; add the unspecified flag to force all filter_means to be loaded up front
				set component_category_filters->filter[filter_count]->category_mean = UNSPECIFIED_CATEGORY
			else
				set component_category_filters->filter[filter_count]->category_mean =
					page_rec->category_id[indx]->cat_mean
			endif
		endfor
	endfor

	;; add any unassociated filters to the list, (filters that are NOT from components -- i.e., views, vp utils)
	set stat = alterlist(component_category_filters->filter, filter_count + unassociated_count)
	for (indx = 1 to unassociated_count)
		set filter_count = filter_count + 1
		set component_category_filters->filter[filter_count]->filter_mean =
			unassociated_filters->filter[indx]->filter_mean
		set component_category_filters->filter[filter_count]->category_mean = UNSPECIFIED_CATEGORY
	endfor

	;; Filter out duplicates and sort the results in place
	;; If a filter_mean is associated to multiple category_means, force it to load up front
	if(size(component_category_filters->filter, 5) > 0)
		set subTimer = CURTIME3
		select into "nl:"
			filter_mean = substring(1, 30, component_category_filters->filter[d.seq].filter_mean)
			, category_mean = substring(1, 30, component_category_filters->filter[d.seq].category_mean)
		from (dummyt d with seq = value(filter_count))
		plan d
		order by filter_mean
		head report
			compCnt = size(component_category_filters->filter, 5)
			;double the size of the record structure
			stat = alterlist(component_category_filters->filter, 2 * compCnt)
			compIndx = compCnt
		head filter_mean
			;Check to make sure we should load the custom components files
			;Only match filter_means that belong to the custom-component-o1 artifact
			; Also match with the filter mean for Care Pathways
			if (operator(trim(filter_mean), "REGEXPLIKE", "^^(FUSION_|FP_)?CUSTOM_COMP_[0-9]+$")
			     or trim(filter_mean) = "WF_CARE_PATH_COMP")
				loadCustCompFlag = true
			endif
			;keep track of whether the filter_mean is associated to multiple category_means
			multiple_cat_means = false
			start_cat_mean = category_mean
		detail
			if (category_mean != start_cat_mean)
				multiple_cat_means = true
			endif
		foot filter_mean
			;Add the unique filter onto the list
			compIndx = compIndx + 1
			component_category_filters->filter[compIndx].filter_mean = trim(filter_mean, 3)
			if (multiple_cat_means = true)
				;; if a filter_mean is associated to multiple views, create one instance to be loaded up front
				component_category_filters->filter[compIndx].category_mean = UNSPECIFIED_CATEGORY
			else
				;; if a filter_mean is associated to the same view twice, remove the duplicate
				component_category_filters->filter[compIndx].category_mean = category_mean
			endif
		foot report
			;Cut off the first half of the list since we no longer need it
			stat = alterlist(component_category_filters->filter, compCnt, 0)
			;Cut off the unused elements
			stat = alterlist(component_category_filters->filter, (compIndx - compCnt))
			;Set the final loadCustomComponents indicator
			loadCustomComponents = loadCustCompFlag
		with nocounter
		call log_message(build("GenerateComponentTokens:sort filters, Elapsed time:",
			(CURTIME3-subTimer)/100.0), LOG_LEVEL_DEBUG)

		;execute the script to retrieve the component mappings
		execute mp_retrieve_cat_comp_mappings "NOFORMS", baseGroupReleaseIdent
			with replace("REPLY", "TOKENREPLY"), replace("COMPONENTS_TO_RETRIEVE", "COMPONENT_CATEGORY_FILTERS")

		; resize the view_content_urls record to hold all the urls
		set stat = alterlist(view_content_urls->category, size(TOKENREPLY->category, 5))

        ;Configure dynamic URLs to use Alva or EA
        if(alvaEnabled = 0 or cdContentServerURL = "")
            set dynamicContentContextRoot = criterion->static_content
            set pathAndQueryJs = ^/js/group?^
            set pathAndQueryCss = ^/css/group?^
        else
            set dynamicContentContextRoot = build(cdContentServerURL, "/dynamic")
            set pathAndQueryJs = ^/content/js?tokens=^
            set pathAndQueryCss = ^/content/css?tokens=^
        endif
		;Loop through the reply record structure and generate the final JS and CSS tags
		for(indx = 1 to size(TOKENREPLY->category, 5))
			set stat = alterlist(view_content_urls->category[indx]->group, TOKENREPLY->category[indx]->group_cnt)
			set view_content_urls->category[indx]->cat_mean = TOKENREPLY->category[indx]->category_mean

			for(jndx = 1 to TOKENREPLY->category[indx]->group_cnt)
				if (contentFromCloud = 1  or (alvaEnabled = 1 and cdContentServerURL != ""))
					set escapedTokens = URLEncode(tokenreply->category[indx]->groups[jndx]->mappings_json)
				else
					set escapedTokens = tokenreply->category[indx]->groups[jndx]->mappings_json
				endif
				;; populate the view_content_urls record with the formatted JS and CSS urls
                set view_content_urls->category[indx]->group[jndx]->js_url = build2(dynamicContentContextRoot,
                    ^/^, tokenreply->category[indx]->groups[jndx]->base_folder, pathAndQueryJs, escapedTokens)
                set view_content_urls->category[indx]->group[jndx]->css_url = build2(dynamicContentContextRoot,
                    ^/^, tokenreply->category[indx]->groups[jndx]->base_folder, pathAndQueryCss, escapedTokens)

				;; load the unspecified_category script tags up front as standard script tags
				if (TOKENREPLY->category[indx]->category_mean = UNSPECIFIED_CATEGORY)
					set jsGroupScriptTags = build2(jsGroupScriptTags,
						^<script type='text/javascript' src='^,
						view_content_urls->category[indx]->group[jndx]->js_url, ^'></script>^)
					set cssGroupLinkTags = build2(cssGroupLinkTags,
						^<link rel='stylesheet' type='text/css' href='^,
						view_content_urls->category[indx]->group[jndx]->css_url, ^' />^)
				endif
			endfor
		endfor

		; store the url json so it can be added to the window
		set viewStaticContentJSON = cnvtrectojson(view_content_urls)

		;Store a JSON version of the component tokens for debugging
		set componentTokens = cnvtrectojson(TOKENREPLY)

		if(validate(debug_ind) = 1)
			call echo(build2("Base group release ident: ", baseGroupReleaseIdent))
			call echorecord(comp_filters)
			call echorecord(tokenreply)
			call echo(build2("Component Tokens: ", componentTokens))
		endif

		;Free all of our record structures
		free record mpage_comp_filters
		free record page_rec
		free record tokenReply
		free record unassociated_filters
		free record view_content_urls
		free record component_category_filters
	endif

	call log_message(build("Exit GenerateContentURLsByCategory(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end ;GenerateContentURLsByCategory
/**
 * Populates the view_types structure with the applicable view_type_means and
 * view category_means for the current view/viewpoint.
 * These filters are used alongside the component filter_means to generate necessary static content.
 * Note: Does not filter duplicate view_type_means/category_means
 **/
subroutine DetermineViewFilters(null)
	call log_message("In DetermineViewFilters()", LOG_LEVEL_DEBUG)

	declare filterCount     = i4 with protect, noconstant(0)
	declare indx            = i4 with protect, noconstant(0)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private
	declare VIEW_CNT        = i4 with protect, constant(size(vp_info->views, 5))

	if(loadingMPagesReach != true)
		;each view will have at most 2 filters associated to it
		set stat = alterlist(view_types->views, VIEW_CNT * 2)
		for(indx = 1 to VIEW_CNT)
			;only add category_means if they are NOT a viewbuilder, i.e., are a standalone
			if (vp_info->views[indx].view_cat_mean != patstring("VB_*"))
				set filterCount = filterCount + 1
				set view_types->views[filterCount].view_mean = vp_info->views[indx].view_cat_mean
			endif
			set filterCount = filterCount + 1
			;ALWAYS add the view_type_mean for every view
			set view_types->views[filterCount].view_mean = vp_info->views[indx].view_type_mean
		endfor
		set stat = alterlist(view_types->views, filterCount)
	else ;Handle the special case of MPages Reach
		set stat = alterlist(view_types->views, 2)
		set view_types->views[1].view_mean = "MP_REACH_V5"
		set view_types->views[2].view_mean = "SUM_STD"
	endif

	call log_message(build("Exit DetermineViewFilters(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end ;DetermineViewFilters

/**
 * Rerturns the Chart Search URL if it should be available for this MPage.  If chart search should not be available to
 * the user then no URL string is returned.
 **/
subroutine GetChartSearchURL(null)
	call log_message("In GetChartSearchURL()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private

	declare searchURL = vc with protect, noconstant("")

	;If we need to load chart search execute the script that returns the proper URL.
	;With the exception of MPages Reach, the indicator for whether or not we should
	;load chart search will be based on the cs_enabled flag.  MPages Reach does not
	;contain chart search, so there is need to check if it is needed or not.
	if(loadingMPagesReach != true)
		if(vp_info->cs_enabled = "1")
			execute ss_get_chart_search_config
			set searchURL = configuration->chartSearchURL.value
		endif
	endif

	call log_message(build("Exit GetChartSearchURL(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
	return(searchURL)
end

/**
 * Generates the JS and CSS static content requirements based on the flags set for the MPage
 */
subroutine GenerateContentRequirements(null)
	call log_message("In GenerateContentRequirements()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private

	declare chartSearchURL = vc with protect, noconstant("")
	declare chartSearchJS = vc with protect, noconstant("")
	declare componentJS = vc with protect, noconstant("")
	declare componentCSS = vc with protect, noconstant("")
	declare customCompJS = vc with protect, noconstant("")
	declare customCompCSS = vc with protect, noconstant("")
	declare customCompSC = vc with protect, noconstant("")

	;Determine if Chart Search should be shown or not by grabbing the URL if no URL is returned we will ignore Chart Search
	set chartSearchURL = GetChartSearchURL(null)
	if(chartSearchURL != "")
		set chartSearchJS =
			build2(^<script type="text/javascript" src="^, chartSearchURL,^js/search-input-all.min.js" async="async"></script>^,
						   ^<script type="text/javascript" src="^,chartSearchURL,^js/embed.js" async="async"></script>^)

		set chartSearchCSS = build2(^var cssSearchInputAll=document.createElement("link");^,
        	^cssSearchInputAll.rel="stylesheet";^,
        	^cssSearchInputAll.href="^, chartSearchURL, ^css/search-input-all.min.css";^,
        	^cssSearchInputAll.type="text/css";^,
        	^var cssMainIE8=document.createElement("link");^,
        	^cssMainIE8.rel="stylesheet";^,
        	^cssMainIE8.href="^, chartSearchURL, ^css/main_ie8.css";^,
        	^cssMainIE8.type="text/css";^,
        	^var headDOM=document.getElementsByTagName("head")[0];^,
        	^headDOM.appendChild(cssSearchInputAll);^,
        	^headDOM.appendChild(cssMainIE8);^)
	endif

	;Determine which version of custom components to use
	if(loadCustomComponents)
		if(useCustomComponentExamples = 1)
			;Since we are using the custom component examples, we need to reference the some base folder as the other core files
			set customCompJS = build2(^<script type="text/javascript" src="^, criterion->static_content, baseContentFolder,
								  ^/custom-components/js/custom-component-examples.js"></script>^)
			set customCompCSS = build2(^<link type="text/css" rel="stylesheet" href="^, criterion->static_content, baseContentFolder,
								  ^/custom-components/css/custom-component-examples.css"/>^)
		else
			;We need to replace the base folder directory with the custom code location since it lives separate from the base
			if(utilizeMPages5XMappings)
				;Since we are utilizing UnifiedContent we have to do a string replace of 'UnifedContent' with 'custom_mpage_content'
				set customCompSC = replace(criterion->static_content, STATIC_CONTENT_FOLDER, CUSTOM_CONTENT_FOLDER)
			else
				;Since our base folder is dynamic we only need to build the custom content location string
				; if alva is enabled and the cdContentServerURL is not empty, then use the legacy URL for the custom components
				if(alvaEnabled = 1 and cdContentServerURL != "")
					set customCompSC = build2(criterion->static_content_legacy, "/", CUSTOM_CONTENT_FOLDER)
				else
					set customCompSC = build2(criterion->static_content, "/", CUSTOM_CONTENT_FOLDER)
				endif
			endif

			set customCompJS = build2(^<script type="text/javascript" src="^, customCompSC,
								  ^/custom-components/js/custom-components.js"></script>^)
			set customCompCSS = build2(^<link type="text/css" rel="stylesheet" href="^, customCompSC,
								  ^/custom-components/css/custom-components.css"/>^)
		endif
 	endif

 	;Determine if we are pulling a custom build of the components file or not
 	if(contentServerURL != "" and componentTokens != "")

 		if(utilizeMPages5XMappings)
	 		set componentJS =
	 			build2(^<script type="text/javascript" src='^, criterion->static_content, ^/js/^, componentTokens,^'></script>^)
	 		set componentCSS =
	 			build2(^<link rel="stylesheet" type="text/css" href='^, criterion->static_content, ^/css/^, componentTokens,^'></link>^)
	 	else
	 		set componentJS = jsGroupScriptTags
	 		set componentCSS = cssGroupLinkTags
	 	endif
 	else
 		if(contentServerURL != "")
 			;If we are falling back because a filter mapping is undefined alert the user with an error.
	 		call GenerateScriptErrorHTML("Unable to create component token string: unknown component filter mapping")
	 		go to exit_script
 		endif
 		set componentJS =
 			build2(^<script type="text/javascript" src='^,
 				criterion->static_content, baseContentFolder, ^/js/master-components.js'></script>^)
 		 set componentCSS =
 			build2(^<link rel="stylesheet" type="text/css" href='^,
 				criterion->static_content, baseContentFolder, ^/css/master-components.css'></link>^)
 	endif

 	;Create the JavaScript Requirements
	set javaScriptReqs =
		build2(^<script type="text/javascript" src='^, mp::i18n.getLocaleFilePath(null), ^'></script>^,
			^<script type="text/javascript" src='^, criterion->static_content, baseContentFolder, ^/js/assembly.js'></script>^,
			^<script type="text/javascript" src='^, criterion->static_content, baseContentFolder, ^/js/master-core-util.js'></script>^,
			^<script type="text/javascript" src='^, criterion->static_content, baseContentFolder, ^/js/master-render.js'></script>^,
			componentJS,
			chartSearchJS,
			customCompJS)

	;Determine the CSS Requirements
	set cssReqs = build2(
		^<link rel="stylesheet" type="text/css" href='^, criterion->static_content, baseContentFolder, ^/css/tcpip-dummy.css' />^,
		^<link rel="stylesheet" type="text/css" href='^, criterion->static_content, baseContentFolder, ^/css/assembly.css' />^,
		^<link rel="stylesheet" type="text/css" href='^, criterion->static_content, baseContentFolder, ^/css/master-core-util.css' />^,
		componentCSS,
		customCompCSS)

	;Update the criterion->static_content since all other source files loaded after initial page load will need to kow the root
	;folder static content
	set criterion->static_content = build2(criterion->static_content, baseContentFolder)

	;Update the criterion->static_content_legacy with the baseContentFolder (like MPages_6_10)
	set criterion->static_content_legacy = build2(criterion->static_content_legacy, baseContentFolder)

	call log_message(build("Exit GenerateContentRequirements(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

/**
 * This subroutine is used to generate a user friendly script error HTML page
 **/
subroutine GenerateScriptErrorHTML(message)
	declare metaStr = vc with protect, noconstant("")

	if(enableEdgeMode = 1)
		set metaStr = ^<meta http-equiv="X-UA-Compatible" content="IE=edge">^
	else
		set metaStr = ^<meta http-equiv="X-UA-Compatible" content="IE=10">^
	endif

	set _memory_reply_string = build2(
	^<!DOCTYPE html>^,
	^<html dir="ltr">^,
		^<head>^,
			metaStr,
			^<meta http-equiv="Content-Type" content="APPLINK,CCLLINK,MPAGES_EVENT,XMLCCLREQUEST,^,
				^CCLLINKPOPUP,CCLNEWSESSIONWINDOW,MPAGES_SVC_EVENT" name="discern"/>^,
			^<meta name="viewport" content="width=device-width, initial-scale=1.0">^,
			^<link rel="stylesheet" type="text/css" href="^, criterion->static_content, baseContentFolder, ^/css/assembly.css" />^,
			^<link rel="stylesheet" type="text/css" href="^, criterion->static_content, baseContentFolder, ^/css/master-core-util.css" />^,
			^<script type="text/javascript" src="^, mp::i18n.getLocaleFilePath(null), ^"></script>^,
			^<script type="text/javascript" src="^, criterion->static_content, baseContentFolder, ^/js/assembly.js"></script>^,
			^<script type="text/javascript" src="^, criterion->static_content, baseContentFolder, ^/js/master-core-util.js"></script>^,
			^<script type="text/javascript" src="^, criterion->static_content, baseContentFolder, ^/js/master-render.js"></script>^,
			^<title>^,criterion->person_info.person_name,^</title>^,
		^</head>^,
		^<body onload='throw new Error("^, message, ^")';></body>^,
	^</html>^)
end

/**
 * This function generates the HTML which will be returned to the front end and begin the rendering of the MPage
 */
subroutine GenerateMPageHTML(null)
	call log_message("In GenerateMPageHTML()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(curtime3), private

	declare viewpointJSON = vc with protect, noconstant("var m_viewpointJSON;")
	declare viewCategoryMean = vc with protect, noconstant("")
	declare dateformatsJSON = vc with protect, noconstant("")
	declare criterionJSON = vc with protect, noconstant("")
	declare metaStr = vc with protect, noconstant("")
	declare staticContentUrlJSONVar = vc with protect, noconstant("")
	declare splunkHECConfigJSON = vc with protect, noconstant("")
	if(enableEdgeMode = 1)
		set metaStr = ^<meta http-equiv="X-UA-Compatible" content="IE=edge">^
	else
		set metaStr = ^<meta http-equiv="X-UA-Compatible" content="IE=10">^
	endif

	if(loadingMPagesReach != true)
		set renderFunction = build2(renderFunction, ^MP_Viewpoint.launchViewpoint();^)
		;Attaching the Chart Search CSS after launching the Viewpoint, but only if it's not empty because Chrome doesn't like nulls
		if(chartSearchCSS != "")
			set renderFunction = build2(renderFunction, chartSearchCSS)
		endif
		set viewpointJSON = build2("var m_viewpointJSON = '", replace(cnvtrectojson(vp_info), ^'^, ^\'^), "';")
		set viewCategoryMean = vp_info->active_view_cat_mean
	else
		set renderFunction = build2(renderFunction, ^renderMPagesView('^,criterion->category_mean,^');^)
		set viewCategoryMean = criterion->category_mean
	endif

	;Prep the criterion string for injection
	set criterionJSON = replace(cnvtrectojson(criterion), "'", "\'", 0)
	set criterionJSON = replace(criterionJSON, "\\", "\\\\" , 0)
	set criterionJSON = replace(criterionJSON, '\"','\\"' , 0)
	;Prep the splunkHECConfig string for injection
	set splunkHECConfigJSON = replace(cnvtrectojson(splunk_hec_config), "'", "\'", 0)
	set splunkHECConfigJSON = replace(splunkHECConfigJSON, "\\", "\\\\" , 0)
	set splunkHECConfigJSON = replace(splunkHECConfigJSON, '\"','\\"' , 0)
	
	set dateformatsJSON = replace(cnvtrectojson(datetimeformats, 4), "'", "\'", 0)

	;construct the token loading json
	if (legacyContentLoad != true)
		set staticContentUrlJSONVar = build2(^var m_view_content_urls = '^, replace(viewStaticContentJSON, ^\"^, ^\\"^), ^';^)
	else
		set staticContentUrlJSONVar = " "
	endif
	;Construct the HTML for the page
	set _memory_reply_string = build2(
	^<!DOCTYPE html>^,
	^<html dir="ltr">^,
		^<head>^,
			metaStr,
			^<meta http-equiv="Content-Type" content="APPLINK,CCLLINK,MPAGES_EVENT,XMLCCLREQUEST,^,
				^CCLLINKPOPUP,CCLNEWSESSIONWINDOW,MPAGES_SVC_EVENT" name="discern"/>^,
			^<meta name="viewport" content="width=device-width, initial-scale=1.0">^,
			^<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">^,
			^<script type="text/javascript">^,
				^var _loadTimer = null;^,
				^try{^,
					^_pageLoadTimer = window.external.DiscernObjectFactory("CHECKPOINT");^,
					^_pageLoadTimer.EventName = "USR:MPG.MP_UNIFIED_DRIVER load entire page";^,
					^_pageLoadTimer.MetaData("rtms.legacy.subtimerName") = "^, viewCategoryMean, ^";^,
					^_pageLoadTimer.SubEventName = "Start";^,
					^_pageLoadTimer.Publish();^,
					^_loadTimer = window.external.DiscernObjectFactory("SLATIMER");^,
					^_loadTimer.TimerName = "ENG:MPG.MP_UNIFIED_DRIVER - load resources";^,
					^_loadTimer.SubtimerName = "";^,
					^_loadTimer.Start();^,
				^}catch(err){}^,
			^</script>^,
			cssReqs,
			^<script type="text/javascript">^,
				viewpointJSON,
				^var m_criterionJSON = '^, criterionJSON, ^';^,
				^var m_dateformatJSON = '^, dateformatsJSON, ^';^,
				^var CERN_driver_script = 'MP_UNIFIED_DRIVER';^,
				^var CERN_driver_mean = '^, CNVTUPPER(categoryMean), ^';^,
				^var CERN_driver_static_content = '^, trim($STATIC_CONTENT, 3), ^';^,
				^var CERN_static_content = '^, criterion->static_content, ^';^,
				^var m_mpageSettingsJSON = '^, replace(mpageSettingsJSON, ^'^, ^\'^), ^';^,
				^var m_bedrockMpage = null;^,
				^var m_localeObjectName = '^, mp::i18n.getLocaleObjectName(null), ^';^,
				^var m_requestBindingJSON = ^, evaluate(alvaEnabled,1,build2(^'^,requestBindingJSON,^'^),^null^),^;^,
				^var MPAGE_LOCALE = null;^,
				^var splunkHECConfig = '^,splunkHECConfigJSON,^';^,
				staticContentUrlJSONVar,
			^</script>^,
			javaScriptReqs,
			^<title>^,criterion->person_info.person_name,^</title>^,
		^</head>^,
		^<body><script> document.addEventListener("DOMContentLoaded", function(event) {if (_loadTimer) {_loadTimer.Stop();}^,
			renderFunction, ^})</script></body>^,
	^</html>^)

	if(validate(debug_ind) = 1)
		call echo(build2("Page HTML: ", _memory_reply_string))
	endif

	call log_message(build("Exit GenerateMPageHTML(), Elapsed time:",
		(CURTIME3-BEGIN_DATE_TIME)/100.0), LOG_LEVEL_DEBUG)
end

#exit_script

;Print out record structures if debugging is on
if(validate(debug_ind, 0))
    ;These structures may not exist early on, so this ensures that echo produces no error
    if(validate(criterion))
	call echorecord(criterion)
    endif
    if(validate(vp_info))
	call echorecord(vp_info)
    endif
else
	free record criterion
	free record vp_info
endif

end
go
set trace notranslatelock go

