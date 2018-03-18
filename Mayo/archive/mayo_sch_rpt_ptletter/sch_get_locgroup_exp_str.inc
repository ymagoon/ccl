if (not validate(get_locgroup_exp_request, 0))
record get_locgroup_exp_request
(
%i cclsource:sch_get_locgroup_exp_req.inc
)
endif
 
if (not validate(get_locgroup_exp_reply, 0))
record get_locgroup_exp_reply
(
%i cclsource:sch_get_locgroup_exp_rep.inc
)
endif

