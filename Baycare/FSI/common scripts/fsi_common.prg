/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_common.inc
 *  Description:  Common FSI subroutines and functions
 *  ---------------------------------------------------------------------------------------------
 *  Author:       Yitzhak Magoon     
 *  Creation Date:  11/16/2018
 *  ---------------------------------------------------------------------------------------------
 *  This .inc file is included in various FSI scripts. It contains common functions and subroutines
 *  that are performed in the route_out script and several mod object scripts.

 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description and Requestor Information
 *  001:   03/28/2019 y magoon Add get_code_value subroutine
*  002:    03/29/2019 y magoon add obx_exists subroutine
*/

;using 'with copy' makes subroutine known to parent programming calling this script
declare get_proc_id(proc_name) = i4 with copy
declare get_string_value(string_meaning) = vc with copy
declare get_double_value(string_meaning) = f8 with copy
declare get_code_value_display(code_value_text) = vc with copy
declare get_code_value(code_value_text) = f8 with copy ;001
declare obx_exists(null) = i2 with copy ;001

;mobj subroutines are for mod object scripts. The record structure is oen_reply instead of oenobj
declare get_string_value_mobj(string_meaning) = vc with copy
declare get_double_value_mobj(string_meaning) = f8 with copy
declare get_long_value_mobj(string_meaning) = f8 with copy

/********************************************************
 GET_CODE_VALUE_DISPLAY SUBROUTINE
********************************************************/
subroutine get_code_value_display(code_value_text)
    set pos = findstring(",",code_value_text, 1)
    set code_value = cnvtreal(substring(pos + 1, size(code_value_text,1), code_value_text))
  
    return (uar_get_code_display(code_value))
end

/********************************************************
 GET_CODE_VALUE SUBROUTINE ;001
********************************************************/
subroutine get_code_value(code_value_text)
    set code_value = cnvtreal(piece(code_value_text, ",", 2, "Not Found")) ;cv is 0 if piece function doesn't return the code value
	
    return (code_value)
end

/***********************************************
 GET_STRING_VALUE SUBROUTINE
***********************************************/
subroutine get_string_value(string_meaning)
    if (validate(oenobj->cerner) = 1) ;if the oenobj->cerner record item exists
        declare num = i2
        set pos = locateval(num, 1, size(oenobj->cerner->stringlist, 5)
                                              , string_meaning, oenobj->cerner->stringlist[num]->strmeaning)

        if (pos > 0)
            return (trim(oenobj->cerner->stringlist[pos]->strval))
        else
            return ("0")
        endif
    else
        return ("-1")
    endif
end   ;get_string_value

/***********************************************
 GET_DOUBLE_VALUE SUBROUTINE
***********************************************/
subroutine get_double_value(double_meaning)
    if (validate(oenobj->cerner) = 1) ;if the oenobj->cerner record item exists
        declare num = i2
        set pos = locateval(num, 1, size(oenobj->cerner->doublelist,5)
                                               , double_meaning, oenobj->cerner->doubleList[num]->strmeaning)
	
        if (pos > 0)
            return (oenobj->cerner->doubleList[pos]->dval)
        else
            return ("0")
        endif
    else
        return ("-1")
    endif
end  ;get_double_value

/*************************************
 GET_PROC_ID SUBROUTINE
*************************************/

subroutine get_proc_id(proc_name)
    declare out_pid=i4
    select into "nl:"
        p.interfaceid
    from 
        oen_procinfo p
    where 
        cnvtupper(p.proc_name) = cnvtupper(proc_name)
    detail
        out_pid = p.interfaceid
    with nocounter
  
    if (curqual != 0)
        return(out_pid)
    else
        return (0)
    endif
end ;get_proc_id subroutine

/***********************************************
 GET_STRING_VALUE_MOBJ SUBROUTINE
***********************************************/
subroutine get_string_value_mobj(string_meaning)
    if (validate(oen_reply->cerner) = 1)
        declare num = i2
        set pos = locateval(num, 1, size(oen_reply->cerner->stringlist, 5)
                                              , string_meaning, oen_reply->cerner->stringlist[num]->strmeaning)

        if (pos > 0)
            return (trim(oen_reply->cerner->stringlist[pos]->strval))
        else
            return ("0")
        endif
    else
        return ("-1")
    endif
end   ;get_string_value_mobj

/***********************************************
 GET_DOUBLE_VALUE_MOBJ SUBROUTINE
***********************************************/
subroutine get_double_value_mobj(double_meaning)
    if (validate(oen_reply->cerner) = 1)
        declare num = i2
        set pos = locateval(num, 1, size(oen_reply->cerner->doublelist,5)
                                               , double_meaning, oen_reply->cerner->doubleList[num]->strmeaning)
	
        if (pos > 0)
            return (oen_reply->cerner->doubleList[pos]->dval)
        else
            return ("0")
        endif
    else
        return ("-1")
    endif
end  ;get_double_value_mobj


/*******************************************
 GET_LONG_VALUE_MOBJ SUBROUTINE
*******************************************/
subroutine get_long_value_mobj(string_meaning)
    if (validate(oen_reply->cerner) = 1)
        declare num = i2

        set pos = locateval(num, 1, size(oen_reply->cerner->longList,5)
                                              , string_meaning, oen_reply->cerner->longList[num]->strmeaning)

        if (pos > 0)
            return (oen_reply->cerner->longList[pos]->lval)
        else
            return ("0")
        endif
    else
        return ("-1")
    endif
end ;get_long_value_mobj

/********************************************************
 OBX EXISTS SUBROUTINE
********************************************************/
subroutine obx_exists(null)
    set obx_size = 0
    execute oencpm_msglog("inside obx_exists subroutine")
    if (validate(oen_reply) = 1) ; mod object
        set obx_size = size(oen_reply->RES_ORU_GROUP [1]->OBX_GROUP,5)
        execute oencpm_msglog(build("oen_reply exists, size=",obx_size))
    elseif (validate(oenobj) = 1) ;route script
        set obx_size = size(oenobj->RES_ORU_GROUP [1]->OBX_GROUP,5)
        execute oencpm_msglog(build("oenobj exists, size=",obx_size))
    endif

    if (obx_size > 0)
        return (1)
    else
        return (0)
    endif
end