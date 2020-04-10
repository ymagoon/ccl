DROP PROGRAM ndsc_common_utility :dba GO
CREATE PROGRAM ndsc_common_utility :dba
 IF ((validate (mpages_common_runtime_1_included ) = 0 ) )
  DECLARE mpages_common_runtime_1_included = i4 WITH persistscript
  FREE RECORD mpages_common_runtime_html
  RECORD mpages_common_runtime_html (
    1 temp_index = i4
    1 temp_text = vc
    1 temp_stat = i4
    1 direct_to_memory = i4
    1 has_space_padding = i4
    1 line_count = i4
    1 line [* ]
      2 content = vc
  ) WITH persistscript
  RECORD mpages_common_runtime_debug (
    1 temp_stat = i4
    1 temp_command = vc
    1 temp_error = i4
    1 temp_error_string = vc
    1 temp_datetimestr = vc
    1 temp_error_cnt = i4
    1 debug_level = i4
    1 parser_debug = i4
    1 debug_now = i4
    1 error_check = i4
    1 line_feed = vc
    1 debug_size = i4
    1 debug [* ]
      2 content = vc
      2 datetime = vc
    1 error_size = i4
    1 error [* ]
      2 content = vc
      2 number = i4
      2 datetime = vc
  ) WITH persistscript
  DECLARE writehtml (text ) = null WITH persistscript
  SUBROUTINE  writehtml (text )
   IF ((mpages_common_runtime_html->direct_to_memory = 1 ) )
    SET _memory_reply_string = concat (_memory_reply_string ,text ,char (10 ) )
   ELSE
    SET mpages_common_runtime_html->temp_text = mpages_common_runtime_cnvtnativetotext (text )
    SET mpages_common_runtime_html->line_count = (mpages_common_runtime_html->line_count + 1 )
    IF ((mod (mpages_common_runtime_html->line_count ,100 ) = 1 ) )
     SET mpages_common_runtime_html->temp_stat = alterlist (mpages_common_runtime_html->line ,(
      mpages_common_runtime_html->line_count + 99 ) )
    ENDIF
    SET mpages_common_runtime_html->line[mpages_common_runtime_html->line_count ].content =
    mpages_common_runtime_html->temp_text
   ENDIF
  END ;Subroutine
  DECLARE printhtmlmpage (nothing ) = null WITH persistscript
  SUBROUTINE  printhtmlmpage (nothing )
   IF ((mpages_common_runtime_html->direct_to_memory = 0 ) )
    DECLARE strtemp = vc WITH protect
    FOR (mpages_common_runtime_html_temp_index = 1 TO mpages_common_runtime_html->line_count )
     IF ((mpages_common_runtime_html->has_space_padding = 1 ) )
      SET strtemp = concat (strtemp ,replace (mpages_common_runtime_html->line[
        mpages_common_runtime_html_temp_index ].content ,"<SPACEPADDING/>" ,"" ) ,char (10 ) )
     ELSE
      SET strtemp = concat (strtemp ,mpages_common_runtime_html->line[
       mpages_common_runtime_html_temp_index ].content ,char (10 ) )
     ENDIF
     IF ((((mod (mpages_common_runtime_html_temp_index ,1 ) = 0 ) ) OR ((
     mpages_common_runtime_html_temp_index = mpages_common_runtime_html->line_count ) )) )
      SET _memory_reply_string = concat (_memory_reply_string ,strtemp )
      SET strtemp = ""
     ENDIF
    ENDFOR
   ENDIF
  END ;Subroutine
  DECLARE errorcheck3 ((strerror = vc (ref ) ) ,(strerrormessage = vc ) ) = i4 WITH persistscript
  SUBROUTINE  errorcheck3 (strerror ,strerrormessage )
   DECLARE mpages_common_runtime_interrorstatus = i4 WITH protect
   DECLARE mpages_common_runtime_interrormessage = vc WITH protect
   IF ((((mpages_common_runtime_debug->debug_level >= 0 )
   AND (mpages_common_runtime_debug->error_check = 0 ) ) OR ((mpages_common_runtime_debug->
   error_check = 1 ) )) )
    SET mpages_common_runtime_interrorstatus = 0
    CALL errorcheckmaster (mpages_common_runtime_interrormessage ,
     mpages_common_runtime_interrorstatus )
    IF ((mpages_common_runtime_interrorstatus > 0 ) )
     CALL writeerrorlog (strerrormessage )
    ENDIF
   ENDIF
   SET strerror = mpages_common_runtime_interrormessage
   RETURN (mpages_common_runtime_interrorstatus )
  END ;Subroutine
  DECLARE errorcheckmaster ((error_string = vc (ref ) ) ,(error_code = i4 (ref ) ) ) = i4 WITH
  persistscript
  SUBROUTINE  errorcheckmaster (error_string ,error_code )
   DECLARE strlongerrormessage = vc WITH protect
   IF ((((mpages_common_runtime_debug->debug_level >= 0 )
   AND (mpages_common_runtime_debug->error_check = 0 ) ) OR ((mpages_common_runtime_debug->
   error_check = 1 ) )) )
    SET mpages_common_runtime_debug->temp_error = 1
    SET mpages_common_runtime_debug->temp_error_cnt = 0
    WHILE ((mpages_common_runtime_debug->temp_error != 0 )
    AND (mpages_common_runtime_debug->temp_error_cnt < 20 ) )
     SET mpages_common_runtime_debug->temp_error = 0
     SET mpages_common_runtime_debug->temp_error_string = " "
     SET mpages_common_runtime_debug->temp_error = error (mpages_common_runtime_debug->
      temp_error_string ,0 )
     IF ((mpages_common_runtime_debug->temp_error > 0 ) )
      IF ((mpages_common_runtime_debug->temp_error_string > " " ) )
       SET strlongerrormessage = build2 (strlongerrormessage ,"!!!_ERROR_!!! " ,
        mpages_common_runtime_debug->temp_error_string ,";" )
      ENDIF
      SET mpages_common_runtime_debug->temp_error_cnt = (mpages_common_runtime_debug->temp_error_cnt
      + 1 )
      IF ((mpages_common_runtime_debug->debug_now = 1 ) )
       CALL mpages_common_runtime_writedebugfile (build2 ("*** ERROR: " ,mpages_common_runtime_debug
         ->temp_error_string ) )
      ELSE
       CALL mpages_common_runtime_writedebugrecord (build2 ("*** ERROR: " ,
         mpages_common_runtime_debug->temp_error_string ) ,1 )
       CALL mpages_common_runtime_writeerrorrecord (mpages_common_runtime_debug->temp_error_string ,
        mpages_common_runtime_debug->temp_error )
      ENDIF
     ENDIF
    ENDWHILE
    IF ((size (strlongerrormessage ) > 10000 ) )
     SET strlongerrormessage = substring ((size (strlongerrormessage ) - 10000 ) ,10000 ,
      strlongerrormessage )
    ENDIF
    SET error_string = strlongerrormessage
    SET error_code = mpages_common_runtime_debug->temp_error_cnt
   ELSE
    SET error_string = ""
    SET error_code = 0
   ENDIF
   SET mpages_common_runtime_debug->temp_error = 1
   SET mpages_common_runtime_debug->temp_error_cnt = 0
   WHILE ((mpages_common_runtime_debug->temp_error != 0 )
   AND (mpages_common_runtime_debug->temp_error_cnt < 100 ) )
    SET mpages_common_runtime_debug->temp_error = error (mpages_common_runtime_debug->
     temp_error_string ,0 )
    SET mpages_common_runtime_debug->temp_error_cnt = (mpages_common_runtime_debug->temp_error_cnt +
    1 )
   ENDWHILE
   RETURN (value (error_code ) )
  END ;Subroutine
  DECLARE writeerrorlog (text ) = null WITH persistscript
  SUBROUTINE  writeerrorlog (text )
   CALL mpages_common_runtime_writeerrorrecord (text ,0 )
   IF ((mpages_common_runtime_debug->debug_now = 1 ) )
    CALL mpages_common_runtime_writedebugfile (text )
   ELSE
    CALL mpages_common_runtime_writedebugrecord (text ,1 )
   ENDIF
  END ;Subroutine
  DECLARE writeparserdebug (text ) = null WITH persistscript
  SUBROUTINE  writeparserdebug (text )
   IF ((((mpages_common_runtime_debug->debug_level > 0 )
   AND (mpages_common_runtime_debug->parser_debug = 0 ) ) OR ((mpages_common_runtime_debug->
   parser_debug = 1 ) )) )
    IF ((mpages_common_runtime_debug->debug_now = 1 ) )
     CALL mpages_common_runtime_writedebugfile (mpages_common_runtime_cnvtnativetotext (text ) )
    ELSE
     CALL mpages_common_runtime_writedebugrecord (mpages_common_runtime_cnvtnativetotext (text ) ,0
      )
    ENDIF
   ENDIF
   CALL parser (text )
  END ;Subroutine
  DECLARE cleanjsontext ((text = vc ) ) = gc32768 WITH persistscript
  SUBROUTINE  cleanjsontext (text )
   DECLARE strtext = gc32768 WITH protect
   SET strtext = text
   SET strtext = replace (strtext ,"\" ,"\\" )
   SET strtext = replace (strtext ,'"' ,'\"' )
   SET strtext = replace (strtext ,"'" ,"\'" )
   SET strtext = replace (strtext ,char (10 ) ,"\n" )
   SET strtext = replace (strtext ,char (13 ) ,"" )
   RETURN (trim (strtext ,3 ) )
  END ;Subroutine
  FREE RECORD mpages_common_runtime_temp
  RECORD mpages_common_runtime_temp (
    1 temp_data_type = vc
  ) WITH persistscript
  DECLARE mpages_common_runtime_cnvtnativetotext (vdata ) = vc WITH persistscript
  SUBROUTINE  mpages_common_runtime_cnvtnativetotext (vdata )
   SET mpages_common_runtime_temp->temp_data_type = substring (1 ,1 ,reflect (vdata ) )
   IF ((mpages_common_runtime_temp->temp_data_type = "F" ) )
    IF ((cnvtdatetime (data ) > 0 )
    AND (data > 100000000000000.00 ) )
     SET mpages_common_runtime_temp->temp_data_type = "D"
    ENDIF
   ENDIF
   CASE (mpages_common_runtime_temp->temp_data_type )
    OF "C" :
     RETURN (vdata )
    OF "V" :
     RETURN (vdata )
    OF "D" :
     RETURN (format (vdata ,"DD-MMM-YYYY HH:MM:SS;;D" ) )
    OF "I" :
     RETURN (trim (format (vdata ,"###################" ) ,3 ) )
    OF "F" :
     RETURN (trim (format (vdata ,"###################.##" ) ,3 ) )
    ELSE
     RETURN (cnvtstring (vdata ) )
   ENDCASE
  END ;Subroutine
  DECLARE mpages_common_runtime_gethundredsec (time ) = i4 WITH persistscript
  SUBROUTINE  mpages_common_runtime_gethundredsec (time )
   DECLARE strtime = vc
   SET strtime = format (time ,"##########;R" )
   SET strtime = substring ((size (strtime ) - 1 ) ,2 ,strtime )
   RETURN (cnvtint (strtime ) )
  END ;Subroutine
  DECLARE mpages_common_runtime_writedebugrecord ((text = vc ) ,(date = i4 ) ) = null WITH
  persistscript
  SUBROUTINE  mpages_common_runtime_writedebugrecord (text ,date )
   SET mpages_common_runtime_debug->debug_size = (mpages_common_runtime_debug->debug_size + 1 )
   IF ((mod (mpages_common_runtime_debug->debug_size ,100 ) = 1 ) )
    SET mpages_common_runtime_debug->temp_stat = alterlist (mpages_common_runtime_debug->debug ,(
     mpages_common_runtime_debug->debug_size + 99 ) )
   ENDIF
   SET mpages_common_runtime_debug->debug[mpages_common_runtime_debug->debug_size ].content = text
   IF ((date = 0 ) )
    SET mpages_common_runtime_debug->debug[mpages_common_runtime_debug->debug_size ].datetime = ""
   ELSE
    SET mpages_common_runtime_debug->debug[mpages_common_runtime_debug->debug_size ].datetime =
    build2 (format (cnvtdatetime (curdate ,curtime3 ) ,"MM/DD/YYYY HH:MM:SS;;D" ) ,":" ,format (
      mpages_common_runtime_gethundredsec (curtime3 ) ,"##;RP0" ) )
   ENDIF
  END ;Subroutine
  DECLARE mpages_common_runtime_writeerrorrecord ((text = vc ) ,(number = i4 ) ) = null WITH
  persistscript
  SUBROUTINE  mpages_common_runtime_writeerrorrecord (text ,number )
   SET mpages_common_runtime_debug->error_size = (mpages_common_runtime_debug->error_size + 1 )
   IF ((mod (mpages_common_runtime_debug->error_size ,100 ) = 1 ) )
    SET mpages_common_runtime_debug->temp_stat = alterlist (mpages_common_runtime_debug->error ,(
     mpages_common_runtime_debug->error_size + 99 ) )
   ENDIF
   SET mpages_common_runtime_debug->error[mpages_common_runtime_debug->error_size ].content = text
   SET mpages_common_runtime_debug->error[mpages_common_runtime_debug->error_size ].number = number
   SET mpages_common_runtime_debug->error[mpages_common_runtime_debug->error_size ].datetime =
   build2 (format (cnvtdatetime (curdate ,curtime3 ) ,"MM/DD/YYYY HH:MM:SS:CC;;D" ) ,"." ,format (
     mpages_common_runtime_gethundredsec (curtime ) ,"##;RP0" ) )
  END ;Subroutine
  DECLARE mpages_common_runtime_writedebugfile ((strtext = vc ) ) = null WITH persistscript
  SUBROUTINE  mpages_common_runtime_writedebugfile (strtext )
   SET mpages_common_runtime_debug->temp_command = " "
   SET mpages_common_runtime_debug->temp_command = concat ("echo '" ,format (cnvtdatetime (curdate ,
      curtime3 ) ,"MM/DD/YYYY HH:MM:SS;;D" ) ,char (9 ) ,replace (strtext ,"'" ,"\'" ) ,"' >> " ,
    trim (cnvtlower (curprog ) ,3 ) ,".log" )
   CALL dcl (mpages_common_runtime_debug->temp_command ,size (mpages_common_runtime_debug->
     temp_command ) ,mpages_common_runtime_debug->temp_stat )
  END ;Subroutine
 ENDIF
 DECLARE ndscloggingnocheck ((inputstring = vc ) ,(filepath = vc ) ) = null WITH persistscript
 SUBROUTINE  ndscloggingnocheck (inputstring ,filepath )
  CALL localcmd (build2 ("echo " ,inputstring ," >> " ,filepath ,"acr_debug.log" ) ,0 ,0 )
 END ;Subroutine
 DECLARE localcmd ((shellcommand = vc ) ,(htmllinebreak = i4 ) ,(reportback = i4 ) ) = vc WITH
 persistscript
 SUBROUTINE  localcmd (shellcommand ,htmllinebreak ,reportback )
  FREE RECORD dcl_cmd
  RECORD dcl_cmd (
    1 list [* ]
      2 cmd = vc
  ) WITH persistscript
  DECLARE strconcatfile = vc
  DECLARE charcheck = vc
  DECLARE a = i4 WITH protect
  DECLARE b = i4 WITH protect
  DECLARE stat = i4
  DECLARE cmdlength = i4
  SET cmdlength = size (shellcommand ,1 )
  IF ((cmdlength > 300 ) )
   FOR (a = 1 TO cmdlength BY 300 )
    SET b = (b + 1 )
    SET stat = alterlist (dcl_cmd->list ,b )
    SET dcl_cmd->list[b ].cmd = substring (a ,300 ,shellcommand )
    SET charcheck = substring (1 ,1 ,dcl_cmd->list[b ].cmd )
    IF ((charcheck = "-" ) )
     IF ((b > 1 ) )
      SET dcl_cmd->list[b ].cmd = substring ((a + 1 ) ,300 ,shellcommand )
      SET dcl_cmd->list[(b - 1 ) ].cmd = build2 (dcl_cmd->list[(b - 1 ) ].cmd ,"-" )
     ELSE
      SET dcl_cmd->list[b ].cmd = build2 ("\-" ,substring ((a + 1 ) ,300 ,shellcommand ) )
     ENDIF
    ENDIF
   ENDFOR
   DECLARE strtest = vc
   SET strtest = cnvtrectojson (dcl_cmd )
   SET strconcatfile = build2 ("ndsc_ccl_cmd_" ,trim (cnvtstring (rand (0 ) ) ,3 ) ,".dat" )
   FOR (a = 1 TO size (dcl_cmd->list ,5 ) )
    SET dcl_cmd->list[a ].cmd = replace (dcl_cmd->list[a ].cmd ,"'" ,^'"'"'^ ,0 )
    SET dcl_cmd->list[a ].cmd = replace (dcl_cmd->list[a ].cmd ,"%" ,"%%" ,0 )
    SET dcl_cmd->list[a ].cmd = replace (dcl_cmd->list[a ].cmd ,"\" ,"\\" ,0 )
    CALL dclsend (build2 ("printf '" ,dcl_cmd->list[a ].cmd ,"' >> " ,strconcatfile ) ,0 ,0 )
   ENDFOR
   SET shellcommand = build2 ("sh " ,strconcatfile )
  ENDIF
  DECLARE cmdresponse = vc
  SET cmdresponse = dclsend (shellcommand ,htmllinebreak ,reportback )
  IF ((cmdlength > 300 ) )
   CALL dclsend (build2 ("rm -rf " ,strconcatfile ) ,0 ,0 )
  ENDIF
  RETURN (cmdresponse )
 END ;Subroutine
 DECLARE dclsend ((shellcommand = vc ) ,(htmllinebreak = i4 ) ,(reportback = i4 ) ) = vc WITH
 persistscript
 SUBROUTINE  dclsend (shellcommand ,htmllinebreak ,reportback )
  DECLARE struniquefilename = vc
  SET struniquefilename = build2 ("ndsc_ccl_cmd_" ,trim (cnvtstring (rand (0 ) ) ,3 ) ,".dat" )
  DECLARE dcllocaloutput = vc
  DECLARE dcllocalcmd = vc
  DECLARE dcllocallen = i4
  DECLARE dcllocalstatus = i4
  IF ((reportback = 1 ) )
   SET dcllocalcmd = build2 (trim (shellcommand ,3 ) ," > " ,struniquefilename )
   SET dcllocallen = size (trim (dcllocalcmd ) )
   SET dcllocalstatus = 0
   CALL dcl (dcllocalcmd ,dcllocallen ,dcllocalstatus )
   SET dcllocaloutput = readfromfile (struniquefilename ,htmllinebreak )
   DECLARE dcllocalstatusb = i4
   SET dcllocalcmd = build2 ("rm -rf " ,struniquefilename )
   SET dcllocallen = size (trim (dcllocalcmd ) )
   SET dcllocalstatusb = 0
   CALL dcl (dcllocalcmd ,dcllocallen ,dcllocalstatusb )
  ELSE
   SET dcllocallen = size (trim (shellcommand ) )
   SET dcllocalstatus = 0
   CALL dcl (shellcommand ,dcllocallen ,dcllocalstatus )
   SET dcllocaloutput = ""
  ENDIF
  RETURN (dcllocaloutput )
 END ;Subroutine
 DECLARE removespecialchars ((text = vc ) ) = c10000 WITH persistscript
 SUBROUTINE  removespecialchars (text )
  DECLARE strtext = vc WITH protect
  SET strtext = text
  SET strtext = replace (strtext ,"\" ,"" ,0 )
  SET strtext = replace (strtext ,"/" ,"" ,0 )
  SET strtext = replace (strtext ,'"' ,"" ,0 )
  SET strtext = replace (strtext ,"&" ,"" ,0 )
  SET strtext = replace (strtext ,"?" ,"" ,0 )
  SET strtext = replace (strtext ,"=" ,"" ,0 )
  SET strtext = replace (strtext ,"'" ,"" ,0 )
  RETURN (strtext )
 END ;Subroutine
 DECLARE base64_encode ((input_str = vc ) ) = vc WITH persistscript
 SUBROUTINE  base64_encode (input_str )
  SET my64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  DECLARE s1 = vc WITH protect
  DECLARE encode = vc WITH protect
  DECLARE x = i4 WITH protect
  DECLARE y = i4 WITH protect
  DECLARE s1_len = i4 WITH protect
  DECLARE s1_size = i4 WITH protect
  SET s1 = input_str
  SET s1_len = mod (size (s1 ) ,3 )
  SET s1_size = size (s1 )
  SET s1_len = evaluate (s1_len ,0 ,0 ,(3 - s1_len ) )
  SET s1 = concat (s1 ,fillstring (value (s1_len ) ,"" ) )
  FOR (x = 1 TO size (s1 ) BY 3 )
   IF (((x + 2 ) > s1_size ) )
    SET s1_len = mod (s1_size ,3 )
   ELSE
    SET s1_len = 3
   ENDIF
   FOR (y = 1 TO 4 )
    CASE (y )
     OF 1 :
      SET encode = concat (encode ,substring (((ichar (substring (x ,1 ,s1 ) ) / 4 ) + 1 ) ,1 ,my64
        ) )
     OF 2 :
      SET encode = concat (encode ,substring ((bor ((band (ichar (substring (x ,1 ,s1 ) ) ,3 ) * 16
         ) ,(band (ichar (substring ((x + 1 ) ,1 ,s1 ) ) ,240 ) / 16 ) ) + 1 ) ,1 ,my64 ) )
     OF 3 :
      IF ((s1_len > 1 ) )
       SET encode = concat (encode ,substring ((bor ((band (ichar (substring ((x + 1 ) ,1 ,s1 ) ) ,
           15 ) * 4 ) ,(band (ichar (substring ((x + 2 ) ,1 ,s1 ) ) ,192 ) / 64 ) ) + 1 ) ,1 ,my64 )
        )
      ELSE
       SET encode = concat (encode ,"=" )
      ENDIF
     ELSE
      IF ((s1_len > 2 ) )
       SET encode = concat (encode ,substring ((band (ichar (substring ((x + 2 ) ,1 ,s1 ) ) ,63 ) +
         1 ) ,1 ,my64 ) )
      ELSE
       SET encode = concat (encode ,"=" )
      ENDIF
    ENDCASE
   ENDFOR
  ENDFOR
  RETURN (encode )
 END ;Subroutine
END GO