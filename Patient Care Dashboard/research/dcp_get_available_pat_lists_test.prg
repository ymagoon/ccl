drop program dcp_get_available_pat_lists_test go
create program dcp_get_available_pat_lists_test

record request600142 (
  1 prsnl_id = f8   
) 

set trace rdbbind
set trace rdbdebug
set trace recpersist

set request600142->prsnl_id = 13964820

execute dcp_get_available_pat_lists with replace("REQUEST",request600142)

call echorecord(reply)

set json = cnvtrectojson(reply)
set json2 = trim (replace (json ,"}" ,"" ,2 ) ,3 )

call echo(json)
call echo(json2)
call echojson(reply)

end
go
  execute ym_test go

