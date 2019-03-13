/*****************************************************************************
 
        Source file name:       fsi_hl7_extract.prg
        Object name:            fsi_hl7_extract
 
        Program purpose:        Extract HL7 messages and write them to a file
 
        Tables read:            oen_txlog, oen_procinfo
 
        Author:        			Yitzhak Magoon
 
        Date:       			03/13/2019
 
******************************************************************************/
;~DB~*************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG               *
;    *************************************************************************
;    *                                                                       *
;    *Mod Date     Engineer             Comment                              *
;    *--- -------- -------------------- ------------------------------------ *
;     000 03/13/19 Yitzhak Magoon       Initial Release                      *
;																			 *
;~DE~*************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************
 
drop program fsi_hl7_extract go
create program fsi_hl7_extract
 
prompt
	"Output to File/Printer/MINE" = "MINE"          ;* Enter or select the printer or file name to send this report to.
	, "Select interface to extract data from" = 0
	, "Select Begin Date" = "SYSDATE"
	, "Select End Date" = "SYSDATE"
	, "Maxrec =" = 5000                             ;* Valid range from 1 to 100,000
 
with OUTDEV, proc_id, beg_dt_tm, end_dt_tm, max
 
 
declare proc_id = vc with noconstant("")
 
record msg (
  1 qual[*]
    2 msgtext = vc
    2 before_text = vc
    2 msgsize = i2
    2 tx_key = vc
)
 
/*****************************************************************
;                          GATHER DATA                           *
******************************************************************/
 
call echo(build("$proc_id=",$proc_id))
call echo(patstring(concat("*",cnvtstring($proc_id),"*")))
 
select ot.msg_text
from
  oen_txlog ot,
  oen_procinfo op
plan ot
  where ot.create_dt_tm >= cnvtdatetime($beg_dt_tm)
  and ot.create_dt_tm < cnvtdatetime($end_dt_tm)
  and ot.interfaceid = patstring(build("*",$proc_id,"*"))
join op
  where op.interfaceid = outerjoin(cnvtreal(ot.interfaceid ))
head report
  cnt = 0
  outbuf = fillstring (32767 ," " )
detail
  cnt = cnt + 1
 
  if (cnt >= size(msg->qual,5))
    stat = alterlist(msg->qual, cnt + 1000)
  endif
 
  msg->qual[cnt].before_text = ot.msg_text
  msg->qual[cnt].tx_key = ot.tx_key
 
  offset = 0
  retlen = 1
 
  while (retlen > 0)
    retlen = blobget(outbuf ,offset ,ot.msg_text)
    offset = offset + retlen
 
 	;build the hl7 message
    msg->qual[cnt].msgtext = notrim(concat(notrim(msg->qual[cnt].msgtext), notrim(substring(1,retlen, outbuf))))
  endwhile
 
  msg->qual[cnt].msgsize = size(msg->qual[cnt].msgtext,5)
foot report
  stat = alterlist(msg->qual, cnt)
with nocounter, maxrec = value($max)
 
;call echorecord(msg)
 
/*****************************************************************
;                  OUTPUT DATA TO FILE                           *
******************************************************************/
set filename = build("ccluserdir:fsi_hl7_extract_",$proc_id,"_",format(curdate,"mmddyy;;d"),format(curtime3,"hhmmss;;m"),".txt")
call echo (filename)
 
select into value(filename)
  msg = msg->qual[d.seq].msgtext
from
  (dummyt d with seq = size(msg->qual,5))
plan d
with nocounter
 
/*****************************************************************
;                    OUTPUT TO SCREEN                            *
******************************************************************/
select into $outdev
  path = filename
  , proc_id = cnvtstring($proc_id)
from
  (dummyt d with seq = 1)
plan d
detail
  col 0 "Report complete. File generated to: "
  row + 1
  col 0 path
  row + 1
  col 0 curnode
with nocounter
 
end
go
 
