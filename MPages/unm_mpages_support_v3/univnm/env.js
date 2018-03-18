/* Class: $env
	server-specific environment object

	This file should be copied to each MPage server and then customized to that environment


	Property: purpose
		Use for environment specific switching, such as debug code.


		Examples:
			* DEV
			* CERT
			* BUILD
			* PROD
		Usage:
		(code)
			function debug(value){
				if ($env.purpose == "DEV"){
					debug_window(value)
				}
			}
		(end)
		See Also:
			* <appendDev>

	Property: cclMask
		this mask is applied to ccl calls sent through <univnm.jslib.ccl_callback>

		See also:
		* <univnm.jslib.applyCclMask>

	Property: baseUrl
		Base URL for the directory containing these MPages.

		This is useful for Constructing URL's inside your MPages

	Property: serviceUrl
		Base datasource URL when not running inside of powerchart.

		This is used by callback functions when XMLCclRequest is not available.
		A normal XMLHttpRequest is made using this url, with the ccl name
		inserted in place of {ccl} and the comma separated list of
		parameters inserted in place of {params}.

		This could point to static data files, and MPage Service instance, or an
		arbitrary application server like our Myna-based proxy

		Examples:
		(code)
			// MPage web service, only works if your mpageas are also served from here
			serviceUrl:"https://example.com/discern/mpages/reports/{ccl}?parameters={params}"

			// static datafiles relative to the current page
			serviceUrl:"data/{ccl}.json"

			// a web app that dynamically generates test data
			serviceUrl:"https://myhost.com/datagen/index.cfm?ccl={ccl}&params={params}"

			// a web proxy to the mpages service, only works if your mpageas are also served from here
			serviceUrl:"https://myhost.com/cerner_proxy/route.sjs?ccl={ccl}"
			serviceMethod:"POST"

		(end)

		Note that when serviceMethod = "POST" a property "parameters" will be
		posted as the multipart/form-data content of the request

		See Also:
		* <serviceMethod>

	Property: serviceMethod
		HTTP method to use with <serviceUrl>

		Defaults to "GET". "POST" is preferred if your service supported it


	Property: mpageType
		Default type of mpage environment available

		Should be one of these values:
			external		-	Not running in PowerChart or Discern Viewer.
								<$env.serviceUrl> will be used for callbacks and
								special functions like applink are not available
			org				-	Running in powerchart at the organizer level.
								Special functions like applink are available as
								is user_id but patient id and encounter id are
								not
			chart			-	Running in powerchart at the organizer level.
								Special functions like applink are available as
								is user_id, patient id and encounter id

		This can be overridden by passing env_mpagetype=<value> in the URL. The
		mpages_jslib file will detect this and override $env and set a cookie so
		that all pages launched from this page will also be aware of the mpage
		type

	Property: domain
		domain for this mpages installation.

	Property: instance
		subdomain name

		This is normally undefined but is useful for partitioning a domain into
		subdomains. A good example of this is creating a "build" subdomain
		instance in your production domain so that you can test your mpages with
		production data. The ACL system will automatically prepend instance names
		to ACL tests so that a test for "appname" becomes "instance/appname",
		allowing for different permissions for MPages in subdomains. Some UNMH
		tables like cust_values will also partition data by instance name

	Property: compilerUrl
		URL to the UNMH Script Compiler

		If you have the UNMH script compiler installed, and are using the UNMH
		MPage Ext template for your MPages, this url should point to that
		installation. Avery time you load your mpage's debug.html in a browser,
		this URL will be called to compile all of the dynamically referenced
		script includes into index.html

	Property: errorUrl
		URL to the UNMH error reporter

		If you have the UNMH error reporter installed, and are using the UNMH
		MPage Ext template for your MPages, this url should point to that
		installation. All errors encountered will automatically posted to that
		URL. Users will also have an opportunity to add additional information


	Topic: Examples
	webserver with mpage service proxy
	(code)
		var $env={
			purpose:"DEV",
			domain:"p126",
			instance: 'web',
			baseUrl:"https://web.server.tld/mpages",
			serviceUrl:"https://web.server.tld/cerner_proxy/route_post.sjs?domain=b126&ccl={ccl}",
			cclMask:"1_{ccl}_b",
			serviceMethod:"POST",
			compilerUrl:"https://web.server.tld/script_compiler",
			mpageType:"external"
		}
	(end)

	I: drive, production, web error handler
	(code)
		var $env={
			purpose:"PROD",
			domain:"p126",
			baseUrl:"file:/I:/custom/mpages",
			cclMask:"1_{ccl}_p",
			errorUrl:"https://web.server.tld/myna_dev/mpage_error_report.sjs",
			mpageType:"chart"
		}
	(end)
*/