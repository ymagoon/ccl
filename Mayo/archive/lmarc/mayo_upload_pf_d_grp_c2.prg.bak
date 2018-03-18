drop program mayo_upload_pf_d_grp_c2:dba go
create program mayo_upload_pf_d_grp_c2:dba
; PEL - Made copy of mayo_upload_powerform_c on 12/31/2008 and making chages for performance.
; pel - made copy of mayo_upload_powerform_c2 on 10/11/11 converting it to process group of pawerforms
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
 
 
 
/*****************************************************************************
 
        Source file name:       mayo_upload_powerform.PRG
        Object name:            mayo_upload_powerform
        Request #:
 
 
        Program purpose:
 
        Tables read:            clinical_event
 
 
        Tables updated:         N/A
        Executing from:
 
        Special Notes:
 
************************************************************************************/
/***********************************************************************************
*                           MODIFICATION CONTROL LOG                               *
************************************************************************************
* Mod   Feature# Date     Engineer       Description                               *
* ----- -------- -------- --------       ------------------------------------------*
* 000   ***      09/29/08 www.akcia.com  initial  release                          *
************************************************************************************/
 
 
;set proc->script_status = "F"
set comp_sep 	= char(94)  ;pel
set rep_sep 	= char(126) ;pel
set escape 		= char(92)  ;pel
set field_sep 	= char(124) ;pel
set v_cr 			= char(13)  ;pel
 
;%i mayo_upload_rec_struct_2.inc
%i ccluserdir:mayo_upload_rec_struct_tst.inc
%i ccluserdir:mayo_upload_result.inc
 
		free record proc
 
		record proc(
		  1 script_status = c1
			1	File_name = vc
			1 PRINTER = VC
			1 pat_cnt = i4
			1 pat[*]
				2 person_id = f8
			1 enc_cnt = i4
			1 enc[*]
				2 encntr_id = f8
				2 person_id = f8
				2 fin_nbr = vc
				)
;		if (lp_cnt*p_rec_size <= actual_size)
;			set rec_size = p_rec_size
;		else
;			set rec_size = mod(actual_size,p_rec_size)
;		endif
		set stat = alterlist(proc->enc,1)
;		set start_pos = ((lp_cnt -1) * p_rec_size) +1
;		set x1 = 0
;		for (slp_cnt = start_pos to (start_pos + rec_size -1))
;		   set x1 = x1 + 1
		   set proc->enc[1]->person_id =     1467143.00
		   set proc->enc[1]->encntr_id =  5809884.00
		   set proc->enc[1]->fin_nbr = "1234"
;		endfor
			   set proc->enc_cnt = 1
			   set temp_dt_tm = cnvtdatetime(curdate,curtime3)
			   call echo(concat("temp time = ",format(temp_dt_tm, "hh:mm:ss:cc;;d")))
			   SET PROC->PRINTER = $OUTDEV
			   set proc->file_name = concat("mayo",
;			                                  trim(prog_name),"_",
;																			  trim(disp1),"_",
			                                  trim(proc->enc[1]->fin_nbr)
;			   																trim(format(temp_dt_tm, "hhmmsscc;;d")),
;			   																trim(cnvtstring(lp_cnt),3)
			   																,".pdf")
 
 
declare cnt = i4
declare form_cnt = i4
declare idx1 = i4
declare contrib_source_cd = vc
declare contrib_source = vc
declare v_contrib_source_cd = f8  with public,constant(uar_get_code_by("DISPLAYKEY",73,"LH"))
declare v_alt_contrib_source_cd = f8  with public,constant(uar_get_code_by("DISPLAYKEY",73,"MISYS"))
declare v_OCF_COMP = f8 with public,constant(uar_get_code_by("MEANING", 120,"OCFCOMP"))
declare v_URL = f8 with public,constant(uar_get_code_by("MEANING", 25,"URL"))
declare v_blob = f8 with public,constant(uar_get_code_by("MEANING",25,"BLOB"))
declare v_AUTH_CD = f8 with public,constant(uar_get_code_by("MEANING",8,"AUTH"))
declare v_event = VC with public,constant("LMASSPF")
declare v_text_class_cd = f8 with public,constant(uar_get_code_by("MEANING",53,"TXT"))
 
set contrib_source = get_alias(v_contrib_source_cd,v_contrib_source_cd)
;****************
declare  encntr_cnt  =  i4
declare  ln_number  =  vc
declare  prob_desc_size  =  i4  with  noconstant ( 0 ), protect
declare  prob_desc_idx  =  i4  with  noconstant ( 1 ), protect
declare  dx_desc_size  =  i4  with  noconstant ( 0 ), protect
declare  dx_desc_idx  =  i4  with  noconstant ( 1 ), protect
declare  prob_count  =  i4  with  noconstant ( 0 ), protect
declare  dx_count  =  i4  with  noconstant ( 0 ), protect
declare  facnt  =  i4  with  noconstant ( 0 ), protect
 
set  ec  =  char ( 0 )
set  blob_out  =  fillstring ( 32000 ,  " " )
set  code_value  =  0.0
set  code_set  =  0.0
set  cdf_meaning  =  fillstring ( 12 ,  " " )
set  lf  =  concat ( char ( 13 ),  char ( 10 ))
set  ycol  =  0
set  xcol  =  0
set  xxx  =  fillstring ( 40 ,  " " )
set  person_id  =  0
set  encntr_cnt  =  0
set  day  =  fillstring ( 2 ,  " " )
set  month  =  fillstring ( 2 ,  " " )
set  year  =  fillstring ( 2 ,  " " )
set  hour  =  fillstring ( 2 ,  " " )
set  minute  =  fillstring ( 2 ,  " " )
set  error_line  =  fillstring ( 40 ,  " " )
set  ln  =  0
set  done  =  "F"
set  numrows  =  0
set  pagevar  =  0
 
 
;**********************
 
declare CLINICAL_CD = f8  with public,constant(uar_get_code_by("MEANING",18189,"CLINCALEVENT"))
 
declare OCFCOMP_CD = f8  with public,constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
 
declare INERROR_CD = f8  with public,constant(uar_get_code_by("MEANING",8,"INERROR"))
 
SET  ERROR_LINE  =  UAR_GET_CODE_DISPLAY ( CNVTREAL ( VALUE ( INERROR_CD )))
 
declare MODIFIED_CD = f8  with public,constant(uar_get_code_by("MEANING",8,"MODIFIED"))
 
declare CANCELED_CD = f8  with public,constant(uar_get_code_by("MEANING",12025,"CANCELED"))
 
declare DATE_CD = f8  with public,constant(uar_get_code_by("MEANING",53,"DATE"))
 
declare TEXT_CD = f8  with public,constant(uar_get_code_by("MEANING",53,"TXT"))
 
declare NUM_CD = f8  with public,constant(uar_get_code_by("MEANING",53,"NUM"))
 
declare CHILD_CD = f8  with public,constant(uar_get_code_by("MEANING",24,"CHILD"))
 
declare ROOT_CD = f8  with public,constant(uar_get_code_by("MEANING",24,"ROOT"))
 
IF ( ( VALIDATE ( iCatchUp ,  999 )= 999 ) ) 																				;001
	declare iCatchUp = i2 with noconstant(0)  																				;001
endif
 
 
 
;001 declare orc_line = vc with public
;001 set orc_line = concat("ORC",FIELD_SEP,"RE")
 
; need to find the list of documents to pull from the database
 
;
free record frm
record frm(
	1 cnt = i4
	1 qual[*]
	  2 event_cd = f8
)
 
/*
set frm->qual[1]->event_cd =    23583406.00 ;vital signs
set frm->qual[2]->event_cd =    23583403.00
set frm->qual[3]->event_cd =    23583395.00
set frm->qual[4]->event_cd =    23583371.00
set frm->qual[5]->event_cd =    23583361.00
set frm->qual[6]->event_cd =    23583344.00
set frm->qual[7]->event_cd =    23583322.00
set frm->qual[8]->event_cd =    23583321.00
set frm->qual[9]->event_cd =    23583320.00
set frm->qual[10]->event_cd =    23583287.00
set frm->qual[11]->event_cd =    23583274.00
set frm->qual[12]->event_cd =    23583323.00
set frm->qual[13]->event_cd =    23583408.00
set frm->qual[14]->event_cd =    23583262.00
set frm->qual[15]->event_cd =    23583374.00
set frm->qual[16]->event_cd =    23583353.00
set frm->qual[17]->event_cd =    23583356.00
set frm->qual[18]->event_cd =    23583352.00
set frm->qual[19]->event_cd =    23583261.00
set frm->qual[20]->event_cd =    23583252.00
set frm->qual[21]->event_cd =    23583251.00
 */
 
;set frm->qual[1]->event_cd =    23583249.00	;Adult Activities of Daily Living Form
;set frm->qual[2]->event_cd =    23583260.00	;Ambulate Form
;set frm->qual[3]->event_cd =    23583271.00	;Bedrest Form
;set frm->qual[4]->event_cd =    23583285.00	;Dangle at Bedside Form
;set frm->qual[5]->event_cd =    23583309.00	;Elevate Head of Bed Form
;set frm->qual[6]->event_cd =    23583332.00	;Newborn Activities of Daily Living Form
;set frm->qual[7]->event_cd =    23583349.00	;Pediatric ADLs Form
;set frm->qual[8]->event_cd =    23583399.00	;Up to Chair Form
 
SET group_nbr = 1
 
free record frm
record frm(
	1 cnt = i4
	1 qual[*]
	  2 event_cd = f8
	  2 EVENT_SET_NAME = vc
)
 
if (group_nbr = 1)
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
 
	plan c
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
	23583249,
	23583260,
	23583271,
	23583285,
	23583309,
	23583332,
	23583349,
	23583399
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 2)
;Admit/Discharge/Transfer Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583311,
	23583348
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 3)
;Assessment Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
	23583250,
	23583254,
	23583255,
	23583256,
	23583257,
	23583259,
	23583266,
	23583267,
	23583268,
	23583269,
	23583270,
	23583275,
	23583277,
	23583282,
	23583289,
	23583290,
	23583291,
	23583292,
	23583295,
	23583296,
	23583297,
	23583298,
	23583299,
	23583300,
	23583312,
	23583313,
	23583314,
	23583315,
	23583316,
	23583317,
	23583318,
	23583324,
	23583325,
	23583330,
	23583331,
	23583333,
	23583335,
	23583336,
	23583350,
	23583354,
	23583355,
	23583358,
	23583359,
	23583404,
	23583405,
	23583258
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 4)
;Education Forms
 
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583293,
	23583302,
	23583303,
	23583304,
	23583305,
	23583306,
	23583307,
	23583308,
	23583346,
	23583366,
	23583369
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 5)
;Nutrition Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583286
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 6)
;Obstetrical Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583263,
	23583264
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 7)
;Patient History Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583326,
	23583334,
	23583347,
	23583351
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 8)
;Point of Care
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583276,
	23583367,
	23583401,
	23583402
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 9)
;Respiratory Therapy Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583284,
	23583376,
	23583377,
	23583378,
	23583379,
	23583380,
	23583381,
	23583382,
	23583383
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 10)
;Social Services Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583384
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 11)
;Speech Therapy Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583393,
	23583389
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 12)
;Spirital Care Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583345
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
elseif ( group_nbr = 13)
;Treatments/Procedures Forms
 
	select into "nl:"
	   c.code_value
	from code_value c,
	   V500_EVENT_SET_CODE  VESC
	plan c
 
	  where c.code_set = 93
	  and c.active_ind = 1
	  and c.code_value in (
 
	23583253,
	23583265,
	23583272,
	23583273,
	23583278,
	23583279,
	23583281,
	23583283,
	23583294,
	23583310,
	23583328,
	23583329,
	23583337,
	23583343,
	23583357,
	23583360,
	23583365,
	23583368,
	23583370,
	23583372,
	23583373,
	23583375,
	23583396,
	23583397,
	23583398,
	23583400,
	23583407
 
 
	)
  join vesc
     where VESC.EVENT_SET_CD = c.code_value
	head report
	  ecnt = 0
 
	detail
	  ecnt = ecnt + 1
	  stat = alterlist(frm->qual,ecnt)
	  frm->cnt = ecnt
	  frm->qual[ecnt].event_cd = c.code_value
	  frm->qual[ecnt].EVENT_SET_NAME = vesc.EVENT_SET_NAME
	with nocounter
 
 
 
endif
 
 
 
 
 
;;set frm->qual[1]->event_cd = 23583249
;;set frm->qual[2]->event_cd = 23583252
;;set frm->qual[3]->event_cd = 23583261
;;set frm->qual[4]->event_cd = 23583262
;;set frm->qual[5]->event_cd = 23583274
;;set frm->qual[6]->event_cd = 23583280
;;set frm->qual[7]->event_cd = 23583287
;;set frm->qual[8]->event_cd = 23583288
;;
;;
;;
;;set frm->qual[9]->event_cd = 23583301
;;set frm->qual[10]->event_cd = 23583319
;;set frm->qual[11]->event_cd = 23583320
;;set frm->qual[12]->event_cd = 23583321
;;set frm->qual[13]->event_cd = 23583322
;;set frm->qual[14]->event_cd = 23583323
;;set frm->qual[15]->event_cd = 23583327
;;set frm->qual[16]->event_cd = 23583338
;;set frm->qual[17]->event_cd = 23583339
;;set frm->qual[18]->event_cd = 23583340
;;set frm->qual[19]->event_cd = 23583341
;;set frm->qual[20]->event_cd = 23583344
;;set frm->qual[21]->event_cd = 23583352
;;set frm->qual[22]->event_cd = 23583353
;;set frm->qual[23]->event_cd = 23583356
;;set frm->qual[24]->event_cd = 23583361
;;set frm->qual[25]->event_cd = 23583362
;;set frm->qual[26]->event_cd = 23583363
;;set frm->qual[27]->event_cd = 23583364
;;set frm->qual[28]->event_cd = 23583371
;;set frm->qual[29]->event_cd = 23583374
;;set frm->qual[30]->event_cd = 23583385
;;set frm->qual[31]->event_cd = 23583386
;;set frm->qual[32]->event_cd = 23583387
;;set frm->qual[33]->event_cd = 23583388
;;set frm->qual[34]->event_cd = 23583389
;;set frm->qual[35]->event_cd = 23583390
;;set frm->qual[36]->event_cd = 23583391
;;set frm->qual[37]->event_cd = 23583392
;;set frm->qual[38]->event_cd = 23583394
;;set frm->qual[39]->event_cd = 23583395
;;set frm->qual[40]->event_cd = 23583403
;;set frm->qual[41]->event_cd = 23583406
;;set frm->qual[42]->event_cd = 23583408
 
 
 
 
set event_cnt = 0
 
set form_cnt = 0
 
 
 
 
 call echorecord(proc)
  call echorecord(frm)
 
for (enc_idx = 1 to size(proc->enc,5))
 
 
 
 
		free record frm2
		record frm2(
		  1 encntr_id = f8
		  1 person_id = f8
		  1 name = vc
		  1 mrn = vc
		  1 fin = vc
			1 cnt = i4
			1 birth_dt_tm = dq8
			1 sex_cd = f8
			1 sex = vc
			1 admit_dt_tm = dq8
			1 disch_dt_tm = dq8
			1 encntr_type_cd = f8
			1 encntr_type = vc
			1 facility_cd = f8
			1 facility = vc
			1 addr_qual[*]
   			2 line = vc
 
;			1 Addr_line1 = vc
;			1 Addr_line2 = vc
;			1 Addr_line3 = vc
;			1 Addr_line4 = vc
;			1 addr_city_state_zip = vc
 
			1 frm_qual[*]
			  2 event_cd = f8
				2 text_qual[*]
				   3 LINE  =  C255
		)
;;				free record reply
;;				RECORD  REPLY  (
;;				 1  NUM_LINES  =  F8
;;				 1  QUAL [*]
;;				 2  NUM_LINES  =  F8
;;				 2  event_dt_Tm = dq8
;;				 2  prsnl_id = F8
;;				 2  forms_activity_id = f8
;;				 2  item_qual[*]
;;				 3  HEADER_FLAG = I2
;;				 3  LINE  =  C255
;;				 1  STATUS_DATA
;;				 2  STATUS  =  C1
;;				 2  SUBEVENTSTATUS [ 1 ]
;;				 3  OPERATIONNAME  =  C25
;;				 3  OPERATIONSTATUS  =  C1
;;				 3  TARGETOBJECTNAME  =  C25
;;				 3  TARGETOBJECTVALUE  =  VC )
 
 
select into "nl:"
from person p,
	encounter e,
	person_alias pa
plan e
  where e.encntr_id = proc->enc[enc_idx].encntr_id
join p
	where p.person_id = e.person_id
 
join pa
	where pa.person_id = p.person_id
	and pa.active_ind =1
	and pa.end_effective_dt_tm > sysdate
	and pa.person_alias_type_cd = 10
detail
   frm2->encntr_id = e.encntr_id
   frm2->person_id = e.person_id
   frm2->name = p.name_full_formatted
   frm2->admit_dt_tm = e.reg_dt_tm
   frm2->disch_dt_tm = e.disch_dt_tm
   frm2->birth_dt_tm = p.birth_dt_tm
   frm2->sex_cd = p.sex_cd
   frm2->facility_cd = e.loc_facility_cd
   frm2->facility = uar_get_code_display(e.loc_facility_cd)
   frm2->sex = uar_get_code_display(p.sex_cd)
   frm2->encntr_type_cd = e.encntr_type_cd
   frm2->encntr_type = uar_get_code_display(e.encntr_type_cd)
with nocounter
 
select into "nl:"
from
     encounter e,
     address a,
     encntr_alias ea
plan e
	where e.encntr_id = frm2->encntr_id
join a
	where a.parent_entity_id = e.loc_facility_cd
	and a.parent_entity_name = "LOCATION"
	and a.active_ind = 1
	and a.end_effective_dt_tm > sysdate
 
join ea
	where ea.encntr_id = e.encntr_id
	and ea.active_ind = 1
	and ea.end_effective_dt_tm > sysdate
	and ea.encntr_alias_type_cd = 1077
head report
   a_cnt = 0
detail
   if (a.street_addr > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(frm2->addr_qual,a_cnt)
       frm2->addr_qual[a_cnt].line = a.street_addr
   endif
   if (a.street_addr2 > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(frm2->addr_qual,a_cnt)
       frm2->addr_qual[a_cnt].line = a.street_addr2
   endif
   if (a.street_addr3 > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(frm2->addr_qual,a_cnt)
       frm2->addr_qual[a_cnt].line = a.street_addr3
   endif
   if (a.street_addr4 > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(frm2->addr_qual,a_cnt)
       frm2->addr_qual[a_cnt].line = a.street_addr4
   endif
 city_state = fillstring(100," ")
      city_state = a.city
   if (a.state > "")
      city_state = concat (trim(city_state), ", ",trim(a.state))
   else
      city_state = concat (trim(city_state), ", ",trim(uar_get_code_display(a.state_cd)))
   endif
      city_state = concat (trim(city_state), " ",trim(a.zipcode))
       a_cnt = a_cnt + 1
       stat = alterlist(frm2->addr_qual,a_cnt)
       frm2->addr_qual[a_cnt].line = trim(city_state)
    frm2->fin =  ea.alias
with nocounter
 
select pa.*
from person_alias pa
plan pa
	where pa.person_id = frm2->person_id
	and pa.active_ind = 1
	and pa.end_effective_dt_tm > sysdate
	and pa.person_alias_type_cd = 10
detail
   frm2->mrn = pa.alias
 with nocounter
 
		set form_found_ind = 0
		set fm_idx = 0
		select into "nl:"
			dfa.DCP_FORMS_REF_ID
		from ;V500_EVENT_SET_CODE  VESC ,
		DCP_FORMS_REF  DFR,
		DCP_FORMS_ACTIVITY  DFA
,		(dummyt d1 with seq = size(frm->qual,5))
;,		dummyt d2
   plan d1
		join dfa
			where dfa.encntr_id =     proc->enc[enc_idx].encntr_id
		join DFR
			WHERE DFR.EVENT_SET_NAME=frm->qual[d1.seq]->EVENT_SET_NAME
			AND DFR.DCP_FORMS_REF_ID > 0
			and dfr.DCP_FORMS_REF_ID = DFA.DCP_FORMS_REF_ID
 
;;;		plan vesc where  expand(fm_idx,1,size(frm->qual,5),VESC.EVENT_SET_CD,frm->qual[fm_idx]->event_cd)
;;;    join d1
;;;		join DFR
;;;		WHERE DFR.EVENT_SET_NAME=VESC.EVENT_SET_NAME AND DFR.DCP_FORMS_REF_ID > 0
;;;    join d2
;;;		join dfa where DFA.DCP_FORMS_REF_ID+0  = dfr.DCP_FORMS_REF_ID
;;;;		and dfa.version_dt_tm between cnvtdatetime(cnvtdate(
;;;		and dfa.encntr_id =     proc->enc[enc_idx].encntr_id
 		head report
 			form_found_ind = 1
 			encnt_form_cnt = 0
; 		head dfr.DCP_FORMS_REF_ID
; 		   call echo ("***********************************************")
; 		   call echo(DFR.EVENT_SET_NAME)
; 		   call echo (dfr.DCP_FORMS_REF_ID)
		head ;VESC.EVENT_SET_CD
		    DFR.EVENT_SET_NAME
;		   call echo (dfa.dcp_forms_activity_id)
		 if (dfa.encntr_id =     proc->enc[enc_idx].encntr_id)
			encnt_form_cnt = encnt_form_cnt + 1
			stat = alterlist(frm2->frm_qual,encnt_form_cnt)
			frm2->frm_qual[encnt_form_cnt]->event_cd = ;VESC.EVENT_SET_CD
			                                frm->qual[d1.seq]->event_cd
			endif
 		with nocounter ;maxrec = 1
 		,outerjoin = d2
;   call echo (proc->enc[enc_idx].encntr_id)
 call echorecord(frm2)
 	if (size(frm2->frm_qual,5) > 0)
;		for (event_cnt = 1 to size(frm2->frm_qual,5));21)
 
 
 
 
 
 
 
				free set request
				record request (
				1   person_id = f8
				1   encntr_id = f8
				1   start_dt_tm = dq8
				1   end_dt_tm = dq8
				1   code_list[*]
				    2   code = f8
				1   xencntr_qual[*]
				    2   encntr_id  = f8
				1   result_lookup_ind = i2
				)
 
				free record reply
				RECORD  REPLY  (
				 1  NUM_LINES  =  F8
				 1  QUAL [*]
				 2  NUM_LINES  =  F8
				 2  event_dt_Tm = dq8
				 2  prsnl_id = F8
				 2  forms_activity_id = f8
				 2  item_qual[*]
				 3  HEADER_FLAG = I2
				 3  LINE  =  C255
				 1  STATUS_DATA
				 2  STATUS  =  C1
				 2  SUBEVENTSTATUS [ 1 ]
				 3  OPERATIONNAME  =  C25
				 3  OPERATIONSTATUS  =  C1
				 3  TARGETOBJECTNAME  =  C25
				 3  TARGETOBJECTVALUE  =  VC )
 
				set request->person_id = proc->enc[enc_idx].person_id
				set request->encntr_id = proc->enc[enc_idx].encntr_id
						for (event_cnt = 1 to size(frm2->frm_qual,5));21)
						  SET STAT = ALTERLIST(request->code_list,EVENT_CNT)
 
							set request->code_list[event_cnt]->code = frm2->frm_qual[event_cnt]->event_cd
						ENDFOR
				set request->result_lookup_ind = 1
;				call echo("calling cp_powerforms_chart")
;				call echo(build("event_cd looking for: ",frm2->qual[event_cnt]->event_cd ))
		;		execute cp_powerforms_chart
				execute mayo_upload_powerforms_chart2
 
				;;if (reply->num_lines = 0)
				;;   go to exit_program
				;;endif
 
				;if (reply->num_lines > 0)
 
;			call echorecord(reply); pel**************
;			call echo(size(reply->QUAL,5))
				if( size(reply->QUAL,5) > 0  )
;				call echo ("inside if( size(reply->QUAL,5) > 0  )")
		 call echorecord(reply)
 
;  for (x = 1 to size(reply->qual,5))
;     for (Y = 1 to size(reply->qual[x].item_qual,5))
;
;      REPLACE(reply->QUAL[x].item_qual[Y].LINE
;      REPLACE(   ">>>","
;;
;;;   reply->QUAL[x].item_qual[d2.seq].LINE
;;
;   endfor
 
 
;		 select into proc->file_name ;$outdev
;from
;  (dummyt d with seq=value(size(reply->qual,5))),
;  (dummyt d2 with seq = 1)
;plan d
;   where maxrec(d2,size(reply->qual[d.seq].item_qual,5))
;
;join d2
;head report
;  first_time = "Y"
;  cur_dt_tm_format = ""
;
;detail
;   if (substring(1,2,reply->QUAL[d.seq].item_qual[d2.seq].LINE) = ">>" or
;										substring(1,2,reply->QUAL[d.seq].item_qual[d2.seq].LINE) = "<<")
;		"  "
;	else
;   reply->QUAL[d.seq].item_qual[d2.seq].LINE
;  endif
;;   call echo(d.seq)
;;   call echo(d2.seq)
;
;;   call echo(reply->QUAL[d.seq].item_qual[d2.seq].LINE)
;
;row +1
;with
;  nocounter
;,  dio = 38
;;  noheading,
;;  maxrow = 1,
;,  maxcol = 34000
;,format = variable
 
FOR (X = 1 TO SIZE(REPLY->QUAL,5))
  FOR (Y = 1 TO SIZE(reply->QUAL[X].item_qual))
    set header_flag = 0
     if (substring(1,3,reply->QUAL[X].item_qual[Y].LINE) = ">>>" )
        SET reply->QUAL[X].item_qual[Y].HEADER_FLAG = 1
 
     ELSEIF(substring(1,3,reply->QUAL[X].item_qual[Y].LINE) = "<<<")
        SET reply->QUAL[X].item_qual[Y].HEADER_FLAG = 2
 
     ELSEIF(substring(1,2,reply->QUAL[X].item_qual[Y].LINE) = ">>")
        SET reply->QUAL[X].item_qual[Y].HEADER_FLAG = 2
     ELSEIF(substring(1,2,reply->QUAL[X].item_qual[Y].LINE) = "<<")
        SET reply->QUAL[X].item_qual[Y].HEADER_FLAG = 2
 		 ELSE
        SET reply->QUAL[X].item_qual[Y].HEADER_FLAG = 0
 
		 ENDIF
	ENDFOR
ENDFOR
call echo (proc->file_name)
 
 
execute ReportRtl
%I MAYO_UPLOAD_PF_D_GRP_C2.DVL
set _SendTo = VALUE(PROC->PRINTER)
 
 
call LayoutQuery(0)
 
 
 
				endif
 
;			endfor
		else
			call echo (build("no forms found for encounter",proc->enc[enc_idx].encntr_id,"************************************"))
		endif ; form_found_ind = 1
	endfor
;;////****////****////****
 
 
 
#exit_program
 
end
go
