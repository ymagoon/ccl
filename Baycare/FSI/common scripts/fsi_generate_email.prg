/* 	*******************************************************************************
 
	Script Name:	fsi_generate_email.prg
	Description:	Generate an email
 
	Date Written:	February 2, 2019
	Written By:		Yitzhak Magoon
 
	Executed from:	Other programs
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By			Comment
	---	-----------	-----------	---------------------------------------------------
 
	******************************************************************************* */
 
drop program fsi_generate_email go
create program fsi_generate_email
 
;$1 subject
;$2 body of email
;$3 email
 
declare subject = vc
declare body = vc
declare emailaddrs = vc
 
set subject = concat("'",$1,"'")
set body = concat("'",$2,"'")
set emailaddrs = build2($3)
 
set mailStatus = 0
 
call echo(build2('echo ', body, ' | mail -s ', subject," ",emailaddrs))
 
set mailCmd2 = build2('echo ', body, ' | mail -s ', subject, " ",emailaddrs)
 
call dcl(mailCmd2,size(mailCmd2),mailStatus) ;send email address
 
end
go
 
