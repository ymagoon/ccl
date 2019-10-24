var CERN_NEW_ORDER_ENTRY_O2_TEMPLATES = {
  before: function(scope) {
      scope.use(TemplateEngine.getHtmlTags());
  },
  
  modeless: function(context) {
      return div({"class":"noe2-favorites-modeless", "id":"noe2modeless" + context.id},
        div({"class":"noe2-fav-label"}, context.i18n.ADD_FAV_TO + ":"),
        div({"class":"noe2-folder-dropdown", "id":"noe2dropdown" + context.id}),
        div({"class":"noe2-modeless-btns"},
            button({"class":"noe2-btn-cancel"},context.i18n.CANCEL),
            button({"class":"noe2-btn-add"},context.i18n.ADD)
        )
      );
  },
  
  removeModeless: function(context) {
	return div({"class":"noe2-remove-modeless", "id":"noe2remove" + context.id},
		button({"class":"noe2-btn-cancel"}, context.i18n.CANCEL),
		button({"class":"noe2-btn-remove"}, context.i18n.REMOVE)
	);
  }
};
