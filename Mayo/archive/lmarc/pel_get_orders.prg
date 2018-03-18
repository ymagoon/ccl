drop program pel_get_orders go
create program pel_get_orders
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "encntr_id" = 0
 
with OUTDEV, encntr_id
 
 
call echo("starting program here .......")
 
set pdf_file_name = build($outdev,".pdf")
set idx_file_name = build($outdev,".idx")
 
 
 
 
 
 
set lf = char(10)
set cr = char(13)
 
declare wars_code  = vc
declare fin_cd = f8  with public,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare mailing_addr_cd = f8  with public,constant(uar_get_code_by("MEANING",212,"MAILING"))
declare bus_ADDR_CD = f8  with public,constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare bus_phone_cd = f8  with public,constant(uar_get_code_by("MEANING",43,"BUSINESS"))
declare home_phone_cd = f8  with public,constant(uar_get_code_by("MEANING",43,"HOME"))
declare HOME_ADDR_CD = f8  with public,constant(uar_get_code_by("MEANING",212,"HOME"))
declare fax_cd = f8  with public,constant(uar_get_code_by("MEANING",43,"FAX BUS"))
declare action_type_cd = f8 with public,constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare order_status_cd = f8 with public,constant(uar_get_code_by("MEANING",6004,"FUTURE"))
declare ord_comment_cd = f8 with public,constant(uar_get_code_by("MEANING",14,"ORD COMMENT"))
declare SSN_ALIAS_CD = f8 with public,constant(uar_get_code_by("MEANING",4,"SSN"))
declare PERSON_RELTN_TYPE_CD = f8 with public,constant(uar_get_code_by("MEANING",351,"INSURED"))
declare GUARANTOR_CD = f8 with public,constant(uar_get_code_by("MEANING",351,"DEFGUAR"))
declare detail_line = vc
set lidx = 0
DECLARE OFFSET_VAR = I4
DECLARE DAYLIGHT_VAR = I4
declare disp_zone = vc
set disp_zone = datetimezonebyindex(CURTIMEZONESYS,OFFSET_VAR,DAYLIGHT_VAR,7)
 
 
record temp1
(1 enc[*]
   2 account_nbr = vc
   2 encntr_id = f8
   2 person_id = f8
		  2 name = vc
		  2 name_first_key = vc
		  2 name_last_key = vc
		  2 name_middle_key = vc
		  2 mrn = vc
		  2 fin = vc
			2 cnt = i4
			2 birth_dt_tm = dq8
			2 sex_cd = f8
			2 sex = vc
			2 admit_dt_tm = dq8
			2 disch_dt_tm = dq8
			2 encntr_type_cd = f8
			2 encntr_type = vc
			2 facility_cd = f8
			2 facility = vc
			2 addr_qual[*]
   			3 line = vc
 
  ;**
 
   2  ICNT = I2
 
   2  GUAR_NAME = VC
   2  GUAR_RELT_TO_PAT  =  VC
   2  GUAR_PHONE  =  VC
   2  GUAR_ADDR1  =  VC
   2  GUAR_ADDR2 = VC
   2  GUAR_CSZ  =  VC
   2  dept_name = vc
  ;**
     2 ord[*]
       3 name = c50
       3 start_dt_tm = vc
       3 dt_tm = vc
       3 order_id = f8
       3 ord_phys_id = f8
       3 ord_phys_name = vc
       3 entered_by_id = f8
       3 entered_by_name = vc
       3 REQ_TIMEFRAME_LABEL = VC
       3 REQ_TIMEFRAME_VALUE = VC
       3 ORD_DETAIL = vc
       3 STATUS = VC
       3 CAT_TYPE = VC
       3 det[*]
       	 4 detail_seq = i4
       	 4 field_id = f8
       	 4 name = vc
       	 4 value = vc
       3 comments = vc
 
)
 
 if (validate (DREC->LINE_CNT,999) = 999)
RECORD DREC
 (1  LINE_CNT  =  I4
  1  DISPLAY_LINE  =  VC
  1  LINE_QUAL [*]
    2  DISP_LINE  =  VC)
 
endif
 
 
DECLARE OE_ENC_CD = F8
DECLARE OE_SPEC_CD = F8
DECLARE OE_WT_CD = F8
DECLARE OE_HGT_CD = F8
DECLARE OE_REQ_TIME_CD = F8
 
SET OE_ENC_CD = 0.0
SET OE_SPEC_CD = 0.0
SET OE_WT_CD = 0.0
SET OE_HGT_CD = 0.0
SET OE_REQ_TIME_CD = 0.0
 
SELECT into "nl:"
FROM ORDER_ENTRY_FIELDS OEF
PLAN OEF
	WHERE OEF.description IN ("Ambulatory EMR Encounter","Specimen Description Micro",
							"Weight - EC","Height - EC","Ambulatory Requested Timeframe")
DETAIL
	IF (OEF.description = "Ambulatory EMR Encounter")
 
		OE_ENC_CD = OEF.oe_field_id
	ELSEIF (OEF.description = "Specimen Description Micro" )
		OE_SPEC_CD = OEF.oe_field_id
	ELSEIF (OEF.description = "Weight - EC")
		OE_WT_CD = OEF.oe_field_id
	ELSEIF (OEF.description = "Height - EC")
		OE_HGT_CD = OEF.oe_field_id
	ELSEIF (OEF.description = "Ambulatory Requested Timeframe")
		OE_REQ_TIME_CD = OEF.oe_field_id
	 ENDIF
WITH NOCOUNTER
 
 
select into "nl:"
from encounter e
   where e.encntr_id = $encntr_id
detail
   call echo(e.loc_building_cd)
   case (e.loc_building_cd)
      of 633868		 	:wars_code = "EULH"
   		of 3186523		:wars_code = "EULB"
      of 3186728	 	:wars_code = "EUDS"
      of 3186729	 	:wars_code = "EUDC"
      of 3186730	 	:wars_code = "EUDM"
      of 3186731	 	:wars_code = "EUDB"
      of 3194534	 	:wars_code = "EUMC"
      of 3194548	 	:wars_code = "EUBC"
      of 3194549	 	:wars_code = "EUBM"
      of 3194550	 	:wars_code = "EUCC"
      of 3194551	 	:wars_code = "EUCH"
      of 3194552	 	:wars_code = "EUMF"
      of 3196507	 	:wars_code = "EUCM"
      of 3196508	 	:wars_code = "EUMM"
      of 3196509	 	:wars_code = "EUOM"
      of 3196510	 	:wars_code = "EUPF"
      of 3196511	 	:wars_code = "EUME"
      of 3196542	 	:wars_code = "EUPC"
      of 21911837	 	:wars_code = "EUCF"
      of 26283952	 	:wars_code = "EURL"
      of 3196535	 	:wars_code = "EUBH"
      of 3196537	 	:wars_code = "EUBL"
      of 3196539	 	:wars_code = "EUOH"
      of 3196512	 	:wars_code = "EUMB"
      of 3180508	 	:wars_code = "EUML"
      of 0          :wars_code = "EUML"
   endcase
with nocounter
call echo (wars_code)
 
 
SELECT into "nl:"
cat_type = uar_get_code_display(o.catalog_type_cd),
;detail_id = build(od1.order_id,od1.action_sequence,od1.detail_sequence),
O.*;,OD.*
;, sort_seq = if(CV.DISPLAY_KEY = "AMBULATORYCOPYTOPROVIDER")
;                 10
;             elseif (od1.oe_field_meaning = "ICD9")
;                 20
;             elseif (OD1.oe_field_id = OE_SPEC_CD)
;                 50
;			 elseif (OD1.oe_field_id = OE_HGT_CD)
;			     25
;			 elseif (OD1.oe_field_id = OE_WT_CD)
;			     30
;			 ELSE
;			 	100
;			endif
 FROM ORDERS  O,
; ORDER_DETAIL OD,
; encntr_alias ea,
; encounter e,
; order_detail od1,
; code_value cv,
 encounter e1,
 person p
; oe_format_fields off
 
 PLAN e1
 	where e1.encntr_id = $encntr_id ;     6164465.00 ;request->visit[1].encntr_id
 join p
 	where p.person_id = e1.person_id
 join O
; 	WHERE O.person_id =    e1.person_id
    where o.encntr_id = e1.encntr_id
    and o.template_order_flag in (0,1)
 
 order by cnvtdatetime(o.orig_order_dt_tm) desc ;, o.catalog_type_cd,o.order_id ;, sort_seq
;                   ,od.oe_field_display_value
 head report
 	enc_cnt = 0
 	o_cnt = 0
 
; head e1.encntr_id
 	enc_cnt = enc_cnt + 1
 	stat = alterlist(temp1->enc,enc_cnt)
; 	temp1->enc[enc_cnt].account_nbr = od.oe_field_display_value
 	temp1->enc[enc_cnt].encntr_id = e1.encntr_id
 	temp1->enc[enc_cnt].person_id = e1.person_id
 	   temp1->enc[enc_cnt].name = p.name_full_formatted
 	   temp1->enc[enc_cnt].name_first_key = p.name_first_key
 	   temp1->enc[enc_cnt].name_last_key = p.name_last_key
 	   temp1->enc[enc_cnt].name_middle_key = p.name_middle_key
   temp1->enc[enc_cnt].admit_dt_tm = e1.reg_dt_tm
   temp1->enc[enc_cnt].disch_dt_tm = e1.disch_dt_tm
   temp1->enc[enc_cnt].birth_dt_tm = p.birth_dt_tm
   temp1->enc[enc_cnt].sex_cd = p.sex_cd
   temp1->enc[enc_cnt].facility_cd = e1.loc_facility_cd
   temp1->enc[enc_cnt].facility = uar_get_code_display(e1.loc_facility_cd)
   temp1->enc[enc_cnt].sex = uar_get_code_display(p.sex_cd)
   temp1->enc[enc_cnt].encntr_type_cd = e1.encntr_type_cd
   temp1->enc[enc_cnt].encntr_type = uar_get_code_display(e1.encntr_type_cd)
 	dept_cnt = 0
 	o_cnt = 0
 
; head o.catalog_type_cd
 	dept_cnt = dept_cnt +1
; 	stat = alterlist(temp1->enc[enc_cnt].dept,dept_cnt)
; 	temp1->enc[enc_cnt].dept_name = substring(1,3,uar_get_code_display(o.catalog_type_cd))
; 	o_cnt = 0
 head o.order_id
 	o_cnt = o_cnt + 1
 	stat = alterlist(temp1->enc[enc_cnt].ord,o_cnt)
 	temp1->enc[enc_cnt].ord[o_cnt].dt_tm = format(o.orig_order_dt_tm, "mm/dd/yyyy hh:mm:ss;;d")
 	temp1->enc[enc_cnt].ord[o_cnt].start_dt_tm = format(o.active_status_dt_tm, "mm/dd/yyyy hh:mm:ss;;d")
 	temp1->enc[enc_cnt].ord[o_cnt].name = ; o.hna_order_mnemonic
 	                                      O.order_mnemonic
 	temp1->enc[enc_cnt].ord[o_cnt].order_id = o.order_id
; 	temp1->enc[enc_cnt].ord[o_cnt].ord_detail = o.order_detail_display_line
 	temp1->enc[enc_cnt].ord[o_cnt].status = uar_get_code_display(o.order_status_cd)
 	temp1->enc[enc_cnt].ord[o_cnt].cat_type = uar_get_code_display(o.catalog_type_cd)
	d_cnt = 0
 
 with nocounter
 
 
 
 
 
 
 
for (x1 = 1 to size(temp1->enc,5))
 
 select into "nl:"
 pa.*
from person_alias pa
plan pa
	where pa.person_id = temp1->enc[x1].person_id
	and pa.active_ind = 1
	and pa.end_effective_dt_tm > sysdate
	and pa.person_alias_type_cd = 10
detail
   temp1->enc[x1].mrn = pa.alias
 with nocounter
 
select into "nl:"
from
     encounter e,
     address a,
     encntr_alias ea
plan e
	where e.encntr_id = temp1->enc[x1].encntr_id
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
       stat = alterlist(temp1->enc[x1].addr_qual,a_cnt)
       temp1->enc[x1].addr_qual[a_cnt].line = a.street_addr
   endif
   if (a.street_addr2 > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(temp1->enc[x1].addr_qual,a_cnt)
       temp1->enc[x1].addr_qual[a_cnt].line = a.street_addr2
   endif
   if (a.street_addr3 > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(temp1->enc[x1].addr_qual,a_cnt)
       temp1->enc[x1].addr_qual[a_cnt].line = a.street_addr3
   endif
   if (a.street_addr4 > " ")
       a_cnt = a_cnt + 1
       stat = alterlist(temp1->enc[x1].addr_qual,a_cnt)
       temp1->enc[x1].addr_qual[a_cnt].line = a.street_addr4
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
       stat = alterlist(temp1->enc[x1].addr_qual,a_cnt)
       temp1->enc[x1].addr_qual[a_cnt].line = trim(city_state)
    temp1->enc[x1].fin =  ea.alias
with nocounter
 
 
;;**************************************
 
;	for (x2 = 1 to size(temp1->enc[x1].dept,5))
		for (x3 = 1 to size(temp1->enc[x1].ord,5))
		  ; ******** Get Order Detail *********************
		  select  into "nl:"
		  from order_detail od
		  plan od
		  	where od.order_id = temp1->enc[x1].ord[x3].order_id
        and od.action_sequence >= (select max(oa.action_sequence) from order_action oa
                                      where oa.order_id = temp1->enc[x1].ord[x3].order_id
                                      and oa.core_ind = 1)
		  	AND OD.oe_field_id IN (
		  	      12644.00,
				      12647.00,
				      12648.00,
				      12657.00,
				      12663.00,
				      12664.00,
				      12670.00,
				      12671.00,
				      12683.00,
				      12771.00,
				      12778.00,
				      12779.00,
				      12690.00,
				      12694.00,
				      12695.00,
				      12696.00,
				      12703.00,
				      12704.00,
				      12708.00,
				      12711.00,
				      12712.00,
				      12714.00,
				      12715.00,
				      12716.00,
				      12718.00,
				      12719.00,
				      12720.00,
				      12721.00,
				      12723.00,
				      12731.00,
				      12732.00,
				      12684.00,
				     633581.00,
				     633585.00,
				     633589.00,
				     633590.00,
				     633597.00,
				     633598.00,
				     633599.00,
				     634308.00,
				     634309.00,
				     634311.00,
				      12583.00,
				      12584.00,
				      12590.00,
				      12594.00,
				      12606.00,
				      12613.00,
				      12625.00,
				     666944.00,
				     663785.00,
				     663786.00,
				     663799.00,
				     663838.00,
				     683608.00,
				     683605.00,
				     683606.00,
				    3462507.00,
				    3462509.00,
				    3590509.00,
				    3590521.00,
				    3968527.00,
				    6508509.00,
				    6508510.00,
				    7658709.00,
				   24114614.00,
				   24114615.00,
				   24114660.00,
				   54651493.00,
				   7466936.00
				   )
      and od.oe_field_display_value > " "
         and not od.oe_field_meaning in ("STOPTYPE",
                                         "PHYSICIANADDRESSID",
                                         "FREQSCHEDID",
                                         "PRINTLBL"
                                         )
		  order by od.order_id,od.action_sequence,od.detail_sequence
;		  head od.order_id
head report
		     detail_line = ""
		     sep = " "
		  detail
		     IF (OD.OE_FIELD_MEANING IN (
		    	"BASALRATEUNIT",
					"DISPENSEQTYUNIT",
					"DOSELIMITUNIT",
					"DOSEQTYUNIT",
					"DOSETIMELIMITUNIT",
					"DURATIONUNIT",
					"INFUSEOVERUNIT",
					"LOADINGDOSEUNIT",
					"LOCKOUTINTUNIT",
					"NORMALIZEDRATEUNIT",
					"PCADOSEUNIT",
					"RATEUNIT",
					"REPLACEEVERYUNIT",
					"RXACETATEUNIT",
					"RXCALCACETATEUNIT",
					"RXCALCCALCIUMUNIT",
					"RXCALCCHLORIDEUNIT",
					"RXCALCIUMUNIT",
					"RXCALCMAGNESIUMUNIT",
					"RXCALCPHOSPHATEUNIT",
					"RXCALCPOTASSIUMUNIT",
					"RXCALCSODIUMUNIT",
					"RXCHLORIDEUNIT",
					"RXMAGNESIUMUNIT",
					"RXPHOSPHATEUNIT",
					"RXPOTASSIUMUNIT",
					"RXREQDISPENSEDURATIONUNIT",
					"RXSODIUMUNIT",
					"SAMPLEQTYUNIT",
					"STRENGTHDOSEUNIT",
					"VOLUMEDOSEUNIT",
					"WEIGHTUNIT"
					))
    		     detail_line = concat(trim(detail_line,3)," ",
    		                         trim(od.oe_field_display_value,3))
    		  ELSEIF (OD.OE_FIELD_MEANING = "CONSTANTIND")
		     		detail_line = concat(trim(detail_line,3),trim(sep)," ","Constant Indicator")
 
				 elseif (od.oe_field_dt_tm_value > 0)
						detail_line = concat(trim(detail_line,3),trim(sep)," ",
		                          trim(uar_get_code_display(od.oe_field_id),3),": ",
		                          trim(format(od.oe_field_dt_tm_value, "mm/dd/yyyy hh:mm:ss;;d")),
		                          " ",trim(disp_zone))
 
         else
		     detail_line = concat(trim(detail_line,3),trim(sep)," ",
		                          trim(uar_get_code_display(od.oe_field_id),3),": ",
		                          trim(od.oe_field_display_value,3))
		     endif
		     sep = ","
		     call echo("detail_line")
		     call echo (concat('"',trim(detail_line),'"'))
		     call echo("oe_field_display_value")
		     call echo(od.oe_field_meaning)
		     call echo (od.oe_field_display_value)
		  foot od.order_id
		     temp1->enc[x1].ord[x3].ORD_DETAIL = trim(detail_line)
		  with nocounter
			; *******  GET ordering physician  *******
			select  into "nl:"
			from order_action oa,
			PERSON P
			plan oa
				where oa.order_id = temp1->enc[x1].ord[x3].order_id
				and oa.action_type_cd = action_type_cd
			JOIN P
				WHERE P.person_id = OA.order_provider_id
			DETAIL
				temp1->enc[x1].ord[x3].ord_phys_id = OA.order_provider_id
				temp1->enc[x1].ord[x3].ord_phys_name = P.name_full_formatted
			WITH NOCOUNTER
 
			; *******  GET order Comments  *******
			select  into "nl:"
			from order_comment oc,
			long_text lt
			plan oc
				where oc.order_id = temp1->enc[x1].ord[x3].order_id
				and oc.comment_type_cd = ord_comment_cd
			join lt
				where lt.long_text_id = oc.long_text_id
			detail
				temp1->enc[x1].ord[x3].comments = lt.long_text
			with nocounter
 			set temp1->enc[x1].ord[x3].comments = replace(temp1->enc[x1].ord[x3].comments,
 			                                                       lf," ",0)
 
		endfor ;x3
;	endfor ;x2
endfor ;x1
call echo ("at end of file")
call echorecord(temp1)
call echo (build("addr_qual =", size(temp1->enc[1].addr_qual,5)))
 
  set lidx = 0
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
if (size(temp1->enc,5)>0)
 
	Execute reportrtl
 
%i ccluserdir:pel_get_orders.dvl
	set _SendTo=pdf_file_name ; $1
;	set _SendTo=$outdev
 
	;;if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
	;;  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
	;;  set _SendTo = concat(_SendTo,".dat")
	;;endif
	;
	call LayoutQuery(0)
 
	;; select into $outdev
	;;    status =  substring(1,25,temp1->enc[1].ord[d.seq].status),
	;;    catalog_type = substring(1,25,temp1->enc[1].ord[d.seq].cat_type),
	;;    start_date = temp1->enc[1].ord[d.seq].dt_tm,
	;;    orderable = substring(1,255,temp1->enc[1].ord[d.seq].name),
	;;    order_detail = substring(1,255,temp1->enc[1].ord[d.seq].ord_detail),
	;;    provider = substring(1,50,temp1->enc[1].ord[d.seq].ord_phys_name),
	;;    order_dt_tm = temp1->enc[1].ord[d.seq].dt_tm
	;;    , COMMENTS = substring(1,255,temp1->enc[1].ord[d.seq].comments)
	;; from (dummyt d with seq = size(temp1->enc[1].ord,5))
	;;
	;;
	;;
	;;
	;;with nocounter, SEPARATOR = " ", FORMAT
 
 
	select into value(idx_file_name) ; "mayo_test_orders_index.idx"
		dos = format(temp1->enc[1].admit_dt_tm,"yyyymmdd;;d"),
		dob = format(temp1->enc[1].birth_dt_tm,"yyyymmdd;;d"),
		sex = substring(1,1,temp1->enc[1].sex)
		,LNAME = substring(1,50,temp1->enc[1].NAME_LAST_KEY)
		,FNAME = substring(1,50,temp1->enc[1].NAME_FIRST_KEY)
		,MNAME = substring(1,50,temp1->enc[1].name_middle_key)
		,MRN = substring(1,15,temp1->enc[1].mrn)
		,FIN  = substring(1,15,temp1->enc[1].fin)
		,wars_disp = concat(trim(substring(1,5,wars_code),3),"-LMARC")
 
 
	from (dummyt d with seq = size(temp1->enc,5))
	;head report
	;  dis_line = fillstring(
	detail
	  DIS_LINE = CONCAT("DOS=",TRIM(DOS,3))
	  col 0, DIS_LINE ; "DOS=",TRIM(DOS,3)
	  ROW + 1
;	  COL 0 "DOCSRCE=EUBM-LMARC"
    col 0 "DOCSRCE=", wars_disp
	  ROW +1
	  COL 0 "PTFRSTNM=", FNAME
	  ROW +1
	  COL 0 "PTMIDDNM=", MNAME
	  ROW +1
	  COL 0 "PTLASTNM=", LNAME
	  ROW +1
	  COL 0 "MRN=", MRN
	  ROW +1
	  COL 0 "FINNO=", FIN
	  ROW +1
	  COL 0 "GENDER=", SEX
	  ROW +1
	  COL 0 "PTDOB=", DOB
	  ROW +1
	  COL 0 "SLEVEL=4000"
	WITH NOCOUNTER,format = variable
endif
 
# exit_program
free record temp1
 
 
end
go
