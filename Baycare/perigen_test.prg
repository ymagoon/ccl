drop program perigen_test go
create program perigen_test
 
record oenorgmsg (
  1 msg = vc
)
 
set oenorgmsg->msg =
  build("MSH|^~\&|PHILIPS|XCELERA|POSTIMAGE|CHF|20191031095639||ORU^R01|65ed3eb2201910310956|P|2.3||||||8859/1"
       , char(13),"PID|||300841034^^^^BCCPI||MQNE^OBWS||19611012|M||||||||||4970853^^^^BMGFN"
       , char(13),"ORC|RE|17813356149|17813356149"
       , char(13),"OBR|1|17813356149|17813356149|DUPLEVC|||201910310952|||||||||||||||201910310956||MDOC|F"
       , char(13),"ZDS|R|MS003997^Amin^Mahesh^^^^^^^^^^BayCare Dr Number|201910310956|E"
       , char(13),"OBX|1|TX|DUPLEVC|1|SAH IMMEDIATE||||||F|||201910310956")
 
call echorecord(oenorgmsg)
 
 
execute op_perigen_esi; with replace("REQUEST",trkfn_add_upd_events)
 
end
go
 execute perigen_test go
 
