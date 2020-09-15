drop program avh_ext_usr_acc_driver:dba go
create program avh_ext_usr_acc_driver:dba
 
prompt
   	"Output to File/Printer/MINE" = "MINE"
		,"User Id:" = 0.0
		,"Position Cd:" = 0.0
		,"Static Content Directory:" = ""
		,"HTML File:" = ""
with outdev, user_id, pos_cd, sourcedir, html_file
 
/***************************************************************************
 *          	Declare Records                 		  		*
 ***************************************************************************/
free record mpage_rec
record mpage_rec (
	1 user_id = f8
	1 pos_cd = f8
	1 source_dir = vc
	1 html_file = vc
)
 
/***************************************************************************
 * 		Assign prompts to record structure				*
 ***************************************************************************/
set mpage_rec->user_id = $user_id
set mpage_rec->pos_cd = $pos_cd
set mpage_rec->source_dir = $sourcedir
set mpage_rec->html_file = $html_file
 
/***************************************************************************
 * 		Read in HTML and display error HTML if incorrect		*
 ***************************************************************************/
record getREQUEST (
  1 Module_Dir = vc
  1 Module_Name = vc
  1 bAsBlob = i2
)
 
record getREPLY (
  1 INFO_LINE[*]
    2 new_line                = vc
  1 data_blob                 = gvc
  1 data_blob_size            = i4
%i cclsource:status_block.inc
)
 
; Read in the html file
set getrequest->module_dir= trim(mpage_rec->html_file, 3)
set getrequest->Module_name = ""
set getrequest->bAsBlob = 1
execute eks_get_source with replace (REQUEST,getREQUEST),replace(REPLY,getREPLY)
if(getREPLY->status_data.status = "F")
	; Output No HTML File Found!
	set getReply->data_blob = BUILD2(
		^<html><head><title>MPage Error</title></head>^,
		^<body><div>HTML file "^,mpage_rec->html_file,^" could not be found!</div>^,
		CHAR(10),CHAR(13),
		^</body></html>^
	)
endif
 
/***************************************************************************
 * 		Replace special strings in HTML File				*
 ***************************************************************************/
; Replace $SOURCE_DIR$ in the HTML file with the actual location of the static_content files
set getReply->data_blob = replace(getReply->data_blob,"$SOURCE_DIR$", mpage_rec->source_dir,0)
 
; Replace $MPAGE_REC$ in the HTML file with the JSON for the record
set getReply->data_blob = replace(getReply->data_blob,"$MPAGE_REC$", CNVTRECTOJSON(mpage_rec,9,1),0)
 
/***************************************************************************
 * 		Outputs HTML to the display					*
 ***************************************************************************/
set _MEMORY_REPLY_STRING = getReply->data_blob
 
#exit_script
free record mpage_rec
 
end
go
 
