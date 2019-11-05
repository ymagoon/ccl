/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  perigen_test
 *
 *  Description:  Script used to pass an HL7 message into OP_PERIGEN_ESI. All the record structures 
 *				  are dumped into the listing, so troubleshooting can take place. This script can 
 *				  be used in p30 because an ESI_LOG record and the update statements to the tables
 *                will not take place when runing this script. 
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Contact:    ymagoon@gmail.com
 *  Creation Date:  11/04/2019
 *
 *  Testing: 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  001    11/04/19  Yitzhak Magoon   Initial Release
 *  ---------------------------------------------------------------------------------------------
*/

drop program perigen_test go
create program perigen_test
 
record oenorgmsg (
  1 msg = vc
)
 
set oenorgmsg->msg =
  build("MSH|^~\&|PHILIPS|XCELERA|POSTIMAGE|CHF|20191031095639||ORU^R01|65ed3eb2201910310956|P|2.3||||||8859/1"
       , char(13),"PID|||301910810^^^^BCCPI||RSMMSAHS^FNOBZAZN||19270120|F||||||||||1108532447^^^^BCFN"
       , char(13),"ORC|RE|17813356149|17813356149"
       , char(13),"OBR|1|17813356149|17813356149|DUPLEVC|||201910310952|||||||||||||||201910310956||MDOC|F"
       , char(13),"ZDS|R|MS003997^Amin^Mahesh^^^^^^^^^^BayCare Dr Number|201910310956|E"
       , char(13),"OBX|1|TX|DUPLEVC|1|SAH IMMEDIATE||||||F|||201910310956")
 
call echorecord(oenorgmsg)
 
 
execute op_perigen_esi
 
end
go
 execute perigen_test go
