/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_updt_oen_personality.prg
 *  Object Name:  fsi_updt_oen_personality
 *
 *  Description:  This program is called from fsi_read_excel and passed a requestin record
 *			      structure containing a list of OEN personality traits. This program compares
 *			      this list against the environment and updates all ComServers.
 *
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Creation Date:  11/01/2018
 *  ---------------------------------------------------------------------------------------------
 *  Mod#    Date          Author               Description & Requestor Information
 *  0	    11/01/2018    Yitzhak Magoon       Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/
 
drop program fsi_updt_oen_personality go
create program fsi_updt_oen_personality
 
/*
record requestin (
  1 list_0[*]
    2 interfaceid = vc
    2 proc_name = vc
    2 outputfilepattern = vc
    2 inputfilepattern = vc
    2 port = vc
    2 remotehost = vc
    2 batch_backup_dir = vc
    2 remote_domain = vc
    2 base_custom_file_path = vc
)
*/

set trace = rdbbind
set trace = rdbdebug

; Build the record structure that wll be used to during the update process
record data (
  1 interfaces [*]
    2 interfaceid				= i4	;pre populated from the file
    2 proc_name		 			= c32	;pre populated from the file
    2 outputfilepattern			= vc	;pre populated from the file
    2 inputfilepattern			= vc	;pre populated from the file
    2 port						= vc	;populated  from the select statement
    2 remotehost				= vc
    2 batch_backup_dir			= vc
    2 remote_domain				= vc
    2 base_custom_file_path		= vc
)

call echorecord(requestin)

set num = 0

;load the record structure based on matches found between the requestin.procname and oen_procinfo.proc_name.
;The date in the "data" record set will be the IP/Port information prior to the domain refresh.
select
  o.interfaceid
from
  oen_procinfo o
plan o
  where expand(num,1,size(requestin->list_0,5),o.proc_name,requestin->list_0[num].proc_name)
order by
  o.interfaceid

head report
  cnt = 0
  stat = alterlist(data->interfaces,size(requestin->list_0,5))
;head o.interfaceid
detail
  cnt = cnt + 1
  
  pos = locateval(num,1,size(requestin->list_0,5),o.proc_name,trim(requestin->list_0[num].proc_name,3))
  
  data->interfaces[cnt].interfaceid = o.interfaceid
  data->interfaces[cnt].proc_name = requestin->list_0[pos].proc_name
  data->interfaces[cnt].outputfilepattern = requestin->list_0[pos].outputfilepattern
  data->interfaces[cnt].inputfilepattern = requestin->list_0[pos].inputfilepattern 
  data->interfaces[cnt].port = requestin->list_0[pos].port
  data->interfaces[cnt].remotehost = requestin->list_0[pos].remotehost
  data->interfaces[cnt].batch_backup_dir = requestin->list_0[pos].batch_backup_dir
  data->interfaces[cnt].remote_domain = requestin->list_0[pos].remote_domain
  data->interfaces[cnt].base_custom_file_path = requestin->list_0[pos].base_custom_file_path
with nocounter
 
call echorecord(data)

;update outputfilepattern
update into 
  oen_personality op
  , (dummyt d with seq = value(size(data->interfaces,5)))
set
  op.value = trim(requestin->list_0[d.seq].outputfilepattern,3)
plan d
  where data->interfaces[d.seq].outputfilepattern != null
join op
  where op.interfaceid = data->interfaces[d.seq].interfaceid
    and op.name = "OUTPUTFILEPATTERN"
with nocounter

;update inputfilepattern
update into 
  oen_personality op
  , (dummyt d with seq = value(size(data->interfaces,5)))
set
  op.value = trim(requestin->list_0[d.seq].inputfilepattern,3)
plan d
  where data->interfaces[d.seq].inputfilepattern != null
join op
  where op.interfaceid = data->interfaces[d.seq].interfaceid
    and op.name = "INPUTFILEPATTERN"
with nocounter

;update port
update into 
  oen_personality op
  , (dummyt d with seq = value(size(data->interfaces,5)))
set
  op.value = trim(requestin->list_0[d.seq].port,3)
plan d
  where data->interfaces[d.seq].port != null
join op
  where op.interfaceid = data->interfaces[d.seq].interfaceid
    and op.name = "PORT"
with nocounter

;update remotehost
update into 
  oen_personality op
  , (dummyt d with seq = value(size(data->interfaces,5)))
set
  op.value = trim(requestin->list_0[d.seq].remotehost,3)
plan d
  where data->interfaces[d.seq].remotehost != null
join op
  where op.interfaceid = data->interfaces[d.seq].interfaceid
    and op.name = "REMOTEHOST"
with nocounter

end
go

 
