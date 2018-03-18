 ;;Solution_Test/script/PathNet -- Gen Lab/glb_rpt_macros/glb_rpt_macros.inc Turn on black mode

;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    *001 01/05/98 Kurt Gugler          new routine to blank out line data  *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
/*********************************************************/
/* Macros used by report-generating General Lab programs */
/*********************************************************/

        macro(print_report_data)

           for (i = 1 to limit)
              ;* Check whether there is room on this page for the next order;
              ;* if not, then force a page break by incrementing row.
              ;* NOTE: if order is too big to fit all of it on one page, then 
              ;* don't page-break.
              saverow = row
              nbr_rows_left = report_data->qual[i]->detailcount
              if ((nbr_rows_left > 0)
              and ((nbr_rows_left + saverow) > 60)
              and (nbr_rows_left < 44))
                 while (saverow < 60)
                    row + 1
                    saverow = saverow + 1
                 endwhile
              endif

              ;* Print a detail line from the array, then blank it out
              col 0, report_data->qual[i]->printline
              row + 1
;001              call store_item(0, i, blank_line)
              call blank_item(0, i, blank_line)                            ;001
              report_data->qual[i]->detailcount = 0
           endfor
           limit = 0

        endmacro


        ;* Macro to format a numeric result the following arguments
        ;* should be filled out before calling:
        ;*   arg_min_digits      - Minimum number of digits
        ;*   arg_max_digits      - Maximum number of digits
        ;*   arg_min_dec_places  - Minimum number of decimal places
        ;*   arg_less_great_flag - Less Than/Greater Than flag value
        ;*   arg_raw_value       - Raw value of the number to format
        macro (format_numeric_result)
           whole_digits = 0
           dec_digits = 0
           length = 0
           formatted->template = fillstring(33, " ")
;jdf           formatted->result_value = fillstring(36, " ")
           formatted->result_value = fillstring(50, " ")                ;jdf
           ;call echo("Begin Format Numeric")
           ;call echo(build("Min digits =", arg_min_digits))
           ;call echo(build("Max digits =", arg_max_digits))
           ;call echo(build("Decimals =", arg_min_dec_places))
           ;call echo(build("Less/Great flag =", arg_less_great_flag))
           ;call echo(build("Raw Value =", arg_raw_value))
        
           formatted->result_value =                                    ;jdf
              uar_fmt_result(arg_min_digits, arg_max_digits,            ;jdf
              arg_min_dec_places, arg_less_great_flag, arg_raw_value)   ;jdf
/* jdf
           ;*
           ;* If raw value is negative, remove the - in order to format
           ;*
           if (arg_min_dec_places < 0 or arg_min_dec_places > 16)
              ;call echo ("default decimal")
              arg_min_dec_places = 0
           endif
           if (arg_min_digits < 0 or arg_min_digits > 32)
              ;call echo ("default min")
              arg_min_digits = 1
           endif
           if (arg_max_digits < 0 or arg_max_digits > 32)
              ;call echo ("default max")
              arg_max_digits = 8
           endif
           if (arg_raw_value < 0)
              formatted->negative_ind = 1
              arg_raw_value = abs(arg_raw_value)
           else
              formatted->negative_ind = 0
           endif
           
           ;*
           ;* If raw value is a floating point,  round raw value to the 
           ;* proper precision
           ;*
           if (arg_min_dec_places > 0)
              arg_raw_value = round(arg_raw_value, arg_min_dec_places)
           endif
        
           ;*
           ;* Format the raw value
           ;*
           formatted->template = 
             format(arg_raw_value,"################.################;P0;F")
           ;call echo(build("Template =", formatted->template))
        
           if (arg_min_dec_places > 0)
              whole_digits = 
                minval(40,abs(arg_max_digits - arg_min_dec_places))
              dec_digits = minval(20, abs(arg_min_dec_places))
              length = movestring(formatted->template, 17 - whole_digits, 
                formatted->result_value, 1, whole_digits + dec_digits + 1)
              ;* Size to minimum if necessary
              while (length > arg_min_digits + 1
                and  substring(1, 1, formatted->result_value) = "0")
                length = length - 1
                 formatted->result_value = 
                   substring(2, length, formatted->result_value)
              endwhile
           else
              whole_digits = minval(40,abs(arg_max_digits))
              dec_digits = 0
              length = movestring(formatted->template, 17 - whole_digits, 
                formatted->result_value, 1, whole_digits)
              ;* Size to minimum if necessary
              while (length > arg_min_digits
                and  substring(1, 1, formatted->result_value) = "0")
                length = length - 1
                 formatted->result_value = 
                   substring(2, length, formatted->result_value)
              endwhile
           endif
           
           ;*
           ;* If number is negative, prefix the result with a -
           ;*
           if (formatted->negative_ind = 1)
              formatted->result_value = 
                concat("-", trim(formatted->result_value))
           endif
        
           ;*
           ;* If less_great_flag is used, prefix the result with 
           ;* the proper symbol.
           ;*
           case (arg_less_great_flag)
             of 1:   ;* less than
                formatted->result_value = 
                  concat("<", trim(formatted->result_value))
             of 2:   ;* greater than
                formatted->result_value = 
                  concat(">", trim(formatted->result_value))
             of 3:   ;* less than or equal to
                formatted->result_value = 
                  concat("<=", trim(formatted->result_value))
             of 4:   ;* greater than or equal to
                formatted->result_value = 
                  concat(">=", trim(formatted->result_value))
           endcase

jdf */        
           ;call echo(build("Formatted Result Value:", 
           ;  formatted->result_value))
           ;call echo("End Format Numeric")
           ;call echo(" ")
        endmacro
   
        ;* Macro to convert rtf text to ascii text.  The following
        ;* argument should be filled out before calling:
        ;*   arg_text_in      - Input text in rtf format
        macro (rtf_to_ascii)
           text_out = fillstring(30000, " ")
           text_out_len = 0
           ;call echo(build("text_in =", arg_text_in))
           ;call echo(build("text_in size =", size(trim(arg_text_in))))
           output_buffer_len = 0

           call uar_rtf(arg_text_in, size(trim(arg_text_in)), 
                        text_out, size(text_out),
                        output_buffer_len, 1)

           ;call echo(build("text_out =", text_out))
           ;call echo(build("text_out size =", size(trim(text_out))))
           ;call echo(build("output_buffer_len =", output_buffer_len))
        endmacro

;Generated by GNU enscript 1.6.4.
