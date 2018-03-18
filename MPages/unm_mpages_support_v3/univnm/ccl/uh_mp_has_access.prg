drop program uh_mp_has_access go
create program uh_mp_has_access
 
prompt
	"OUTDEV" = "MINE",
	"Controlled Object:" = "",
	"Requesting Object:" = 0
 
with OUTDEV, ACO, ARO 

/* --- Records ----*/
RECORD data (
	1 permissions [*]
		2 co_name 		= vc
		2 co_depth		= f8
		2 co_id			= f8
		2 co_parent		= f8
		2 role_name		= vc
		2 ro_depth		= f8
		2 ro_type		= vc
		2 is_explicit	= f8
		2 u_create		= i2
		2 u_read		= i2
		2 u_update		= i2
		2 u_delete		= i2
)
 
/*********************************************************
 *             Declare Variables                         *
 *********************************************************/
DECLARE CURRENT_USER		= f8 WITH PERSISTSCRIPT
DECLARE REC_COUNT			= i4 WITH NoConstant(0),Protect

DECLARE APPLICATION_NAME	= vc WITH PERSISTSCRIPT
DECLARE ACTION_NAME			= vc WITH PERSISTSCRIPT
DECLARE SUBACTION_NAME		= vc WITH PERSISTSCRIPT

SET APPLICATION_NAME 	= PIECE($ACO, "/", 1, "NO APPLICATION PASSED")
SET ACTION_NAME 		= PIECE($ACO, "/", 2, "NO ACTION PASSED")
SET SUBACTION_NAME 		= PIECE($ACO, "/", 3, "NO SUBACTION PASSED")


IF($ARO = 0)
	;We need to lookup the user id
	EXECUTE uh_mp_get_user_id
	SET CURRENT_USER = USER_ID
ELSE
	SET CURRENT_USER = CNVTREAL($ARO)
ENDIF

/* Let's look at the application name and get all the children */
SELECT 		co_name = Aco0.alias,
		co_depth = Aco0.depth,
		co_id = Aco0.id, 
		co_parent = Aco0.parent_id,
		ro_depth = Aro.depth, 
		ro_type = Aro.model,
		ro_id = aa.aro_id,
		;ro_id = Aro.foreign_key,
		;role_name = r.title,
		u_create = NULLVAL(aa.u_create, "0"),
		u_read = NULLVAL(aa.u_read, "0"),
		u_update = NULLVAL(aa.u_update, "0"),
		u_delete = NULLVAL(aa.u_delete, "0")
		
		
FROM 	((SELECT 
				depth = COUNT(parent.id),
				id = node.id,
				parent_id = node.parent_id,
				alias = node.alias,
				lft = node.lft,
				rght = node.rght
		FROM 	UNMH.cust_acos node,
				UNMH.cust_acos parent
		WHERE (node.lft BETWEEN parent.lft AND parent.rght )
		GROUP BY		node.id, node.alias, node.parent_id, node.lft, node.rght
		) Aco0),
		UNMH.cust_acos Aco,	
		UNMH.cust_aros_acos aa,
		((SELECT DISTINCT
			id = parent.id,
			alias = parent.alias,
			depth = parent.depth,
			model = parent.model,
			foreign_key = parent.foreign_key,
			lft = parent.lft,
			rght = parent.rght
	FROM 	UNMH.cust_aros node,
			(
				(
					SELECT 
							depth = COUNT(parent.id),
							id = node.id,
							parent_id = node.parent_id,
							alias = node.alias,
							model = node.model,
							foreign_key = NULLVAL(node.foreign_key, 0),
							lft = node.lft,
							rght = node.rght
					FROM 	UNMH.cust_aros node,
							UNMH.cust_aros parent
					
					WHERE 	node.lft BETWEEN parent.lft AND parent.rght 
					AND 	(
						(node.model = "User") 
						OR 
						(node.model = "Role") 
					)
					GROUP 
					BY 	node.id, 
						node.alias, 
						node.model, 
						node.foreign_key, 
						node.parent_id, 
						node.lft, 
						node.rght
				) parent
			)
			
	WHERE 	node.lft BETWEEN CNVTREAL(parent.lft) AND CNVTREAL(parent.rght)
	AND 	(
		(node.model = "User" AND node.foreign_key = CURRENT_USER) 
		OR 
		(node.model = "Role" AND node.foreign_key IN (SELECT u.role_id FROM UNMH.cust_users_roles u WHERE u.user_id = CURRENT_USER)))
		OR 
		(node.model = "Role" AND node.foreign_key IN (SELECT role.id FROM UNMH.cust_roles role, prsnl p WHERE role.cerner_id = p.position_cd AND p.person_id = CURRENT_USER))
		) Aro)
						
PLAN	Aco
	WHERE 	Aco.alias = APPLICATION_NAME
	AND 	CNVTREAL(Aco.parent_id) = 2
	
	JOIN 	Aco0
	WHERE 	CNVTREAL(Aco0.lft) >= Aco.lft
	AND 	CNVTREAL(Aco0.rght) <= Aco.rght
	
	JOIN 	aa
	WHERE 	aa.aco_id = OUTERJOIN(CNVTREAL(Aco0.id))

	JOIN 	Aro
	WHERE 	CNVTREAL(Aro.id) = aa.aro_id
	OR		(aa.aro_id IS  NULL)

;		JOIN 	r
;2		WHERE 	CNVTREAL(r.id) = CNVTREAL(Aro.foreign_key)
;1		WHERE 	CNVTREAL(r.id) = OUTERJOIN(CNVTREAL(Aro.foreign_key)) 
;3		WHERE 	CNVTREAL(r.id) = OUTERJOIN(CNVTREAL(Aro.id)) 
;		WHERE 	CNVTREAL(r.id) = CNVTREAL(Aro.id)

ORDER BY 	Aco0.lft ASC, Aro.model ASC, Aro.lft ASC

HEAD REPORT
	REC_COUNT = 0
	stat = alterlist(data->permissions, 10)

DETAIL
	REC_COUNT = REC_COUNT +1
	IF(MOD(REC_COUNT, 10) = 1)
		stat = alterlist(data->permissions, REC_COUNT + 9)
	ENDIF
	data->permissions[REC_COUNT].co_name = co_name
	data->permissions[REC_COUNT].co_depth = CNVTREAL(co_depth)
	data->permissions[REC_COUNT].co_id = CNVTREAL(co_id)
	data->permissions[REC_COUNT].co_parent = CNVTREAL(co_parent)
	;data->permissions[REC_COUNT].role_name = role_name
	data->permissions[REC_COUNT].ro_depth = CNVTREAL(ro_depth)
	data->permissions[REC_COUNT].ro_type = ro_type
	data->permissions[REC_COUNT].is_explicit = CNVTREAL(ro_id)
	data->permissions[REC_COUNT].u_create = CNVTINT(u_create)
	data->permissions[REC_COUNT].u_read = CNVTINT(u_read)
	data->permissions[REC_COUNT].u_update = CNVTINT(u_update)
	data->permissions[REC_COUNT].u_delete = CNVTINT(u_delete)

FOOT REPORT
	stat = alterlist(data->permissions, REC_COUNT)

WITH nocounter

call echorecord(data)

DECLARE json_reply_string 	= vc WITH protect, noconstant("")
SET json_reply_string = cnvtrectojson(data)
 
	;output for the Ext.Direct code
call echo(json_reply_string)

record putREQUEST (
  1 source_dir = vc
  1 source_filename = vc
  1 nbrlines = i4
  1 line [*]
	2 lineData = vc
  1 OverFlowPage [*]
	2 ofr_qual [*]
	  3 ofr_line = vc
  1 IsBlob = c1
  1 document_size = i4
  1 document = gvc
)
 
set putRequest->source_dir = $OUTDEV
set putRequest->IsBlob = "1"
set putRequest->document = json_reply_string
set putRequest->document_size = size(putRequest->document)
 
execute eks_put_source with replace(Request,putRequest),replace(reply,putReply)

RETURN(json_reply_string)

 
end
go