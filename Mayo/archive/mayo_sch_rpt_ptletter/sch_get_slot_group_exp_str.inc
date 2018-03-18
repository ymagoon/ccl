if (not validate(get_slot_group_exp_request, 0))
record get_slot_group_exp_request
(
%i cclsource:sch_get_slot_group_exp_req.inc
)
endif
 
if (not validate(get_slot_group_exp_reply, 0))
record get_slot_group_exp_reply
(
%i cclsource:sch_get_slot_group_exp_rep.inc
)
endif

