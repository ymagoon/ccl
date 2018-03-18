drop program cust_sch_rpt_pat_weekly:dba go
create program cust_sch_rpt_pat_weekly:dba

/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
      *                                                                      *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
      *  This material contains the valuable properties and trade secrets of *
      *  Cerner Corporation of Kansas City, Missouri, United States of       *
      *  America (Cerner), embodying substantial creative efforts and        *
      *  confidential information, ideas and expressions, no part of which   *
      *  may be reproduced or transmitted in any form or by any means, or    *
      *  retained in any storage or retrieval system without the express     *
      *  written permission of Cerner.                                       *
      *                                                                      *
      *  Cerner is a registered mark of Cerner Corporation.                  *
      *                                                                      *
  ~BE~***********************************************************************/

/*****************************************************************************

        Source file name:       cust_sch_rpt_pat_weekly.prg
        Object name:            cust_sch_rpt_pat_weekly
        Request #:

        Product:                Enterprise Scheduling Management
        Product Team:           Access Management - Scheduling
        HNA Version:
        CCL Version:

        Program purpose:        Prints Weekly Chart for given patient.  Includes times
                                 and appointment type

        Tables read:            person, sch_resource, sch_appt, sch_event
        Tables updated:         None
        Executing from:

        Special Notes:

******************************************************************************/

;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
 ;    *000 05/2012  Jay Widby            modified from source                *
 ;                                       added scheduling security           *
;~DE~************************************************************************

;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

if (validate(ACTION_NONE,-1) != 0) 
    declare ACTION_NONE = i2 with protect, noconstant(0) 
 endif 
 if (validate(ACTION_ADD, -1) != 1) 
    declare ACTION_ADD = i2 with protect, noconstant(1) 
 endif 
 if (validate(ACTION_CHG,-1) != 2) 
    declare ACTION_CHG = i2 with protect, noconstant(2) 
 endif 
 if (validate(ACTION_DEL,-1) != 3) 
    declare ACTION_DEL = i2 with protect, noconstant(3) 
 endif 
 if (validate(ACTION_GET,-1) != 4) 
    declare ACTION_GET = i2 with protect, noconstant(4) 
 endif 
 if (validate(ACTION_INA,-1) != 5) 
    declare ACTION_INA = i2 with protect, noconstant(5) 
 endif 
 if (validate(ACTION_ACT,-1) != 6) 
    declare ACTION_ACT = i2 with protect, noconstant(6) 
 endif 
 if (validate(ACTION_TEMP,-1) != 999) 
    declare ACTION_TEMP = i2 with protect, noconstant(999) 
 endif 
 if (validate(TRUE,-1) != 1) 
    declare TRUE = i2 with protect, noconstant(1) 
 endif 
 if (validate(FALSE,-1) != 0) 
   declare FALSE = i2 with protect, noconstant(0) 
 endif 
 if (validate(GEN_NBR_ERROR,-1) != 3) 
    declare GEN_NBR_ERROR = i2 with protect, noconstant(3) 
 endif 
 if (validate(INSERT_ERROR,-1) != 4) 
    declare INSERT_ERROR = i2 with protect, noconstant(4) 
 endif 
 if (validate(UPDATE_ERROR,-1) != 5) 
    declare UPDATE_ERROR = i2 with protect, noconstant(5) 
 endif 
 if (validate(REPLACE_ERROR,-1) != 6) 
    declare REPLACE_ERROR = i2 with protect, noconstant(6) 
 endif 
 if (validate(DELETE_ERROR,-1) != 7) 
    declare DELETE_ERROR = i2 with protect, noconstant(7) 
 endif 
 if (validate(UNDELETE_ERROR,-1) != 8) 
    declare UNDELETE_ERROR = i2 with protect, noconstant(8) 
 endif 
 if (validate(REMOVE_ERROR,-1) != 9) 
    declare REMOVE_ERROR = i2 with protect, noconstant(9) 
 endif 
 if (validate(ATTRIBUTE_ERROR,-1) != 10) 
    declare ATTRIBUTE_ERROR = i2 with protect, noconstant(10) 
 endif 
 if (validate(LOCK_ERROR,-1) != 11) 
    declare LOCK_ERROR = i2 with protect, noconstant(11) 
 endif 
 if (validate(NONE_FOUND,-1) != 12) 
    declare NONE_FOUND = i2 with protect, noconstant(12) 
 endif 
 if (validate(SELECT_ERROR,-1) != 13) 
    declare SELECT_ERROR = i2 with protect, noconstant(13) 
 endif 
 if (validate(UPDATE_CNT_ERROR,-1) != 14) 
    declare UPDATE_CNT_ERROR = i2 with protect, noconstant(14) 
 endif 
 if (validate(NOT_FOUND,-1) != 15) 
    declare NOT_FOUND = i2 with protect, noconstant(15) 
 endif 
 if (validate(VERSION_INSERT_ERROR,-1) != 16) 
    declare VERSION_INSERT_ERROR = i2 with protect, noconstant(16) 
 endif 
 if (validate(INACTIVATE_ERROR,-1) != 17) 
    declare INACTIVATE_ERROR = i2 with protect, noconstant(17) 
 endif 
 if (validate(ACTIVATE_ERROR,-1) != 18) 
    declare ACTIVATE_ERROR = i2 with protect, noconstant(18) 
 endif 
 if (validate(VERSION_DELETE_ERROR,-1) != 19) 
    declare VERSION_DELETE_ERROR = i2 with protect, noconstant(19) 
 endif 
 if (validate(UAR_ERROR,-1) != 20) 
    declare UAR_ERROR = i2 with protect, noconstant(20) 
 endif 
 if (validate(DUPLICATE_ERROR,-1) != 21) 
    declare DUPLICATE_ERROR = i2 with protect, noconstant(21 )                                ;42372 
 endif 
 if (validate(CCL_ERROR,-1) != 22) 
    declare CCL_ERROR = i2 with protect, noconstant(22)                                       ;42372 
 endif 
 if (validate(EXECUTE_ERROR,-1) != 23) 
    declare EXECUTE_ERROR = i2 with protect, noconstant(23)                                   ;42372 
 endif 
 if (validate(failed,-1) != 0) 
    declare failed  = i2 with protect, noconstant(FALSE) 
 endif 
 if (validate(table_name,"ZZZ") = "ZZZ") 
    declare table_name = vc with protect, noconstant("") 
 else 
    set table_name = fillstring(100," ") 
 endif 
 if (validate(call_echo_ind,-1) != 0) 
    declare call_echo_ind = i2 with protect, noconstant(FALSE) 
 endif 
 if (validate(i_version,-1) != 0) 
    declare i_version = i2 with protect, noconstant(0) 
 endif 
 if (validate(program_name,"ZZZ") = "ZZZ") 
    declare program_name = vc with protect, noconstant(fillstring(30, " ")) 
 endif 
 if (validate(sch_security_id,-1) != 0) 
    declare sch_security_id = f8 with protect, noconstant(0.0) 
 endif 

if(validate(schuar_def, 999)=999) 
    call echo("Declaring schuar_def") 
    declare schuar_def = i2 with persist 
    set schuar_def = 1 
     declare uar_sch_check_security(sec_type_cd=f8(ref), 
                                   parent1_id=f8(ref), 
                                   parent2_id=f8(ref), 
                                   parent3_id=f8(ref), 
                                   sec_id=f8(ref), 
                                   user_id=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security", persist 
     declare uar_sch_security_insert(user_id=f8(ref), 
                                    sec_type_cd=f8(ref), 
                                    parent1_id=f8(ref), 
                                    parent2_id=f8(ref), 
                                    parent3_id=f8(ref), 
                                    sec_id=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_insert", persist 
     declare uar_sch_security_perform() = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_perform", persist 
     declare uar_sch_check_security_ex(user_id=f8(ref), 
                                      sec_type_cd=f8(ref), 
                                      parent1_id=f8(ref), 
                                      parent2_id=f8(ref), 
                                      parent3_id=f8(ref), 
                                      sec_id=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security_ex", persist 
   
    ;87486+ 
    declare uar_sch_check_security_ex2(user_id=f8(ref), 
                                      sec_type_cd=f8(ref), 
                                      parent1_id=f8(ref), 
                                      parent2_id=f8(ref), 
                                      parent3_id=f8(ref), 
                                      sec_id=f8(ref), 
                                      position_cd=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security_ex2", persist 
   
    declare uar_sch_security_insert_ex2(user_id=f8(ref), 
                                    sec_type_cd=f8(ref), 
                                    parent1_id=f8(ref), 
                                    parent2_id=f8(ref), 
                                    parent3_id=f8(ref), 
                                    sec_id=f8(ref), 
                                    position_cd=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_insert_ex2", persist 
    ;87486- 
 endif    
 
 ;000 setting up security locks
 declare view_action_cd = f8 with public, noconstant(0.0)
 declare appttype_type_cd = f8 with public, noconstant(0.0)
 declare location_type_cd = f8 with public, noconstant(0.0)
 
 set view_action_cd = uar_get_code_by("MEANING",16166,"VIEW")
 if (view_action_cd <= 0)
  call EchoOut("error: unable to find VIEW on 16166")
  go to exit_script
 endif
 
 set appttype_type_cd = uar_get_code_by("MEANING",16165,"APPTTYPE")
 if (appttype_type_cd <= 0)
  call EchoOut("error: unable to find APPTTYPE on 16165")
  go to exit_script
 endif
 
 set location_type_cd = uar_get_code_by("MEANING",16165,"LOCATION")
 if (location_type_cd <= 0)
  call EchoOut("error: unable to find LOCATION on 16165")
  go to exit_script
 endif
 
 if (validate(t_granted,-1) != 0)
    declare t_granted = i2 with protect, noconstant(0)
 endif
 if (validate(sch_security_id,-1) != 0)
    declare sch_security_id = f8 with protect, noconstant(0.0)
 endif
 if (validate(t_granted_loc,-1) != 0)
    declare t_granted_loc = i2 with protect, noconstant(0)
 endif
 if (validate(sch_security_id_loc,-1) != 0)
    declare sch_security_id_loc = f8 with protect, noconstant(0.0)
 endif

 
/**********************************************************************/ 
 /* Declares                                                           */ 
 /**********************************************************************/ 
  declare s_format_utc_date (date, tz_index, option) = vc 
   /********************************************************************* 
 * Name: s_format_utc_date 
 * Purpose: format the absolute datetime applying the timezone index 
 * Inputs:  date -  converted date (dq8) 
 *          tz_index - time zone index (i4) 
 * Outputs: Formatted date (vc) 
 ***********************************************************************/ 
 subroutine s_format_utc_date (date, tz_index, option) 
   if (curutc) 
      if (tz_index > 0) 
         return (format(datetimezone(date,tz_index),option)) 
      else 
         return (format(datetimezone(date,curtimezonesys),option)) 
      endif 
   else 
      return (format(date,option)) 
   endif 
 end 
 
if(validate(sch_font_metrics_times_, -99) = -99) ;48965 check for re-inclusion of header file 
 declare sch_font_metrics_times_ = i2 with public, constant(1) ;48965 
   
 /************************************************************** 
 ; DECLARED SUBROUTINES 
 **************************************************************/ 
 declare CpiToPoints(cpiSize = i2) = i2 
 declare StringWidthTimes(input_string = vc, cpi = i2, bold = i2) = i4 
 declare CenterStringTimes(input_string = vc, cpi = i2, x_start = i2, x_end = i2, bold = i2) = i2 
 declare WordWrapTimes(input_string = vc, cpi = i2, line_width = i2, bold_start = i2) = i2 
 declare CharacterWrapTimes(input_string = vc, cpi = i2, line_width = i2, bold_start = i2) = i2 ;00000 
   
 /************************************************************** 
 ; DECLARED VARIABLES 
 **************************************************************/ 
 declare inputStrLen    = i4 with public, noconstant(0) 
 declare fontPoints     = i4 with public, noconstant(0) 
 declare widthLine      = i4 with public, noconstant(0) 
 declare widthTotal     = i4 with public, noconstant(0) 
 declare widthString    = i4 with public, noconstant(0) 
 declare widthWord      = i4 with public, noconstant(0) 
 declare widthChar      = i2 with public, noconstant(0) 
 declare widthSpace     = i4 with public, noconstant(0) 
 declare spaceCnt       = i2 with public, noconstant(0) 
 declare asciiNum       = i2 with public, noconstant(0) 
 declare endWord        = i4 with public, noconstant(1) 
 declare startSubStr    = i4 with public, noconstant(1) 
 declare endLastLine    = i2 with public, noconstant(0) 
 declare endLastLinePts = i4 with public, noconstant(0) 
 declare state          = i2 with public, noconstant(0) 
 declare cnt            = i4 with public, noconstant(1) 
 declare bold           = i2 with public, noconstant(0) 
 declare boldStart      = i4 with public, noconstant(0) 
 declare nonBoldStart   = i4 with public, noconstant(0) 
 declare temp_indx      = i4 with public, noconstant(0) ;31140 
   
 if(validate(sch_font_metrics_times_rec_, -99)= -99) ;48965 check for re-inclusion of records 
 declare sch_font_metrics_times_rec_ = i2 with public, constant(1) ;48965 
   ; Used to return data from subroutines  CenterStringTimes() & WordWrapTimes() 
 ;  - Since tabs do not have their own metrics data, use multiple spaces in their place. 
 ;  - If x_offset = 0, output_string->string will start a new line, otherwise print the string 
 ;    on the same line with the x axis offset given in points. ( 1 point = 1/72" ) 
 ;  - For non-bold text, bold = 0; for bold text, bold = 1 
 free set format_text 
 record format_text 
 ( 
   1 output_string_cnt = i2  ; Set by subroutine. Number of lines text was broken into 
   1 output_string[*]        ; Set by subroutine. Lines of text to be printed. 
     2 string            = vc  ; Hold the text to be printed 
     2 x_offset          = i4  ; When newline, x_offset = 0. Otherwise, this is the x axis offset for printing on the same line. 
     2 bold              = i2  ; 0 = string is not bold, 1 = string is bold 
 ) 
  ; Stores character metric data for point size look up 
 free set metrics 
 record metrics 
 ( 
   1 Times_cnt = i2 
   1 Times[*] 
     2 size = i2 
   1 Times_bold_cnt = i2 
   1 Times_bold[*] 
     2 size = i2 
 ) 
  endif 
  /************************************************************** 
 ; SET VARIABLES 
 **************************************************************/ 
 set format_text->output_string_cnt = 0 
   
 ; Set the metric data, characters are stored by ASCII value 
 set metrics->Times_cnt = 253 
 set stat = alterlist(metrics->Times, metrics->Times_cnt) 
 ; The first 31 characters are non-printed 
 for(t_indx = 1 to 31) 
    set metrics->Times[t_indx]->size = 0 
 endfor 
 set metrics->Times[32]->size = 250 
 set metrics->Times[33]->size = 333 
 set metrics->Times[34]->size = 408 
 set metrics->Times[35]->size = 500 
 set metrics->Times[36]->size = 500 
 set metrics->Times[37]->size = 833 
 set metrics->Times[38]->size = 778 
 set metrics->Times[39]->size = 333 
 set metrics->Times[40]->size = 333 
 set metrics->Times[41]->size = 333 
 set metrics->Times[42]->size = 500 
 set metrics->Times[43]->size = 564 
 set metrics->Times[44]->size = 250 
 set metrics->Times[45]->size = 333 
 set metrics->Times[46]->size = 250 
 set metrics->Times[47]->size = 278 
 set metrics->Times[48]->size = 500 
 set metrics->Times[49]->size = 550 
 set metrics->Times[50]->size = 550 
 set metrics->Times[51]->size = 550 
 set metrics->Times[52]->size = 550 
 set metrics->Times[53]->size = 550 
 set metrics->Times[54]->size = 550 
 set metrics->Times[55]->size = 550 
 set metrics->Times[56]->size = 550 
 set metrics->Times[57]->size = 550 
 set metrics->Times[58]->size = 278 
 set metrics->Times[59]->size = 278 
 set metrics->Times[60]->size = 564 
 set metrics->Times[61]->size = 564 
 set metrics->Times[62]->size = 564 
 set metrics->Times[63]->size = 444 
 set metrics->Times[64]->size = 921 
 set metrics->Times[65]->size = 722 
 set metrics->Times[66]->size = 667 
 set metrics->Times[67]->size = 667 
 set metrics->Times[68]->size = 722 
 set metrics->Times[69]->size = 611 
 set metrics->Times[70]->size = 556 
 set metrics->Times[71]->size = 722 
 set metrics->Times[72]->size = 722 
 set metrics->Times[73]->size = 333 
 set metrics->Times[74]->size = 389 
 set metrics->Times[75]->size = 722 
 set metrics->Times[76]->size = 611 
 set metrics->Times[77]->size = 889 
 set metrics->Times[78]->size = 722 
 set metrics->Times[79]->size = 722 
 set metrics->Times[80]->size = 556 
 set metrics->Times[81]->size = 722 
 set metrics->Times[82]->size = 667 
 set metrics->Times[83]->size = 556 
 set metrics->Times[84]->size = 611 
 set metrics->Times[85]->size = 722 
 set metrics->Times[86]->size = 722 
 set metrics->Times[87]->size = 944 
 set metrics->Times[88]->size = 722 
 set metrics->Times[89]->size = 722 
 set metrics->Times[90]->size = 611 
 set metrics->Times[91]->size = 333 
 set metrics->Times[92]->size = 278 
 set metrics->Times[93]->size = 333 
 set metrics->Times[94]->size = 469 
 set metrics->Times[95]->size = 500 
 set metrics->Times[96]->size = 333 
 set metrics->Times[97]->size = 444 
 set metrics->Times[98]->size = 500 
 set metrics->Times[99]->size = 444 
 set metrics->Times[100]->size = 500 
 set metrics->Times[101]->size = 444 
 set metrics->Times[102]->size = 333 
 set metrics->Times[103]->size = 500 
 set metrics->Times[104]->size = 500 
 set metrics->Times[105]->size = 278 
 set metrics->Times[106]->size = 278 
 set metrics->Times[107]->size = 500 
 set metrics->Times[108]->size = 278 
 set metrics->Times[109]->size = 778 
 set metrics->Times[110]->size = 500 
 set metrics->Times[111]->size = 500 
 set metrics->Times[112]->size = 500 
 set metrics->Times[113]->size = 500 
 set metrics->Times[114]->size = 333 
 set metrics->Times[115]->size = 389 
 set metrics->Times[116]->size = 278 
 set metrics->Times[117]->size = 500 
 set metrics->Times[118]->size = 500 
 set metrics->Times[119]->size = 722 
 set metrics->Times[120]->size = 500 
 set metrics->Times[121]->size = 500 
 set metrics->Times[122]->size = 444 
 set metrics->Times[123]->size = 480 
 set metrics->Times[124]->size = 200 
 set metrics->Times[125]->size = 480 
 set metrics->Times[126]->size = 541 
   
 ; The next 34 characters are non-printed 
 for(t_indx = 127 to 160) 
    set metrics->Times[t_indx]->size = 0 
 endfor 
   
 ; Special characters 
 set metrics->Times[161]->size = 333  ; ¡ exclamdown 
 set metrics->Times[162]->size = 500  ; ¢ cent 
 set metrics->Times[163]->size = 500  ; £ sterling 
 set metrics->Times[164]->size = 167 
 set metrics->Times[165]->size = 500  ; ¥ yen 
 set metrics->Times[166]->size = 500 
 set metrics->Times[167]->size = 500  ; § section 
 set metrics->Times[168]->size = 500  ; ¨ currency 
 set metrics->Times[169]->size = 180  ; ¿ 
 set metrics->Times[170]->size = 444  ; ª quotedblleft 
 set metrics->Times[171]->size = 500  ; « guillemotleft 
 set metrics->Times[172]->size = 333 
 set metrics->Times[173]->size = 333 
 set metrics->Times[174]->size = 556 
 set metrics->Times[175]->size = 556 
 set metrics->Times[176]->size = 0 
 set metrics->Times[177]->size = 500  ; ± endash 
 set metrics->Times[178]->size = 500  ; ² dagger 
 set metrics->Times[179]->size = 500  ; ³ daggerdbl 
 set metrics->Times[180]->size = 250  ; ´ periodcentered 
 set metrics->Times[181]->size = 0 
 set metrics->Times[182]->size = 453  ; ¶ paragraph 
 set metrics->Times[183]->size = 350  ; · bullet 
 set metrics->Times[184]->size = 333  ; ¸ quotesinglbase 
 set metrics->Times[185]->size = 444  ; ¹ quotedblbase 
 set metrics->Times[186]->size = 444  ; º quotedblright 
 set metrics->Times[187]->size = 500  ; » guillemotright 
 set metrics->Times[188]->size = 1000 ; ¼ ellipsis 
 set metrics->Times[189]->size = 1000 ; ½ perthousand 
 set metrics->Times[190]->size = 0 
 set metrics->Times[191]->size = 444  ; ¿ 
 set metrics->Times[192]->size = 333  ; À 
 set metrics->Times[193]->size = 333  ; Á 
 set metrics->Times[194]->size = 333  ; Â 
 set metrics->Times[195]->size = 333  ; Ã 
 set metrics->Times[196]->size = 333  ; Ä 
 set metrics->Times[197]->size = 333  ; Å 
 set metrics->Times[198]->size = 333  ; Æ 
 set metrics->Times[199]->size = 333  ; Ç 
 set metrics->Times[200]->size = 333  ; È 
 set metrics->Times[201]->size = 333  ; É 
 set metrics->Times[202]->size = 333  ; Ê 
 set metrics->Times[203]->size = 333  ; Ë 
 set metrics->Times[204]->size = 278  ; Ì 
 set metrics->Times[205]->size = 278  ; Í 
 set metrics->Times[206]->size = 278  ; Î 
 set metrics->Times[207]->size = 278  ; Ï 
 set metrics->Times[208]->size = 1000 
   
 ; The next 25 characters are non-printed 
 for(t_indx = 209 to 224) 
    set metrics->Times[t_indx]->size = 0 
 endfor 
   
 set metrics->Times[225]->size = 889  ; á 
 set metrics->Times[226]->size = 0 
 set metrics->Times[227]->size = 276  ; ã 
 set metrics->Times[228]->size = 0 
 set metrics->Times[229]->size = 0 
 set metrics->Times[230]->size = 0 
 set metrics->Times[231]->size = 0 
 set metrics->Times[232]->size = 611  ; è 
 set metrics->Times[233]->size = 722  ; é 
 set metrics->Times[234]->size = 889  ; ê 
 set metrics->Times[235]->size = 310  ; ë 
 set metrics->Times[236]->size = 0 
 set metrics->Times[237]->size = 0 
 set metrics->Times[238]->size = 0 
 set metrics->Times[239]->size = 0 
 set metrics->Times[240]->size = 0 
 set metrics->Times[241]->size = 667  ; ñ 
 set metrics->Times[242]->size = 0 
 set metrics->Times[243]->size = 0 
 set metrics->Times[244]->size = 0 
 set metrics->Times[245]->size = 278  ; õ 
 set metrics->Times[246]->size = 0 
 set metrics->Times[247]->size = 0 
 set metrics->Times[248]->size = 278  ; ø 
 set metrics->Times[249]->size = 500  ; ù 
 set metrics->Times[250]->size = 722  ; ú 
 set metrics->Times[251]->size = 500  ; û 
 set metrics->Times[252]->size = 0 
 set metrics->Times[253]->size = 0 
 ; End metrics for Times 
   
   
   
   
 ; Start Metrics for Times Bold 
 set metrics->Times_bold_cnt = 253 
 set stat = alterlist(metrics->Times_bold, metrics->Times_bold_cnt) 
 ; The next 32 characters are non-printed 
 for(t_indx = 1 to 31) 
    set metrics->Times_bold[t_indx]->size = 0 
 endfor 
 set metrics->Times_bold[32]->size = 250 
 set metrics->Times_bold[33]->size = 333 
 set metrics->Times_bold[34]->size = 555 
 set metrics->Times_bold[35]->size = 500 
 set metrics->Times_bold[36]->size = 500 
 set metrics->Times_bold[37]->size = 1000 
 set metrics->Times_bold[38]->size = 833 
 set metrics->Times_bold[39]->size = 333 
 set metrics->Times_bold[40]->size = 333 
 set metrics->Times_bold[41]->size = 333 
 set metrics->Times_bold[42]->size = 500 
 set metrics->Times_bold[43]->size = 570 
 set metrics->Times_bold[44]->size = 250 
 set metrics->Times_bold[45]->size = 333 
 set metrics->Times_bold[46]->size = 250 
 set metrics->Times_bold[47]->size = 278 
 set metrics->Times_bold[48]->size = 500 
 set metrics->Times_bold[49]->size = 500 
 set metrics->Times_bold[50]->size = 500 
 set metrics->Times_bold[51]->size = 500 
 set metrics->Times_bold[52]->size = 500 
 set metrics->Times_bold[53]->size = 500 
 set metrics->Times_bold[54]->size = 500 
 set metrics->Times_bold[55]->size = 500 
 set metrics->Times_bold[56]->size = 500 
 set metrics->Times_bold[57]->size = 500 
 set metrics->Times_bold[58]->size = 333 
 set metrics->Times_bold[59]->size = 333 
 set metrics->Times_bold[60]->size = 570 
 set metrics->Times_bold[61]->size = 570 
 set metrics->Times_bold[62]->size = 570 
 set metrics->Times_bold[63]->size = 500 
 set metrics->Times_bold[64]->size = 930 
 set metrics->Times_bold[65]->size = 722 
 set metrics->Times_bold[66]->size = 667 
 set metrics->Times_bold[67]->size = 722 
 set metrics->Times_bold[68]->size = 722 
 set metrics->Times_bold[69]->size = 667 
 set metrics->Times_bold[70]->size = 611 
 set metrics->Times_bold[71]->size = 778 
 set metrics->Times_bold[72]->size = 778 
 set metrics->Times_bold[73]->size = 389 
 set metrics->Times_bold[74]->size = 500 
 set metrics->Times_bold[75]->size = 778 
 set metrics->Times_bold[76]->size = 667 
 set metrics->Times_bold[77]->size = 944 
 set metrics->Times_bold[78]->size = 722 
 set metrics->Times_bold[79]->size = 778 
 set metrics->Times_bold[80]->size = 556 
 set metrics->Times_bold[81]->size = 667 
 set metrics->Times_bold[82]->size = 722 
 set metrics->Times_bold[83]->size = 556 
 set metrics->Times_bold[84]->size = 667 
 set metrics->Times_bold[85]->size = 722 
 set metrics->Times_bold[86]->size = 722 
 set metrics->Times_bold[87]->size = 1000 
 set metrics->Times_bold[88]->size = 772 
 set metrics->Times_bold[89]->size = 772 
 set metrics->Times_bold[90]->size = 667 
 set metrics->Times_bold[91]->size = 333 
 set metrics->Times_bold[92]->size = 278 
 set metrics->Times_bold[93]->size = 333 
 set metrics->Times_bold[94]->size = 581 
 set metrics->Times_bold[95]->size = 500 
 set metrics->Times_bold[96]->size = 333 
 set metrics->Times_bold[97]->size = 500 
 set metrics->Times_bold[98]->size = 556 
 set metrics->Times_bold[99]->size = 444 
 set metrics->Times_bold[100]->size = 556 
 set metrics->Times_bold[101]->size = 444 
 set metrics->Times_bold[102]->size = 333 
 set metrics->Times_bold[103]->size = 500 
 set metrics->Times_bold[104]->size = 556 
 set metrics->Times_bold[105]->size = 278 
 set metrics->Times_bold[106]->size = 333 
 set metrics->Times_bold[107]->size = 556 
 set metrics->Times_bold[108]->size = 278 
 set metrics->Times_bold[109]->size = 833 
 set metrics->Times_bold[110]->size = 556 
 set metrics->Times_bold[111]->size = 500 
 set metrics->Times_bold[112]->size = 556 
 set metrics->Times_bold[113]->size = 556 
 set metrics->Times_bold[114]->size = 444 
 set metrics->Times_bold[115]->size = 389 
 set metrics->Times_bold[116]->size = 333 
 set metrics->Times_bold[117]->size = 556 
 set metrics->Times_bold[118]->size = 550 
 set metrics->Times_bold[119]->size = 722 
 set metrics->Times_bold[120]->size = 500 
 set metrics->Times_bold[121]->size = 500 
 set metrics->Times_bold[122]->size = 444 
 set metrics->Times_bold[123]->size = 394 
 set metrics->Times_bold[124]->size = 220 
 set metrics->Times_bold[125]->size = 394 
 set metrics->Times_bold[126]->size = 520 
   
 ; The next 34 characters are non-printed 
 for(t_indx = 127 to 160) 
    set metrics->Times_bold[t_indx]->size = 0 
 endfor 
   
 ; Special characters 
 set metrics->Times_bold[161]->size = 333  ; exclamdown 
 set metrics->Times_bold[162]->size = 500  ; cent 
 set metrics->Times_bold[163]->size = 500  ; sterling 
 set metrics->Times_bold[164]->size = 167 
 set metrics->Times_bold[165]->size = 500  ; yen 
 set metrics->Times_bold[166]->size = 500 
 set metrics->Times_bold[167]->size = 500  ; section 
 set metrics->Times_bold[168]->size = 500  ; currency 
 set metrics->Times_bold[169]->size = 278  ; quotesingle 
 set metrics->Times_bold[170]->size = 500  ; quotedblleft 
 set metrics->Times_bold[171]->size = 500  ; guillemotleft 
 set metrics->Times_bold[172]->size = 333 
 set metrics->Times_bold[173]->size = 333 
 set metrics->Times_bold[174]->size = 556 
 set metrics->Times_bold[175]->size = 556 
 set metrics->Times_bold[176]->size = 0 
 set metrics->Times_bold[177]->size = 500 ; endash 
 set metrics->Times_bold[178]->size = 500  ; dagger 
 set metrics->Times_bold[179]->size = 500  ; daggerdbl 
 set metrics->Times_bold[180]->size = 250  ; periodcentered 
 set metrics->Times_bold[181]->size = 0 
 set metrics->Times_bold[182]->size = 540  ; paragraph 
 set metrics->Times_bold[183]->size = 350  ; bullet 
 set metrics->Times_bold[184]->size = 333 
 set metrics->Times_bold[185]->size = 500  ; quotedblbase 
 set metrics->Times_bold[186]->size = 500  ; quotedblright 
 set metrics->Times_bold[187]->size = 500  ; guillemotright 
 set metrics->Times_bold[188]->size = 1000 ; ellipsis 
 set metrics->Times_bold[189]->size = 1000 ; perthousand 
 set metrics->Times_bold[190]->size = 0 
 set metrics->Times_bold[191]->size = 500  ; ¿ 
 set metrics->Times_bold[193]->size = 333  ; Á 
 set metrics->Times_bold[194]->size = 333  ; Â 
 set metrics->Times_bold[195]->size = 333  ; Ã 
 set metrics->Times_bold[196]->size = 333  ; Ä 
 set metrics->Times_bold[197]->size = 333  ; Å 
 set metrics->Times_bold[198]->size = 333  ; Æ 
 set metrics->Times_bold[199]->size = 333  ; Ç 
 set metrics->Times_bold[200]->size = 333  ; È 
 set metrics->Times_bold[202]->size = 333  ; Ê 
 set metrics->Times_bold[203]->size = 333  ; Ë 
 set metrics->Times_bold[205]->size = 333  ; Í 
 set metrics->Times_bold[206]->size = 333  ; Î 
 set metrics->Times_bold[207]->size = 333  ; Ï 
 set metrics->Times_bold[208]->size = 1000 
   
 ; The next 25 characters are non-printed 
 for(t_indx = 209 to 224) 
    set metrics->Times_bold[t_indx]->size = 0 
 endfor 
   
 set metrics->Times_bold[225]->size = 1000 ; á 
 set metrics->Times_bold[226]->size = 0 
 set metrics->Times_bold[227]->size = 300  ; ã 
 set metrics->Times_bold[228]->size = 0 
 set metrics->Times_bold[229]->size = 0 
 set metrics->Times_bold[230]->size = 0 
 set metrics->Times_bold[231]->size = 0 
 set metrics->Times_bold[232]->size = 667  ; è 
 set metrics->Times_bold[233]->size = 778  ; é 
 set metrics->Times_bold[234]->size = 1000 ; ê 
 set metrics->Times_bold[235]->size = 330  ; ë 
 set metrics->Times_bold[236]->size = 0 
 set metrics->Times_bold[237]->size = 0 
 set metrics->Times_bold[238]->size = 0 
 set metrics->Times_bold[239]->size = 0 
 set metrics->Times_bold[240]->size = 0 
 set metrics->Times_bold[241]->size = 722  ; ñ 
 set metrics->Times_bold[242]->size = 0 
 set metrics->Times_bold[243]->size = 0 
 set metrics->Times_bold[244]->size = 0 
 set metrics->Times_bold[245]->size = 278  ; õ 
 set metrics->Times_bold[246]->size = 0 
 set metrics->Times_bold[247]->size = 0 
 set metrics->Times_bold[248]->size = 278  ; ø 
 set metrics->Times_bold[249]->size = 500  ; ù 
 set metrics->Times_bold[250]->size = 722  ; ú 
 set metrics->Times_bold[251]->size = 556  ; û 
 set metrics->Times_bold[252]->size = 0 
 set metrics->Times_bold[253]->size = 0 
 ; End Metrics for Times Bold 
   
 /************************************************************** 
 ; DEFINE SUBROUTINES 
 **************************************************************/ 
   
 ; To convert the metrics data of a character to points use the following fomula. 
 ; ((metric size) * (font point size)) / 1000 
   
 subroutine CpiToPoints(cpiSize) 
    declare pointSize = i2 
    set pointSize = floor((120.0 / cpiSize) + 0.5) 
    return(pointSize) 
 end 
   
   
 ; Determines the width of a string in point size (point = 1/72 inch) 
 ; input_string = the input string to get a width for 
 ; cpi = the cpi your going to print the string with 
 ; bold = indicator to determine if the string has bold characters 
 ;   - 0 = non-bold string 
 ;   - 1 = bold string 
 subroutine StringWidthTimes(input_string, cpi, bold) 
    if(cpi > 0) 
       set fontPoints = floor((120.0 / cpi) + 0.5) 
    else 
       set fontPoints = 0 
    endif 
    set inputStrLen = textlen(input_string) 
    set widthTotal = 0 
   
    for(temp_indx = 1 to inputStrLen) 
       set asciiNum = ichar(substring(temp_indx, 1, input_string)) 
       if(asciiNum <= 253) 
          if(bold = 0) 
             set widthTotal = widthTotal + fontPoints * metrics->Times[asciiNum]->size 
          else 
             set widthTotal = widthTotal + fontPoints * metrics->Times_bold[asciiNum]->size 
          endif 
       endif 
    endfor 
   
    set widthTotal = floor((widthTotal / 1000.0) + 0.5) 
    return(widthTotal) 
 end 
   
   
 ; - NOTE: If you want to center a string that will spans multiple lines of text, call WordWrapTimes 
 ;   first and center each of its returned strings. You will need a temp structure to hold what is 
 ;   returned from WordWrapTimes. Future enhancements will include having CenterString break 
 ;   strings that are too long for the given line width. 
   
 ; - The input string should be a continuous string without newlines, carriage returns, or tabs. 
 ; - Since tabs do not have their own metrics data, use multiple spaces in their place. 
 ; - Returns the x axis start location of a given string that is to be centered between two 
 ;   points x_start and x_end. Locations (distances) should be given in points. 
 ; - If a string will have mixed bold and non-bold characters, mark the bold sections with the following; 
 ;   ascii char(187) '>>' to begin a bold section and char(171) '<<' to end a bold section 
 ;   The special characters will be removed from the string before being returned. 
 ; - Parameters: 
 ;   - input_string - the string to be centered 
 ;   - cpi - the cpi of the string when it is to be printed 
 ;   - x_start - the start of the section to center the string within (use points, 1 point = 1/72 in.) 
 ;   - x_end - the end of the line section to center the string within (use points, 1 point = 1/72 in.) 
 ;   - bold_start - determine's how the string should start, 0 = standard, 1 = bold 
 subroutine CenterStringTimes(input_string, cpi, x_start, x_end, bold_start) 
    if(cpi > 0) 
       set fontPoints = floor((120.0 / cpi) + 0.5) 
    else 
       set fontPoints = 0 
    endif 
    set inputStrLen = textlen(input_string) 
    set widthLine = (x_end - x_start) * 1000 
    set widthTotal = 0 
    set widthString = 0 
    set startSubStr = 1 
    set bold = bold_start 
    set format_text->output_string_cnt = 0 
    ; Check that line width is at least as large as the widest single character possible. 
    if(widthLine > (1015 * fontPoints) AND fontPoints <= 120) 
       set cnt = 1 
       while(cnt <= inputStrLen) 
          set asciiNum = ichar(substring(cnt, 1, input_string)) 
          ; Ignore non-printable characters and remove them from the string 
          if(asciiNum < 32 OR asciiNum > 253) 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             set cnt = cnt - 1 
          elseif(asciiNum = 187) 
             ; Remove the bold start signal character 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             ; Ignore the character if already in a bold segment. 
             if(bold = 0 AND widthString > 0) 
                ; Store the previous non-bold text including ending spaces if there is any for this line. 
                set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                if(mod(format_text->output_string_cnt, 10) = 1) 
                   set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                endif 
                set format_text->output_string[format_text->output_string_cnt]->string = 
                    notrim(substring(startSubStr, cnt - startSubStr, input_string)) 
                set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                set format_text->output_string[format_text->output_string_cnt]->x_offset = widthTotal 
                set widthTotal = widthTotal + widthString 
                set widthString = 0 
                set startSubStr = cnt 
             endif 
             set bold = 1 
             set cnt = cnt - 1 
          elseif(asciiNum = 171) 
             ; Remove the bold end signal character 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             ; Ignore the character if already in a non-bold segment. 
             if(bold = 1 AND widthString > 0) 
                ; Store the previous non-bold text including ending spaces if there is any for this line. 
                set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                if(mod(format_text->output_string_cnt, 10) = 1) 
                   set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                endif 
                set format_text->output_string[format_text->output_string_cnt]->string = 
                    notrim(substring(startSubStr, cnt - startSubStr, input_string)) 
                set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                set format_text->output_string[format_text->output_string_cnt]->x_offset = widthTotal 
                set widthTotal = widthTotal + widthString 
                set widthString = 0 
                set startSubStr = cnt 
             endif 
             set bold = 0 
             set cnt = cnt - 1 
          else 
             if(bold = 0) 
                set widthString = widthString + fontPoints * metrics->Times[asciiNum]->size 
             else 
                set widthString = widthString + fontPoints * metrics->Times_bold[asciiNum]->size 
             endif 
          endif 
          set cnt = cnt + 1 
       endwhile 
    endif 
   
    ; Add the last section of the string if there is one 
    if(widthString > 0) 
       set format_text->output_string_cnt = format_text->output_string_cnt + 1 
       set stat = alterlist(format_text->output_string, format_text->output_string_cnt) 
       set format_text->output_string[format_text->output_string_cnt]->string = 
           substring(startSubStr, inputStrLen - startSubStr + 1, input_string) 
       set format_text->output_string[format_text->output_string_cnt]->bold = bold 
       set format_text->output_string[format_text->output_string_cnt]->x_offset = widthTotal 
    endif 
   
    set widthTotal = widthTotal + widthString 
    set startSubStr = floor(x_start + ((widthLine - widthTotal) / 2.0) + 0.5) 
    if(startSubStr <= 0) 
       set startSubStr = x_start 
    endif 
    for(temp_indx = 1 to format_text->output_string_cnt) 
       set format_text->output_string[temp_indx]->x_offset = 
         floor((format_text->output_string[temp_indx]->x_offset + startSubStr) / 1000.0 + 0.5) 
    endfor 
    return(floor(startSubStr / 1000.0 + 0.5)) 
 end 
   
   
 ; - The input string should be a continuous string without newlines, carriage returns, or tabs. 
 ; - Since tabs do not have their own metrics data, use multiple spaces in their place. 
 ; - Breaks a given string into a list of strings that will fit within the given line length. 
 ;   It will break strings on spaces unless a word is longer than the line length. 
 ; - If a string will have mixed bold and non-bold characters, mark the bold sections with the following; 
 ;   ascii char(187) '>>' to begin a bold section and char(171) '<<' to end a bold section 
 ;   The special characters will be removed from the string before being returned. 
 ; - Parameters: 
 ;   - input_string - the string to be wrapped 
 ;   - cpi - the cpi of the string when it is to be printed 
 ;   - line_width - the width of a line to contain the text within, given in points 
 ;   - bold_start - denotes if a string starts with bold or non-bold characters, 1 = bold, 0 = non-bold 
 subroutine WordWrapTimes(input_string, cpi, line_width, bold_start) 
    if(cpi > 0) 
       set fontPoints = floor((120.0 / cpi) + 0.5) 
    else 
       set fontPoints = 0 
    endif 
    set inputStrLen = textlen(input_string) 
    set widthLine = line_width * 1000 
    set widthTotal = 0 
    set widthWord = 0 
    set widthSpace = 0 
    set spaceCnt = 0 
    set endWord = 1 
    set startSubStr = 1 
    set endLastLine = 1 
    set endLastLinePts = 0 
    set state = 0 
    set bold = bold_start 
    set boldStart = 0 
    set nonBoldStart = 0 
    set format_text->output_string_cnt = 0 
   
    ; Check that line width is at least as large as the widest single character possible. 
    if(widthLine > (1015 * fontPoints) AND fontPoints <= 120) 
       set cnt = 1 
       while(cnt <= inputStrLen) 
          set asciiNum = ichar(substring(cnt, 1, input_string)) 
          ; Ignore non-printable characters and remove them from the string 
          if(asciiNum < 32 OR asciiNum > 253) 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             set cnt = cnt - 1 
          ; Check for the start of a bold segment (ascii char(187) '>>') 
          elseif(asciiNum = 187) 
             ; Remove the bold start signal character 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             ; Ignore the character if already in a bold segment. 
             if(bold = 0) 
                set boldStart = cnt 
                ; Store the previous non-bold text including ending spaces if there is any for this line. 
                if((widthWord + widthSpace) > 0) 
                   set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                   if(mod(format_text->output_string_cnt, 10) = 1) 
                      set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                   endif 
                   set format_text->output_string[format_text->output_string_cnt]->string = 
                       notrim(substring(startSubStr, cnt - startSubStr, input_string)) 
                   set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                   set format_text->output_string[format_text->output_string_cnt]->
                    x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
                   if(state = 0) 
                      set endLastLinePts = widthTotal + widthSpace 
                   else 
                      set endLastLinePts = widthTotal + widthSpace + widthWord 
                   endif 
                   set startSubStr = cnt 
                endif 
                set bold = 1 
             endif 
             set cnt = cnt - 1 
          ; Check for the end of a bold segment (ascii char(171) '<<') 
          elseif(asciiNum = 171) 
             ; Remove the bold end signal character 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             ; Ignore the character if already in a non-bold segment. 
             if(bold = 1) 
                set nonBoldStart = cnt 
                ; Store the previous bold text including ending spaces if there is any for this line. 
                if((widthWord + widthSpace) > 0) 
                   set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                   if(mod(format_text->output_string_cnt, 10) = 1) 
                      set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                   endif 
                   set format_text->output_string[format_text->output_string_cnt]->string = 
                       notrim(substring(startSubStr, cnt - startSubStr, input_string)) 
                   set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                   set format_text->output_string[format_text->output_string_cnt]->
                    x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
                   if(state = 0) 
                      set endLastLinePts = widthTotal + widthSpace 
                   else 
                      set endLastLinePts = widthTotal + widthSpace + widthWord 
                   endif 
                   set startSubStr = cnt 
   
                endif 
                set bold = 0 
             endif 
             set cnt = cnt - 1 
          ; Check for white space to denote the end of a word. 
          elseif(asciiNum = 32) 
             ; Spaces used only. There are no metrics defined for tabs or newlines. 
             if(state = 1) 
                set state = 0 
                set spaceCnt = 0 
                set widthTotal = widthTotal + widthSpace + widthWord 
                set widthSpace = 0 
                set endWord = cnt ; Marks the position after the last character in the last word. 
             endif 
             set spaceCnt = spaceCnt + 1 
             if(bold = 1) 
                set widthSpace = widthSpace + fontPoints * metrics->Times_bold[asciiNum]->size 
             else 
                set widthSpace = widthSpace + fontPoints * metrics->Times[asciiNum]->size 
             endif 
          else 
             if(state = 0) 
                set state = 1 
                set widthWord = 0 
             endif 
             if(bold = 1) 
                set widthChar = fontPoints * metrics->Times_bold[asciiNum]->size 
             else 
                set widthChar = fontPoints * metrics->Times[asciiNum]->size 
             endif 
             if(widthChar = 0) 
                ; Ignore non-printable characters and remove them from the string 
                set input_string = concat(substring(1, cnt - 1, input_string), 
                                                    substring(cnt + 1, inputStrLen - cnt, input_string)) 
                set inputStrLen = inputStrLen - 1 
                set cnt = cnt - 1 
             else 
                set widthWord = widthWord + widthChar 
                if(widthTotal + widthSpace + widthWord >= widthLine) 
   
                   ; If a single word is longer than the given line width, break the word. 
                   if(endLastLine = endWord) 
                      set endWord = cnt 
                   endif 
                   if(endWord - startSubStr > 0) 
                      ; Write the current substring to the output string list 
                      set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                      if(mod(format_text->output_string_cnt, 10) = 1) 
                         set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                      endif 
                      if(endLastLinePts = 0) 
                         set format_text->output_string[format_text->output_string_cnt]->string = 
                             trim(substring(startSubStr, endWord - startSubStr, input_string),3) 
                      else 
                         set format_text->output_string[format_text->output_string_cnt]->string = 
                             substring(startSubStr, endWord - startSubStr, input_string) 
                      endif 
                      if(endWord = cnt) 
                         set startSubStr = cnt 
                         set widthWord = widthChar 
                      else 
                         set startSubStr = endWord + spaceCnt 
                      endif 
                      set format_text->output_string[format_text->output_string_cnt]->
                       x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
                      set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                   endif 
                   set endLastLine = endWord 
                   set endLastLinePts = 0 
                   set widthTotal = 0 
                   set widthSpace = 0 ; New lines should not start with a space. 
                endif 
             endif 
          endif 
          set cnt = cnt + 1 
       endwhile 
   
       ; Add the last line that fits in the given line length 
       set format_text->output_string_cnt = format_text->output_string_cnt + 1 
       set stat = alterlist(format_text->output_string, format_text->output_string_cnt) 
       set format_text->output_string[format_text->output_string_cnt]->string = 
           substring(startSubStr, inputStrLen - startSubStr + 1, input_string) 
       set format_text->output_string[format_text->output_string_cnt]->
        x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
       set format_text->output_string[format_text->output_string_cnt]->bold = bold 
    endif 
 end 
   
 ;00000+ 
 ; - The input string should be a continuous string without newlines, carriage returns, or tabs. 
 ; - Since tabs do not have their own metrics data, use multiple spaces in their place. 
 ; - Breaks a given string into a list of strings that will fit within the given line length. 
 ;   It will break strings at the character level with no concern for words. 
 ; - If a string will have mixed bold and non-bold characters, mark the bold sections with the following; 
 ;   ascii char(187) '>>' to begin a bold section and char(171) '<<' to end a bold section 
 ;   The special characters will be removed from the string before being returned. 
 ; - Parameters: 
 ;   - input_string - the string to be wrapped 
 ;   - cpi - the cpi of the string when it is to be printed 
 ;   - line_width - the width of a line to contain the text within, given in points 
 ;   - bold_start - denotes if a string starts with bold or non-bold characters, 1 = bold, 0 = non-bold 
 subroutine CharacterWrapTimes(input_string, cpi, line_width, bold_start) 
    if(cpi > 0) 
       set fontPoints = floor((120.0 / cpi) + 0.5) 
    else 
       set fontPoints = 0 
    endif 
    set inputStrLen = textlen(input_string) 
    set widthLine = line_width * 1000 
    set widthTotal = 0 
    set widthWord = 0 
    set widthSpace = 0 
    set spaceCnt = 0 
    set endWord = 1 
    set startSubStr = 1 
    set endLastLine = 1 
    set endLastLinePts = 0 
    set state = 0 
    set bold = bold_start 
    set boldStart = 0 
    set nonBoldStart = 0 
    set format_text->output_string_cnt = 0 
   
    ; Check that line width is at least as large as the widest single character possible. 
    if(widthLine > (1015 * fontPoints) AND fontPoints <= 120) 
       set cnt = 1 
       while(cnt <= inputStrLen) 
          set asciiNum = ichar(substring(cnt, 1, input_string)) 
          ; Ignore non-printable characters and remove them from the string 
          if(asciiNum < 32 OR asciiNum > 253) 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             set cnt = cnt - 1 
          ; Check for the start of a bold segment (ascii char(187) '>>') 
          elseif(asciiNum = 187) 
             ; Remove the bold start signal character 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             ; Ignore the character if already in a bold segment. 
             if(bold = 0) 
                set boldStart = cnt 
                ; Store the previous non-bold text including ending spaces if there is any for this line. 
                if(widthTotal > 0) 
                   set endWord = cnt 
                   set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                   if(mod(format_text->output_string_cnt, 10) = 1) 
                      set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                   endif 
                   set format_text->output_string[format_text->output_string_cnt]->string = 
                       notrim(substring(startSubStr, endWord - startSubStr, input_string)) 
                   set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                   set format_text->output_string[format_text->output_string_cnt]->
                    x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
                   set endLastLinePts = widthTotal 
                   set startSubStr = cnt 
                endif 
                set bold = 1 
             endif 
             set cnt = cnt - 1 
          ; Check for the end of a bold segment (ascii char(171) '<<') 
          elseif(asciiNum = 171) 
             ; Remove the bold end signal character 
             set input_string = concat(substring(1, cnt - 1, input_string), 
                                                 substring(cnt + 1, inputStrLen - cnt, input_string)) 
             set inputStrLen = inputStrLen - 1 
             ; Ignore the character if already in a non-bold segment. 
             if(bold = 1) 
                set nonBoldStart = cnt 
                ; Store the previous bold text including ending spaces if there is any for this line. 
                if(widthTotal > 0) 
                   set endWord = cnt 
                   set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                   if(mod(format_text->output_string_cnt, 10) = 1) 
                      set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                   endif 
                   set format_text->output_string[format_text->output_string_cnt]->string = 
                       notrim(substring(startSubStr, endWord - startSubStr, input_string)) 
                   set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                   set format_text->output_string[format_text->output_string_cnt]->
                    x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
                   set endLastLinePts = widthTotal 
                   set startSubStr = cnt 
                endif 
                set bold = 0 
             endif 
             set cnt = cnt - 1 
          else 
             if(bold = 1) 
                set widthChar = fontPoints * metrics->Times_bold[asciiNum]->size 
             else 
                set widthChar = fontPoints * metrics->Times[asciiNum]->size 
             endif 
             if(widthChar = 0) 
                ; Ignore non-printable characters and remove them from the string 
                set input_string = concat(substring(1, cnt - 1, input_string), 
                                                    substring(cnt + 1, inputStrLen - cnt, input_string)) 
                set inputStrLen = inputStrLen - 1 
                set cnt = cnt - 1 
             else 
                if(widthTotal + widthChar >= widthLine) 
                   set endWord = cnt ; Marks the position after the last character in the last line. 
                   if(endWord - startSubStr > 0) 
                      ; Write the current substring to the output string list 
                      set format_text->output_string_cnt = format_text->output_string_cnt + 1 
                      if(mod(format_text->output_string_cnt, 10) = 1) 
                         set stat = alterlist(format_text->output_string, format_text->output_string_cnt + 9) 
                      endif 
                      if(endLastLinePts = 0) 
                         set format_text->output_string[format_text->output_string_cnt]->string = 
                             trim(substring(startSubStr, endWord - startSubStr, input_string),3) 
                      else 
                         set format_text->output_string[format_text->output_string_cnt]->string = 
                             substring(startSubStr, endWord - startSubStr, input_string) 
                      endif 
                      set format_text->output_string[format_text->output_string_cnt]->
                       x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
                      set format_text->output_string[format_text->output_string_cnt]->bold = bold 
                   endif 
                   set startSubStr = cnt 
                   set endLastLinePts = 0 
                   set widthTotal = widthChar 
                else 
                   set widthTotal = widthTotal + widthChar 
                endif 
             endif 
          endif 
          set cnt = cnt + 1 
       endwhile 
   
       ; Add the last line that fits in the given line length 
       set format_text->output_string_cnt = format_text->output_string_cnt + 1 
       set stat = alterlist(format_text->output_string, format_text->output_string_cnt) 
       set format_text->output_string[format_text->output_string_cnt]->string = 
           substring(startSubStr, inputStrLen - startSubStr + 1, input_string) 
       set format_text->output_string[format_text->output_string_cnt]->
        x_offset = floor(endLastLinePts / 1000.0 + 0.5) 
       set format_text->output_string[format_text->output_string_cnt]->bold = bold 
    endif 
 end 
 ;00000- 
 endif ; end check for re-inclusion of header file 
 
if (not validate(format_text_request, 0))
record format_text_request
(
  1  call_echo_ind                     = i2
  1  raw_text                          = vc
  1  temp_str                          = vc
  1  chars_per_line                    = i4
)
endif
 
if (not validate(format_text_reply, 0))
record format_text_reply
(
  1  beg_index                         = i4
  1  end_index                         = i4
  1  temp_index                        = i4
  1  qual_alloc                        = i4
  1  qual_cnt                          = i4
  1  qual [*]
     2  text_string                    = vc
)
endif

set format_text_reply->qual_cnt = 0
set format_text_reply->qual_alloc = 0

subroutine format_text (null_index)
 
   set format_text_request->raw_text = trim(format_text_request->raw_text,3)
   set text_length = textlen(format_text_request->raw_text)
   set format_text_request->temp_str = " "
   for (j_text = 1 to text_length)
      set temp_char = substring(j_text,1,format_text_request->raw_text)
      if (temp_char = " ")
         set temp_char = "^"
      endif
      set t_number = ichar(temp_char)
      if (t_number != 10 and t_number != 13)
         set format_text_request->temp_str = concat(format_text_request->temp_str,temp_char)
      endif
      if (t_number = 13)
         set format_text_request->temp_str = concat(format_text_request->temp_str,"^")
      endif
   endfor
 
   set format_text_request->temp_str = replace(format_text_request->temp_str,"^"," ",0)
   set format_text_request->raw_text = format_text_request->temp_str
 
   set format_text_reply->beg_index = 0
   set format_text_reply->end_index = 0
   set format_text_reply->qual_cnt = 0
   set text_len = textlen(format_text_request->raw_text)
 
   if (text_len > format_text_request->chars_per_line)
      while (text_len > format_text_request->chars_per_line)
         set wrap_ind = 0
         set format_text_reply->beg_index = 1
         while (wrap_ind = 0)
            set format_text_reply->end_index = findstring(" ",format_text_request->raw_text,format_text_reply->beg_index)
            if (format_text_reply->end_index = 0)
               set format_text_reply->end_index = format_text_request->chars_per_line + 10
            endif
            if ((format_text_reply->beg_index = 1) and (format_text_reply->end_index > format_text_request->chars_per_line))
               set format_text_reply->qual_cnt = format_text_reply->qual_cnt + 1
               if (format_text_reply->qual_cnt > format_text_reply->qual_alloc)
                  set format_text_reply->qual_alloc = format_text_reply->qual_alloc + 10
                  set stat = alterlist(format_text_reply->qual, format_text_reply->qual_alloc)
               endif
               set format_text_reply->qual[format_text_reply->qual_cnt]->text_string
                  = substring(1 ,format_text_request->chars_per_line , format_text_request->raw_text)
               set format_text_request->raw_text = substring(format_text_request->chars_per_line + 1 ,
                    text_len - format_text_request->chars_per_line, format_text_request->raw_text)
               set wrap_ind = 1
            elseif (format_text_reply->end_index > format_text_request->chars_per_line)
               set format_text_reply->qual_cnt = format_text_reply->qual_cnt + 1
               if (format_text_reply->qual_cnt > format_text_reply->qual_alloc)
                  set format_text_reply->qual_alloc = format_text_reply->qual_alloc + 10
                  set stat = alterlist(format_text_reply->qual, format_text_reply->qual_alloc)
               endif
               set format_text_reply->qual[format_text_reply->qual_cnt]->text_string
                  = substring(1 ,format_text_reply->beg_index - 1 , format_text_request->raw_text)
               set format_text_request->raw_text = substring(format_text_reply->beg_index ,
                  text_len - format_text_reply->beg_index + 1, format_text_request->raw_text)
               set wrap_ind = 1
            endif
            set format_text_reply->beg_index = format_text_reply->end_index + 1
         endwhile
         set text_len = textlen(format_text_request->raw_text)
      endwhile
      set format_text_reply->qual_cnt = format_text_reply->qual_cnt + 1
      if (format_text_reply->qual_cnt > format_text_reply->qual_alloc)
         set format_text_reply->qual_alloc = format_text_reply->qual_alloc + 10
         set stat = alterlist(format_text_reply->qual, format_text_reply->qual_alloc)
      endif
      set format_text_reply->qual[format_text_reply->qual_cnt]->text_string = format_text_request->raw_text
   else
      set format_text_reply->qual_cnt = format_text_reply->qual_cnt + 1
      if (format_text_reply->qual_cnt > format_text_reply->qual_alloc)
         set format_text_reply->qual_alloc = format_text_reply->qual_alloc + 10
         set stat = alterlist(format_text_reply->qual, format_text_reply->qual_alloc)
      endif
      set format_text_reply->qual[format_text_reply->qual_cnt]->text_string = format_text_request->raw_text
   endif
end
 
subroutine inc_format_text (null_index)
   set format_text_reply->qual_cnt = format_text_reply->qual_cnt + 1
   if (format_text_reply->qual_cnt > format_text_reply->qual_alloc)
      set format_text_reply->qual_alloc = format_text_reply->qual_alloc + 10
      set stat = alterlist(format_text_reply->qual, format_text_reply->qual_alloc)
   endif
end

if(validate(i18nuar_def, 999)=999)
   call echo("Declaring i18nuar_def")
   declare i18nuar_def = i2 with persist
   set i18nuar_def = 1



 declare uar_i18nlocalizationinit(p1=i4, p2=vc, p3=vc, p4=f8) = i4 with persist
 declare uar_i18ngetmessage(p1=i4, p2=vc, p3=vc) = vc with persist 
 declare uar_i18nbuildmessage() = vc with persist

   declare uar_i18nGetHijriDate (iMonth=i2(val),
                                 iDay=i2(val),
                                 iYear=i2(val),
                                 sDateFormatType=vc(ref)) = c50
   with image_axp="shri18nuar", 
        image_aix="libi18n_locale.a(libi18n_locale.o)",
        uar="uar_i18nGetHijriDate", persist

   declare uar_i18nBuildFullFormatName (sFirst=vc(ref),
                                        sLast=vc(ref),
                                        sMiddle=vc(ref),
                                        sDegree=vc(ref),
                                        sTitle=vc(ref),
                                        sPrefix=vc(ref),
                                        sSuffix=vc(ref),
                                        sInitials=vc(ref),
                                        sOriginal=vc(ref)) = c250
    with image_axp="shri18nuar",
         image_aix="libi18n_locale.a(libi18n_locale.o)",
         uar="i18nBuildFullFormatName", persist
   declare uar_i18nGetArabicTime (cTime=vc(ref)) = c20
    with image_axp="shri18nuar", 
         image_aix="libi18n_locale.a(libi18n_locale.o)",
         uar="i18n_GetArabicTime", persist
endif

set call_echo_ind = 0

free set t_time
record t_time
(
  1 calendar_dt_tm = dq8
  1 x_left_calendar = i4
  1 y_left_calendar = i4
  1 days_in_month = i4
  1 calendar_year = i2
  1 calendar_month = i2
  1 calendar_day_of_week = i4
  1 week_beg_dt_tm = dq8
  1 week_end_dt_tm = dq8
  1 temp_beg_dt_tm = dq8
  1 temp_end_dt_tm = dq8
  1 counter_dt_tm = dq8
  1 file_name = vc
  1 person_id = f8
  1 person_name = vc
  1 person_line_cnt = i4	;42500
  1 person_line_qual[*]		;42500
  	2 line_text = vc		;42500
  1 resource_cd = f8
  1 resource_disp = vc
  1 resource_desc = vc
  1 beg_dt_tm = dq8
  1 end_dt_tm = dq8
  1 report_title = vc
  1 nbr_of_days = i4
  1 nbr_of_weeks = i4
  1 beg_index = i4
  1 end_index = i4
  1 beg_trunc_ind = i2
  1 end_trunc_ind = i2
  1 t_string = vc
  1 week_string = c21
  1 temp = i4
  1 temp2 = i4
  1 temp_beg = i4
  1 temp_end = i4
  1 file_name = vc
  1 color = i4
  1 font = i4
  1 cpi = i4
  1 bold_ind = i4
  1 text = vc
  1 lpi = i4
  1 width_char = i4
  1 x_left = i4
  1 y_left = i4
  1 x_right = i4
  1 y_right = i4
  1 max_line_count = i4
  1 line_qual_cnt = i4
  1 blank_line = c100
  1 line_qual [*]
    2 appt_count = i4
    2 max_count = i4
    2 print_count = i4
    2 print_qual_cnt = i4
    2 print_qual [*]
      3 print_ind = i2
  1 event_qual_cnt = i4
  1 event_qual [*]
    2 sch_appt_id = f8
    2 sch_event_id = f8
    2 disp_qual_cnt = i4
    2 disp_qual [*]
      3 disp_value = vc
  1 day_qual_cnt = i4
  1 day_qual [*]
    2 appt_qual_cnt = i4
    2 appt_qual [*]
      3 event_qual_index = i4
      3 beg_tm = i4
      3 end_tm = i4
      3 appt_synonym_disp = vc
      3 multiple_ind = i2
)

set t_time->blank_line = fillstring(100," ")
set t_time->file_name = $1
set t_time->end_dt_tm = cnvtdatetime(build(substring(15,11,$2)," 00:00:00.00"))
set t_time->beg_dt_tm = cnvtdatetime(build(substring(15,11,$3)," 00:00:00.00"))
set t_time->person_id = cnvtreal(substring(15,size($4) - 14,$4))


/*****************************
* DATABASE SELECTION #1
******************************/
select into "nl:"
   a.name_full_formatted
from person a
plan a where 
   a.person_id = t_time->person_id
detail
   t_time->person_name = a.name_full_formatted
with nocounter

set t_time->resource_cd = 0


/*****************************
* DATABASE SELECTION #2
******************************/
select into "nl:"
   a.resource_cd 
from sch_resource a
plan a where 
   a.person_id = t_time->person_id
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
detail
   t_time->resource_cd = a.resource_cd
   t_time->resource_disp = uar_get_code_display(t_time->resource_cd)
with nocounter
 
;42500 if (size(t_time->person_name) > 30)
;   	 set t_time->person_name = concat(trim(substring(1,27,t_time->person_name)),"...")
;	   endif
 
 
;42500  Set up word wrap for appt.
											
	set format_text_request->raw_text = t_time->person_name			;42500
	set format_text_request->chars_per_line = 24				;42500
	call format_text(1)							;42500
	set t_time->person_line_cnt = format_text_reply->qual_cnt		;42500
 
	set stat = alterlist(t_time->person_line_qual,				;42500
        format_text_reply->qual_cnt)						;42500
    for (k = 1 to format_text_reply->qual_cnt)					;42500
       set t_time->person_line_qual[k]->line_text				;42500
          = format_text_reply->qual[k]->text_string				;42500
    endfor									;42500
 
set t_time->report_title = $5
set t_time->beg_dt_tm = datetimeadd(t_time->beg_dt_tm,
   -1.0 * evaluate(cnvtint(weekday(t_time->beg_dt_tm)),0,6,1,0,2,1,3,2,4,3,5,4,6,5))
set t_time->end_dt_tm = datetimeadd(t_time->end_dt_tm,
    evaluate(cnvtint(weekday(t_time->end_dt_tm)),0,1,1,7,2,6,3,5,4,4,5,3,6,2))
set t_time->nbr_of_days = datetimediff(t_time->end_dt_tm,t_time->beg_dt_tm)
set t_time->nbr_of_weeks = t_time->nbr_of_days / 7
set t_time->day_qual_cnt = t_time->nbr_of_days
set stat = alterlist(t_time->day_qual, t_time->day_qual_cnt)
for ( i = 1 to t_time->day_qual_cnt)
   set t_time->day_qual[t_time->day_qual_cnt]->appt_qual_cnt = 0
endfor

/*****************************
* DATABASE SELECTION #3
******************************/
select into "nl:"
   a.beg_dt_tm,
   e.appt_type_cd
from sch_appt a,
   sch_event e
plan a where
   cnvtdatetime(t_time->end_dt_tm) > a.beg_dt_tm
    and cnvtdatetime(t_time->beg_dt_tm) < a.end_dt_tm
    and a.person_id = t_time->person_id
    and a.resource_cd = t_time->resource_cd
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
    and a.state_meaning in ("CHECKED IN", "CHECKED OUT", "CONFIRMED","SCHEDULED")
    and a.role_meaning = "PATIENT"
    and a.active_ind = 1
join e where
   e.sch_event_id = a.sch_event_id
    and e.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
order by cnvtdatetime(a.beg_dt_tm), a.duration desc
detail
 t_granted = 0
 sch_security_id = 0.0 

 t_granted_loc = 0
 sch_security_id_loc = 0.0 
 
 ;check appt type
 t_granted = uar_sch_security_insert_ex2(reqinfo->updt_id, appttype_type_cd, e.appt_type_cd, 
                                         view_action_cd, 0.0, sch_security_id, reqinfo->position_cd) 

 if (sch_security_id = 0.0 and t_granted = 0)
  t_granted = uar_sch_security_perform()
  t_granted = uar_sch_check_security_ex2(reqinfo->updt_id, appttype_type_cd,      
                                         e.appt_type_cd, view_action_cd, 0.0, sch_security_id, 
                                         reqinfo->position_cd) 
 endif

 ;check appt location
 t_granted_loc = uar_sch_security_insert_ex2(reqinfo->updt_id, location_type_cd, a.appt_location_cd, 
                                         view_action_cd, 0.0, sch_security_id_loc, reqinfo->position_cd) 

 if (sch_security_id_loc = 0.0 and t_granted_loc = 0)
  t_granted_loc = uar_sch_security_perform()
  t_granted_loc = uar_sch_check_security_ex2(reqinfo->updt_id, location_type_cd,      
                                         a.appt_location_cd, view_action_cd, 0.0, sch_security_id_loc, 
                                         reqinfo->position_cd) 
 endif

 if (t_granted = 1 and t_granted_loc = 1) 
   t_time->event_qual_cnt = t_time->event_qual_cnt + 1
   if (mod(t_time->event_qual_cnt, 10) = 1)
      stat = alterlist(t_time->event_qual, t_time->event_qual_cnt + 9)
   endif
   t_time->event_qual[t_time->event_qual_cnt]->sch_appt_id = a.sch_appt_id
   t_time->event_qual[t_time->event_qual_cnt]->sch_event_id = a.sch_event_id
   t_time->event_qual[t_time->event_qual_cnt]->disp_qual_cnt = 0

   if (a.beg_dt_tm < t_time->beg_dt_tm)
      t_time->temp_beg_dt_tm = t_time->beg_dt_tm
      t_time->beg_trunc_ind = 1
   else
      t_time->temp_beg_dt_tm = a.beg_dt_tm
      t_time->beg_trunc_ind = 0
   endif
   if (a.end_dt_tm > t_time->end_dt_tm)
      t_time->temp_end_dt_tm = t_time->end_dt_tm
      t_time->end_trunc_ind = 1
   else
      t_time->temp_end_dt_tm = a.end_dt_tm
      t_time->end_trunc_ind = 0
   endif
   t_time->beg_index = cnvtint(datetimediff(t_time->temp_beg_dt_tm, t_time->beg_dt_tm)) + 1
   t_time->end_index = cnvtint(datetimediff(t_time->temp_end_dt_tm, t_time->beg_dt_tm)) + 1

   for (i = t_time->beg_index to t_time->end_index) 
      t_time->day_qual[i]->appt_qual_cnt = t_time->day_qual[i]->appt_qual_cnt + 1
      if (mod(t_time->day_qual[i]->appt_qual_cnt,10) = 1)
         stat = alterlist(t_time->day_qual[i]->appt_qual, t_time->day_qual[i]->appt_qual_cnt + 9)
      endif
      t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->event_qual_index
         = t_time->event_qual_cnt
      if (t_time->beg_trunc_ind = 1
       or i > t_time->beg_index)
         t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->beg_tm = -1
      else
         t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->beg_tm
            = cnvtint(format(t_time->temp_beg_dt_tm,"hhmm;;mtime"))
      endif
      if (t_time->end_trunc_ind = 1
       or i < t_time->end_index)
         t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->end_tm = -1
      else
         t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->end_tm
            = cnvtint(format(t_time->temp_end_dt_tm,"hhmm;;mtime"))
      endif
      if (t_time->beg_trunc_ind = 1 or t_time->end_trunc_ind = 1 or t_time->beg_index != t_time->end_index)
         t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->multiple_ind = 1
      else
         t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->multiple_ind = 0
      endif
      t_time->day_qual[i]->appt_qual[t_time->day_qual[i]->appt_qual_cnt]->appt_synonym_disp
         = uar_get_code_display(e.appt_synonym_cd)
   endfor
   t_time->event_qual[t_time->event_qual_cnt]->disp_qual_cnt
      = t_time->event_qual[t_time->event_qual_cnt]->disp_qual_cnt + 1
   if (mod(t_time->event_qual[t_time->event_qual_cnt]->disp_qual_cnt,10) = 1)
      stat = alterlist(t_time->event_qual[t_time->event_qual_cnt]->disp_qual,
         t_time->event_qual[t_time->event_qual_cnt]->disp_qual_cnt + 9)
   endif
   t_time->event_qual[t_time->event_qual_cnt]->disp_qual[t_time->event_qual[t_time->event_qual_cnt]->disp_qual_cnt]->disp_value
      = uar_get_code_display(e.appt_synonym_cd)
 endif
with nocounter

call echo (build("   t_time->file_name = ", t_time->file_name)) 
call echo (build("   t_time->beg_dt_tm = ", format(t_time->beg_dt_tm,";;q")))
call echo (build("   t_time->end_dt_tm = ", format(t_time->end_dt_tm,";;q")))
call echo (build("   t_time->resource_cd = ", t_time->resource_cd))
call echo (build("   t_time->report_title = ", t_time->report_title))
call echo (build("   t_time->nbr_of_days = ", t_time->nbr_of_days))
call echo (build("   t_time->nbr_of_weeks = ", t_time->nbr_of_weeks))
for (i = 1 to t_time->event_qual_cnt)
   call echo (build("   t_time->event_qual[",i,"]->sch_event_id = ",
      t_time->event_qual[i]->sch_event_id))
   call echo (build("   t_time->event_qual[",i,"]->sch_appt_id = ",
      t_time->event_qual[i]->sch_appt_id))
   call echo (build("   t_time->event_qual[",i,"]->disp_qual_cnt = ",
      t_time->event_qual[i]->disp_qual_cnt))
   for (j = 1 to t_time->event_qual[i]->disp_qual_cnt)
      call echo (build("      t_time->event_qual[",i,",",j,"]->disp_value = ",
         t_time->event_qual[i]->disp_qual[j]->disp_value))
   endfor
endfor
for (i = 1 to t_time->day_qual_cnt)
   call echo (build("   t_time->day_qual[",i,"]->appt_qual_cnt = ", t_time->day_qual[i]->appt_qual_cnt))
   for (j = 1 to t_time->day_qual[i]->appt_qual_cnt)
      call echo (build("      t_time->day_qual[",i,",",j,"]->event_qual_index = ",
         t_time->day_qual[i]->appt_qual[j]->event_qual_index))
      call echo (build("      t_time->day_qual[",i,",",j,"]->beg_tm = ",
         t_time->day_qual[i]->appt_qual[j]->beg_tm))
      call echo (build("      t_time->day_qual[",i,",",j,"]->end_tm = ",
         t_time->day_qual[i]->appt_qual[j]->end_tm))
      call echo (build("      t_time->day_qual[",i,",",j,"]->appt_synonym_disp = ",
         t_time->day_qual[i]->appt_qual[j]->appt_synonym_disp))
      call echo (build("      t_time->day_qual[",i,",",j,"]->multiple_ind = ",
         t_time->day_qual[i]->appt_qual[j]->multiple_ind))
      if (j < t_time->day_qual[i]->appt_qual_cnt)
         call echo (" ")
      endif
   endfor
endfor


/*****************************
* FINAL DATABASE SELECTION (#4)
******************************/
select into value(t_time->file_name)
   d.seq
from dummyt d
plan d where d.seq = 1


/************************************
* Report Writer Section
*************************************/
head report
   macro (INIT_IPC)
      t_time->t_string = "{IPC}"
      row + 1,
      col 0, t_time->t_string
   endmacro
   macro (SET_FONT)
      t_time->t_string = build("{F/",t_time->font,"}{CPI/",t_time->cpi,"}{LPI/",t_time->lpi,"}")
      row + 1,
      col 0, t_time->t_string
   endmacro
   macro (DRAW_BOX2)
      t_time->t_string = build("{CPI/72}{LPI/72}",
         "{POS/",t_time->x_left + 1,"/",t_time->y_left,"}",
         evaluate(t_time->color,0," ",build("{COLOR/",t_time->color,"}")),
         "{BOX/",t_time->x_right - t_time->x_left - 1,"/",t_time->y_right - t_time->y_left - 1,"}",
         evaluate(t_time->color,0," ",build("{COLOR/31}{LINE}")),
         "{F/",t_time->font,"}{CPI/",t_time->cpi,"}{LPI/",t_time->lpi,"}")
      row + 1,
      col 0, t_time->t_string
   endmacro                      
   macro (DRAW_LINE)
      t_time->t_string = build("{CPI/72}{LPI/72}",
         "{POS/",t_time->x_left + 1,"/",t_time->y_left + 3,"}",
         "{HB/",t_time->width_char,"}",
         "{F/",t_time->font,"}{CPI/",t_time->cpi,"}{LPI/",t_time->lpi,"}")
      row + 1,   
      col 0, t_time->t_string
   endmacro
   macro (DRAW_TEXT)                             
      t_time->t_string = build("{POS/",t_time->x_left + 1,"/",t_time->y_left,"}",
         evaluate(t_time->color,0," ",build("{COLOR/",t_time->color,"}")),
         evaluate(t_time->bold_ind,1,"{BOLD}"," "),
         t_time->text,
         evaluate(t_time->bold_ind,1,"{ENDB}"," "))
      row + 1,
      col 0, t_time->t_string
   endmacro
   macro (DRAW_TEXT2)                             
      t_time->t_string = build("{F/",t_time->font,"}",t_time->text)
      t_time->t_string
   endmacro
   macro (SET_POS)                             
      t_time->t_string = build("{POS/",t_time->x_left + 1,"/",t_time->y_left,"}")
      row + 1,
      col 0, t_time->t_string
   endmacro
   macro (DRAW_PAGE)
      t_time->t_string = build("{POS/",t_time->x_left + 1,"/",t_time->y_left,"}{PAGE}")
      row + 1,
      col 0, t_time->t_string
   endmacro

   macro (DRAW_CALENDAR)
      t_time->calendar_month = cnvtint(format(t_time->calendar_dt_tm,"MM;;DATE"))
      t_time->calendar_year = cnvtint(format(t_time->calendar_dt_tm,"YYYY;;DATE"))   
      t_time->calendar_dt_tm = cnvtdatetime(concat("01",format(t_time->calendar_dt_tm,"-MMM-YYYY 00:00:00.00;;DATE")))
      DRAW_MONTH

      t_time->x_left_calendar = t_time->x_left_calendar + (72 * 1.75)
      if (t_time->calendar_month = 12)
         t_time->calendar_month = 1
         t_time->calendar_year = t_time->calendar_year + 1
      else
         t_time->calendar_month = t_time->calendar_month + 1
      endif
      t_time->text = concat("01-",
         evaluate(t_time->calendar_month,1,"JAN",2,"FEB",3,"MAR",4,"APR",5,"MAY",6,
            "JUN",7,"JUL",8,"AUG",9,"SEP",10,"OCT",11,"NOV",12,"DEC","JAN"),
         "-",
         format(t_time->calendar_year,"####;p0"),
         " 00:00:00.00")
      t_time->calendar_dt_tm = cnvtdatetime(t_time->text)
      DRAW_MONTH
   endmacro

   macro (DRAW_MONTH)
      t_time->cpi = 15  
      t_time->lpi = 8
      t_time->font = 0
      SET_FONT
  
; 002      t_time->text = trim(format(t_time->calendar_dt_tm, "mmmmmmmmm yyyy;;date"),3)
      t_time->text = trim(format(t_time->calendar_dt_tm, "yyyy;;date"),3)
      t_time->text = concat(trim(format(t_time->calendar_dt_tm, "@MONTHNAME"),3),t_time->text)
          
      t_time->text = concat(substring(1,(22 - size(t_time->text))/2,t_time->blank_line),t_time->text)
      t_time->x_left = t_time->x_left_calendar
      t_time->y_left = t_time->y_left_calendar
      t_time->color = 0
      DRAW_TEXT

      ; Draw the day_of_week banner.
      t_time->text = "  S  M  T  W  T  F  S"
      t_time->x_left = t_time->x_left_calendar
      t_time->y_left = t_time->y_left_calendar + (72 * 0.20)
      t_time->color = 0
      DRAW_TEXT

      t_time->x_left = t_time->x_left_calendar 
      t_time->y_left = t_time->y_left_calendar + (72 * 0.20)
      t_time->width_char = 100
      DRAW_LINE

      case (t_time->calendar_month)
         of 01:
            t_time->days_in_month = 31
         of 02:
            if (mod(t_time->calendar_year,4) = 0)
               if (mod(t_time->calendar_year,1000) = 0)
                  t_time->days_in_month = 29
               else
                  if (mod(t_time->calendar_year,100) = 0)
                     t_time->days_in_month = 28
                  else
                     t_time->days_in_month = 29
                  endif
               endif
            else
               t_time->days_in_month = 28
            endif
         of 03:
            t_time->days_in_month = 31
         of 04:
            t_time->days_in_month = 30
         of 05:
            t_time->days_in_month = 31
         of 06:
            t_time->days_in_month = 30
         of 07:
            t_time->days_in_month = 31
         of 08:
            t_time->days_in_month = 31
         of 09:
            t_time->days_in_month = 30
         of 10:
            t_time->days_in_month = 31
         of 11:
            t_time->days_in_month = 30
         of 12:
            t_time->days_in_month = 31
      endcase
      t_time->calendar_day_of_week
         = weekday(cnvtdate2(concat(format(t_time->calendar_month,"##;p0"),"01",format(t_time->calendar_year,"####;p0")),
         "MMDDYYYY"))
                     
      t_time->cpi = 15
      t_time->lpi = 8
      t_time->font = 0
      SET_FONT

      t_time->x_left = t_time->x_left_calendar
      t_time->y_left = t_time->y_left_calendar + (72 * 0.325)
      SET_POS
      for (i_cal = 1 to t_time->days_in_month)
         t_time->calendar_day_of_week = t_time->calendar_day_of_week + 1
         if (i_cal = 1)
            t_time->text
               = concat(substring(1,(t_time->calendar_day_of_week - 1) * 3,t_time->blank_line),format(i_cal," ##;r"))
         else
            t_time->text = format(i_cal," ##;r")
         endif
         t_time->font = evaluate(t_time->calendar_day_of_week,2,0,3,0,4,0,5,0,6,0,0)
         DRAW_TEXT2
         if (t_time->calendar_day_of_week = 7)
            t_time->calendar_day_of_week = 0
            t_time->y_left = t_time->y_left + (72 * 0.125)
            SET_POS
         endif
      endfor
   endmacro
   t_time->counter_dt_tm = t_time->beg_dt_tm
   INIT_IPC
head page
   t_time->cpi = 12
   t_time->lpi = 8
   t_time->font = 0
   SET_FONT
      
   ; Draw the patient banner
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 0.25)
   t_time->x_right = t_time->x_left + (72.0 * 7.5) 
   t_time->y_right = t_time->y_left + (72.0 * 1.25) - 3
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Monday' Box
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 1.5)
   t_time->x_right = (72.0 * 4.25)
   t_time->y_right = (72.0 * 1.75)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Tuesday' Box
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 4.5)
   t_time->x_right = (72.0 * 4.25)
   t_time->y_right = (72.0 * 4.75)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Wednesday' Box
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 7.5)
   t_time->x_right = (72.0 * 4.25)
   t_time->y_right = (72.0 * 7.75)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Thursday' Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 1.5)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 1.75)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Friday' Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 4.5)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 4.75)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Saturday' Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 7.5)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 7.75)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Sunday' Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 9.0)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 9.25)
   t_time->color = 30
   DRAW_BOX2
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Monday' Big Box
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 1.5)
   t_time->x_right = (72.0 * 4.25)
   t_time->y_right = (72.0 * 4.5)
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Tuesday' Big Box
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 4.5)
   t_time->x_right = (72.0 * 4.25)
   t_time->y_right = (72.0 * 7.5)
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Wednesday' Big Box
   t_time->x_left = (72.0 * 0.5)
   t_time->y_left = (72.0 * 7.5)
   t_time->x_right = (72.0 * 4.25)
; 003 t_time->y_right = (72.0 * 10.5)
   t_time->y_right = (72.0 * 10.46)                                                                                   ;003  
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Thursday' Big Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 1.5)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 4.5)
   t_time->color = 31
   DRAW_BOX2

   ; Draw the 'Friday' Big Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 4.5)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 7.5)
   t_time->color = 31               
   DRAW_BOX2

   ; Draw the 'Saturday' Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 7.5)
   t_time->x_right = (72.0 * 8.0)
   t_time->y_right = (72.0 * 9.0)
   t_time->color = 31
   DRAW_BOX2
   
   ; Draw the 'Sunday' Box
   t_time->x_left = (72.0 * 4.25)
   t_time->y_left = (72.0 * 9.0)
   t_time->x_right = (72.0 * 8.0)
; 003 t_time->y_right = (72.0 * 10.5)
   t_time->y_right = (72.0 * 10.46)                                                                                   ;003
   
   t_time->color = 31
   DRAW_BOX2

   t_time->calendar_dt_tm = t_time->counter_dt_tm
   t_time->x_left_calendar = (72 * 4.5)
   t_time->y_left_calendar = (72 * 0.5)
   DRAW_CALENDAR
                               
   t_time->cpi = 15
   t_time->lpi = 8
   t_time->font = 4
   SET_FONT  

   ;Display the Resource Desc
   t_time->x_left = (72 * 0.5)
;003 t_time->y_left = (72.0 * 10.65)
   t_time->y_left = (72.0 * 10.59)                                                                                    ;003
   t_time->text = t_time->person_name
   DRAW_TEXT

   ;Display the Current Date
   t_time->x_left = (72 * 7.5)
;003 t_time->y_left = (72.0 * 10.65) 
    t_time->y_left = (72.0 * 10.59)                                                                                   ;003
; 002   t_time->text = format(curdate,"MM/DD/YYYY;;DATE")
   t_time->text = format(curdate, "@SHORTDATE")
   DRAW_TEXT

   ;Display the Page Number
   t_time->x_left = (72 * 4.125)
;003 t_time->y_left = (72.0 * 10.65)
   t_time->y_left = (72.0 * 10.59)                                                                                    ;003
   DRAW_PAGE

   t_time->cpi = 6
   t_time->lpi = 8
   t_time->font = 4
   SET_FONT  

   ;Display the Resource Mnem
   ;42500 dependent upon person_line_cnt
   case (t_time->person_line_cnt) 						;42500
	   of 1:								;42500
	   		t_time->x_left = (72 * 0.75) + 3 			;42500
	   		t_time->y_left = (72.0 * 0.75)			        ;42500
	   of 2:								;42500
	   		t_time->x_left = (72 * 0.75) + 3			;42500
	   		t_time->y_left = (72.0 * 0.70)				;42500
	   else									;42500
	   		t_time->x_left = (72 * 0.55) 			        ;42500
	   		t_time->y_left = (72.0 * 0.55)				;42500
   endcase									;42500
 
 
;42500 Display patient on multiple lines if needed
;63289   for (i=1 to t_time->person_line_cnt)				        ;42500
;63289   	t_time->text = t_time->person_line_qual[i]->line_text		;42500
   for (i_line = 1 to t_time->person_line_cnt)                                  ;63289
        t_time->text = t_time->person_line_qual[i_line]->line_text              ;63289
   	DRAW_TEXT								;42500
   	t_time->y_left = t_time->y_left + 19				        ;42500
   endfor								        ;42500
 
   t_time->cpi = 8
   t_time->lpi = 8
   t_time->font = 4
   SET_FONT  

   ;Display the Date Range
   ;42500 dependent upon person_line_cnt
   case (t_time->person_line_cnt) 						;42500
	   of 1:								;42500
	   		t_time->x_left = (72 * 0.75) + 3			;42500
	   		t_time->y_left = (72.0 * 1.25)				;42500
	   of 2:								;42500
	   		t_time->x_left = (72 * 0.75) + 3			;42500
	   		t_time->y_left = (72.0 * 1.30)				;42500
	   else									;42500
	   		t_time->x_left = (72 * 0.55) 				;42500
	   		t_time->y_left = (72.0 * 1.4)  				;42500
   endcase									;42500
 
   ;t_time->x_left = (72 * 0.75) + 3
   ;t_time->y_left = (72.0 * 1.25)
   t_time->text = concat(trim(format(t_time->counter_dt_tm,"mmmmmmmmm dd;;date"),3),
      " - ",
      trim(format(datetimeadd(t_time->counter_dt_tm,6),"mmmmmmmmm dd;;date"),3))
   DRAW_TEXT

   ; Print the Date on the boxes
   t_time->cpi = 8
   t_time->lpi = 8
   t_time->font = 4
   SET_FONT  
   for (t_i = 1 to 7)
      t_time->temp_beg_dt_tm = datetimeadd(t_time->counter_dt_tm, t_i - 1)

      if (call_echo_ind = 1)
         call echo (build(" t_time->counter_dt_tm = ",format(t_time->counter_dt_tm,";;q")))
         call echo (build(" t_time->temp_beg_dt_tm = ",format(t_time->temp_beg_dt_tm,";;q")))
      endif

      t_time->text = concat(trim(format(t_time->temp_beg_dt_tm, "wwwwwwwww;;date"),3),
         ", ",
         trim(format(t_time->temp_beg_dt_tm, "mmmmmmmmm;;date"),3),
         " ",
         format(t_time->temp_beg_dt_tm, "dd;;date"))
      case (t_i)
         of 7:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72.0 * 9.25)
            t_time->color = 0
            DRAW_TEXT
         of 1:
            t_time->x_left = (72 * 0.5) + 3 
            t_time->y_left = (72.0 * 1.75)
            t_time->color = 0
            DRAW_TEXT
         of 2:
            t_time->x_left = (72 * 0.5) + 3
            t_time->y_left = (72.0 * 4.75)
            t_time->color = 0
            DRAW_TEXT
         of 3:
            t_time->x_left = (72 * 0.5) + 3
            t_time->y_left = (72.0 * 7.75)
            t_time->color = 0
            DRAW_TEXT
         of 4:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72.0 * 1.75)
            t_time->color = 0
            DRAW_TEXT
        of 5:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72.0 * 4.75)
            t_time->color = 0
            DRAW_TEXT
        of 6:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72.0 * 7.75)
            t_time->color = 0
            DRAW_TEXT
      endcase
   endfor
detail       
   for (i = 1 to t_time->day_qual_cnt)
      case (weekday(t_time->counter_dt_tm))
         of 1:
            t_time->x_left = (72 * 0.5) + 3
            t_time->y_left = (72 * 1.75) + 3 
            t_time->max_line_count = 17
         of 2:
            t_time->x_left = (72 * 0.5) + 3
            t_time->y_left = (72 * 4.75) + 3 
            t_time->max_line_count = 17
         of 3:
            t_time->x_left = (72 * 0.5) + 3
            t_time->y_left = (72 * 7.75) + 3 
            t_time->max_line_count = 17
         of 4:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72 * 1.75) + 3 
            t_time->max_line_count = 17
         of 5:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72 * 4.75) + 3 
            t_time->max_line_count = 17
         of 6:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72 * 7.75) + 3 
            t_time->max_line_count = 7
         of 0:
            t_time->x_left = (72 * 4.25) + 3
            t_time->y_left = (72 * 9.25) + 3
            t_time->max_line_count = 7
      endcase
      t_time->temp = t_time->x_left
      t_time->temp2 = t_time->y_left
      for (t_j = 1 to minval(t_time->max_line_count, t_time->day_qual[i]->appt_qual_cnt))
         t_time->cpi = 12                   
         t_time->lpi = 8
         t_time->font = evaluate(t_time->day_qual[i]->appt_qual[t_j]->multiple_ind,1,7,4)
         SET_FONT

         t_time->color = 0
         t_time->x_left = t_time->temp
         t_time->y_left = t_time->temp2 + (72 * 0.15 * t_j)

         if (t_time->day_qual[i]->appt_qual[t_j]->beg_tm < 0)
            t_time->text = "<cont>"
         elseif (t_time->day_qual[i]->appt_qual[t_j]->beg_tm > 1159)
            t_time->text = format(t_time->day_qual[i]->appt_qual[t_j]->beg_tm, "@TIMENOSECONDS;;MTIME")
         else
            t_time->text = format(t_time->day_qual[i]->appt_qual[t_j]->beg_tm, "@TIMENOSECONDS;;MTIME")
         endif
         DRAW_TEXT

         t_time->x_left = t_time->x_left + (72 * 0.625)
         if (t_time->day_qual[i]->appt_qual[t_j]->end_tm < 0)
            t_time->text = "<cont>"
         elseif (t_time->day_qual[i]->appt_qual[t_j]->end_tm > 1159)
            t_time->text = format(t_time->day_qual[i]->appt_qual[t_j]->end_tm, "@TIMENOSECONDS;;MTIME")
         else
            t_time->text = format(t_time->day_qual[i]->appt_qual[t_j]->end_tm, "@TIMENOSECONDS;;MTIME")
         endif
         DRAW_TEXT

         t_time->x_left = t_time->x_left + (72 * 0.625)
         t_time->text = t_time->day_qual[i]->appt_qual[t_j]->appt_synonym_disp
;42500   ;if (t_time->event_qual[t_time->day_qual[i]->appt_qual[t_j]->event_qual_index]->disp_qual_cnt > 0)
         ;   t_time->text = t_time->event_qual[t_time->day_qual[i]->appt_qual[t_j]->event_qual_index]->disp_qual[1]->disp_value
         ;endif
;42500 truncate appt if needed.
         call CharacterWrapTimes(t_time->text, 15, 140, 0)				;42500
         if (format_text->output_string_cnt <= 1)					;42500
         	t_time->text = format_text->output_string[1]->string			;42500
         	DRAW_TEXT								;42500
         else										;42500
            call CharacterWrapTimes(format_text->output_string[1]->string, 15, 137, 0)	;42500
            t_time->text = build(format_text->output_string[1]->string,"...")		;42500
            DRAW_TEXT									;42500
         endif						    				;42500
 
      endfor
      if (t_time->day_qual[i]->appt_qual_cnt > t_time->max_line_count)
         t_time->cpi = 12                   
         t_time->lpi = 8
         t_time->font = 7
         SET_FONT

         t_time->x_left = t_time->temp + (72 * 1.375)
         t_time->y_left = t_time->temp2 + (72 * 0.15 * (t_time->max_line_count + 1))
         t_time->text = "<* continued *>"
         DRAW_TEXT
      endif
      t_time->counter_dt_tm = datetimeadd(t_time->counter_dt_tm,1)

      if (i < t_time->day_qual_cnt and mod(i,7) = 0)
         row + 1,
         col 0, "{NP}"
         break
      endif
   endfor
with nocounter, dio=postscript,noformfeed,maxrow=1,maxcol=300
   
#exit_script
   free set t_time
end go   
