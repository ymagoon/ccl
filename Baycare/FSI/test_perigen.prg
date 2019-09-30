drop program test_perigen go
create program test_perigen
 
%include cust_script:baycare_fsi/hl7_msg.inc
 
set stat = alterlist(message->seg,2)
 
;begin MSH
;MSH|^~\&|HNAM|CERNER|MPH|BAYCARE|20190930001115||ORM^O01|Q5224403049T7057757319|T|2.3||||||8859/1

;MSH.5
;display from ENCOUNTER.loc_facility_cd
set stat = alterlist(message->seg.field[4].repeat,1)
set stat = alterlist(message->seg.field[4].repeat.comp,1)
set message->seg.field[4].repeat.comp.comp_value = "MPH"

;MSH.7
;build(format(cnvtdatetime(curdate ,curtime3), "YYYYMMDDHHMMSS;;D"))
set stat = alterlist(message->seg.field[6].repeat,1)
set stat = alterlist(message->seg.field[6].repeat.comp,1)
set message->seg.field[6].repeat.comp.comp_value = "20190930001115"

;MSH.9
;hard code message type
set stat = alterlist(message->seg.field[8].repeat,1)
set stat = alterlist(message->seg.field[8].repeat.comp,2)
set message->seg.field[8].repeat.comp.comp_value = "ORM"
set message->seg.field[8].repeat.comp[2].comp_value = "O01"

;MSH.10
;might be able to leave this blank? we might be able to populate this in mod object script
set stat = alterlist(message->seg.field[9].repeat,1)
set stat = alterlist(message->seg.field[9].repeat.comp,1)
set message->seg.field[9].repeat.comp.comp_value = "Q5224403049T7057757319"
 
;begin PID
/*
This sample is a single string broken up into separate lines due to its length

PID|1|2107038553^^^BayCare MRN^MRN^SOARIAN|2107038553^^^BayCare MRN^MRN^SOARIAN~301908224^^^BayCare CMRN
^Community Medical Record Number^SOARIAN||VZHQKQEE^DZBE-JNGQ||20190313165600|F||W|1301 KQVZMWEQ XEYG^NFO 804
^ENBDW^FL^66440^^Home~jngqvzhqkqee@dvnze.awv^^^^^^e-mail|||||S|No Religious Preference|1108513417^^^BayCare FIN||||NOH|||1
*/
set stat = alterlist(message->seg[2].field,25)
 
set message->seg[2].seg_name "PID"
 
;PID.1
set stat = alterlist(message->seg[2].field.repeat,1)
set stat = alterlist(message->seg[2].field.repeat.comp,1)
set message->seg[2].field.repeat.comp.comp_value = "1"

;PID.2
;ENCOUNTER_ALIAS.alias where encntr_alias_type_cd is the correct value
;sample - 2107038553^^^BayCare MRN^MRN^SOARIAN
set stat = alterlist(message->seg[2].field[2].repeat,1)
set stat = alterlist(message->seg[2].field[2].repeat.comp,6)
set message->seg[2].field[2].repeat.comp.comp_value = "2107038553"
set message->seg[2].field[2].repeat.comp[4].comp_value = "BayCare MRN"
set message->seg[2].field[2].repeat.comp[5].comp_value = "MRN"
set message->seg[2].field[2].repeat.comp[6].comp_value = "SOARIAN"

;PID.3
;ENCOUNTER_ALIAS.alias where encntr_alias_type_cd is the correct value
;sample - 2107038553^^^BayCare MRN^MRN^SOARIAN~301908224^^^BayCare CMRN^Community Medical Record Number^SOARIAN
set stat = alterlist(message->seg[2].field[3].repeat,2)
set stat = alterlist(message->seg[2].field[3].repeat.comp,6)
set stat = alterlist(message->seg[2].field[3].repeat[2].comp,6)
set message->seg[2].field[3].repeat.comp.comp_value = "2107038553"
set message->seg[2].field[3].repeat.comp[4].comp_value = "BayCare MRN"
set message->seg[2].field[3].repeat.comp[5].comp_value = "MRN"
set message->seg[2].field[3].repeat.comp[6].comp_value = "SOARIAN"

set message->seg[2].field[3].repeat[2].comp.comp_value = "301908224"
set message->seg[2].field[3].repeat[2].comp[4].comp_value = "BayCare CMRN"
set message->seg[2].field[3].repeat[2].comp[5].comp_value = "Community Medical Record Number"
set message->seg[2].field[3].repeat[2].comp[6].comp_value = "SOARIAN"

;PID.5
;PERSON.name_last^PERSON.name_first^PERSON.name_middle
set stat = alterlist(message->seg[2].field[5].repeat,1)
set stat = alterlist(message->seg[2].field[5].repeat.comp,2)
set message->seg[2].field[5].repeat.comp.comp_value = "VZHQKQEE"
set message->seg[2].field[5].repeat.comp[2].comp_value = "DZBE-JNGQ"

;PID.7
;build(format(PERSON.birth_dt_tm, "YYYYMMDD;;D"))
set stat = alterlist(message->seg[2].field[7].repeat,1)
set stat = alterlist(message->seg[2].field[7].repeat.comp,1)
set message->seg[2].field[7].repeat.comp.comp_value = "20190313165600"

;PID.8
;PERSON.sex_cd
set stat = alterlist(message->seg[2].field[8].repeat,1)
set stat = alterlist(message->seg[2].field[8].repeat.comp,1)
set message->seg[2].field[8].repeat.comp.comp_value = "F"

;PID.10
;PERSON.race_cd
set stat = alterlist(message->seg[2].field[10].repeat,1)
set stat = alterlist(message->seg[2].field[10].repeat.comp,1)
set message->seg[2].field[10].repeat.comp.comp_value = "W"

;PID.11
;ADDRESS.street_addr^ADDRESS.street_addr2^ADDRESS.city^ADDRESS.state^ADDRESS.zipcode^ADDRESS.address_type_cd
;sample - 1301 KQVZMWEQ XEYG^NFO 804^ENBDW^FL^66440^^Home~jngqvzhqkqee@dvnze.awv^^^^^^e-mail
set stat = alterlist(message->seg[2].field[11].repeat,2)
set stat = alterlist(message->seg[2].field[11].repeat.comp,7)
set stat = alterlist(message->seg[2].field[11].repeat[2].comp,7)
set message->seg[2].field[11].repeat.comp.comp_value = "1301 KQVZMWEQ XEYG"
set message->seg[2].field[11].repeat.comp[2].comp_value = "NFO 804"
set message->seg[2].field[11].repeat.comp[3].comp_value = "ENBDW"
set message->seg[2].field[11].repeat.comp[4].comp_value = "FL"
set message->seg[2].field[11].repeat.comp[5].comp_value = "66440"
set message->seg[2].field[11].repeat.comp[7].comp_value = "Home"

set message->seg[2].field[11].repeat[2].comp.comp_value = "jngqvzhqkqee@dvnze.awv"
set message->seg[2].field[11].repeat[2].comp[7].comp_value = "e-mail"

;PID.16
;PERSON.marital_type_cd
set stat = alterlist(message->seg[2].field[16].repeat,1)
set stat = alterlist(message->seg[2].field[16].repeat.comp,1)
set message->seg[2].field[16].repeat.comp.comp_value = "S"

;PID.17
;PERSON.religion_cd
set stat = alterlist(message->seg[2].field[17].repeat,1)
set stat = alterlist(message->seg[2].field[17].repeat.comp,1)
set message->seg[2].field[17].repeat.comp.comp_value = "No Religious Preference"

;PID.18
;ENCOUNTER_ALIAS.alias where encntr_alias_type_cd is the correct value
set stat = alterlist(message->seg[2].field[18].repeat,1)
set stat = alterlist(message->seg[2].field[18].repeat.comp,4)
set message->seg[2].field[18].repeat.comp.comp_value = "1108513417"
set message->seg[2].field[18].repeat.comp[4].comp_value = "BayCare FIN"

;PID.22
set stat = alterlist(message->seg[2].field[22].repeat,1)
set stat = alterlist(message->seg[2].field[22].repeat.comp,1)
set message->seg[2].field[22].repeat.comp.comp_value = "NOH"

;PID.25
set stat = alterlist(message->seg[2].field[25].repeat,1)
set stat = alterlist(message->seg[2].field[25].repeat.comp,1)
set message->seg[2].field[25].repeat.comp.comp_value = "1"

set trace recpersist
; passing a 1 and a file location writes the hl7 message to a file at that location
execute fsi_build_msgs 1, "ccluserdir:testfile.txt"
set trace norecpersist

call echorecord(reply)

end
go
 execute test_perigen go
 
