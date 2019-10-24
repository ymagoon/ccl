declare json = vc go

/*set json = '{"listrequest":{"user_id":86597872.0,"pos_cd":2192727847.0,"patients":[{"person_id":30657362.0},\
{"person_id":22159472.0},{"person_id":24273630.0},{"person_id":23696340.0},{"person_id":23830337.0},\
{"person_id":43390584.0},{"person_id":76807959.0},{"person_id":51336132.0},{"person_id":18691567.0},\
{"person_id":4000000025.0},{"person_id":18839518.0},{"person_id":30443755.0},{"person_id":21932381.0},\
{"person_id":33424813.0},{"person_id":30308397.0},{"person_id":29957810.0},{"person_id":65438221.0},\
{"person_id":51336133.0},{"person_id":18789727.0},{"person_id":44956137.0},{"person_id":30976717.0},\
{"person_id":82063520.0},{"person_id":51692138.0},{"person_id":86203674.0},{"person_id":31455639.0},\
{"person_id":31160312.0},{"person_id":35614215.0},{"person_id":31745706.0},{"person_id":66212221.0},\
{"person_id":65122221.0},{"person_id":65144221.0},{"person_id":33942821.0},{"person_id":72850263.0},\
{"person_id":79271858.0},{"person_id":36164245.0},{"person_id":35692929.0},\
{"person_id":33082265.0},{"person_id":50238167.0},{"person_id":20622326.0},\
{"person_id":46816132.0},{"person_id":76577837.0},{"person_id":22231891.0},{"person_id":22575275.0},\
{"person_id":22575160.0},{"person_id":22231890.0},{"person_id":29361295.0},{"person_id":30308398.0},\
{"person_id":33804977.0},{"person_id":30124796.0},{"person_id":24453251.0},{"person_id":42714025.0},\
{"person_id":51660132.0},{"person_id":73381682.0},{"person_id":30603630.0},{"person_id":30613164.0},\
{"person_id":18777210.0},{"person_id":18669981.0},{"person_id":30613165.0},{"person_id":22704926.0},\
{"person_id":51694132.0},{"person_id":80719933.0},{"person_id":12259073.0},{"person_id":80202825.0},\
{"person_id":80181857.0},{"person_id":32384994.0},{"person_id":29590068.0},{"person_id":34639479.0},\
{"person_id":19553630.0}],"case_mgr":[{"case_mgr_cd":614406.0},\
{"case_mgr_cd":614404.0},{"case_mgr_cd":614405.0},{"case_mgr_cd":15003531.0}],\
"pcp":[{"pcp_cd":1115.0}],"load_utilization_ind":1}}' go*/

set json = '{"listrequest":{"user_id":55772218.0,"pos_cd":2192727847.0,"patients":[{"person_id":42570057.0},{"person_id":42540318\
.0},{"person_id":42550006.0},{"person_id":42540334.0},{"person_id":42548022.0},{"person_id":18847666.0},{"person_id":18668343.0},\
{"person_id":22146442.0},{"person_id":18765248.0},{"person_id":41652332.0},{"person_id":38647430.0},{"person_id":33082265.0},{"\
person_id":41129200.0},{"person_id":30280420.0},{"person_id":31769760.0},{"person_id":42324102.0},{"person_id":39781430.0},{"\
person_id":83983790.0},{"person_id":75610593.0},{"person_id":18663652.0},{"person_id":18734445.0}],"case_mgr":[{"case_mgr_cd"\
:2233501695.0},{"case_mgr_cd":765257.0},{"case_mgr_cd":614404.0},{"case_mgr_cd":614406.0},{"case_mgr_cd":15003531.0},\
{"case_mgr_cd":6185567.0}],"pcp":[{"pcp_cd":1115.0}],"load_comments_ind":1,"load_phone_calls_ind":1}}' go

execute mp_dcp_pl_retrieve_col_data "MINE", json go
