 ;;Solution_Test/script/Database Architecture -- Tools/OCD Installation Tools/dm_readme_data.inc Turn on black mode

/******************************************************************************
*                                                                             *
* DM_README_DATA.INC - De fines a global readme data structure                 *
*                                                                             *
*******************************************************************************
*                                                                             *
* Modifications:                                                              *
* 000  01/05/01  Darryl Shippy         Initial release                        *
* 001  10/01/02  Mark Pollock          Added 'driver' for importing IXF files *
*                                      Removed rowid & added batch_dt_tm that *
*                                      is part of dm_ocd_log's unique key     *
* 002  05/13/03  Dale Hemmie           Added row_id in to make it backward    *
*                                      compatable.                            * 
******************************************************************************/

if (not validate(readme_data, 0))
  free set readme_data
  record readme_data
  (
    1  ocd = i4
    1  readme_id = f8
    1  instance = i4
    1  readme_type = vc
    1  description = vc
    1  script = vc
    1  check_script = vc
    1  data_file = vc
    1  par_file = vc
    1  blocks = i4
;001    1  log_rowid = vc
    1  log_rowid = vc ;002 
    1  status = vc
    1  message = c255                ;001 switched from vc to allow use in DB2
    1  options = vc 
    1  driver = vc                   ;001 to specify which table to import into for table imports
    1  batch_dt_tm = dq8             ;001 needed for dm_ocd_log unique key to replace rowid
  )
endif

;Generated by GNU enscript 1.6.4.
