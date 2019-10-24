drop program mp_dcp_sticky_note_wrapper:dba go
create program mp_dcp_sticky_note_wrapper:dba
 
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
WITH  OUTDEV , JSON_ARGS

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
call echo(ARGS)
 
/* 
record noterequest
(
  1 operation = vc
  
  ;Possible expected fields:
  1 sticky_note_id = f8
  1 sticky_note_type = i4
  1 parent_entity_name = c40
  1 parent_entity_id = f8
  1 sticky_note_text = vc
)
*/

free record replyAddNote
record replyAddNote
(
  1 sticky_note_id = f8
  1 updt_dt_tm = dq8
%i cclsource:status_block.inc
)

free record replyDelNote
record replyDelNote
(
%i cclsource:status_block.inc
)

free record replyCompNote
record replyCompNote
(
  1 updt_dt_tm = dq8
%i cclsource:status_block.inc  
)

declare commTypeCd = f8 with constant(uar_get_code_by("MEANING",14122,"REGWORKLIST"))
declare todoTypeCd = f8 with constant(uar_get_code_by("MEANING",14122,"RWLTODO"))
declare cur_dt_tm  = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
set _MEMORY_REPLY_STRING = ""

case(noterequest->operation)
	of "ADD":		
		declare sticky_note_id = f8 with protect, noconstant(0)
		declare noteTypeCd = f8 with protect, noconstant(0)
		if(noterequest->sticky_note_type = 1)
			set noteTypeCd = todoTypeCd
		else
			set noteTypeCd = commTypeCd
		endif
		
		select into "nl:"
		   j = seq(reference_seq,nextval)
		from dual
		detail
		   sticky_note_id = j
		with format, nocounter		
		
		insert into sticky_note sn
		set
		  sn.sticky_note_id			= sticky_note_id,
		  sn.sticky_note_type_cd	= noteTypeCd,
		  sn.parent_entity_name		= noterequest->parent_entity_name,
		  sn.parent_entity_id		= noterequest->parent_entity_id,
		  sn.sticky_note_text		= substring(1,255,noterequest->sticky_note_text),
		  sn.sticky_note_status_cd	= 0, 
		  sn.public_ind				= 0,		   
		  sn.beg_effective_dt_tm    = cnvtdatetime(cur_dt_tm),
		  sn.end_effective_dt_tm    = cnvtdatetime("31-Dec-2100"),
		  sn.updt_dt_tm				= cnvtdatetime(cur_dt_tm),
		  sn.updt_id				= reqinfo->updt_id,
		  sn.updt_task				= reqinfo->updt_task,
		  sn.updt_applctx			= reqinfo->updt_applctx,
		  sn.updt_cnt				= 0,
		  sn.long_text_id           = 0		 
		with nocounter    	
		
		if (curqual = 0)
			set reqinfo->commit_ind = 0
			set replyAddNote->status_data->status = "F"
		else
			set reqinfo->commit_ind = 1
    		set replyAddNote->status_data->status = "S"
    		set replyAddNote->sticky_note_id = sticky_note_id
    		set replyAddNote->updt_dt_tm = cur_dt_tm
		endif
		
		set _MEMORY_REPLY_STRING = REPLACE(CNVTRECTOJSON(replyAddNote),"REPLYADDNOTE","REPLY")
			
	of "DELETE":
		delete from sticky_note sn where 
		  sn.sticky_note_id = noterequest->sticky_note_id
		with nocounter
		 
		if (curqual = 0)
		  set reqinfo->commit_ind = 0
		  set replyDelNote->status_data->status = "F"
		else
		  set reqinfo->commit_ind = 1
		  set replyDelNote->status_data->status = "S"
		endif
		set _MEMORY_REPLY_STRING = REPLACE(CNVTRECTOJSON(replyDelNote),"REPLYDELNOTE","REPLY")
		
	of "COMPLETE":
		update into sticky_note sn
		set
			sn.end_effective_dt_tm = cnvtdatetime(cur_dt_tm),
			sn.updt_dt_tm		   = cnvtdatetime(cur_dt_tm),
			sn.updt_id			   = reqinfo->updt_id,
			sn.updt_task		   = reqinfo->updt_task,
			sn.updt_applctx		   = reqinfo->updt_applctx,
			sn.updt_cnt		  	   = sn.updt_cnt + 1
		where sn.sticky_note_id = noterequest->sticky_note_id
		with nocounter
		
		if (curqual = 0)
			set reqinfo->commit_ind = 0
			set replyCompNote->status_data->status = "F"
		else
			set reqinfo->commit_ind = 1
    		set replyCompNote->status_data->status = "S"
    		set replyCompNote->updt_dt_tm = cur_dt_tm
		endif
		set _MEMORY_REPLY_STRING = REPLACE(CNVTRECTOJSON(replyCompNote),"REPLYCOMPNOTE","REPLY")
endcase

call echo(_MEMORY_REPLY_STRING)
 
end go
