univnm.controller_shared=true;
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath("univnm", "../univnm");


Ext.ns("C");
Ext.apply(C, {
/* Property: isSenchaTouch
	Set if controller_touch.js is included because it'll only be included with Sencha Touch */
	isSenchaTouch: true,

/* Property: C.controllers
	Array of controller names to add to the application definition.

	example:
	(code)
		C.controllers.push("Perm")
		Ext.define('MPAGE.controller.Perm', {
			extend: 'Ext.app.Controller',
			...
		})
		...
		Ext.application({
			name: 'MPAGE',
			controllers:C.controllers,
			...
		})
	(end)



	*/
	controllers:[],

});

/* Function: C.infoMsg
	displays an informational message in a "growl" like pop-up window

	Parameters:
		template	-	Text to display. Numbered replacement variables
						"{0},{1}...{n}" will be replaced with any following
						parameters

	Example:
	(code)
		C.infoMsg("Comment Saved");
		C.infoMsg("User '{0}' not found in system",input.value);

	(end)
	*/
	C.infoMsg= function(template/*,replacement 1,replacement 2,... */){

	}
/* Function: C.about
		Displays the "about" screen. This is the same window triggered by
		clicking the "help" tool

		Parameters:
			errorText		-	*Optional*
								If defined, this text will be displayed in an
								"error" tab

	*/
	C.about=function(errorText){

	}

/* ----------- MPAGE.controllers.ControllerInit ----------------------------- */
	C.controllers.push("univnm.controller.ControllerInit")
	Ext.define('univnm.controller.ControllerInit', {
		extend: 'Ext.app.Controller',
		requires:[
			"univnm.db",
			"univnm.ext.QueryStore"
		],

		launch: function() {
			this.callParent();
			C.Settings.fireQueuedEvents();
		}
	});
/* ---------------- redirect to external login is configured ---------------- */
	if (
		$env.mpageType == "external"
		&& $env.loginUrl
		&& !jaaulde.utils.cookies.get("CAC_"+$env.domain)
	){
	var url = $env.loginUrl + "?domain={0}&callback={1}&appname={2}".format(
			$env.domain,
			encodeURIComponent(location.href)
		)

		//debugger;
		location.href=url
	}
/* ---------------- Ext.onReady --------------------------------------------- */
	Ext.onReady(function(){
		univnm.jslib.load_mpage_ids();
		var options = C.options
		C.session_id = C.createUuid();
		if (!options.dontAcl && !C.hasAccess(options.appname)){

			C.infoMsg("You do not have access to this MPage.");
			throw new Error("You do not have access to this MPage.")
		}

		//logs access
		C.logStat()


		var oldDecode = (Ext.JSON?Ext.JSON:Ext.util.JSON).decode;
		Ext.decode = (Ext.JSON?Ext.JSON:Ext.util.JSON).decode = function(text){
			try{
				if (!text || text.trim().length == 0) return "";
				return univnm.jsonDecode(text);
			} catch(e){
				C.handleError({
					type:"decode",
					e:e,
					json:text
				})
				//now in global error handler
				//C.body.unmask();
				throw e;
			}
		}


		try {
			if (!options.version){
				if ($env.version){
					options.version = $env.version;
				}else {
					univnm.jslib.loadScript("version.js",function(){
						options.version = $env.version;
					})
				}
			}
		} catch(e){
			//we don't care if this doesn't work

		}
		var apps=[]

		if (!options.displayName && !C.localMode){
			var apps = univnm.db.query(
				[
					"select  ",
					"a.app_name, ",
					"a.display_name, ",
					"a.is_portlet ",
					"from unmh.cust_applications a ",
					"where '{app_name}' = 'ALL' or app_name = '{app_name}'	 "

				],
				{
					app_name:options.appname.toLowerCase()
				}
			);
			if (apps && apps.length){
				options.displayName=apps[0].display_name
			} else 	{
				options.displayName=options.appname
			}
		}

		// C.loadValues();
		C.Settings.load();

	});
/* ------------ imported Ext4 code ------------------------------------------ */
	Ext.define('Ext.data.IdGenerator', {

		/**
		 * @property {Boolean} isGenerator
		 * `true` in this class to identify an object as an instantiated IdGenerator, or subclass thereof.
		 */
		isGenerator: true,

		/**
		 * Initializes a new instance.
		 * @param {Object} config (optional) Configuration object to be applied to the new instance.
		 */
		constructor: function(config) {
			var me = this;

			Ext.apply(me, config);

			if (me.id) {
				Ext.data.IdGenerator.all[me.id] = me;
			}
		},

		/**
		 * @cfg {String} id
		 * The id by which to register a new instance. This instance can be found using the
		 * {@link Ext.data.IdGenerator#get} static method.
		 */

		getRecId: function (rec) {
			return rec.modelName + '-' + rec.internalId;
		},

		/**
		 * Generates and returns the next id. This method must be implemented by the derived
		 * class.
		 *
		 * @return {String} The next id.
		 * @method generate
		 * @abstract
		 */

		statics: {
			/**
			 * @property {Object} all
			 * This object is keyed by id to lookup instances.
			 * @private
			 * @static
			 */
			all: {},

			/**
			 * Returns the IdGenerator given its config description.
			 * @param {String/Object} config If this parameter is an IdGenerator instance, it is
			 * simply returned. If this is a string, it is first used as an id for lookup and
			 * then, if there is no match, as a type to create a new instance. This parameter
			 * can also be a config object that contains a `type` property (among others) that
			 * are used to create and configure the instance.
			 * @static
			 */
			get: function (config) {
				var generator,
					id,
					type;

				if (typeof config == 'string') {
					id = type = config;
					config = null;
				} else if (config.isGenerator) {
					return config;
				} else {
					id = config.id || config.type;
					type = config.type;
				}

				generator = this.all[id];
				if (!generator) {
					generator = Ext.create('idgen.' + type, config);
				}

				return generator;
			}
		}
	});

	Ext.define('Ext.data.UuidGenerator', (function () {
		var twoPow14 = Math.pow(2, 14),
			twoPow16 = Math.pow(2, 16),
			twoPow28 = Math.pow(2, 28),
			twoPow32 = Math.pow(2, 32);

		function toHex (value, length) {
			var ret = value.toString(16);
			if (ret.length > length) {
				ret = ret.substring(ret.length - length); // right-most digits
			} else if (ret.length < length) {
				ret = Ext.String.leftPad(ret, length, '0');
			}
			return ret;
		}

		function rand (lo, hi) {
			var v = Math.random() * (hi - lo + 1);
			return Math.floor(v) + lo;
		}

		function split (bignum) {
			if (typeof(bignum) == 'number') {
				var hi = Math.floor(bignum / twoPow32);
				return {
					lo: Math.floor(bignum - hi * twoPow32),
					hi: hi
				};
			}
			return bignum;
		}

		return {
			extend: 'Ext.data.IdGenerator',

			alias: 'idgen.uuid',

			id: 'uuid', // shared by default

			/**
			 * @property {Number/Object} salt
			 * When created, this value is a 48-bit number. For computation, this value is split
			 * into 32-bit parts and stored in an object with `hi` and `lo` properties.
			 */

			/**
			 * @property {Number/Object} timestamp
			 * When created, this value is a 60-bit number. For computation, this value is split
			 * into 32-bit parts and stored in an object with `hi` and `lo` properties.
			 */

			/**
			 * @cfg {Number} version
			 * The Version of UUID. Supported values are:
			 *
			 *  * 1 : Time-based, "sequential" UUID.
			 *  * 4 : Pseudo-random UUID.
			 *
			 * The default is 4.
			 */
			version: 4,

			constructor: function() {
				var me = this;

				me.callParent(arguments);

				me.parts = [];
				me.init();
			},

			generate: function () {
				var me = this,
					parts = me.parts,
					ts = me.timestamp;

				/*
				   The magic decoder ring (derived from RFC 4122 Section 4.2.2):

				   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
				   |                          time_low                             |
				   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
				   |           time_mid            |  ver  |        time_hi        |
				   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
				   |res|  clock_hi |   clock_low   |    salt 0   |M|     salt 1    |
				   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
				   |                         salt (2-5)                            |
				   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

							 time_mid      clock_hi (low 6 bits)
					time_low     | time_hi |clock_lo
						|        |     |   || salt[0]
						|        |     |   ||   | salt[1..5]
						v        v     v   vv   v v
						0badf00d-aced-1def-b123-dfad0badbeef
									  ^    ^     ^
								version    |     multicast (low bit)
										   |
										reserved (upper 2 bits)
				*/
				parts[0] = toHex(ts.lo, 8);
				parts[1] = toHex(ts.hi & 0xFFFF, 4);
				parts[2] = toHex(((ts.hi >>> 16) & 0xFFF) | (me.version << 12), 4);
				parts[3] = toHex(0x80 | ((me.clockSeq >>> 8) & 0x3F), 2) +
						   toHex(me.clockSeq & 0xFF, 2);
				parts[4] = toHex(me.salt.hi, 4) + toHex(me.salt.lo, 8);

				if (me.version == 4) {
					me.init(); // just regenerate all the random values...
				} else {
					// sequentially increment the timestamp...
					++ts.lo;
					if (ts.lo >= twoPow32) { // if (overflow)
						ts.lo = 0;
						++ts.hi;
					}
				}

				return parts.join('-').toLowerCase();
			},

			getRecId: function (rec) {
				return rec.getId();
			},

			/**
			 * @private
			 */
			init: function () {
				var me = this,
					salt, time;

				if (me.version == 4) {
					// See RFC 4122 (Secion 4.4)
					//   o  If the state was unavailable (e.g., non-existent or corrupted),
					//      or the saved node ID is different than the current node ID,
					//      generate a random clock sequence value.
					me.clockSeq = rand(0, twoPow14-1);

					// we run this on every id generation...
					salt = me.salt || (me.salt = {});
					time = me.timestamp || (me.timestamp = {});

					// See RFC 4122 (Secion 4.4)
					salt.lo = rand(0, twoPow32-1);
					salt.hi = rand(0, twoPow16-1);
					time.lo = rand(0, twoPow32-1);
					time.hi = rand(0, twoPow28-1);
				} else {
					// this is run only once per-instance
					me.salt = split(me.salt);
					me.timestamp = split(me.timestamp);

					// Set multicast bit: "the least significant bit of the first octet of the
					// node ID" (nodeId = salt for this implementation):
					me.salt.hi |= 0x100;
				}
			},

			/**
			 * Reconfigures this generator given new config properties.
			 */
			reconfigure: function (config) {
				Ext.apply(this, config);
				this.init();
			}
		};
	}()));