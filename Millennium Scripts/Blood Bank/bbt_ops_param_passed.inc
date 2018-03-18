 ;;Solution_Test/script/PathNet -- BB Transfusion/Bbt_Reportselection/BBT_OPS_PARM_PASSED.INC Turn on black mode

/*
** Author: Jose Suarez
** Date: 11/09/99
This .inc file assumes that the name of the script is passed in a variable named "scipt_name".
Further, this .inc file  processes the Owner, Inventory and Location code values from the
request->batch_selection field after trimming it. viz., OWN[ ], INV[ ] and LOC[ ] respectively.
If they are incompletely or incorrectly specified such as OWN] [ or OWN[, the program is failed.
Essentially, only a strong syntax is entertained. Weak syntax is failed!! Each program that
includes this file should also have an EXIT_SCRIPT block in it.
These are the following subroutines that may be used by the calling script:
 CHECK_OPT_DATE_PASSED is used for determine the begday and endday to be used in the calling script
 CHECK_OWNER_CD is used for determine the owner area code
 CHECK_INVENTORY_CD is used for determine the inventory area code
 CHECK_LOCATION_CD is used for determine the address location code
 CHECK_SORT_OPT is used for determine the sort option
 CHECK_MODE_OPT is used for determine the mode option
 CHECK_RANGEOFDAYS_OPT is used for determine how many days to look ahead
 CHECK_HRS_OPT is used for determine how many hours to look behind
 CHECK_SVC_OPT is used for determine the service resources
 CHECK_MISC_FUNCTIONALITY is used to check whether given ops parameter is passed or not.
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    *000 11/09/99 Jose Suarez         Initial Release                      *
;    *001 05/24/12 Satish Joshi        added the CHECK_CANCEL_ENABLED method*
;    *002 07/11/12 Gayatri Samala      Replaced CHECK_CANCEL_ENABLED fucntion*
;                                      with CHECK_MISC_FUNCTIONALITY, to make* 
;                                      in general so that it can be used to *
;                                      get any ops param status by passing  *
;                                      name as input                        *
*/
 
declare CHECK_FACILITY_CD(script_name = vc) = null
 
declare CHECK_EXCEPTION_TYPE_CD(script_name = vc) = null
 
subroutine CHECK_OPT_DATE_PASSED ( script_name )
  set ddmmyy_flag = 0
  set dd_flag     = 0
  set mm_flag     = 0
  set yy_flag     = 0
  set dayentered   = 0
  set monthentered = 0
  set yearentered  = 0
 
  ;find DAY value
  set temp_pos = 0
  set temp_pos = cnvtint(value(findstring("DAY[",temp_string)))
  if (temp_pos > 0)
      set day_string = substring(temp_pos + 4, size(temp_string), temp_string)
      set day_pos = cnvtint(value(findstring("]", day_string)))
      if (day_pos > 0)
          set day_nbr = substring(1, day_pos - 1, day_string)
          if (trim(day_nbr) > " ")
              set ddmmyy_flag = ddmmyy_flag + 1
              set dd_flag = 1
              set dayentered = cnvtreal(day_nbr)
          else
              ;fail script
              set reply->status_data->status = "F"
              set reply->status_data->subeventstatus[1].TargetObjectName = "parse DAY value"
          endif
      else
          ;fail script
          set reply->status_data->status = "F"
          set reply->status_data->subeventstatus[1].TargetObjectName = "parse DAY value"
      endif
  endif
 
  ;find MONTH value
  if (reply->status_data->status != "F")
    set temp_pos = 0
    set temp_pos = cnvtint(value(findstring("MONTH[",temp_string)))
    if (temp_pos > 0)
        set month_string = substring(temp_pos + 6, size(temp_string), temp_string)
        set month_pos = cnvtint(value(findstring("]", month_string)))
        if (month_pos > 0)
            set month_nbr = substring(1, month_pos - 1, month_string)
            if (trim(month_nbr) > " ")
                set ddmmyy_flag = ddmmyy_flag + 1
                set mm_flag = 1
                set monthentered = cnvtreal(month_nbr)
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse MONTH value"
            endif
        else
            ;fail script
            set reply->status_data->status = "F"
            set reply->status_data->subeventstatus[1].TargetObjectName = "parse MONTH value"
        endif
    endif
  endif
 
    ;find YEAR value
  if (reply->status_data->status != "F")
        set temp_pos = 0
        set temp_pos = cnvtint(value(findstring("YEAR[",temp_string)))
        if (temp_pos > 0)
          set year_string = substring(temp_pos + 5, size(temp_string), temp_string)
          set year_pos = cnvtint(value(findstring("]", year_string)))
          if (year_pos > 0)
            set year_nbr = substring(1, year_pos - 1, year_string)
            if (trim(year_nbr) > " ")
                set ddmmyy_flag = ddmmyy_flag + 1
                set yy_flag = 1
                set yearentered = cnvtreal(year_nbr)
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse YEAR value"
            endif
          else
            ;fail script
            set reply->status_data->status = "F"
            set reply->status_data->subeventstatus[1].TargetObjectName = "parse YEAR value"
          endif
        endif
  endif
 
if (ddmmyy_flag > 1)
    set reply->status_data->subeventstatus[1].OperationName = script_name
    set reply->status_data->subeventstatus[1].OperationStatus = "F"
    set reply->status_data->subeventstatus[1].TargetObjectName = "parse DAY or MONTH or YEAR value"
    set reply->status_data->subeventstatus[1].TargetObjectValue = "multi date selection"
    go to EXIT_SCRIPT
endif
 
if (reply->status_data->status = "F")
    set reply->status_data->subeventstatus[1].OperationName = script_name
    set reply->status_data->subeventstatus[1].OperationStatus = "F"
    set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
    go to EXIT_SCRIPT
endif
 
if (dd_flag = 1)
   if (dayentered > 0)
        ;lookahead
        set interval = build(abs(dayentered),"d")
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 0000)
        set begday = cnvtlookahead((interval),request->ops_date)
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 235959)
        set endday = cnvtlookahead((interval),request->ops_date)
   else
        ;lookbehind
        set interval = build(abs(dayentered),"d")
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 0000)
        set begday = cnvtlookbehind((interval),request->ops_date)
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 235959)
        set endday = cnvtlookbehind((interval),request->ops_date)
   endif
elseif (mm_flag = 1)
   if (monthentered > 0)
        ;lookahead
        set interval = build(abs(monthentered),"m")
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 0000)
        set smonth = cnvtstring(month(request->ops_date))
        set sday = "01"
        set syear = cnvtstring(year(request->ops_date))
        set sdateall = concat(smonth,sday,syear)
        set begday = cnvtlookahead((interval),cnvtdatetime(cnvtdate(sdateall),0))
        set endday = cnvtlookahead("1m",cnvtdatetime(cnvtdate(begday),235959))
        set endday = cnvtlookbehind("1d",endday)
   else
        ;lookbehind
        set interval = build(abs(monthentered),"m")
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 0000)
        set smonth = cnvtstring(month(request->ops_date))
        set sday = "01"
        set syear = cnvtstring(year(request->ops_date))
        set sdateall = concat(smonth,sday,syear)
        set begday = cnvtlookbehind((interval),cnvtdatetime(cnvtdate(sdateall),0))
        set endday = cnvtlookahead("1m",cnvtdatetime(cnvtdate(begday),235959))
        set endday = cnvtlookbehind("1d",endday)
   endif
elseif (yy_flag = 1)
   if (yearentered > 0)
        ;lookahead
        set interval = build(abs(yearentered),"y")
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 0000)
        set smonth = "01"
        set sday = "01"
        set syear = cnvtstring(year(request->ops_date))
        set sdateall = concat(smonth,sday,syear)
        set begday = cnvtlookahead((interval),cnvtdatetime(cnvtdate(sdateall),0))
        set endday = cnvtlookahead("1y",cnvtdatetime(cnvtdate(begday),235959))
        set endday = cnvtlookbehind("1d",endday)
   else
        ;lookbehind
        set interval = build(abs(yearentered),"y")
        set request->ops_date
                = cnvtdatetime(cnvtdate2(format(request->ops_date, "mm/dd/yyyy;;d"), "mm/dd/yyyy"), 0000)
        set smonth = "01"
        set sday = "01"
        set syear = cnvtstring(year(request->ops_date))
        set sdateall = concat(smonth,sday,syear)
        set begday = cnvtlookbehind((interval),cnvtdatetime(cnvtdate(sdateall),0))
        set endday = cnvtlookahead("1y",cnvtdatetime(cnvtdate(begday),235959))
        set endday = cnvtlookbehind("1d",endday)
   endif
else
   set reply->status_data->status = "F"
   set reply->status_data->subeventstatus[1].OperationName = script_name
   set reply->status_data->subeventstatus[1].OperationStatus = "F"
   set reply->status_data->subeventstatus[1].TargetObjectName = "parse DAY or MONTH or YEAR value"
   set reply->status_data->subeventstatus[1].TargetObjectValue = "NO date selection"
   go to EXIT_SCRIPT
endif
 
end     ;subroutine CHECK_OPT_DATE_PASSED
 
subroutine CHECK_BB_ORGANIZATION(script_name)
  declare nOrgPos		= i2 with protect, noconstant(0)
  declare nTempPos		= i2 with protect, noconstant(0)
  declare nCodeset		= i4 with protect, constant(278)
  declare sOrgName		= vc with protect, noconstant(fillstring(132, ""))
  declare sOrgString	= vc with protect, noconstant(fillstring(132, ""))
  declare dBBManufCd	= f8 with protect, noconstant(0.0)
  declare dBBSupplCd	= f8 with protect, noconstant(0.0)
  declare dBBClientCd	= f8 with protect, noconstant(0.0)
 
  set stat = uar_get_meaning_by_codeset(nCodeset, "BBMANUF", 1, dBBManufCd)
  set stat = uar_get_meaning_by_codeset(nCodeset, "BBSUPPL", 1, dBBSupplCd)
  set stat = uar_get_meaning_by_codeset(nCodeset, "BBCLIENT", 1, dBBClientCd)
 
  set nTempPos = cnvtint(value(findstring("ORG[", temp_string)))
  if (nTempPos > 0)
      set sOrgString = substring(nTempPos + 4, size(temp_string), temp_string)
      set nOrgPos = cnvtint(value(findstring("]", sOrgString)))
      if (nOrgPos > 0)
          set sOrgName = substring(1, nOrgPos - 1, sOrgString)
          if (trim(sOrgName) > " ")
              select into "nl:"
              from
                org_type_reltn ot,
                organization o
              plan ot
                where ot.org_type_cd in (dBBManufCd, dBBSupplCd, dBBClientCd)
                  and ot.active_ind = 1
              join o
                where o.org_name_key = trim(cnvtupper(sOrgName))
                  and o.active_ind = 1
              detail
                  request->organization_id = o.organization_id
              with nocounter
          endif
      endif
  else
      set request->organization_id = 0.0
  endif
end     ;end subroutine CHECK_BB_ORGANIZATION
 
subroutine CHECK_OWNER_CD( script_name )
  set temp_pos = 0
  set temp_pos = cnvtint(value(findstring("OWN[",temp_string)))
  if (temp_pos > 0)
      set own_string = substring(temp_pos + 4, size(temp_string), temp_string)
      set own_pos = cnvtint(value(findstring("]", own_string)))
      if (own_pos > 0)
          set own_area = substring(1, own_pos - 1, own_string)
          if (trim(own_area) > " ")
              set request->cur_owner_area_cd = cnvtreal(own_area)
          else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse owner area code value"
                go to EXIT_SCRIPT
          endif
      else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse owner area code value"
                go to EXIT_SCRIPT
      endif
  else
      set request->cur_owner_area_cd = 0.0
  endif
end     ;end subroutine CHECK_OWNER_CD
 
subroutine CHECK_INVENTORY_CD ( script_name )
    set temp_pos = 0
    set temp_pos = cnvtint(value(findstring("INV[",temp_string)))
    if (temp_pos > 0)
        set inv_string = substring(temp_pos + 4, size(temp_string), temp_string)
        set inv_pos = cnvtint(value(findstring("]", inv_string)))
        if (inv_pos > 0)
            set inv_area = substring(1, inv_pos - 1, inv_string)
            if (trim(inv_area) > " ")
                set request->cur_inv_area_cd = cnvtreal(inv_area)
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse inventory area code value"
                go to EXIT_SCRIPT
            endif
        else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse inventory area code value"
                go to EXIT_SCRIPT
        endif
    else
        set request->cur_inv_area_cd = 0.0
    endif
end     ;subroutine CHECK_INVENTORY_CD
 
subroutine CHECK_LOCATION_CD( script_name )
        set temp_pos = 0
        set temp_pos = cnvtint(value(findstring("LOC[",temp_string)))
        if (temp_pos > 0)
          set loc_string = substring(temp_pos + 4, size(temp_string), temp_string)
          set loc_pos = cnvtint(value(findstring("]", loc_string)))
          if (loc_pos > 0)
            set location_cd = substring(1, loc_pos - 1, loc_string)
            if (trim(location_cd) > " ")
                set request->address_location_cd = cnvtreal(location_cd )
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse location code value"
                go to EXIT_SCRIPT
            endif
          else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse location code value"
                go to EXIT_SCRIPT
          endif
        else
          set request->address_location_cd = 0.0
        endif
end   ;end subroutine CHECK_LOCATION_CD
 
subroutine CHECK_SORT_OPT ( script_name )
        set temp_pos = 0
        set temp_pos = cnvtint(value(findstring("SORT[",temp_string)))
           if (temp_pos > 0)
              set sort_string = substring(temp_pos + 5, size(temp_string), temp_string)
              set sort_pos = cnvtint(value(findstring("]", sort_string)))
              if (sort_pos > 0)
                set sort_selection = substring(1,sort_pos - 1, sort_string)
              else
                set sort_selection = " "
              endif
           else
              set sort_selection = " "
           endif
end    ;end subroutine CHECK_SORT_OPT ( script_name )
 
subroutine CHECK_MODE_OPT ( script_name )
   set temp_pos = 0
   set temp_pos = cnvtint(value(findstring("MODE[",temp_string)))
      if (temp_pos > 0)
         set mode_string = substring(temp_pos + 5, size(temp_string), temp_string)
         set mode_pos = cnvtint(value(findstring("]", mode_string)))
           if (mode_pos > 0)
                 set mode_selection = substring(1, mode_pos - 1, mode_string)
           else
                 set mode_selection = " "
           endif
      else
         set mode_selection = " "
      endif
end    ;end subroutinesubroutine CHECK_MODE_OPT
 
subroutine CHECK_RANGEOFDAYS_OPT ( script_name )
   set temp_pos = 0
   set temp_pos = cnvtint(value(findstring("RANGEOFDAYS[",temp_string)))
   if (temp_pos > 0)
      set next_string = substring(temp_pos + 12, size(temp_string), temp_string)
      set next_pos = cnvtint(value(findstring("]", next_string)))
      set days_look_ahead  =  cnvtint(trim(substring(1, next_pos - 1, next_string)))
      if (days_look_ahead > 0)
          set days_look_ahead  = days_look_ahead
      else
          ;fail script
          set reply->status_data->status = "F"
          set reply->status_data->subeventstatus[1].OperationName = script_name
          set reply->status_data->subeventstatus[1].OperationStatus = "F"
          set reply->status_data->subeventstatus[1].TargetObjectValue = "no value in string"
          set reply->status_data->subeventstatus[1].TargetObjectName = "parse look ahead days"
          go to EXIT_SCRIPT
      endif
   else
      set days_look_ahead  = 0
   endif
 
end    ;end subroutine CHECK_RANGEOFDAYS_OPT
 
subroutine CHECK_HRS_OPT ( script_name )
  set temp_pos = 0
  set temp_pos = cnvtint(value(findstring("HRS[",temp_string)))
  if (temp_pos > 0)
      set hrs_string = substring(temp_pos + 4, size(temp_string), temp_string)
      set hrs_pos = cnvtint(value(findstring("]", hrs_string)))
      if (hrs_pos > 0)
          set num_hrs = substring(1, hrs_pos - 1, hrs_string)
          if (trim(num_hrs) > " ")
             if (cnvtint(trim(num_hrs)) > 0)
                set hoursentered = cnvtreal(num_hrs)
             else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse number of hours"
                go to EXIT_SCRIPT
             endif
          else
              ;fail script
              set reply->status_data->status = "F"
              set reply->status_data->subeventstatus[1].OperationName = script_name
              set reply->status_data->subeventstatus[1].OperationStatus = "F"
              set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
              set reply->status_data->subeventstatus[1].TargetObjectName = "parse number of hours"
              go to EXIT_SCRIPT
          endif
      else
        ;fail script
        set reply->status_data->status = "F"
        set reply->status_data->subeventstatus[1].OperationName = script_name
        set reply->status_data->subeventstatus[1].OperationStatus = "F"
        set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
        set reply->status_data->subeventstatus[1].TargetObjectName = "parse number of hours"
        go to EXIT_SCRIPT
      endif
  else
      set hoursentered = 0
  endif
 
end   ;end subroutine CHECK_HRS_OPT
 
subroutine CHECK_SVC_OPT ( script_name )
    set temp_pos = 0
    set temp_pos = cnvtint(value(findstring("SVC[",temp_string)))
    if (temp_pos > 0)
        set svc_string = substring(temp_pos + 4, size(temp_string), temp_string)
        set svc_pos = cnvtint(value(findstring("]", svc_string)))
        SET parm_string = fillstring(100, " ")
        SET parm_string =  substring(1, svc_pos - 1, svc_string)
        ; locate the individual parameters in parm_string and put them in array
        SET ptr = 1
        SET back_ptr = 1
        SET param_idx = 1
        set nbr_of_services = size(trim(parm_string))
        set flag_exit_loop = 0
        FOR (param_idx = 1 TO nbr_of_services)
          SET ptr = findstring(",", parm_string, back_ptr)
          IF (ptr = 0)
            SET ptr = nbr_of_services + 1
            set flag_exit_loop = 1
          ENDIF
          SET parm_len = ptr - back_ptr
          SET stat = alterlist(ops_params->qual, param_idx)
          SET ops_params->qual[param_idx]->param = trim(substring(back_ptr, value(parm_len), parm_string), 3)
          SET back_ptr = ptr + 1
          SET stat = alterlist(request->qual, param_idx)
          SET request->qual[param_idx]->service_resource_cd = cnvtreal(ops_params->qual[param_idx]->param)
          IF (flag_exit_loop = 1)
            set param_idx = nbr_of_services
          ENDIF
        ENDFOR
    else
        ;fail script
        set reply->status_data->status = "F"
        set reply->status_data->subeventstatus[1].OperationName = script_name
        set reply->status_data->subeventstatus[1].OperationStatus = "F"
        set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
        set reply->status_data->subeventstatus[1].TargetObjectName = "parse service resource"
        go to EXIT_SCRIPT
    endif
end   ;end subroutine CHECK_SVC_OPT
 
subroutine CHECK_DONATION_LOCATION( script_name )
    set temp_pos = 0
    set temp_pos = cnvtint(value(findstring("DLOC[",temp_string)))
    if (temp_pos > 0)
        set loc_string = substring(temp_pos + 5, size(temp_string), temp_string)
        set loc_pos = cnvtint(value(findstring("]", loc_string)))
        if (loc_pos > 0)
            set location_cd = substring(1, loc_pos - 1, loc_string)
            if (trim(location_cd) > " ")
                set request->donation_location_cd = cnvtreal(trim(location_cd))
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse donation location"
                go to EXIT_SCRIPT
            endif
        else
            ;fail script
            set reply->status_data->status = "F"
            set reply->status_data->subeventstatus[1].OperationName = script_name
            set reply->status_data->subeventstatus[1].OperationStatus = "F"
            set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
            set reply->status_data->subeventstatus[1].TargetObjectName = "parse donation location"
            go to EXIT_SCRIPT
        endif
    else
        set request->donation_location_cd = 0.0
    endif
end   ;end subroutine CHECK_DONATION_LOCATION
 
subroutine CHECK_NULL_REPORT ( script_name )
   set temp_pos = 0
   set temp_pos = cnvtint(value(findstring("NULLRPT[",temp_string)))
      if (temp_pos > 0)
         set null_string = substring(temp_pos + 8, size(temp_string), temp_string)
         set null_pos = cnvtint(value(findstring("]", null_string)))
           if (null_pos > 0)
                 set null_selection = substring(1, null_pos - 1, null_string)
                 if( trim(null_selection) = "Y" )
                     set request->null_ind = 1
                 else
                     set request->null_ind = 0
                 endif
           else
               ;fail script
               set reply->status_data->status = "F"
               set reply->status_data->subeventstatus[1].OperationName = script_name
               set reply->status_data->subeventstatus[1].OperationStatus = "F"
               set reply->status_data->subeventstatus[1].TargetObjectValue = "no value in string"
               set reply->status_data->subeventstatus[1].TargetObjectName = "parse null report indicator"
               go to EXIT_SCRIPT
           endif
      endif
end    ;end subroutinesubroutine CHECK_NULL_REPORT
 
subroutine CHECK_OUTCOME_CD( script_name )
        set temp_pos = 0
        set temp_pos = cnvtint(value(findstring("OUTCOME[",temp_string)))
        if (temp_pos > 0)
          set outcome_string = substring(temp_pos + 8, size(temp_string), temp_string)
          set loc_pos = cnvtint(value(findstring("]", outcome_string)))
          if (loc_pos > 0)
            set outcome_cd = substring(1, loc_pos - 1, outcome_string)
            if (trim(outcome_cd) > " ")
                set request->outcome_cd = cnvtreal( outcome_cd )
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse outcome code value"
                go to EXIT_SCRIPT
            endif
          else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].OperationName = script_name
                set reply->status_data->subeventstatus[1].OperationStatus = "F"
                set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse outcome code value"
                go to EXIT_SCRIPT
          endif
        else
          set request->outcome_cd = 0.0
        endif
end   ;end subroutine CHECK_OUTCOME_CD
 
subroutine CHECK_FACILITY_CD( script_name )
  set temp_pos = 0
  set temp_pos = cnvtint(value(findstring("FACILITY[",temp_string)))
  if (temp_pos > 0)
    set loc_string = substring(temp_pos + 9, size(temp_string), temp_string)
    set loc_pos = cnvtint(value(findstring("]", loc_string)))
    if (loc_pos > 0)
      set facility_cd = substring(1, loc_pos - 1, loc_string)
      if (trim(facility_cd) > " ")
        set request->facility_cd = cnvtreal(facility_cd )
      else
        ;fail script
        set reply->status_data->status = "F"
        set reply->status_data->subeventstatus[1].OperationName = script_name
        set reply->status_data->subeventstatus[1].OperationStatus = "F"
        set reply->status_data->subeventstatus[1].TargetObjectValue = "no facility code value in string"
        set reply->status_data->subeventstatus[1].TargetObjectName = "parse facility code value"
        go to EXIT_SCRIPT
      endif
    else
      ;fail script
      set reply->status_data->status = "F"
      set reply->status_data->subeventstatus[1].OperationName = script_name
      set reply->status_data->subeventstatus[1].OperationStatus = "F"
      set reply->status_data->subeventstatus[1].TargetObjectValue = "no facility code value in string"
      set reply->status_data->subeventstatus[1].TargetObjectName = "parse facility code value"
      go to EXIT_SCRIPT
    endif
  else
    set request->facility_cd = 0.0
  endif
end   ;end subroutine CHECK_FACILITY_CD
 
subroutine CHECK_EXCEPTION_TYPE_CD( script_name )
  set temp_pos = 0
  set temp_pos = cnvtint(value(findstring("EXCEPT[",temp_string)))
  if (temp_pos > 0)
    set loc_string = substring(temp_pos + 7, size(temp_string), temp_string)
    set loc_pos = cnvtint(value(findstring("]", loc_string)))
    if (loc_pos > 0)
      set exception_type_cd = substring(1, loc_pos - 1, loc_string)
      if (trim(exception_type_cd) > " ")
        if (trim(exception_type_cd) = "ALL")
           set request->exception_type_cd = 0.0
        else
           set request->exception_type_cd = cnvtreal(exception_type_cd )
        endif
      else
      ;fail script
        set reply->status_data->status = "F"
        set reply->status_data->subeventstatus[1].OperationName = script_name
        set reply->status_data->subeventstatus[1].OperationStatus = "F"
        set reply->status_data->subeventstatus[1].TargetObjectValue = "no exception type code value in string"
        set reply->status_data->subeventstatus[1].TargetObjectName = "parse exception type code value"
        go to EXIT_SCRIPT
      endif
    else
      ;fail script
      set reply->status_data->status = "F"
      set reply->status_data->subeventstatus[1].OperationName = script_name
      set reply->status_data->subeventstatus[1].OperationStatus = "F"
      set reply->status_data->subeventstatus[1].TargetObjectValue = "no exception type code value in string"
      set reply->status_data->subeventstatus[1].TargetObjectName = "parse exception type code value"
      go to EXIT_SCRIPT
    endif
  else
    set request->exception_type_cd = 0.0
  endif
end   ;end subroutine CHECK_EXCEPTION_TYPE_CD
 
; This is used to get the value of any ops param that is passed as input
subroutine CHECK_MISC_FUNCTIONALITY(param_name)
	set temp_pos = 0
	set status_param = ""
	set temp_str = concat(param_name, '[')
 
	set temp_pos = cnvtint(value(findstring(temp_str,temp_string)))
	if (temp_pos > 0)
 		set status_string = substring(temp_pos + textlen(temp_str), size(temp_string), temp_string)
		set status_pos = cnvtint(value(findstring("]", status_string)))
 
		if (status_pos > 0)
			set status_param = substring(1, status_pos - 1, status_string)
			if (trim(status_param) > " ")
				set ops_param_status = cnvtint(status_param)
			endif
		endif
	endif
	return
end

;Generated by GNU enscript 1.6.4.
