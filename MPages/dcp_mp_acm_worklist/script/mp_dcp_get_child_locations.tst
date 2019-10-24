declare json = vc go

set json = '{"loc_request":{"location_cd":2185203473.00}}' go

execute mp_dcp_get_child_locations "MINE", json go
