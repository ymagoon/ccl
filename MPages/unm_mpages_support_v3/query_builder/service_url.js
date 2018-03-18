if ($env.mpageType=="external" && !jaaulde.utils.cookies.get("CERNERTOKEN")){
}

/*if ($env.purpose=="DEV" && $env.mpageType=="external"){
	$env.serviceMethod="POST";
	$env.serviceUrl="/myna_dev/cerner_proxy/route_post.sjs?domain=c126&ccl={ccl}";
	$env.cclMask="1_{ccl}_c";
}*/

if (inMpage && $env.purpose=="DEV"){
	$env.cclMask="1_{ccl}_b";
	$env.purpose ="BUILD";
	$env.baseUrl="file:/I:/custom/mpages";
}
