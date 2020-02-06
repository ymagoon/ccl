/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_extract_oen_personality.prg
 *  Object Name:  fsi_extract_oen_personality
 *
 *  Description:  Execute the OEN personality traits that do not copy / are not the same between
 *				  environments. This program is run to create a csv file of the personality
 *				  traits. The csv file is then copied to another (or same) environment and the
 * 				  fsi_read_excel program is executed using fsi_updt_oen_personality as the script
 *                name.
 *
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Creation Date:  08/02/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#    Date          Author               Description & Requestor Information
 *  0	    08/02/2019    Yitzhak Magoon       Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/
 
drop program fsi_extract_oen_personality go
create program fsi_extract_oen_personality
 
free record data
record data (
 1 interfaces [*]
   2 interfaceid 		   = i4
   2 proc_name			   = c255
   2 outputfilepattern	   = c255
   2 inputfilepattern 	   = c255
   2 port 				   = c255
   2 remotehost 		   = c255
   2 batch_backup_dir 	   = c255
   2 remote_domain 		   = c255
   2 base_custom_file_path = c255
)
 
;remove any old files
set path = build("rm /cerner/d_",cnvtlower(curdomain),"/ccluserdir/fsi_updt_oen_personality.csv")
call DCL(path,textlen(path))
 
set filename = "ccluserdir:fsi_updt_oen_personality.csv"
call echo(concat("The file was generated ",filename))
  
select
  *
from
  oen_personality op
where op.name in ("OUTPUTFILEPATTERN"
			      ,"INPUTFILEPATTERN"
			      ,"PORT"
			      ,"REMOTEHOST"
			      ,"BATCH_BACKUP_DIR"
			      ,"REMOTE_DOMAIN"
			      ,"BASE_CUSTOM_FILE_PATH")
  and op.interfaceid > 0
order by
  op.interfaceid
 
head report
  int_cnt = 0
 
head op.interfaceid
  int_cnt += 1
 
  if (int_cnt > size(data->interfaces,5))
    stat = alterlist(data->interfaces,int_cnt + 10)
  endif
 
  data->interfaces[int_cnt].interfaceid = op.interfaceid
detail
  if (op.name = "OUTPUTFILEPATTERN")
    data->interfaces[int_cnt].outputfilepattern = op.value
  elseif (op.name = "INPUTFILEPATTERN")
    data->interfaces[int_cnt].inputfilepattern = op.value
  elseif (op.name = "PORT")
    data->interfaces[int_cnt].port = op.value
  elseif (op.name = "REMOTEHOST")
    data->interfaces[int_cnt].remotehost = op.value
  elseif (op.name = "BATCH_BACKUP_DIR")
    data->interfaces[int_cnt].batch_backup_dir = op.value
  elseif (op.name = "REMOTE_DOMAIN")
    data->interfaces[int_cnt].remote_domain = op.value
  elseif (op.name = "BASE_CUSTOM_FILE_PATH")
    data->interfaces[int_cnt].base_custom_file_path = op.value
  endif
foot op.interfaceid
  stat = alterlist(data->interfaces,int_cnt)
with norecord
 
set num = 0
 
select
  op.proc_name
from
  oen_procinfo op
where expand(num,1,size(data->interfaces,5),op.interfaceid,data->interfaces[num].interfaceid)
 
head op.interfaceid
  pos = locateval(num,1,size(data->interfaces,5),op.interfaceid,data->interfaces[num].interfaceid)
 
  data->interfaces[num].proc_name = op.proc_name
with nocounter
 
call echorecord(data)
 
select into value(filename)
  interfaceid = data->interfaces[d.seq].interfaceid
  , proc_name = trim(data->interfaces[d.seq].proc_name,3)
  , outputfilepattern = trim(data->interfaces[d.seq].outputfilepattern,3)
  , inputfilepattern = trim(data->interfaces[d.seq].inputfilepattern,3)
  , port = trim(data->interfaces[d.seq].port,3)
  , remotehost = trim(data->interfaces[d.seq].remotehost,3)
  , batch_backup_dir = trim(data->interfaces[d.seq].batch_backup_dir,3)
  , remote_domain = trim(data->interfaces[d.seq].remote_domain,3)
  , base_custom_file_path = trim(data->interfaces[d.seq].base_custom_file_path,3)
from
  (dummyt d with seq = size(data->interfaces,5))
plan d
with nocounter, format, format = crstream, pcformat("", ^,^ ,1,1)
 
end
go
  execute fsi_extract_oen_personality go
