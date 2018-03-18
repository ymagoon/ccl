/* Class: univnm.ext.SequenceGenerator
	(proxy type = seq) Ext.data.idGenerator that loads from a database sequence
	
	
	Config Properties:
		sequence		-	String, default 'cust_main_seq'
							name of sequence to query for new ids
	
	Note:
		The sequence query is a synchronous callback and is triggered whenever 
		a new model instance is created that does not define an id value. This 
		should not be used on models that might be created in a large batch
		
	Example:
	(code)
		Ext.define('MPAGE.model.Menu', {
			extend: 'Ext.data.Model',
			proxy:"row",
			table:"cust_menus",
			fields:[
				{name:"id",									sqlDefault:"#cust_menus_seq.nextval"},
				{name:"name",		naturalKey:true},
				{name:"base_dir",	naturalKey:true, defaultValue:"file:/I:/custom/mpages"},
				{name:"title"}
			],
			idgen: {
				type: 'seq',
				sequence:"cust_menus_seq"
			},
			readSql:[
				"Select ",
				"	id, ",
				"	name, ",
				"	title, ",
				"	base_dir ",
				"from ",
				"	cust_menus t",
				"where ",
				"	{conditions} "
			]
		});

		
		
	(end)	
	
*/
Ext.define('univnm.ext.SequenceGenerator', {
	extend: 'Ext.data.IdGenerator',
	alias: 'idgen.seq',
	/* constructor:function(config){
		this.
		this.callParent(arguments)
	} */
	sequence:"cust_seq_main",
	generate:function(){
		return univnm.db.query(
			"select {sequence}.nextval from dual",
			this
		)[0].nextval
	}
});