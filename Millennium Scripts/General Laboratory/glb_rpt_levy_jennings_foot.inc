 ;;Solution_Test/script/PathNet -- Gen Lab/glb_rpt_levy_jennings/glb_rpt_levy_jennings_foot.inc Turn on black mode

/*glb_rpt_levy_jennings_foot_inc*/




if (results_found = 1)                          ;020
           disp_Results = 0  ;false
           if (q.result_type_cd != alpha_cd)                                         ;015
             COL 20,  "--+---------+---------+---------+---------"
             COL 62,  "+---------+---------+--"
           else                                                                      ;015
             COL 19 "+--------+--------+--------+--------+--------+--------+"        ;015
         endif                                                                     ;015
         ROW+2
         if (request->qc_result_type_flag = 0)                                                  ;007
           if (q.result_type_cd != alpha_cd)
             if (ROW >= 50)                                                   ;013
                 BREAK                                                        ;013
             endif                                                            ;013
             ;if the results header/footer has been printed with no results
             if (ROW = 8)                ;013
               ROW -1                    ;013
               COL 0 ClearRow            ;013
               ROW -1                    ;013
               COL 0 ClearRow            ;013
               ROW -1                    ;013
               COL 0 ClearRow            ;013
               ROW -1                    ;013
               COL 0 ClearRow            ;013
             endif                       ;013
;016             COL 1,   "REPORT STATISTICS "
             COL 1,   I18N_Captions->REPORT_STATISTICS ;016
;016             COL 23,  "GRP"
             COL 23,  I18N_Captions->GRP              ;016
;016              COL 32,  "MEAN"
             COL 32,  I18N_Captions->MEAN             ;016
;016              COL 45,  "SD"
             COL 45,  I18N_Captions->SD               ;016
;016              COL 57,  "LOW"
             COL 57,  I18N_Captions->LOW              ;016
;016              COL 69,  "HIGH"
             COL 69,  I18N_Captions->HIGH             ;016
;016              COL 82,  "COUNT"
             COL 82,  I18N_Captions->COUNT            ;016
;016              COL 96,  "CV"
             COL 96,  I18N_Captions->CV               ;016
;016             COL 106,  "F-VAL"
             COL 106,   I18N_Captions->f_val          ;016
;016             COL 119, "Z-STAT"
             COL 119,  I18N_Captions->z_stat          ;016
             ROW+1
             COL 1,   "--------------------"
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

;015         for (x = 1 to cumlot_cnt)
;015                 if (q.task_assay_cd = lot->lots[x].task_assay_cd)                 ;015
;015                    q.service_resource_cd = cumlot->cumlots[x].service_resource_cd and
;015                        lot->lots[lCnt].task_assay_cd = cumlot->cumlots[x].task_assay_cd and
;015                        lot->lots[lCnt].lot_id = cumlot->cumlots[x].lot_id)                       ;015


             for (lCnt = 1 to lot_cnt)                      ;015
                 if ((q.task_assay_cd = lot->lots[lCnt].task_assay_cd) and
                    (q.lot_id = lot->lots[lCnt].lot_id or request->lot_per_graph_ind = 0) and
                    (q.control_id = lot->lots[lCnt].control_id or request->control_per_graph_ind = 0))
                 ;get the current expected mean/sd used for calculation of lot info
                 for (x2 = 1 to s_cnt )
                        if ( lot->lots[lCnt].lot_id = holdstat->stats[x2].lot_id and
                             lot->lots[lCnt].task_assay_cd = holdstat->stats[x2].task_assay_cd and
                             q.service_resource_cd = holdstat->stats[x2].service_resource_cd and
                             (cnvtdatetime(request->end_date) between cnvtdatetime(holdstat->stats[x2].beg_effective_dt_tm)
                                                                  and cnvtdatetime(holdstat->stats[x2].end_effective_dt_tm)))
                                current_exp_sd = holdstat->stats[x2].sd
                                current_exp_mean = holdstat->stats[x2].mean
                                current_exp_low = holdstat->stats[x2].abs_low
                                current_exp_high = holdstat->stats[x2].abs_high
                                current_manf_mean = holdstat->stats[x2].manf_mean                    ;015
                                current_manf_sd = holdstat->stats[x2].manf_std_dev                   ;015
                                current_manf_low = holdstat->stats[x2].manf_low                      ;015
                                current_manf_high = holdstat->stats[x2].manf_high                    ;015
                                x2 = s_cnt + 1
                        endif
                 endfor
;Lot statistics
                 if (ROW >= 53)                                                   ;015
                     BREAK                                                        ;015
                 endif
             Lot_Disp_Ind = 0
             for (cx = 1 to cum_cnt)
                ;display correct statistics for the correct sequence
                if (q.task_assay_cd = cumrec->cums[cx].task_assay_cd and cumrec->cums[cx].cum_count > 0 and
                    q.service_resource_cd = cumrec->cums[cx].service_resource_cd)
                for(x2 = 1 to s_cnt)          ;011
                   if (cumrec->cums[cx].lot_id = lot->lots[lCnt].lot_id)
                     if (holdstat->stats[x2].task_assay_cd = q.task_assay_cd
                       and cumrec->cums[cx].stat_cnt = holdstat->stats[x2].stat_cnt and
                       holdstat->stats[x2].service_resource_cd = q.service_resource_cd)
                       value = 0
                       ;break if too far down page to print next stats section
                       if (ROW >= 57)
                           BREAK
                       endif
                       if (Lot_Disp_Ind = 0)
                         name = concat(trim(lot->lots[lCnt].lot_number), ":")
                         COL 1 name
                         ROW+2
                         Lot_Disp_Ind = 1
                       endif
                       COL  1 I18N_Captions->CALCULATED                         ;016
                       COL 23 holdstat->stats[x2].stat_cnt "###;R"
                       count = cumrec->cums[cx].cum_count
                       mean = cumrec->cums[cx].cum_mean / count
                       arg_raw_value = mean
                       rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                       rslt =  FormatStatResult(rslt)                                                                     ;015
                       COL 29  rslt "########;R"
                       stddev = (cumrec->cums[cx].cum_sum_sqr - (cumrec->cums[cx].cum_mean **2)/count)/(count-1)
                       stddev = stddev ** 0.5
                       arg_raw_value = stddev
                       rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                       rslt =  FormatStatResult(rslt)                                                                     ;015
                       COL 41 rslt "########;R"
                       COL 58 "-"
                       COL 71 "-"
                       COL 81  count "######;R"
                       value = (stddev / mean) * 100
                       arg_raw_value = value
                       rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                       rslt =  FormatStatResult(rslt)                                                                     ;015
                       COL 92  rslt "########;R"
                       variance1 = holdstat->stats[x2].sd ** 2
                       variance2 = stddev ** 2
                       if (variance1 > variance2)
                         value = variance1 / variance2
                       else
                         value = variance2 / variance1
                       endif
                       arg_raw_value = value
                       rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
                       rslt =  FormatStatResult(rslt)                                                                     ;015
                       COL 103  rslt "########;R"
                       value = mean - holdstat->stats[x2].mean
                       value = value / holdstat->stats[x2].sd
                       arg_raw_value = value
                       rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
                       rslt =  FormatStatResult(rslt)                                                                     ;015
                       COL 117 rslt "########;R"
                       ROW+1

;expected group statistics
                       if (request->exp_ind = 1)
                          COL 1 I18N_Captions->expect                     ;016

                          arg_raw_value = holdstat->stats[x2].mean
                          rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                          COL 29  rslt "########;R"
                          arg_raw_value = holdstat->stats[x2].sd
                          rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                          COL 41 rslt "########;R"
                          arg_raw_value = holdstat->stats[x2].abs_low
                          rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                          COL 56 rslt "#####;R"
                          arg_raw_value = holdstat->stats[x2].abs_high
                          rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                          COL 69 rslt "#####;R"
                          COL 86  "-"
                          COL 96  "-"
                          COL 107 "-"
                          COL 121 "-"
                       endif
                       ROW+2
                     endif
                  endif
                endfor
               endif
             endfor


;LOT TO DATE
             for (x = 1 to cumlot_cnt)
                 if (q.task_assay_cd = cumlot->cumlots[x].task_assay_cd and
                    q.service_resource_cd = cumlot->cumlots[x].service_resource_cd and ;cms
                        lot->lots[lCnt].task_assay_cd = cumlot->cumlots[x].task_assay_cd and
                        lot->lots[lCnt].lot_id = cumlot->cumlots[x].lot_id)                       ;015
;016                      COL 1 "LOT TO REPORT END:"
                 COL 1 I18N_Captions->lot_to_dt                        ;016
                 count = cumlot->cumlots[x].ltd_cum_count
                 mean = cumlot->cumlots[x].ltd_cum_mean / count
                 arg_raw_value = mean
                 rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                 rslt =  FormatStatResult(rslt)                                                                     ;015
                 COL 29  rslt "########;R"
                 stddev = (cumlot->cumlots[x].ltd_cum_sum_sqr - (cumlot->cumlots[x].ltd_cum_mean **2)/count)/(count-1)
                 stddev = stddev ** 0.5
                 arg_raw_value = stddev
                 rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                 rslt =  FormatStatResult(rslt)                                                                     ;015
                 COL 41 rslt "########;R"
                 COL 58 "-"
                 COL 71 "-"
                 COL 82  count "#####;R"
                 value = (stddev / mean) * 100
                 arg_raw_value = value
                 rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value)
                 rslt =  FormatStatResult(rslt)                                                                     ;015
                 COL 92  rslt "########;R"
                 variance1 = current_exp_sd ** 2
                 variance2 = stddev ** 2
                 if (variance1 > variance2)
                    value = variance1 / variance2
                 else
                    value = variance2 / variance1
                 endif
                 arg_raw_value = value
                 rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
                 rslt =  FormatStatResult(rslt)                                                                     ;015
                 COL 103  rslt "########;R"
                 value = mean - current_exp_mean
                 value = value / current_exp_sd
                 arg_raw_value = value
                 rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;006
                 rslt =  FormatStatResult(rslt)                                                                     ;015
                 COL 117 rslt "########;R"
                 ROW+1
               endif   ;015
            endfor     ;015
;MANUFACTURER STATISTICS
                 if (request->manf_ind = 1 and Lot_Disp_ind = 1)
                     COL 1 I18N_Captions->MANF_STATISTICS                   ;016
                     arg_raw_value = current_manf_mean       ;015
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 29  rslt "########;R"
                     arg_raw_value = current_manf_sd       ;015
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 41 rslt "########;R"
                     arg_raw_value = current_manf_low       ;015
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 56 rslt "#####;R"
                     arg_raw_value = current_manf_high       ;015
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 69 rslt "#####;R"
                     COL 86  "-"
                     COL 96  "-"
                     COL 107 "-"
                     COL 121 "-"
                     ROW +1
                 endif
;EXPECTED STATS
                 if (request->exp_ind = 1 and lot_Disp_ind = 1)
                     COL 1 I18N_Captions->CURRENT_EXPECTED                      ;016
                     arg_raw_value = current_exp_mean
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 29  rslt "########;R"
                     arg_raw_value = current_exp_sd
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 41 rslt "########;R"
                     arg_raw_value = current_exp_low
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 56 rslt "#####;R"
                     arg_raw_value = current_exp_high
                     rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_min_dec_places, 0, arg_raw_value)
                     COL 69 rslt "#####;R"
                     COL 86  "-"
                     COL 96  "-"
                     COL 107 "-"
                     COL 121 "-"
                     ROW +1
                 endif
                 if (lot_disp_ind = 1)
                   ROW +2
                 endif
                 if (ROW > 55)
                        Break
                 endif
               endif
;015         endfor
             endfor                      ;015
             Row +2
           else
             if (ROW >= 50)                                                    ;015
                  BREAK                                                        ;015
             endif                                                             ;015
;016             COL 1,   "REPORT STATISTICS: "
;016             COL 23   "GROUP"
;016             COL 34,  "NORMAL"
;016             COL 46,  "ABNORMAL"
;016             COL 59,  "REVIEWED"
;016             COL 70,  "TOTAL"
             COL 1,   I18N_Captions->REPORT_STATISTICS                         ;016
             COL 23   I18N_Captions->GROUP                                     ;016
             COL 34,  I18N_Captions->NORMAL                                    ;016
             COL 46,  I18N_Captions->ABNORMAL                                  ;016
             COL 59,  I18N_Captions->REVIEWED                                  ;016
             COL 70,  I18N_Captions->TOTAL                                     ;016
             ROW +1
             COL 1 "--------------------  -----     --------     --------     ------     -----"
             ROW+1
             for (lCnt = 1 to lot_cnt)                                                ;015
                if (q.task_assay_cd = lot->lots[lCnt].task_assay_cd)                  ;015
                    if (ROW >= 54)                                                    ;015
                         BREAK                                                        ;015
                    endif                                                             ;015
                    COL 1 lot->lots[lCnt].lot_number                                  ;015
                    ROW +2                                                            ;015
                    for (cx = 1 to cum_cnt)                                           ;015
                       ;display correct statistics for the correct sequence           ;015
                       if (q.task_assay_cd = cumrec->cums[cx].task_assay_cd and       ;015
                         lot->lots[lCnt].lot_id = cumrec->cums[cx].lot_id)            ;015
;016                           COL 1 "CALCULATED:"                                    ;015
                           COL 1 I18N_Captions->CALCULATED                            ;016
                           COL 24 cumrec->cums[cx].stat_cnt "###;L"                    ;015
                           COL 36 cumrec->cums[cx].normal_cnt "###;L"                  ;015
                           COL 50 cumrec->cums[cx].abnormal_cnt "###;L"                ;015
                           COL 62 cumrec->cums[cx].review_cnt "###;L"                  ;015
                           COL 73 cumrec->cums[cx].cum_count "###;L"                   ;015
                           ROW +1                                                     ;015
                       endif                                                          ;015
                    endfor                                                            ;015
                    for (x=1 to cumlot_cnt)                                           ;015
                       if (q.task_assay_cd = cumlot->cumlots[x].task_assay_cd and     ;015
                           q.service_resource_cd = cumlot->cumlots[x].service_resource_cd and
                           lot->lots[lCnt].lot_id = cumlot->cumlots[x].lot_id)        ;015
                          ;lot to date                                                ;015
;016                            COL 1  "LOT TO REPORT END:"                           ;015
                            COL 1  I18N_Captions->lot_to_dt                           ;016
                            COL 36  cumlot->cumlots[x].ltd_normal_cnt "###;L"          ;015
                            COL 50  cumlot->cumlots[x].ltd_abnormal_cnt "###;L"        ;015
                            COL 62  cumlot->cumlots[x].ltd_review_cnt  "###;L"         ;015
                            COL 73  cumlot->cumlots[x].ltd_cum_count  "###;L"          ;015
                            ROW+2                                                     ;015
                        endif                                                         ;015
                    endfor                                                            ;015
               endif                                                                  ;015
            endfor                                                                    ;015
           endif
           ;display the total of statuses section
           if (ROW >= 52)                                                   ;015
               BREAK                                                        ;015
           endif                                                            ;015
;016           COL 1 "TOTAL OF ACTIONS FOUND WITHIN THE DATE RANGE:"
           COL 1 I18N_Captions->TOTAL_OF_ACT                                ;016
           ROW + 1
;016           COL 27  "VERIFIED"
;016           COL 42  "ACCEPTED"
;016           COL 57  "CHANGED"
;016           COL 72  "REJECTED"
;016           COL 88  "TOTAL"

           COL 27  I18N_Captions->VERIFIED                   ;016
           COL 42  I18N_Captions->ACCEPTED                   ;016
           COL 57  I18N_Captions->CHANGED                    ;016
           COL 72  I18N_Captions->REJECTED                   ;016
           COL 88  I18N_Captions->TOTAL                      ;016
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
                  and q.service_resource_cd = cumlot->cumlots[cx].service_resource_cd
                  and ((q.lot_id = lot->lots[lCnt].lot_id or request->lot_per_graph_ind = 0) 
                  AND (q.control_id = lot->lots[lCnt].control_id or request->control_per_graph_ind = 0)))
                 if (ROW >= 56)                                                   ;015
                     BREAK                                                        ;015
                 endif                                                            ;015
                 COL 1   cumlot->cumlots[cx].lot_number
                 ROW +1
;016                 COL 5   "COUNT"
                 COL 5   I18N_Captions->COUNT                      ;016
                 COL 30  cumlot->cumlots[cx].verify_cnt "###;R"
                 COL 45  cumlot->cumlots[cx].accept_cnt "###;R"
                 COL 60  cumlot->cumlots[cx].change_cnt "###;R"
                 COL 75  cumlot->cumlots[cx].reject_cnt "###;R"
;                 total_cnt = cumlot->cumlots[cx].total_cnt
                 COL 90  cumlot->cumlots[cx].total_cnt "###;R"
                 ROW +1
;016                 COL 5   "% OF TOTAL"
                 COL 5   I18N_Captions->PERC_OF_TOTAL              ;016
                 if (cnvtint(cumlot->cumlots[cx].total_cnt) > 0)
                   arg_raw_value = (cumlot->cumlots[cx].verify_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
                   rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value) ;015
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 28  rslt "#####;R"

                   arg_raw_value = (cumlot->cumlots[cx].accept_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
                   rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value) ;015
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 43  rslt "#####;R"

                   arg_raw_value = (cumlot->cumlots[cx].change_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
                   rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value) ;015
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 58  rslt "#####;R"

                   arg_raw_value = (cumlot->cumlots[cx].reject_cnt / cumlot->cumlots[cx].total_cnt) * 100.0
                   rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value) ;015
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 73  rslt "#####;R"

                   arg_raw_value = 100.0
                   rslt = uar_fmt_result(2, 4, 1, 0, arg_raw_value)                                                   ;015
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 88  rslt "#####;R"
                 else
;016                   COL 30  "N/A"
;016                   COL 45  "N/A"
;016                   COL 60  "N/A"
;016                   COL 75  "N/A"
;016                   COL 90  "N/A"
                   COL 30  I18N_Captions->NA                 ;016
                   COL 45  I18N_Captions->NA                 ;016
                   COL 60  I18N_Captions->NA                 ;016
                   COL 75  I18N_Captions->NA                 ;016
                   COL 90  I18N_Captions->NA                 ;016
                 endif
                 ROW+2
                 cx = 1 + cumlot_cnt
               endif
             endfor
           endfor                      ;015
         else                                                                                   ;007
           if (ROW >= 50)                                                   ;017
               BREAK                                                        ;017
           endif                                                            ;017
;pdm paramters                                                                                  ;007
;016           COL 1,   "SUMMARY STATISTICS: "                                                      ;007
               COL 1,   I18N_Captions->summ_stat                ;016
           ROW+2                                                                                ;007
;016            COL 1    "GRP"                                                                       ;007
           COL 1    I18N_Captions->GRP                                                   ;007 ;016
;016            COL 6    "SPECIES"                                                                   ;007
           COL 6    I18N_Captions->SPECIES                                                 ;007 ;016
;016            COL 18   "GENDER"                                                                    ;007
           COL 18   I18N_Captions->GENDER                                            ;007 ;016
;016            COL 29   "AGE FROM"                                                                  ;007
           COL 29   I18N_Captions->AGE_FROM                                          ;007 ;016
;016            COL 42   "AGE TO"                                                                    ;007
           COL 42   I18N_Captions->AGE_TO                                             ;007 ;016
;016            COL 52   "TRIM LOW"                                                                  ;007
           COL 52   I18N_Captions->TRIM_LOW                                                   ;007 ;016
;016            COL 61   "TRIM HIGH"                                                                 ;007
           COL 61   I18N_Captions->TRIM_HIGH                                            ;007 ;016
;016            COL 73    "MEAN"                                                                     ;007
           COL 73    I18N_Captions->MEAN                                               ;007 ;016
;016            COL 84   "SD"                                                                        ;007
           COL 84   I18N_Captions->SD                                                   ;007 ;016
;016            COL 91   "COUNT"                                                                     ;007
           COL 91   I18N_Captions->COUNT                                                    ;007 ;016
;016            COL 101  "CV"                                                                        ;007
           COL 101  I18N_Captions->CV                                                      ;007 ;016
;016           COL 108  "F-VAL"                                                                     ;007
               COL 108  I18N_Captions->f_val            ;016
;016           COL 117 "Z-STAT"                                                                     ;007
               COL 117  I18N_Captions->z_stat           ;016
           ROW+1                                                                                ;007
           COL 1    "---"                                                                       ;007
           COL 5    "----------"                                                                ;007
           COL 16   "-----------"                                                               ;007
           COL 28   "-----------"                                                               ;007
           COL 40,  "-----------"                                                               ;007
           COL 52,  "--------"                                                                  ;007
           COL 61,  "---------"                                                                 ;007

           COL 71   "---------"                                                                 ;007
           COL 81   "---------"                                                                 ;007
           COL 91   "-----"                                                                     ;007
           COL 98   "--------"                                                                  ;007
           COL 107  "--------"                                                                  ;007
           COL 116,  "--------"                                                                 ;007
           ROW+1                                                                                ;007
;pdm parameters                                                                                 ;007
           for (x = 1 to cum_cnt)                                                               ;007
             for (x2 = 1 to s_cnt)                                                              ;007
               if (q.task_assay_cd = cumrec->cums[x].task_assay_cd)                             ;007
                 if ((holdstat->stats[x2].pdm_range_id = cumrec->cums[x].pdm_range_id) and                        ;007
                    (holdstat->stats[x2].service_resource_cd = q.service_resource_cd and        ;007
                    holdstat->stats[x2].task_assay_cd = q.task_assay_cd and                          ;017
                    cumrec->cums[x].cum_count > 0 ))                                                 ;017
                    COL 1  cumrec->cums[x].lot_sequence "###;C"                                 ;007
                    if (cumrec->cums[x].species_cd = 0)                                              ;017
                        COL 8  I18N_Captions->All_Species                                            ;017
                    else                                                                             ;017
                        COL 5  cumrec->cums[x].species_disp "##########;C"                      ;007
                    endif                                                                            ;017
                    if (cumrec->cums[x].sex_cd = 0)                                             ;007
;016                       COL 16 "All Genders"                                                 ;007
                      COL 20 I18N_Captions->All_Genders                                         ;007 ;016  ;017
                    else                                                                        ;007
                      COL 16   cumrec->cums[x].sex_disp "############;C"                        ;007
                    endif                                                                       ;007
                    COL 28   cumrec->cums[x].age_from_display "###########;C"                   ;007
                    COL 40   cumrec->cums[x].age_to_display "###########;C"                     ;007
                    COL 52   holdstat->stats[x2].abs_low "##########;C"                         ;007
                    COL 61   holdstat->stats[x2].abs_high "##########;C"                        ;007

                   value = 0                                                                    ;007
                   count = cumrec->cums[x].cum_count                                            ;007
                   mean = cumrec->cums[x].cum_mean / count                                      ;007
                   arg_raw_value = mean                                                         ;007
                   rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;007
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 71  rslt "########;R"                                                    ;007
                   stddev = (cumrec->cums[x].cum_sum_sqr - (cumrec->cums[x].cum_mean **2)/count)/(count-1)      ;007
                   stddev = stddev ** 0.5                                                       ;007
                   arg_raw_value = stddev                                                       ;007
                   rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;007
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 81  rslt "########;R"                                                    ;007
                   COL 91  count "#####;R"                                                      ;007
                   value = (stddev / mean) * 100                                                ;007
                   arg_raw_value = value                                                        ;007
                   rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;007
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 98  rslt "########;R"                                                    ;007
                   variance1 = holdstat->stats[x2].sd ** 2                                      ;007
                   variance2 = stddev ** 2                                                      ;007
                   if (variance1 > variance2)                                                   ;007
                     value = variance1 / variance2                                              ;007
                   else                                                                         ;007
                     value = variance2 / variance1                                              ;007
                   endif                                                                        ;007
                   arg_raw_value = value                                                        ;007
                   rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;007
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 107  rslt "########;R"                                                   ;007
                   value = mean - holdstat->stats[x2].mean                                      ;007
                   value = value / holdstat->stats[x2].sd                                       ;007
                   arg_raw_value = value                                                        ;007
                   rslt = uar_fmt_result(arg_min_digits, arg_max_digits, arg_stat_dec_places, 0, arg_raw_value) ;007
                   rslt =  FormatStatResult(rslt)                                                                     ;015
                   COL 116 rslt "########;R"                                                    ;007

                    ROW+1                                                                       ;007
                 endif                                                                          ;007
               endif                                                                            ;007
             endfor                                                                             ;007
           endfor                                                                               ;007
            row +2
         endif                                                                                  ;007
/* Comment stuff moved here BEGIN 017      */
           for (x = 1 to comment_cnt)
           if (comment->comments[x].nbr_comments > 0)
             for (l_cnt = 1 to comment->comments[x].nbr_comments)
;014               if (comment->comments[x]->list[l_cnt].comment_cd = FOOTNOTE_CD and
               if (comment->comments[x]->list[l_cnt].task_assay_cd = temptaskassay)         ;014
                 if (ROW >= 50)                                                   ;013
                     BREAK                                                        ;013
                 endif                                                            ;013
;016                 COL 1   "FOOTNOTES:"
                 COL 1   I18N_Captions->foot_nt                   ;016
                 ROW+2
                 footnote_exists = 1
                 l_cnt = comment->comments[x].nbr_comments + 1
                 x = comment_cnt + 1
               endif
             endfor
            endif
            endfor

            if (footnote_exists = 1)
            step_seq = 0
            for (x = 1 to comment_cnt)
              footnote_found = 0
              review_note_found = 0
              trouble_found = 0
              rule_found = 0
              l_cnt = 0
              if (comment->comments[x].nbr_comments > 0)
                for (l_cnt = 1 to comment->comments[x].nbr_comments)
                 if (comment->comments[x]->list[l_cnt].comment_cd = FOOTNOTE_CD and
                         comment->comments[x]->list[l_cnt].task_assay_cd = temptaskassay)
                   if (footnote_found = 0)
                      if (ROW + comment->comments[x].nbr_comments >= 53)
                         BREAK
                      endif
                      if (step_seq != comment->comments[x].comment_sequence)
                       COL 1   comment->comments[x].comment_sequence "###"
                        COL 4   ") "
                      endif
                      COL 6  I18N_Captions->rslt_com
                      ROW +1
                      step_seq = comment->comments[x].comment_sequence
                   endif
                   footnote_found = 1
                   COL 10 comment->comments[x]->list[l_cnt].comment_dt_tm "@SHORTDATE4YR;;Q"
                   COL 20 ":  "
                   namestring = concat(comment->comments[x]->list[l_cnt].comment_prsnl_name, ":")
                   COL 23 namestring
                   ROW +1
                   print_text = comment->comments[x]->list[l_cnt].comment_text
                   call rtf_to_text(trim(print_text),1,110)
                   for (z = 1 to size(tmptext->qual,5))
                     col 10 tmptext->qual[z].text
                     row + 1
                     if (row + 2 > 60)
                         BREAK
                     endif
                   endfor
                   ROW +1
                 endif
               endfor
               for (l_cnt = 1 to comment->comments[x].nbr_comments)
                if (comment->comments[x]->list[l_cnt].comment_cd = REVIEW_NOTE_CD and
                        comment->comments[x]->list[l_cnt].task_assay_cd = temptaskassay)
                  if (review_note_found = 0)
                      if (ROW + comment->comments[x].nbr_comments >= 53)
                         BREAK
                      endif
                     if (step_seq != comment->comments[x].comment_sequence)
                       COL 1   comment->comments[x].comment_sequence "###"
                       COL 4   ") "
                     endif
                     COL 6  I18N_Captions->rev_com
                     step_seq = comment->comments[x].comment_sequence
                     ROW + 1
                  endif
                  review_note_found = 1
                  COL 10 comment->comments[x]->list[l_cnt].comment_dt_tm "@SHORTDATE4YR;;Q"
                    COL 20 ":  "
                  COL 23 comment->comments[x]->list[l_cnt].comment_prsnl_name
                  COL+1  ": "
                     ROW +1
                  print_text = comment->comments[x]->list[l_cnt].comment_text
                  print_text_routine
                 endif
               endfor
               holdrow = ROW
               for (l_cnt = 1 to comment->comments[x].nbr_comments)
                if (comment->comments[x]->list[l_cnt].trouble_ind > 0 and
                        comment->comments[x]->list[l_cnt].task_assay_cd = temptaskassay)
                  if (trouble_found = 0)
                     if (ROW + comment->comments[x].nbr_comments >= 53)
                        BREAK
                     endif
                     if (step_seq != comment->comments[x].comment_sequence)
                       COL 1   comment->comments[x].comment_sequence "###"
                       COL 4   ") "
                     endif
                     COL 6  I18N_Captions->trbl
                     step_seq = comment->comments[x].comment_sequence
                     ROW + 1
                  endif
                  trouble_found = 1
                  COL 10 "-"
                  COL + 1
                  print_text = comment->comments[x]->list[l_cnt].step
                  print_text_routine
                endif
               endfor
               if (ROW > holdrow)
                  ROW +1
               endif
               ;display the failed rules
               for (l_cnt = 1 to comment->comments[x].nbr_comments)
                if (comment->comments[x]->list[l_cnt].rule_ind > 0 and
                        comment->comments[x]->list[l_cnt].task_assay_cd = temptaskassay)
                  if (rule_found = 0)
                     if (ROW + comment->comments[x].nbr_comments >= 53)
                        BREAK
                     endif
                     if (step_seq != comment->comments[x].comment_sequence)
                       COL 1   comment->comments[x].comment_sequence "###"
                       COL 4   ") "
                     endif
                     COL 6  I18N_Captions->RULES_FAILED
                     step_seq = comment->comments[x].comment_sequence
                     ROW + 1
                  endif
                  rule_found = 1
                  COL 10 "-"
                  COL + 1
                  print_text = comment->comments[x]->list[l_cnt].rule_description
                  print_text_routine
                  if (l_cnt = comment->comments[x].nbr_comments)
                    ROW + 1
                  endif
                endif
               endfor
             endif
           endfor
        endif ;cms
      endif

;Generated by GNU enscript 1.6.4.
