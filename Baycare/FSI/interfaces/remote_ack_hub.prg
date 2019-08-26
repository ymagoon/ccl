/*  REMOTE_ACK_HUB
 
===> interrogate inbound ACK from VISTA to see if the
          comm server status should be set to shut down or
          keep processing
 
The ack string will be in oenraw->msg and oenack->status is a
numeric value to set to indicate whether it is successful or not.
 A value of 0 in the status is considered successful and 1 is a failure.
 It will correspond to the I1 error recovery when status is set to 1.
Use the remote_acknowledgement_script personality to add script.
The expected ack will not be used if the remote ack script is configured.
 
"EXPECTED ACK" should be BLANKED out on Comm Server
Set remote_acknowledgement_script to REMOTE_ACK_INBOUND
IF we receive a CR, shut down comm server
IF we receive a CE or CA, keep server running
 
LMackie 11/17/2011
 
01/20/12 - SD5836/ss019580
Modified to only stop comserver for MSA|AE NAKs from Spaces for WIR VXU outbound.
WIR sends "soft errors" as MSA|AR and we have created error report to show client these
errors.  Also using Sams email modification to send e-mail when ComServer is stopped.
 
2/18/13 - SD5836
Modified to check if an actual ACK/NAK is being returned.  If not then shutdown the ComServer.
*/
 
declare send_email(x) = c1
 
execute oencpm_msglog(build("oenraw->msg= ",oenraw->msg,char(0)))
 
declare CR_RSP = i4 with noconstant(0)
declare CE_RSP = i4 with noconstant(0)
declare CA_RSP = i4 with noconstant(0)
declare AR_RSP = i4 with noconstant(0)
declare NO_ACK_RSP = i4 with noconstant(0)
declare the_raw_message = VC 
 
Set CR_RSP = findstring("MSA|CR",oenraw->msg)
Set CE_RSP = findstring("MSA|CE",oenraw->msg)
Set CA_RSP = findstring("MSA|CA",oenraw->msg)
Set AR_RSP = findstring("MSA|AR",oenraw->msg)
Set NO_ACK_RSP = findstring("MSA|A",oenraw->msg)
 
execute oencpm_msglog(build("CR_RSP= ",CR_RSP,char(0)))
execute oencpm_msglog(build("CE_RSP= ",CE_RSP,char(0)))
execute oencpm_msglog(build("CA_RSP= ",CA_RSP,char(0)))
execute oencpm_msglog(build("AR_RSP= ",AR_RSP,char(0)))
 
;setting oenack->status to 1 will shut down the comserver.
;setting oenack->status to 0 will not shut down the comserver.
;uncomment call send_mail(1) and fill in the <email> to receive email notifications
 
IF (CR_RSP >0)
    Set oenack->status = 1 
    ;call send_email(1)
    go to ENDOFSCRIPT
ELSEIF (CE_RSP >0)
    Set oenack->status = 0
    ;call send_email(1)
    go to ENDOFSCRIPT
ELSEIF (CA_RSP >0)
    Set oenack->status = 0 
    ;call send_email(1)
    go to ENDOFSCRIPT
ELSEIF (AR_RSP >0)
    Set oenack->status = 1 
    ;call send_email(1)
    go to ENDOFSCRIPT
ELSEIF (NO_ACK_RSP = 0) 
    Set oenack->status = 1 
    ;call send_email(1)
    go to ENDOFSCRIPT
ELSE
    Set oenack->status = 0
    go to ENDOFSCRIPT
ENDIF
 
 
subroutine send_email(dummy_var)
	CALL UAR_SEND_MAIL(
		nullterm("<email>"),  ;to
		nullterm("Received bad Ack"),  ;subject
		nullterm(build2("Raw Message:", char(10), replace(oenraw->msg, "@","")) ),  ;body
		nullterm("badack"),  ;from
		5,  ;priority
		"IPM.NOTE") ;message class
end ;/send_email
 
#ENDOFSCRIPT