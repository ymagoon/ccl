/* 	*******************************************************************************
 
	Script Name:	pfiz_historical_data_v3.prg
	Description:	Report displays the historical data on subjects based on input
					provided by the user.
					A file is generated that can then be uploaded into EP Evaluator
					for further analysis.
 
	Date Written:	November 18, 2016
	Written By:		Yitzhak Magoon
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By				Comment
	---	-----------	---------------	---------------------------------------------------
 	001	Nov 18 2016 Yitzhak Magoon  Initial release
	******************************************************************************* */
 
drop program pfiz_historical_data_v3 go
create program pfiz_historical_data_v3
 
prompt
	"Output to File/Printer/MINE" = "MINE"                               ;* Enter or select the printer or file name to send this
	, "Select the section to filter tests returned on the report" = ""
	, "Select the test(s) to exclude from the report" = 0
	, "Select the species" = 0
	, "Select the sex" = ""
	, "Start Date" = "SYSDATE"
	, "End Date" = "SYSDATE"
 
with OUTDEV, section, test_exclude, species, sex, from_dt, to_dt
 
/**************************************************************
; Declare variables and record structures
**************************************************************/

Set Trace RDBDEBUG 
 
set cvMALE = uar_get_code_by("MEANING",57,"MALE")
set cvFEMALE = uar_get_code_by("MEANING",57,"FEMALE")
 
; Translate prompt values
if ($sex != char(42)) ;if not * then
  if (cnvtint($sex) = cnvtint(cvMALE))
	set cvFEMALE = cvMALE
  else
	set cvMALE = cvFEMALE
  endif
endif
 
free record data
 
record data (
  1 count							= i4
  1 plist[*]
    2 person_id						= f8
    2 encntr_id						= f8
    2 species_cd					= f8
    2 sex_cd						= f8
    2 unique_id						= c20
    2 subject_id					= c20
    2 protocol						= c20
    2 site							= f8
    2 dose							= c15
    2 dose_group					= f8
    2 tmptcnt						= i4
    2 olist[*]
      3 order_id					= f8
      3 catalog_cd					= f8
      3 tmpts						= c12 ;?
      3 timepoint					= c15
      3 aob_at_coll					= c20
      3 accession					= c20
      3 collect_dt_tm				= dq8
      3 dtacnt						= i4
      3 rlist[*]
        4 clinical_event_id			= f8
        4 result_id					= f8
        4 assay						= c30
  		4 task_assay_cd				= f8
  		4 service_resource_cd		= f8
  		4 serv_res_loc				= c2
  		4 result					= c30
  		4 units						= f8
  		4 result_comment			= vc
  		4 cmt_abbrev				= c3
  		4 sort_date					= c12
)
 
free record test
 
record test (
  1 data[*]
    2 task_assay_cd					= f8
    2 assay							= c30
    2 sequence						= f8
)
 
 
declare volunteer_cd = f8 with constant(value(uar_get_code_by("DISPLAYKEY",263,"VOLUNTEERTATTOOPOOL")))
declare pfizerid_cd = f8 with constant(value(uar_get_code_by("DISPLAYKEY",263,"PFIZERIDPOOL")))
declare discovery_cd = f8 with constant(value(uar_get_code_by("DISPLAYKEY",263,"DISCOVERYMRNPOOL")))
 
declare fin_alias_cd = f8 with constant(value(uar_get_code_by("MEANING",319,"FIN NBR")))
declare mrn_alias_cd = f8 with constant(value(uar_get_code_by("MEANING",4,"MRN")))
 
declare completed_cd = f8 with constant(value(UAR_GET_CODE_BY("MEANING",6004,"COMPLETED")))
 
declare num 		 = i4
declare strngHldr 	 = vc
declare resPtr		 = i4
declare pos			 = i4
 
/***********************************************************************
; Populate test record structure with list of tests from CVM table
************************************************************************/
 
select into "nl:"
  task_assay_cd = cvm.task_assay_cd
  , assay 		= uar_get_code_display(cvm.task_assay_cd)
  ;, seq			= cvm.param_order
from
  cerner_vsf_map cvm
where
  cvm.parameter_type = $section
order by
  assay
head report
  tCnt = 0
detail
  tCnt = tCnt + 1
 
  if (mod(tCnt,10) = 1)
    stat = alterlist(test->data, tCnt + 9)
  endif
 
  test->data[tCnt].task_assay_cd = task_assay_cd
  test->data[tCnt].assay		 = assay
 ; test->data[tCnt].sequence		 = sequence
foot report
  stat= alterlist(test->data,tCnt)
with nocounter
 
call echorecord(test)
 
/***********************************************************************
; Main select to popualte data record structure
************************************************************************/
 
select into "nl:"
  person_id 			= p.person_id
  , encntr_id			= e.encntr_id
  , species_cd			= p.species_cd
  , sex_cd				= p.sex_cd
  , protocol			= o.org_name
  , site				= e.loc_facility_cd
  , dose				= e.referring_comment
  , dose_group			= e.encntr_type_cd
 
  , order_id			= ord.order_id
  , catalog_cd			= ord.catalog_cd
  , timepoint			= od.oe_field_display_value
  , aob_at_coll			= cnvtage(p.birth_dt_tm, c.drawn_dt_tm, 0)
  , accession			= concat(substring(8,2,ce.accession_nbr), "-",
  							 	 substring(10,3,ce.accession_nbr), "-",
  							 	 substring(15,4,ce.accession_nbr))
  , collect_dt_tm		= c.drawn_dt_tm
 
  , clinical_event_id 	= ce.clinical_event_id
  , result_id			= r.result_id
  , assay				= uar_get_code_display(ce.task_assay_cd)
  , task_assay_cd		= ce.task_assay_cd
  , service_resource_cd = ce.resource_cd
  , serv_res_loc		= substring(1,2,uar_get_code_display(ce.resource_cd))
  , result				= ce.result_val
  , units				= ce.result_units_cd
  , sort_date			= format(ce.updt_dt_tm, "YYYYMMDDHHMMSS;;Q")
 
from
	 person			   p
	, encounter        e
	, orders		   ord
	, clinical_event   ce
	, result		   r
	, ce_specimen_coll csc
	, container		   c
	, organization	   o
	, order_detail	   od
 
plan p
  where p.species_cd = $species
    and p.sex_cd in (cvMALE, cvFEMALE)
join e
  where e.person_id = p.person_id
 
join o
  where o.organization_id = e.organization_id
    and cnvtupper(o.org_name) != "Z*"
 
join ord
  where ord.encntr_id = e.encntr_id
    and ord.order_status_cd = completed_cd
 
join od
  where od.order_id = ord.order_id
    and od.oe_field_meaning = "DCDISPLAYDAYS"
    and od.oe_field_id = 12785
    and od.action_sequence = (select max(od1.action_sequence)
							  from order_detail od1
							  where od1.oe_field_id = od.oe_field_id
							  and od1.order_id = od.order_id)
 
join ce
  where ce.order_id = ord.order_id
    and ce.task_assay_cd != 0
    and ce.task_assay_cd in (select cvm.task_assay_cd
            				from cerner_vsf_map cvm
            				where cvm.vsf_test_name != "EXCLUDE"
            				and cvm.parameter_type in ($section))
    and ce.task_assay_cd not in ($test_exclude)
    and ce.result_val > ' '
    and ce.updt_dt_tm between cnvtdatetime($from_dt)
    and cnvtdatetime($to_dt)
    and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
 
join r
  where ce.task_assay_cd = r.task_assay_cd
    and ce.order_id = r.order_id
    and r.result_id > 0
join csc
  where csc.event_id = ce.event_id
;	and csc.updt_dt_tm between cnvtdatetime($from_dt)
;    and cnvtdatetime($to_dt)
 
join c
  where c.container_id = csc.container_id
 
order by
  site
  , sex_cd desc
  , person_id
  , dose_group
  , timepoint
  , assay
 
head report
  pCnt = 0
  oCnt = 0
  rCnt = 0
 
head person_id
  pCnt = pCnt + 1
 
  if (mod(pCnt,100) = 1)
    stat = alterlist(data->plist,pCnt + 99)
  endif
 
  data->plist[pCnt].person_id = person_id
  data->plist[pCnt].encntr_id = encntr_id
  data->plist[pCnt].species_cd = species_cd
  data->plist[pCnt].sex_cd = sex_cd
  data->plist[pCnt].protocol = protocol
  data->plist[pCnt].site = site
  data->plist[pCnt].dose = dose
  data->plist[pCnt].dose_group = dose_group
 
  oCnt = 0
 
head timepoint
  oCnt = oCnt + 1
 
  if (mod(oCnt,10) = 1)
    stat = alterlist(data->plist[pCnt].olist,oCnt + 9)
  endif
 
  data->plist[pCnt].olist[oCnt].order_id = order_id
  data->plist[pCnt].olist[oCnt].catalog_cd = catalog_cd
  data->plist[pCnt].olist[oCnt].timepoint = timepoint
  data->plist[pCnt].olist[oCnt].aob_at_coll = aob_at_coll
  data->plist[pCnt].olist[oCnt].accession = accession
  data->plist[pCnt].olist[oCnt].collect_dt_tm = collect_dt_tm
 
  rCnt = 0
detail
  rCnt = rCnt + 1
 
  if (mod(rCnt,10) = 1)
    stat = alterlist(data->plist[pCnt].olist[oCnt].rlist,rCnt + 9)
  endif
 
  data->plist[pCnt].olist[oCnt].rlist[rCnt].clinical_event_id = clinical_event_id
  data->plist[pCnt].olist[oCnt].rlist[rCnt].result_id = result_id
  data->plist[pCnt].olist[oCnt].rlist[rCnt].assay = assay
  data->plist[pCnt].olist[oCnt].rlist[rCnt].task_assay_cd = task_assay_cd
  data->plist[pCnt].olist[oCnt].rlist[rCnt].service_resource_cd = service_resource_cd
  data->plist[pCnt].olist[oCnt].rlist[rCnt].serv_res_loc = serv_res_loc
  data->plist[pCnt].olist[oCnt].rlist[rCnt].result = result
  data->plist[pCnt].olist[oCnt].rlist[rCnt].units = units
  data->plist[pCnt].olist[oCnt].rlist[rCnt].sort_date = sort_date
 
foot timepoint
  data->plist[pCnt].olist[oCnt].dtacnt = rCnt
  stat = alterlist(data->plist[pCnt].olist[oCnt].rlist,rCnt)
 
foot person_id
  stat = alterlist(data->plist[pCnt].olist,oCnt)
 
foot report
  stat = alterlist(data->plist,pCnt)
 
with nocounter/*orahintcbo(" GATHER_PLAN_STATISTICS "),*/
 
call echorecord(data)
 
/***********************************************************************
; Load unique ID for each animal into data record structure
************************************************************************/
 
select into "nl:"
  unique_id = pa.alias
from
  person_alias pa
where expand(num,1,size(data->plist,5),pa.person_id,data->plist[num].person_id)
  and pa.person_alias_type_cd = mrn_alias_cd
  and pa.alias_pool_cd in (volunteer_cd, pfizerid_cd, discovery_cd)
detail
  pos = locateval(num,1,size(data->plist,5),pa.person_id,data->plist[num].person_id)
 
  data->plist[pos].unique_id = unique_id
 
with nocounter
  ;end add unique_id
 
/***********************************************************************
; Load subject ID for each animal into record structure
************************************************************************/
 
select into "nl:"
  subject_id = ea.alias
from
  encntr_alias ea
where expand(num,1,size(data->plist,5),ea.encntr_id,data->plist[num].encntr_id)
  and ea.encntr_alias_type_cd = fin_alias_cd
detail
  pos = locateval(num,1,size(data->plist,5),ea.encntr_id,data->plist[num].encntr_id)
 
  data->plist[pos].subject_id = subject_id
with nocounter
 
/***********************************************************************
; Load result ID and comment information into record structure
************************************************************************/
 
select into "nl:"
  result_comment = lt.long_text
  , cmt_abbrev = substring(1,2,lt.long_text)
from
  result_comment rc
  , long_text lt
  , (dummyt d1 with seq = value(size(data->plist,5)))
  , (dummyt d2 with seq = 1)
  , (dummyt d3 with seq = 1)
 
plan d1 where maxrec(d2, size(data->plist[d1.seq].olist,5))
join d2 where maxrec(d3, size(data->plist[d1.seq].olist[d2.seq].rlist,5))
join d3
join rc
  where rc.result_id = data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].result_id
    and rc.long_text_id = (select max(rc2.long_text_id)
    					   from result_comment rc2
    					   where rc2.result_id = rc.result_id)
 
join lt
  where lt.long_text_id = rc.long_text_id
 
detail
  data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].result_comment = result_comment
  data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].cmt_abbrev = cmt_abbrev
with nocounter
 
call echorecord(data)
 
/***********************************************************************
; Output data from data and test record structures into a CSV file
************************************************************************/
 
set output = build('cust_reports:rr_',cnvtlower($outdev),'.csv')
 
select into value(output);'cust_reports:rr_historical_rpt.csv'
  species 				= uar_get_code_display(data->plist[d1.seq].species_cd)
  , sex					= uar_get_code_display(data->plist[d1.seq].sex_cd)
  , site				= uar_get_code_display(data->plist[d1.seq].site)
  , unique_id			= data->plist[d1.seq].unique_id
  , protocol			= data->plist[d1.seq].protocol
  , dose_group			= uar_get_code_display(data->plist[d1.seq].dose_group)
  , dose				= data->plist[d1.seq].dose
  , timepoint			= data->plist[d1.seq].olist[d2.seq].timepoint
  , age					= data->plist[d1.seq].olist[d2.seq].aob_at_coll
  , accn				= data->plist[d1.seq].olist[d2.seq].accession
  , res					= data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].result
  , cmtabbrv			= data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].cmt_abbrev
  , service_resource	= uar_get_code_display(data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].service_resource_cd)
  , assay				= uar_get_code_display(data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].task_assay_cd)
  , task_assay_cd		= data->plist[d1.seq].olist[d2.seq].rlist[d3.seq].task_assay_cd
from
   (dummyt d1 with seq = value(size(data->plist,5)))
  , (dummyt d2 with seq = 1)
  , (dummyt d3 with seq = 1)
 
plan d1 where maxrec(d2, size(data->plist[d1.seq].olist,5))
join d2 where maxrec(d3, size(data->plist[d1.seq].olist[d2.seq].rlist,5))
join d3
 
order by
  site
  , sex desc
  , unique_id
  , dose_group
  , timepoint
  , assay
 
/***********************************************************************
; Load records returned from main SELECT statement into record structure
************************************************************************/
head report
  strngHldr = "L:Species,L:Sex,L:Site,Unique_ID,Protocol,Dose_Group,Dose,Timepoint,L:Age,ACCN"
  col 0 strngHldr
  col + 0 ","
  for (nLoop1 = 1 to size(test->data,5))
  	strngHldr = concat('"',trim(test->data[nLoop1].assay,3),'"')
	col + 0 strngHldr
	col + 0 ","
	strngHldr = BUILD('"',"Comment",nLoop1,'"')
	col + 0 strngHldr
	col + 0 ","
	strngHldr = BUILD('"',"Instrument",nLoop1,'"')
	col + 0 strngHldr
	col + 0 ","
  endfor
  row + 1
  subCount = 0
head unique_id
  subCount = subCount + 1
  tmptCount = 0
head dose_group
  tmptCount = tmptCount + 1
  resCount = 0
head timepoint
  resPtr = 1
  pos = 1
 
  strngHldr = concat('"',trim(species,3),'"')
  col 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(sex,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(site,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(unique_id,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(protocol,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(dose_group,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(dose,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(timepoint,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(age,3),'"')
  col + 0 strngHldr
  col + 0 ","
  strngHldr = concat('"',trim(accn,3),'"')
  col + 0 strngHldr
  col + 0 ","
detail
  ;find position of current assay in test record structure
  pos = locateval(num,1,size(test->data,5),task_assay_cd,test->data[num].task_assay_cd)
 
  for (idx = resPtr to pos) ;loop from last found assay +1 to current assay
    if (task_assay_cd = test->data[idx].task_assay_cd)
      resPtr = idx + 1
 
      strngHldr = concat('"',trim(res,3),'"')
      col + 0 strngHldr
	  col + 0 ","
	  strngHldr = concat('"',trim(cmtabbrv,3),'"')
	  col + 0 strngHldr
	  col + 0 ","
	  strngHldr = concat('"',trim(service_resource,3),'"')
	  col + 0 strngHldr
	  col + 0 ","
	else
      col + 0 ",,,"
    endif
  endfor
foot timepoint
	row + 1
foot report
  x = 0
with format = variable, noheading, maxrow=1, maxcol=32000
 
end
go
