; *  ---------------------------------------------------------------------------------------------
; *  Script Name:  si_pyxis_morg_in
; *  Description:  Inbound Modify Original
; *  Type:  Open Engine Modify Original Script
; *  ---------------------------------------------------------------------------------------------
; *  Author:  RM2904
; *  Domain:  TEST7_ALPHA
; *  Creation Date:  8/23/99 11:18:09 AM
; *  ---------------------------------------------------------------------------------------------
; * 10/15/1999 ds2195 Added support for ZPM messages
; * 001 rd7983 Add code to let DFT's pass through without ZPM segment being changed to PID
; */
declare findack=i4

set findack = findstring("|ACK|",oen_request->org_msg,1)

set search_string = concat(char(13),"ZPM")
set findzpm = findstring(search_string,oen_request->org_msg,1)

set finddft = findstring("|DFT^P03|",oen_request->org_msg,1) ;001

if (findack>0)
  execute oencpm_MsgLog build("This is an ACK message", char(0))
  set oen_reply->out_msg = build("OEN_IGNORE",char(0))
elseif ((findzpm>0) and (finddft=0)) ;001
  ;Rename ZPM segment to PID segment for mapping purposes
  record temp
  (
   1 msg=vc
  )
  ;set temp->msg = trim(substring(1,65535,oen_request->org_msg))
  set temp->msg = replace(oen_request->org_msg,concat(char(13),"ZPM"),concat(char(13),"PID"),0)
  set oen_reply->out_msg=build(temp->msg,char(0))
else
  set oen_reply->out_msg=build(oen_request->org_msg,char(0))
endif