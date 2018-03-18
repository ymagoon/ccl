 ;;Solution_Test/script/PathNet -- Gen Lab/glb_rpt_monthly_ljc/glb_rpt_monthly_ljc_foot.inc Turn on black mode

/*********************************************
*glb_rpt_montly_ljc_foot.inc                 *
* craig sumrall 17-mar-04                    *
*********************************************/
if (results_found = 1)
  ;start of alpha procs
  if (q.result_type_cd = alpha_cd)
    COL 24 chartline
    ROW +1
    holdrow = 1
    for (cnt = 1 to 3)
      case (cnt)
        of 1:
          COL 1   captions->norm
        of 2:
          COL 1   captions->abnorm
        of 3:
          COL 1   captions->rev
      endcase
      found = 0
      for (cnt2 = 1 to xy_cnt)
        if (coord->coords[cnt2].y = cnt and coord->coords[cnt2].graphed != 1)
          found = 1
          holdrow = holdrow+1
          COL 12   coord->coords[cnt2].result_value_alpha "##########;I;F"
          COL 24  "|"
          COL 120 "|"
          rsltcntstr = trim(cnvtstring(coord->coords[cnt2].result_cnt))
          COL 25 + (coord->coords[cnt2].x * 3), rsltcntstr "##;I;F"
          coord->coords[cnt2].graphed = 1
          for (cnt3 = cnt2 to xy_cnt)
            if (coord->coords[cnt3].result_value_alpha = coord->coords[cnt2].result_value_alpha
                and coord->coords[cnt3].graphed != 1)
              rsltcntstr = trim(cnvtstring(coord->coords[cnt3].result_cnt))
              COL 25 + (coord->coords[cnt3].x * 3), rsltcntstr "##;I;F"           ;014
                      coord->coords[cnt3].graphed = 1
            endif
          endfor
          ROW+1
        endif
      endfor
      if (found = 0) ;and (cnt < 3))
        COL 24  "|"
        COL 120 "|"
        ROW +1
        holdrow = holdrow + 1
      endif
    endfor
    if (holdrow != 1)
      if (holdrow = 5)
        holdrow = 4
      endif
      for (cnt = holdrow to 5)
        holdrow = holdrow+1
        case (holdrow)
          of 1:
            COL 24  chartline
            cnt = 6
          of 2:
            COL 24  "|"
            COL 120 "|"
          of 3:
            COL 24  "|"
            COL 120 "|"
          of 4:
            COL 24  "|"
            COL 120 "|"
          of 5:
            COL 24  chartline
        endcase
        ROW+1
      endfor
    endif
    tempdaystr = cnvtstring(day(request->begin_date))
    tempdate = cnvtdatetime(request->begin_date)

    COL 24 tempdaystr "###;I;F"    ;014
    ROW+1

    prevmonthstr = trim(format(startdt,"@MONTHABBREV;;Q"),3)     ;014
    COL 24 prevmonthstr
    ROW-1
    tempcol = 24
    val = 0
    for (cnt = 1 to 15)
      newdttm = datetimeadd(tempdate, 2)
      tempdaystr = cnvtstring(day(newdttm))
      tempcol = tempcol + 6
      COL tempcol, tempdaystr "###;I;F"  ;014
      tempmonthstr = trim(format(newdttm,"@MONTHABBREV;;Q"),3)   ;014
      if (tempmonthstr != prevmonthstr)
        ROW+1
        COL tempcol, tempmonthstr
        prevmonthstr = tempmonthstr
        ROW-1
      endif
      tempdate = newdttm
    endfor
    ROW +2
    ;display the expected group for each lot for this task_assay_cd                          ;011
    for (x = 1 to lot_cnt)                                                                   ;011
      if (lot->lots[x].task_assay_cd = q.task_assay_cd
          and request->qc_result_type_flag = 0
          and (q.lot_id = lot->lots[x].lot_id or request->lot_per_graph_ind = 0)
          AND (q.control_id = lot->lots[x].control_id or request->control_per_graph_ind = 0))
        tempExpectedGroupStr = concat(uar_i18ngetmessage(i18nHandle,"ExpGrp2",("EXP GRP ")),
                               trim(lot->lots[x].lot_number), ": ")                     ;014
        COL 0 tempExpectedGroupStr                                                   ;011
        lot->lots[x].expected_group_row = ROW                                        ;011
        ROW +1                                                                       ;011
      endif                                                                                 ;011
    endfor                                                                                   ;011
    ROW+1
  ;end of alpha procs
  else
    holdrow = ROW
    for (cnt = 1 to xy_cnt)
      ROW 32 - (coord->coords[cnt].y * 2)
      rsltcntstr = trim(cnvtstring(coord->coords[cnt].result_cnt))
      COL 25 + (coord->coords[cnt].x * 3), rsltcntstr "##;I;F"                ;014
    endfor
    ROW holdrow+1
  endif

  holdROW = row
  if (ROW >= 55)                                                   ;011
    BREAK                                                        ;011
  endif                                                            ;011
  if (request->qc_result_type_flag = 0)
     ;set the expected groups
    for (l_cnt = 1 to lot_cnt)                                                   ;011
      if (q.task_assay_cd = lot->lots[l_cnt].task_assay_cd
          and ((q.lot_id = lot->lots[l_cnt].lot_id or request->lot_per_graph_ind = 0)
          AND (q.control_id = lot->lots[l_cnt].control_id or request->control_per_graph_ind = 0)))

        ExpectedRow = 0
        for (x2 = 1 to s_cnt)
          if (holdstat->stats[x2].service_resource_cd =
              q.service_resource_cd and holdstat->stats[x2].task_assay_cd = q.task_assay_cd and
              holdstat->stats[x2].lot_id = lot->lots[l_cnt].lot_id and            
              holdstat->stats[x2].task_assay_cd = lot->lots[l_cnt].task_assay_cd)
            
            if ((holdstat->stats[x2].beg_effective_dt_tm <= request->end_date and 
              holdstat->stats[x2].beg_effective_dt_tm >= request->begin_date) or
              (request->begin_date between cnvtdatetime(holdstat->stats[x2].beg_effective_dt_tm)
              and cnvtdatetime(holdstat->stats[x2].end_effective_dt_tm)))
  
              ExpectedRow = lot->lots[l_cnt].expected_group_row
              l_cnt = lot_cnt + 1

              x = datetimediff(holdstat->stats[x2].beg_effective_dt_tm, request->begin_date)
              ROW ExpectedRow
              call echo(x)
              if (x > 0)
                COL 25 + (x * 3), holdstat->stats[x2].stat_cnt "##;I;F"
              else
                COL 25, holdstat->stats[x2].stat_cnt "##;I;F"
              endif
              x2 = s_cnt + 1
            ;get the row for this expected group from the lot collection                 ;011

;          ExpectedRow = 0
;          for (l_cnt = 1 to lot_cnt)                                                   ;011
 ;           if (holdstat->stats[x2].lot_id = lot->lots[l_cnt].lot_id and             ;011
  ;              holdstat->stats[x2].task_assay_cd = lot->lots[l_cnt].task_assay_cd
   ;             and ((q.lot_id = lot->lots[l_cnt].lot_id or request->lot_per_graph_ind = 0)
    ;            AND (q.control_id = lot->lots[l_cnt].control_id or request->control_per_graph_ind = 0)))
    ;          call echo("got the expected row for lot id of")
     ;         call echo(q.lot_id)
      ;        ExpectedRow = lot->lots[l_cnt].expected_group_row
       ;       call echo("expected row of")
       ;      call echo(ExpectedRow)
;             l_cnt = lot_cnt + 1
            endif
          endif
        endfor
      endif
;        if (request->begin_date between cnvtdatetime(holdstat->stats[x2].beg_effective_dt_tm)
;            and cnvtdatetime(holdstat->stats[x2].end_effective_dt_tm))  ;012
;;            ;get the row for this expected group from the lot collection                 ;012
;          for (l_cnt = 1 to lot_cnt)                                                   ;012
;            if (holdstat->stats[x2].lot_id = lot->lots[l_cnt].lot_id and             ;012
;                holdstat->stats[x2].task_assay_cd = lot->lots[l_cnt].task_assay_cd)  ;012
;              ExpectedRow = lot->lots[l_cnt].expected_group_row                   ;012
;              l_cnt = lot_cnt + 1                                                 ;012
;            endif                                                                    ;012
;          endfor                                                                       ;012
 ;         ROW ExpectedRow                                                              ;012
 ;         COL 25, holdstat->stats[x2].stat_cnt "##;I;F"                ;014            ;012
 ;       endif                                                                             ;012
    endfor
  elseif (request->qc_result_type_flag = 1)                                                   ;015
    row -1                                                                                   ;015
   ;display the expected row for the PDM parameters                                         ;015
    for (l_cnt = 1 to lot_cnt)                                                               ;015
      if (holdstat->stats[l_cnt].service_resource_cd =                                     ;015
          q.service_resource_cd and holdstat->stats[l_cnt].task_assay_cd = q.task_assay_cd)    ;015
        if (holdstat->stats[l_cnt].beg_effective_dt_tm <= request->end_date and            ;015
            holdstat->stats[l_cnt].beg_effective_dt_tm >= request->begin_date)             ;015
          x = datetimediff(holdstat->stats[l_cnt].beg_effective_dt_tm, request->begin_date)
          COL 25 + (x * 3), lot->lots[l_cnt].lot_sequence  "##;I;F"
        endif                                                                              ;015
        if (request->begin_date between cnvtdatetime(holdstat->stats[l_cnt].beg_effective_dt_tm)    ;015
            and cnvtdatetime(holdstat->stats[l_cnt].end_effective_dt_tm))   ;015
          COL 25, lot->lots[l_cnt].lot_sequence  "##;I;F"                              ;015
        endif                                                                              ;015
      endif                                                                                ;015
    endfor                                                                                   ;015
  endif                                                                                       ;015
  Row holdrow
  ROW +1
  if (request->qc_result_type_flag = 0)
    if (q.result_type_cd != alpha_cd)
      COL 0,   captions->REPORT_STATISTICS
      COL 23,  captions->GRP
      COL 32,  captions->MEAN
      COL 45,  captions->SD_
      COL 57,  captions->LOW
      COL 69,  captions->HIGH
      COL 82,  captions->CNT
      COL 96,  captions->CV
      COL 106, captions->F_VAL
      COL 119, captions->Z_STAT
      ROW+1
      COL 0,   "--------------------"
      COL 22,  "-----"
      COL 30,  "--------"
      COL 43,  "------"
      COL 56,  "-----"
      COL 68,  "------"
      COL 81,  "-------"
      COL 94,  "------"
      COL 105, "-------"
      COL 118, "--------"
      ROW+1
      control_name = " "
      Lot_Disp_Ind = 0
      for (lCnt = 1 to lot_cnt)                      ;012
        if (q.task_assay_cd = lot->lots[lCnt].task_assay_cd and
           (q.lot_id = lot->lots[lCnt].lot_id or request->lot_per_graph_ind = 0)
           and(q.control_id = lot->lots[lCnt].control_id or request->control_per_graph_ind = 0))

           ;get the current expected mean/sd used for calculation of lot info
          for (x2 = 1 to s_cnt )
            if ( lot->lots[lCnt].lot_id = holdstat->stats[x2].lot_id and
                 lot->lots[lCnt].task_assay_cd = holdstat->stats[x2].task_assay_cd and
                (cnvtdatetime(request->end_date) between cnvtdatetime(holdstat->stats[x2].beg_effective_dt_tm)
                 and cnvtdatetime(holdstat->stats[x2].end_effective_dt_tm)))
              current_exp_sd = holdstat->stats[x2].sd
              current_exp_mean = holdstat->stats[x2].mean
              current_exp_low = holdstat->stats[x2].abs_low
              current_exp_high = holdstat->stats[x2].abs_high
              current_manf_mean = holdstat->stats[x2].manf_mean                    ;012
              current_manf_sd = holdstat->stats[x2].manf_std_dev                   ;012
              current_manf_low = holdstat->stats[x2].manf_low                      ;012
              current_manf_high = holdstat->stats[x2].manf_high                    ;012
              x2 = s_cnt + 1
            endif
          endfor
          ;Lot statistics

          if (ROW > 58)
            BREAK
          endif
          Lot_disp_ind = 0

/* 011 Begin new code to display calculated/group stats in lot section.  */
          for (cx = 1 to cum_cnt)
             ;display correct statistics for the correct sequence
            if (q.task_assay_cd = cumrec->cums[cx].task_assay_cd and cumrec->cums[cx].cum_count > 0)
              for(x2 = 1 to s_cnt)          ;011
                if (cumrec->cums[cx].lot_id = lot->lots[lCnt].lot_id)
                  if (holdstat->stats[x2].service_resource_cd = q.service_resource_cd and
                      holdstat->stats[x2].task_assay_cd = q.task_assay_cd
                      and cumrec->cums[cx].stat_cnt = holdstat->stats[x2].stat_cnt)
                    value = 0
                     ;break if too far down page to print next stats section
                    if (ROW >= 57)
                      BREAK
                    endif
                    if(Lot_disp_ind = 0)
                      name = concat(trim(lot->lots[lCnt].lot_number), ":")
                      COL 0 name
                      ROW+2
                      lot_disp_ind = 1
                    endif
                    COL 0 captions->CALCULATED          ;014
                    COL 23 holdstat->stats[x2].stat_cnt "##;I;F"     ;014
                    count = cumrec->cums[cx].cum_count
                    mean = cumrec->cums[cx].cum_mean / count
                    arg_raw_value = mean
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                    rslt =  FormatStatResult(rslt)                                                              ;012
                    COL 29  rslt "########;I;F"      ;014
                    stddev = (cumrec->cums[cx].cum_sum_sqr - (cumrec->cums[cx].cum_mean **2)/count)/(count-1)
                    stddev = stddev ** 0.5
                    arg_raw_value = stddev
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                    rslt =  FormatStatResult(rslt)                                                              ;012
                    COL 41 rslt "########;I;F"       ;014
                    COL 58 "-"
                    COL 71 "-"
                    COL 82  count "#####;I;F"        ;014
                    value = (stddev / mean) * 100
                    arg_raw_value = value
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                    rslt =  FormatStatResult(rslt)                                                              ;012
                    COL 92  rslt "########;I;F"      ;014
                    variance1 = holdstat->stats[x2].sd ** 2
                    variance2 = stddev ** 2
                    if (variance1 > variance2)
                      value = variance1 / variance2
                    else
                      value = variance2 / variance1
                    endif
                    arg_raw_value = value
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
                    rslt =  FormatStatResult(rslt)                                                              ;012
                    COL 103  rslt "########;I;F"     ;014
                    value = mean - holdstat->stats[x2].mean
                    value = value / holdstat->stats[x2].sd
                    arg_raw_value = value
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
                    rslt =  FormatStatResult(rslt)                                                              ;012
                    COL 117 rslt "########;I;F"      ;014
                    ROW+1
   ;expected group statistics

                    COL 0   captions->expect         ;014
                    arg_raw_value = holdstat->stats[x2].mean
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                    COL 29  rslt "########;I;F"      ;014
                    arg_raw_value = holdstat->stats[x2].sd
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                    COL 41 rslt "########;I;F"       ;014
                    arg_raw_value = holdstat->stats[x2].abs_low
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                    COL 56 rslt "#####;I;F"  ;014
                    arg_raw_value = holdstat->stats[x2].abs_high
                    rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                    COL 69 rslt "#####;I;F"  ;014
                    COL 86  "-"
                    COL 96  "-"
                    COL 107 "-"
                    COL 121 "-"
                    ROW +1
                    tempStatDtTM = concat (format(holdstat->stats[x2].beg_effective_dt_tm, "@SHORTDATE4YR;;Q"),
                                  " ", captions->to_, " ",                                         ;014
                    format(holdstat->stats[x2].end_effective_dt_tm, "@SHORTDATE4YR;;Q"))
                    COL 0 tempStatDtTm
                    ROW+2
                  endif
                endif
              endfor
            endif
         endfor
   /* 011 END new code to display calculated/group stats in lot section.  */

  ;LOT TO DATE

         if (ROW >= 57)                                                   ;011
           BREAK                                                        ;011
         endif                                                            ;011
         for (x = 1 to cumlot_cnt)
           if (q.task_assay_cd = cumlot->cumlots[x].task_assay_cd and
               lot->lots[lCnt].task_assay_cd = cumlot->cumlots[x].task_assay_cd and
               lot->lots[lCnt].lot_id = cumlot->cumlots[x].lot_id)
             COL 0 captions->lot_to_dt
             count = cumlot->cumlots[x].ltd_cum_count
             mean = cumlot->cumlots[x].ltd_cum_mean / count
             arg_raw_value = mean
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
             rslt =  FormatStatResult(rslt)                                                              ;012
             COL 29  rslt "########;I;F"    ;014
             stddev = (cumlot->cumlots[x].ltd_cum_sum_sqr - (cumlot->cumlots[x].ltd_cum_mean **2)/count)/(count-1)
             stddev = stddev ** 0.5
             arg_raw_value = stddev
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
             rslt =  FormatStatResult(rslt)                                                              ;012
             COL 41 rslt "########;I;F"     ;014
             COL 58 "-"
             COL 71 "-"
             COL 82  count "#####;I;F"      ;014
             value = (stddev / mean) * 100
             arg_raw_value = value
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
             rslt =  FormatStatResult(rslt)                                                              ;012
             COL 92  rslt "########;I;F"    ;014
             variance1 = current_exp_sd ** 2
             variance2 = stddev ** 2
             if (variance1 > variance2)
               value = variance1 / variance2
             else
               value = variance2 / variance1
             endif
             arg_raw_value = value
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
             rslt =  FormatStatResult(rslt)                                                              ;012
             COL 103  rslt "########;I;F"   ;014
             value = mean - current_exp_mean
             value = value / current_exp_sd
             arg_raw_value = value
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
             rslt =  FormatStatResult(rslt)                                                              ;012
             COL 117 rslt "########;I;F"    ;014
             ROW+1
           endif   ;012
         endfor     ;012
  ;MaNUFACTURER STATISTICS
         if (request->manf_ind = 1 and Lot_Disp_Ind = 1)
           COL 0   captions->man      ;014
           if (current_manf_mean > 0.0)
             arg_raw_value = current_manf_mean
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
             COL 29  rslt "########;I;F"        ;014
           else
             COL 34 "-"
           endif
           if (current_manf_sd > 0.0)
             arg_raw_value = current_manf_sd
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
             COL 41 rslt "########;I;F"         ;014
           else
             COL 46 "-"
           endif
           if (current_manf_low > 0.0)
             arg_raw_value = current_manf_low
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
             COL 56 rslt "#####;I;F"    ;014
           else
             COL 58 "-"
           endif
           if (current_manf_high > 0.0)
             arg_raw_value = current_manf_high
             rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
             COL 69 rslt "#####;I;F"    ;014
           else
             COL 71 "-"
           endif
             COL 86  "-"
             COL 96  "-"
             COL 107 "-"
             COL 121 "-"
             ROW +1
         endif
  ;EXPECTED STATS
            if (Lot_Disp_Ind = 1)
              COL 0 captions->curr_exp         ;014
              arg_raw_value = current_exp_mean
              rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
              COL 29  rslt "########;I;F"        ;014
              arg_raw_value = current_exp_sd
              rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
              COL 41 rslt "########;I;F"         ;014
              arg_raw_value = current_exp_low
              rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
              COL 56 rslt "#####;I;F"    ;014
              arg_raw_value = current_exp_high
              rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
              COL 69 rslt "#####;I;F"    ;014
              COL 86  "-"
              COL 96  "-"
              COL 107 "-"
              COL 121 "-"
              ROW +1
              ROW +2
            endif
            if (ROW >= 55)                                                   ;011
              BREAK                                                        ;011
            endif                                                            ;011
          endif
        endfor
        Row +2

      else
        if (ROW >= 50)
          BREAK
        endif
        COL 1,   captions->REPORT_STATISTICS                                     ;014
        COL 23   captions->GROUP                                                 ;014
        COL 34,  captions->NORMAL                                                ;014
        COL 46,  captions->ABNORMAL                                              ;014
        COL 59,  captions->REVIEWED                                              ;014
        COL 70,  captions->TOTAL                                                 ;014
        ROW +1                                                                   ;012
        COL 1 "--------------------  -----     --------     --------     ------     -----"
        ROW+1                                                                    ;012
        for (lCnt = 1 to lot_cnt)                                                ;012
          if (q.task_assay_cd = lot->lots[lCnt].task_assay_cd)                  ;012
            if (ROW >= 54)                                                    ;012
              BREAK                                                        ;012
            endif                                                             ;012
            COL 1 lot->lots[lCnt].lot_number                                  ;012
            ROW +2                                                            ;012
            for (cx = 1 to cum_cnt)                                           ;012
              ;display correct statistics for the correct sequence           ;012
              if (q.task_assay_cd = cumrec->cums[cx].task_assay_cd and       ;012
                  lot->lots[lCnt].lot_id = cumrec->cums[cx].lot_id)            ;012
                COL 1 captions->CALCULATED              ;014
                COL 24 cumrec->cums[cx].stat_cnt "##;I;F"       ;014                  ;012
                COL 36 cumrec->cums[cx].normal_cnt "##;I;F"     ;014                  ;012
                COL 50 cumrec->cums[cx].abnormal_cnt "##;I;F"   ;014                  ;012
                COL 62 cumrec->cums[cx].review_cnt "##;I;F"     ;014                  ;012
                COL 73 cumrec->cums[cx].cum_count "##;I;F"      ;014                  ;012
                ROW +1                                                     ;012
              endif                                                          ;012
            endfor                                                            ;012
          for (x=1 to cumlot_cnt)                                           ;012
            if (q.task_assay_cd = cumlot->cumlots[x].task_assay_cd and     ;012
                lot->lots[lCnt].lot_id = cumlot->cumlots[x].lot_id)        ;012
               ;lot to date                                                ;012
              COL 1 captions->lot_to_dt                                 ;014
              COL 36  cumlot->cumlots[x].ltd_normal_cnt   "##;I;F"        ;014          ;012
              COL 50  cumlot->cumlots[x].ltd_abnormal_cnt "##;I;F"        ;014          ;012
              COL 62  cumlot->cumlots[x].ltd_review_cnt   "##;I;F"        ;014          ;012
              COL 73  cumlot->cumlots[x].ltd_cum_count    "##;I;F"        ;014          ;012
              ROW+2                                                     ;012
            endif                                                         ;012
          endfor                                                            ;012
        endif                                                                  ;012
      endfor                                                                    ;012
      ROW+2
    endif
  else
  ;pdm paramters

    COL 0,    captions->summ             ;014
    ROW+2                                                                                ;006
    COL 0     captions->grp              ;014
    COL 6     captions->species          ;014
    COL 18    captions->gender           ;014
    COL 29    captions->age_frm          ;014
    COL 42    captions->age_to           ;014
    COL 52    captions->trim_low         ;014
    COL 61    captions->trim_high        ;014
    COL 73    captions->mean             ;014
    COL 84    captions->sd_              ;014
    COL 91    captions->cnt              ;014
    COL 101   captions->cv               ;014
    COL 108   captions->f_val            ;014
    COL 117  captions->z_stat            ;014
    ROW+1                                                                                ;006
    COL 0    "---"                                                                       ;006
    COL 5    "----------"                                                                ;006
    COL 16   "-----------"                                                               ;006
    COL 28   "-----------"                                                               ;006
    COL 40,  "-----------"                                                               ;006
    COL 52,  "--------"                                                                  ;006
    COL 61,  "---------"                                                                 ;006
    COL 71   "---------"                                                                 ;006
    COL 81   "---------"                                                                 ;006
    COL 91   "-----"                                                                     ;006
    COL 98   "--------"                                                                  ;006
    COL 107  "--------"                                                                  ;006
    COL 116,  "--------"                                                                 ;006
    ROW+1                                                                                ;006
  ;pdm parameters
    for (x = 1 to cum_cnt)                                                               ;006
      for (x2 = 1 to s_cnt)                                                              ;006
        if (q.task_assay_cd = cumrec->cums[x].task_assay_cd and                          ;006    ;015
            cumrec->cums[x].cum_count > 0)





          if ((holdstat->stats[x2].pdm_range_id = cumrec->cums[x].pdm_range_id) and                        ;006
             (holdstat->stats[x2].service_resource_cd = q.service_resource_cd and        ;006
              holdstat->stats[x2].task_assay_cd = q.task_assay_cd))                       ;006
            COL 0  cumrec->cums[x].lot_sequence "###;I;F"       ;014
            if (cumrec->cums[x].species_cd = 0)                                      ;017
              COL 8  captions->all_gend                                              ;017
            else                                                                     ;017
              COL 5  cumrec->cums[x].species_disp "##########;I;F"
            endif                                                                    ;017
            if (cumrec->cums[x].sex_cd = 0)                                             ;006
              COL 20  captions->all_gend        ;014                         ;017
            else                                                                        ;006
              COL 16   cumrec->cums[x].sex_disp "############;I;F" ;014
            endif                                                                       ;006
            COL 28   cumrec->cums[x].age_from_display "###########;C"                   ;006
            COL 40   cumrec->cums[x].age_to_display "###########;C"                     ;006
            COL 52   holdstat->stats[x2].abs_low "##########;C"                         ;006
            COL 61   holdstat->stats[x2].abs_high "##########;C"                        ;006
            value = 0                                                                    ;006
            count = cumrec->cums[x].cum_count                                            ;006
            mean = cumrec->cums[x].cum_mean / count                                      ;006
            arg_raw_value = mean                                                         ;006
            rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
            rslt =  FormatStatResult(rslt)                                                              ;012
            COL 71  rslt "########;I;F"  ;014
            stddev = (cumrec->cums[x].cum_sum_sqr - (cumrec->cums[x].cum_mean **2)/count)/(count-1)      ;006
            stddev = stddev ** 0.5                                                       ;006
            arg_raw_value = stddev                                                       ;006
            rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
            rslt =  FormatStatResult(rslt)                                                              ;012
            COL 81  rslt "########;I;F"   ;014
            COL 91  count "#####;I;F"            ;014
            value = (stddev / mean) * 100                                                ;006
            arg_raw_value = value                                                        ;006
            rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
            rslt =  FormatStatResult(rslt)                                                              ;012
            COL 98  rslt "########;I;F"     ;014
            variance1 = holdstat->stats[x2].sd ** 2                                      ;006
            variance2 = stddev ** 2                                                      ;006
            if (variance1 > variance2)                                                   ;006
              value = variance1 / variance2                                              ;006
            else                                                                         ;006
              value = variance2 / variance1                                              ;006
            endif                                                                        ;006
            arg_raw_value = value                                                        ;006
            rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
            rslt =  FormatStatResult(rslt)                                                              ;012
            COL 107  rslt "########;I;F"         ;014
            value = mean - holdstat->stats[x2].mean                                      ;006
            value = value / holdstat->stats[x2].sd                                       ;006
            arg_raw_value = value                                                        ;006
            rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
            rslt =  FormatStatResult(rslt)                                                              ;012
            COL 116 rslt "########;I;F"          ;014
            ROW + 1                                                        ;006
          endif                                                                          ;006
        endif                                                                            ;006
      endfor                                                                             ;006
    endfor                                                                               ;006
  endif                                                                                  ;006
  if (request->qc_result_type_flag = 0)
    if (ROW > 50)
      BREAK
    endif
    COL 1 captions->tot_stat     ;014
    ROW + 1
    COL 27   captions->verified  ;014
    COL 42   captions->accepted  ;014
    COL 57   captions->changed   ;014
    COL 72   captions->rejected  ;014
    COL 88   captions->total     ;014
    ROW + 1
    COL 27  "--------"
    COL 42  "--------"
    COL 57  "--------"
    COL 72  "--------"
    COL 88  "-----"
    ROW +1
    for (lCnt = 1 to lot_cnt)                      ;015
      for (cx = 1 to cumlot_cnt)
         ;display correct statistics for the correct sequence
        if (q.task_assay_cd = cumlot->cumlots[cx].task_assay_cd and cumlot->cumlots[cx].total_cnt > 0
           and cumlot->cumlots[cx].lot_id = lot->lots[lCnt].lot_id
           and cumlot->cumlots[cx].task_assay_cd = lot->lots[lCnt].task_assay_cd
           and (q.lot_id = lot->lots[lCnt].lot_id or request->lot_per_graph_ind = 0)
           and (q.control_id = lot->lots[lCnt].control_id or request->control_per_graph_ind = 0))
          if (ROW >= 56)                                                   ;015
            BREAK                                                        ;015
          endif                                                            ;015
          COL 1   cumlot->cumlots[cx].lot_number
          ROW +1
          COL 5    captions->cnt         ;014
          COL 30  cumlot->cumlots[cx].verify_cnt "###;I;F"       ;014
          COL 45  cumlot->cumlots[cx].accept_cnt "###;I;F"       ;014
          COL 60  cumlot->cumlots[cx].change_cnt "###;I;F"       ;014
          COL 75  cumlot->cumlots[cx].reject_cnt "###;I;F"       ;014
          COL 90  cumlot->cumlots[cx].total_cnt "###;I;F"        ;014
          ROW +1
          COL 5   captions->per_tot      ;014
          if (cnvtint(cumlot->cumlots[cx].total_cnt) > 0)
            arg_raw_value = (cumlot->cumlots[cx].verify_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
            rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value)
            rslt =  FormatStatResult(rslt)                                                              ;012
            COL 28  rslt "#####;I;F"     ;014
            arg_raw_value = (cumlot->cumlots[cx].accept_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
            rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value)
            rslt =  FormatStatResult(rslt)                                                                     ;015
            COL 43  rslt "#####;I;F"     ;014
            arg_raw_value = (cumlot->cumlots[cx].change_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
            rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value)
            rslt =  FormatStatResult(rslt)                                                                     ;015
            COL 58  rslt "#####;I;F"     ;014
            arg_raw_value = (cumlot->cumlots[cx].reject_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
            rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value)
            rslt =  FormatStatResult(rslt)                                                                     ;015
            COL 73  rslt "#####;I;F"     ;014
            arg_raw_value = 100.0
            rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value)
            rslt =  FormatStatResult(rslt)                                                                     ;015
            COL 88  rslt "#####;I;F"     ;014
          else
            COL 30  captions->na         ;014
            COL 45  captions->na         ;014
            COL 60  captions->na         ;014
            COL 75  captions->na         ;014
            COL 90  captions->na         ;014
          endif
          ROW+2
          cx = 1 + cumlot_cnt
        endif
      endfor
    endfor                      ;015
  endif
  ROW+2
endif

;Generated by GNU enscript 1.6.4.
