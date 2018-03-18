if (not validate(get_atgroup_exp_request, 0))
record get_atgroup_exp_request
(
%i cclsource:sch_get_atgroup_exp_req.inc
)
endif
 
if (not validate(get_atgroup_exp_reply, 0))
record get_atgroup_exp_reply
(
%i cclsource:sch_get_atgroup_exp_rep.inc
)
endif

