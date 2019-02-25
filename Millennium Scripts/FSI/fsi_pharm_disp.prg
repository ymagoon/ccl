DROP PROGRAM fsi_pharm_disp :dba GO
CREATE PROGRAM fsi_pharm_disp :dba
 CALL echo ("<==================== Entering FSI_PHARM_DISP Script ====================>" )
 CALL echo ("MOD: 025" )
 CALL echo ("<===== ESO_HL7_FORMATTING.INC  START =====>" )
 CALL echo ("MOD:048" )
 CALL echo ("<===== ESO_COMMON_ROUTINES.INC  START =====>" )
 CALL echo ("MOD:021" )
 CALL echo ("<===== ESO_GET_CODE.INC Begin =====>" )
 CALL echo ("MOD:008" )
 DECLARE eso_get_code_meaning (code ) = c12
 DECLARE eso_get_code_display (code ) = c40
 DECLARE eso_get_meaning_by_codeset (x_code_set ,x_meaning ) = f8
 DECLARE eso_get_code_set (code ) = i4
 DECLARE eso_get_alias_or_display (code ,contrib_src_cd ) = vc
 SUBROUTINE  eso_get_code_meaning (code )
  CALL echo ("Entering eso_get_code_meaning subroutine" )
  CALL echo (build ("    code=" ,code ) )
  FREE SET t_meaning
  DECLARE t_meaning = c12
  SET t_meaning = fillstring (12 ," " )
  IF ((code > 0 ) )
   IF (validate (readme_data ,0 ) )
    CALL echo ("    A Readme is calling this script" )
    CALL echo ("    selecting rows from code_value table" )
    SELECT INTO "nl:"
     cv.*
     FROM (code_value cv )
     WHERE (cv.code_value = code )
     AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.active_ind = 1 )
     DETAIL
      t_meaning = cv.cdf_meaning
     WITH maxqual (cv ,1 )
    ;end select
    IF ((curqual < 1 ) )
     CALL echo ("    no rows qualified on code_value table" )
    ENDIF
   ELSE
    SET t_meaning = uar_get_code_meaning (cnvtreal (code ) )
    IF ((trim (t_meaning ) = "" ) )
     CALL echo ("    uar_get_code_meaning failed" )
     CALL echo ("    selecting row from code_value table" )
     SELECT INTO "nl:"
      cv.*
      FROM (code_value cv )
      WHERE (cv.code_value = code )
      AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.active_ind = 1 )
      DETAIL
       t_meaning = cv.cdf_meaning
      WITH maxqual (cv ,1 )
     ;end select
     IF ((curqual < 1 ) )
      CALL echo ("    no rows qualified on code_value table" )
     ENDIF
    ENDIF
   ENDIF
  ENDIF
  CALL echo (build ("    t_meaning=" ,t_meaning ) )
  CALL echo ("Exiting eso_get_code_meaning subroutine" )
  RETURN (trim (t_meaning ,3 ) )
 END ;Subroutine
 SUBROUTINE  eso_get_code_display (code )
  CALL echo ("Entering eso_get_code_display subroutine" )
  CALL echo (build ("    code=" ,code ) )
  FREE SET t_display
  DECLARE t_display = c40
  SET t_display = fillstring (40 ," " )
  IF ((code > 0 ) )
   IF (validate (readme_data ,0 ) )
    CALL echo ("   A Readme is calling this script" )
    CALL echo ("   Selecting rows from code_value table" )
    SELECT INTO "nl:"
     cv.*
     FROM (code_value cv )
     WHERE (cv.code_value = code )
     AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.active_ind = 1 )
     DETAIL
      t_display = cv.display
     WITH maxqual (cv ,1 )
    ;end select
    IF ((curqual < 1 ) )
     CALL echo ("    no rows qualified on code_value table" )
    ENDIF
   ELSE
    SET t_display = uar_get_code_display (cnvtreal (code ) )
    IF ((trim (t_display ) = "" ) )
     CALL echo ("    uar_get_code_display failed" )
     CALL echo ("    selecting row from code_value table" )
     SELECT INTO "nl:"
      cv.*
      FROM (code_value cv )
      WHERE (cv.code_value = code )
      AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.active_ind = 1 )
      DETAIL
       t_display = cv.display
      WITH maxqual (cv ,1 )
     ;end select
     IF ((curqual < 1 ) )
      CALL echo ("    no rows qualified on code_value table" )
     ENDIF
    ENDIF
   ENDIF
  ENDIF
  CALL echo (build ("    t_display=" ,t_display ) )
  CALL echo ("Exiting eso_get_code_display subroutine" )
  RETURN (trim (t_display ,3 ) )
 END ;Subroutine
 SUBROUTINE  eso_get_meaning_by_codeset (x_code_set ,x_meaning )
  CALL echo ("Entering eso_get_meaning_by_codeset subroutine" )
  CALL echo (build ("    code_set=" ,x_code_set ) )
  CALL echo (build ("    meaning=" ,x_meaning ) )
  FREE SET t_code
  DECLARE t_code = f8
  SET t_code = 0.0
  IF ((x_code_set > 0 )
  AND (trim (x_meaning ) > "" ) )
   FREE SET t_meaning
   DECLARE t_meaning = c12
   SET t_meaning = fillstring (12 ," " )
   SET t_meaning = x_meaning
   FREE SET t_rc
   IF (validate (readme_data ,0 ) )
    CALL echo ("   A Readme is calling this script" )
    CALL echo ("   Selecting rows from code_value table" )
    SELECT INTO "nl:"
     cv.*
     FROM (code_value cv )
     WHERE (cv.code_set = x_code_set )
     AND (cv.cdf_meaning = trim (x_meaning ) )
     AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.active_ind = 1 )
     DETAIL
      t_code = cv.code_value
     WITH maxqual (cv ,1 )
    ;end select
    IF ((curqual < 1 ) )
     CALL echo ("    no rows qualified on code_value table" )
    ENDIF
   ELSE
    SET t_rc = uar_get_meaning_by_codeset (cnvtint (x_code_set ) ,nullterm (t_meaning ) ,1 ,t_code )
    IF ((t_code <= 0 ) )
     CALL echo ("    uar_get_meaning_by_codeset failed" )
     CALL echo ("    selecting row from code_value table" )
     SELECT INTO "nl:"
      cv.*
      FROM (code_value cv )
      WHERE (cv.code_set = x_code_set )
      AND (cv.cdf_meaning = trim (x_meaning ) )
      AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.active_ind = 1 )
      DETAIL
       t_code = cv.code_value
      WITH maxqual (cv ,1 )
     ;end select
     IF ((curqual < 1 ) )
      CALL echo ("    no rows qualified on code_value table" )
     ENDIF
    ENDIF
   ENDIF
  ENDIF
  CALL echo (build ("    t_code=" ,t_code ) )
  CALL echo ("Exiting eso_get_meaning_by_codeset subroutine" )
  RETURN (t_code )
 END ;Subroutine
 SUBROUTINE  eso_get_code_set (code )
  CALL echo ("Entering eso_get_code_set subroutine" )
  CALL echo (build ("    code=" ,code ) )
  DECLARE icode_set = i4 WITH private ,noconstant (0 )
  IF ((code > 0 ) )
   IF (validate (readme_data ,0 ) )
    CALL echo ("   A Readme is calling this script" )
    CALL echo ("   Selecting rowS from code_value table" )
    SELECT INTO "nl:"
     cv.code_set
     FROM (code_value cv )
     WHERE (cv.code_value = code )
     AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.active_ind = 1 )
     DETAIL
      icode_set = cv.code_set
     WITH maxqual (cv ,1 )
    ;end select
    IF ((curqual < 1 ) )
     CALL echo ("    no rows qualified on code_value table" )
    ENDIF
   ELSE
    SET icode_set = uar_get_code_set (cnvtreal (code ) )
    IF (NOT ((icode_set > 0 ) ) )
     CALL echo ("    uar_get_code_set failed" )
     CALL echo ("    selecting row from code_value table" )
     SELECT INTO "nl:"
      cv.code_set
      FROM (code_value cv )
      WHERE (cv.code_value = code )
      AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
      AND (cv.active_ind = 1 )
      DETAIL
       icode_set = cv.code_set
      WITH maxqual (cv ,1 )
     ;end select
     IF ((curqual < 1 ) )
      CALL echo ("    no rows qualified on code_value table" )
     ENDIF
    ENDIF
   ENDIF
  ENDIF
  CALL echo (build ("    Code_set=" ,icode_set ) )
  CALL echo ("Exiting eso_get_code_set subroutine" )
  RETURN (icode_set )
 END ;Subroutine
 SUBROUTINE  eso_get_alias_or_display (code ,contrib_src_cd )
  CALL echo ("Entering eso_get_alias_or_display" )
  CALL echo (build ("   code            = " ,code ) )
  CALL echo (build ("   contrib_src_cd = " ,contrib_src_cd ) )
  FREE SET t_alias_or_display
  DECLARE t_alias_or_display = vc
  SET t_alias_or_display = " "
  IF (NOT ((code > 0.0 ) ) )
   RETURN (t_alias_or_display )
  ENDIF
  IF ((contrib_src_cd > 0.0 ) )
   SELECT INTO "nl:"
    cvo.alias
    FROM (code_value_outbound cvo )
    WHERE (cvo.code_value = code )
    AND (cvo.contributor_source_cd = contrib_src_cd )
    DETAIL
     IF ((cvo.alias > "" ) ) t_alias_or_display = cvo.alias
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  IF ((size (trim (t_alias_or_display ) ) = 0 ) )
   CALL echo ("Alias not found, checking code value display" )
   SET t_alias_or_display = eso_get_code_display (code )
  ENDIF
  CALL echo ("Exiting eso_get_alias_or_display" )
  RETURN (t_alias_or_display )
 END ;Subroutine
 CALL echo ("<===== ESO_GET_CODE.INC End =====>" )
 DECLARE get_esoinfo_long_index (sea_name ) = i4
 DECLARE get_esoinfo_long (sea_name ) = i4
 DECLARE set_esoinfo_long (sea_name ,lvalue ) = i4
 DECLARE get_esoinfo_string_index (sea_name ) = i4
 DECLARE get_esoinfo_string (sea_name ) = c200
 DECLARE set_esoinfo_string (sea_name ,svalue ) = i4
 DECLARE get_esoinfo_double_index (sea_name ) = i4
 DECLARE get_esoinfo_double (sea_name ) = f8
 DECLARE set_esoinfo_double (sea_name ,dvalue ) = i4
 DECLARE get_request_long_index (sea_name ) = i4
 DECLARE get_request_long (sea_name ) = i4
 DECLARE set_request_long (sea_name ,lvalue ) = i4
 DECLARE get_reqinfo_double_index (sea_name ) = i4
 DECLARE get_reqinfo_double (sea_name ) = f8
 DECLARE set_reqinfo_double (sea_name ,dvalue ) = i4
 DECLARE get_reqinfo_string_index (sea_name ) = i4
 DECLARE get_reqinfo_string (sea_name ) = c200
 DECLARE set_reqinfo_string (sea_name ,svalue ) = i4
 DECLARE eso_trim_zeros (number ) = c20
 DECLARE eso_trim_zeros_pos (number ,pos ) = c20
 DECLARE eso_trim_zeros_sig_dig ((number = f8 ) ,(sig_dig = i4 ) ) = c20
 DECLARE eso_remove_decimal (snumber ) = vc
 DECLARE parse_formatting_string (f_string ,arg ) = vc
 DECLARE get_int_routine_arg ((arg = vc ) ,(args = vc ) ) = i4
 DECLARE eso_column_exists (tablename ,columnname ) = i4
 DECLARE eso_pharm_decimal (decimal_val ) = vc
 DECLARE get_routine_arg_value (name ) = vc
 DECLARE rtfformatingremove ((srtfstring = vc ) ) = vc
 DECLARE get_synoptic_nomen_config ((name = vc ) ) = vc
 DECLARE routine_arg_exists ((name = vc ) ) = i2
 DECLARE additional_character_exists ((arg_string = vc ) ,(arg_string_size = i4 ) ,(start_idx = i4 )
  ,(search_increment = i4 ) ) = i2
 DECLARE search_forward = i4 WITH protect ,constant (1 )
 DECLARE search_backward = i4 WITH protect ,constant (- (1 ) )
 DECLARE uar_rtf2 ((p1 = vc (ref ) ) ,(p2 = i4 (ref ) ) ,(p3 = vc (ref ) ) ,(p4 = i4 (ref ) ) ,(p5 =
  i4 (ref ) ) ,(p6 = i4 (ref ) ) ) = i4
 SUBROUTINE  get_esoinfo_long_index (sea_name )
  SET list_size = 0
  SET list_size = size (context->cerner.longlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.longlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     RETURN (eso_x )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_esoinfo_long (sea_name )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (context->cerner.longlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.longlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   RETURN (context->cerner.longlist[eso_idx ].lval )
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  set_esoinfo_long (sea_name ,lvalue )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (context->cerner.longlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.longlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   SET context->cerner.longlist[eso_idx ].lval = lvalue
   RETURN (0 )
  ELSE
   SET list_size = 0
   SET list_size = size (context->cerner.longlist ,5 )
   SET eso_idx = 0
   SET eso_idx = (list_size + 1 )
   SET stat = alterlist (context->cerner.longlist ,eso_idx )
   SET context->cerner.longlist[eso_idx ].strmeaning = cnvtlower (sea_name )
   SET context->cerner.longlist[eso_idx ].lval = lvalue
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  get_esoinfo_string_index (sea_name )
  SET list_size = 0
  SET list_size = size (context->cerner.stringlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.stringlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     RETURN (eso_x )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_esoinfo_string (sea_name )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (context->cerner.stringlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.stringlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   RETURN (context->cerner.stringlist[eso_idx ].strval )
  ENDIF
  RETURN (" " )
 END ;Subroutine
 SUBROUTINE  set_esoinfo_string (sea_name ,svalue )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (context->cerner.stringlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.stringlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   SET context->cerner.stringlist[eso_idx ].strval = svalue
   RETURN (0 )
  ELSE
   SET list_size = 0
   SET list_size = size (context->cerner.stringlist ,5 )
   SET eso_idx = 0
   SET eso_idx = (list_size + 1 )
   SET stat = alterlist (context->cerner.stringlist ,eso_idx )
   SET context->cerner.stringlist[eso_idx ].strmeaning = cnvtlower (sea_name )
   SET context->cerner.stringlist[eso_idx ].strval = svalue
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  get_esoinfo_double_index (sea_name )
  SET list_size = 0
  SET list_size = size (context->cerner.doublelist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.doublelist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     RETURN (eso_x )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_esoinfo_double (sea_name )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (context->cerner.doublelist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.doublelist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   RETURN (context->cerner.doublelist[eso_idx ].dval )
  ENDIF
  RETURN (0.0 )
 END ;Subroutine
 SUBROUTINE  set_esoinfo_double (sea_name ,dvalue )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (context->cerner.doublelist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((context->cerner.doublelist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   SET context->cerner.doublelist[eso_idx ].dval = dvalue
   RETURN (0 )
  ELSE
   SET list_size = 0
   SET list_size = size (context->cerner.doublelist ,5 )
   SET eso_idx = 0
   SET eso_idx = (list_size + 1 )
   SET stat = alterlist (context->cerner.doublelist ,eso_idx )
   SET context->cerner.doublelist[eso_idx ].strmeaning = cnvtlower (sea_name )
   SET context->cerner.doublelist[eso_idx ].dval = dvalue
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  get_request_long_index (sea_name )
  SET list_size = 0
  SET list_size = size (request->esoinfo.longlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.longlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     RETURN (eso_x )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_request_long (sea_name )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (request->esoinfo.longlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.longlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   RETURN (request->esoinfo.longlist[eso_idx ].lval )
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  set_request_long (sea_name ,lvalue )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (request->esoinfo.longlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.longlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   SET request->esoinfo.longlist[eso_idx ].lval = lvalue
   RETURN (0 )
  ELSE
   SET list_size = 0
   SET list_size = size (request->esoinfo.longlist ,5 )
   SET eso_idx = 0
   SET eso_idx = (list_size + 1 )
   SET stat = alterlist (request->esoinfo.longlist ,eso_idx )
   SET request->esoinfo.longlist[eso_idx ].strmeaning = cnvtlower (sea_name )
   SET request->esoinfo.longlist[eso_idx ].lval = lvalue
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  get_reqinfo_double_index (sea_name )
  SET list_size = 0
  SET list_size = size (request->esoinfo.doublelist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.doublelist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     RETURN (eso_x )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_reqinfo_double (sea_name )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (request->esoinfo.doublelist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.doublelist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   RETURN (request->esoinfo.doublelist[eso_idx ].dval )
  ENDIF
  RETURN (0.0 )
 END ;Subroutine
 SUBROUTINE  set_reqinfo_double (sea_name ,dvalue )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (request->esoinfo.doublelist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.doublelist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   SET request->esoinfo.doublelist[eso_idx ].dval = dvalue
   RETURN (0 )
  ELSE
   SET list_size = 0
   SET list_size = size (request->esoinfo.doublelist ,5 )
   SET eso_idx = 0
   SET eso_idx = (list_size + 1 )
   SET stat = alterlist (request->esoinfo.doublelist ,eso_idx )
   SET request->esoinfo.doublelist[eso_idx ].strmeaning = cnvtlower (sea_name )
   SET request->esoinfo.doublelist[eso_idx ].dval = dvalue
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  get_reqinfo_string_index (sea_name )
  SET list_size = 0
  SET list_size = size (request->esoinfo.stringlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.stringlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     RETURN (eso_x )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_reqinfo_string (sea_name )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (request->esoinfo.stringlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.stringlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   RETURN (request->esoinfo.stringlist[eso_idx ].strval )
  ENDIF
  RETURN (" " )
 END ;Subroutine
 SUBROUTINE  set_reqinfo_string (sea_name ,svalue )
  SET eso_idx = 0
  SET list_size = 0
  SET list_size = size (request->esoinfo.stringlist ,5 )
  IF ((list_size > 0 ) )
   SET eso_x = 1
   FOR (eso_x = eso_x TO list_size )
    IF ((request->esoinfo.stringlist[eso_x ].strmeaning = cnvtlower (sea_name ) ) )
     SET eso_idx = eso_x
    ENDIF
   ENDFOR
  ENDIF
  IF ((eso_idx > 0 ) )
   SET request->esoinfo.stringlist[eso_idx ].strval = svalue
   RETURN (0 )
  ELSE
   SET list_size = 0
   SET list_size = size (request->esoinfo.stringlist ,5 )
   SET eso_idx = 0
   SET eso_idx = (list_size + 1 )
   SET stat = alterlist (request->esoinfo.stringlist ,eso_idx )
   SET request->esoinfo.stringlist[eso_idx ].strmeaning = cnvtlower (sea_name )
   SET request->esoinfo.stringlist[eso_idx ].strval = svalue
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_trim_zeros (number )
  CALL echo ("Entering eso_trim_zeros subroutine" )
  FREE SET t_initial
  FREE SET t_length
  FREE SET t_decimal
  FREE SET t_last_sig
  FREE SET t_final
  FREE SET t_i
  SET t_initial = build (number )
  SET t_length = size (t_initial )
  SET t_decimal = findstring ("." ,t_initial ,1 )
  SET t_final = trim (t_initial ,3 )
  CALL echo (build ("    number=" ,number ) )
  CALL echo (build ("    t_initial=" ,t_initial ) )
  IF ((t_decimal > 0 ) )
   SET t_last_sig = (t_decimal - 1 )
   SET t_i = 0
   FOR (t_i = (t_decimal + 1 ) TO t_length )
    IF ((substring (t_i ,1 ,t_initial ) > "0" ) )
     SET t_last_sig = t_i
    ENDIF
   ENDFOR
   SET t_final = trim (substring (1 ,t_last_sig ,t_initial ) ,3 )
  ENDIF
  FREE SET t_initial
  FREE SET t_length
  FREE SET t_decimal
  FREE SET t_last_sig
  FREE SET t_i
  CALL echo (build ("    t_final=" ,t_final ) )
  CALL echo ("Exiting eso_trim_zeros subroutine" )
  RETURN (t_final )
 END ;Subroutine
 SUBROUTINE  eso_trim_zeros_pos (number ,pos )
  CALL echo ("Entering eso_trim_zeros_pos subroutine" )
  FREE SET t_initial
  FREE SET t_length
  FREE SET t_decimal
  FREE SET t_last_sig
  FREE SET t_final
  FREE SET t_i
  SET t_initial = build (number )
  SET t_length = size (t_initial )
  SET t_decimal = findstring ("." ,t_initial ,1 )
  SET t_final = trim (t_initial )
  IF ((t_decimal > 0 ) )
   SET t_decimal = (t_decimal + pos )
   SET t_last_sig = t_decimal
   SET t_i = 0
   FOR (t_i = (t_decimal + 1 ) TO t_length )
    IF ((substring (t_i ,1 ,t_initial ) > "0" ) )
     SET t_last_sig = t_i
    ENDIF
   ENDFOR
   SET t_final = trim (substring (1 ,t_last_sig ,t_initial ) )
  ENDIF
  FREE SET t_initial
  FREE SET t_length
  FREE SET t_decimal
  FREE SET t_last_sig
  FREE SET t_i
  CALL echo (build ("    t_final=" ,t_final ) )
  CALL echo ("Exiting eso_trim_zeros_pos subroutine" )
  RETURN (t_final )
 END ;Subroutine
 SUBROUTINE  eso_trim_zeros_sig_dig (number ,sig_dig )
  CALL echo ("Entering eso_trim_zeros_sig_dig subroutine" )
  DECLARE strzeros = vc WITH private ,noconstant ("" )
  SET strzeros = eso_trim_zeros (trim (cnvtstring (number ,20 ,value (sig_dig ) ) ) )
  CALL echo ("Exiting eso_trim_zeros_sig_dig subroutine" )
  RETURN (strzeros )
 END ;Subroutine
 SUBROUTINE  parse_formatting_string (f_string ,arg )
  CALL echo ("Entering parse_formatting_string() subroutine" )
  DECLARE p_pos = i2 WITH private ,noconstant (0 )
  DECLARE c_pos = i2 WITH private ,noconstant (0 )
  DECLARE argument = vc WITH private ,noconstant ("" )
  DECLARE f_string_len = i4 WITH private ,noconstant (0 )
  SET f_string = trim (f_string ,3 )
  SET f_string_len = size (f_string ,1 )
  CALL echo (build ("arg      =" ,arg ) )
  CALL echo (build ("f_string =" ,f_string ) )
  IF (f_string_len )
   IF (arg )
    SET p_pos = 0
    FOR (x_i = 1 TO arg )
     SET c_pos = findstring ("," ,f_string ,(p_pos + 1 ) )
     IF ((x_i = arg ) )
      IF ((p_pos > 0 )
      AND (c_pos = 0 ) )
       SET argument = substring ((p_pos + 1 ) ,(f_string_len - p_pos ) ,f_string )
      ELSE
       SET argument = substring ((p_pos + 1 ) ,(c_pos - (p_pos + 1 ) ) ,f_string )
      ENDIF
     ENDIF
     SET p_pos = c_pos
    ENDFOR
   ELSE
    CALL echo ("ERROR!! a valid argument number was not passed in" )
   ENDIF
  ELSE
   CALL echo ("ERROR!! a valid formatting string was not passed in" )
  ENDIF
  CALL echo ("Exiting parse_formatting_string() subroutine" )
  RETURN (argument )
 END ;Subroutine
 SUBROUTINE  eso_remove_decimal (number )
  CALL echo ("Entering eso_remove_decimal() subroutine" )
  DECLARE t_pos = i4 WITH private ,noconstant (0 )
  DECLARE t_number = vc WITH private ,noconstant ("" )
  SET t_number = build (number )
  CALL echo (build ("t_number = " ,t_number ) )
  SET t_pos = findstring ("." ,t_number )
  IF (t_pos )
   SET t_number = substring (1 ,(t_pos + 2 ) ,t_number )
   CALL echo (build ("t_number = " ,t_number ) )
   SET t_number = trim (replace (t_number ,"." ,"" ,1 ) ,3 )
   CALL echo (build ("t_number = " ,t_number ) )
  ENDIF
  CALL echo ("Exiting eso_remove_decimal() subroutine" )
  RETURN (t_number )
 END ;Subroutine
 SUBROUTINE  get_int_routine_arg (arg ,args )
  CALL echo ("Entering get_int_routine_arg() subroutine" )
  DECLARE pos = i4 WITH private ,noconstant (0 )
  DECLARE b_pos = i4 WITH private ,noconstant (0 )
  DECLARE value = i4 WITH private ,noconstant (0 )
  DECLARE stop = i2 WITH private ,noconstant (0 )
  IF ((args <= "" ) )
   IF ((validate (request->esoinfo ,"!" ) != "!" ) )
    SET args = request->esoinfo.scriptcontrolargs
   ELSE
    CALL echo ("No incoming request->esoinfo structure detected" )
   ENDIF
  ENDIF
  SET pos = findstring (arg ,args )
  IF (pos )
   SET pos = (pos + 10 )
   SET b_pos = pos
   SET stop = 0
   WHILE (NOT (stop ) )
    IF (isnumeric (substring (pos ,1 ,args ) ) )
     SET value = cnvtint (substring (b_pos ,((pos + 1 ) - b_pos ) ,args ) )
     SET pos = (pos + 1 )
    ELSE
     SET stop = 1
    ENDIF
   ENDWHILE
  ELSE
   CALL echo (concat ("arg=" ,arg ," not found in routine args=" ,args ) )
  ENDIF
  CALL echo (build ("value=" ,value ) )
  CALL echo ("Exiting get_int_routine_arg() subroutine" )
  RETURN (value )
 END ;Subroutine
 SUBROUTINE  eso_column_exists (tablename ,columnname )
  CALL echo ("Entering eso_column_exists subroutine" )
  DECLARE ce_flag = i4 WITH noconstant (0 )
  SELECT INTO "nl:"
   l.attr_name
   FROM (dtableattr a ),
    (dtableattrl l )
   WHERE (a.table_name = tablename )
   AND (l.attr_name = columnname )
   AND (l.structtype = "F" )
   AND (btest (l.stat ,0 ) = 1 )
   DETAIL
    ce_flag = 1
   WITH nocounter
  ;end select
  CALL echo (build ("ce_flag = " ,ce_flag ) )
  CALL echo ("Exiting eso_column_exists subroutine" )
  RETURN (ce_flag )
 END ;Subroutine
 SUBROUTINE  eso_pharm_decimal (decimal_val )
  CALL echo ("Entering eso_pharm_decimal..." )
  DECLARE strdecimal = vc WITH noconstant (" " )
  SET strdecimal = cnvtstring (decimal_val ,20 ,6 )
  SET idecimalidx = findstring ("." ,strdecimal )
  IF ((idecimalidx > 0 ) )
   SET iend = size (strdecimal ,1 )
   WHILE ((substring (iend ,1 ,strdecimal ) = "0" ) )
    SET iend = (iend - 1 )
   ENDWHILE
   SET strdecimal = substring (1 ,iend ,strdecimal )
   CALL echo (build2 ("removed zeros - " ,strdecimal ) )
   IF ((substring (size (strdecimal ,1 ) ,1 ,strdecimal ) = "." ) )
    SET strdecimal = substring (1 ,(size (strdecimal ,1 ) - 1 ) ,strdecimal )
    CALL echo (build2 ("removed decimal - " ,strdecimal ) )
   ENDIF
   IF ((idecimalidx = 1 ) )
    SET strdecimal = ("0" + strdecimal )
    CALL echo (build2 ("added leading zero - " ,strdecimal ) )
   ENDIF
  ENDIF
  CALL echo ("Exiting eso_pharm_decimal..." )
  RETURN (strdecimal )
 END ;Subroutine
 SUBROUTINE  get_routine_arg_value (name )
  CALL echo ("Entering get_routine_arg_value..." )
  SET routine_args = trim (request->esoinfo.scriptcontrolargs )
  DECLARE strvalue = vc WITH public ,noconstant (" " )
  SET iindex = findstring (name ,routine_args )
  IF (iindex )
   SET iequalidx = findstring ("=" ,routine_args ,(iindex + size (name ) ) )
   IF ((iequalidx > 0 ) )
    SET isemiidx = findstring (";" ,routine_args ,(iequalidx + 1 ) )
    IF ((isemiidx > 0 ) )
     SET strvalue = trim (substring ((iequalidx + 1 ) ,((isemiidx - iequalidx ) - 1 ) ,routine_args
       ) ,3 )
    ELSE
     SET strvalue = trim (substring ((iequalidx + 1 ) ,(size (routine_args ) - iequalidx ) ,
       routine_args ) ,3 )
    ENDIF
   ENDIF
  ENDIF
  RETURN (strvalue )
  CALL echo ("Exiting get_routine_arg_value..." )
 END ;Subroutine
 SUBROUTINE  routine_arg_exists (name )
  IF (validate (request->esoinfo.scriptcontrolargs ,0 ) )
   DECLARE routine_args = vc WITH private ,constant (trim (request->esoinfo.scriptcontrolargs ) )
  ELSE
   DECLARE routine_args = vc WITH private ,constant (trim (get_esoinfo_string ("routine_args" ) ) )
  ENDIF
  DECLARE routine_args_size = i4 WITH private ,constant (size (routine_args ) )
  DECLARE name_start = i4 WITH private ,noconstant (0 )
  DECLARE next_char_idx = i4 WITH private ,noconstant (0 )
  DECLARE trailing_char_exists = i2 WITH private ,noconstant (0 )
  DECLARE leading_char_exists = i2 WITH private ,noconstant (0 )
  IF ((size (trim (name ) ) = 0 ) )
   CALL echo ("Invalid Empty Routine Arg" )
   RETURN (0 )
  ENDIF
  SET name_start = findstring (name ,routine_args ,1 )
  WHILE ((name_start > 0 ) )
   SET next_char_idx = (name_start + size (name ) )
   SET trailing_char_exists = additional_character_exists (routine_args ,routine_args_size ,
    next_char_idx ,search_forward )
   IF ((trailing_char_exists = 0 ) )
    SET leading_char_exists = additional_character_exists (routine_args ,routine_args_size ,(
     name_start - 1 ) ,search_backward )
   ENDIF
   IF ((leading_char_exists = 0 )
   AND (trailing_char_exists = 0 ) )
    CALL echo (build ("Routine Arg- " ,name ," is enabled." ) )
    RETURN (1 )
   ELSE
    SET name_start = findstring (name ,routine_args ,next_char_idx )
   ENDIF
  ENDWHILE
  CALL echo (build ("Routine Arg- " ,name ," is NOT enabled." ) )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  additional_character_exists (arg_string ,arg_string_size ,start_idx ,search_increment )
  DECLARE end_of_token_found = i4 WITH private ,noconstant (0 )
  DECLARE char_exists = i2 WITH private ,noconstant (0 )
  DECLARE check_idx = i4 WITH private ,noconstant (start_idx )
  DECLARE check_char = c1 WITH private ,noconstant (" " )
  WHILE (NOT (end_of_token_found ) )
   IF ((((check_idx < 1 ) ) OR ((check_idx > arg_string_size ) )) )
    SET end_of_token_found = 1
   ELSE
    SET check_char = substring (check_idx ,1 ,arg_string )
    IF ((check_char = ";" ) )
     SET end_of_token_found = 1
    ELSEIF (NOT ((check_char = " " ) ) )
     SET char_exists = 1
     SET end_of_token_found = 1
    ELSE
     SET check_idx = (check_idx + search_increment )
    ENDIF
   ENDIF
  ENDWHILE
  RETURN (char_exists )
 END ;Subroutine
 SUBROUTINE  get_synoptic_nomen_config (name )
  CALL echo ("Entering get_synoptic_nomen_config..." )
  SET routine_args = trim (get_esoinfo_string ("routine_args" ) ,3 )
  DECLARE strvalue = vc WITH public ,noconstant (" " )
  SET iindex = findstring (name ,routine_args )
  IF (iindex )
   SET iequalidx = findstring ("=" ,routine_args ,(iindex + size (name ) ) )
   IF ((iequalidx > 0 ) )
    SET isemiidx = findstring (";" ,routine_args ,(iequalidx + 1 ) )
    IF ((isemiidx > 0 ) )
     SET strvalue = trim (substring ((iequalidx + 1 ) ,((isemiidx - iequalidx ) - 1 ) ,routine_args
       ) ,3 )
    ELSE
     SET strvalue = trim (substring ((iequalidx + 1 ) ,(size (routine_args ) - iequalidx ) ,
       routine_args ) ,3 )
    ENDIF
   ENDIF
  ENDIF
  CALL echo (build ("strValue:" ,strvalue ) )
  RETURN (strvalue )
  CALL echo ("Exiting get_synoptic_nomen_config..." )
 END ;Subroutine
 SUBROUTINE  rtfformatingremove (srtfstring )
  CALL echo ("Entering rtfFormat" )
  CALL echo (build ("sRtfString = " ,srtfstring ) )
  IF (NOT (validate (g_strreplacetext ) ) )
   DECLARE dpicttextcd = f8 WITH private ,noconstant (0.0 )
   SET dpicttextcd = eso_get_meaning_by_codeset (40700 ,"PICT_TEXT" )
   DECLARE strdisplayvalue = vc WITH private ,noconstant (" " )
   SET strdisplayvalue = eso_get_code_display (dpicttextcd )
   DECLARE g_strreplacetext = vc WITH private ,noconstant (" " )
   SET g_strreplacetext = concat (" " ,trim (strdisplayvalue ,3 ) ," {\pict" )
  ENDIF
  DECLARE srtftxt = vc WITH private ,noconstant (" " )
  SET srtftxt = trim (replace (srtfstring ,"{\pict" ,g_strreplacetext ,0 ) ,3 )
  DECLARE irtftextsize = i4 WITH private ,noconstant (textlen (srtftxt ) )
  CALL echo (build ("iRtfTextSize =" ,irtftextsize ) )
  DECLARE sasciitext = vc WITH private ,noconstant (concat (srtftxt ,"0123456789" ) )
  DECLARE iacsiilength = i4 WITH private ,noconstant (0 )
  DECLARE s_irtfflag = i4 WITH private ,noconstant (1 )
  SET iretvalue = uar_rtf2 (srtftxt ,irtftextsize ,sasciitext ,irtftextsize ,iacsiilength ,
   s_irtfflag )
  CALL echo (build ("iRetValue=" ,iretvalue ) )
  FREE SET srtftxt
  SET sasciitext = trim (substring (1 ,iacsiilength ,sasciitext ) )
  CALL echo (build ("sAsciiText=" ,sasciitext ) )
  CALL echo ("Exiting rtfFormat" )
  RETURN (sasciitext )
 END ;Subroutine
 CALL echo ("<===== ESO_COMMON_ROUTINES.INC End =====>" )
 DECLARE eso_format_dttm (input_dt_tm ,hl7_format ,time_zone ) = c60
 DECLARE hl7_format_date (input_dt_tm ,method ) = c60
 DECLARE hl7_format_time (input_dt_tm ,method ) = c60
 DECLARE hl7_format_datetime (input_dt_tm ,method ) = c60
 DECLARE eso_birth_date_format_specifier ((birth_prec_flag = i2 ) ) = i4
 DECLARE format_dttm_custom ((s_dtinputdttm = dq8 ) ,(s_strformat = vc ) ,(s_strtzformat = vc ) ) =
 vc
 DECLARE format_date_of_record_custom ((s_dtinputdttm = dq8 ) ,(s_strformat = vc ) ,(s_strtzformat =
  vc ) ,(s_idatetz = i4 ) ) = vc
 DECLARE eso_format_nomen (n_field1 ,n_field2 ,n_field3 ,n_value1 ,n_value2 ) = c200
 DECLARE eso_format_item (identifier ,value ,item ,index ) = c200
 DECLARE eso_format_item_with_method (identifier ,value ,item ,index ,data_type ,field_name ) = c200
 DECLARE eso_format_code (fvalue ) = c40
 DECLARE eso_format_code_with_method (fvalue ,data_type ,field_name ) = c40
 DECLARE eso_format_code_blank (fvalue ) = c40
 DECLARE eso_format_code_ctx (fvalue ) = c40
 DECLARE eso_format_code_blank_ctx (fvalue ) = c40
 DECLARE eso_format_alias (field1 ,field2 ,type ,subtype ,pool ,alias ) = c200
 DECLARE eso_format_alias_ctx (field1 ,field2 ,type ,subtype ,pool ,alias ) = c200
 DECLARE eso_format_dbnull (dummy ) = c40
 DECLARE eso_format_dbnull_ctx (dummy ) = c40
 DECLARE eso_format_org (field_name ,msg_format ,datatype ,org_alias_type_cd ,repeat_ind ,future ,
  future2 ,assign_auth_org_id ,fed_tax_id ,org_name ,org_id ) = c200
 DECLARE eso_format_hlthplan (field_name ,msg_format ,datatype ,hlthplan_alias_type_cd ,repeat_ind ,
  future ,future2 ,assign_auth_org_id ,hlthplan_plan_name ,hlthplan_id ,ins_org_id ) = c200
 DECLARE eso_encode_timing (value ,unit ) = c20
 DECLARE eso_encode_range (low ,high ) = c45
 DECLARE eso_format_frequency ((freq_qual = i4 ) ) = c45
 DECLARE eso_format_pharm_timing ((encoded = vc ) ,(noround = vc ) ,(type_meaning = vc ) ) = c200
 DECLARE eso_encode_timing_noround (value ,unit ) = c20
 DECLARE eso_format_previous_result (strverifydttm ,struser ,strresultval ,strresultunitcd ,
  strnormalcycd ,strusername ,strtype ) = vc
 DECLARE encode_delimiter (original_string ,search_string ,replace_string ) = vc
 DECLARE eso_format_short_result (strverifydttm ,struser ,strusername ,strtype ) = vc
 DECLARE eso_format_code_for_cs (fvalue ,strcodingsys ,straliastypmeaning ) = vc
 DECLARE eso_format_multum_identifiers (catalog_cd ,synonym_id ,item_id ,field_type ,format_string )
 = vc
 DECLARE eso_format_attachment (strattachmentname ,dstoragecd ,strblobhandle ,dformatcd ,
  strcommentind ) = vc
 DECLARE eso_format_code_with_event_id ((deventcd = f8 ) ,(deventid = f8 ) ,(dentitycd = f8 ) ,(
  strsegmentname = vc ) ,(strfieldtype = vc ) ) = vc
 DECLARE eso_format_code_with_event_id_and_vocab_type ((deventcd = f8 ) ,(deventid = f8 ) ,(
  dentitycd = f8 ) ,(strsegmentname = vc ) ,(strfieldtype = vc ) ,(strvocabularytype = vc ) ) = vc
 DECLARE eso_format_code_with_event_id_suscep_seq_nbr ((deventcd = f8 ) ,(deventid = f8 ) ,(
  dentitycd = f8 ) ,(strsegmentname = vc ) ,(strfieldtype = vc ) ,(isuscepseqnbr = i4 ) ,(
  strvocabularytype = vc ) ) = vc
 DECLARE eso_format_code_with_event_id_micro_seq_nbr ((deventcd = f8 ) ,(deventid = f8 ) ,(dentitycd
  = f8 ) ,(strsegmentname = vc ) ,(strfieldtype = vc ) ,(imicroseqnbr = i4 ) ,(strvocabularytype =
  vc ) ) = vc
 DECLARE eso_format_nomen_or_string ((strvalue = vc ) ,(deventid = f8 ) ,(dentitycd = f8 ) ,(
  strsegmentname = vc ) ,(strfieldtype = vc ) ,(imicroseqnbr = i4 ) ) = vc
 DECLARE eso_format_phone_cd (dphonetypecd ,dcontactmethodcd ) = vc
 DECLARE eso_nomen_concept ((dnomenid = f8 ) ) = i4
 DECLARE populate_order_diagnoses ((dorderid = f8 ) ,(iobridx = i4 ) ) = i4
 SET hl7_date_year = 1
 SET hl7_date_mon = 2
 SET hl7_date_day = 3
 SET hl7_dt_tm_hour = 4
 SET hl7_dt_tm_min = 5
 SET hl7_dt_tm_sec = 6
 SET hl7_dt_tm_hsec = 7
 SET hl7_time_hour = 8
 SET hl7_time_min = 9
 SET hl7_time_sec = 10
 SET hl7_time_hsec = 11
 SET hl7_date = 3
 SET hl7_dt_tm = 6
 SET hl7_time = 10
 SUBROUTINE  format_dttm_custom (s_dtinputdttm ,s_strformat ,s_strtzformat )
  DECLARE strdttmcustformatstring = vc WITH noconstant (" " )
  IF ((s_dtinputdttm > 0 )
  AND (textlen (trim (s_strformat ,3 ) ) > 0 ) )
   DECLARE strtzformatstring = vc WITH noconstant (", ," )
   IF ((textlen (trim (s_strtzformat ,3 ) ) > 0 ) )
    SET strtzformatstring = build2 ("," ,s_strtzformat ,"," )
   ENDIF
   IF ((curutc = 0 ) )
    SET strdttmcustformatstring = build2 ("##DTTMCUST##," ,s_strformat ,strtzformatstring ,format (
      s_dtinputdttm ,"YYYYMMDD;;D" ) ,"," ,format (s_dtinputdttm ,"HHmmss.cc;3;M" ) ,"," )
   ELSE
    SET strdttmcustformatstring = build2 ("##DTTMCUST##," ,s_strformat ,strtzformatstring ,format (
      s_dtinputdttm ,"YYYYMMDD;;D" ) ,"," ,format (s_dtinputdttm ,"HHmmss.cc;3;M" ) ,", ," ,
     datetimezoneformat (s_dtinputdttm ,datetimezonebyname ("UTC" ) ,"yyyyMMddHHmmsscc" ) )
   ENDIF
  ENDIF
  RETURN (strdttmcustformatstring )
 END ;Subroutine
 SUBROUTINE  format_date_of_record_custom (s_dtinputdttm ,s_strformat ,s_strtzformat ,s_idatetz )
  DECLARE strdttmcustformatstring = vc WITH noconstant (" " )
  IF ((s_dtinputdttm > 0 )
  AND (textlen (trim (s_strformat ,3 ) ) > 0 ) )
   DECLARE strtzformatstring = vc WITH noconstant (", ," )
   DECLARE strdatetz = vc WITH noconstant (", " )
   IF ((textlen (trim (s_strtzformat ,3 ) ) > 0 ) )
    SET strtzformatstring = build2 ("," ,s_strtzformat ,"," )
   ENDIF
   IF ((s_idatetz > 0 ) )
    SET strdatetz = build2 ("," ,cnvtstring (s_idatetz ) )
   ELSEIF ((curutc = 0 ) )
    SET strdatetz = build2 ("," ,cnvtstring (curtimezonesys ) )
   ENDIF
   IF ((curutc = 0 ) )
    SET strdttmcustformatstring = build2 ("##DTTMCUST##," ,s_strformat ,strtzformatstring ,format (
      s_dtinputdttm ,"YYYYMMDD;;D" ) ,"," ,format (s_dtinputdttm ,"HHmmss.cc;3;M" ) ,strdatetz )
   ELSE
    SET strdttmcustformatstring = build2 ("##DTTMCUST##," ,s_strformat ,strtzformatstring ,format (
      s_dtinputdttm ,"YYYYMMDD;;D" ) ,"," ,format (s_dtinputdttm ,"HHmmss.cc;3;M" ) ,strdatetz ,"," ,
     datetimezoneformat (s_dtinputdttm ,datetimezonebyname ("UTC" ) ,"yyyyMMddHHmmsscc" ) )
   ENDIF
  ENDIF
  RETURN (strdttmcustformatstring )
 END ;Subroutine
 SUBROUTINE  eso_format_dttm (input_dt_tm ,hl7_format ,time_zone )
  DECLARE strtimezonestring = vc WITH noconstant (", ," )
  IF ((input_dt_tm > 0 ) )
   FREE SET t_dt
   FREE SET t_dt_format
   FREE SET t_tm
   FREE SET t_tm_format
   SET t_dt = format (input_dt_tm ,"YYYYMMDD;;D" )
   SET t_tm = format (input_dt_tm ,"HHmmss.cc;3;M" )
   CASE (hl7_format )
    OF hl7_date_year :
     SET t_dt_format = "YYYY"
     SET t_tm_format = " "
    OF hl7_date_mon :
     SET t_dt_format = "YYYYMM"
     SET t_tm_format = " "
    OF hl7_date_day :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = " "
    OF hl7_date :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = " "
    OF hl7_dt_tm_hour :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = "HH"
    OF hl7_dt_tm_min :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = "HHMM"
    OF hl7_dt_tm_sec :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = "HHMMSS"
    OF hl7_dt_tm :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = "HHMMSS"
    OF hl7_dt_tm_hsec :
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = "HHMMSS.CC"
    OF hl7_time_hour :
     SET t_dt_format = " "
     SET t_tm_format = "HH"
    OF hl7_time_min :
     SET t_dt_format = " "
     SET t_tm_format = "HHMM"
    OF hl7_time_sec :
     SET t_dt_format = " "
     SET t_tm_format = "HHMMSS"
    OF hl7_time :
     SET t_dt_format = " "
     SET t_tm_format = "HHMMSS"
    OF hl7_time_hsec :
     SET t_dt_format = " "
     SET t_tm_format = "HHMMSS.CC"
    ELSE
     SET t_dt_format = "YYYYMMDD"
     SET t_tm_format = "HHMMSS"
   ENDCASE
   IF ((textlen (trim (time_zone ,3 ) ) > 0 ) )
    SET strtimezonestring = build2 ("," ,trim (time_zone ,3 ) ,"," )
   ENDIF
   IF ((curutc = 0 ) )
    RETURN (concat ("##DTTM##" ,"," ,t_dt_format ,"," ,t_tm_format ,"," ,t_dt ,"," ,t_tm ,
     strtimezonestring ) )
   ELSE
    RETURN (concat ("##DTTM##" ,"," ,t_dt_format ,"," ,t_tm_format ,"," ,t_dt ,"," ,t_tm ,
     strtimezonestring ,datetimezoneformat (input_dt_tm ,datetimezonebyname ("UTC" ) ,
      "yyyyMMddHHmmsscc" ) ) )
   ENDIF
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  hl7_format_datetime (input_dt_tm ,method )
  RETURN (eso_format_dttm (input_dt_tm ,method ,"" ) )
 END ;Subroutine
 SUBROUTINE  hl7_format_date (input_dt_tm ,method )
  RETURN (eso_format_dttm (input_dt_tm ,method ,"" ) )
 END ;Subroutine
 SUBROUTINE  hl7_format_time (input_dt_tm ,method )
  RETURN (eso_format_dttm (input_dt_tm ,method ,"" ) )
 END ;Subroutine
 SUBROUTINE  eso_birth_date_format_specifier (birth_prec_flag )
  DECLARE precision = i4 WITH noconstant (0 )
  CASE (birth_prec_flag )
   OF 0 :
    SET precision = hl7_date
   OF 1 :
    SET precision = hl7_dt_tm
   OF 2 :
    SET precision = hl7_date_mon
   OF 3 :
    SET precision = hl7_date_year
   ELSE
    SET precision = hl7_dt_tm
  ENDCASE
  RETURN (precision )
 END ;Subroutine
 SUBROUTINE  eso_format_nomen (n_field1 ,n_field2 ,n_field3 ,n_value1 ,n_value2 )
  IF (n_value1
  AND n_value2 )
   RETURN (substring (1 ,200 ,concat ("##NOMEN##" ,"," ,trim (n_field1 ,3 ) ,"," ,trim (n_field2 ,3
      ) ,"," ,trim (n_field3 ,3 ) ,"," ,trim (cnvtstring (n_value1 ) ,3 ) ,"," ,trim (cnvtstring (
       n_value2 ) ,3 ) ) ) )
  ELSE
   RETURN (eso_format_dbnull (1 ) )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_item (identifier ,value ,item ,index )
  IF ((item > 0 ) )
   RETURN (substring (1 ,200 ,concat ("##ITEM##" ,"," ,trim (identifier ) ,"," ,trim (value ) ,"," ,
     trim (cnvtstring (item ) ) ,"," ,trim (cnvtstring (index ) ) ) ) )
  ELSE
   RETURN (eso_format_dbnull (1 ) )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_item_with_method (identifier ,value ,item ,index ,data_type ,field_name )
  IF ((item > 0 ) )
   RETURN (substring (1 ,200 ,concat ("##ITEM##" ,"," ,trim (identifier ) ,"," ,trim (value ) ,"," ,
     trim (cnvtstring (item ) ) ,"," ,trim (cnvtstring (index ) ) ,"," ,trim (data_type ) ,"," ,trim
     (field_name ) ) ) )
  ELSE
   RETURN (eso_format_dbnull (1 ) )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_code (fvalue )
  IF ((fvalue > 0 ) )
   RETURN (substring (1 ,40 ,concat ("##CVA##" ,"," ,trim (cnvtstring (fvalue ) ) ) ) )
  ELSE
   RETURN (eso_format_dbnull (1 ) )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_code_with_method (fvalue ,data_type ,field_name )
  IF ((fvalue > 0 ) )
   IF ((trim (data_type ) = "ALIAS_TYPE_MEANING" ) )
    RETURN (substring (1 ,40 ,concat ("##CVA##" ,"," ,trim (cnvtstring (fvalue ) ) ,"," ,trim (
       field_name ) ) ) )
   ELSE
    RETURN (substring (1 ,40 ,concat ("##CVA##" ,"," ,trim (cnvtstring (fvalue ) ) ,"," ,trim (
       data_type ) ,"," ,trim (field_name ) ) ) )
   ENDIF
  ELSE
   RETURN (eso_format_dbnull (1 ) )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_code_blank (fvalue )
  IF ((fvalue > 0 ) )
   RETURN (substring (1 ,40 ,concat ("##CVA##" ,"," ,trim (cnvtstring (fvalue ) ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_code_ctx (fvalue )
  RETURN (eso_format_code (fvalue ) )
 END ;Subroutine
 SUBROUTINE  eso_format_code_blank_ctx (fvalue )
  RETURN (eso_format_code_blank (fvalue ) )
 END ;Subroutine
 SUBROUTINE  eso_format_alias (field1 ,field2 ,type ,subtype ,pool ,alias )
  CALL echo (concat ("alias type " ,cnvtstring (type ) ) )
  IF ((type > 0 ) )
   CALL echo ("alias type > 0 " )
   IF ((trim (alias ) = "" ) )
    CALL echo ('alias <= ""' )
    RETURN (substring (1 ,200 ,concat ("##ALIAS##" ,"," ,trim (field1 ) ,"," ,trim (field2 ) ,"," ,
      trim (cnvtstring (type ) ) ,"," ,trim (cnvtstring (subtype ) ) ,"," ,trim (cnvtstring (pool )
       ) ,"," ," " ,"," ," " ,"," ," " ) ) )
   ELSE
    CALL echo ('alias > ""' )
    RETURN (substring (1 ,200 ,concat ("##ALIAS##" ,"," ,trim (field1 ) ,"," ,trim (field2 ) ,"," ,
      trim (cnvtstring (type ) ) ,"," ,trim (cnvtstring (subtype ) ) ,"," ,trim (cnvtstring (pool )
       ) ,"," ," " ,"," ," " ,"," ,trim (alias ) ) ) )
   ENDIF
  ELSE
   CALL echo ("alias type <= 0 " )
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_alias_ctx (field1 ,field2 ,type ,subtype ,pool ,alias )
  CALL echo (concat ("alias type " ,cnvtstring (type ) ) )
  IF ((type > 0 ) )
   CALL echo ("alias type > 0 " )
   IF ((trim (alias ) = "" ) )
    CALL echo ('alias <= ""' )
    RETURN (substring (1 ,200 ,concat ("##ALIAS##" ,"," ,trim (field1 ) ,"," ,trim (field2 ) ,"," ,
      trim (cnvtstring (type ) ) ,"," ,trim (cnvtstring (subtype ) ) ,"," ,trim (cnvtstring (pool )
       ) ,"," ," " ,"," ," " ,"," ," " ) ) )
   ELSE
    CALL echo ('alias > ""' )
    RETURN (substring (1 ,200 ,concat ("##ALIAS##" ,"," ,trim (field1 ) ,"," ,trim (field2 ) ,"," ,
      trim (cnvtstring (type ) ) ,"," ,trim (cnvtstring (subtype ) ) ,"," ,trim (cnvtstring (pool )
       ) ,"," ," " ,"," ," " ,"," ,trim (alias ) ) ) )
   ENDIF
  ELSE
   CALL echo ("alias type <= 0 " )
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_dbnull (dummy )
  RETURN (substring (1 ,40 ,"##NULL##" ) )
 END ;Subroutine
 SUBROUTINE  eso_format_dbnull_ctx (dummy )
  RETURN (substring (1 ,40 ,"##NULL##" ) )
 END ;Subroutine
 SUBROUTINE  eso_format_org (msg_format ,field_name ,datatype ,org_id ,org_alias_type_cd ,repeat_ind
  ,assign_auth_org_id ,fed_tax_id ,org_name ,future ,future2 )
  CALL echo (concat ("org_id = " ,cnvtstring (org_id ) ) )
  IF ((org_id > 0 ) )
   CALL echo ("org_id > 0 " )
   RETURN (substring (1 ,200 ,concat ("##ORG##" ,"," ,trim (msg_format ) ,"," ,trim (field_name ) ,
     "," ,trim (datatype ) ,"," ,trim (cnvtstring (org_id ) ) ,"," ,trim (cnvtstring (
       org_alias_type_cd ) ) ,"," ,trim (cnvtstring (repeat_ind ) ) ,"," ,trim (cnvtstring (
       assign_auth_org_id ) ) ,"," ,trim (cnvtstring (fed_tax_id ) ) ,"," ,trim (org_name ) ,"," ,
     "," ,"," ) ) )
  ELSE
   CALL echo ("org_id <= 0 " )
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_hlthplan (field_name ,msg_format ,datatype ,hlthplan_alias_type_cd ,
  repeat_ind ,future ,future2 ,assign_auth_org_id ,hlthplan_plan_name ,hlthplan_id ,ins_org_id )
  CALL echo (concat ("hlthplan_id =" ,cnvtstring (hlthplan_id ) ) )
  IF ((hlthplan_id > 0 ) )
   CALL echo ("hlthplan_id > 0 " )
   RETURN (substring (1 ,200 ,concat ("##HLTHPLAN##" ,"," ,trim (field_name ) ,"," ,trim (msg_format
      ) ,"," ,trim (datatype ) ,"," ,trim (cnvtstring (hlthplan_alias_type_cd ) ) ,"," ,trim (
      cnvtstring (repeat_ind ) ) ,"," ,"," ,"," ,trim (cnvtstring (assign_auth_org_id ) ) ,"," ,trim
     (hlthplan_plan_name ) ,"," ,trim (cnvtstring (hlthplan_id ) ) ,"," ,trim (cnvtstring (
       ins_org_id ) ) ) ) )
  ELSE
   CALL echo ("hlthplan_id <= 0 " )
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_encode_timing (value ,unit )
  CALL echo ("Entering eso_encode_timing subroutine" )
  CALL echo (build ("    value=" ,value ) )
  CALL echo (build ("    unit=" ,unit ) )
  FREE SET t_timing
  FREE SET t_meaning
  IF ((unit > 0 ) )
   SET t_meaning = trim (uar_get_code_meaning (unit ) )
   CALL echo (build ("    t_meaning=" ,t_meaning ) )
   IF ((t_meaning = "DOSES" ) )
    SET t_timing = trim (build ("X" ,cnvtstring (value ) ) )
   ELSEIF ((t_meaning = "SECONDS" ) )
    SET t_timing = trim (build ("S" ,cnvtstring (value ) ) )
   ELSEIF ((t_meaning = "MINUTES" ) )
    SET t_timing = trim (build ("M" ,cnvtstring (value ) ) )
   ELSEIF ((t_meaning = "HOURS" ) )
    SET t_timing = trim (build ("H" ,cnvtstring (value ) ) )
   ELSEIF ((t_meaning = "DAYS" ) )
    SET t_timing = trim (build ("D" ,cnvtstring (value ) ) )
   ELSEIF ((t_meaning = "WEEKS" ) )
    SET t_timing = trim (build ("W" ,cnvtstring (value ) ) )
   ELSEIF ((t_meaning = "MONTHS" ) )
    SET t_timing = trim (build ("L" ,cnvtstring (value ) ) )
   ELSE
    SET t_timing = ""
   ENDIF
  ELSE
   SET t_timing = ""
  ENDIF
  CALL echo (build ("    t_timing=" ,t_timing ) )
  CALL echo ("Exiting eso_encode_timing subroutine" )
  RETURN (t_timing )
 END ;Subroutine
 SUBROUTINE  eso_encode_range (low ,high )
  CALL echo ("Entering eso_encode_range subroutine" )
  CALL echo (build ("    low=" ,low ) )
  CALL echo (build ("    high=" ,high ) )
  FREE SET t_range
  IF ((high > "" ) )
   IF ((low > "" ) )
    SET t_range = concat (low ,"-" ,high )
   ELSE
    IF ((((ichar (substring (1 ,1 ,high ) ) >= ichar ("0" ) )
    AND (ichar (substring (1 ,1 ,high ) ) <= ichar ("9" ) ) ) OR ((substring (1 ,1 ,high ) = "-" )
    )) )
     SET t_range = concat ("<" ,high )
    ELSE
     SET t_range = high
    ENDIF
   ENDIF
  ELSE
   IF ((low > "" ) )
    IF ((((ichar (substring (1 ,1 ,low ) ) >= ichar ("0" ) )
    AND (ichar (substring (1 ,1 ,low ) ) <= ichar ("9" ) ) ) OR ((substring (1 ,1 ,low ) = "-" ) ))
    )
     SET t_range = concat (">" ,low )
    ELSE
     SET t_range = low
    ENDIF
   ELSE
    SET t_range = ""
   ENDIF
  ENDIF
  CALL echo (build ("    t_range=" ,t_range ) )
  CALL echo ("Exiting eso_encode_range subroutine" )
  RETURN (t_range )
 END ;Subroutine
 SUBROUTINE  eso_encode_timing_noround (value ,unit )
  CALL echo ("Entering eso_encode_timing_noround subroutine" )
  CALL echo (build ("    value=" ,value ) )
  CALL echo (build ("    unit=" ,unit ) )
  FREE SET t_timing
  FREE SET t_meaning
  IF ((unit > 0 ) )
   SET t_meaning = trim (uar_get_code_meaning (unit ) )
   CALL echo (build ("    t_meaning=" ,t_meaning ) )
   IF ((t_meaning = "DOSES" ) )
    SET t_timing = trim (build ("X" ,value ) )
   ELSEIF ((t_meaning = "SECONDS" ) )
    SET t_timing = trim (build ("S" ,value ) )
   ELSEIF ((t_meaning = "MINUTES" ) )
    SET t_timing = trim (build ("M" ,value ) )
   ELSEIF ((t_meaning = "HOURS" ) )
    SET t_timing = trim (build ("H" ,value ) )
   ELSEIF ((t_meaning = "DAYS" ) )
    SET t_timing = trim (build ("D" ,value ) )
   ELSEIF ((t_meaning = "WEEKS" ) )
    SET t_timing = trim (build ("W" ,value ) )
   ELSEIF ((t_meaning = "MONTHS" ) )
    SET t_timing = trim (build ("L" ,value ) )
   ELSE
    SET t_timing = ""
   ENDIF
  ELSE
   SET t_timing = ""
  ENDIF
  CALL echo (build ("    t_timing=" ,t_timing ) )
  CALL echo ("Exiting eso_encode_timing_noround subroutine" )
  RETURN (t_timing )
 END ;Subroutine
 SUBROUTINE  eso_format_frequency (freq_qual )
  CALL echo ("Entering eso_format_frequency subroutine" )
  CALL echo (build ("freq_qual = " ,freq_qual ) )
  IF ((freq_qual > 0 ) )
   RETURN (substring (1 ,200 ,concat ("##TIMEINTSTR##" ,"," ,build (freq_qual ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_pharm_timing (encoded ,noround ,type_meaning )
  CALL echo ("Entering eso_format_pharm_timing subroutine" )
  CALL echo (build ("encoded = " ,encoded ) )
  CALL echo (build ("noround = " ,noround ) )
  CALL echo (build ("type_meaning = " ,type_meaning ) )
  IF ((type_meaning > " " ) )
   RETURN (substring (1 ,200 ,concat ("##PHARMTIMING##" ,"," ,trim (encoded ) ,"," ,trim (noround ) ,
     "," ,trim (type_meaning ) ) ) )
  ELSE
   CALL echo ("Invalid Type" )
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  encode_delimiter (original_string ,search_string ,replace_string )
  CALL echo ("Entering encode_delimiter subroutine" )
  DECLARE str_replace_string = vc
  SET str_replace_string = replace (original_string ,search_string ,replace_string ,0 )
  RETURN (str_replace_string )
 END ;Subroutine
 SUBROUTINE  eso_format_previous_result (strverifydttm ,struser ,strresultval ,strresultunitcd ,
  strnormalcycd ,strusername ,strtype )
  CALL echo ("Entering eso_format_previous_result subroutine" )
  SET strresultval1 = encode_delimiter (strresultval ,";" ,"\SC\" )
  RETURN (concat ("##CORRECTRESULT##" ,";" ,trim (strverifydttm ) ,";" ,trim (struser ) ,";" ,trim (
    strresultval1 ) ,";" ,trim (strresultunitcd ) ,";" ,trim (strnormalcycd ) ,";" ,trim (
    strusername ) ,";" ,trim (strtype ) ) )
 END ;Subroutine
 SUBROUTINE  eso_format_short_result (strverifydttm ,struser ,strusername ,strtype )
  CALL echo ("Entering eso_format_short_result subroutine" )
  RETURN (concat ("##CORRECTRESULT##" ,";" ,trim (strverifydttm ) ,";" ,trim (struser ) ,";" ,trim (
    strusername ) ,";" ,trim (strtype ) ) )
 END ;Subroutine
 SUBROUTINE  eso_format_code_for_cs (fvalue ,strcodingsys ,straliastypmeaning )
  IF ((fvalue > 0 ) )
   RETURN (trim (concat ("##CVA_W_CS##" ,"," ,trim (cnvtstring (fvalue ) ) ,"," ,trim (strcodingsys
      ) ,"," ,trim (straliastypmeaning ) ) ) )
  ELSE
   RETURN ("" )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_multum_identifiers (catalog_cd ,synonym_id ,item_id ,field_type ,
  format_string )
  RETURN (concat ("##SEND_MULTUM_IDENT##" ,";" ,trim (cnvtstring (catalog_cd ) ) ,";" ,trim (
    cnvtstring (synonym_id ) ) ,";" ,trim (cnvtstring (item_id ) ) ,";" ,trim (field_type ) ,";" ,
   trim (format_string ) ,";" ) )
 END ;Subroutine
 SUBROUTINE  eso_format_attachment (strattachmentname ,dstoragecd ,strblobhandle ,dformatcd ,
  strcommentind )
  RETURN (concat ("##ATTACHMENT##" ,"," ,trim (strattachmentname ) ,"," ,trim (cnvtstring (
     dstoragecd ) ) ,"," ,trim (strblobhandle ) ,"," ,trim (cnvtstring (dformatcd ) ) ,"," ,trim (
    strcommentind ) ) )
 END ;Subroutine
 SUBROUTINE  eso_format_code_with_event_id (deventcd ,deventid ,dentitycd ,strsegmentname ,
  strfieldtype )
  RETURN (eso_format_code_with_event_id_and_vocab_type (deventcd ,deventid ,dentitycd ,
   strsegmentname ,strfieldtype ,"TEST" ) )
 END ;Subroutine
 SUBROUTINE  eso_format_code_with_event_id_and_vocab_type (deventcd ,deventid ,dentitycd ,
  strsegmentname ,strfieldtype ,strvocabularytype )
  RETURN (trim (concat ("##CVA##" ,"," ,trim (cnvtstring (deventcd ) ) ,"," ," ," ," ," ,trim (
     cnvtstring (deventid ) ) ,"," ,trim (cnvtstring (dentitycd ) ) ,"," ,trim (strsegmentname ) ,
    "," ,trim (strfieldtype ) ,", ," ,trim (strvocabularytype ) ) ) )
 END ;Subroutine
 SUBROUTINE  eso_format_code_with_event_id_suscep_seq_nbr (deventcd ,deventid ,dentitycd ,
  strsegmentname ,strfieldtype ,isuscepseqnbr ,strvocabularytype )
  RETURN (trim (concat ("##CVA##" ,"," ,trim (cnvtstring (deventcd ) ) ,"," ," ," ," ," ,trim (
     cnvtstring (deventid ) ) ,"," ,trim (cnvtstring (dentitycd ) ) ,"," ,trim (strsegmentname ) ,
    "," ,trim (strfieldtype ) ,"," ,trim (cnvtstring (isuscepseqnbr ) ) ,"," ,trim (
     strvocabularytype ) ) ) )
 END ;Subroutine
 SUBROUTINE  eso_format_code_with_event_id_micro_seq_nbr (deventcd ,deventid ,dentitycd ,
  strsegmentname ,strfieldtype ,imicroseqnbr ,strvocabularytype )
  RETURN (trim (concat ("##CVA##" ,"," ,trim (cnvtstring (deventcd ) ) ,"," ," ," ," ," ,trim (
     cnvtstring (deventid ) ) ,"," ,trim (cnvtstring (dentitycd ) ) ,"," ,trim (strsegmentname ) ,
    "," ,trim (strfieldtype ) ,"," ,trim (cnvtstring (imicroseqnbr ) ) ,"," ,trim (strvocabularytype
     ) ) ) )
 END ;Subroutine
 SUBROUTINE  eso_format_nomen_or_string (strvalue ,deventid ,dentitycd ,strsegmentname ,strfieldtype
  ,imicroseqnbr )
  RETURN (trim (concat ("##NOS##" ,"," ,trim (strvalue ) ,"," ,trim (cnvtstring (deventid ) ) ,"," ,
    trim (cnvtstring (dentitycd ) ) ,"," ,trim (strsegmentname ) ,"," ,trim (strfieldtype ) ,"," ,
    trim (cnvtstring (imicroseqnbr ) ) ) ) )
 END ;Subroutine
 SUBROUTINE  eso_nomen_concept (dnomenid )
  DECLARE icnt = i4 WITH protect ,noconstant (1 )
  DECLARE inomenidx = i4 WITH protect ,noconstant (0 )
  DECLARE inomensize = i4 WITH protect ,noconstant (size (result_struct->nomenclatures ,5 ) )
  SET inomenidx = locateval (icnt ,1 ,inomensize ,dnomenid ,result_struct->nomenclatures[icnt ].
   nomen_id )
  IF ((inomenidx = 0 ) )
   SELECT INTO "nl:"
    n.source_string ,
    n.source_vocabulary_cd ,
    cmt.concept_identifier ,
    cmt.concept_name
    FROM (cmt_concept cmt ),
     (nomenclature n )
    PLAN (n
     WHERE (n.nomenclature_id = dnomenid ) )
     JOIN (cmt
     WHERE (cmt.concept_cki = n.concept_cki )
     AND (cmt.active_ind = 1 ) )
    DETAIL
     IF ((size (trim (n.concept_cki ) ) > 0 ) ) inomenidx = (inomensize + 1 ) ,stat = alterlist (
       result_struct->nomenclatures ,inomenidx ) ,result_struct->nomenclatures[inomenidx ].nomen_id
      = dnomenid ,result_struct->nomenclatures[inomenidx ].concept_ident = cmt.concept_identifier ,
      result_struct->nomenclatures[inomenidx ].concept_name = cmt.concept_name ,result_struct->
      nomenclatures[inomenidx ].source_string = n.source_string ,result_struct->nomenclatures[
      inomenidx ].source_vocab_cd = n.source_vocabulary_cd
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  RETURN (inomenidx )
 END ;Subroutine
 SUBROUTINE  populate_order_diagnoses (dorderid ,iobridx )
  DECLARE idiagsize = i4 WITH protect ,noconstant (0 )
  DECLARE idiagidx = i4 WITH protect ,noconstant (0 )
  DECLARE inomidx = i4 WITH protect ,noconstant (0 )
  DECLARE dorderdiagcd = f8 WITH protect ,constant (eso_get_meaning_by_codeset (23549 ,"ORDERDIAG" )
   )
  DECLARE dordericd9cd = f8 WITH protect ,constant (eso_get_meaning_by_codeset (23549 ,"ORDERICD9" )
   )
  FREE RECORD diaglist
  RECORD diaglist (
    1 item [* ]
      2 nomen_id = f8
      2 ft_desc = vc
  )
  SELECT INTO "nl:"
   table_ind = decode (n.seq ,"n" ,d.seq ,"d" ,"x" ) ,
   n.nomenclature_id ,
   d.diag_ftdesc
   FROM (nomen_entity_reltn er ),
    (nomenclature n ),
    (diagnosis d ),
    (dummyt d1 WITH seq = 1 ),
    (dummyt d2 WITH seq = 1 )
   PLAN (er
    WHERE (er.active_ind > 0 )
    AND (er.parent_entity_name = "ORDERS" )
    AND (er.parent_entity_id = dorderid )
    AND (((er.reltn_type_cd = dorderdiagcd ) ) OR ((er.reltn_type_cd = dordericd9cd ) )) )
    JOIN (d1 )
    JOIN (((n
    WHERE (er.nomenclature_id > 0.0 )
    AND (n.nomenclature_id = er.nomenclature_id ) )
    ) ORJOIN ((d2 )
    JOIN (d
    WHERE (er.nomenclature_id <= 0.0 )
    AND (er.child_entity_name = "DIAGNOSIS" )
    AND (d.diagnosis_id = er.child_entity_id ) )
    ))
   HEAD REPORT
    i = 0
   DETAIL
    CASE (table_ind )
     OF "n" :
      i = (i + 1 ) ,
      stat = alterlist (diaglist->item ,i ) ,
      diaglist->item[i ].nomen_id = n.nomenclature_id
     OF "d" :
      i = (i + 1 ) ,
      stat = alterlist (diaglist->item ,i ) ,
      diaglist->item[i ].ft_desc = trim (d.diag_ftdesc ,3 )
     OF "x" :
      CALL echo (build (
       "WARNING!! Did NOT join to either NOMENCLATURE or DIAGNOSIS tables for ORDER_ID = " ,dorderid
       ) )
    ENDCASE
   WITH nocounter ,outerjoin = d1
  ;end select
  SET idiagsize = size (diaglist->item ,5 )
  FOR (idiagidx = 1 TO idiagsize )
   IF ((diaglist->item[idiagidx ].nomen_id > 0.0 ) )
    SET ifoundidx = eso_nomen_concept (diaglist->item[idiagidx ].nomen_id )
    IF (ifoundidx )
     SET irealidx = (size (context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].
      relevant_clin_info ,5 ) + 1 )
     SET stat = alterlist (context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].
      relevant_clin_info ,irealidx )
     SET context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].relevant_clin_info[irealidx ].
     identifier = result_struct->nomenclatures[ifoundidx ].concept_ident
     SET context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].relevant_clin_info[irealidx ].text
      = result_struct->nomenclatures[ifoundidx ].concept_name
     SET context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].relevant_clin_info[irealidx ].
     coding_system = eso_format_code (result_struct->nomenclatures[ifoundidx ].source_vocab_cd )
     SET context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].relevant_clin_info[irealidx ].
     original_text = result_struct->nomenclatures[ifoundidx ].source_string
    ENDIF
   ELSEIF ((size (trim (diaglist->item[idiagidx ].ft_desc ) ) > 0 ) )
    SET irealidx = (size (context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].
     relevant_clin_info ,5 ) + 1 )
    SET stat = alterlist (context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].
     relevant_clin_info ,irealidx )
    SET context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].relevant_clin_info[irealidx ].text
    = trim (diaglist->item[idiagidx ].ft_desc )
   ENDIF
  ENDFOR
  RETURN (size (context->person_group[1 ].res_oru_group[iobridx ].obr[1 ].relevant_clin_info ,5 ) )
 END ;Subroutine
 SUBROUTINE  eso_format_phone_cd (dphonetypecd ,dcontactmethodcd )
  IF ((validate (g_dpvdphtpalternate ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpalternate = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "ALTERNATE" ) )
  ENDIF
  IF ((validate (g_dpvdphtpbilling ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpbilling = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "BILLING" ) )
  ENDIF
  IF ((validate (g_dpvdphtpbusiness ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpbusiness = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "BUSINESS" ) )
  ENDIF
  IF ((validate (g_dpvdphtpfaxalt ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpfaxalt = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "FAX ALT" ) )
  ENDIF
  IF ((validate (g_dpvdphtpfaxbill ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpfaxbill = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "FAX BILL" ) )
  ENDIF
  IF ((validate (g_dpvdphtpfaxbus ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpfaxbus = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "FAX BUS" ) )
  ENDIF
  IF ((validate (g_dpvdphtpfaxpers ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpfaxpers = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "FAX PERS" ) )
  ENDIF
  IF ((validate (g_dpvdphtpfaxtemp ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpfaxtemp = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "FAX TEMP" ) )
  ENDIF
  IF ((validate (g_dpvdphtphome ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtphome = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "HOME" ) )
  ENDIF
  IF ((validate (g_dpvdphtpmobile ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpmobile = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "MOBILE" ) )
  ENDIF
  IF ((validate (g_dpvdphtposafterhour ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtposafterhour = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43
     ,"OS AFTERHOUR" ) )
  ENDIF
  IF ((validate (g_dpvdphtposphone ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtposphone = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "OS PHONE" ) )
  ENDIF
  IF ((validate (g_dpvdphtpospager ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpospager = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "OS PAGER" ) )
  ENDIF
  IF ((validate (g_dpvdphtposbkoffice ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtposbkoffice = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "OS BK OFFICE" ) )
  ENDIF
  IF ((validate (g_dpvdphtppageralt ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtppageralt = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PAGER ALT" ) )
  ENDIF
  IF ((validate (g_dpvdphtppagerbill ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtppagerbill = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PAGER BILL" ) )
  ENDIF
  IF ((validate (g_dpvdphtppagerbus ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtppagerbus = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PAGER BUS" ) )
  ENDIF
  IF ((validate (g_dpvdphtppagertemp ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtppagertemp = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PAGER TEMP" ) )
  ENDIF
  IF ((validate (g_dpvdphtppagerpers ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtppagerpers = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PAGER PERS" ) )
  ENDIF
  IF ((validate (g_dpvdphtppaging ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtppaging = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PAGING" ) )
  ENDIF
  IF ((validate (g_dpvdphtpportbus ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpportbus = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PORT BUS" ) )
  ENDIF
  IF ((validate (g_dpvdphtpporttemp ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpporttemp = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PORT TEMP" ) )
  ENDIF
  IF ((validate (g_dpvdphtpsecbusiness ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpsecbusiness = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43
     ,"SECBUSINESS" ) )
  ENDIF
  IF ((validate (g_dpvdphtptechnical ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtptechnical = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "TECHNICAL" ) )
  ENDIF
  IF ((validate (g_dpvdphtpverify ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphtpverify = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "VERIFY" ) )
  ENDIF
  IF ((validate (g_deprescphone ,- (1 ) ) = - (1 ) ) )
   DECLARE g_deprescphone = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "PHONEEPRESCR" ) )
  ENDIF
  IF ((validate (g_deprescfax ,- (1 ) ) = - (1 ) ) )
   DECLARE g_deprescfax = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (43 ,
     "FAXEPRESCR" ) )
  ENDIF
  IF ((validate (g_dpvdphfmtfax ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphfmtfax = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (23056 ,
     "FAX" ) )
  ENDIF
  IF ((validate (g_dpvdphfmttel ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphfmttel = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (23056 ,
     "TEL" ) )
  ENDIF
  IF ((validate (g_dpvdphfmtemail ,- (1 ) ) = - (1 ) ) )
   DECLARE g_dpvdphfmtemail = f8 WITH public ,persist ,constant (eso_get_meaning_by_codeset (23056 ,
     "MAILTO" ) )
  ENDIF
  IF ((((dcontactmethodcd = 0 ) ) OR ((dcontactmethodcd = g_dpvdphfmttel ) )) )
   IF ((dphonetypecd IN (g_dpvdphtpalternate ,
   g_dpvdphtpbilling ,
   g_dpvdphtpbusiness ,
   g_dpvdphtpfaxalt ,
   g_dpvdphtpfaxbill ,
   g_dpvdphtpfaxbus ,
   g_dpvdphtpfaxpers ,
   g_dpvdphtpfaxtemp ,
   g_dpvdphtphome ,
   g_dpvdphtpmobile ,
   g_dpvdphtposafterhour ,
   g_dpvdphtposphone ,
   g_dpvdphtpospager ,
   g_dpvdphtposbkoffice ,
   g_dpvdphtppageralt ,
   g_dpvdphtppagerbill ,
   g_dpvdphtppagerbus ,
   g_dpvdphtppagertemp ,
   g_dpvdphtppagerpers ,
   g_dpvdphtppaging ,
   g_dpvdphtpportbus ,
   g_dpvdphtpporttemp ,
   g_dpvdphtpsecbusiness ,
   g_dpvdphtptechnical ,
   g_dpvdphtpverify ,
   g_deprescphone ,
   g_deprescfax ) ) )
    RETURN (eso_format_code (dphonetypecd ) )
   ELSE
    RETURN (" " )
   ENDIF
  ELSE
   RETURN (eso_format_code (dcontactmethodcd ) )
  ENDIF
 END ;Subroutine
 CALL echo ("<===== ESO_HL7_FORMATTING.INC End =====>" )
 CALL echo ("<===== ESO_EFFECTIVE_TIME_ADJUST.INC  START =====>" )
 CALL echo ("MOD:000" )
 IF (NOT (validate (g_desoefftmadj ) ) )
  DECLARE desoefftmadjtmp = f8 WITH protect ,noconstant (0.0 )
  DECLARE desoeffectivetimeadjustcd = f8 WITH protect ,constant (eso_get_meaning_by_codeset (14874 ,
    "ESOEFFTMADJ" ) )
  DECLARE desocontribdefault = f8 WITH protect ,constant (eso_get_meaning_by_codeset (89 ,
    "ESODEFAULT" ) )
  SELECT INTO "nl:"
   op.contributor_system_cd ,
   op.process_type_cd ,
   op.null_string
   FROM (outbound_field_processing op )
   WHERE (op.contributor_system_cd = desocontribdefault )
   AND (op.process_type_cd = desoeffectivetimeadjustcd )
   DETAIL
    desoefftmadjtmp = (100 * cnvtreal (op.null_string ) )
   WITH nocounter
  ;end select
  DECLARE g_desoefftmadj = f8 WITH persist ,constant (desoefftmadjtmp )
 ENDIF
 DECLARE get_encntr_prsnl_info_idx (encntr_id1 ,reln_type_cdf1 ) = i4
 DECLARE fetch_encntr_prsnl_info (encntr_id2 ,reln_type_cdf2 ,mode2 ) = i4
 DECLARE fetch_encntr_prsnl_from_db (encntr_id3 ,reln_type_cdf3 ,mode3 ,eidx3 ) = i4
 DECLARE get_prsnl_info_idx (person_id4 ) = i4
 DECLARE fetch_prsnl_info (person_id5 ,mode5 ) = i4
 DECLARE fetch_prsnl_from_db (person_id6 ,mode6 ,pidx6 ) = i4
 DECLARE get_person_info_idx (person_id7 ,encntr_id7 ,mode7 ) = i4
 DECLARE fetch_person_info (person_id8 ,encntr_id8 ,mode8 ) = i4
 DECLARE fetch_person_from_db (person_id9 ,encntr_id9 ,mode9 ,pidx9 ) = i4
 DECLARE eso_format_prsnl_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind ) = c100
 DECLARE eso_format_prsnl_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind ) = c100
 DECLARE get_encntr_prsnl_id_info_idx (encntr_id10 ,reln_type_cdf10 ,person_id10 ) = i4
 DECLARE fetch_encntr_prsnl_id_info (encntr_id11 ,reln_type_cdf11 ,person_id11 ,mode11 ) = i4
 DECLARE fetch_encntr_prsnl_id_from_db (encntr_id12 ,reln_type_cdf12 ,mode12 ,eidx12 ,person_id12 )
 = i4
 DECLARE eso_format_prsnl_id_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,mode ,
  hl7_struct ,repeat_ind ) = c100
 DECLARE eso_format_prsnl_id_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,mode ,
  hl7_struct ,repeat_ind ) = c100
 DECLARE eso_format_prsnl_id (field_cdf ,group_cdf ,xx_name ,xx_id ,xx_cdf ,x_person_id ,ui_struct ,
  instance ) = c100
 SUBROUTINE  get_encntr_prsnl_info_idx (encntr_id1 ,reln_type_cdf1 )
  SET list_size = 0
  SET list_size = size (context->cerner.encntr_prsnl_info.encntr ,5 )
  IF ((list_size > 0 )
  AND (encntr_id1 > 0 ) )
   SET ieso1 = 1
   FOR (ieso1 = ieso1 TO list_size )
    IF ((context->cerner.encntr_prsnl_info.encntr[ieso1 ].encntr_id = encntr_id1 ) )
     IF ((trim (reln_type_cdf1 ) > "" ) )
      IF ((context->cerner.encntr_prsnl_info.encntr[ieso1 ].reln_type_cdf = reln_type_cdf1 ) )
       RETURN (ieso1 )
      ENDIF
     ELSE
      RETURN (ieso1 )
     ENDIF
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_info (encntr_id2 ,reln_type_cdf2 ,mode2 )
  IF ((encntr_id2 = 0 ) )
   RETURN (0 )
  ENDIF
  SET eidx = 0
  SET eidx = get_encntr_prsnl_info_idx (encntr_id2 ,reln_type_cdf2 )
  IF ((eidx > 0 ) )
   RETURN (eidx )
  ENDIF
  SET eidx = (size (context->cerner.encntr_prsnl_info.encntr ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,eidx )
  SET context->cerner.encntr_prsnl_info.encntr_count = eidx
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].encntr_id = encntr_id2
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].reln_type_cdf = reln_type_cdf2
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].prsnl_r_count = 0
  SET stat = 0
  SET stat = fetch_encntr_prsnl_from_db (encntr_id2 ,reln_type_cdf2 ,mode2 ,eidx )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,(eidx - 1 ) )
   SET context->cerner.encntr_prsnl_info.encntr_count = (eidx - 1 )
   RETURN (0 )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_from_db (encntr_id3 ,reln_type_cdf3 ,mode3 ,eidx3 )
  SET reln_type_cd = 0
  SELECT INTO "nl:"
   c.code_value
   FROM (code_value c )
   WHERE (c.code_set = 333 )
   AND (c.cdf_meaning = trim (reln_type_cdf3 ) )
   AND (c.active_ind = 1 )
   AND (c.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
   AND (((c.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) ) ) OR ((c.end_effective_dt_tm =
   null ) ))
   DETAIL
    reln_type_cd = c.code_value
   WITH nocounter
  ;end select
  SET count = 0
  SELECT INTO "nl:"
   e.prsnl_person_id ,
   e.ft_prsnl_name ,
   e.free_text_cd ,
   e.encntr_prsnl_r_cd
   FROM (encntr_prsnl_reltn e )
   WHERE (e.encntr_id = encntr_id3 )
   AND (e.encntr_id > 0 )
   AND (e.encntr_prsnl_r_cd = reln_type_cd )
   AND (e.active_ind = 1 )
   AND (e.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((e.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((e
   .end_effective_dt_tm = null ) ))
   DETAIL
    count = (count + 1 ) ,
    stat = alterlist (context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r ,count ) ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].prsnl_person_id = e
    .prsnl_person_id ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].ft_prsnl_name = trim (e
     .ft_prsnl_name ,3 ) ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].free_text_cd = e.free_text_cd ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].encntr_prsnl_r_cd = e
    .encntr_prsnl_r_cd
   WITH nocounter
  ;end select
  SET context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r_count = count
  IF ((curqual > 0 ) )
   SET ieso3 = 1
   FOR (ieso3 = ieso3 TO count )
    SET context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[ieso3 ].idx = fetch_prsnl_info (
     context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[ieso3 ].prsnl_person_id ,mode3 )
   ENDFOR
  ELSE
   RETURN (0 )
  ENDIF
  RETURN (eidx3 )
 END ;Subroutine
 SUBROUTINE  get_encntr_prsnl_id_info_idx (encntr_id10 ,reln_type_cdf10 ,person_id10 )
  SET list_size = 0
  SET list_size = size (context->cerner.encntr_prsnl_info.encntr ,5 )
  SET p_size = 0
  IF ((list_size > 0 )
  AND (encntr_id10 > 0 )
  AND (person_id10 > 0 ) )
   SET ieso10 = 1
   FOR (ieso10 = ieso10 TO list_size )
    IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].encntr_id = encntr_id10 ) )
     IF ((trim (reln_type_cdf10 ) > "" ) )
      IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].reln_type_cdf = reln_type_cdf10 ) )
       SET p_size = size (context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r ,5 )
       IF ((p_size > 0 ) )
        SET jeso10 = 1
        FOR (jeso10 = jeso10 TO p_size )
         IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r[jeso10 ].prsnl_person_id =
         person_id10 ) )
          RETURN (ieso10 )
         ENDIF
        ENDFOR
       ENDIF
      ENDIF
     ELSE
      SET p_size = size (context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r ,5 )
      IF ((p_size > 0 ) )
       SET jeso10 = 1
       FOR (jeso10 = jeso10 TO p_size )
        IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r[jeso10 ].prsnl_person_id =
        person_id10 ) )
         RETURN (ieso10 )
        ENDIF
       ENDFOR
      ENDIF
     ENDIF
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_id_info (encntr_id11 ,reln_type_cdf11 ,person_id11 ,mode11 )
  SET stat = 0
  IF ((((encntr_id11 = 0 ) ) OR ((person_id11 = 0 ) )) )
   RETURN (0 )
  ENDIF
  SET eidx = 0
  SET eidx = get_encntr_prsnl_id_info_idx (encntr_id11 ,reln_type_cdf11 ,person_id11 )
  IF ((eidx > 0 ) )
   RETURN (eidx )
  ENDIF
  SET eidx = get_encntr_prsnl_info_idx (encntr_id11 ,reln_type_cdf11 )
  IF ((eidx > 0 ) )
   SET stat = fetch_encntr_prsnl_id_from_db (encntr_id11 ,reln_type_cdf11 ,mode11 ,eidx ,person_id11
    )
   RETURN (stat )
  ENDIF
  SET eidx = (size (context->cerner.encntr_prsnl_info.encntr ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,eidx )
  SET context->cerner.encntr_prsnl_info.encntr_count = eidx
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].encntr_id = encntr_id11
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].reln_type_cdf = reln_type_cdf11
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].prsnl_r_count = 0
  SET stat = fetch_encntr_prsnl_id_from_db (encntr_id11 ,reln_type_cdf11 ,mode11 ,eidx ,person_id11
   )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,(eidx - 1 ) )
   SET context->cerner.encntr_prsnl_info.encntr_count = (eidx - 1 )
   RETURN (0 )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_id_from_db (encntr_id12 ,reln_type_cdf12 ,mode12 ,eidx12 ,
  person_id12 )
  IF ((person_id12 = 0 ) )
   RETURN (0 )
  ENDIF
  SET stat = 0
  SET count = (size (context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r ,5 ) + 1 )
  SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r ,count )
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].prsnl_person_id =
  person_id12
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].ft_prsnl_name = ""
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].free_text_cd = 0
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].encntr_prsnl_r_cd = 0
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r_count = count
  SET ieso12 = 1
  FOR (ieso12 = ieso12 TO count )
   SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[ieso12 ].idx = fetch_prsnl_info (
    context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[ieso12 ].prsnl_person_id ,mode12 )
  ENDFOR
  RETURN (eidx12 )
 END ;Subroutine
 SUBROUTINE  get_prsnl_info_idx (person_id4 )
  SET list_size = 0
  SET list_size = size (context->cerner.prsnl_info.prsnl ,5 )
  IF ((list_size > 0 )
  AND (person_id4 > 0 ) )
   SET ieso4 = 1
   FOR (ieso4 = ieso4 TO list_size )
    IF ((context->cerner.prsnl_info.prsnl[ieso4 ].person_id = person_id4 ) )
     RETURN (ieso4 )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_prsnl_info (person_id5 ,mode5 )
  IF ((person_id5 = 0 ) )
   RETURN (0 )
  ENDIF
  SET pidx = 0
  SET pidx = get_prsnl_info_idx (person_id5 )
  IF ((pidx > 0 ) )
   RETURN (pidx )
  ENDIF
  SET pidx = (size (context->cerner.prsnl_info.prsnl ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.prsnl_info.prsnl ,pidx )
  SET context->cerner.prsnl_info.prsnl_count = pidx
  SET context->cerner.prsnl_info.prsnl[pidx ].person_id = person_id5
  SET context->cerner.prsnl_info.prsnl[pidx ].alias_count = 0
  SET context->cerner.prsnl_info.prsnl[pidx ].name_count = 0
  SET stat = fetch_prsnl_from_db (person_id5 ,mode5 ,pidx )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.prsnl_info.prsnl ,(pidx - 1 ) )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_prsnl_from_db (person_id6 ,mode6 ,pidx6 )
  SET aidx = 0
  SET nidx = 0
  SET stat = 0
  SET prsnl_name_cd = 0
  SELECT INTO "nl:"
   c.code_value
   FROM (code_value c )
   WHERE (c.code_set = 213 )
   AND (c.cdf_meaning = "PRSNL" )
   AND (c.active_ind = 1 )
   AND (c.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
   AND (((c.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) ) ) OR ((c.end_effective_dt_tm =
   null ) ))
   DETAIL
    prsnl_name_cd = c.code_value
   WITH nocounter
  ;end select
  SELECT INTO "nl:"
   p.name_last ,
   p.name_first ,
   p.name_middle ,
   p.name_suffix ,
   p.name_prefix ,
   p.name_degree ,
   p.name_full ,
   p.name_type_cd ,
   p.name_title
   FROM (person_name p )
   WHERE (p.person_id = person_id6 )
   AND (p.person_id > 0 )
   AND (p.name_type_cd = prsnl_name_cd )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    nidx = (nidx + 1 ) ,
    stat = alterlist (context->cerner.prsnl_info.prsnl[pidx6 ].name ,nidx ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_middle = trim (p.name_middle ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_suffix = trim (p.name_suffix ,3 ) ,
    IF ((size (trim (p.name_prefix ,3 ) ) > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx
     ].name_prefix = trim (p.name_prefix ,3 )
    ELSE context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_prefix = trim (p.name_title ,3 )
    ENDIF
    ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_degree = trim (p.name_degree ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full = trim (p.name_full ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_type_cd = p.name_type_cd
   WITH nocounter
  ;end select
  IF ((curqual <= 0 ) )
   SELECT INTO "nl:"
    p.name_last_key ,
    p.name_first_key ,
    p.name_full_formatted ,
    p.name_last ,
    p.name_first
    FROM (prsnl p )
    WHERE (p.person_id = person_id6 )
    AND (p.person_id > 0 )
    AND (p.active_ind = 1 )
    AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
    AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
    .end_effective_dt_tm = null ) ))
    DETAIL
     nidx = (nidx + 1 ) ,
     stat = alterlist (context->cerner.prsnl_info.prsnl[pidx6 ].name ,nidx ) ,
     context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
     context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
     context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full = trim (p.name_full_formatted ,3
      ) ,
     IF ((trim (context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last ) = "" ) )
      IF ((trim (context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full ) > "" ) ) nlen = 0 ,
       nlen = size (context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full ) ,lpos = 0 ,llen
       = 0 ,lpos = findstring (" -" ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full
        ) ,
       IF ((lpos > 0 ) ) lpos = (lpos + 2 )
       ELSE lpos = 1
       ENDIF
       ,fpos = 0 ,flen = 0 ,mpos = 0 ,mlen = 0 ,fpos = findstring (", " ,context->cerner.prsnl_info.
        prsnl[pidx6 ].name[nidx ].name_full ,lpos ) ,
       IF ((fpos > 0 ) ) llen = (fpos - lpos ) ,fpos = (fpos + 2 ) ,mpos = findstring (" " ,context->
         cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full ,fpos ) ,
        IF ((mpos > 0 ) ) flen = (mpos - fpos ) ,mpos = (mpos + 1 ) ,mlen = ((nlen - mpos ) + 1 )
        ELSE flen = ((nlen - fpos ) + 1 )
        ENDIF
       ELSE llen = ((nlen - fpos ) + 1 )
       ENDIF
       ,
       IF ((llen > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = substring (
         lpos ,llen ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full )
       ENDIF
       ,
       IF ((flen > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = substring
        (fpos ,flen ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full )
       ENDIF
       ,
       IF ((mlen > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_middle =
        substring (mpos ,mlen ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full )
       ENDIF
      ELSE context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = trim (p.name_last_key ,3
        ) ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = trim (p.name_first_key ,
        3 )
      ENDIF
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  SET context->cerner.prsnl_info.prsnl[pidx6 ].name_count = nidx
  SELECT INTO "nl:"
   p.alias ,
   p.prsnl_alias_type_cd ,
   p.prsnl_alias_sub_type_cd ,
   p.alias_pool_cd ,
   p.check_digit ,
   p.check_digit_method_cd ,
   p.contributor_system_cd
   FROM (prsnl_alias p )
   WHERE (p.person_id = person_id6 )
   AND (p.person_id > 0 )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    aidx = (aidx + 1 ) ,
    stat = alterlist (context->cerner.prsnl_info.prsnl[pidx6 ].alias ,aidx ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias = trim (p.alias ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias_type_cd = p.prsnl_alias_type_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias_subtype_cd = p
    .prsnl_alias_sub_type_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias_pool_cd = p.alias_pool_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].check_digit = p.check_digit ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].check_digit_method_cd = p
    .check_digit_method_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].contributor_system_cd = p
    .contributor_system_cd
   WITH nocounter
  ;end select
  SET context->cerner.prsnl_info.prsnl[pidx6 ].alias_count = aidx
  RETURN (pidx6 )
 END ;Subroutine
 SUBROUTINE  get_person_info_idx (person_id7 ,encntr_id7 )
  SET list_size = 0
  SET list_size = size (context->cerner.person_info.person ,5 )
  IF ((list_size > 0 )
  AND (person_id7 > 0 ) )
   SET ieso7 = 1
   FOR (ieso7 = ieso7 TO list_size )
    IF ((context->cerner.person_info.person[ieso7 ].person_id = person_id7 ) )
     IF ((encntr_id7 > 0 ) )
      IF ((context->cerner.person_info.person[ieso7 ].encntr_id = encntr_id7 ) )
       RETURN (ieso7 )
      ENDIF
     ELSE
      RETURN (ieso7 )
     ENDIF
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_person_info (person_id8 ,encntr_id8 ,mode8 )
  IF ((person_id8 = 0 ) )
   RETURN (0 )
  ENDIF
  SET pidx = 0
  SET pidx = get_person_info_idx (person_id8 ,encntr_id8 )
  IF ((pidx > 0 ) )
   RETURN (pidx )
  ENDIF
  SET pidx = (size (context->cerner.person_info.person ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.person_info.person ,pidx )
  SET context->cerner.person_info.person_count = pidx
  SET context->cerner.person_info.person[pidx ].person_id = person_id8
  SET context->cerner.person_info.person[pidx ].encntr_id = encntr_id8
  SET context->cerner.person_info.person[pidx ].alias_count = 0
  SET context->cerner.person_info.person[pidx ].encntr_count = 0
  SET context->cerner.person_info.person[pidx ].name_count = 0
  SET stat = fetch_person_from_db (person_id8 ,encntr_id8 ,mode8 ,pidx )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.person_info.person ,(pidx - 1 ) )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_person_from_db (person_id9 ,encntr_id9 ,mode9 ,pidx9 )
  SET aidx = 0
  SET nidx = 0
  SET current_name_cd = 0
  SET stat = 0
  SELECT INTO "nl:"
   p.name_last ,
   p.name_first ,
   p.name_middle ,
   p.name_suffix ,
   p.name_prefix ,
   p.name_degree ,
   p.name_full ,
   p.name_type_cd
   FROM (person_name p )
   WHERE (p.person_id = person_id9 )
   AND (p.person_id > 0 )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    nidx = (nidx + 1 ) ,
    stat = alterlist (context->cerner.person_info.person[pidx9 ].name ,nidx ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_middle = trim (p.name_middle ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_suffix = trim (p.name_suffix ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_prefix = trim (p.name_prefix ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_degree = trim (p.name_degree ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_full = trim (p.name_full ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_type_cd = p.name_type_cd
   WITH nocounter
  ;end select
  IF ((curqual <= 0 ) )
   SELECT INTO "nl:"
    p.name_last_key ,
    p.name_first_key ,
    p.name_full_formatted ,
    p.name_last ,
    p.name_first ,
    p.name_middle
    FROM (person p )
    WHERE (p.person_id = person_id9 )
    AND (p.person_id > 0 )
    AND (p.active_ind = 1 )
    AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
    AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
    .end_effective_dt_tm = null ) ))
    DETAIL
     nidx = (nidx + 1 ) ,
     stat = alterlist (context->cerner.person_info.person[pidx9 ].name ,nidx ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_middle = trim (p.name_middle ,3 ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_full = trim (p.name_full_formatted ,
      3 ) ,
     IF ((trim (context->cerner.person_info.person[pidx9 ].name[nidx ].name_last ) = "" ) ) context->
      cerner.person_info.person[pidx9 ].name[nidx ].name_last = trim (p.name_last_key ,3 ) ,context->
      cerner.person_info.person[pidx9 ].name[nidx ].name_first = trim (p.name_first_key ,3 )
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  SET context->cerner.person_info.person[pidx9 ].name_count = nidx
  SELECT INTO "nl:"
   p.alias ,
   p.person_alias_type_cd ,
   p.person_alias_sub_type_cd ,
   p.alias_pool_cd ,
   p.check_digit ,
   p.check_digit_method_cd ,
   p.contributor_system_cd
   FROM (person_alias p )
   WHERE (p.person_id = person_id9 )
   AND (p.person_id > 0 )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    aidx = (aidx + 1 ) ,
    stat = alterlist (context->cerner.person_info.person[pidx9 ].alias ,aidx ) ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias = trim (p.alias ,3 ) ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_type_cd = p.person_alias_type_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_subtype_cd = p
    .person_alias_sub_type_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_pool_cd = p.alias_pool_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit = p.check_digit ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit_method_cd = p
    .check_digit_method_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].contributor_system_cd = p
    .contributor_system_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].encntr_ind = 0 ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].org_id = 0
   WITH nocounter
  ;end select
  IF ((encntr_id9 > 0 ) )
   SELECT INTO "nl:"
    e.organization_id ,
    ea.alias ,
    ea.encntr_alias_type_cd ,
    ea.encntr_alias_sub_type_cd ,
    ea.alias_pool_cd ,
    ea.check_digit ,
    ea.check_digit_method_cd ,
    ea.contributor_system_cd
    FROM (encounter e ),
     (encntr_alias ea )
    PLAN (e
     WHERE (e.encntr_id = encntr_id9 )
     AND (e.encntr_id > 0 ) )
     JOIN (ea
     WHERE (e.encntr_id = ea.encntr_id )
     AND (ea.active_ind = 1 )
     AND (ea.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
     AND (((ea.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((
     ea.end_effective_dt_tm = null ) )) )
    DETAIL
     aidx = (aidx + 1 ) ,
     stat = alterlist (context->cerner.person_info.person[pidx9 ].alias ,aidx ) ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].alias = trim (ea.alias ,3 ) ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_type_cd = ea.encntr_alias_type_cd
     ,context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_subtype_cd = ea
     .encntr_alias_sub_type_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_pool_cd = ea.alias_pool_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit = ea.check_digit ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit_method_cd = ea
     .check_digit_method_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].contributor_system_cd = ea
     .contributor_system_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].encntr_ind = 1 ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].org_id = e.organization_id
    WITH nocounter
   ;end select
  ENDIF
  SET context->cerner.person_info.person[pidx9 ].alias_count = aidx
  RETURN (pidx9 )
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   RETURN (substring (1 ,100 ,concat (trim (request->esoinfo.eprsnlprefix ) ,"," ,trim (field1 ) ,
     "," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_info (t_encntr_id ,
        t_reln_type_cdf ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (repeat_ind )
      ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   RETURN (substring (1 ,100 ,concat (trim (get_esoinfo_string ("eprsnlprefix" ) ) ,"," ,trim (
      field1 ) ,"," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_info (t_encntr_id ,
        t_reln_type_cdf ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (repeat_ind )
      ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_id_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,mode ,
  hl7_struct ,repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" )
  AND (person_id > 0 ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   SET t_person_id = person_id
   RETURN (substring (1 ,100 ,concat (trim (request->esoinfo.eprsnlprefix ) ,"," ,trim (field1 ) ,
     "," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_id_info (t_encntr_id ,
        t_reln_type_cdf ,t_person_id ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (
       repeat_ind ) ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_id_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,
  mode ,hl7_struct ,repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" )
  AND (person_id > 0 ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   SET t_person_id = person_id
   RETURN (substring (1 ,100 ,concat (trim (get_esoinfo_string ("eprsnlprefix" ) ) ,"," ,trim (
      field1 ) ,"," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_id_info (t_encntr_id ,
        t_reln_type_cdf ,t_person_id ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (
       repeat_ind ) ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_id (field_cdf ,group_cdf ,xx_name ,xx_id ,xx_cdf ,x_person_id ,
  ui_struct ,instance )
  CALL echo ("Calling eso_format_prsnl_id()" )
  RETURN (eso_format_prsnl_id_enctr_ctx (field_cdf ,"ALL_PRSNL" ,xx_id ,trim (concat (trim (xx_cdf ,
      3 ) ,"_" ,trim (instance ,3 ) ) ,3 ) ,x_person_id ,0 ,ui_struct ,1 ) )
 END ;Subroutine
 CALL echo ("<===== FSI_PHARM_COMMON_.INC  START =====>" )
 CALL echo ("MOD:012" )
 DECLARE temp_short = i2 WITH private ,noconstant (0 )
 DECLARE hmsg = i4
 DECLARE hreq = i4
 DECLARE fill_pharmacy_note_cache (order_id1 ,action_sequence1 ) = i4
 DECLARE fill_order_alias_cache (order_id1 ) = i4
 DECLARE fill_order_detail_cache (order_id1 ,action_sequence1 ) = i4
 DECLARE fill_order_ingredient_and_product_cache (order_id1 ,action_sequence1 ) = i4
 DECLARE fill_verifying_pharmacist (order_id1 ,action_sequence1 ) = i4
 DECLARE fill_order_dispense_cache (order_id1 ) = i4
 DECLARE fill_order_ingredient_cache (order_id1 ,action_sequence1 ) = i4
 DECLARE fill_vda_order_ingredient_and_product_cache (order_id1 ) = i4
 SUBROUTINE  fill_pharmacy_note_cache (order_id1 ,action_sequence1 )
  CALL echo ("Entering fill_pharmacy_note_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  FREE SET fill_request_ind
  RECORD fill_request_ind (
    1 order_id = f8
    1 action_sequence = i4
    1 find_last_note_ind = i2
  )
  FREE SET fill_request
  RECORD fill_request (
    1 order_id = f8
    1 action_sequence = i4
  )
  FREE SET fill_reply
  RECORD fill_reply (
    1 comments [* ]
      2 action_sequence = i4
      2 comment_type_cd = f8
      2 comment_text = vc
      2 where_to_print = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
  SET hmsg = uar_srvselect ("rx_get_notes" )
  IF ((hmsg = 0 ) )
   CALL echo ("Unable to retrieve message handle.  Cannot call rx_get_notes script" )
   RETURN (1 )
  ELSE
   SET hreq = uar_srvcreaterequest (hmsg )
   IF ((hreq = 0 ) )
    CALL echo ("Unable to SrvCreateRequest" )
    RETURN (0 )
   ENDIF
   SET temp_short = uar_srvfieldexists (hreq ,"find_last_note_ind" )
   IF (temp_short )
    CALL echo ("New Pharmacy script" )
    SET fill_request_ind->order_id = order_id1
    SET fill_request_ind->action_sequence = action_sequence1
    SET fill_request_ind->find_last_note_ind = 1
    CALL echorecord (fill_request_ind )
    EXECUTE rx_get_notes WITH replace ("REQUEST" ,"FILL_REQUEST_IND" ) ,
    replace ("REPLY" ,"FILL_REPLY" )
   ELSE
    CALL echo ("Old Pharmacy script" )
    SET fill_request->order_id = order_id1
    SET fill_request->action_sequence = 0
    EXECUTE rx_get_notes WITH replace ("REQUEST" ,"FILL_REQUEST" ) ,
    replace ("REPLY" ,"FILL_REPLY" )
   ENDIF
   IF ((fill_reply->status_data.status != "S" ) )
    CALL echo (build ("rxa_get_notes returned a script status of:" ,fill_reply->status_data.status )
     )
   ELSE
    SET x = 0
    SET i = 0
    CALL echo ("Reply from rx_get_notes script" )
    CALL echorecord (fill_reply )
    CALL echo (build ("The # of comments returned = " ,size (fill_reply->comments ,5 ) ) )
    FOR (i = 1 TO size (fill_reply->comments ,5 ) )
     CALL echo (build ("The comment_type_cd = " ,fill_reply->comments[i ].comment_type_cd ) )
     IF ((fill_reply->comments[i ].comment_type_cd > 0 ) )
      SET x = (x + 1 )
      CALL echo (build ("x is ==>" ,x ) )
      SET stat = alterlist (reply->pn_cache.note ,x )
      SET reply->pn_cache.note[x ].comment_type_cd = fill_reply->comments[i ].comment_type_cd
      SET reply->pn_cache.note[x ].comment_type_meaning = uar_get_code_meaning (fill_reply->comments[
       i ].comment_type_cd )
      SET reply->pn_cache.note[x ].comment_count = 1
      SET stat = alterlist (reply->pn_cache.note[x ].comment ,1 )
      SET reply->pn_cache.note[x ].comment[1 ].comment = fill_reply->comments[i ].comment_text
      SET reply->pn_cache.note[x ].comment[1 ].where_to_print = fill_reply->comments[i ].
      where_to_print
      CALL echo (build ("The comment type is = " ,reply->pn_cache.note[x ].comment_type_meaning ) )
     ENDIF
    ENDFOR
    CALL echo ("This is the PN_cache after it is filled" )
    CALL echo (build ("The size of note_count is ==>" ,size (reply->pn_cache.note ,5 ) ) )
    SET reply->pn_cache.note_count = size (reply->pn_cache.note ,5 )
    SET i = 0
    CALL echorecord (reply )
    CALL echo ("About to start rtf processing" )
    FOR (i = 1 TO reply->pn_cache.note_count )
     FREE SET comment_cnt
     SET comment_cnt = reply->pn_cache.note[i ].comment_count
     CALL echo (build ("Comment_count  " ,comment_cnt ) )
     SET curr_pos = 1
     SET cmt_cnt = 0
     SET lf_cnt = 0
     CALL echo ("First loop" )
     FOR (j = 1 TO comment_cnt )
      CALL echo ("Second loop" )
      FREE SET rtf_text
      FREE SET rtf_text_size
      FREE SET no_rtf_text
      FREE SET length
      FREE SET begin_pos
      FREE SET end_pos
      FREE SET cur_pos
      FREE SET curr_char
      IF ((findstring ("rtf1" ,reply->pn_cache.note[i ].comment[j ].comment ) > 0 ) )
       SET rtf_text = trim (reply->pn_cache.note[i ].comment[j ].comment ,3 )
       SET rtf_text_size = textlen (rtf_text )
       SET no_rtf_text = fillstring (value (rtf_text_size ) ," " )
       CALL uar_rtf2 (rtf_text ,rtf_text_size ,no_rtf_text ,rtf_text_size ,rtf_text_size ,1 )
       SET reply->pn_cache.note[i ].comment[j ].comment = no_rtf_text
      ENDIF
     ENDFOR
    ENDFOR
    FREE SET rtf_text
    FREE SET rtf_text_size
    FREE SET no_rtf_text
    FREE SET length
    FREE SET begin_pos
    FREE SET end_pos
    FREE SET cur_pos
    FREE SET curr_char
   ENDIF
   CALL echo ("After rtf processing" )
   CALL echo ("Destroy SrvHandle." )
   CALL echo (build ("hReq is ===>" ,hreq ) )
   IF ((hreq > 0 ) )
    CALL uar_srvdestroyinstance (hreq )
   ENDIF
   CALL echo ("Exiting fill_pharmacy_note_cache subroutine" )
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_order_alias_cache (order_id1 )
  CALL echo ("Entering fill_order_alias_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  SELECT INTO "nl:"
   oal.alias ,
   oal.alias_pool_cd ,
   oal.order_alias_type_cd ,
   oal.order_alias_sub_type_cd
   FROM (order_alias oal )
   WHERE (oal.order_id = order_id1 )
   AND (oal.active_ind = 1 )
   HEAD REPORT
    i = 0 ,
    reply->oal_cache.alias_count = 0
   DETAIL
    i = (i + 1 ) ,
    IF ((mod (i ,10 ) = 1 ) ) stat = alterlist (reply->oal_cache.alias ,(i + 9 ) )
    ENDIF
    ,reply->oal_cache.alias[i ].alias = oal.alias ,
    reply->oal_cache.alias[i ].alias_pool_cd = oal.alias_pool_cd ,
    reply->oal_cache.alias[i ].order_alias_type_cd = oal.order_alias_type_cd ,
    reply->oal_cache.alias[i ].order_alias_sub_type_cd = oal.order_alias_sub_type_cd
   FOOT REPORT
    reply->oal_cache.alias_count = i ,
    stat = alterlist (reply->oal_cache.alias ,reply->oal_cache.alias_count )
   WITH nocounter
  ;end select
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_order_detail_cache (order_id1 ,action_sequence1 )
  CALL echo ("Entering fill_order_detail_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  CALL echo (build ("The action_sequence is --->" ,action_sequence1 ) )
  IF ((validate (bprnobxflex ,99999999 ) = 99999999 ) )
   DECLARE bprnobxflex = i4 WITH protect ,noconstant (0 )
  ENDIF
  FREE SET map_to_obx
  SET map_to_obx = 0
  SELECT INTO "nl:"
   od.oe_field_display_value ,
   od.oe_field_meaning ,
   od.oe_field_value ,
   oef.fsi_map_to_obx_ind ,
   oef.field_type_flag
   FROM (order_detail od ),
    (order_entry_fields oef )
   PLAN (od
    WHERE (od.order_id = order_id1 )
    AND (od.action_sequence <= action_sequence1 ) )
    JOIN (oef
    WHERE (oef.oe_field_id = od.oe_field_id ) )
   ORDER BY od.oe_field_id ,
    od.action_sequence DESC
   HEAD REPORT
    i = 0 ,
    reply->od_cache.obx_detail_count = 0 ,
    act_seq = 0 ,
    highest_act_seq_flag = 0
   HEAD od.oe_field_id
    act_seq = od.action_sequence ,highest_act_seq_flag = 1
   HEAD od.action_sequence
    IF ((act_seq != od.action_sequence ) ) highest_act_seq_flag = 0
    ENDIF
   DETAIL
    IF ((highest_act_seq_flag = 1 ) ) map_to_obx = 0 ,
     CASE (od.oe_field_meaning )
      OF "CANCELREASON" :
       reply->od_cache.cancelreason.value = od.oe_field_value ,
       reply->od_cache.cancelreason.display = od.oe_field_display_value
      OF "DCREASON" :
       reply->od_cache.dcreason.value = od.oe_field_value ,
       reply->od_cache.dcreason.display = od.oe_field_display_value
      OF "DRUGFORM" :
       reply->od_cache.drugform.value = od.oe_field_value ,
       reply->od_cache.drugform.display = od.oe_field_display_value
      OF "DURATION" :
       reply->od_cache.duration.value = od.oe_field_value
      OF "DURATIONUNIT" :
       reply->od_cache.durationunit.value = od.oe_field_value
      OF "FREQ" :
       reply->od_cache.freq.value = od.oe_field_value ,
       reply->od_cache.freq.display = od.oe_field_display_value
      OF "FREQSCHEDID" :
       reply->od_cache.freqschedid.value = od.oe_field_value
      OF "INFUSEOVER" :
       reply->od_cache.infuseover.value = od.oe_field_value
      OF "INFUSEOVERUNIT" :
       reply->od_cache.infuseoverunit.value = od.oe_field_value
      OF "PRIORITY" :
       reply->od_cache.priority.value = od.oe_field_value
      OF "RATE" :
       reply->od_cache.rate.value = od.oe_field_value
      OF "RESUMEREASON" :
       reply->od_cache.resumereason.value = od.oe_field_value ,
       reply->od_cache.resumereason.display = od.oe_field_display_value
      OF "RXROUTE" :
       reply->od_cache.rxroute.value = od.oe_field_value ,
       reply->od_cache.rxroute.display = od.oe_field_display_value
      OF "SUSPENDREASON" :
       reply->od_cache.suspendreason.value = od.oe_field_value ,
       reply->od_cache.suspendreason.display = od.oe_field_display_value
      OF "TITRATEIND" :
       reply->od_cache.titrateind.value = od.oe_field_value
      OF "NEXTDOSEDTTM" :
       map_to_obx = 1 ,
       stat = set_esoinfo_string ("nextdosedttm" ,od.oe_field_display_value ) ,
       stat = set_esoinfo_double ("nextdosedttm" ,od.oe_field_id )
      OF "TOTALVOLUME" :
       map_to_obx = 1 ,
       reply->od_cache.totalvolume.display = od.oe_field_display_value ,
       stat = set_esoinfo_double ("totalvolume" ,od.oe_field_value )
      OF "PRNREASON" :
       IF (bprnobxflex ) map_to_obx = 1
       ENDIF
       ,
       reply->od_cache.prnreason.display = od.oe_field_display_value ,
       stat = set_esoinfo_string ("prnreason" ,od.oe_field_display_value )
      OF "FREETEXTRATE" :
       reply->od_cache.freetextrate.display = od.oe_field_display_value
      OF "REPLACEEVERY" :
       reply->od_cache.replaceevery.id = od.oe_field_id ,
       reply->od_cache.replaceevery.display = od.oe_field_display_value
      OF "REPLACEEVERYUNIT" :
       reply->od_cache.replaceeveryunit.value = od.oe_field_value ,
       reply->od_cache.replaceeveryunit.display = od.oe_field_display_value
      OF "STOPTYPE" :
       IF ((reply->oac_cache.action_type_mean IN ("CANCEL" ,
       "COMPLETE" ,
       "DISCONTINUE" ,
       "DELETE" ) ) ) stat = set_esoinfo_double ("stoptype" ,reply->o_cache.stop_type_cd )
       ELSE stat = set_esoinfo_double ("stoptype" ,od.oe_field_value )
       ENDIF
       ,
       map_to_obx = 1
      OF "PREGNANT" :
       map_to_obx = 1
      OF "PTHASIV" :
       map_to_obx = 1
      OF "RXPRIORITY" :
       reply->od_cache.rxpriority.value = od.oe_field_value
      OF "NBROFBAGS" :
       IF ((od.oe_field_value > 1 ) ) reply->badditivefreqiv = 1 ,map_to_obx = 1
       ENDIF
      OF "DISPENSEQTY" :
       reply->od_cache.disp_qty.value = od.oe_field_value
      OF "DISPENSEQTYUNIT" :
       reply->od_cache.disp_qty_unit.value = od.oe_field_value
      OF "NBRREFILLS" :
       reply->od_cache.nbr_of_refills.value = od.oe_field_value
      OF "RXQTY" :
       reply->od_cache.rx_qty.value = od.oe_field_value
      OF "PRNINSTRUCTIONS" :
       stat = set_esoinfo_string ("prninstructions" ,od.oe_field_display_value )
      OF "INDICATION" :
       reply->od_cache.indication.display = od.oe_field_display_value
      OF "SPECINX" :
       reply->od_cache.special_instructions.display = od.oe_field_display_value
      OF "SIG" :
       reply->od_cache.sig.display = od.oe_field_display_value
      OF "DAW" :
       reply->od_cache.daw.value = od.oe_field_value ,
       reply->od_cache.daw.display = od.oe_field_display_value
      OF "OTHER" :
       IF ((oef.field_type_flag >= 0 )
       AND (oef.field_type_flag <= 7 ) ) map_to_obx = 1
       ENDIF
      OF "INGREDVOLUMEINCLOVRFIL" :
      OF "INGREDVOLUMEINCLOVRF" :
       reply->od_cache.tot_ingr_vol_w_overfill = od.oe_field_value
      ELSE
       IF ((oef.fsi_map_to_obx_ind = 1 ) ) map_to_obx = 1
       ENDIF
     ENDCASE
     ,
     IF ((map_to_obx = 1 ) ) found_idx = 0 ,temp_idx = 0 ,
      FOR (temp_idx = 1 TO i )
       IF ((reply->od_cache.obx_detail[temp_idx ].obs_id = od.oe_field_id ) ) found_idx = temp_idx
       ENDIF
      ENDFOR
      ,
      IF ((found_idx = 0 ) ) i = (i + 1 ) ,
       IF ((mod (i ,10 ) = 1 ) ) stat = alterlist (reply->od_cache.obx_detail ,(i + 9 ) )
       ENDIF
       ,temp_idx = i ,reply->od_cache.obx_detail[temp_idx ].obs_id = od.oe_field_id ,reply->od_cache.
       obx_detail[temp_idx ].units_id = "" ,reply->od_cache.obx_detail[temp_idx ].units_text = "" ,
       reply->od_cache.obx_detail[temp_idx ].obs_value_count = 1
      ELSE temp_idx = found_idx ,reply->od_cache.obx_detail[temp_idx ].obs_value_count = (reply->
       od_cache.obx_detail[temp_idx ].obs_value_count + 1 )
      ENDIF
      ,qual_idx = reply->od_cache.obx_detail[temp_idx ].obs_value_count ,stat = alterlist (reply->
       od_cache.obx_detail[temp_idx ].obs_value ,qual_idx ) ,
      CASE (oef.field_type_flag )
       OF 0 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "ST" ,
        reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = od.oe_field_display_value
       OF 1 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "NM" ,
        reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = trim (cnvtstring (od
          .oe_field_value ,20 ,0 ) )
       OF 2 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "NM" ,
        IF ((size (trim (od.oe_field_display_value ) ) > 0 ) ) reply->od_cache.obx_detail[temp_idx ].
         obs_value[qual_idx ].value = trim (od.oe_field_display_value )
        ELSE reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = trim (cnvtstring (od
           .oe_field_value ,20 ,6 ,l ) )
        ENDIF
       OF 3 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "DT" ,
        reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = hl7_format_datetime (od
         .oe_field_dt_tm_value ,hl7_date )
       OF 4 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "TM" ,
        reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = hl7_format_datetime (od
         .oe_field_dt_tm_value ,hl7_time )
       OF 5 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "TS" ,
        reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = hl7_format_datetime (od
         .oe_field_dt_tm_value ,hl7_dt_tm )
       OF 6 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "IS" ,
        reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = eso_format_code (od
         .oe_field_value )
       OF 7 :
        reply->od_cache.obx_detail[temp_idx ].value_type = "ID" ,
        IF ((od.oe_field_value = 0 ) ) reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].
         value = "N"
        ELSE reply->od_cache.obx_detail[temp_idx ].obs_value[qual_idx ].value = "Y"
        ENDIF
      ENDCASE
     ENDIF
    ENDIF
   FOOT REPORT
    reply->od_cache.obx_detail_count = i ,
    stat = alterlist (reply->od_cache.obx_detail ,reply->od_cache.obx_detail_count )
   WITH nocounter
  ;end select
  FREE SET map_to_obx
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_order_ingredient_and_product_cache (order_id1 ,action_sequence1 )
  CALL echo ("Entering fill_order_ingredient_and_product_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  CALL echo (build ("The action_sequence is --->" ,action_sequence1 ) )
  IF ((validate (bordproductexists ,99999999 ) = 99999999 ) )
   DECLARE bordproductexists = i4 WITH protect ,noconstant (0 )
  ENDIF
  DECLARE freqidx = i4 WITH protect ,noconstant (0 )
  DECLARE addind = i4 WITH protect ,noconstant (0 )
  SELECT INTO "nl:"
   oig.strength ,
   oig.strength_unit ,
   oig.volume ,
   oig.volume_unit ,
   oig.freetext_dose ,
   oig.catalog_cd ,
   oig.ingredient_type_flag ,
   oig.synonym_id ,
   op.item_id ,
   op.dose_quantity ,
   op.dose_quantity_unit_cd ,
   op.tnf_id ,
   op.cmpd_base_ind ,
   tn.description ,
   tn.shell_item_id
   FROM (order_ingredient oig ),
    (order_product op ),
    (template_nonformulary tn ),
    (dummyt d WITH seq = 1 )
   PLAN (oig
    WHERE (oig.order_id = order_id1 )
    AND (oig.action_sequence <= action_sequence1 ) )
    JOIN (op
    WHERE (op.order_id = oig.order_id )
    AND (op.action_sequence = oig.action_sequence )
    AND (op.ingred_sequence = oig.comp_sequence )
    AND (op.on_admin_ind = 0 ) )
    JOIN (d )
    JOIN (tn
    WHERE (tn.tnf_id = op.tnf_id )
    AND (tn.action_sequence = op.action_sequence ) )
   ORDER BY oig.action_sequence DESC ,
    oig.comp_sequence ,
    oig.freq_cd ,
    op.item_id
   HEAD REPORT
    i = 0 ,
    reply->oig_cache.ing_count = 0 ,
    reply->oig_cache.total_product_count = 0 ,
    reply->oig_cache.product_current_ind = 0 ,
    ic = 0 ,
    load_it = 0 ,
    ifreqcnt = 0
   HEAD oig.action_sequence
    IF ((i = 0 ) ) load_it = 1 ,
     IF ((oig.action_sequence = action_sequence1 ) ) reply->oig_cache.product_current_ind = 1
     ENDIF
    ENDIF
   HEAD oig.comp_sequence
    IF ((load_it = 1 ) ) i = (i + 1 ) ,
     IF ((mod (i ,10 ) = 1 ) ) stat = alterlist (reply->oig_cache.ing ,(i + 9 ) )
     ENDIF
     ,reply->oig_cache.ing[i ].catalog_cd = oig.catalog_cd ,reply->oig_cache.ing[i ].strength = oig
     .strength ,reply->oig_cache.ing[i ].strength_unit = oig.strength_unit ,reply->oig_cache.ing[i ].
     volume = oig.volume ,reply->oig_cache.ing[i ].volume_unit = oig.volume_unit ,reply->oig_cache.
     ing[i ].freetext_dose = oig.freetext_dose ,reply->oig_cache.ing[i ].ingredient_type_flag = oig
     .ingredient_type_flag ,reply->oig_cache.ing[i ].ordered_as_mnemonic = oig.ordered_as_mnemonic ,
     reply->oig_cache.ing[i ].hna_order_mnemonic = oig.hna_order_mnemonic ,reply->oig_cache.ing[i ].
     freq_cd = oig.freq_cd ,reply->oig_cache.ing[i ].synonym_id = oig.synonym_id ,reply->oig_cache.
     ing[i ].comp_sequence = oig.comp_sequence ,reply->oig_cache.ing[i ].action_sequence = oig
     .action_sequence ,j = 0 ,reply->oig_cache.ing[i ].prod_count = 0
    ENDIF
   HEAD oig.freq_cd
    IF ((load_it = 1 ) ) addidx = (ifreqcnt + 1 ) ,
     FOR (freqidx = 1 TO ifreqcnt )
      IF ((reply->oig_cache.freq_list[freqidx ].freq_cd = oig.freq_cd ) ) addidx = - (1 ) ,freqidx =
       ifreqcnt
      ELSEIF ((reply->oig_cache.freq_list[freqidx ].freq_cd > oig.freq_cd ) ) addidx = freqidx ,
       freqidx = ifreqcnt
      ENDIF
     ENDFOR
     ,
     IF ((addidx != - (1 ) ) ) ifreqcnt = (ifreqcnt + 1 ) ,stat = alterlist (reply->oig_cache.
       freq_list ,ifreqcnt ,(addidx - 1 ) ) ,reply->oig_cache.freq_list[addidx ].freq_cd = oig
      .freq_cd
     ENDIF
    ENDIF
   DETAIL
    IF ((load_it = 1 ) ) bordproductexists = 1 ,j = (j + 1 ) ,
     IF ((mod (j ,10 ) = 1 ) ) stat = alterlist (reply->oig_cache.ing[i ].prod ,(j + 9 ) )
     ENDIF
     ,reply->oig_cache.ing[i ].prod[j ].dose_quantity = op.dose_quantity ,reply->oig_cache.ing[i ].
     prod[j ].dose_quantity_unit_cd = op.dose_quantity_unit_cd ,reply->oig_cache.ing[i ].prod[j ].
     item_id = op.item_id ,reply->oig_cache.ing[i ].prod[j ].tnf_id = op.tnf_id ,reply->oig_cache.
     ing[i ].prod[j ].tnf_description = tn.description ,reply->oig_cache.ing[i ].prod[j ].tnf_item_id
      = tn.shell_item_id ,reply->oig_cache.ing[i ].prod[j ].cmpd_base_ind = op.cmpd_base_ind ,
     IF ((op.item_id > 0 ) ) ic = (ic + 1 ) ,
      IF ((mod (ic ,10 ) = 1 ) ) stat = alterlist (reply->oii_cache.item ,(ic + 9 ) )
      ENDIF
      ,reply->oii_cache.item[ic ].item_id = op.item_id ,reply->oig_cache.ing[i ].prod[j ].md_index =
      ic
     ELSEIF ((tn.shell_item_id > 0 ) ) ic = (ic + 1 ) ,
      IF ((mod (ic ,10 ) = 1 ) ) stat = alterlist (reply->oii_cache.item ,(ic + 9 ) )
      ENDIF
      ,reply->oii_cache.item[ic ].item_id = tn.shell_item_id ,reply->oig_cache.ing[i ].prod[j ].
      md_index = ic
     ENDIF
    ENDIF
   FOOT  oig.comp_sequence
    IF ((load_it = 1 ) ) reply->oig_cache.ing[i ].prod_count = j ,reply->oig_cache.
     total_product_count = (reply->oig_cache.total_product_count + reply->oig_cache.ing[i ].
     prod_count ) ,stat = alterlist (reply->oig_cache.ing[i ].prod ,reply->oig_cache.ing[i ].
      prod_count )
    ENDIF
   FOOT  oig.action_sequence
    load_it = 0
   FOOT REPORT
    reply->oig_cache.ing_count = i ,
    stat = alterlist (reply->oig_cache.ing ,reply->oig_cache.ing_count ) ,
    reply->oii_cache.item_count = ic ,
    stat = alterlist (reply->oii_cache.item ,reply->oii_cache.item_count ) ,
    reply->oig_cache.freq_count = ifreqcnt ,
    stat = alterlist (reply->oig_cache.freq_list ,reply->oig_cache.freq_count )
   WITH outerjoin = d
  ;end select
  IF ((curqual <= 0 ) )
   RETURN (0 )
  ELSE
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  fill_verifying_pharmacist (order_id1 ,action_sequence1 )
  CALL echo ("Entering fill_verifying_pharmacist subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  CALL echo (build ("The action_sequence is --->" ,action_sequence1 ) )
  FREE SET rx_request
  FREE SET rx_reply
  RECORD rx_request (
    1 order_id = f8
    1 action_sequence = i4
    1 review_type_flag = i2
    1 reviewed_status_flag = i2
  )
  RECORD rx_reply (
    1 qual [* ]
      2 action_sequence = i4
      2 review_sequence = i4
      2 review_type_flag = i2
      2 review_reqd_ind = i2
      2 reviewed_status_flag = i2
      2 review_personnel_id = f8
      2 review_dt_tm = dq8
      2 review_tz = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
  SET rx_request->order_id = order_id1
  SET rx_request->action_sequence = action_sequence1
  SET rx_request->review_type_flag = 3
  SET rx_request->reviewed_status_flag = 1
  CALL echo ("Executing RX_GET_ORDER_REVIEW program" )
  EXECUTE rx_get_order_review WITH replace ("REQUEST" ,rx_request ) ,
  replace ("REPLY" ,rx_reply )
  IF ((rx_reply->status_data.status != "S" ) )
   CALL echo (build ("rx_get_order_review returned a script status of:" ,rx_reply->status_data.status
      ) )
  ENDIF
  CALL echorecord (rx_reply )
  IF (size (rx_reply->qual ,5 ) )
   CALL echo (build ("Review personnel found in rx_get_order_review script, person_id:" ,rx_reply->
     qual[1 ].review_personnel_id ) )
   SET reply->pharm_ver_id = rx_reply->qual[1 ].review_personnel_id
  ELSEIF (reply->oac_cache.action_personnel_id )
   IF ((validate (rx_users_reply ,"999999999" ) = "999999999" ) )
    FREE SET rx_users_request
    FREE SET rx_users_reply
    RECORD rx_users_request (
      1 load_pharmacists = i2
      1 load_techs = i2
    )
    RECORD rx_users_reply (
      1 pharmacists [* ]
        2 person_id = f8
        2 person_name = vc
      1 techs [* ]
        2 person_id = f8
        2 person_name = vc
      1 status_data
        2 status = c1
        2 subeventstatus [1 ]
          3 operationname = c25
          3 operationstatus = c1
          3 targetobjectname = c25
          3 targetobjectvalue = vc
    ) WITH persist
    SET rx_users_request->load_pharmacists = 1
    CALL echo ("Executing RX_GET_PHARM_USERS program" )
    EXECUTE rx_get_pharm_users WITH replace ("REQUEST" ,rx_users_request ) ,
    replace ("REPLY" ,rx_users_reply )
    IF ((rx_users_reply->status_data.status != "S" ) )
     CALL echo (build ("rx_get_pharm_users returned a script status of:" ,rx_users_reply->status_data
       .status ) )
    ENDIF
    FREE SET rx_users_request
   ENDIF
   CALL echo (build ("rx_get_pharm_users script qualifiers:" ,size (rx_users_reply->pharmacists ,5 )
     ) )
   DECLARE icnt = i4 WITH private ,noconstant (0 )
   FOR (icnt = 1 TO size (rx_users_reply->pharmacists ,5 ) )
    IF ((rx_users_reply->pharmacists[icnt ].person_id = reply->oac_cache.action_personnel_id ) )
     CALL echo (build ("Pharmacist found in rx_get_pharm_users script, person_id:" ,reply->oac_cache.
       action_personnel_id ) )
     SET reply->pharm_ver_id = reply->oac_cache.action_personnel_id
    ENDIF
   ENDFOR
  ENDIF
  FREE SET rx_request
  FREE SET rx_reply
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_order_dispense_cache (order_id1 )
  CALL echo ("Entering fill_order_dispense_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  SELECT INTO "nl:"
   od.dispense_category_cd ,
   od.pharm_type_cd
   FROM (order_dispense od )
   WHERE (od.order_id = order_id1 )
   DETAIL
    reply->ord_disp_cache.dispense_category_cd = od.dispense_category_cd ,
    reply->ord_disp_cache.pharm_type_cd = od.pharm_type_cd
   WITH nocounter
  ;end select
  IF ((curqual <= 0 ) )
   RETURN (0 )
  ELSE
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  fill_order_ingredient_cache (order_id1 ,action_sequence1 )
  CALL echo ("Entering fill_order_ingredient_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  CALL echo (build ("The action_sequence is --->" ,action_sequence1 ) )
  SELECT INTO "nl:"
   oig.strength ,
   oig.strength_unit ,
   oig.volume ,
   oig.volume_unit ,
   oig.freetext_dose ,
   oig.catalog_cd ,
   oig.ingredient_type_flag ,
   oig.synonym_id
   FROM (order_ingredient oig )
   PLAN (oig
    WHERE (oig.order_id = order_id1 )
    AND (oig.action_sequence <= action_sequence1 ) )
   ORDER BY oig.action_sequence DESC
   HEAD REPORT
    i = 0 ,
    reply->oig_cache.ing_count = 0 ,
    load_it = 0
   HEAD oig.action_sequence
    IF ((i = 0 ) ) load_it = 1
    ENDIF
   DETAIL
    IF ((load_it = 1 ) ) i = (i + 1 ) ,
     IF ((mod (i ,10 ) = 1 ) ) stat = alterlist (reply->oig_cache.ing ,(i + 9 ) )
     ENDIF
     ,reply->oig_cache.ing[i ].catalog_cd = oig.catalog_cd ,reply->oig_cache.ing[i ].strength = oig
     .strength ,reply->oig_cache.ing[i ].strength_unit = oig.strength_unit ,reply->oig_cache.ing[i ].
     volume = oig.volume ,reply->oig_cache.ing[i ].volume_unit = oig.volume_unit ,reply->oig_cache.
     ing[i ].freetext_dose = oig.freetext_dose ,reply->oig_cache.ing[i ].ingredient_type_flag = oig
     .ingredient_type_flag ,reply->oig_cache.ing[i ].ordered_as_mnemonic = oig.ordered_as_mnemonic ,
     reply->oig_cache.ing[i ].hna_order_mnemonic = oig.hna_order_mnemonic ,reply->oig_cache.ing[i ].
     freq_cd = oig.freq_cd ,reply->oig_cache.ing[i ].synonym_id = oig.synonym_id ,reply->oig_cache.
     ing[i ].comp_sequence = oig.comp_sequence ,reply->oig_cache.ing[i ].action_sequence = oig
     .action_sequence ,reply->oig_cache.ing[i ].prod_count = 0
    ENDIF
   FOOT  oig.action_sequence
    load_it = 0
   FOOT REPORT
    reply->oig_cache.ing_count = i ,
    stat = alterlist (reply->oig_cache.ing ,reply->oig_cache.ing_count )
   WITH nocounter
  ;end select
  IF ((curqual <= 0 ) )
   RETURN (0 )
  ELSE
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  fill_vda_order_ingredient_and_product_cache (order_id1 )
  CALL echo ("Entering fill_vda_order_ingredient_and_product_cache subroutine" )
  CALL echo (build ("The order_id is --->" ,order_id1 ) )
  DECLARE iretval = i4 WITH noconstant (0 )
  IF ((size (reply->oig_cache.ing ,5 ) > 0 ) )
   CALL echo ("Filling ingredient and product dose cache" )
   SELECT INTO "nl:"
    FROM (dummyt d WITH seq = value (size (reply->oig_cache.ing ,5 ) ) ),
     (order_ingredient_dose oid ),
     (order_product_dose opd ),
     (template_nonformulary tn )
    PLAN (d
     WHERE (reply->oig_cache.ing[d.seq ].catalog_cd > 0 ) )
     JOIN (oid
     WHERE (oid.order_id = order_id1 )
     AND (oid.action_sequence = reply->oig_cache.ing[d.seq ].action_sequence )
     AND (oid.comp_sequence = reply->oig_cache.ing[d.seq ].comp_sequence ) )
     JOIN (opd
     WHERE (opd.order_id = order_id1 )
     AND (opd.action_sequence = oid.action_sequence )
     AND (opd.schedule_seq = oid.schedule_sequence )
     AND (opd.ingred_sequence = oid.comp_sequence ) )
     JOIN (tn
     WHERE (outerjoin (opd.tnf_id ) = tn.tnf_id )
     AND (outerjoin (opd.action_sequence ) = tn.action_sequence ) )
    ORDER BY oid.schedule_sequence
    HEAD REPORT
     oididx = 0
    HEAD oid.schedule_sequence
     oididx = (oididx + 1 ) ,dstat = alterlist (reply->oig_cache.ing[d.seq ].ing_dose ,oididx ) ,
     reply->oig_cache.ing[d.seq ].ing_dose[oididx ].order_ingred_dose_id = oid
     .order_ingredient_dose_id ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].dose_sequence = oid
     .dose_sequence ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].schedule_sequence = oid
     .schedule_sequence ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].strength_dose_value = oid
     .strength_dose_value ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].strength_dose_value_display
      = oid.strength_dose_value_display ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].
     strength_dose_unit_cd = oid.strength_dose_unit_cd ,reply->oig_cache.ing[d.seq ].ing_dose[oididx
     ].volume_dose_value = oid.volume_dose_value ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].
     volume_dose_value_display = oid.volume_dose_value_display ,reply->oig_cache.ing[d.seq ].
     ing_dose[oididx ].volume_dose_unit_cd = oid.volume_dose_unit_cd ,reply->oig_cache.ing[d.seq ].
     ing_dose[oididx ].ordered_dose_value = oid.ordered_dose_value ,reply->oig_cache.ing[d.seq ].
     ing_dose[oididx ].ordered_dose_value_display = oid.ordered_dose_value_display ,reply->oig_cache.
     ing[d.seq ].ing_dose[oididx ].ordered_dose_unit_cd = oid.ordered_dose_unit_cd ,reply->oig_cache.
     ing[d.seq ].ing_dose[oididx ].ordered_dose_type_flag = oid.ordered_dose_type_flag ,opdidx = 0 ,
     prodsize = size (reply->oig_cache.ing[d.seq ].prod ,5 )
    DETAIL
     IF ((((opd.item_id > 0 ) ) OR ((opd.tnf_id > 0 ) )) ) opdidx = (opdidx + 1 ) ,dstat = alterlist
      (reply->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose ,opdidx ) ,reply->oig_cache.ing[d
      .seq ].ing_dose[oididx ].prod_dose[opdidx ].order_product_dose_id = opd.order_product_dose_id ,
      reply->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[opdidx ].item_id = opd.item_id ,reply
      ->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[opdidx ].tnf_id = opd.tnf_id ,reply->
      oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[opdidx ].tnf_description = tn.description ,
      reply->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[opdidx ].tnf_item_id = tn
      .shell_item_id ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[opdidx ].schedule_seq
      = opd.schedule_seq ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[opdidx ].
      dose_quantity = opd.dose_quantity ,reply->oig_cache.ing[d.seq ].ing_dose[oididx ].prod_dose[
      opdidx ].dose_quantity_unit_cd = opd.dose_quantity_unit_cd ,reply->oig_cache.ing[d.seq ].
      ing_dose[oididx ].prod_dose[opdidx ].unrounded_dose_qty = opd.unrounded_dose_qty ,
      FOR (prodidx = 1 TO prodsize )
       IF ((reply->oig_cache.ing[d.seq ].prod[prodidx ].item_id = opd.item_id )
       AND (reply->oig_cache.ing[d.seq ].prod[prodidx ].tnf_id = opd.tnf_id ) ) reply->oig_cache.ing[
        d.seq ].ing_dose[oididx ].prod_dose[opdidx ].md_index = reply->oig_cache.ing[d.seq ].prod[
        prodidx ].md_index ,prodidx = prodsize
       ENDIF
      ENDFOR
     ENDIF
    WITH nocounter
   ;end select
   IF ((curqual > 0 ) )
    SET iretval = 1
   ENDIF
  ENDIF
  RETURN (iretval )
 END ;Subroutine
 DECLARE get_encntr_prsnl_info_idx (encntr_id1 ,reln_type_cdf1 ) = i4
 DECLARE fetch_encntr_prsnl_info (encntr_id2 ,reln_type_cdf2 ,mode2 ) = i4
 DECLARE fetch_encntr_prsnl_from_db (encntr_id3 ,reln_type_cdf3 ,mode3 ,eidx3 ) = i4
 DECLARE get_prsnl_info_idx (person_id4 ) = i4
 DECLARE fetch_prsnl_info (person_id5 ,mode5 ) = i4
 DECLARE fetch_prsnl_from_db (person_id6 ,mode6 ,pidx6 ) = i4
 DECLARE get_person_info_idx (person_id7 ,encntr_id7 ,mode7 ) = i4
 DECLARE fetch_person_info (person_id8 ,encntr_id8 ,mode8 ) = i4
 DECLARE fetch_person_from_db (person_id9 ,encntr_id9 ,mode9 ,pidx9 ) = i4
 DECLARE eso_format_prsnl_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind ) = c100
 DECLARE eso_format_prsnl_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind ) = c100
 DECLARE get_encntr_prsnl_id_info_idx (encntr_id10 ,reln_type_cdf10 ,person_id10 ) = i4
 DECLARE fetch_encntr_prsnl_id_info (encntr_id11 ,reln_type_cdf11 ,person_id11 ,mode11 ) = i4
 DECLARE fetch_encntr_prsnl_id_from_db (encntr_id12 ,reln_type_cdf12 ,mode12 ,eidx12 ,person_id12 )
 = i4
 DECLARE eso_format_prsnl_id_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,mode ,
  hl7_struct ,repeat_ind ) = c100
 DECLARE eso_format_prsnl_id_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,mode ,
  hl7_struct ,repeat_ind ) = c100
 DECLARE eso_format_prsnl_id (field_cdf ,group_cdf ,xx_name ,xx_id ,xx_cdf ,x_person_id ,ui_struct ,
  instance ) = c100
 SUBROUTINE  get_encntr_prsnl_info_idx (encntr_id1 ,reln_type_cdf1 )
  SET list_size = 0
  SET list_size = size (context->cerner.encntr_prsnl_info.encntr ,5 )
  IF ((list_size > 0 )
  AND (encntr_id1 > 0 ) )
   SET ieso1 = 1
   FOR (ieso1 = ieso1 TO list_size )
    IF ((context->cerner.encntr_prsnl_info.encntr[ieso1 ].encntr_id = encntr_id1 ) )
     IF ((trim (reln_type_cdf1 ) > "" ) )
      IF ((context->cerner.encntr_prsnl_info.encntr[ieso1 ].reln_type_cdf = reln_type_cdf1 ) )
       RETURN (ieso1 )
      ENDIF
     ELSE
      RETURN (ieso1 )
     ENDIF
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_info (encntr_id2 ,reln_type_cdf2 ,mode2 )
  IF ((encntr_id2 = 0 ) )
   RETURN (0 )
  ENDIF
  SET eidx = 0
  SET eidx = get_encntr_prsnl_info_idx (encntr_id2 ,reln_type_cdf2 )
  IF ((eidx > 0 ) )
   RETURN (eidx )
  ENDIF
  SET eidx = (size (context->cerner.encntr_prsnl_info.encntr ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,eidx )
  SET context->cerner.encntr_prsnl_info.encntr_count = eidx
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].encntr_id = encntr_id2
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].reln_type_cdf = reln_type_cdf2
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].prsnl_r_count = 0
  SET stat = 0
  SET stat = fetch_encntr_prsnl_from_db (encntr_id2 ,reln_type_cdf2 ,mode2 ,eidx )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,(eidx - 1 ) )
   SET context->cerner.encntr_prsnl_info.encntr_count = (eidx - 1 )
   RETURN (0 )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_from_db (encntr_id3 ,reln_type_cdf3 ,mode3 ,eidx3 )
  SET reln_type_cd = 0
  SELECT INTO "nl:"
   c.code_value
   FROM (code_value c )
   WHERE (c.code_set = 333 )
   AND (c.cdf_meaning = trim (reln_type_cdf3 ) )
   AND (c.active_ind = 1 )
   AND (c.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
   AND (((c.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) ) ) OR ((c.end_effective_dt_tm =
   null ) ))
   DETAIL
    reln_type_cd = c.code_value
   WITH nocounter
  ;end select
  SET count = 0
  SELECT INTO "nl:"
   e.prsnl_person_id ,
   e.ft_prsnl_name ,
   e.free_text_cd ,
   e.encntr_prsnl_r_cd
   FROM (encntr_prsnl_reltn e )
   WHERE (e.encntr_id = encntr_id3 )
   AND (e.encntr_id > 0 )
   AND (e.encntr_prsnl_r_cd = reln_type_cd )
   AND (e.active_ind = 1 )
   AND (e.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((e.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((e
   .end_effective_dt_tm = null ) ))
   DETAIL
    count = (count + 1 ) ,
    stat = alterlist (context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r ,count ) ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].prsnl_person_id = e
    .prsnl_person_id ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].ft_prsnl_name = trim (e
     .ft_prsnl_name ,3 ) ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].free_text_cd = e.free_text_cd ,
    context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[count ].encntr_prsnl_r_cd = e
    .encntr_prsnl_r_cd
   WITH nocounter
  ;end select
  SET context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r_count = count
  IF ((curqual > 0 ) )
   SET ieso3 = 1
   FOR (ieso3 = ieso3 TO count )
    SET context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[ieso3 ].idx = fetch_prsnl_info (
     context->cerner.encntr_prsnl_info.encntr[eidx3 ].prsnl_r[ieso3 ].prsnl_person_id ,mode3 )
   ENDFOR
  ELSE
   RETURN (0 )
  ENDIF
  RETURN (eidx3 )
 END ;Subroutine
 SUBROUTINE  get_encntr_prsnl_id_info_idx (encntr_id10 ,reln_type_cdf10 ,person_id10 )
  SET list_size = 0
  SET list_size = size (context->cerner.encntr_prsnl_info.encntr ,5 )
  SET p_size = 0
  IF ((list_size > 0 )
  AND (encntr_id10 > 0 )
  AND (person_id10 > 0 ) )
   SET ieso10 = 1
   FOR (ieso10 = ieso10 TO list_size )
    IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].encntr_id = encntr_id10 ) )
     IF ((trim (reln_type_cdf10 ) > "" ) )
      IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].reln_type_cdf = reln_type_cdf10 ) )
       SET p_size = size (context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r ,5 )
       IF ((p_size > 0 ) )
        SET jeso10 = 1
        FOR (jeso10 = jeso10 TO p_size )
         IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r[jeso10 ].prsnl_person_id =
         person_id10 ) )
          RETURN (ieso10 )
         ENDIF
        ENDFOR
       ENDIF
      ENDIF
     ELSE
      SET p_size = size (context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r ,5 )
      IF ((p_size > 0 ) )
       SET jeso10 = 1
       FOR (jeso10 = jeso10 TO p_size )
        IF ((context->cerner.encntr_prsnl_info.encntr[ieso10 ].prsnl_r[jeso10 ].prsnl_person_id =
        person_id10 ) )
         RETURN (ieso10 )
        ENDIF
       ENDFOR
      ENDIF
     ENDIF
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_id_info (encntr_id11 ,reln_type_cdf11 ,person_id11 ,mode11 )
  SET stat = 0
  IF ((((encntr_id11 = 0 ) ) OR ((person_id11 = 0 ) )) )
   RETURN (0 )
  ENDIF
  SET eidx = 0
  SET eidx = get_encntr_prsnl_id_info_idx (encntr_id11 ,reln_type_cdf11 ,person_id11 )
  IF ((eidx > 0 ) )
   RETURN (eidx )
  ENDIF
  SET eidx = get_encntr_prsnl_info_idx (encntr_id11 ,reln_type_cdf11 )
  IF ((eidx > 0 ) )
   SET stat = fetch_encntr_prsnl_id_from_db (encntr_id11 ,reln_type_cdf11 ,mode11 ,eidx ,person_id11
    )
   RETURN (stat )
  ENDIF
  SET eidx = (size (context->cerner.encntr_prsnl_info.encntr ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,eidx )
  SET context->cerner.encntr_prsnl_info.encntr_count = eidx
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].encntr_id = encntr_id11
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].reln_type_cdf = reln_type_cdf11
  SET context->cerner.encntr_prsnl_info.encntr[eidx ].prsnl_r_count = 0
  SET stat = fetch_encntr_prsnl_id_from_db (encntr_id11 ,reln_type_cdf11 ,mode11 ,eidx ,person_id11
   )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr ,(eidx - 1 ) )
   SET context->cerner.encntr_prsnl_info.encntr_count = (eidx - 1 )
   RETURN (0 )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_encntr_prsnl_id_from_db (encntr_id12 ,reln_type_cdf12 ,mode12 ,eidx12 ,
  person_id12 )
  IF ((person_id12 = 0 ) )
   RETURN (0 )
  ENDIF
  SET stat = 0
  SET count = (size (context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r ,5 ) + 1 )
  SET stat = alterlist (context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r ,count )
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].prsnl_person_id =
  person_id12
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].ft_prsnl_name = ""
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].free_text_cd = 0
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[count ].encntr_prsnl_r_cd = 0
  SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r_count = count
  SET ieso12 = 1
  FOR (ieso12 = ieso12 TO count )
   SET context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[ieso12 ].idx = fetch_prsnl_info (
    context->cerner.encntr_prsnl_info.encntr[eidx12 ].prsnl_r[ieso12 ].prsnl_person_id ,mode12 )
  ENDFOR
  RETURN (eidx12 )
 END ;Subroutine
 SUBROUTINE  get_prsnl_info_idx (person_id4 )
  SET list_size = 0
  SET list_size = size (context->cerner.prsnl_info.prsnl ,5 )
  IF ((list_size > 0 )
  AND (person_id4 > 0 ) )
   SET ieso4 = 1
   FOR (ieso4 = ieso4 TO list_size )
    IF ((context->cerner.prsnl_info.prsnl[ieso4 ].person_id = person_id4 ) )
     RETURN (ieso4 )
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_prsnl_info (person_id5 ,mode5 )
  IF ((person_id5 = 0 ) )
   RETURN (0 )
  ENDIF
  SET pidx = 0
  SET pidx = get_prsnl_info_idx (person_id5 )
  IF ((pidx > 0 ) )
   RETURN (pidx )
  ENDIF
  SET pidx = (size (context->cerner.prsnl_info.prsnl ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.prsnl_info.prsnl ,pidx )
  SET context->cerner.prsnl_info.prsnl_count = pidx
  SET context->cerner.prsnl_info.prsnl[pidx ].person_id = person_id5
  SET context->cerner.prsnl_info.prsnl[pidx ].alias_count = 0
  SET context->cerner.prsnl_info.prsnl[pidx ].name_count = 0
  SET stat = fetch_prsnl_from_db (person_id5 ,mode5 ,pidx )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.prsnl_info.prsnl ,(pidx - 1 ) )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_prsnl_from_db (person_id6 ,mode6 ,pidx6 )
  SET aidx = 0
  SET nidx = 0
  SET stat = 0
  SET prsnl_name_cd = 0
  SELECT INTO "nl:"
   c.code_value
   FROM (code_value c )
   WHERE (c.code_set = 213 )
   AND (c.cdf_meaning = "PRSNL" )
   AND (c.active_ind = 1 )
   AND (c.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
   AND (((c.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) ) ) OR ((c.end_effective_dt_tm =
   null ) ))
   DETAIL
    prsnl_name_cd = c.code_value
   WITH nocounter
  ;end select
  SELECT INTO "nl:"
   p.name_last ,
   p.name_first ,
   p.name_middle ,
   p.name_suffix ,
   p.name_prefix ,
   p.name_degree ,
   p.name_full ,
   p.name_type_cd ,
   p.name_title
   FROM (person_name p )
   WHERE (p.person_id = person_id6 )
   AND (p.person_id > 0 )
   AND (p.name_type_cd = prsnl_name_cd )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    nidx = (nidx + 1 ) ,
    stat = alterlist (context->cerner.prsnl_info.prsnl[pidx6 ].name ,nidx ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_middle = trim (p.name_middle ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_suffix = trim (p.name_suffix ,3 ) ,
    IF ((size (trim (p.name_prefix ,3 ) ) > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx
     ].name_prefix = trim (p.name_prefix ,3 )
    ELSE context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_prefix = trim (p.name_title ,3 )
    ENDIF
    ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_degree = trim (p.name_degree ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full = trim (p.name_full ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_type_cd = p.name_type_cd
   WITH nocounter
  ;end select
  IF ((curqual <= 0 ) )
   SELECT INTO "nl:"
    p.name_last_key ,
    p.name_first_key ,
    p.name_full_formatted ,
    p.name_last ,
    p.name_first
    FROM (prsnl p )
    WHERE (p.person_id = person_id6 )
    AND (p.person_id > 0 )
    AND (p.active_ind = 1 )
    AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
    AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
    .end_effective_dt_tm = null ) ))
    DETAIL
     nidx = (nidx + 1 ) ,
     stat = alterlist (context->cerner.prsnl_info.prsnl[pidx6 ].name ,nidx ) ,
     context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
     context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
     context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full = trim (p.name_full_formatted ,3
      ) ,
     IF ((trim (context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last ) = "" ) )
      IF ((trim (context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full ) > "" ) ) nlen = 0 ,
       nlen = size (context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full ) ,lpos = 0 ,llen
       = 0 ,lpos = findstring (" -" ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full
        ) ,
       IF ((lpos > 0 ) ) lpos = (lpos + 2 )
       ELSE lpos = 1
       ENDIF
       ,fpos = 0 ,flen = 0 ,mpos = 0 ,mlen = 0 ,fpos = findstring (", " ,context->cerner.prsnl_info.
        prsnl[pidx6 ].name[nidx ].name_full ,lpos ) ,
       IF ((fpos > 0 ) ) llen = (fpos - lpos ) ,fpos = (fpos + 2 ) ,mpos = findstring (" " ,context->
         cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full ,fpos ) ,
        IF ((mpos > 0 ) ) flen = (mpos - fpos ) ,mpos = (mpos + 1 ) ,mlen = ((nlen - mpos ) + 1 )
        ELSE flen = ((nlen - fpos ) + 1 )
        ENDIF
       ELSE llen = ((nlen - fpos ) + 1 )
       ENDIF
       ,
       IF ((llen > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = substring (
         lpos ,llen ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full )
       ENDIF
       ,
       IF ((flen > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = substring
        (fpos ,flen ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full )
       ENDIF
       ,
       IF ((mlen > 0 ) ) context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_middle =
        substring (mpos ,mlen ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_full )
       ENDIF
      ELSE context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_last = trim (p.name_last_key ,3
        ) ,context->cerner.prsnl_info.prsnl[pidx6 ].name[nidx ].name_first = trim (p.name_first_key ,
        3 )
      ENDIF
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  SET context->cerner.prsnl_info.prsnl[pidx6 ].name_count = nidx
  SELECT INTO "nl:"
   p.alias ,
   p.prsnl_alias_type_cd ,
   p.prsnl_alias_sub_type_cd ,
   p.alias_pool_cd ,
   p.check_digit ,
   p.check_digit_method_cd ,
   p.contributor_system_cd
   FROM (prsnl_alias p )
   WHERE (p.person_id = person_id6 )
   AND (p.person_id > 0 )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    aidx = (aidx + 1 ) ,
    stat = alterlist (context->cerner.prsnl_info.prsnl[pidx6 ].alias ,aidx ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias = trim (p.alias ,3 ) ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias_type_cd = p.prsnl_alias_type_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias_subtype_cd = p
    .prsnl_alias_sub_type_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].alias_pool_cd = p.alias_pool_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].check_digit = p.check_digit ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].check_digit_method_cd = p
    .check_digit_method_cd ,
    context->cerner.prsnl_info.prsnl[pidx6 ].alias[aidx ].contributor_system_cd = p
    .contributor_system_cd
   WITH nocounter
  ;end select
  SET context->cerner.prsnl_info.prsnl[pidx6 ].alias_count = aidx
  RETURN (pidx6 )
 END ;Subroutine
 SUBROUTINE  get_person_info_idx (person_id7 ,encntr_id7 )
  SET list_size = 0
  SET list_size = size (context->cerner.person_info.person ,5 )
  IF ((list_size > 0 )
  AND (person_id7 > 0 ) )
   SET ieso7 = 1
   FOR (ieso7 = ieso7 TO list_size )
    IF ((context->cerner.person_info.person[ieso7 ].person_id = person_id7 ) )
     IF ((encntr_id7 > 0 ) )
      IF ((context->cerner.person_info.person[ieso7 ].encntr_id = encntr_id7 ) )
       RETURN (ieso7 )
      ENDIF
     ELSE
      RETURN (ieso7 )
     ENDIF
    ENDIF
   ENDFOR
  ENDIF
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fetch_person_info (person_id8 ,encntr_id8 ,mode8 )
  IF ((person_id8 = 0 ) )
   RETURN (0 )
  ENDIF
  SET pidx = 0
  SET pidx = get_person_info_idx (person_id8 ,encntr_id8 )
  IF ((pidx > 0 ) )
   RETURN (pidx )
  ENDIF
  SET pidx = (size (context->cerner.person_info.person ,5 ) + 1 )
  SET stat = 0
  SET stat = alterlist (context->cerner.person_info.person ,pidx )
  SET context->cerner.person_info.person_count = pidx
  SET context->cerner.person_info.person[pidx ].person_id = person_id8
  SET context->cerner.person_info.person[pidx ].encntr_id = encntr_id8
  SET context->cerner.person_info.person[pidx ].alias_count = 0
  SET context->cerner.person_info.person[pidx ].encntr_count = 0
  SET context->cerner.person_info.person[pidx ].name_count = 0
  SET stat = fetch_person_from_db (person_id8 ,encntr_id8 ,mode8 ,pidx )
  IF ((stat = 0 ) )
   SET stat = alterlist (context->cerner.person_info.person ,(pidx - 1 ) )
  ENDIF
  RETURN (stat )
 END ;Subroutine
 SUBROUTINE  fetch_person_from_db (person_id9 ,encntr_id9 ,mode9 ,pidx9 )
  SET aidx = 0
  SET nidx = 0
  SET current_name_cd = 0
  SET stat = 0
  SELECT INTO "nl:"
   p.name_last ,
   p.name_first ,
   p.name_middle ,
   p.name_suffix ,
   p.name_prefix ,
   p.name_degree ,
   p.name_full ,
   p.name_type_cd
   FROM (person_name p )
   WHERE (p.person_id = person_id9 )
   AND (p.person_id > 0 )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    nidx = (nidx + 1 ) ,
    stat = alterlist (context->cerner.person_info.person[pidx9 ].name ,nidx ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_middle = trim (p.name_middle ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_suffix = trim (p.name_suffix ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_prefix = trim (p.name_prefix ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_degree = trim (p.name_degree ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_full = trim (p.name_full ,3 ) ,
    context->cerner.person_info.person[pidx9 ].name[nidx ].name_type_cd = p.name_type_cd
   WITH nocounter
  ;end select
  IF ((curqual <= 0 ) )
   SELECT INTO "nl:"
    p.name_last_key ,
    p.name_first_key ,
    p.name_full_formatted ,
    p.name_last ,
    p.name_first ,
    p.name_middle
    FROM (person p )
    WHERE (p.person_id = person_id9 )
    AND (p.person_id > 0 )
    AND (p.active_ind = 1 )
    AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
    AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
    .end_effective_dt_tm = null ) ))
    DETAIL
     nidx = (nidx + 1 ) ,
     stat = alterlist (context->cerner.person_info.person[pidx9 ].name ,nidx ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_last = trim (p.name_last ,3 ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_first = trim (p.name_first ,3 ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_middle = trim (p.name_middle ,3 ) ,
     context->cerner.person_info.person[pidx9 ].name[nidx ].name_full = trim (p.name_full_formatted ,
      3 ) ,
     IF ((trim (context->cerner.person_info.person[pidx9 ].name[nidx ].name_last ) = "" ) ) context->
      cerner.person_info.person[pidx9 ].name[nidx ].name_last = trim (p.name_last_key ,3 ) ,context->
      cerner.person_info.person[pidx9 ].name[nidx ].name_first = trim (p.name_first_key ,3 )
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  SET context->cerner.person_info.person[pidx9 ].name_count = nidx
  SELECT INTO "nl:"
   p.alias ,
   p.person_alias_type_cd ,
   p.person_alias_sub_type_cd ,
   p.alias_pool_cd ,
   p.check_digit ,
   p.check_digit_method_cd ,
   p.contributor_system_cd
   FROM (person_alias p )
   WHERE (p.person_id = person_id9 )
   AND (p.person_id > 0 )
   AND (p.active_ind = 1 )
   AND (p.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((p.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((p
   .end_effective_dt_tm = null ) ))
   DETAIL
    aidx = (aidx + 1 ) ,
    stat = alterlist (context->cerner.person_info.person[pidx9 ].alias ,aidx ) ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias = trim (p.alias ,3 ) ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_type_cd = p.person_alias_type_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_subtype_cd = p
    .person_alias_sub_type_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_pool_cd = p.alias_pool_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit = p.check_digit ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit_method_cd = p
    .check_digit_method_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].contributor_system_cd = p
    .contributor_system_cd ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].encntr_ind = 0 ,
    context->cerner.person_info.person[pidx9 ].alias[aidx ].org_id = 0
   WITH nocounter
  ;end select
  IF ((encntr_id9 > 0 ) )
   SELECT INTO "nl:"
    e.organization_id ,
    ea.alias ,
    ea.encntr_alias_type_cd ,
    ea.encntr_alias_sub_type_cd ,
    ea.alias_pool_cd ,
    ea.check_digit ,
    ea.check_digit_method_cd ,
    ea.contributor_system_cd
    FROM (encounter e ),
     (encntr_alias ea )
    PLAN (e
     WHERE (e.encntr_id = encntr_id9 )
     AND (e.encntr_id > 0 ) )
     JOIN (ea
     WHERE (e.encntr_id = ea.encntr_id )
     AND (ea.active_ind = 1 )
     AND (ea.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
     AND (((ea.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((
     ea.end_effective_dt_tm = null ) )) )
    DETAIL
     aidx = (aidx + 1 ) ,
     stat = alterlist (context->cerner.person_info.person[pidx9 ].alias ,aidx ) ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].alias = trim (ea.alias ,3 ) ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_type_cd = ea.encntr_alias_type_cd
     ,context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_subtype_cd = ea
     .encntr_alias_sub_type_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].alias_pool_cd = ea.alias_pool_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit = ea.check_digit ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].check_digit_method_cd = ea
     .check_digit_method_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].contributor_system_cd = ea
     .contributor_system_cd ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].encntr_ind = 1 ,
     context->cerner.person_info.person[pidx9 ].alias[aidx ].org_id = e.organization_id
    WITH nocounter
   ;end select
  ENDIF
  SET context->cerner.person_info.person[pidx9 ].alias_count = aidx
  RETURN (pidx9 )
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   RETURN (substring (1 ,100 ,concat (trim (request->esoinfo.eprsnlprefix ) ,"," ,trim (field1 ) ,
     "," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_info (t_encntr_id ,
        t_reln_type_cdf ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (repeat_ind )
      ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,mode ,hl7_struct ,
  repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   RETURN (substring (1 ,100 ,concat (trim (get_esoinfo_string ("eprsnlprefix" ) ) ,"," ,trim (
      field1 ) ,"," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_info (t_encntr_id ,
        t_reln_type_cdf ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (repeat_ind )
      ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_id_enctr (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,mode ,
  hl7_struct ,repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" )
  AND (person_id > 0 ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   SET t_person_id = person_id
   RETURN (substring (1 ,100 ,concat (trim (request->esoinfo.eprsnlprefix ) ,"," ,trim (field1 ) ,
     "," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_id_info (t_encntr_id ,
        t_reln_type_cdf ,t_person_id ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (
       repeat_ind ) ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_id_enctr_ctx (field1 ,field2 ,encntr_id ,reln_type_cdf ,person_id ,
  mode ,hl7_struct ,repeat_ind )
  IF ((encntr_id > 0 )
  AND (trim (reln_type_cdf ) > "" )
  AND (person_id > 0 ) )
   SET t_encntr_id = encntr_id
   SET t_reln_type_cdf = reln_type_cdf
   SET t_mode = mode
   SET t_person_id = person_id
   RETURN (substring (1 ,100 ,concat (trim (get_esoinfo_string ("eprsnlprefix" ) ) ,"," ,trim (
      field1 ) ,"," ,trim (field2 ) ,"," ,trim (cnvtstring (fetch_encntr_prsnl_id_info (t_encntr_id ,
        t_reln_type_cdf ,t_person_id ,t_mode ) ) ) ,"," ,trim (hl7_struct ) ,"," ,trim (cnvtstring (
       repeat_ind ) ) ,"," ,trim (cnvtstring (encntr_id ) ) ,"," ,trim (reln_type_cdf ) ) ) )
  ELSE
   RETURN (" " )
  ENDIF
 END ;Subroutine
 SUBROUTINE  eso_format_prsnl_id (field_cdf ,group_cdf ,xx_name ,xx_id ,xx_cdf ,x_person_id ,
  ui_struct ,instance )
  CALL echo ("Calling eso_format_prsnl_id()" )
  RETURN (eso_format_prsnl_id_enctr_ctx (field_cdf ,"ALL_PRSNL" ,xx_id ,trim (concat (trim (xx_cdf ,
      3 ) ,"_" ,trim (instance ,3 ) ) ,3 ) ,x_person_id ,0 ,ui_struct ,1 ) )
 END ;Subroutine
 FREE RECORD reply
 RECORD reply (
   1 disp_event_type_cd = f8
   1 run_id = f8
   1 person_id = f8
   1 encounter_id = f8
   1 order_id = f8
   1 action_sequence = i4
   1 dispense_hx_id = f8
   1 frequency_id = f8
   1 action_type_cd = f8
   1 rx_workstation_cd = f8
   1 pharm_ver_id = f8
   1 badditivefreqiv = i4
   1 o_cache
     2 order_status_cd = f8
     2 dept_status_cd = f8
     2 med_order_type_cd = f8
     2 med_order_type_meaning = vc
     2 ordered_as_mnemonic = vc
     2 order_id = f8
     2 prn_ind = i2
     2 current_start_dt_tm = dq8
     2 projected_stop_dt_tm = dq8
     2 order_mnemonic = vc
     2 hna_order_mnemonic = vc
     2 discontinue_type_cd = f8
     2 discontinue_type_cva = vc
     2 stop_type_cd = f8
     2 stop_type_cva = vc
     2 stop_type_cdf = vc
     2 suspend_ind = i2
     2 suspend_effective_dt_tm = dq8
     2 suspend_effective_hl7 = vc
     2 resume_ind = i2
     2 resume_effective_dt_tm = dq8
     2 resume_effective_hl7 = vc
     2 orig_ord_as_flag = i2
     2 ad_hoc_order_flag = i2
     2 dosing_method_flag = i2
   1 oac_cache
     2 action_type_cd = f8
     2 eso_action_cd = f8
     2 action_personnel_id = f8
     2 effective_dt_tm = dq8
     2 order_dt_tm = dq8
     2 order_locn_cd = f8
     2 order_provider_id = f8
     2 action_type_mean = vc
     2 action_type_cva = vc
     2 eso_action_mean = vc
     2 eso_action_cva = vc
     2 order_status_cd = f8
     2 order_status_mean = vc
     2 order_status_cva = vc
     2 dept_status_cd = f8
     2 dept_status_mean = vc
     2 dept_status_cva = vc
     2 prev_order_status_cd = f8
     2 prev_order_status_mean = vc
     2 prev_order_status_cva = vc
     2 prev_dept_status_cd = f8
     2 prev_dept_status_mean = vc
     2 prev_dept_status_cva = vc
     2 action_qualifier_cd = f8
     2 needs_verify_ind = i2
   1 fph_cache
     2 cyc_from_dt_tm = dq8
     2 fill_hx_id = f8
     2 run_type_cd = f8
   1 fpoh_cache
     2 admin_count = i4
     2 admin [* ]
       3 admin_dt_tm = dq8
     2 daw_cd = f8
     2 days_supply = f8
     2 dispense_sr_cd = f8
     2 disp_qty = f8
     2 disp_qty_unit_cd = f8
     2 disp_priority_cd = f8
     2 dur_conflict_cd = f8
     2 dur_intervention_cd = f8
     2 dur_outcome_cd = f8
     2 ord_desc = vc
     2 order_status_enum = i4
     2 fill_nbr = i4
     2 fill_quantity = f8
     2 frequency_cd = f8
     2 last_refill_dt_tm = dq8
     2 legal_status_cd = f8
     2 order_start_dt_tm = dq8
     2 order_stop_dt_tm = dq8
     2 updt_dt_tm = dq8
     2 entry_id = f8
     2 rph_id = f8
     2 ord_phys_id = f8
     2 ord_type = i4
     2 prn_ind = i2
     2 rate = f8
     2 refills_remaining = i4
     2 route_cd = f8
     2 titrate_ind = i2
     2 tot_volume = f8
     2 total_refills = f8
     2 infuse_encoded = vc
     2 obx_count = i4
     2 obx [* ]
       3 value_type = vc
       3 identifier = vc
       3 value = f8
       3 units = f8
     2 rx_expire_dt_time = dq8
     2 rx_nbr_s = c100
     2 rx_nbr_cd = f8
     2 prod_count = i4
     2 prod [* ]
       3 form_cd = f8
       3 freetext_dose = vc
       3 label_desc = vc
       3 dose_quantity = f8
       3 dose_quantity_unit_cd = f8
       3 item_id = f8
       3 med_product_id = f8
       3 volume = f8
       3 volume_unit_cd = f8
       3 strength = f8
       3 strength_unit_cd = f8
       3 ingred_seq = i4
       3 volume_with_overfill_value = f8
       3 volume_with_overfill_unit_cd = f8
       3 strength_with_overfill_value = f8
       3 strength_with_overfill_unit_cd = f8
     2 sig_codes = vc
     2 sig_text_id = f8
     2 alt_sig_lang_text_id = f8
     2 text = vc
     2 alt_text = vc
     2 icd9_id = f8
     2 track_nbr_s = vc
     2 script_origin_cd = f8
     2 safety_cap_cd = f8
     2 proxy_prescriber_id = f8
     2 disp_priority_dt_tm = dq8
     2 rx_nbr_in_set = i4
     2 rx_set_size = i4
     2 refill_qty = f8
     2 qty_remaining = f8
     2 gen_name = vc
     2 brand_name = vc
     2 manf_cd = f8
     2 control_number = vc
     2 health_plan_id = f8
     2 health_plan_s = vc
     2 authorization_nbr = vc
     2 pa_number = vc
     2 pa_beg_dt_tm = dq8
     2 pa_end_dt_tm = dq8
     2 payment_method_cd = f8
     2 price_code_cd = f8
     2 ord_price = f8
     2 uc_price = f8
     2 ord_cost = f8
     2 copay = f8
     2 reimbursement = f8
     2 script_clarify_cd = f8
     2 eligibility_clarify_cd = f8
     2 other_coverage_cd = f8
     2 compound_ind = i2
     2 dose_form_cd = f8
     2 pkg_quantity = f8
   1 dhx_cache
     2 sales_tax = f8
   1 label_cache
     2 label_nbr [* ]
       3 label_nbr = c50
   1 rxnbr_cache
     2 rx_nbr_unformatted = c100
     2 rx_nbr_formatted = c100
     2 prev_rx_nbr_cd = f8
     2 prev_rx_nbr_s = c100
     2 prev_rx_nbr_unformatted = c100
     2 prev_rx_nbr_formatted = c100
   1 rg_cache
     2 parent_sr_res_cd = f8
   1 lg_cache
     2 loc_type_cd = f8
     2 nurs_unit_cd = f8
     2 building_cd = f8
     2 facility_cd = f8
   1 provider_address_cache
     2 street = vc
     2 other_desig = vc
     2 city = vc
     2 state_prov = vc
     2 zip_code = vc
     2 country = vc
     2 types = vc
     2 other_geo_desig = vc
     2 county = vc
   1 oii_cache
     2 item_count = i4
     2 item [* ]
       3 item_id = f8
       3 obj_count = i4
       3 used_as_base_ind = i2
       3 obj [* ]
         4 identifier_type_cd = f8
         4 identifier_type_mean = vc
         4 value_key = vc
         4 value = vc
         4 primary_ind = i2
         4 primary_nbr_ind = i2
   1 freq_cache
     2 frequency_id = f8
     2 frequency_cd = f8
     2 frequency_type = i4
     2 freq_qualifier = i4
     2 interval = i4
     2 interval_units = i4
     2 day_of_week = vc
     2 time_of_day = vc
     2 pyxis_binary_week = vc
     2 dow_list [* ]
       3 day_of_week = i4
     2 tod_list [* ]
       3 time_of_day = vc
   1 pn_cache
     2 note_count = i4
     2 note [* ]
       3 comment_type_cd = f8
       3 comment_type_meaning = vc
       3 comment_count = i4
       3 comment [* ]
         4 long_text_id = f8
         4 where_to_print = i4
         4 comment = vc
   1 oal_cache
     2 alias_count = i4
     2 alias [* ]
       3 alias = vc
       3 alias_pool_cd = f8
       3 order_alias_type_cd = f8
       3 order_alias_sub_type_cd = f8
   1 od_cache
     2 cancelreason
       3 value = f8
       3 display = vc
     2 dcreason
       3 value = f8
       3 display = vc
     2 drugform
       3 value = f8
       3 display = vc
     2 duration
       3 value = f8
     2 durationunit
       3 value = f8
     2 duration_encoded = vc
     2 duration_noround = vc
     2 freq
       3 value = f8
       3 display = vc
     2 freqschedid
       3 value = f8
     2 infuseover
       3 value = f8
     2 infuseoverunit
       3 value = f8
     2 infuseover_encoded = vc
     2 infuseover_noround = vc
     2 mlhr = f8
     2 priority
       3 value = f8
     2 rate
       3 value = f8
     2 resumereason
       3 value = f8
       3 display = vc
     2 rxroute
       3 value = f8
       3 display = vc
     2 suspendreason
       3 value = f8
       3 display = vc
     2 titrateind
       3 value = f8
     2 totalvolume
       3 display = vc
     2 prnreason
       3 display = vc
     2 freetextrate
       3 display = vc
     2 replaceevery
       3 id = f8
       3 display = vc
     2 replaceeveryunit
       3 value = f8
       3 display = vc
     2 rxpriority
       3 value = f8
     2 disp_qty
       3 value = f8
     2 disp_qty_unit
       3 value = f8
     2 nbr_of_refills
       3 value = f8
     2 rx_qty
       3 value = f8
     2 indication
       3 display = vc
     2 special_instructions
       3 display = vc
     2 sig
       3 display = vc
     2 daw
       3 value = f8
       3 display = vc
     2 obx_detail_count = i4
     2 obx_detail [* ]
       3 value_type = vc
       3 obs_id = f8
       3 obs_value_count = i4
       3 obs_value [* ]
         4 value = vc
       3 units_id = vc
       3 units_text = vc
     2 tot_ingr_vol_w_overfill = f8
   1 oig_cache
     2 ing_count = i4
     2 ing [* ]
       3 catalog_cd = f8
       3 strength = f8
       3 strength_unit = f8
       3 volume = f8
       3 volume_unit = f8
       3 freetext_dose = vc
       3 rx_amount = vc
       3 rx_units = vc
       3 rx_alt_freetext = vc
       3 ordered_as_mnemonic = vc
       3 freq_cd = f8
       3 hna_order_mnemonic = vc
       3 prod_count = i4
       3 prod [* ]
         4 item_id = f8
         4 md_index = i4
         4 dose_quantity = f8
         4 dose_quantity_unit_cd = f8
         4 tnf_id = f8
         4 tnf_description = vc
         4 tnf_item_id = f8
         4 cmpd_base_ind = i2
       3 ingredient_type_flag = i2
       3 synonym_id = f8
       3 comp_sequence = i4
       3 action_sequence = i4
       3 ing_dose [* ]
         4 order_ingred_dose_id = f8
         4 dose_sequence = i2
         4 schedule_sequence = i2
         4 strength_dose_value = f8
         4 strength_dose_value_display = c100
         4 strength_dose_unit_cd = f8
         4 volume_dose_value = f8
         4 volume_dose_value_display = c100
         4 volume_dose_unit_cd = f8
         4 ordered_dose_value = f8
         4 ordered_dose_value_display = c100
         4 ordered_dose_unit_cd = f8
         4 ordered_dose_type_flag = i4
         4 rx_amount = vc
         4 rx_units = vc
         4 rx_alt_freetext = vc
         4 prod_dose [* ]
           5 order_product_dose_id = f8
           5 item_id = f8
           5 md_index = i4
           5 tnf_id = f8
           5 tnf_description = vc
           5 tnf_item_id = f8
           5 schedule_seq = i2
           5 dose_quantity = f8
           5 dose_quantity_unit_cd = f8
           5 unrounded_dose_qty = f8
     2 total_product_count = i4
     2 freq_count = i4
     2 freq_list [* ]
       3 freq_cd = f8
     2 product_current_ind = i2
   1 ord_disp_cache
     2 pharm_type_cd = f8
     2 dispense_category_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 DECLARE fill_orders_cache_with_flag (order_id1 ,action_sequence_flag ) = i4
 DECLARE fill_orders_cache (order_id1 ) = i4
 DECLARE fill_print_hx_cache (run_id1 ) = i4
 DECLARE fill_print_ord_hx_cache (run_id1 ,order_id1 ) = i4
 DECLARE fill_dispense_hx_cache (dispense_hx_id1 ) = i4
 DECLARE fill_object_identifier_index_cache (dum ) = i4
 DECLARE fill_frequency_cache (dum ) = i4
 DECLARE fill_cerner_area_frequency (dum ) = i4
 DECLARE fill_provider_address_cache (ord_phys_id1 ) = i4
 DECLARE read_order_action (order_id1 ,action_sequence1 ) = i4
 DECLARE get_prescription_nbr (rx_nbr_s1 ,order_id1 ,prod_count1 ) = i4
 DECLARE get_product_info (prod_count1 ) = i4
 DECLARE get_provider_adm_instructions (sig_text_id1 ,alt_sig_lang_text_id1 ) = i4
 DECLARE read_resource_group (dispense_sr_cd1 ) = i4
 DECLARE fill_service_resource_cache (dispense_sr_cd1 ) = i4
 DECLARE fill_pyxis_binary_week (dum ) = i4
 SUBROUTINE  fill_orders_cache_with_flag (order_id1 ,action_sequence_flag )
  FREE SET column_exists
  SET column_exists = eso_column_exists ("ORDERS" ,"AD_HOC_ORDER_FLAG" )
  CALL echo ("Entering fill_orders_cache_with_flag subroutine" )
  IF (column_exists )
   SELECT INTO "nl:"
    o.*
    FROM (orders o )
    WHERE (o.order_id = order_id1 )
    AND (o.active_ind = 1 )
    DETAIL
     reply->o_cache.order_status_cd = o.order_status_cd ,
     reply->o_cache.dept_status_cd = o.dept_status_cd ,
     reply->o_cache.med_order_type_cd = o.med_order_type_cd ,
     reply->o_cache.ordered_as_mnemonic = o.ordered_as_mnemonic ,
     reply->o_cache.order_id = o.order_id ,
     reply->o_cache.prn_ind = o.prn_ind ,
     reply->o_cache.current_start_dt_tm = o.current_start_dt_tm ,
     reply->o_cache.projected_stop_dt_tm = o.projected_stop_dt_tm ,
     reply->o_cache.order_mnemonic = o.order_mnemonic ,
     reply->o_cache.hna_order_mnemonic = o.hna_order_mnemonic ,
     reply->o_cache.discontinue_type_cd = o.discontinue_type_cd ,
     reply->o_cache.stop_type_cd = o.stop_type_cd ,
     reply->o_cache.suspend_ind = o.suspend_ind ,
     reply->o_cache.suspend_effective_dt_tm = o.suspend_effective_dt_tm ,
     reply->o_cache.resume_ind = o.resume_ind ,
     reply->o_cache.resume_effective_dt_tm = o.resume_effective_dt_tm ,
     reply->o_cache.orig_ord_as_flag = o.orig_ord_as_flag ,
     reply->o_cache.dosing_method_flag = o.dosing_method_flag ,
     reply->o_cache.ad_hoc_order_flag = o.ad_hoc_order_flag ,
     IF ((action_sequence_flag > 0 )
     AND (reply->action_sequence <= 0 ) ) reply->action_sequence = o.last_action_sequence ,
      CALL echo (build ("reply->action_sequence=" ,reply->action_sequence ) ) ,stat =
      set_esoinfo_double ("action_sequence" ,reply->action_sequence )
     ENDIF
    WITH nocounter
   ;end select
  ELSE
   SELECT INTO "nl:"
    o.*
    FROM (orders o )
    WHERE (o.order_id = order_id1 )
    AND (o.active_ind = 1 )
    DETAIL
     reply->o_cache.order_status_cd = o.order_status_cd ,
     reply->o_cache.dept_status_cd = o.dept_status_cd ,
     reply->o_cache.med_order_type_cd = o.med_order_type_cd ,
     reply->o_cache.ordered_as_mnemonic = o.ordered_as_mnemonic ,
     reply->o_cache.order_id = o.order_id ,
     reply->o_cache.prn_ind = o.prn_ind ,
     reply->o_cache.current_start_dt_tm = o.current_start_dt_tm ,
     reply->o_cache.projected_stop_dt_tm = o.projected_stop_dt_tm ,
     reply->o_cache.order_mnemonic = o.order_mnemonic ,
     reply->o_cache.hna_order_mnemonic = o.hna_order_mnemonic ,
     reply->o_cache.discontinue_type_cd = o.discontinue_type_cd ,
     reply->o_cache.stop_type_cd = o.stop_type_cd ,
     reply->o_cache.suspend_ind = o.suspend_ind ,
     reply->o_cache.suspend_effective_dt_tm = o.suspend_effective_dt_tm ,
     reply->o_cache.resume_ind = o.resume_ind ,
     reply->o_cache.resume_effective_dt_tm = o.resume_effective_dt_tm ,
     reply->o_cache.orig_ord_as_flag = o.orig_ord_as_flag ,
     reply->o_cache.dosing_method_flag = o.dosing_method_flag ,
     IF ((action_sequence_flag > 0 )
     AND (reply->action_sequence <= 0 ) ) reply->action_sequence = o.last_action_sequence ,
      CALL echo (build ("reply->action_sequence=" ,reply->action_sequence ) ) ,stat =
      set_esoinfo_double ("action_sequence" ,reply->action_sequence )
     ENDIF
    WITH nocounter
   ;end select
  ENDIF
  IF ((curqual <= 0 ) )
   CALL echo ("No order found" )
   CALL echo ("Exiting fill_orders_cache_with_flag subroutine" )
   RETURN (0 )
  ELSE
   CALL echo ("Order found" )
   CALL echo ("Exiting fill_orders_cache_with_flag subroutine" )
   RETURN (1 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  fill_orders_cache (order_id1 )
  CALL echo (
   "Entering fill_orders_cache subroutine and calling new fill_orders_cache_with_flag routine" )
  RETURN (fill_orders_cache_with_flag (order_id1 ,0 ) )
 END ;Subroutine
 SUBROUTINE  fill_print_hx_cache (run_id1 )
  CALL echo ("Entering fill_print_hx subroutine" )
  SELECT INTO "nl:"
   fph.*
   FROM (fill_print_hx fph )
   WHERE (fph.run_id = run_id1 )
   DETAIL
    reply->fph_cache.cyc_from_dt_tm = fph.cyc_from_dt_tm ,
    reply->fph_cache.fill_hx_id = fph.fill_hx_id ,
    reply->fph_cache.run_type_cd = fph.run_type_cd
   WITH nocounter
  ;end select
  SET stat = set_esoinfo_double ("fill_hx_id" ,reply->fph_cache.fill_hx_id )
  CALL echo ("Exiting fill_print_hx subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_print_ord_hx_cache (run_id1 ,order_id1 )
  CALL echo ("Entering fill_print_ord_hx_cache subroutine" )
  DECLARE shtemp_dose_ind = i2 WITH private ,noconstant (0 )
  DECLARE shtemp_bag_nbr = i2 WITH public ,noconstant (0 )
  SET shtemp_dose_ind = get_esoinfo_long ("eso_dose_msg_ind" )
  IF ((shtemp_dose_ind > 0 ) )
   CALL echo ("eso_dose_msg_ind > 0" )
   SET shtemp_bag_nbr = get_esoinfo_long ("bag_nbr" )
   IF ((shtemp_bag_nbr = 0 ) )
    SET shtemp_bag_nbr = get_esoinfo_long ("admin_index" )
   ENDIF
   CALL echo (build ("shTemp_Bag_nbr = " ,shtemp_bag_nbr ) )
   FREE SET column_exists
   SET column_exists = eso_column_exists ("FILL_PRINT_ORD_HX" ,"RX_WORKSTATION_CD" )
   SELECT INTO "nl:"
    fpoh.*
    FROM (fill_print_ord_hx fpoh ),
     (
     (
     (SELECT
      x1 = fpoh2.pkg_quantity ,
      x2 = fpoh2.order_id
      FROM (fill_print_ord_hx fpoh2 )
      WHERE (fpoh2.run_id = run_id1 )
      AND (fpoh2.order_id = order_id1 )
      AND (fpoh2.bag_nbr = shtemp_bag_nbr )
      AND (fpoh2.fill_quantity >= 0 )
      AND (fpoh2.dispense_device_ind = 1 )
      WITH sqltype ("f8" ,"f8" ) ,maxqual (fpoh2 ,1 ) ) )
     inner_fpoh )
    PLAN (fpoh
     WHERE (fpoh.run_id = run_id1 )
     AND (fpoh.order_id = order_id1 )
     AND (fpoh.fill_quantity >= 0 )
     AND (fpoh.bag_nbr = shtemp_bag_nbr )
     AND (fpoh.dispense_device_ind = 1 ) )
     JOIN (inner_fpoh
     WHERE (inner_fpoh.x2 = fpoh.order_id ) )
    ORDER BY fpoh.bag_nbr ,
     fpoh.ingred_seq
    HEAD REPORT
     reply->fpoh_cache.obx_count = 0 ,
     reply->fpoh_cache.prod_count = 0 ,
     a = 0 ,
     p = 0
    HEAD fpoh.bag_nbr
     a = (a + 1 ) ,reply->fpoh_cache.admin_count = fpoh.admin_count ,stat = alterlist (reply->
      fpoh_cache.admin ,a ) ,reply->fpoh_cache.fill_quantity = fpoh.fill_quantity ,
     IF ((reply->encounter_id <= 0 ) ) reply->encounter_id = fpoh.encntr_id ,
      CALL echo (build ("reply->encounter_id=" ,reply->encounter_id ) ) ,stat = set_esoinfo_double (
       "encounter_id" ,reply->encounter_id )
     ENDIF
     ,
     IF ((reply->action_sequence <= 0 ) ) reply->action_sequence = fpoh.action_sequence ,
      CALL echo (build ("reply->action_sequence=" ,reply->action_sequence ) ) ,stat =
      set_esoinfo_double ("action_sequence" ,reply->action_sequence )
     ENDIF
     ,
     IF ((reply->dispense_hx_id <= 0 ) ) reply->dispense_hx_id = fpoh.dispense_id ,
      CALL echo (build ("reply->dispense_hx_id=" ,reply->dispense_hx_id ) ) ,stat =
      set_esoinfo_double ("dispense_hx_id" ,reply->dispense_hx_id )
     ENDIF
     ,reply->fpoh_cache.dispense_sr_cd = fpoh.dispense_sr_cd ,reply->fpoh_cache.rx_nbr_s = fpoh
     .rx_nbr_s ,reply->fpoh_cache.rx_nbr_cd = fpoh.rx_nbr_cd ,reply->fpoh_cache.alt_sig_lang_text_id
     = fpoh.sig_alt_lang_text_id ,reply->fpoh_cache.sig_text_id = fpoh.sig_text_id ,reply->fpoh_cache
     .sig_codes = fpoh.sig_codes ,reply->fpoh_cache.dur_intervention_cd = fpoh.dur_inter_cd ,reply->
     fpoh_cache.dur_outcome_cd = fpoh.dur_outcome_cd ,reply->fpoh_cache.dur_conflict_cd = fpoh
     .dur_conflict_cd ,reply->fpoh_cache.legal_status_cd = fpoh.legal_status_cd ,reply->fpoh_cache.
     last_refill_dt_tm = fpoh.last_refill_dt_tm ,reply->fpoh_cache.fill_nbr = fpoh.fill_nbr ,reply->
     fpoh_cache.refills_remaining = fpoh.refills_remaining ,reply->fpoh_cache.total_refills = fpoh
     .total_refills ,reply->fpoh_cache.daw_cd = fpoh.daw_cd ,reply->fpoh_cache.rx_expire_dt_time =
     fpoh.rx_expire_dt_tm ,reply->fpoh_cache.days_supply = fpoh.days_supply ,reply->fpoh_cache.
     disp_qty_unit_cd = fpoh.disp_qty_unit_cd ,reply->fpoh_cache.disp_priority_cd = fpoh
     .disp_priority_cd ,reply->fpoh_cache.disp_qty = fpoh.disp_qty ,reply->fpoh_cache.frequency_cd =
     fpoh.frequency_cd ,reply->fpoh_cache.order_start_dt_tm = fpoh.order_start_dt_tm ,reply->
     fpoh_cache.order_stop_dt_tm = fpoh.order_stop_dt_tm ,reply->fpoh_cache.updt_dt_tm = fpoh
     .updt_dt_tm ,reply->fpoh_cache.entry_id = fpoh.entry_id ,reply->fpoh_cache.rph_id = fpoh.rph_id
     ,reply->fpoh_cache.ord_phys_id = fpoh.ord_phys_id ,reply->fpoh_cache.ord_type = fpoh.ord_type ,
     reply->fpoh_cache.prn_ind = fpoh.prn_ind ,reply->fpoh_cache.rate = fpoh.rate ,reply->fpoh_cache.
     route_cd = fpoh.route_cd ,reply->fpoh_cache.titrate_ind = fpoh.titrate_ind ,reply->fpoh_cache.
     tot_volume = fpoh.tot_volume ,reply->fpoh_cache.ord_desc = fpoh.ord_desc ,reply->fpoh_cache.
     order_status_enum = fpoh.order_status_enum ,reply->fpoh_cache.icd9_id = fpoh.icd9_id ,reply->
     fpoh_cache.track_nbr_s = fpoh.track_nbr_s ,reply->fpoh_cache.script_origin_cd = fpoh
     .script_origin_cd ,reply->fpoh_cache.safety_cap_cd = fpoh.safety_cap_cd ,reply->fpoh_cache.
     proxy_prescriber_id = fpoh.proxy_prescriber_id ,reply->fpoh_cache.disp_priority_dt_tm = fpoh
     .disp_priority_dt_tm ,reply->fpoh_cache.rx_nbr_in_set = fpoh.rx_nbr_in_set ,reply->fpoh_cache.
     rx_set_size = fpoh.rx_set_size ,reply->fpoh_cache.refill_qty = fpoh.refill_qty ,reply->
     fpoh_cache.qty_remaining = fpoh.qty_remaining ,reply->fpoh_cache.gen_name = fpoh.gen_name ,reply
     ->fpoh_cache.brand_name = fpoh.brand_name ,reply->fpoh_cache.manf_cd = fpoh.manf_cd ,reply->
     fpoh_cache.control_number = fpoh.control_number ,reply->fpoh_cache.health_plan_id = fpoh
     .health_plan_id ,reply->fpoh_cache.health_plan_s = fpoh.health_plan_s ,reply->fpoh_cache.
     authorization_nbr = fpoh.authorization_nbr ,reply->fpoh_cache.pa_number = fpoh.pa_number ,reply
     ->fpoh_cache.pa_beg_dt_tm = fpoh.pa_beg_dt_tm ,reply->fpoh_cache.pa_end_dt_tm = fpoh
     .pa_end_dt_tm ,reply->fpoh_cache.payment_method_cd = fpoh.payment_method_cd ,reply->fpoh_cache.
     price_code_cd = fpoh.price_code_cd ,reply->fpoh_cache.ord_price = fpoh.ord_price ,reply->
     fpoh_cache.uc_price = fpoh.uc_price ,reply->fpoh_cache.ord_cost = fpoh.ord_cost ,reply->
     fpoh_cache.copay = fpoh.copay ,reply->fpoh_cache.reimbursement = fpoh.reimbursement ,reply->
     fpoh_cache.script_clarify_cd = fpoh.script_clarify_cd ,reply->fpoh_cache.eligibility_clarify_cd
     = fpoh.eligibility_clarify_cd ,reply->fpoh_cache.other_coverage_cd = fpoh.other_coverage_cd ,
     reply->fpoh_cache.compound_ind = fpoh.compound_ind ,reply->fpoh_cache.infuse_encoded =
     eso_encode_timing_noround (fpoh.infuse_over ,fpoh.infuse_unit_cd ) ,reply->fpoh_cache.
     dose_form_cd = fpoh.dose_form_cd ,reply->fpoh_cache.pkg_quantity = inner_fpoh.x1 ,
     IF (column_exists ) reply->rx_workstation_cd = fpoh.rx_workstation_cd
     ENDIF
     ,
     IF ((fpoh.height > 0 )
     AND (fpoh.height_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1
      ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.
      obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
      obx_count ].identifier = "HEIGHT" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
      fpoh.height ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.height_unit_cd
     ENDIF
     ,
     IF ((fpoh.weight > 0 )
     AND (fpoh.weight_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1
      ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.
      obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
      obx_count ].identifier = "WEIGHT" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
      fpoh.weight ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.weight_unit_cd
     ENDIF
     ,
     IF ((fpoh.bsa > 0 )
     AND (fpoh.bsa_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1 ) ,
      stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.obx[
      reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
      obx_count ].identifier = "BSA" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
      fpoh.bsa ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.bsa_unit_cd
     ENDIF
     ,
     IF ((fpoh.ibw > 0 )
     AND (fpoh.ibw_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1 ) ,
      stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.obx[
      reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
      obx_count ].identifier = "IBW" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
      fpoh.ibw ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.ibw_unit_cd
     ENDIF
     ,
     IF ((fpoh.crcl > 0 )
     AND (fpoh.crcl_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1 )
     ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.obx[
      reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
      obx_count ].identifier = "CRCL" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
      fpoh.crcl ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.crcl_unit_cd
     ENDIF
     ,
     IF ((fpoh.replace_every > 0 )
     AND (fpoh.replace_every_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.
      obx_count + 1 ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply
      ->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->
      fpoh_cache.obx_count ].identifier = "REPLACE" ,reply->fpoh_cache.obx[reply->fpoh_cache.
      obx_count ].value = fpoh.replace_every ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].
      units = fpoh.replace_every_unit_cd
     ENDIF
     ,
     IF ((a <= reply->fpoh_cache.admin_count ) ) reply->fpoh_cache.admin[a ].admin_dt_tm = fpoh
      .admin_dt_tm
     ENDIF
    DETAIL
     p = (p + 1 ) ,
     stat = alterlist (reply->fpoh_cache.prod ,p ) ,
     stat = alterlist (reply->oii_cache.item ,p ) ,
     reply->fpoh_cache.prod[p ].form_cd = fpoh.form_cd ,
     reply->fpoh_cache.prod[p ].freetext_dose = fpoh.freetext_dose ,
     reply->fpoh_cache.prod[p ].label_desc = fpoh.label_desc ,
     reply->fpoh_cache.prod[p ].dose_quantity = fpoh.dose_quantity ,
     reply->fpoh_cache.prod[p ].dose_quantity_unit_cd = fpoh.dose_quantity_unit_cd ,
     reply->fpoh_cache.prod[p ].item_id = fpoh.item_id ,
     reply->oii_cache.item[p ].item_id = fpoh.item_id ,
     reply->fpoh_cache.prod[p ].med_product_id = fpoh.med_product_id ,
     reply->fpoh_cache.prod[p ].volume = fpoh.volume ,
     reply->fpoh_cache.prod[p ].volume_unit_cd = fpoh.volume_unit_cd ,
     reply->fpoh_cache.prod[p ].strength = fpoh.strength ,
     reply->fpoh_cache.prod[p ].strength_unit_cd = fpoh.strength_unit_cd ,
     reply->fpoh_cache.prod[p ].ingred_seq = fpoh.ingred_seq ,
     reply->fpoh_cache.prod[p ].volume_with_overfill_value = fpoh.volume_with_overfill_value ,
     reply->fpoh_cache.prod[p ].volume_with_overfill_unit_cd = fpoh.volume_with_overfill_unit_cd ,
     reply->fpoh_cache.prod[p ].strength_with_overfill_value = fpoh.strength_with_overfill_value ,
     reply->fpoh_cache.prod[p ].strength_with_overfill_unit_cd = fpoh.strength_with_overfill_unit_cd
    FOOT  fpoh.bag_nbr
     reply->fpoh_cache.prod_count = p ,
     CALL echo (build ("Number of products = " ,p ) ) ,
     IF ((a = 1 ) ) reply->fpoh_cache.prod_count = p ,stat = alterlist (reply->fpoh_cache.prod ,reply
       ->fpoh_cache.prod_count ) ,reply->oii_cache.item_count = p ,stat = alterlist (reply->oii_cache
       .item ,reply->oii_cache.item_count )
     ENDIF
    WITH nocounter
   ;end select
   IF ((curqual <= 0 ) )
    SET reply->status_data.status = "F"
    SET reply->status_data.subeventstatus[1 ].operationname = "SELECT"
    SET reply->status_data.subeventstatus[1 ].operationstatus = "F"
    SET reply->status_data.subeventstatus[1 ].targetobjectname = "TABLE"
    SET reply->status_data.subeventstatus[1 ].targetobjectvalue = "FILL_PRINT_ORD_HX"
   ENDIF
   CALL echo ("Exiting fill_print_ord_hx_cache subroutine" )
   RETURN (0 )
  ELSE
   CALL echo ("eso_dose_msg_ind = 0" )
   FREE SET column_exists
   SET column_exists = eso_column_exists ("FILL_PRINT_ORD_HX" ,"RX_WORKSTATION_CD" )
   SELECT INTO "nl:"
    fpoh.*
    FROM (fill_print_ord_hx fpoh ),
     (
     (
     (SELECT
      x1 = fpoh2.pkg_quantity ,
      x2 = fpoh2.order_id
      FROM (fill_print_ord_hx fpoh2 )
      WHERE (fpoh2.run_id = run_id1 )
      AND (fpoh2.order_id = order_id1 )
      AND (fpoh2.fill_quantity >= 0 )
      AND (fpoh2.dispense_device_ind = 1 )
      WITH sqltype ("f8" ,"f8" ) ,maxqual (fpoh2 ,1 ) ) )
     inner_fpoh )
    PLAN (fpoh
     WHERE (fpoh.run_id = run_id1 )
     AND (fpoh.order_id = order_id1 )
     AND (fpoh.fill_quantity >= 0 )
     AND (fpoh.dispense_device_ind = 1 ) )
     JOIN (inner_fpoh
     WHERE (inner_fpoh.x2 = fpoh.order_id ) )
    ORDER BY fpoh.bag_nbr ,
     fpoh.ingred_seq
    HEAD REPORT
     reply->fpoh_cache.obx_count = 0 ,
     reply->fpoh_cache.prod_count = 0 ,
     a = 0 ,
     p = 0
    HEAD fpoh.bag_nbr
     a = (a + 1 ) ,
     IF ((a = 1 ) ) reply->fpoh_cache.admin_count = fpoh.admin_count ,stat = alterlist (reply->
       fpoh_cache.admin ,reply->fpoh_cache.admin_count ) ,reply->fpoh_cache.fill_quantity = fpoh
      .fill_quantity ,
      IF ((reply->encounter_id <= 0 ) ) reply->encounter_id = fpoh.encntr_id ,
       CALL echo (build ("reply->encounter_id=" ,reply->encounter_id ) ) ,stat = set_esoinfo_double (
        "encounter_id" ,reply->encounter_id )
      ENDIF
      ,
      IF ((reply->action_sequence <= 0 ) ) reply->action_sequence = fpoh.action_sequence ,
       CALL echo (build ("reply->action_sequence=" ,reply->action_sequence ) ) ,stat =
       set_esoinfo_double ("action_sequence" ,reply->action_sequence )
      ENDIF
      ,
      IF ((reply->dispense_hx_id <= 0 ) ) reply->dispense_hx_id = fpoh.dispense_id ,
       CALL echo (build ("reply->dispense_hx_id=" ,reply->dispense_hx_id ) ) ,stat =
       set_esoinfo_double ("dispense_hx_id" ,reply->dispense_hx_id )
      ENDIF
      ,reply->fpoh_cache.dispense_sr_cd = fpoh.dispense_sr_cd ,reply->fpoh_cache.rx_nbr_s = fpoh
      .rx_nbr_s ,reply->fpoh_cache.rx_nbr_cd = fpoh.rx_nbr_cd ,reply->fpoh_cache.alt_sig_lang_text_id
       = fpoh.sig_alt_lang_text_id ,reply->fpoh_cache.sig_text_id = fpoh.sig_text_id ,reply->
      fpoh_cache.sig_codes = fpoh.sig_codes ,reply->fpoh_cache.dur_intervention_cd = fpoh
      .dur_inter_cd ,reply->fpoh_cache.dur_outcome_cd = fpoh.dur_outcome_cd ,reply->fpoh_cache.
      dur_conflict_cd = fpoh.dur_conflict_cd ,reply->fpoh_cache.legal_status_cd = fpoh
      .legal_status_cd ,reply->fpoh_cache.last_refill_dt_tm = fpoh.last_refill_dt_tm ,reply->
      fpoh_cache.fill_nbr = fpoh.fill_nbr ,reply->fpoh_cache.refills_remaining = fpoh
      .refills_remaining ,reply->fpoh_cache.total_refills = fpoh.total_refills ,reply->fpoh_cache.
      daw_cd = fpoh.daw_cd ,reply->fpoh_cache.rx_expire_dt_time = fpoh.rx_expire_dt_tm ,reply->
      fpoh_cache.days_supply = fpoh.days_supply ,reply->fpoh_cache.disp_qty_unit_cd = fpoh
      .disp_qty_unit_cd ,reply->fpoh_cache.disp_priority_cd = fpoh.disp_priority_cd ,reply->
      fpoh_cache.disp_qty = fpoh.disp_qty ,reply->fpoh_cache.frequency_cd = fpoh.frequency_cd ,reply
      ->fpoh_cache.order_start_dt_tm = fpoh.order_start_dt_tm ,reply->fpoh_cache.order_stop_dt_tm =
      fpoh.order_stop_dt_tm ,reply->fpoh_cache.updt_dt_tm = fpoh.updt_dt_tm ,reply->fpoh_cache.
      entry_id = fpoh.entry_id ,reply->fpoh_cache.rph_id = fpoh.rph_id ,reply->fpoh_cache.ord_phys_id
       = fpoh.ord_phys_id ,reply->fpoh_cache.ord_type = fpoh.ord_type ,reply->fpoh_cache.prn_ind =
      fpoh.prn_ind ,reply->fpoh_cache.rate = fpoh.rate ,reply->fpoh_cache.route_cd = fpoh.route_cd ,
      reply->fpoh_cache.titrate_ind = fpoh.titrate_ind ,reply->fpoh_cache.tot_volume = fpoh
      .tot_volume ,reply->fpoh_cache.ord_desc = fpoh.ord_desc ,reply->fpoh_cache.order_status_enum =
      fpoh.order_status_enum ,reply->fpoh_cache.icd9_id = fpoh.icd9_id ,reply->fpoh_cache.track_nbr_s
       = fpoh.track_nbr_s ,reply->fpoh_cache.script_origin_cd = fpoh.script_origin_cd ,reply->
      fpoh_cache.safety_cap_cd = fpoh.safety_cap_cd ,reply->fpoh_cache.proxy_prescriber_id = fpoh
      .proxy_prescriber_id ,reply->fpoh_cache.disp_priority_dt_tm = fpoh.disp_priority_dt_tm ,reply->
      fpoh_cache.rx_nbr_in_set = fpoh.rx_nbr_in_set ,reply->fpoh_cache.rx_set_size = fpoh
      .rx_set_size ,reply->fpoh_cache.refill_qty = fpoh.refill_qty ,reply->fpoh_cache.qty_remaining
      = fpoh.qty_remaining ,reply->fpoh_cache.gen_name = fpoh.gen_name ,reply->fpoh_cache.brand_name
      = fpoh.brand_name ,reply->fpoh_cache.manf_cd = fpoh.manf_cd ,reply->fpoh_cache.control_number
      = fpoh.control_number ,reply->fpoh_cache.health_plan_id = fpoh.health_plan_id ,reply->
      fpoh_cache.health_plan_s = fpoh.health_plan_s ,reply->fpoh_cache.authorization_nbr = fpoh
      .authorization_nbr ,reply->fpoh_cache.pa_number = fpoh.pa_number ,reply->fpoh_cache.
      pa_beg_dt_tm = fpoh.pa_beg_dt_tm ,reply->fpoh_cache.pa_end_dt_tm = fpoh.pa_end_dt_tm ,reply->
      fpoh_cache.payment_method_cd = fpoh.payment_method_cd ,reply->fpoh_cache.price_code_cd = fpoh
      .price_code_cd ,reply->fpoh_cache.ord_price = fpoh.ord_price ,reply->fpoh_cache.uc_price = fpoh
      .uc_price ,reply->fpoh_cache.ord_cost = fpoh.ord_cost ,reply->fpoh_cache.copay = fpoh.copay ,
      reply->fpoh_cache.reimbursement = fpoh.reimbursement ,reply->fpoh_cache.script_clarify_cd =
      fpoh.script_clarify_cd ,reply->fpoh_cache.eligibility_clarify_cd = fpoh.eligibility_clarify_cd
     ,reply->fpoh_cache.other_coverage_cd = fpoh.other_coverage_cd ,reply->fpoh_cache.compound_ind =
      fpoh.compound_ind ,reply->fpoh_cache.pkg_quantity = inner_fpoh.x1 ,reply->fpoh_cache.
      infuse_encoded = eso_encode_timing_noround (fpoh.infuse_over ,fpoh.infuse_unit_cd ) ,
      IF (column_exists ) reply->rx_workstation_cd = fpoh.rx_workstation_cd
      ENDIF
      ,
      IF ((fpoh.height > 0 )
      AND (fpoh.height_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count +
       1 ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache
       .obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
       obx_count ].identifier = "HEIGHT" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value
       = fpoh.height ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh
       .height_unit_cd
      ENDIF
      ,
      IF ((fpoh.weight > 0 )
      AND (fpoh.weight_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count +
       1 ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache
       .obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
       obx_count ].identifier = "WEIGHT" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value
       = fpoh.weight ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh
       .weight_unit_cd
      ENDIF
      ,
      IF ((fpoh.bsa > 0 )
      AND (fpoh.bsa_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1 )
      ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.obx[
       reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
       obx_count ].identifier = "BSA" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
       fpoh.bsa ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.bsa_unit_cd
      ENDIF
      ,
      IF ((fpoh.ibw > 0 )
      AND (fpoh.ibw_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1 )
      ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.obx[
       reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
       obx_count ].identifier = "IBW" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
       fpoh.ibw ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.ibw_unit_cd
      ENDIF
      ,
      IF ((fpoh.crcl > 0 )
      AND (fpoh.crcl_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.obx_count + 1
       ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply->fpoh_cache.
       obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply->fpoh_cache.
       obx_count ].identifier = "CRCL" ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value =
       fpoh.crcl ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].units = fpoh.crcl_unit_cd
      ENDIF
      ,
      IF ((fpoh.replace_every > 0 )
      AND (fpoh.replace_every_unit_cd > 0 ) ) reply->fpoh_cache.obx_count = (reply->fpoh_cache.
       obx_count + 1 ) ,stat = alterlist (reply->fpoh_cache.obx ,reply->fpoh_cache.obx_count ) ,reply
       ->fpoh_cache.obx[reply->fpoh_cache.obx_count ].value_type = "NM" ,reply->fpoh_cache.obx[reply
       ->fpoh_cache.obx_count ].identifier = "REPLACE" ,reply->fpoh_cache.obx[reply->fpoh_cache.
       obx_count ].value = fpoh.replace_every ,reply->fpoh_cache.obx[reply->fpoh_cache.obx_count ].
       units = fpoh.replace_every_unit_cd
      ENDIF
     ENDIF
     ,
     IF ((a <= reply->fpoh_cache.admin_count ) ) reply->fpoh_cache.admin[a ].admin_dt_tm = fpoh
      .admin_dt_tm
     ENDIF
    DETAIL
     IF ((a = 1 ) ) p = (p + 1 ) ,
      IF ((mod (p ,10 ) = 1 ) ) stat = alterlist (reply->fpoh_cache.prod ,(p + 9 ) ) ,stat =
       alterlist (reply->oii_cache.item ,(p + 9 ) )
      ENDIF
      ,reply->fpoh_cache.prod[p ].form_cd = fpoh.form_cd ,reply->fpoh_cache.prod[p ].freetext_dose =
      fpoh.freetext_dose ,reply->fpoh_cache.prod[p ].label_desc = fpoh.label_desc ,reply->fpoh_cache.
      prod[p ].dose_quantity = fpoh.dose_quantity ,reply->fpoh_cache.prod[p ].dose_quantity_unit_cd
      = fpoh.dose_quantity_unit_cd ,reply->fpoh_cache.prod[p ].item_id = fpoh.item_id ,reply->
      oii_cache.item[p ].item_id = fpoh.item_id ,reply->fpoh_cache.prod[p ].med_product_id = fpoh
      .med_product_id ,reply->fpoh_cache.prod[p ].volume = fpoh.volume ,reply->fpoh_cache.prod[p ].
      volume_unit_cd = fpoh.volume_unit_cd ,reply->fpoh_cache.prod[p ].strength = fpoh.strength ,
      reply->fpoh_cache.prod[p ].strength_unit_cd = fpoh.strength_unit_cd ,reply->fpoh_cache.prod[p ]
      .ingred_seq = fpoh.ingred_seq
     ENDIF
    FOOT  fpoh.bag_nbr
     IF ((a = 1 ) ) reply->fpoh_cache.prod_count = p ,stat = alterlist (reply->fpoh_cache.prod ,reply
       ->fpoh_cache.prod_count ) ,reply->oii_cache.item_count = p ,stat = alterlist (reply->oii_cache
       .item ,reply->oii_cache.item_count )
     ENDIF
    WITH nocounter
   ;end select
   IF ((curqual <= 0 ) )
    SET reply->status_data.status = "F"
    SET reply->status_data.subeventstatus[1 ].operationname = "SELECT"
    SET reply->status_data.subeventstatus[1 ].operationstatus = "F"
    SET reply->status_data.subeventstatus[1 ].targetobjectname = "TABLE"
    SET reply->status_data.subeventstatus[1 ].targetobjectvalue = "FILL_PRINT_ORD_HX"
   ENDIF
   CALL echo ("Exiting fill_print_ord_hx_cache subroutine" )
   RETURN (0 )
  ENDIF
 END ;Subroutine
 SUBROUTINE  fill_dispense_hx_cache (dispense_hx_id1 )
  CALL echo ("Entering fill_dispense_hx_cache subroutine" )
  FREE SET column_exists
  SET column_exists = eso_column_exists ("FILL_PRINT_ORD_HX" ,"RX_WORKSTATION_CD" )
  SELECT INTO "nl:"
   dh.disp_event_type_cd ,
   dh.level5_cd ,
   dh.sales_tax
   FROM (dispense_hx dh )
   WHERE (dh.dispense_hx_id = dispense_hx_id1 )
   DETAIL
    IF ((reply->disp_event_type_cd <= 0 ) ) reply->disp_event_type_cd = dh.disp_event_type_cd
    ENDIF
    ,
    IF (((NOT (column_exists ) ) OR ((reply->rx_workstation_cd = 0 ) )) ) reply->rx_workstation_cd =
     dh.level5_cd
    ENDIF
    ,reply->dhx_cache.sales_tax = dh.sales_tax
   WITH nocounter
  ;end select
  CALL echo ("Exiting fill_dispense_hx_cache subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_object_identifier_index_cache (dum )
  CALL echo ("Entering fill_object_identifier_index subroutine" )
  DECLARE stat = f8 WITH protect ,noconstant (0.0 )
  DECLARE lnewmodelchk = i4 WITH protect ,noconstant (0 )
  DECLARE dinpatient = f8 WITH protect ,noconstant (0.0 )
  IF ((validate (irxc1_old_logic ,99999 ) = 99999 ) )
   DECLARE irxc1_old_logic = i4 WITH protect ,noconstant (0 )
  ENDIF
  SELECT INTO "NL:"
   FROM (dm_prefs dmp )
   WHERE (dmp.application_nbr = 300000 )
   AND (dmp.person_id = 0 )
   AND (dmp.pref_domain = "PHARMNET-INPATIENT" )
   AND (dmp.pref_section = "FRMLRYMGMT" )
   AND (dmp.pref_name = "NEW MODEL" )
   DETAIL
    IF ((dmp.pref_nbr = 1 ) ) lnewmodelchk = 1
    ENDIF
   WITH nocounter
  ;end select
  IF ((lnewmodelchk = 0 ) )
   FREE SET med_def_object_type_cd
   SET med_def_object_type_cd = get_esoinfo_double ("object_type_cd" )
   SELECT INTO "nl:"
    d.seq ,
    md.item_id ,
    oii.identifier_type_cd ,
    oii.value_key ,
    oii.value ,
    oii.primary_ind ,
    oii.primary_nbr_ind ,
    cv.cdf_meaning
    FROM (dummyt d WITH seq = value (reply->oii_cache.item_count ) ),
     (medication_definition md ),
     (object_identifier_index oii ),
     (code_value cv )
    PLAN (d )
     JOIN (md
     WHERE (md.item_id = reply->oii_cache.item[d.seq ].item_id ) )
     JOIN (oii
     WHERE (oii.object_id = reply->oii_cache.item[d.seq ].item_id )
     AND (oii.object_type_cd = med_def_object_type_cd )
     AND (oii.identifier_type_cd > 0 )
     AND (oii.active_ind = 1 )
     AND (oii.generic_object = 0 ) )
     JOIN (cv
     WHERE (cv.code_value = oii.identifier_type_cd )
     AND (cv.begin_effective_dt_tm < cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.end_effective_dt_tm > cnvtdatetime (curdate ,curtime3 ) )
     AND (cv.active_ind = 1 ) )
    ORDER BY d.seq ,
     oii.identifier_type_cd ,
     oii.primary_ind DESC ,
     oii.primary_nbr_ind DESC
    HEAD d.seq
     i = 0 ,reply->oii_cache.item[d.seq ].used_as_base_ind = md.used_as_base_ind
    HEAD oii.identifier_type_cd
     i = (i + 1 ) ,
     IF ((mod (i ,10 ) = 1 ) ) stat = alterlist (reply->oii_cache.item[d.seq ].obj ,(i + 9 ) )
     ENDIF
     ,reply->oii_cache.item[d.seq ].obj[i ].identifier_type_cd = oii.identifier_type_cd ,reply->
     oii_cache.item[d.seq ].obj[i ].identifier_type_mean = cv.cdf_meaning ,reply->oii_cache.item[d
     .seq ].obj[i ].value_key = oii.value_key ,reply->oii_cache.item[d.seq ].obj[i ].value = oii
     .value ,reply->oii_cache.item[d.seq ].obj[i ].primary_ind = oii.primary_ind ,reply->oii_cache.
     item[d.seq ].obj[i ].primary_nbr_ind = oii.primary_nbr_ind
    DETAIL
     i = i
    FOOT  d.seq
     reply->oii_cache.item[d.seq ].obj_count = i ,stat = alterlist (reply->oii_cache.item[d.seq ].obj
       ,reply->oii_cache.item[d.seq ].obj_count )
    WITH nocounter
   ;end select
  ELSE
   CALL echo ("THE NEW FORMULARY DATA MODEL IS IN USE" )
   RECORD info_request (
     1 itemlist [* ]
       2 item_id = f8
     1 pharm_type_cd = f8
     1 facility_cd = f8
     1 pharm_loc_cd = f8
     1 pat_loc_cd = f8
     1 encounter_type_cd = f8
     1 package_type_id = f8
     1 med_all_ind = i2
     1 med_pha_flex_ind = i2
     1 med_identifier_ind = i2
     1 med_dispense_ind = i2
     1 med_oe_default_ind = i2
     1 med_def_ind = i2
     1 ther_class_ind = i2
     1 med_product_ind = i2
     1 med_product_prim_ind = i2
     1 med_product_ident_ind = i2
     1 med_cost_ind = i2
     1 misc_object_ind = i2
     1 med_cost_type_cd = f8
     1 med_child_ind = i2
     1 parent_item_id = f8
     1 options_pref = i4
     1 birthdate = dq8
     1 financial_class_cd = f8
     1 funding_source_cd = f8
   )
   RECORD info_reply (
     1 itemlist [* ]
       2 parent_item_id = f8
       2 sequence = i4
       2 active_ind = i2
       2 med_def_flex_sys_id = f8
       2 med_def_flex_syspkg_id = f8
       2 item_id = f8
       2 package_type_id = f8
       2 form_cd = f8
       2 cki = vc
       2 med_type_flag = i2
       2 mdx_gfc_nomen_id = f8
       2 base_issue_factor = f8
       2 given_strength = vc
       2 strength = f8
       2 strength_unit_cd = f8
       2 volume = f8
       2 volume_unit_cd = f8
       2 compound_text_id = f8
       2 mixing_instructions = vc
       2 pkg_qty = f8
       2 pkg_qty_cd = f8
       2 catalog_cd = f8
       2 catalog_cki = vc
       2 synonym_id = f8
       2 oeformatid = f8
       2 orderabletypeflag = i2
       2 catalogdescription = vc
       2 catalogtypecd = f8
       2 mnemonicstr = vc
       2 primarymnemonic = vc
       2 label_description = vc
       2 brand_name = vc
       2 mnemonic = vc
       2 generic_name = vc
       2 profile_desc = vc
       2 cdm = vc
       2 rx_mask = i4
       2 med_oe_defaults_id = f8
       2 med_oe_strength = f8
       2 med_oe_strength_unit_cd = f8
       2 med_oe_volume = f8
       2 med_oe_volume_unit_cd = f8
       2 freetext_dose = vc
       2 frequency_cd = f8
       2 route_cd = f8
       2 prn_ind = i2
       2 infuse_over = f8
       2 infuse_over_cd = f8
       2 duration = f8
       2 duration_unit_cd = f8
       2 stop_type_cd = f8
       2 default_par_doses = i4
       2 max_par_supply = i4
       2 dispense_category_cd = f8
       2 alternate_dispense_category_cd = f8
       2 comment1_id = f8
       2 comment1_type = i2
       2 comment2_id = f8
       2 comment2_type = i2
       2 comment1_text = vc
       2 comment2_text = vc
       2 price_sched_id = f8
       2 nbr_labels = i4
       2 ord_as_synonym_id = f8
       2 rx_qty = f8
       2 daw_cd = f8
       2 sig_codes = vc
       2 med_dispense_id = f8
       2 med_disp_package_type_id = f8
       2 med_disp_strength = f8
       2 med_disp_strength_unit_cd = f8
       2 med_disp_volume = f8
       2 med_disp_volume_unit_cd = f8
       2 legal_status_cd = f8
       2 formulary_status_cd = f8
       2 oe_format_flag = i2
       2 med_filter_ind = i2
       2 continuous_filter_ind = i2
       2 intermittent_filter_ind = i2
       2 divisible_ind = i2
       2 used_as_base_ind = i2
       2 always_dispense_from_flag = i2
       2 floorstock_ind = i2
       2 dispense_qty = f8
       2 dispense_factor = f8
       2 label_ratio = f8
       2 prn_reason_cd = f8
       2 infinite_div_ind = f8
       2 reusable_ind = i2
       2 base_pkg_type_id = f8
       2 base_pkg_qty = f8
       2 base_pkg_uom_cd = f8
       2 medidqual [* ]
         3 identifier_id = f8
         3 identifier_type_cd = f8
         3 value = vc
         3 value_key = vc
         3 sequence = i4
       2 medproductqual [* ]
         3 active_ind = i2
         3 med_product_id = f8
         3 manf_item_id = f8
         3 inner_pkg_type_id = f8
         3 inner_pkg_qty = f8
         3 inner_pkg_uom_cd = f8
         3 bio_equiv_ind = i2
         3 brand_ind = i2
         3 unit_dose_ind = i2
         3 manufacturer_cd = f8
         3 manufacturer_name = vc
         3 label_description = vc
         3 ndc = vc
         3 brand = vc
         3 sequence = i2
         3 awp = f8
         3 awp_factor = f8
         3 formulary_status_cd = f8
         3 item_master_id = f8
         3 base_pkg_type_id = f8
         3 base_pkg_qty = f8
         3 base_pkg_uom_cd = f8
         3 medcostqual [* ]
           4 cost_type_cd = f8
           4 cost = f8
         3 innerndcqual [* ]
           4 inner_ndc = vc
       2 medingredqual [* ]
         3 med_ingred_set_id = f8
         3 sequence = i2
         3 child_item_id = f8
         3 child_med_prod_id = f8
         3 child_pkg_type_id = f8
         3 base_ind = i2
         3 cmpd_qty = f8
         3 default_action_cd = f8
         3 cost1 = f8
         3 cost2 = f8
         3 awp = f8
         3 inc_in_total_ind = i2
         3 normalized_rate_ind = i2
       2 theraclassqual [* ]
         3 alt_sel_category_id = f8
         3 ahfs_code = vc
       2 miscobjectqual [* ]
         3 parent_entity_id = f8
         3 cdf_meaning = vc
       2 firstdoselocqual [* ]
         3 location_cd = f8
       2 pkg_qty_per_pkg = f8
       2 pkg_disp_more_ind = i2
       2 dispcat_flex_ind = i4
       2 pricesch_flex_ind = i4
       2 workflow_cd = f8
       2 cmpd_qty = f8
       2 warning_labels [* ]
         3 label_nbr = i4
         3 label_seq = i2
         3 label_text = vc
         3 label_default_print = i2
         3 label_exception_ind = i2
       2 premix_ind = i2
       2 ord_as_mnemonic = vc
       2 tpn_balance_method_cd = f8
       2 tpn_chloride_pct = f8
       2 tpn_default_ingred_item_id = f8
       2 tpn_fill_method_cd = f8
       2 tpn_include_ions_flag = i2
       2 tpn_overfill_amt = f8
       2 tpn_overfill_unit_cd = f8
       2 tpn_preferred_cation_cd = f8
       2 tpn_product_type_flag = i2
       2 lot_tracking_ind = i2
       2 rate = f8
       2 rate_cd = f8
       2 normalized_rate = f8
       2 normalized_rate_cd = f8
       2 freetext_rate = vc
       2 normalized_rate_ind = i2
       2 ord_detail_opts [* ]
         3 facility_cd = f8
         3 age_range_id = f8
         3 oe_field_meaning_id = f8
         3 restrict_ind = i4
         3 opt_list [* ]
           4 opt_txt = vc
           4 opt_cd = f8
           4 opt_nbr = f8
           4 default_ind = i4
           4 display_seq = i4
       2 poc_charge_flag = i2
       2 inventory_factor = f8
       2 prod_assign_flag = i2
       2 skip_dispense_flag = i2
       2 inv_master_id = f8
       2 grace_period_days = i4
       2 waste_charge_ind = i2
       2 cms_waste_billing_unit_amt = f8
       2 cms_waste_billing_unit_uom_cd = f8
     1 status_data
       2 status = c1
       2 subeventstatus [1 ]
         3 operationname = c25
         3 operationstatus = c1
         3 targetobjectname = c25
         3 targetobjectvalue = vc
   )
   SET dinpatient = eso_get_meaning_by_codeset (4500 ,"INPATIENT" )
   FOR (i = 1 TO reply->oii_cache.item_count )
    SET stat = alterlist (info_request->itemlist ,i )
    SET info_request->itemlist[i ].item_id = reply->oii_cache.item[i ].item_id
   ENDFOR
   SET info_request->pharm_type_cd = dinpatient
   SET info_request->med_identifier_ind = 1
   IF ((irxc1_old_logic = 1 ) )
    SET info_request->med_all_ind = 1
   ENDIF
   EXECUTE rxa_get_item_info WITH replace ("REQUEST" ,"INFO_REQUEST" ) ,
   replace ("REPLY" ,"INFO_REPLY" )
   IF ((info_reply->status_data.status != "S" ) )
    CALL echo (build ("rxa_get_item_info returned a script status of:" ,info_reply->status_data.
      status ) )
   ENDIF
   FOR (i = 1 TO size (info_reply->itemlist ,5 ) )
    SET stat = alterlist (reply->oii_cache.item[i ].obj ,size (info_reply->itemlist[i ].medidqual ,5
      ) )
    IF ((irxc1_old_logic = 1 ) )
     SET reply->oii_cache.item[i ].used_as_base_ind = info_reply->itemlist[i ].used_as_base_ind
     CALL echo (build ("used_as_base_ind: " ,reply->oii_cache.item[i ].used_as_base_ind ) )
    ENDIF
    SET reply->oii_cache.item[i ].obj_count = size (info_reply->itemlist[i ].medidqual ,5 )
    FOR (j = 1 TO size (info_reply->itemlist[i ].medidqual ,5 ) )
     SET reply->oii_cache.item[i ].obj[j ].identifier_type_cd = info_reply->itemlist[i ].medidqual[j
     ].identifier_type_cd
     SET reply->oii_cache.item[i ].obj[j ].identifier_type_mean = eso_get_code_meaning (info_reply->
      itemlist[i ].medidqual[j ].identifier_type_cd )
     SET reply->oii_cache.item[i ].obj[j ].value_key = info_reply->itemlist[i ].medidqual[j ].
     value_key
     SET reply->oii_cache.item[i ].obj[j ].value = info_reply->itemlist[i ].medidqual[j ].value
     IF ((info_reply->itemlist[i ].medidqual[j ].sequence = 1 ) )
      SET reply->oii_cache.item[i ].obj[j ].primary_ind = 1
     ELSE
      SET reply->oii_cache.item[i ].obj[j ].primary_ind = 0
     ENDIF
     SET reply->oii_cache.item[i ].obj[j ].primary_nbr_ind = 0
    ENDFOR
   ENDFOR
   FREE RECORD info_request
   FREE RECORD info_reply
  ENDIF
  SET stat = alterlist (context->cerner.object_identifier_info.item ,reply->oii_cache.item_count )
  FOR (i = 1 TO reply->oii_cache.item_count )
   SET context->cerner.object_identifier_info.item[i ].item_id = reply->oii_cache.item[i ].item_id
   SET stat = alterlist (context->cerner.object_identifier_info.item[i ].object ,reply->oii_cache.
    item[i ].obj_count )
   FOR (j = 1 TO reply->oii_cache.item[i ].obj_count )
    SET context->cerner.object_identifier_info.item[i ].object[j ].identifier_type_cd = reply->
    oii_cache.item[i ].obj[j ].identifier_type_cd
    SET context->cerner.object_identifier_info.item[i ].object[j ].identifier_type_meaning = reply->
    oii_cache.item[i ].obj[j ].identifier_type_mean
    SET context->cerner.object_identifier_info.item[i ].object[j ].value_key = reply->oii_cache.item[
    i ].obj[j ].value_key
    SET context->cerner.object_identifier_info.item[i ].object[j ].value = reply->oii_cache.item[i ].
    obj[j ].value
    SET context->cerner.object_identifier_info.item[i ].object[j ].primary_ind = reply->oii_cache.
    item[i ].obj[j ].primary_ind
    SET context->cerner.object_identifier_info.item[i ].object[j ].primary_nbr_ind = reply->oii_cache
    .item[i ].obj[j ].primary_nbr_ind
   ENDFOR
  ENDFOR
  CALL echo ("Exiting fill_object_identifier_index subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_frequency_cache (dum )
  CALL echo ("Entering fill_frequency_cache subroutine" )
  IF ((validate (btimeintervalflex ,99999999 ) = 99999999 ) )
   DECLARE btimeintervalflex = i4 WITH protect ,noconstant (0 )
  ENDIF
  FREE SET eso_request
  FREE SET eso_reply
  RECORD eso_request (
    1 frequency_list [* ]
      2 frequency_id = f8
  )
  RECORD eso_reply (
    1 frequency_list [* ]
      2 frequency_id = f8
      2 frequency_cd = f8
      2 instance = i4
      2 frequency_type = i4
      2 interval = i4
      2 interval_units = i4
      2 min_event_per_day = i4
      2 max_event_per_day = i4
      2 default_par_val = i4
      2 round_to = i4
      2 first_dose_method = i4
      2 first_dose_range = i4
      2 first_dose_range_units = i4
      2 freq_qualifier = i4
      2 tod_list [* ]
        3 time_of_day = i4
      2 dow_list [* ]
        3 day_of_week = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
  SET stat = alterlist (eso_request->frequency_list ,1 )
  SET eso_request->frequency_list[1 ].frequency_id = reply->frequency_id
  CALL echo ("Executing RX_GET_FREQ_SCHED_BY_ID program" )
  EXECUTE rx_get_freq_sched_by_id
  IF ((eso_reply->frequency_list[1 ].frequency_cd > 0 ) )
   SET reply->freq_cache.frequency_cd = eso_reply->frequency_list[1 ].frequency_cd
  ELSE
   SET reply->freq_cache.frequency_cd = reply->fpoh_cache.frequency_cd
  ENDIF
  IF (btimeintervalflex )
   SET reply->freq_cache.freq_qualifier = eso_reply->frequency_list[1 ].freq_qualifier
  ENDIF
  SET reply->freq_cache.frequency_id = eso_reply->frequency_list[1 ].frequency_id
  SET reply->freq_cache.frequency_type = eso_reply->frequency_list[1 ].frequency_type
  SET reply->freq_cache.interval = eso_reply->frequency_list[1 ].interval
  SET reply->freq_cache.interval_units = eso_reply->frequency_list[1 ].interval_units
  SET dow_list_size = size (eso_reply->frequency_list[1 ].dow_list ,5 )
  DECLARE iidxfound = i4 WITH noconstant (0 )
  DECLARE iidx = i4 WITH noconstant (1 )
  FOR (i = 1 TO dow_list_size )
   FREE SET day
   IF ((eso_reply->frequency_list[1 ].dow_list[i ].day_of_week > 1 ) )
    SET day = (eso_reply->frequency_list[1 ].dow_list[i ].day_of_week - 1 )
   ELSE
    SET day = 7
   ENDIF
   IF ((i = 1 ) )
    SET reply->freq_cache.day_of_week = build (day )
   ELSE
    SET reply->freq_cache.day_of_week = build (reply->freq_cache.day_of_week ,"," ,day )
   ENDIF
   SET iidxfound = 0
   SET iidx = 1
   WHILE ((iidx < i )
   AND (iidxfound = 0 ) )
    IF ((day < reply->freq_cache.dow_list[iidx ].day_of_week ) )
     SET stat = alterlist (reply->freq_cache.dow_list ,i ,(iidx - 1 ) )
     SET iidxfound = 1
    ELSE
     SET iidx = (iidx + 1 )
    ENDIF
   ENDWHILE
   IF ((iidxfound = 0 ) )
    SET stat = alterlist (reply->freq_cache.dow_list ,iidx )
   ENDIF
   SET reply->freq_cache.dow_list[iidx ].day_of_week = day
  ENDFOR
  SET tod_list_size = size (eso_reply->frequency_list[1 ].tod_list ,5 )
  SET stat = alterlist (reply->freq_cache.tod_list ,tod_list_size )
  FOR (i = 1 TO tod_list_size )
   FREE SET hours
   SET hours = cnvtint ((eso_reply->frequency_list[1 ].tod_list[i ].time_of_day / 60 ) )
   FREE SET minutes
   SET minutes = mod (eso_reply->frequency_list[1 ].tod_list[i ].time_of_day ,60 )
   FREE SET time
   SET time = build (format (hours ,"##;P0" ) ,format (minutes ,"##;P0" ) )
   IF ((i = 1 ) )
    SET reply->freq_cache.time_of_day = build (time )
   ELSE
    SET reply->freq_cache.time_of_day = build (reply->freq_cache.time_of_day ,"," ,time )
   ENDIF
   SET reply->freq_cache.tod_list[i ].time_of_day = build (time )
  ENDFOR
  SET stat = fill_pyxis_binary_week (0 )
  FREE SET eso_request
  FREE SET eso_reply
  IF (NOT (btimeintervalflex ) )
   SELECT INTO "nl:"
    fs.frequency_id ,
    fs.freq_qualifier
    FROM (frequency_schedule fs )
    WHERE (fs.frequency_id = reply->freq_cache.frequency_id )
    AND (fs.active_ind = 1 )
    DETAIL
     reply->freq_cache.freq_qualifier = fs.freq_qualifier
    WITH nocounter
   ;end select
  ELSE
   CALL echo ("Time Interval Flex is set.  Not selecting from FREQUENCY_SCHEDULE table." )
  ENDIF
  CALL echo ("Exiting fill_frequency_cache subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_cerner_area_frequency (dum )
  CALL echo ("Entering fill_cerner_area_frequency subroutine" )
  SET stat = set_esoinfo_double ("frequency_id" ,reply->freq_cache.frequency_id )
  SET stat = set_esoinfo_double ("frequency_cd" ,reply->freq_cache.frequency_cd )
  SET stat = set_esoinfo_long ("freq_qualifier" ,reply->freq_cache.freq_qualifier )
  SET stat = set_esoinfo_long ("frequency_type" ,reply->freq_cache.frequency_type )
  SET stat = set_esoinfo_long ("freq_interval" ,reply->freq_cache.interval )
  SET stat = set_esoinfo_long ("freq_interval_units" ,reply->freq_cache.interval_units )
  SET stat = set_esoinfo_string ("freq_day_of_week" ,reply->freq_cache.day_of_week )
  SET stat = set_esoinfo_string ("freq_time_of_day" ,reply->freq_cache.time_of_day )
  SET stat = set_esoinfo_string ("pyxis_freq_binary_week" ,reply->freq_cache.pyxis_binary_week )
  CALL echo ("Exiting fill_cerner_area_frequency subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_provider_address_cache (ord_phys_id1 )
  CALL echo ("Entering fill_provider_address_cache subroutine" )
  SET address_type_code_var = 0.0
  SET stat = uar_get_meaning_by_codeset (212 ,"BUSINESS" ,1 ,address_type_code_var )
  SELECT INTO "nl:"
   ad.street_addr ,
   ad.street_addr2 ,
   ad.city ,
   ad.state ,
   ad.zipcode ,
   ad.country ,
   ad.address_type_cd ,
   ad.street_addr3 ,
   ad.county
   FROM (address ad )
   WHERE (ad.parent_entity_id = ord_phys_id1 )
   AND (ad.parent_entity_name = "PRSNL" )
   AND (ad.address_type_cd = address_type_code_var )
   AND (ad.parent_entity_id > 0 )
   AND (ad.active_ind = 1 )
   AND (ad.beg_effective_dt_tm <= cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) )
   AND (((ad.end_effective_dt_tm > cnvtdatetime (curdate ,(curtime3 + g_desoefftmadj ) ) ) ) OR ((ad
   .end_effective_dt_tm = null ) ))
   ORDER BY ad.address_type_seq
   DETAIL
    reply->provider_address_cache.street = trim (ad.street_addr ,3 ) ,
    reply->provider_address_cache.other_desig = trim (ad.street_addr2 ,3 ) ,
    reply->provider_address_cache.city = trim (ad.city ,3 ) ,
    reply->provider_address_cache.state_prov = trim (ad.state ,3 ) ,
    reply->provider_address_cache.zip_code = trim (ad.zipcode ,3 ) ,
    reply->provider_address_cache.country = trim (ad.country ,3 ) ,
    reply->provider_address_cache.types = eso_format_code (ad.address_type_cd ) ,
    reply->provider_address_cache.other_geo_desig = trim (ad.street_addr3 ,3 ) ,
    reply->provider_address_cache.county = trim (ad.county ,3 )
   WITH nocounter
  ;end select
  CALL echo ("Exiting fill_provider_address_cache subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  read_order_action (order_id1 ,action_sequence1 )
  CALL echo ("Entering read_order_action subroutine" )
  SELECT INTO "nl:"
   oa.action_type_cd
   FROM (order_action oa )
   WHERE (oa.order_id = order_id1 )
   AND (oa.action_sequence <= action_sequence1 )
   DETAIL
    IF ((oa.action_sequence = action_sequence1 ) ) reply->action_type_cd = oa.action_type_cd ,reply->
     oac_cache.action_type_cd = oa.action_type_cd ,reply->oac_cache.eso_action_cd = oa.eso_action_cd
    ,reply->oac_cache.action_personnel_id = oa.action_personnel_id ,reply->oac_cache.effective_dt_tm
     = oa.effective_dt_tm ,reply->oac_cache.order_dt_tm = oa.order_dt_tm ,reply->oac_cache.
     order_locn_cd = oa.order_locn_cd ,reply->oac_cache.order_provider_id = oa.order_provider_id ,
     reply->oac_cache.order_status_cd = oa.order_status_cd ,reply->oac_cache.dept_status_cd = oa
     .dept_status_cd ,reply->oac_cache.action_qualifier_cd = oa.action_qualifier_cd ,reply->oac_cache
     .needs_verify_ind = oa.needs_verify_ind
    ELSEIF (((oa.action_sequence + 1 ) = action_sequence1 ) ) reply->oac_cache.prev_order_status_cd
     = oa.order_status_cd ,reply->oac_cache.prev_dept_status_cd = oa.dept_status_cd
    ENDIF
   WITH nocounter
  ;end select
  CALL echo ("Exiting read_order_action subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_prescription_nbr (rx_nbr_s1 ,order_id1 ,prod_count1 )
  CALL echo ("Entering get_prescription_nbr subroutine" )
  FREE SET rxa_request
  RECORD rxa_request (
    1 qual [* ]
      2 rx_nbr_s = c100
      2 order_id = f8
      2 item_qual [* ]
        3 item_id = f8
  )
  RECORD request (
    1 qual [* ]
      2 rx_nbr_s = c100
      2 order_id = f8
      2 item_qual [* ]
        3 item_id = f8
  )
  RECORD rxa_reply (
    1 qual [* ]
      2 rx_nbr_unformatted = c100
      2 rx_nbr_formatted = c100
      2 prev_rx_nbr_cd = f8
      2 prev_rx_nbr_s = c100
      2 prev_rx_nbr_unformatted = c100
      2 prev_rx_nbr_formatted = c100
      2 wl_list [* ]
        3 label_nbr = c50
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
  SET stat = alterlist (rxa_request->qual ,1 )
  SET rxa_request->qual[1 ].rx_nbr_s = rx_nbr_s1
  SET rxa_request->qual[1 ].order_id = order_id1
  SET stat = alterlist (rxa_request->qual[1 ].item_qual ,prod_count1 )
  SET idx = 1
  FOR (idx = idx TO prod_count1 )
   SET rxa_request->qual[1 ].item_qual[idx ].item_id = reply->fpoh_cache.prod[idx ].item_id
  ENDFOR
  EXECUTE rxa_get_outbound_disp WITH replace (request ,rxa_request ) ,
  replace (reply ,rxa_reply )
  IF ((rxa_reply->status_data.status != "F" ) )
   SET qual_size = size (rxa_reply->qual ,5 )
   SET qual_idx = 1
   FOR (qual_idx = qual_idx TO qual_size )
    SET reply->rxnbr_cache.rx_nbr_unformatted = rxa_reply->qual[qual_idx ].rx_nbr_unformatted
    SET reply->rxnbr_cache.rx_nbr_formatted = rxa_reply->qual[qual_idx ].rx_nbr_formatted
    SET reply->rxnbr_cache.prev_rx_nbr_cd = rxa_reply->qual[qual_idx ].prev_rx_nbr_cd
    SET reply->rxnbr_cache.prev_rx_nbr_s = rxa_reply->qual[qual_idx ].prev_rx_nbr_s
    SET reply->rxnbr_cache.prev_rx_nbr_unformatted = rxa_reply->qual[qual_idx ].
    prev_rx_nbr_unformatted
    SET reply->rxnbr_cache.prev_rx_nbr_formatted = rxa_reply->qual[qual_idx ].prev_rx_nbr_formatted
    SET wl_list_size = size (rxa_reply->qual[qual_idx ].wl_list ,5 )
    SET stat = alterlist (reply->label_cache.label_nbr ,wl_list_size )
    SET wl_list_idx = 1
    FOR (wl_list_idx = wl_list_idx TO wl_list_size )
     SET reply->label_cache.label_nbr[wl_list_idx ].label_nbr = rxa_reply->qual[qual_idx ].wl_list[
     wl_list_idx ].label_nbr
    ENDFOR
   ENDFOR
  ENDIF
  SET stat = set_esoinfo_string ("store_nbr" ,trim (uar_get_code_display (reply->fpoh_cache.rx_nbr_cd
      ) ) )
  SET stat = set_esoinfo_string ("rx_nbr" ,trim (reply->rxnbr_cache.rx_nbr_formatted ) )
  SET stat = set_esoinfo_string ("store_and_rx_nbr_fmtd" ,trim (reply->fpoh_cache.rx_nbr_s ) )
  SET stat = set_esoinfo_string ("store_and_rx_nbr_unfmtd" ,trim (reply->rxnbr_cache.
    rx_nbr_unformatted ) )
  FREE SET rxa_reply
  FREE SET rxa_request
  CALL echo ("Exiting get_prescription_nbr subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_product_info (prod_count1 )
  CALL echo ("Entering get_product_info subroutine" )
  FREE SET rxa_ident_request
  RECORD rxa_ident_request (
    1 qual [* ]
      2 item_id = f8
      2 med_product_id = f8
  )
  RECORD rxa_ident_reply (
    1 item_qual [* ]
      2 qual [* ]
        3 identifier_type_cd = f8
        3 identifier_type_mean = vc
        3 value = vc
        3 value_key = vc
        3 primary_ind = i2
        3 primary_nbr_ind = i2
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
  SET stat = alterlist (rxa_ident_request->qual ,prod_count1 )
  SET idx = 1
  FOR (idx = idx TO prod_count1 )
   SET rxa_ident_request->qual[idx ].item_id = reply->fpoh_cache.prod[idx ].item_id
   SET rxa_ident_request->qual[idx ].med_product_id = reply->fpoh_cache.prod[idx ].med_product_id
  ENDFOR
  EXECUTE rxa_get_outbound_ident WITH replace (request ,rxa_ident_request ) ,
  replace (reply ,rxa_ident_reply )
  IF ((rxa_ident_reply->status_data.status != "F" ) )
   SET stat = alterlist (context->cerner.object_identifier_info.item ,prod_count1 )
   SET item_qual_size = size (rxa_ident_reply->item_qual ,5 )
   SET idx = 1
   FOR (idx = idx TO item_qual_size )
    SET qual_size = size (rxa_ident_reply->item_qual[idx ].qual ,5 )
    SET context->cerner.object_identifier_info.item[idx ].item_id = reply->fpoh_cache.prod[idx ].
    item_id
    SET stat = alterlist (context->cerner.object_identifier_info.item[idx ].object ,size (
      rxa_ident_reply->item_qual[idx ].qual ,5 ) )
    FOR (qdx = 1 TO qual_size )
     SET context->cerner.object_identifier_info.item[idx ].object[qdx ].identifier_type_cd =
     rxa_ident_reply->item_qual[idx ].qual[qdx ].identifier_type_cd
     SET context->cerner.object_identifier_info.item[idx ].object[qdx ].identifier_type_meaning =
     rxa_ident_reply->item_qual[idx ].qual[qdx ].identifier_type_mean
     SET context->cerner.object_identifier_info.item[idx ].object[qdx ].value_key = rxa_ident_reply->
     item_qual[idx ].qual[qdx ].value_key
     SET context->cerner.object_identifier_info.item[idx ].object[qdx ].value = rxa_ident_reply->
     item_qual[idx ].qual[qdx ].value
     SET context->cerner.object_identifier_info.item[idx ].object[qdx ].primary_ind = rxa_ident_reply
     ->item_qual[idx ].qual[qdx ].primary_ind
     SET context->cerner.object_identifier_info.item[idx ].object[qdx ].primary_nbr_ind =
     rxa_ident_reply->item_qual[idx ].qual[qdx ].primary_nbr_ind
    ENDFOR
   ENDFOR
  ENDIF
  FREE SET rxa_ident_reply
  FREE SET rxa_ident_request
  CALL echo ("Exiting get_product_info subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  get_provider_adm_instructions (sig_text_id1 ,alt_sig_lang_text_id1 )
  CALL echo ("Entering get_provider_adm_instructions subroutine" )
  IF ((sig_text_id1 > 0 ) )
   SELECT INTO "nl:"
    lt.long_text
    FROM (long_text lt )
    WHERE (lt.long_text_id = sig_text_id1 )
    DETAIL
     reply->fpoh_cache.text = lt.long_text
    WITH nocounter
   ;end select
  ENDIF
  IF ((alt_sig_lang_text_id1 > 0 ) )
   SELECT INTO "nl:"
    lt.long_text
    FROM (long_text lt )
    WHERE (lt.long_text_id = alt_sig_lang_text_id1 )
    DETAIL
     reply->fpoh_cache.alt_text = lt.long_text
    WITH nocounter
   ;end select
  ENDIF
  CALL echo ("Exiting get_provider_adm_instructions subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  read_resource_group (dispense_sr_cd1 )
  CALL echo ("Entering read_resource_group subroutine" )
  SELECT INTO "nl:"
   rg.parent_service_resource_cd
   FROM (resource_group rg )
   WHERE (rg.child_service_resource_cd = dispense_sr_cd1 )
   DETAIL
    reply->rg_cache.parent_sr_res_cd = rg.parent_service_resource_cd
   WITH nocounter
  ;end select
  CALL echo ("Exiting read_resource_group subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_service_resource_cache (dispense_sr_cd1 )
  CALL echo ("Entering fill_service_resource_cache subroutine" )
  SELECT INTO "nl:"
   sr.*
   FROM (service_resource sr )
   WHERE (sr.service_resource_cd = dispense_sr_cd1 )
   DETAIL
    reply->lg_cache.nurs_unit_cd = sr.location_cd ,
    reply->lg_cache.loc_type_cd = sr.location_cd
   WITH nocounter
  ;end select
  SELECT INTO "nl:"
   lg.*
   FROM (location_group lg )
   WHERE (lg.child_loc_cd = reply->lg_cache.nurs_unit_cd )
   DETAIL
    reply->lg_cache.building_cd = lg.parent_loc_cd
   WITH nocounter
  ;end select
  SELECT INTO "nl:"
   lg.*
   FROM (location_group lg )
   WHERE (lg.child_loc_cd = reply->lg_cache.building_cd )
   DETAIL
    reply->lg_cache.facility_cd = lg.parent_loc_cd
   WITH nocounter
  ;end select
  CALL echo ("Exiting fill_service_resource_cache subroutine" )
  RETURN (0 )
 END ;Subroutine
 SUBROUTINE  fill_pyxis_binary_week (dum )
  DECLARE sun = c1 WITH private ,noconstant ("0" )
  DECLARE mon = c1 WITH private ,noconstant ("0" )
  DECLARE tue = c1 WITH private ,noconstant ("0" )
  DECLARE wed = c1 WITH private ,noconstant ("0" )
  DECLARE thu = c1 WITH private ,noconstant ("0" )
  DECLARE fri = c1 WITH private ,noconstant ("0" )
  DECLARE sat = c1 WITH private ,noconstant ("0" )
  DECLARE every_other_day = c1 WITH private ,noconstant ("0" )
  IF ((findstring ("7" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET sun = "1"
  ENDIF
  IF ((findstring ("1" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET mon = "1"
  ENDIF
  IF ((findstring ("2" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET tue = "1"
  ENDIF
  IF ((findstring ("3" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET wed = "1"
  ENDIF
  IF ((findstring ("4" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET thu = "1"
  ENDIF
  IF ((findstring ("5" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET fri = "1"
  ENDIF
  IF ((findstring ("6" ,reply->freq_cache.day_of_week ) > 0 ) )
   SET sat = "1"
  ENDIF
  SET reply->freq_cache.pyxis_binary_week = build (sun ,mon ,tue ,wed ,thu ,fri ,sat ,
   every_other_day )
 END ;Subroutine
 SET no_fill_note = 0
 CALL echo (build ("routine_args = " ,request->esoinfo.scriptcontrolargs ) )
 SET no_fill_note = findstring ("NO_FILL_NOTE" ,request->esoinfo.scriptcontrolargs )
 CALL echo (build ("no_fill_note = " ,no_fill_note ) )
 DECLARE shtpn_cpmd_ind = i2 WITH public ,noconstant (0 )
 DECLARE shingred_ind = i2 WITH public ,noconstant (0 )
 DECLARE shdose_msg_ind = i2 WITH public ,noconstant (0 )
 DECLARE shadmin_count = i2 WITH public ,noconstant (0 )
 DECLARE shadmin_index = i2 WITH public ,noconstant (0 )
 DECLARE shiv_set_size = i2 WITH public ,noconstant (0 )
 SET shtpn_cpmd_ind = get_esoinfo_long ("eso_tpn_cpmd_ind" )
 SET shingred_ind = get_esoinfo_long ("eso_ingred_ind" )
 SET shdose_msg_ind = get_esoinfo_long ("eso_dose_msg_ind" )
 SET shadmin_count = get_esoinfo_long ("admin_cnt" )
 SET shadmin_index = get_esoinfo_long ("admin_index" )
 SET shiv_set_size = get_esoinfo_long ("iv_set" )
 CALL echo ("<------------------------------------------------------>" )
 CALL echo (build ("shTpn_cpmd_ind   = " ,shtpn_cpmd_ind ) )
 CALL echo (build ("shIngred_ind     = " ,shingred_ind ) )
 CALL echo (build ("shDose_msg_ind   = " ,shdose_msg_ind ) )
 CALL echo (build ("shAdmin_Count    = " ,shadmin_count ) )
 CALL echo (build ("shAdmin_Index    = " ,shadmin_index ) )
 CALL echo (build ("shIv_set_size    = " ,shiv_set_size ) )
 CALL echo ("<------------------------------------------------------>" )
 DECLARE ml_cd = f8 WITH public ,constant (uar_get_code_by_cki ("CKI.CODEVALUE!3780" ) )
 DECLARE stat = f8 WITH protect ,noconstant (0.0 )
 DECLARE cyc_from_dt_tm = vc WITH private ,noconstant ("" )
 SET reply->status_data.status = "S"
 CALL echo (build ("queue_id=" ,get_esoinfo_double ("queue_id" ) ) )
 CALL echo (build ("trigger_id=" ,get_esoinfo_double ("trigger_id" ) ) )
 CALL echo (build ("class=" ,get_esoinfo_string ("cqm_class" ) ) )
 CALL echo (build ("type=" ,get_esoinfo_string ("cqm_type" ) ) )
 CALL echo (build ("subtype=" ,get_esoinfo_string ("cqm_subtype" ) ) )
 IF ((shdose_msg_ind = 0 )
 AND (shiv_set_size > 0 ) )
  CALL echo ("Skip transaction: For an IVset , eso_dose_msg_ind must be set to 1" )
  SET reply->status_data.status = "K"
  SET reply->status_data.subeventstatus[1 ].operationname = "CERNER"
  SET reply->status_data.subeventstatus[1 ].operationstatus = "K"
  SET reply->status_data.subeventstatus[1 ].targetobjectname = "eso_dose_msg_ind"
  SET reply->status_data.subeventstatus[1 ].targetobjectvalue = "Must be set to 1 for an IVset"
  GO TO end_script
 ENDIF
 SET reply->disp_event_type_cd = get_esoinfo_double ("disp_event_type_cd" )
 CALL echo (build ("reply->disp_event_type_cd=" ,reply->disp_event_type_cd ) )
 SET reply->run_id = get_esoinfo_double ("run_id" )
 CALL echo (build ("reply->run_id=" ,reply->run_id ) )
 IF ((reply->run_id <= 0 ) )
  SET reply->status_data.status = "F"
  SET reply->status_data.subeventstatus[1 ].operationname = "CERNER"
  SET reply->status_data.subeventstatus[1 ].operationstatus = "F"
  SET reply->status_data.subeventstatus[1 ].targetobjectname = "RUN_ID"
  SET reply->status_data.subeventstatus[1 ].targetobjectvalue = "INVALID"
  GO TO end_script
 ENDIF
 SET reply->encounter_id = get_esoinfo_double ("encntr_id" )
 CALL echo (build ("reply->encounter_id=" ,reply->encounter_id ) )
 SET reply->order_id = get_esoinfo_double ("order_id" )
 CALL echo (build ("reply->order_id=" ,reply->order_id ) )
 IF ((reply->order_id <= 0 ) )
  SET reply->status_data.status = "F"
  SET reply->status_data.subeventstatus[1 ].operationname = "CERNER"
  SET reply->status_data.subeventstatus[1 ].operationstatus = "F"
  SET reply->status_data.subeventstatus[1 ].targetobjectname = "ORDER_ID"
  SET reply->status_data.subeventstatus[1 ].targetobjectvalue = "INVALID"
  GO TO end_script
 ENDIF
 SET reply->dispense_hx_id = get_esoinfo_double ("dispense_hx_id" )
 CALL echo (build ("reply->dispense_hx_id=" ,reply->dispense_hx_id ) )
 SET reply->frequency_id = get_esoinfo_double ("frequency_id" )
 CALL echo (build ("reply->frequency_id=" ,reply->frequency_id ) )
 IF ((reply->frequency_id < 0 ) )
  SET reply->status_data.status = "F"
  SET reply->status_data.subeventstatus[1 ].operationname = "CERNER"
  SET reply->status_data.subeventstatus[1 ].operationstatus = "F"
  SET reply->status_data.subeventstatus[1 ].targetobjectname = "FREQUENCY_ID"
  SET reply->status_data.subeventstatus[1 ].targetobjectvalue = "INVALID"
 ENDIF
 SET reply->action_sequence = cnvtint (get_esoinfo_double ("action_sequence" ) )
 CALL echo (build ("reply->action_sequence=" ,reply->action_sequence ) )
 SET stat = fill_orders_cache (reply->order_id )
 SET stat = fill_print_hx_cache (reply->run_id )
 SET stat = set_esoinfo_double ("fill_hx_id" ,reply->fph_cache.fill_hx_id )
 CALL echo (build ("cyc_from_dt_tm = " ,hl7_format_datetime (reply->fph_cache.cyc_from_dt_tm ,
    hl7_dt_tm ) ) )
 SET cyc_from_dt_tm = hl7_format_datetime (reply->fph_cache.cyc_from_dt_tm ,hl7_dt_tm )
 SET stat = set_esoinfo_string ("cyc_from_dt_tm" ,cyc_from_dt_tm )
 SET stat = fill_print_ord_hx_cache (reply->run_id ,reply->order_id )
 SET stat = set_esoinfo_long ("compound_ind" ,reply->fpoh_cache.compound_ind )
 SET stat = set_esoinfo_long ("ord_type" ,reply->fpoh_cache.ord_type )
 SET stat = fill_dispense_hx_cache (reply->dispense_hx_id )
 SET stat = fill_object_identifier_index_cache (0 )
 SET stat = fill_cerner_area_frequency (0 )
 IF ((reply->frequency_id <= 0 ) )
  SET reply->freq_cache.frequency_id = reply->frequency_id
  SET reply->freq_cache.frequency_cd = reply->fpoh_cache.frequency_cd
 ELSE
  SET stat = fill_frequency_cache (0 )
 ENDIF
 SET stat = fill_cerner_area_frequency (0 )
 CALL echo ("About to call fill_pharmacy_note_cache" )
 SET stat = fill_pharmacy_note_cache (reply->order_id ,reply->action_sequence )
 SET stat = fill_order_ingredient_cache (reply->order_id ,reply->action_sequence )
 SET stat = fill_order_detail_cache (reply->order_id ,reply->action_sequence )
 SET stat = alterlist (context->rde_group ,1 )
 SET rde_grp_idx = 1
 CALL echo ("<---------- Begin ORC Segment ---------->" )
 CALL echo ("ORC;1" )
 SET context->rde_group[rde_grp_idx ].orc.order_ctrl = eso_format_code (reply->disp_event_type_cd )
 CALL echo ("ORC;2" )
 SET stat = alterlist (context->rde_group[rde_grp_idx ].orc.placer_ord_nbr ,1 )
 SET context->rde_group[rde_grp_idx ].orc.placer_ord_nbr[1 ].entity_id = trim (cnvtstring (reply->
   order_id ) )
 SET context->rde_group[rde_grp_idx ].orc.placer_ord_nbr[1 ].name_id = "HNAM_ORDERID"
 CALL echo ("ORC;3" )
 SET stat = alterlist (context->rde_group[rde_grp_idx ].orc.filler_ord_nbr ,1 )
 IF ((shdose_msg_ind > 0 ) )
  SET context->rde_group[rde_grp_idx ].orc.filler_ord_nbr[1 ].entity_id = concat (trim (cnvtstring (
     reply->dispense_hx_id ) ) ,"." ,trim (cnvtstring (shadmin_index ) ) )
  SET context->rde_group[rde_grp_idx ].orc.filler_ord_nbr[1 ].name_id = "HNAM_DISPENSEID"
 ELSE
  SET context->rde_group[rde_grp_idx ].orc.filler_ord_nbr[1 ].entity_id = trim (cnvtstring (reply->
    dispense_hx_id ) )
  SET context->rde_group[rde_grp_idx ].orc.filler_ord_nbr[1 ].name_id = "HNAM_DISPENSEID"
 ENDIF
 CALL echo ("ORC;4" )
 SET context->rde_group[rde_grp_idx ].orc.placer_group_nbr.entity_id = trim (cnvtstring (reply->
   run_id ) )
 SET context->rde_group[rde_grp_idx ].orc.placer_group_nbr.name_id = "HNAM_RUNID"
 CALL echo ("ORC;5" )
 SET context->rde_group[rde_grp_idx ].orc.order_stat = eso_format_code (reply->o_cache.
  order_status_cd )
 CALL echo ("ORC;7" )
 SET stat = alterlist (context->rde_group[rde_grp_idx ].orc.order_quant_timing ,1 )
 SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].interval.frequency =
 eso_format_code (reply->freq_cache.frequency_cd )
 IF ((reply->freq_cache.freq_qualifier = 16 ) )
  SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].interval.time_interval = trim (
   reply->freq_cache.time_of_day )
 ENDIF
 IF ((shdose_msg_ind > 0 ) )
  SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].start_dt_tm = hl7_format_datetime (
   reply->fpoh_cache.admin[1 ].admin_dt_tm ,hl7_dt_tm )
 ELSE
  SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].start_dt_tm = hl7_format_datetime (
   reply->fpoh_cache.order_start_dt_tm ,hl7_dt_tm )
 ENDIF
 SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].end_dt_tm = hl7_format_datetime (
  reply->fpoh_cache.order_stop_dt_tm ,hl7_dt_tm )
 IF ((reply->fpoh_cache.prn_ind = 1 ) )
  SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].condition = "PRN"
 ENDIF
 SET context->rde_group[rde_grp_idx ].orc.order_quant_timing[1 ].text = reply->fpoh_cache.ord_desc
 CALL echo ("ORC;9" )
 SET context->rde_group[rde_grp_idx ].orc.trans_dt_tm = hl7_format_datetime (reply->fpoh_cache.
  updt_dt_tm ,hl7_dt_tm )
 CALL echo ("ORC;10" )
 IF ((reply->fpoh_cache.entry_id > 0 ) )
  SET stat = alterlist (context->rde_group[rde_grp_idx ].orc.entered_by ,1 )
  SET context->rde_group[rde_grp_idx ].orc.entered_by.id_nbr = eso_format_prsnl_id_enctr_ctx (
   "ORM_ENTERBY" ,"ALL_PRSNL" ,reply->encounter_id ,"ORC_10_1" ,reply->fpoh_cache.entry_id ,0 ,"XCN"
   ,1 )
 ENDIF
 CALL echo ("ORC;11" )
 IF ((reply->fpoh_cache.rph_id > 0 ) )
  SET stat = alterlist (context->rde_group[rde_grp_idx ].orc.verified_by ,1 )
  SET context->rde_group[rde_grp_idx ].orc.verified_by.id_nbr = eso_format_prsnl_id_enctr_ctx (
   "ORM_VERIFYBY" ,"ALL_PRSNL" ,reply->encounter_id ,"ORC_11_1" ,reply->fpoh_cache.rph_id ,0 ,"XCN" ,
   1 )
 ENDIF
 CALL echo ("ORC;12" )
 IF ((reply->fpoh_cache.ord_phys_id > 0 ) )
  SET stat = alterlist (context->rde_group[rde_grp_idx ].orc.ord_provider ,1 )
  SET context->rde_group[rde_grp_idx ].orc.ord_provider.id_nbr = eso_format_prsnl_id_enctr_ctx (
   "ORM_PROVIDER" ,"ALL_PRSNL" ,reply->encounter_id ,"ORC_12_1" ,reply->fpoh_cache.ord_phys_id ,0 ,
   "XCN" ,1 )
 ENDIF
 CALL echo ("ORC;16" )
 SET context->rde_group[rde_grp_idx ].orc.ord_ctrl_rsn_cd.identifier = eso_format_code (reply->
  disp_event_type_cd )
 SET context->rde_group[rde_grp_idx ].orc.ord_ctrl_rsn_cd.text = eso_get_code_display (reply->
  disp_event_type_cd )
 CALL echo ("<---------- End ORC Segment ---------->" )
 SET rxe_grp_idx = 1
 IF ((shingred_ind > 0 ) )
  SET reply->fpoh_cache.prod_count = 1
 ENDIF
 SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group ,reply->fpoh_cache.prod_count )
 FREE SET prod_idx
 SET prod_idx = 1
 DECLARE disp_qty = f8 WITH private ,noconstant (0.0 )
 DECLARE pkg_per_disp = f8 WITH private ,noconstant (0.0 )
 DECLARE ipackages = i4 WITH private ,noconstant (0 )
 DECLARE ddoses = f8 WITH private ,noconstant (0.0 )
 IF ((reply->fpoh_cache.prod_count > 0 ) )
  SET disp_qty = (reply->fpoh_cache.fill_quantity * reply->fpoh_cache.prod[prod_idx ].dose_quantity
  )
  SET pkg_per_disp = (disp_qty / reply->fpoh_cache.pkg_quantity )
  SET ipackages = floor (pkg_per_disp )
  SET ddoses = (disp_qty - (ipackages * reply->fpoh_cache.pkg_quantity ) )
  IF ((ddoses < 0.001 ) )
   SET ddoses = 0.0
  ENDIF
  SET stat = set_esoinfo_long ("nbr_of_packages" ,ipackages )
  SET stat = set_esoinfo_double ("nbr_of_doses" ,ddoses )
 ENDIF
 FOR (prod_idx = 1 TO reply->fpoh_cache.prod_count )
  IF ((((reply->fpoh_cache.compound_ind = 0 ) ) OR ((reply->fpoh_cache.compound_ind = 1 )
  AND (prod_idx = 1 ) )) )
   CALL echo ("<---------- Begin RXE Segment ---------->" )
   CALL echo ("RXE;1" )
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.interval.frequency
   = eso_format_code (reply->freq_cache.frequency_cd )
   IF ((reply->freq_cache.freq_qualifier = 16 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.interval.
    time_interval = trim (reply->freq_cache.time_of_day )
   ENDIF
   IF ((shdose_msg_ind > 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.start_dt_tm =
    hl7_format_datetime (reply->fpoh_cache.admin[1 ].admin_dt_tm ,hl7_dt_tm )
   ELSE
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.start_dt_tm =
    hl7_format_datetime (reply->fpoh_cache.order_start_dt_tm ,hl7_dt_tm )
   ENDIF
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.end_dt_tm =
   hl7_format_datetime (reply->fpoh_cache.order_stop_dt_tm ,hl7_dt_tm )
   IF ((reply->fpoh_cache.prn_ind = 1 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.condition = "PRN"
   ENDIF
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.quant_timing.text = reply->
   fpoh_cache.ord_desc
   CALL echo ("RXE;2" )
   IF ((shingred_ind > 0 ) )
    SET reply->o_cache.med_order_type_meaning = eso_get_code_meaning (reply->o_cache.
     med_order_type_cd )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_code.identifier = build (
     "RXCUST_" ,trim (reply->o_cache.med_order_type_meaning ) )
    CALL echo (build ("Give Code = " ,context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.
      give_code.identifier ) )
   ELSE
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_code.identifier =
    eso_format_item_with_method ("IDENTIFIER_TYPE_CD" ,"VALUE_KEY" ,reply->fpoh_cache.prod[prod_idx ]
     .item_id ,prod_idx ,"CE" ,"coding_system" )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_code.text =
    eso_format_item ("DESC" ,"VALUE" ,reply->fpoh_cache.prod[prod_idx ].item_id ,prod_idx )
   ENDIF
   CALL echo ("RXE;3" )
   IF ((shingred_ind = 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.min_give_amt =
    eso_trim_zeros_sig_dig (reply->fpoh_cache.prod[prod_idx ].dose_quantity ,6 )
   ELSE
    IF ((findstring ("VOL_RXE3" ,request->esoinfo.scriptcontrolargs ) > 0 )
    AND (reply->fpoh_cache.tot_volume > 0 ) )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.min_give_amt =
     eso_trim_zeros_sig_dig (reply->fpoh_cache.tot_volume ,6 )
    ENDIF
   ENDIF
   CALL echo ("RXE;4" )
   IF ((reply->fpoh_cache.tot_volume > 0 )
   AND (findstring ("VOL_RXE3" ,request->esoinfo.scriptcontrolargs ) <= 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.max_give_amt =
    eso_trim_zeros_sig_dig (reply->fpoh_cache.tot_volume ,6 )
   ENDIF
   CALL echo ("RXE;5" )
   IF ((reply->fpoh_cache.tot_volume > 0 )
   AND (((findstring ("VOL_RXE3" ,request->esoinfo.scriptcontrolargs ) > 0 ) ) OR ((shingred_ind = 1
   ) )) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_units.identifier =
    eso_format_code (ml_cd )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_units.text =
    eso_get_code_display (ml_cd )
   ELSE
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_units.identifier =
    eso_format_code (reply->fpoh_cache.prod[prod_idx ].dose_quantity_unit_cd )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_units.text =
    eso_get_code_display (reply->fpoh_cache.prod[prod_idx ].dose_quantity_unit_cd )
   ENDIF
   IF ((shingred_ind = 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_units.alt_text = reply->
    fpoh_cache.prod[prod_idx ].freetext_dose
   ENDIF
   CALL echo ("RXE;6" )
   IF ((shingred_ind = 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_dosage_form.identifier =
    eso_format_code (reply->fpoh_cache.prod[prod_idx ].form_cd )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_dosage_form.text =
    eso_get_code_display (reply->fpoh_cache.prod[prod_idx ].form_cd )
   ELSEIF ((reply->fpoh_cache.dose_form_cd > 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_dosage_form.identifier =
    eso_format_code (reply->fpoh_cache.dose_form_cd )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_dosage_form.text =
    eso_get_code_display (reply->fpoh_cache.dose_form_cd )
   ENDIF
   CALL echo ("RXE;7" )
   FREE SET pn_idx
   SET pn_idx = 0
   FREE SET pn_idx2
   SET pn_idx2 = 0
   FREE SET rxe7_idx
   SET rxe7_idx = 0
   FREE SET medadmininst_index
   SET medadmininst_index = 0
   FREE SET admin_notes2_index
   SET admin_notes2_index = 0
   FREE SET marnote_index
   SET marnote_index = 0
   FREE SET phafill_index
   SET phafill_index = 0
   FREE SET bold_pharm
   SET bold_pharm = false
   FOR (pn_idx = 1 TO reply->pn_cache.note_count )
    IF ((reply->pn_cache.note[pn_idx ].comment_type_meaning IN ("MEDADMININST" ) ) )
     SET medadmininst_index = pn_idx
    ELSEIF ((reply->pn_cache.note[pn_idx ].comment_type_meaning IN ("ADMIN NOTES2" ) ) )
     SET admin_notes2_index = pn_idx
    ELSEIF ((reply->pn_cache.note[pn_idx ].comment_type_meaning IN ("MARNOTE" ) ) )
     SET marnote_index = pn_idx
     CALL echo ("mar note index set" )
    ELSEIF ((reply->pn_cache.note[pn_idx ].comment_type_meaning IN ("PHAFILL" ) ) )
     SET phafill_index = pn_idx
     CALL echo ("fill note inex set" )
    ENDIF
   ENDFOR
   IF ((medadmininst_index > 0 ) )
    SET pn_idx = medadmininst_index
    FOR (j = 1 TO reply->pn_cache.note[pn_idx ].comment_count )
     IF ((((btest (reply->pn_cache.note[pn_idx ].comment[j ].where_to_print ,2 ) = 1 ) ) OR ((btest (
      reply->pn_cache.note[pn_idx ].comment[j ].where_to_print ,1 ) = 1 ) )) )
      SET rxe7_idx = (rxe7_idx + 1 )
      SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.
       prov_adm_instr ,rxe7_idx )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.prov_adm_instr[rxe7_idx ].text
       = reply->pn_cache.note[pn_idx ].comment[j ].comment
     ENDIF
    ENDFOR
   ENDIF
   IF ((admin_notes2_index > 0 ) )
    SET pn_idx = admin_notes2_index
    FOR (j = 1 TO reply->pn_cache.note[pn_idx ].comment_count )
     IF ((((btest (reply->pn_cache.note[pn_idx ].comment[j ].where_to_print ,2 ) = 1 ) ) OR ((btest (
      reply->pn_cache.note[pn_idx ].comment[j ].where_to_print ,1 ) = 1 ) )) )
      SET rxe7_idx = (rxe7_idx + 1 )
      SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.
       prov_adm_instr ,rxe7_idx )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.prov_adm_instr[rxe7_idx ].text
       = reply->pn_cache.note[pn_idx ].comment[j ].comment
     ENDIF
    ENDFOR
   ENDIF
   IF ((marnote_index > 0 )
   AND (phafill_index > 0 ) )
    CALL echo ("both mar and fill are valued" )
    SET pn_idx = marnote_index
    SET pn_idx2 = phafill_index
    SET bdiff = 1
    CALL echo ("checking if comments are the same" )
    SET mar_size = size (reply->pn_cache.note[pn_idx ].comment ,5 )
    SET pha_size = size (reply->pn_cache.note[pn_idx2 ].comment ,5 )
    IF ((mar_size = pha_size ) )
     FOR (j = 1 TO mar_size )
      IF ((reply->pn_cache.note[pn_idx ].comment[j ].comment != reply->pn_cache.note[pn_idx2 ].
      comment[j ].comment ) )
       SET bdiff = 0
      ENDIF
     ENDFOR
     IF ((bdiff > 0 ) )
      FOR (j = 1 TO mar_size )
       SET rxe7_idx = (rxe7_idx + 1 )
       SET bold_pharm = true
       SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.
        prov_adm_instr ,rxe7_idx )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.prov_adm_instr[rxe7_idx ].
       text = reply->pn_cache.note[pn_idx ].comment[j ].comment
      ENDFOR
     ENDIF
    ENDIF
   ENDIF
   IF ((marnote_index > 0 ) )
    IF ((bold_pharm = false ) )
     SET pn_idx = marnote_index
     CALL echo ("Process_mar note" )
     FOR (j = 1 TO reply->pn_cache.note[pn_idx ].comment_count )
      SET rxe7_idx = (rxe7_idx + 1 )
      SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.
       prov_adm_instr ,rxe7_idx )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.prov_adm_instr[rxe7_idx ].text
       = reply->pn_cache.note[pn_idx ].comment[j ].comment
      CALL echo (build ("we set rxe7.2 with -->" ,reply->pn_cache.note[pn_idx ].comment[j ].comment
        ) )
     ENDFOR
    ENDIF
   ENDIF
   IF ((phafill_index > 0 )
   AND (no_fill_note = 0 ) )
    IF ((bold_pharm = false ) )
     SET pn_idx2 = phafill_index
     CALL echo ("Process FILL note" )
     FOR (j = 1 TO reply->pn_cache.note[pn_idx2 ].comment_count )
      SET rxe7_idx = (rxe7_idx + 1 )
      SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.
       prov_adm_instr ,rxe7_idx )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.prov_adm_instr[rxe7_idx ].text
       = reply->pn_cache.note[pn_idx2 ].comment[j ].comment
      CALL echo (build ("we set rxe7.2 with -->" ,reply->pn_cache.note[pn_idx2 ].comment[j ].comment
        ) )
     ENDFOR
    ENDIF
   ENDIF
   FREE SET pn_idx
   FREE SET rxe7_idx
   FREE SET medadmininst_index
   FREE SET admin_notes2_index
   FREE SET phafill_index
   FREE SET marnote_index
   CALL echo ("RXE;10" )
   IF ((shingred_ind > 0 ) )
    IF ((reply->od_cache.tot_ingr_vol_w_overfill > 0 ) )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_amt =
     eso_trim_zeros_sig_dig (reply->od_cache.tot_ingr_vol_w_overfill ,6 )
    ELSE
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_amt =
     eso_trim_zeros_sig_dig (reply->fpoh_cache.tot_volume ,6 )
    ENDIF
   ELSE
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_amt =
    eso_trim_zeros_sig_dig ((reply->fpoh_cache.fill_quantity * reply->fpoh_cache.prod[prod_idx ].
     dose_quantity ) ,6 )
   ENDIF
   CALL echo ("RXE;11" )
   IF ((shingred_ind > 0 ) )
    IF ((reply->od_cache.tot_ingr_vol_w_overfill > 0 ) )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_units.identifier =
     eso_format_code (ml_cd )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_units.text =
     eso_get_code_display (ml_cd )
    ENDIF
   ELSE
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_units.identifier =
    eso_format_code (reply->fpoh_cache.prod[prod_idx ].dose_quantity_unit_cd )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.disp_units.text =
    eso_get_code_display (reply->fpoh_cache.prod[prod_idx ].dose_quantity_unit_cd )
   ENDIF
   CALL echo ("RXE;14" )
   IF ((reply->fpoh_cache.rph_id > 0 ) )
    SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.pharm_ver_id ,
     1 )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.pharm_ver_id.id_nbr =
    eso_format_prsnl_id_enctr_ctx ("ORM_VERIFYBY" ,"ALL_PRSNL" ,reply->encounter_id ,"RXE_14_1" ,
     reply->fpoh_cache.rph_id ,0 ,"XCN" ,1 )
   ENDIF
   CALL echo ("RXE;15" )
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.prescription_nbr = trim (
    cnvtstring (reply->order_id ) )
   CALL echo ("RXE;18" )
   IF ((eso_get_code_meaning (reply->fph_cache.run_type_cd ) = "FILL" ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.recent_refill_or_disp =
    hl7_format_datetime (reply->fph_cache.cyc_from_dt_tm ,hl7_dt_tm )
   ELSE
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.recent_refill_or_disp =
    hl7_format_datetime (cnvtdatetime (curdate ,curtime3 ) ,hl7_dt_tm )
   ENDIF
   CALL echo ("RXE;22" )
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_per = trim (reply->
    fpoh_cache.infuse_encoded )
   CALL echo ("RXE;23" )
   IF ((reply->fpoh_cache.rate > 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_rate_amt =
    eso_trim_zeros_sig_dig (reply->fpoh_cache.rate ,6 )
   ENDIF
   CALL echo ("RXE;24" )
   IF ((reply->fpoh_cache.rate > 0 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_rate_units.identifier =
    eso_format_code (get_esoinfo_double ("mlhr_cd" ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_rate_units.text =
    eso_get_code_display (get_esoinfo_double ("mlhr_cd" ) )
   ELSEIF ((reply->fpoh_cache.titrate_ind = 1 ) )
    SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxe.give_rate_units.text =
    "TITRATE"
   ENDIF
   CALL echo ("<---------- End RXE Segment ---------->" )
   FREE SET pn_idx
   SET pn_idx = 0
   FREE SET nte_idx
   SET nte_idx = 0
   CALL echo ("About to add the comments to NTE" )
   FOR (pn_idx = 1 TO reply->pn_cache.note_count )
    CALL echo (build ("The comment type is -->" ,reply->pn_cache.note[pn_idx ].comment_type_meaning
      ) )
    IF ((reply->pn_cache.note[pn_idx ].comment_type_meaning = "ORD COMMENT" ) )
     SET nte_idx = (nte_idx + 1 )
     SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].nte ,nte_idx )
     CALL echo ("<---------- Begin NTE Segment ---------->" )
     CALL echo ("NTE;1" )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].nte[nte_idx ].set_id = trim (
      cnvtstring (nte_idx ) )
     CALL echo ("NTE;2" )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].nte[nte_idx ].src_of_comment =
     eso_format_code_blank (reply->pn_cache.note[pn_idx ].comment_type_cd )
     SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].nte[nte_idx ].
      comment ,reply->pn_cache.note[pn_idx ].comment_count )
     FOR (j = 1 TO reply->pn_cache.note[pn_idx ].comment_count )
      CALL echo ("NTE;3" )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].nte[nte_idx ].comment[j ].comment
      = reply->pn_cache.note[pn_idx ].comment[j ].comment
      CALL echo (build ("comment is>" ,context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].nte[
        nte_idx ].comment[j ].comment ) )
     ENDFOR
     CALL echo ("<---------- End NTE Segment ---------->" )
    ENDIF
   ENDFOR
   SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxr ,1 )
   SET rxr_idx = 1
   CALL echo ("<---------- Begin RXR Segment ---------->" )
   CALL echo ("RXR;1" )
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxr[rxr_idx ].route.identifier =
   eso_format_code (reply->fpoh_cache.route_cd )
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxr[rxr_idx ].route.text =
   eso_get_code_display (reply->fpoh_cache.route_cd )
   CALL echo ("RXR;4" )
   SET temp_method = "MED"
   IF ((reply->fpoh_cache.ord_type = 1 ) )
    SET temp_method = "MED"
   ELSEIF ((reply->fpoh_cache.ord_type = 2 ) )
    SET temp_method = "IV"
   ELSEIF ((reply->fpoh_cache.ord_type = 3 ) )
    SET temp_method = "IVP"
   ENDIF
   SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxr[rxr_idx ].adm_method.identifier
   = temp_method
   CALL echo ("<---------- End RXR Segment ---------->" )
   IF (NOT ((reply->fpoh_cache.compound_ind = 1 )
   AND (prod_idx = 1 ) ) )
    IF ((shingred_ind > 0 ) )
     CALL echo ("<---------- Begin RXC Segment ---------->" )
     SET prod_size = size (reply->fpoh_cache.prod ,5 )
     SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc ,prod_size )
     FREE SET rxc_idx
     SET rxc_idx = 1
     FOR (j = 1 TO prod_size )
      FOR (i = 1 TO reply->oig_cache.ing_count )
       IF ((reply->oig_cache.ing[i ].comp_sequence = reply->fpoh_cache.prod[j ].ingred_seq ) )
        CALL echo ("RXC;1" )
        CASE (reply->oig_cache.ing[i ].ingredient_type_flag )
         OF 0 :
          CALL echo (
           "ingredient_type_flag = 0.  There was a database build problem - incorrect rx_mask" )
         OF 1 :
          CALL echo ("ingredient_type_flag = 1.  This should not occur on multi-ingredient orders" )
         OF 2 :
          CALL echo ("ingredient_type_flag = 2.  This is a Base" )
          SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].
          rx_component_type = "B"
         OF 3 :
          CALL echo ("ingredient_type_flag = 3.  This is an Additive" )
          SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].
          rx_component_type = "A"
         OF 4 :
          CALL echo (
           "ingredient_type_flag = 4.  This is a compound parent.  This is not currently supported"
           )
         OF 5 :
          CALL echo (
           "ingredient_type_flag = 5.  This is a compound child.  This is not currently supported" )
        ENDCASE
        CALL echo ("RXC;2" )
        IF ((reply->fpoh_cache.prod[j ].item_id > 0 ) )
         SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_code.
         identifier = eso_format_item_with_method ("IDENTIFIER_TYPE_CD" ,"VALUE_KEY" ,reply->
          fpoh_cache.prod[j ].item_id ,j ,"CE" ,"coding_system" )
         SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_code.text =
         trim (reply->fpoh_cache.prod[j ].label_desc )
        ELSEIF ((reply->oig_cache.ing[i ].prod[j ].tnf_id > 0 ) )
         SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_code.
         identifier = eso_format_item_with_method ("IDENTIFIER_TYPE_CD" ,"VALUE_KEY" ,reply->
          oig_cache.ing[i ].prod[j ].tnf_item_id ,reply->oig_cache.ing[i ].prod[j ].md_index ,"CE" ,
          "coding_system" )
         SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_code.text =
         trim (reply->oig_cache.ing[i ].prod[j ].tnf_description )
        ENDIF
        SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_code.alt_text
         = trim (reply->oig_cache.ing[i ].ordered_as_mnemonic )
       ENDIF
      ENDFOR
      CALL echo ("RXC;3" )
      IF ((reply->fpoh_cache.prod[j ].volume_with_overfill_value > 0 ) )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].component_amt =
       eso_trim_zeros_sig_dig (reply->fpoh_cache.prod[j ].volume_with_overfill_value ,6 )
      ELSE
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].component_amt =
       eso_trim_zeros_sig_dig (reply->fpoh_cache.prod[j ].volume ,6 )
      ENDIF
      CALL echo ("RXC;4" )
      IF ((reply->fpoh_cache.prod[j ].volume_with_overfill_unit_cd > 0 ) )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_units.
       identifier = eso_format_code (reply->fpoh_cache.prod[j ].volume_with_overfill_unit_cd )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_units.text =
       eso_get_code_display (reply->fpoh_cache.prod[j ].volume_with_overfill_unit_cd )
      ELSE
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_units.
       identifier = eso_format_code (reply->fpoh_cache.prod[j ].volume_unit_cd )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_units.text =
       eso_get_code_display (reply->fpoh_cache.prod[j ].volume_unit_cd )
      ENDIF
      CALL echo ("RXC;5" )
      IF ((reply->fpoh_cache.prod[j ].strength_with_overfill_value > 0 ) )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_strength =
       eso_trim_zeros_sig_dig (reply->fpoh_cache.prod[j ].strength_with_overfill_value ,6 )
      ELSE
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_strength =
       eso_trim_zeros_sig_dig (reply->fpoh_cache.prod[j ].strength ,6 )
      ENDIF
      CALL echo ("RXC;6" )
      IF ((reply->fpoh_cache.prod[j ].strength_with_overfill_unit_cd > 0 ) )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_strength_units
       .identifier = eso_format_code (reply->fpoh_cache.prod[j ].strength_with_overfill_unit_cd )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_strength_units
       .text = eso_get_code_display (reply->fpoh_cache.prod[j ].strength_with_overfill_unit_cd )
      ELSE
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_strength_units
       .identifier = eso_format_code (reply->fpoh_cache.prod[j ].strength_unit_cd )
       SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].rxc[rxc_idx ].comp_strength_units
       .text = eso_get_code_display (reply->fpoh_cache.prod[j ].strength_unit_cd )
      ENDIF
      SET rxc_idx = (rxc_idx + 1 )
     ENDFOR
     CALL echo ("<---------- End RXC Segment ---------->" )
    ENDIF
   ENDIF
   IF ((shdose_msg_ind = 0 ) )
    FREE SET list_size
    SET list_size = 0
    IF ((reply->fpoh_cache.prn_ind = 1 ) )
     SET list_size = 1
    ELSE
     SET list_size = reply->fpoh_cache.admin_count
    ENDIF
    SET stat = alterlist (context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe ,list_size )
    SET zxe_idx = 1
    FOR (zxe_idx = 1 TO list_size )
     CALL echo ("<---------- Begin ZXE Segment ---------->" )
     CALL echo ("ZXE;1" )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].set_id = trim (
      cnvtstring (zxe_idx ) )
     CALL echo ("ZXE;2" )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].fill_count = trim (
      cnvtstring (reply->fpoh_cache.fill_quantity ) )
     CALL echo ("ZXE;3" )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].admin_count = trim (
      cnvtstring (reply->fpoh_cache.admin_count ) )
     CALL echo ("ZXE;4" )
     IF ((size (reply->fpoh_cache.admin ,5 ) >= zxe_idx ) )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].admin_dt_tm =
      hl7_format_datetime (reply->fpoh_cache.admin[zxe_idx ].admin_dt_tm ,hl7_dt_tm )
     ENDIF
     IF ((reply->fpoh_cache.prn_ind = 1 ) )
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].disp_amt =
      eso_trim_zeros_sig_dig ((reply->fpoh_cache.fill_quantity * reply->fpoh_cache.prod[prod_idx ].
       dose_quantity ) ,6 )
     ELSE
      SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].disp_amt =
      eso_trim_zeros_sig_dig (reply->fpoh_cache.prod[prod_idx ].dose_quantity ,6 )
     ENDIF
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].disp_units.identifier
      = eso_format_code (reply->fpoh_cache.prod[prod_idx ].dose_quantity_unit_cd )
     SET context->rde_group[rde_grp_idx ].rxe_group[rxe_grp_idx ].zxe[zxe_idx ].disp_units.text =
     eso_get_code_display (reply->fpoh_cache.prod[prod_idx ].dose_quantity_unit_cd )
     CALL echo ("<---------- End ZXE Segment ---------->" )
    ENDFOR
   ENDIF
   SET rxe_grp_idx = (rxe_grp_idx + 1 )
  ENDIF
  IF ((reply->fpoh_cache.compound_ind = 1 )
  AND (prod_idx = 1 ) )
   SET prod_idx = reply->fpoh_cache.prod_count
  ENDIF
 ENDFOR
 SET stat = alterlist (context->rde_group[rde_grp_idx ].obx_group ,reply->fpoh_cache.obx_count )
 SET obx_grp_idx = 1
 FOR (obx_grp_idx = 1 TO reply->fpoh_cache.obx_count )
  CALL echo ("<---------- Begin OBX Segment ---------->" )
  CALL echo ("OBX;1" )
  SET context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.set_id = trim (cnvtstring (
    obx_grp_idx ) )
  CALL echo ("OBX;2" )
  SET context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.value_type = trim (reply->
   fpoh_cache.obx[obx_grp_idx ].value_type )
  CALL echo ("OBX;3" )
  SET context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.observation_id.identifier = trim (
   reply->fpoh_cache.obx[obx_grp_idx ].identifier )
  CALL echo ("OBX;5" )
  SET stat = alterlist (context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.
   observation_value ,1 )
  SET context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.observation_value[1 ].value_1 =
  eso_trim_zeros_sig_dig (reply->fpoh_cache.obx[obx_grp_idx ].value ,6 )
  CALL echo ("OBX;6" )
  SET context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.units.identifier =
  eso_format_code (reply->fpoh_cache.obx[obx_grp_idx ].units )
  SET context->rde_group[rde_grp_idx ].obx_group[obx_grp_idx ].obx.units.text = eso_get_code_display
  (reply->fpoh_cache.obx[obx_grp_idx ].units )
  CALL echo ("<---------- End OBX Segment ---------->" )
 ENDFOR
#end_script
 CALL echo ("<==================== Exiting FSI_PHARM_DISP Script ====================>" )
END GO
1)
1)

190221:163123 B121450_DVD1              Cost 0.00 Cpu 0.01 Ela 0.01 Dio   0 O0M0R0 P1R0