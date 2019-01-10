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
*/

;using 'with copy' makes subroutine known to parent programming calling this script
declare get_proc_id(proc_name) = i4 with copy
declare get_string_value(string_meaning) = vc with copy
declare get_double_value(string_meaning) = f8 with copy
declare get_code_value_display(code_value_text) = vc with copy

/***********************************************
 GET_CODE_VALUE_DISPLAY SUBROUTINE
***********************************************/
subroutine get_code_value_display(code_value_text)
    set pos = findstring(",",code_value_text, 1)
    set code_value = cnvtreal(substring(pos + 1, size(code_value_text,1), code_value_text))
  
    return (uar_get_code_display(code_value))
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

/*****************************************
 GET_DOUBLE_VALUE subroutine
*****************************************/
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