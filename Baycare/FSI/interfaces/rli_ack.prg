/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:STD_RLN_SPACES_ACK
 *  Description:  Ack script 
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 *  Domain:  
 *  Creation Date:  6/1/2012 12:21:05 PM
 *  ---------------------------------------------------------------------------------------------
 */
;;;;;;;;;;;;;;;;;;;
;; variable declaration
;;;;;;;;;;;;;;;;;;;
record msh
 (
   1  segment   = c1000
   1  sid               = c3
   1  field_separator   = c1
   1  encoding_char     = c4
   1  sending_app       = c100
   1  sending_fac       = c100
   1  receiving_app     = c100
   1  receiving_fac     = c100
   1  date_time         = c100
   1  security  = c100
   1  message_type      = c100
   1  control_id        = c100
   1  processing_id     = c100
   1  version_id        = c5
 )

record ack
 (
   1  msg               =c1000
 )

set msh = fillstring(1913," ")          ; init string space
set ack->msg = fillstring(1000," ")     ; init string space
set EOSD = char(13)             ; Define the end of segment delimiter

;;;;;;;;;;;;;;;;;;;
;; Parse out the MSH from the message (taken from oen_create_ack)
;;;;;;;;;;;;;;;;;;;

  set mp = findstring( "MSH", oen_request->org_msg)
  if (mp = 0 )
    set oen_reply->ack_status = 0
    execute oencpm_msglog "MSH segment not found"
    go to NAK_EXIT
  endif

;; Now look for the end of segment delimiter
  set sdp = findstring (EOSD, oen_request->org_msg, mp)
  if (sdp = 0)
    set oen_reply->ack_status = 0
    execute oencpm_msglog "MSH end of segment delimiter not found"
    go to NAK_EXIT
  endif

;; Got it. Get entire segment and store it
  set msh->segment = substring(mp, sdp-mp+1, oen_request->org_msg)

;;;;;;;;;;;;;;;;;;;
;; Parse segment into msh record
;;;;;;;;;;;;;;;;;;;

; SID and characters
  set msh->sid = "MSH"
  set msh->field_separator = substring(4,1,msh->segment)
  set msh->encoding_char = substring(5,4,msh->segment)

; SENDING APPLICATION
  set sp = 10
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->sending_app = substring(sp,(ep-sp),msh->segment)

; SENDING FACILITY
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->sending_fac = substring(sp,(ep-sp),msh->segment)

; RECEIVING APPLICATION
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->receiving_app = substring(sp,(ep-sp),msh->segment)

; RECEIVING FACILITY
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->receiving_fac = substring(sp,(ep-sp),msh->segment)

; DATE and TIME
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->date_time = substring(sp,(ep-sp),msh->segment)

; SECURITY
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->security = substring(sp,(ep-sp),msh->segment)

; MESSAGE TYPE
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->message_type = substring(sp,(ep-sp),msh->segment)

; CONTROL ID
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->control_id = substring(sp,(ep-sp),msh->segment)

; PROCESSING_ID
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->processing_id = substring(sp,(ep-sp),msh->segment)

; VERSION_ID
  set sp = ep + 1
  set ep = findstring(msh->field_separator,msh->segment,sp)
  set msh->version_id = substring(sp,(ep-sp),msh->segment)

;;;;;;;;;;;;;;;;;;;
;; Build MSH segment of the ACK Message
;;;;;;;;;;;;;;;;;;;

;segment header and delimiters
 set ack->msg = build(msh->sid,msh->field_separator,trim(msh->encoding_char,3))

;sending & receiving apps and facilities
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->receiving_app,3))
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->receiving_fac,3))
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->sending_app,3))
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->sending_fac,3))

;date and time
 set ack->msg = build(ack->msg,msh->field_separator,
                      format(curdate,"YYYYMMDD;;D"),
                      format(curtime2,"######;P0"))

;security
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->security,3))

;message type
 set ack->msg = build(ack->msg,msh->field_separator,"ACK")

;control id
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->control_id,3))
;processing id
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->processing_id,3))
;version id
  ; set ack->msg = build(ack->msg,msh->field_separator,trim(msh->version_id,3))
  set ack->msg = build(ack->msg,msh->field_separator,"2.3")


;end segment
 set ack->msg = build(ack->msg,EOSD)

;;;;;;;;;;;;;;;;;;;
;;attach MSA segment of the ACK message
;;;;;;;;;;;;;;;;;;;
 set ack->msg = build(ack->msg,"MSA")
 set ack->msg = build(ack->msg,msh->field_separator,"AA")
 set ack->msg = build(ack->msg,msh->field_separator,trim(msh->control_id,3))
 set ack->msg = build(ack->msg,EOSD)

;;;;;;;;;;;;;;;;;;;
;; copy over created ack message into reply
;; and mark as successful
;;;;;;;;;;;;;;;;;;;

;set oen_reply->out_msg = build(trim(ack->msg,3),char(0))
set oen_reply->out_msg = build(trim(ack->msg),char(13),char(0))
set oen_reply->ack_status = 1

;;;;;;;;;;;
;; DONE
;;;;;;;;;;;

#NAK_EXIT