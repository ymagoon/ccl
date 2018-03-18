Ext.define('univnm.ext.store.StatusBarTasks', {
	extend: 'Ext.data.Store',
	alias: 'store.StatusBarTasks',
	fields: [
		'when',
		'what'
	],

	busy: function(what) {
		var $this = this,
			profiler = $profiler.begin(what),
			m = (this.add({ when: new Date(), what: what }))[0];
		return function() {
			$this.remove(m);
			profiler();
		};
	}
});

Ext.data.StoreManager.add("StatusBarTasks", Ext.create('univnm.ext.store.StatusBarTasks', {}));
/* Class:  univnm.ext.Statusbar
	A status bar you can incorporate into your application. Has elements of a profiler in it,
	and internally uses and augments the standardized profiler.

	Topic: Examples
	(code)
		Ext.define("MPAGE.store.People", {
			extend: "Ext.data.Store",
			constructor: function(config) {
				this.callParent([config]);
				this.on({
					beforeload: function(store) {
						store.on({
							load: $profiler.status("Loading People"),
							single: true
						});
					}
				});
			}
		});
	(end)

	Topic: Profiling
	Any status update is automatically profiled in the debug window. The call to $profiler.status()
	returns a function to mark that action complete. It's equivalent to:
	(code)
		$profiler.begin("test")
	(end)
	Statusbar will provide timing information after the status text. That is, $profiler.status("Loading")
	will produce text: "Loading (running for 1 second)", "Loading (running for 2 seconds)", etc. The
	timing information can be surpressed by setting a showTime: false in the object configuration:
	(code)
		{
			xtype: "panel",
			title: "Main Panel",
			dockedItems: [
				{
					xtype: "asyncstatusbar",
					showTime: false
				}
			]
		}
	(end)

	Topic: Additional Buttons
	You can attach additional buttons (or other objects) to the status bar.
	(code)
		{
			xtype: "asyncstatusbar",
			buttons: [
				{
					xtype: "button",
					text: "Availability",
					menu: {
						items: [
							{
								text: "Online"
							},
							{
								text: "Offline"
							}
						]
					}
				}
			]
		}
	(end)
*/
Ext.define("univnm.ext.Statusbar", {
	extend: "Ext.toolbar.Toolbar",
	alias: "widget.asyncstatusbar",
	items: [
		{
			xtype: "tbtext",
			name: "generalstatus",
			text: "Loading..."
		},
		'->'
	],
	defaultText: "Ready",
	dateFormat: "g:ia",
	store: "StatusBarTasks",
	dock: "bottom",
	showTime: true,

	constructor: function(config) {
		var $this = this;
		this.callParent(arguments);

		if (typeof $this.store == "string") $this.store = Ext.data.StoreManager.get($this.store);
		$profiler.status = function(status) {
			return Ext.data.StoreManager.get("StatusBarTasks").busy(status);
		};

		this.store.on({
			datachanged: this.changeStatusText,
			scope: this
		});

		if (config.showTime) this.showTime = !!config.showTime;

		if (typeof config.buttons == "object" && config.buttons.length) {
			config.buttons.forEach(function(b) {
				$this.add(b);
			});
		}

		this.changeStatusText(this.store);
	},
	changeStatusText: function(store, options) {
		var $this = this, statusText = "";
		if (!$this.generalstatus) $this.generalstatus = $this.down("tbtext[name=generalstatus]");

		if (store.getCount() > 0) {
			var task = store.last();
			var taskStart = task.get("when");
			var taskLen = parseInt((new Date().getTime() - taskStart.getTime()) / 1000, 10); // in seconds
			if ($this.showTime && taskLen > 0) {
				statusText = taskStart.format(this.dateFormat) + ": " + task.get("what") + " (running for " + taskLen + " seconds)";
				setTimeout(function() {
					$this.changeStatusText(store, options);
				}, 1000);
			} else {
				statusText = taskStart.format(this.dateFormat) + ": " + task.get("what");
				if ($this.showTime) {
					setTimeout(function() {
						$this.changeStatusText(store, options);
					}, 1000);
				}
			}
		} else {
			statusText = new Date().format(this.dateFormat) + ": " + this.defaultText;
		}
		if (this.generalstatus && this.generalstatus.el) {
			this.generalstatus.suspendEvents();
			this.generalstatus.el.dom.innerHTML = statusText;
			this.generalstatus.resumeEvents(false);
		}
	}
});