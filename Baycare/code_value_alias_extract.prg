/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  code_value_alias_extract
 *
 *  Description:  This script formats and outputs an excel file containing a list of aliases and 
 *				  descriptions for a set of defined code sets along with the corresponding HL7
 *				  field in which the data goes outbound. 
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Contact:    ymagoon@gmail.com
 *  Creation Date:  09/12/2019
 *
 *  Testing: execute code_value_alias_extract "MINE", <contrib_src_cd> go 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  000    11/08/19  Yitzhak Magoon   Initial Release
 *  ---------------------------------------------------------------------------------------------
*/

drop program code_value_alias_extract go
create program code_value_alias_extract

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Contributor Source" = 3695689425.00 

with OUTDEV, contrib_src_cd

%i cust_script:excel_common.inc

record code_set (
  1 list[*]
    2 code_set   = i2
    2 display    = vc
    2 name		 = c30
    2 segment    = vc
    2 seq        = i2
    2 code_value[*]
      3 cv       = f8
      3 alias    = vc
      3 descrip  = vc
)
declare camelCase(data = vc) = vc

set stat = alterlist(code_set->list,27)

set code_set->list.code_set = 57
set code_set->list.segment = "PID 8"

set code_set->list[2].code_set = 285
set code_set->list[2].segment = "EVN 4"

set code_set->list[3].code_set = 320
set code_set->list[3].segment = "EVN 5"

set code_set->list[4].code_set = 263
set code_set->list[4].segment = "PID 3.4.1 && 18.4.1"

set code_set->list[5].code_set = 4
set code_set->list[5].segment = "PID 3.5"

set code_set->list[6].code_set = 213 
set code_set->list[6].segment = "PID 5.7"

set code_set->list[7].code_set = 282
set code_set->list[7].segment = "PID 10"

set code_set->list[8].code_set = 15
set code_set->list[8].segment = "PID 11.6"

set code_set->list[9].code_set = 212
set code_set->list[9].segment = "PID 11.7"

set code_set->list[10].code_set = 36
set code_set->list[10].segment = "PID 15"

set code_set->list[11].code_set = 38
set code_set->list[11].segment = "PID 16"

set code_set->list[12].code_set = 49
set code_set->list[12].segment = "PID 17"

set code_set->list[13].code_set = 319
set code_set->list[13].segment = "PID 18.5"

;pid 21?

set code_set->list[14].code_set = 27
set code_set->list[14].segment = "PID 22"

set code_set->list[15].code_set = 14651
set code_set->list[15].segment = "PID 27"

set code_set->list[16].code_set = 226
set code_set->list[16].segment = "PID 35"

set code_set->list[17].code_set = 43
set code_set->list[17].segment = "PID 40.2"

set code_set->list[18].code_set = 23056
set code_set->list[18].segment = "PID 40.3"

;pv1
;patient class
set code_set->list[19].code_set = 69
set code_set->list[19].segment = "PV1 2"

;admit type
set code_set->list[20].code_set = 3
set code_set->list[20].segment = "PV1 4"

;hospital service
set code_set->list[21].code_set = 34
set code_set->list[21].segment = "PV1 10"

;preadmit test indicator
set code_set->list[22].code_set = 366
set code_set->list[22].segment = "PV1 12"

;readmission indicator
set code_set->list[23].code_set = 47
set code_set->list[23].segment = "PV1 13"

;admit source
set code_set->list[24].code_set = 2
set code_set->list[24].segment = "PV1 14"

;ambulatory status
set code_set->list[24].code_set = 5
set code_set->list[24].segment = "PV1 15"

;VIP indicator
set code_set->list[25].code_set = 67
set code_set->list[25].segment = "PV1 16"

;Encounter type
set code_set->list[26].code_set = 71
set code_set->list[26].segment = "PV1 18"

;visit number -CANNOT HAVE DUPLICATE!
;set code_set->list[27].code_set = 319
;set code_set->list[27].segment = "PV1 19"

;alias pool
;set code_set->list[22].code_set = 263
;set code_set->list[22].segment = "PV1 7.9.1"

;attending doctor (code set 333 relationship type?)
;set code_set->list[21].code_set = 320
;set code_set->list[21].segment = "PV1 7"

;Admitting Doctor
;set code_set->list[29].code_set = 320
;set code_set->list[29].segment = "PV1 17"

;nurse unit
;set code_set->list[20].code_set = 220
;set code_set->list[20].segment = "PV1 3.1"

;room
;set code_set->list[21].code_set = 220
;set code_set->list[21].segment = "PV1 3.2"

;bed
;set code_set->list[22].code_set = 220
;set code_set->list[22].segment = "PV1 3.3"

;facility
;set code_set->list[23].code_set = 220
;set code_set->list[23].segment = "PV1 3.4"

;person location type
;set code_set->list[24].code_set = 222
;set code_set->list[24].segment = "PV1 3.6"

;building
;set code_set->list[25].code_set = 220
;set code_set->list[25].segment = "PV1 3.7"



;nurse unit / point of care
;set code_set->list[27].code_set = 220
;set code_set->list[27].segment = "PV1 6.1"

;room
;set code_set->list[28].code_set = 220
;set code_set->list[28].segment = "PV1 6.2"

;bed
;set code_set->list[29].code_set = 220
;set code_set->list[29].segment = "PV1 6.3"

;facility
;set code_set->list[30].code_set = 220
;set code_set->list[30].segment = "PV1 6.4"

;person location type
;set code_set->list[31].code_set = 222
;set code_set->list[31].segment = "PV1 6.6"



;;;skipped a bunch here, shitty spec?



;temporary location
;set code_set->list[35].code_set = 220
;set code_set->list[35].segment = "PV1 11"


/*
;financial class
set code_set->list[44].code_set = 354
set code_set->list[44].segment = "PV1 20"

;courtesy code
set code_set->list[45].code_set = 16
set code_set->list[45].segment = "PV1 22"

;discharge disposition
set code_set->list[46].code_set = 19
set code_set->list[46].segment = "PV1 36"

;discharge to location
set code_set->list[47].code_set = 20
set code_set->list[47].segment = "PV1 37"

;diet type
set code_set->list[48].code_set = 18
set code_set->list[48].segment = "PV1 38"

;servicing facility
;set code_set->list[49].code_set = 220
;set code_set->list[49].segment = "PV1 39"

;account status
set code_set->list[50].code_set = 261
set code_set->list[50].segment = "PV1 41"

;pv2
;accomodation code
set code_set->list[51].code_set = 10
set code_set->list[51].segment = "PV2 2"

;transfer reason
set code_set->list[52].code_set = 285
set code_set->list[52].segment = "PV2 4"

;patient valuables
set code_set->list[53].code_set = 14751
set code_set->list[53].segment = "PV2 5"

;patient valuables location
set code_set->list[54].code_set = 14750
set code_set->list[54].segment = "PV2 6"

;visit user code
set code_set->list[55].code_set = 70
set code_set->list[55].segment = "PV2 7"

;referral source code
set code_set->list[56].code_set = 18889
set code_set->list[56].segment = "PV2 13"

;visitor status code
set code_set->list[57].code_set = 14754
set code_set->list[57].segment = "PV2 21"

;visitor protection indicator
set code_set->list[58].code_set = 87
set code_set->list[58].segment = "PV2 22"

;clinic organization name
set code_set->list[59].code_set = 334
set code_set->list[59].segment = "PV2 23"

;expected discharge disposition
set code_set->list[60].code_set = 19
set code_set->list[60].segment = "PV2 27"
*/

set trace rdbbind
set trace rdbdebug
declare num = i2

;gather the names of each code set in code_set record structure
select
  cvs.display
from
  code_value_set cvs
where expand(num,1,size(code_set->list,5),cvs.code_set,code_set->list[num].code_set)
  and cvs.code_set != 0
detail
  pos = locateval(num,1,size(code_set->list,5),cvs.code_set,code_set->list[num].code_set)
  code_set->list[pos].display = cvs.display
  code_set->list[pos].name = build(cvs.display,"-",code_set->list[pos].code_set)
with nocounter

;call echorecord(code_set)
;call echo(build("cs_zc=>",size(code_set->list,5)))
;gather all of the aliases for every code value in every code set

record lst (
  1 qual[2000]
    2 code_set = i2
    2 code_value = f8
    2 descrip = vc
)

select
  cvo.alias
  , cv.code_value
  , cv.code_set
from
  code_value cv
  , code_value_outbound cvo
plan cv
  where expand(num,1,size(code_set->list,5),cv.code_set,code_set->list[num].code_set)
    and cv.code_set != 0
join cvo
  where cvo.code_value = cv.code_value
    and cvo.contributor_source_cd = $contrib_src_cd
;order by
;  cv.code_set
;  , cvo.alias

head report
  cnt = 0
head cv.code_set
  cv_cnt = 0
  pos = locateval(num,1,size(code_set->list,5),cv.code_set,code_set->list[num].code_set)
;  stat = alterlist(code_set->list[pos].code_value,1000)
detail
  cv_cnt = cv_cnt + 1
;  cnt = cnt + 1
  
  if (cv_cnt > size(code_set->list[pos].code_value,5))
    stat = alterlist(code_set->list[pos].code_value,cv_cnt + 10)
  endif
  
  code_set->list[pos].code_value[cv_cnt].alias = cvo.alias
  code_set->list[pos].code_value[cv_cnt].cv = cv.code_value
  code_set->list[pos].code_value[cv_cnt].descrip = cv.description
  
;  lst->qual[cnt].code_set = cv.code_set
;  lst->qual[cnt].code_value = cv.code_value
;  lst->qual[cnt].descrip = cv.description
foot cv.code_set
  stat = alterlist(code_set->list[pos].code_value,cv_cnt)
  pos = 0
;foot report
;  stat = alterlist(code_set->list,cs_cnt)
  ;stat = alterlist(lst->qual,cnt)
with nocounter

call echorecord(code_set)
call echorecord(lst)

set cs_sz = size(code_set->list,5)

declare name_fixed = vc

select
  cs = code_set->list[d.seq].code_set
  , display = code_set->list[d.seq].display
  , name = code_set->list[d.seq].name
  , seq = code_set->list[d.seq].seq
from
  (dummyt d with seq = value(size(code_set->list,5)))
where
  code_set->list[d.seq].code_set != 0
order by
  display
head report
  _d1 = startWorkbook("")
  
  cs_cnt = 0
head cs
  cs_cnt = cs_cnt + 1
  pos = locateval(num,1,size(code_set->list,5),cs,code_set->list[num].code_set)
  
  segment = code_set->list[pos].segment
  
  name_fixed = trim(name)
  _d1 = startWorkSheet(name_fixed)
  _d1 = addRow(null)
  _d1 = addString(segment,~ss:StyleID="s64"~)
  _d1 = addString(" ")
  
  cv_sz = size(code_set->list[pos].code_value,5)
detail
  ;add headers
  _d1 = addRow(null)
  _d1 = addString("Abbreviation",~ss:StyleID="s63"~)
  _d1 = addString("Description",~ss:StyleID="s63"~)
  
  ;add a row for each alias
  for (cv_cnt = 1 to cv_sz)
    alias = code_set->list[pos].code_value[cv_cnt].alias
    cv = trim(cnvtstring(code_set->list[pos].code_value[cv_cnt].cv),3)
    descrip = trim(code_set->list[pos].code_value[cv_cnt].descrip,3)
    
    _d1 = addRow(null)
    _d1 = addString(alias)
    _d1 = addString(descrip)
  endfor
foot cs
  _d1 = stopWorkSheet(null)
foot report
  _d1 = stopWorkbook(null)
with nocounter

call writeWorkbook("ccluserdir:test.xml")

subroutine camelCase(data)
  declare camel_str = vc
  declare num = i2 with constant(1)
  declare notfnd = vc with constant("<not_found>")
  declare str = vc with noconstant("")

  while (str != notfnd)
    set str = piece(data,' ',num,notfnd)
    
    if (str != notfnd)
      set camel_str = concat(camel_str, " ", cnvtcap(str))
    endif

    set num = num + 1
  endwhile

  return (camel_str)
end

end
go
 execute code_value_alias_extract "MINE", 3695689425 go

