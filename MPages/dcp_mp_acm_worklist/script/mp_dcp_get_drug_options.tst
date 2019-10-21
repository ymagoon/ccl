free set med_request go

declare json = vc go

/*
record med_request
(
	1 text = vc ;the text to match
	1 catalog_flag = i2 ;0 = drug, 1 = class 
) go
*/

set json = '{"MED_REQUEST":{"text": "ibu","catalog_flag": "0"}}' go

execute mp_dcp_get_drug_options "MINE", json go

set json = '{"MED_REQUEST":{"text": "anti","catalog_flag": "1"}}' go

execute mp_dcp_get_drug_options "MINE", json go