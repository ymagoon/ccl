drop program problems_not_meeting_mu:dba go
create program problems_not_meeting_mu:dba
 
declare SNOMEDCd = f8 with constant(uar_get_code_by("MEANING",400,"SNMCT")), public
 
;Codified & free text Problems
select into "problems_not_meeting_mu.dat"
	search = trim(n1.source_string,3),
	search_code = evaluate2(if(findstring("!",trim(n1.concept_cki),1,0) > 0)
						substring(findstring("!",trim(n1.concept_cki),1,0)+1,size(trim(n1.concept_cki)),trim(n1.concept_cki))
						else
						trim(n1.concept_cki,3)
						endif),
	search_vocab = trim(uar_get_code_display(n1.source_vocabulary_cd),3),
	target = trim(n2.source_string,3),
	target_code = evaluate2(if(findstring("!",trim(n2.concept_cki),1,0) > 0)
	                   substring(findstring("!",trim(n2.concept_cki),1,0)+1,size(trim(n2.concept_cki)),trim(n2.concept_cki))
					   else
					   trim(n2.concept_cki,3)
					   endif),
	target_vocab = trim(uar_get_code_display(n2.source_vocabulary_cd),3),
	FreeText = pb.problem_ftdesc,
	Frequency = count(pb.problem_id)
from
problem pb,
nomenclature n1,
nomenclature n2
plan pb
	where pb.active_ind = 1
	and pb.problem_id > 0
join n1
	where n1.nomenclature_id = pb.originating_nomenclature_id
	  and n1.source_vocabulary_cd not in (SNOMEDCd)
join n2
	where n2.nomenclature_id = pb.nomenclature_id
	   and n2.source_vocabulary_cd not in (SNOMEDCd)
group by
	n1.source_string,
	n1.concept_cki,
	n1.source_vocabulary_cd,
	n2.source_string,
	n2.concept_cki,
	n2.source_vocabulary_cd,
	pb.problem_ftdesc
order
	n1.source_string,
	n1.concept_cki,
	n1.source_vocabulary_cd,
	n2.source_string,
	n2.concept_cki,
	n2.source_vocabulary_cd,
	pb.problem_ftdesc
with nocounter, FORMAT, SEPARATOR=value(char(9)), HEADING
 
end go
 
 
