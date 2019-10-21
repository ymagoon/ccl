This folder has been created to store custom MPages content and is intended to be used for both 
custom components and entire custom MPages Views.  It has been reserved internally at Cerner so 
that it's contents will never be overwritten on successive package installs.  All of the 
contents of this folder will be read and cached on the MPages Static Content Enterprise Applicance 
webserver (MPages webserver).  If you wish to utilize this caching functionality in a custom 
MPages View, you will need to update your file references with the correct URL path of the MPages 
webserver.  You can utilize the query below to retrieve this correct URL.

select into "nl:"
from dm_info d
where d.info_domain = "INS"
and d.info_name = "CONTENT_SERVICE_URL"

All custom component code intended to be used inside of an MPages View must be placed in the following locations
JavaScript files: CODE_WAREHOUSE/custom_mpage_content/custom-components/js/custom-components.js
CSS files: CODE_WAREHOUSE/custom_mpage_content/custom-components/css/custom-components.css