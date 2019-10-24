PersonSearchButton=(function(){function Button(namespace,onClickCallback){this._namespace=namespace;
this._id=newId();
this._onClickCallback=onClickCallback;
}Button.prototype.attribute_id=function(){return"person_search_button"+this._id;
};
Button.prototype.attribute_class=function(){return this._namespace+"_person_search";
};
Button.prototype.enable=function(){$("#"+this.attribute_id()).prop("disabled",false);
};
Button.prototype.disable=function(){$("#"+this.attribute_id()).prop("disabled",true);
};
Button.prototype.render=function(){return"<button id='"+this.attribute_id()+"' type='button' class='"+this.attribute_class()+"'>"+HcmReferral.i18n.SEARCH_PERSON+"</button>";
};
Button.prototype.finalize=function(){$(document).on("click","#"+this.attribute_id(),this._onClickCallback);
};
var id=0;
function newId(){return id++;
}return Button;
})();
