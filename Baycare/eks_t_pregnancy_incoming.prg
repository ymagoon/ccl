drop program eks_t_pregnancy_incoming go
create program eks_t_pregnancy_incoming
 
set eksmodule = trim(eks_common->cur_module_name)
 
call echo(concat("****  ",format(curdate,"dd-mmm-yyyy;;d")," ",format(curtime3,"hh:mm:ss.cc;3;m")
				 ,"     Module:  ",trim (eksmodule),"  ****"),1,0)
 
set retval = 100
 
end
go
 
