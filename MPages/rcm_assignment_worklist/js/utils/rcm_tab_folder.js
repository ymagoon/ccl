// TODO: Add Javadoc style comments and move this code to its own project
var RCM_TabFolder = function() {
	function TabFolderBuilder() {
		this.tabs = [];
		this.addTab = function(display, tabContentId, eventHandler) {
			this.tabs.push(new Tab(display, tabContentId, eventHandler));
		};
		
		this.setTabFolderId = function(tabFolderId) {
			this.tabFolderId = tabFolderId;
		}
		
		this.setParentId = function(parentId) {
			this.parentId = parentId;
		}
	}	
		
	function Tab(display, contentId, eventHandler) {
		this.display = display;
		this.contentId = contentId;
		this.eventHandler = eventHandler;
	}
	
	return {
		createTabFolderBuilder : function() {
			return new TabFolderBuilder();
		}, 
		
		createTabFolder : function(tabFolderBuilder) {
			var tabFolder = Util.ce("div");
			tabFolder.id = tabFolderBuilder.tabFolderId;
			tabFolder.className = "rcm-tab-folder";
			Util.ac(tabFolder, document.getElementById(tabFolderBuilder.parentId));
			
			var tabsHtml = [];
			tabsHtml.push("<div class=''crvf-content'>");
			var tabContentIds = [];
			for (var index = 0, length = tabFolderBuilder.tabs.length; index < length; index++) {
				var tabValues = tabFolderBuilder.tabs[index];
				tabsHtml.push("<span id='", tabFolder.id + index, "'>", tabValues.display, "</span>");
				tabContentIds.push(tabValues.contentId);
			}
			tabsHtml.push("</div>");
			tabFolder.innerHTML = tabsHtml.join("");
			
			var tabs = tabFolder.getElementsByTagName("span");			
			for (var index = 0, length = tabs.length; index < length; index++) {
				var tab = tabs[index];
				Util.addEvent(tab, "click", function() {					
					for (var index = 0, length = tabs.length; index < length; index++) {
						var tab = tabs[index];
						var content = document.getElementById(tabContentIds[index]);
						if (tab === this) {
							Util.Style.acss(tab, "rcm-tab-folder-active");
							if (content) {
								content.style.display = "block";
							}
							if (tab.focusElementId) {
								var focusElement = document.getElementById(tab.focusElementId);
								if (focusElement) {
									if (!focusElement.disabled) {
										try {
											focusElement.focus();
										} catch (ex) {
										}
									}
								}
							}
						} else {							
							Util.Style.rcss(tab, "rcm-tab-folder-active");
							if (content) {
								content.style.display = "none";
							}
						}
					}
				});
				var eventHandler = tabFolderBuilder.tabs[index].eventHandler;
				if (eventHandler) {
					Util.addEvent(tab, "click", eventHandler);
				}
				
				if (index === 0) {
					Util.Style.acss(tab, "rcm-tab-folder-active");
					tab.click();
				}
			}			
		}, 
		
		setSelectedTab : function(tabFolderId, tabIndex) {
			var tabFolder = document.getElementById(tabFolderId);
			tabFolder.getElementsByTagName("span")[tabIndex].click();
		}, 
		
		setFocusElement : function(tabFolderId, tabIndex, focusElementId) {
			var tabFolder = document.getElementById(tabFolderId);
			tabFolder.getElementsByTagName("span")[tabIndex].focusElementId = focusElementId;
		}
	};
}();