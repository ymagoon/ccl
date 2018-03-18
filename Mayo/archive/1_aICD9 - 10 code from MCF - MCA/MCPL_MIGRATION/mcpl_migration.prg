drop program mcpl_migration:dba go
create program mcpl_migration:dba
 
 
;freetext Problems
select into "mcpl_problem_migration_freetext"
	problem_freetext = trim(pb.problem_ftdesc,3),
	frequency=count(pb.problem_id)
from
problem pb
plan pb
	where pb.active_ind = 1
	and pb.nomenclature_id = 0
group by
	pb.problem_ftdesc
order pb.problem_ftdesc
with nocounter,FORMAT,SEPARATOR=value(char(9)),HEADING
 
;All remaining Problems
select into "mcpl_problem_migration"
	search_term = trim(n1.source_string,3),
	search_code = evaluate2(if(findstring("!",trim(n1.concept_cki),1,0) > 0)
											substring(findstring("!",trim(n1.concept_cki),1,0)+1,
													size(trim(n1.concept_cki))
													,trim(n1.concept_cki))
										else
											trim(n1.concept_cki,3)
										endif),
 
	search_terminology = trim(uar_get_code_display(n1.source_vocabulary_cd),3),
	target_term = trim(n2.source_string,3),
	target_code = evaluate2(if(findstring("!",trim(n2.concept_cki),1,0) > 0)
											substring(findstring("!",trim(n2.concept_cki),1,0)+1,
													size(trim(n2.concept_cki))
													,trim(n2.concept_cki))
										else
											trim(n2.concept_cki,3)
										endif),
	target_source_vocab = trim(uar_get_code_display(n2.source_vocabulary_cd),3),
	frequency = count(pb.problem_id)
from
problem pb,
nomenclature n1,
nomenclature n2
 
plan pb
	where pb.active_ind = 1
	and pb.nomenclature_id != 0
join n1
	where n1.nomenclature_id = pb.originating_nomenclature_id
join n2
	where n2.nomenclature_id = pb.nomenclature_id
 
group by
	n1.source_string,
	n1.concept_cki,
	n1.source_vocabulary_cd,
	n2.source_string,
	n2.concept_cki,
	n2.source_vocabulary_cd
order n1.source_string, n2.source_string
with nocounter,FORMAT,SEPARATOR=value(char(9)),HEADING
 
;Diagnosis Freetext
select into "mcpl_diagnosis_migration_freetext"
	diagnosis_freetext = trim(diag.diag_ftdesc,3),
	frequency = count(diag.diagnosis_id)
from diagnosis diag
plan diag
	where diag.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	and diag.nomenclature_id = 0
group by
	diag.diag_ftdesc
order diag.diag_ftdesc
with nocounter,FORMAT,SEPARATOR=value(char(9)),HEADING
 
 
;All remaining Diagnoses
select into "mcpl_diagnosis_migration"
	search_term = trim(n1.source_string,3),
	search_code = evaluate2(if(findstring("!",trim(n1.concept_cki),1,0) > 0)
											substring(findstring("!",trim(n1.concept_cki),1,0)+1,
													size(trim(n1.concept_cki))
													,trim(n1.concept_cki))
										else
											trim(n1.concept_cki,3)
										endif),
	search_terminology = trim(uar_get_code_display(n1.source_vocabulary_cd),3),
	target_term = trim(n2.source_string,3),
	target_code = evaluate2(if(findstring("!",trim(n2.concept_cki),1,0) > 0)
											substring(findstring("!",trim(n2.concept_cki),1,0)+1,
													size(trim(n2.concept_cki))
													,trim(n2.concept_cki))
										else
											trim(n2.concept_cki,3)
										endif),
	target_terminology = trim(uar_get_code_display(n2.source_vocabulary_cd),3),
	frequency = count(diag.diagnosis_id)
from
diagnosis diag,
nomenclature n1,
nomenclature n2
 
plan diag
	where diag.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	and diag.nomenclature_id != 0
join n1
	where n1.nomenclature_id = diag.originating_nomenclature_id
join n2
	where n2.nomenclature_id = diag.nomenclature_id
 
group by
	n1.source_string,
	n1.concept_cki,
	n1.source_vocabulary_cd,
	n2.source_string,
	n2.concept_cki,
	n2.source_vocabulary_cd
order n1.source_string, n2.source_string
with nocounter,FORMAT,SEPARATOR=value(char(9)),HEADING
 
end go
 
