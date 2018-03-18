;~DB~***************************************************************************
;    *                         GENERATED MODIFICATION CONTROL LOG              *
;    ***************************************************************************
;    *                                                                         *
;    *   Mod Date     Engineer             Comment                             *
;    *------ -------- -------------------- ----------------------------------- *
;      42233   09/16/04 Kim Jones            Adding mod block.  Adding validates
;                                          to decrease conflicts between other
;                                          header files that declare the same
;                                          variables (ex. pm_header_constants) *
;      89521   03/08/06 Brian Heiting        Add last_mod
;~DE~***************************************************************************
;~END~ *********************  END OF ALL MODCONTROL BLOCKS  ********************

if (validate(ACTION_NONE,-1) != 0)
   declare ACTION_NONE = i2 with protect, noconstant(0)
endif
if (validate(ACTION_ADD, -1) != 1)
   declare ACTION_ADD = i2 with protect, noconstant(1)
endif
if (validate(ACTION_CHG,-1) != 2)
   declare ACTION_CHG = i2 with protect, noconstant(2)
endif
if (validate(ACTION_DEL,-1) != 3)
   declare ACTION_DEL = i2 with protect, noconstant(3)
endif
if (validate(ACTION_GET,-1) != 4)
   declare ACTION_GET = i2 with protect, noconstant(4)
endif
if (validate(ACTION_INA,-1) != 5)
   declare ACTION_INA = i2 with protect, noconstant(5)
endif
if (validate(ACTION_ACT,-1) != 6)
   declare ACTION_ACT = i2 with protect, noconstant(6)
endif
if (validate(ACTION_TEMP,-1) != 999)
   declare ACTION_TEMP = i2 with protect, noconstant(999)
endif
if (validate(TRUE,-1) != 1)
   declare TRUE = i2 with protect, noconstant(1)
endif
if (validate(FALSE,-1) != 0)
  declare FALSE = i2 with protect, noconstant(0)
endif
if (validate(GEN_NBR_ERROR,-1) != 3)
   declare GEN_NBR_ERROR = i2 with protect, noconstant(3)
endif
if (validate(INSERT_ERROR,-1) != 4)
   declare INSERT_ERROR = i2 with protect, noconstant(4)
endif
if (validate(UPDATE_ERROR,-1) != 5)
   declare UPDATE_ERROR = i2 with protect, noconstant(5)
endif
if (validate(REPLACE_ERROR,-1) != 6)
   declare REPLACE_ERROR = i2 with protect, noconstant(6)
endif
if (validate(DELETE_ERROR,-1) != 7)
   declare DELETE_ERROR = i2 with protect, noconstant(7)
endif
if (validate(UNDELETE_ERROR,-1) != 8)
   declare UNDELETE_ERROR = i2 with protect, noconstant(8)
endif
if (validate(REMOVE_ERROR,-1) != 9)
   declare REMOVE_ERROR = i2 with protect, noconstant(9)
endif
if (validate(ATTRIBUTE_ERROR,-1) != 10)
   declare ATTRIBUTE_ERROR = i2 with protect, noconstant(10)
endif
if (validate(LOCK_ERROR,-1) != 11)
   declare LOCK_ERROR = i2 with protect, noconstant(11)
endif
if (validate(NONE_FOUND,-1) != 12)
   declare NONE_FOUND = i2 with protect, noconstant(12)
endif
if (validate(SELECT_ERROR,-1) != 13)
   declare SELECT_ERROR = i2 with protect, noconstant(13)
endif
if (validate(UPDATE_CNT_ERROR,-1) != 14)
   declare UPDATE_CNT_ERROR = i2 with protect, noconstant(14)
endif
if (validate(NOT_FOUND,-1) != 15)
   declare NOT_FOUND = i2 with protect, noconstant(15)
endif
if (validate(VERSION_INSERT_ERROR,-1) != 16)
   declare VERSION_INSERT_ERROR = i2 with protect, noconstant(16)
endif
if (validate(INACTIVATE_ERROR,-1) != 17)
   declare INACTIVATE_ERROR = i2 with protect, noconstant(17)
endif
if (validate(ACTIVATE_ERROR,-1) != 18)
   declare ACTIVATE_ERROR = i2 with protect, noconstant(18)
endif
if (validate(VERSION_DELETE_ERROR,-1) != 19)
   declare VERSION_DELETE_ERROR = i2 with protect, noconstant(19)
endif
if (validate(UAR_ERROR,-1) != 20)
   declare UAR_ERROR = i2 with protect, noconstant(20)
endif
if (validate(DUPLICATE_ERROR,-1) != 21)
   declare DUPLICATE_ERROR = i2 with protect, noconstant(21 )                                ;42372
endif
if (validate(CCL_ERROR,-1) != 22)
   declare CCL_ERROR = i2 with protect, noconstant(22)                                       ;42372
endif
if (validate(EXECUTE_ERROR,-1) != 23)
   declare EXECUTE_ERROR = i2 with protect, noconstant(23)                                   ;42372
endif
if (validate(failed,-1) != 0)
   declare failed  = i2 with protect, noconstant(FALSE)
endif
if (validate(table_name,"ZZZ") = "ZZZ")
   declare table_name = vc with protect, noconstant("")
else
   set table_name = fillstring(100," ")
endif
if (validate(call_echo_ind,-1) != 0)
   declare call_echo_ind = i2 with protect, noconstant(FALSE)
endif
if (validate(i_version,-1) != 0)
   declare i_version = i2 with protect, noconstant(0)
endif
if (validate(program_name,"ZZZ") = "ZZZ")
   declare program_name = vc with protect, noconstant(fillstring(30, " "))
endif
if (validate(sch_security_id,-1) != 0)
   declare sch_security_id = f8 with protect, noconstant(0.0)
endif
if (validate(last_mod, "NOMOD") = "NOMOD")
   declare last_mod = c5 with private, noconstant("")                                        ;89521
endif


