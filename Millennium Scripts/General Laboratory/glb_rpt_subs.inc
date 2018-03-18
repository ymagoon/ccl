 ;;Solution_Test/script/PathNet -- Gen Lab/glb_rpt_subs/glb_rpt_subs.inc Turn on black mode

/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1996 Cerner Corporation                 *
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
 
        Source file name:       GLB_RPT_SUBS.INC
        Object name:            n/a
        Request #:              n/a
 
        Product:                General Lab
        Product Team:           GLB
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Set of subroutines common to the report-
                                generating CCL scripts
 
        Tables read:            code_value
 
        Tables updated:         n/a
 
        Executing from:         General Lab daily reports, worklist request
 
        Special Notes:          n/a
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 10/29/96 Newton Hughes        Initial Release                     *
;     001 09/19/97 Gayla Benson         Add linear and feasible flags       *
;     002 01/05/98 Kurt Gugler          new routine to blank out line data  *
;     003 07/28/08 Rahul Deshmukh       Added interp text flag              *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
      /***********************************************************************
      * Record Structures                                                    *
      ***********************************************************************/
 
      ;* Array containing the most recent result comments and notes
      record r_comments
      (
         1  qual[20]
            2  order_id                  = f8
            2  task_assay_cd             = f8
            2  result_id                 = f8
            2  comment_exists            = c1
            2  comment_text              = vc
            2  note_exists               = c1
            2  note_text                 = vc
            2  long_text_id              = f8
      )
 
      ;* Array containing the most recent order comments and notes
      record o_comments
      (
         1  qual[20]
            2  order_id                  = f8
            2  comment_exists            = c1
            2  comment_text              = vc
            2  note_exists               = c1
            2  note_text                 = vc
            2  long_text_id              = f8
      )
 
      ;* Array containing the most recent patient comments
      record p_comments
      (
         1  qual[20]
            2  person_id                 = f8
            2  comment_exists            = c1
            2  comment_text              = vc
            2  long_text_id              = f8
      )
 
      ;* List of parameters passed in from operations
      record ops_params
      (
         1  qual[3]
            2  param                     = c100
      )
 
      ;* Buffer filled with info waiting to be printed
      record report_data
      (
         1  qual[20]
            2  printline                 = c130
            2  detailcount               = i4
      )
 
      /***********************************************************************
      * Variable Declarations                                                *
      ***********************************************************************/
         set nitems = 20   ; nbr of rows allocated to report_data array
         set limit = 0     ; highest row in report_data array currently in use
         set blank_line = fillstring(130, " ")
         record vcstring
         (
            1  text                       = vc
         )
 
         ;* Data used to format a numeric result
         record formatted
         (
            01  template     = c33
            01  negative_ind = i2
            01  digits       = i4
            01  result_value = c100
         )
         set arg_min_digits = 0
         set arg_max_digits = 0
         set arg_min_dec_places = 0
         set arg_less_great_flag = 0
         set arg_raw_value = 0.0
 
	 declare uar_fmt_result(min, max, dec, flag, result) = c50	;jdf
 
      /***********************************************************************
      * Clear Report_Data Subroutine                                         *
      ***********************************************************************/
         ;* Fill all rows of report_data array with the fill character passed
         ;* in, clear detailcount field to 0, and reset limit to show no rows
         ;* in use.
 
         subroutine clear_report_data(fillchar)
            set fill_line = fillstring(130, fillchar)
            for (r = 1 to nitems)
;002               call store_item(0, r, fill_line)
               call blank_item(0, r, fill_line)                            ;002
               set report_data->qual[r]->detailcount = 0
            endfor
            set limit = 0
         end
 
      /***********************************************************************
      * Store Varchar Item Subroutine                                        *
      ***********************************************************************/
         ;* Store a varchar as a series of substrings on adjacent rows of
         ;* report_data array.
         declare store_varchar_item(startrow,
                                    startcol,
                                    maxperrow,
                                    linespace) = i4
 
         subroutine store_varchar_item(startrow,
                                       startcol,
                                       maxperrow,
                                       linespace)
            set HT                   = 9            ;Horizontal Tab
            set LF                   = 10           ;Line Feed
            set FF                   = 12           ;Form Feed
            set CR                   = 13           ;Carriage Return
            set SPACES               = 32           ;Space
            set curr_row = startrow                 ;Current row
            set start_col = startcol                ;Starting column
            set end_col = startcol + maxperrow - 1  ;Ending column
            set start_pos = 0                       ;Start position
            set last_space_pos = 0                  ;Last space found position
            set text_len = 0                        ;Text length
            set text_parse = fillstring(130, " ")   ;Text parse of vcstring
            set ptr = 1                             ;Pointer
            set max_text_len = size(trim(vcstring->text),3) ;Max text length
            while (ptr <= max_text_len)
               set text_char = substring(ptr, 1, vcstring->text)
 
               ;* Process a single character of the text.
               if (ichar(text_char) < SPACES)
                  ;* Character is a special control character.
                  ;* Check for Carriage Return, Form Feed, or Line Feed
                  if (ichar(text_char) = CR
                  or  ichar(text_char) = FF
                  or  ichar(text_char) = LF)
                     if (start_pos > 0)
                        ;* Store item
                        set text_parse =
                          substring(start_pos, text_len, vcstring->text)
                        ;* Allocate more rows in report_data if needed
                        while (nitems < curr_row)
                           set nitems = nitems + 1
                           set stat = alter(report_data->qual, nitems)
                           set move_len = movestring(blank_line, 1,
                             report_data->qual[nitems].printline, 1, 130)
                        endwhile
                        ;* Store text_parse
                        set move_len = movestring(text_parse, 1,
                          report_data->qual[curr_row].printline,
                          start_col + 1, text_len)
                        if (curr_row > limit)
                           set limit = curr_row
                        endif
                     else
                        ;* Only special control characters have been found
                        ;* print a space and increment the row.
 
                        ;* Allocate more rows in report_data if needed
                        while (nitems < curr_row)
                           set nitems = nitems + 1
                           set stat = alter(report_data->qual, nitems)
                           set move_len = movestring(blank_line, 1,
                             report_data->qual[nitems].printline, 1, 130)
                        endwhile
                        ;* Store space
                        set move_len = movestring(" ", 1,
                          report_data->qual[curr_row].printline,
                          start_col + 1, 1)
                        if (curr_row > limit)
                           set limit = curr_row
                        endif
                     endif
                     ;* If character is a carriage return and the
                     ;* following character is a line feed, skip the
                     ;* line feed.
                     if (ichar(text_char) = CR)
                        set text_char = substring(ptr + 1, 1, vcstring->text)
                        if (ichar(text_char) = LF)
                           set ptr = ptr + 1
                        endif
                     endif
                     set curr_row = curr_row + linespace
                     set start_col = startcol
                     set start_pos = 0
                     set last_space_pos = 0
                     set text_len = 0
                     set text_parse = fillstring(130, " ")
                  endif
                  ;* Character is a special character.
                  ;* Check all other control characters and replace
                  ;* character with a space in its place.
                  if (ichar(text_char) != CR
                  and ichar(text_char) != FF
                  and ichar(text_char) != LF)
                     if (text_len > 0)
                        ;* Store item
                        set text_parse =
                          substring(start_pos, text_len, vcstring->text)
                        ;* Allocate more rows in report_data if needed
                        while (nitems < curr_row)
                           set nitems = nitems + 1
                           set stat = alter(report_data->qual, nitems)
                           set move_len = movestring(blank_line, 1,
                             report_data->qual[nitems].printline, 1, 130)
                        endwhile
                        ;* Store text_parse
                        set move_len = movestring(text_parse, 1,
                          report_data->qual[curr_row].printline,
                          start_col + 1, text_len)
                        if (curr_row > limit)
                           set limit = curr_row
                        endif
                        ;* Update starting column.
                        set start_col = startcol + text_len
                     endif
                     ;* Check for tab character
                     if (ichar(text_char) = HT)
                        set start_col = start_col + 8
                     else
                        set start_col = start_col + 1
                     endif
                     if (start_col >= end_col)
                        set curr_row = curr_row + linespace
                        set start_col = startcol
                     endif
                     set start_pos = ptr + 1
                     set last_space_pos = 0
                     set text_len = 0
                     set text_parse = fillstring(130, " ")
                  endif
               endif
 
               ;* Check for printable characters.
               if (ichar(text_char) >= SPACES)
                  if (start_pos = 0)
                     set start_pos = ptr
                  endif
                  if (ichar(text_char) = SPACES)
                     set last_space_pos = ptr
                  endif
                  set text_len = text_len + 1
                  ;* Check for end of line and increment the row.
                  if ((start_col + text_len) >= end_col)
                     if (last_space_pos > 0)
                        set text_len = (last_space_pos - start_pos) + 1
                        set ptr = last_space_pos
                     endif
                     ;* Store item
                     set text_parse =
                       substring(start_pos, text_len, vcstring->text)
                     ;* Allocate more rows in report_data if needed
                     while (nitems < curr_row)
                        set nitems = nitems + 1
                        set stat = alter(report_data->qual, nitems)
                        set move_len = movestring(blank_line, 1,
                          report_data->qual[nitems].printline, 1, 130)
                     endwhile
                     ;* Store text_parse
                     set move_len = movestring(text_parse, 1,
                       report_data->qual[curr_row].printline,
                       start_col + 1, text_len)
                     if (curr_row > limit)
                        set limit = curr_row
                     endif
 
                     set curr_row = curr_row + linespace
                     set start_col = startcol
                     set start_pos = 0
                     set last_space_pos = 0
                     set text_len = 0
                     set text_parse = fillstring(130, " ")
                  endif
               endif
               set ptr = ptr + 1
            endwhile
 
            ;* Check for training text and print.
            if (text_len > 0)
               set text_parse =
                 substring(start_pos, text_len, vcstring->text)
               ;* Store item
               ;* Allocate more rows in report_data if needed
               while (nitems < curr_row)
                  set nitems = nitems + 1
                  set stat = alter(report_data->qual, nitems)
                  set move_len = movestring(blank_line, 1,
                    report_data->qual[nitems].printline, 1, 130)
               endwhile
               ;* Store text_parse
               set move_len = movestring(text_parse, 1,
                 report_data->qual[curr_row].printline,
                 start_col + 1, text_len)
               if (curr_row > limit)
                  set limit = curr_row
               endif
 
               set curr_row = curr_row + linespace
               set start_col = startcol
               set start_pos = 0
               set last_space_pos = 0
               set text_len = 0
               set text_parse = fillstring(130, " ")
            endif
            set vcstring->text = " "
 
            ;* Return row following last row of varchar in report_data.
            return(curr_row)
         end
 
      /***********************************************************************
      * Store Item Subroutine                                                *
      ***********************************************************************/
         ;* Stores a string <reportitem> in report_data array starting
         ;* in column <c>, row <r>
         subroutine store_item(c, r, reportitem)
            set item_length = 0
            set move_len = 0
 
            ;* Allocate more rows in report_data if needed
            while (nitems < r)
               set nitems = nitems + 1
               set stat = alter(report_data->qual, nitems)
               set move_len = movestring(
                 blank_line, 1, report_data->qual[nitems].printline, 1, 130)
            endwhile
 
            ;* Store reportitem in <r> row of report_data starting at offset + 1
            set item_length = size(trim(reportitem), 3)
;002        *if item_length = 0, can cause memory problem, junk data is saved
            if (item_length > 0)                                           ;002
              set move_len = movestring(
                reportitem, 1, report_data->qual[r].printline, c + 1, item_length)
            endif                                                          ;002
            ;* Remember last row being used (reset to 0 after clearing
            ;* report_data array)
            if (r > limit)
               set limit = r
            endif
         end
 
;002  ************************************************************************
;002  * Store Item Subroutine                                                *
;002  ************************************************************************
;002     * Blanks out the line in report_data array after it is printed using
;002     * column <c>, row <r>
         subroutine blank_item(c, r, reportitem)                           ;002
            set item_length = size(reportitem, 3)                          ;002
            set move_len = movestring(reportitem,                          ;002
              1, report_data->qual[r].printline, c + 1, item_length)       ;002
;002        * Remember last row being used (reset to 0 after clearing
;002        * report_data array)
            if (r > limit)                                                 ;002
               set limit = r                                               ;002
            endif                                                          ;002
         end                                                               ;002
 
      /***********************************************************************
      * Abbreviate Age Subroutine                                            *
      ***********************************************************************/
         ;* Abbreviate patient age:
         ;* Input is an age generated by cnvtage, such as
         ;* agething = trim(cnvtage((cnvtmin(p.birth_dt_tm)/1440), curtime), 3)
         ;*
         ;* If given in years, print the number of years followed by "YRS"
         ;* If given in months, print the number of months followed by "MOS"
         ;* If given in weeks, print the number of weeks followed by "WKS"
         ;* If given in days, print the number of days followed by "DYS"
         ;* If given in hours and minutes, print in 00:00 format
         declare abbrevage(agething) = c20
 
         subroutine abbrevage(agething)
            set agestr1 = substring(1, 2, agething) ; 1st numeral in age
            set agestr2 = substring(1, 3, agething) ; 1st and 2nd numerals
            set agestr3 = substring(1, 4, agething) ; 1st, 2nd, & 3rd numerals
            ;* Check for age in years
            set pos = findstring("Year", agething)
            if (pos > 0)
               ;* Tell how many numerals are in age
               if (pos = 3)
                  set ageabbrev = concat(agestr1, 'YRS ')
               elseif (pos = 4)
                  set ageabbrev = concat(agestr2, 'YRS ')
               else
                  set ageabbrev = concat(agestr3, 'YRS ')
               endif
            else
               ;* Check for age in months
               set pos = findstring("Month", agething)
               if (pos > 0)
                  if (pos = 3)
                     set ageabbrev = concat(agestr1, 'MOS ')
                  else
                     set ageabbrev = concat(agestr2, 'MOS ')
                  endif
               else
                  ;* Check for age in weeks
                  set pos = findstring("Week", agething)
                  if (pos > 0)
                     if (pos = 3)
                        set ageabbrev = concat(agestr1, 'WKS ')
                     else
                        set ageabbrev = concat(agestr2, 'WKS ')
                     endif
                  else
                     ;* Check for age in days
                     set pos = findstring("Day", agething)
                     if (pos > 0)
                        if (pos = 3)
                           set ageabbrev = concat(agestr1, 'DYS ')
                        else
                           set ageabbrev = concat(agestr2, 'DYS ')
                        endif
                     else
                        ;* Age is in hours and minutes
                        set ageabbrev = substring(1, 5, agething)
                     endif
                  endif
               endif
            endif
 
            return(ageabbrev)
         end
 
      /***********************************************************************
      * Build Result Flags String Subroutine                                 *
      ***********************************************************************/
         ;* Build a string of result flags to follow a result on a report.
         ;* Prints only the 1st char of each result flag.
         ;* When calling this function, remember that the contents of the
         ;* display field for the 1902 codeset can be an empty string.
         ;* This routine will check to see whether the display flag = " ",
         ;* and if not, will look at the 1st character in the string.

/*001...*/ declare bldresultflagstr(fnorm, fcrit, frevw, flin, ffeas, fdelta, fcomment,
/*001...*/                          fnote, fcorr, fqcoverride, fnotify, finterp) = vc
 
/*001...*/ subroutine bldresultflagstr(fnorm, fcrit, frevw, flin, ffeas, fdelta, fcomment,
/*001...*/                             fnote, fcorr, fqcoverride, fnotify, finterp)
 
            declare flagstr = vc with protect, noconstant(" ")
 
            ;* Add abnormal flag
            if (fnorm != " ")
               set flagstr = fnorm
            endif
 
            ;* Add critical flag
            if (fcrit != " ")
               set flagstr = concat(flagstr, fcrit)
            endif
			
            ;* Add interp flag
            if (textlen(trim(finterp, 3)) > 0) 
               set flagstr = concat(flagstr, finterp)
            endif
 
            ;* Add review flag
            if (frevw != " ")
               set flagstr = concat(flagstr, frevw)
            endif
 
            ;* Add linear flag
/*001...*/  if (flin != " ")
               set flagstr = concat(flagstr, flin)
/*001...*/  endif
 
            ;* Add feasible flag
/*001...*/  if (ffeas != " ")
               set flagstr = concat(flagstr, ffeas)
/*001...*/  endif
 
            ;* Add delta flag
            if (fdelta != " ")
               set flagstr = concat(flagstr, fdelta)
            endif
 
            ;* Add corrected flag
            if (fcorr = "Y")
               set flagstr = concat(flagstr, "c")
            endif

            ; add notify flag
            if(fnotify != " ")
              set flagstr = concat(flagstr, fnotify)
            endif
 
            ; add footnote flag
            if ((fcomment = "Y") or (fnote = "Y"))
               set flagstr = concat(flagstr, "f")
            endif
 
            ; add qc override flag
            if (fqcoverride != " ")
               set flagstr = concat(flagstr, fqcoverride)
            endif

            return(flagstr)
         end

;Generated by GNU enscript 1.6.4.
