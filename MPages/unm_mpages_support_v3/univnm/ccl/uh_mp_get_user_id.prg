drop program uh_mp_get_user_id go
create program uh_mp_get_user_id


DECLARE USER_ID		= f8 WITH PERSISTSCRIPT

IF(REQINFO->UPDT_ID = 0)
	SET USER_ID = CURUSER
ELSE
	SET USER_ID = REQINFO->UPDT_ID
ENDIF

END
GO