
if(!window.CanvasRenderingContext2D){(function(){var I=Math,i=I.round,L=I.sin,M=I.cos,m=10,A=m/2,Q={init:function(a){var b=a||document;if(/MSIE/.test(navigator.userAgent)&&!window.opera){var c=this;b.attachEvent("onreadystatechange",function(){c.r(b)})}},r:function(a){if(a.readyState=="complete"){if(!a.namespaces["s"]){a.namespaces.add("g_vml_","urn:schemas-microsoft-com:vml")}var b=a.createStyleSheet();b.cssText="canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}g_vml_\\:*{behavior:url(#default#VML)}";
var c=a.getElementsByTagName("canvas");for(var d=0;d<c.length;d++){if(!c[d].getContext){this.initElement(c[d])}}}},q:function(a){var b=a.outerHTML,c=a.ownerDocument.createElement(b);if(b.slice(-2)!="/>"){var d="/"+a.tagName,e;while((e=a.nextSibling)&&e.tagName!=d){e.removeNode()}if(e){e.removeNode()}}a.parentNode.replaceChild(c,a);return c},initElement:function(a){a=this.q(a);a.getContext=function(){if(this.l){return this.l}return this.l=new K(this)};a.attachEvent("onpropertychange",V);a.attachEvent("onresize",
W);var b=a.attributes;if(b.width&&b.width.specified){a.style.width=b.width.nodeValue+"px"}else{a.width=a.clientWidth}if(b.height&&b.height.specified){a.style.height=b.height.nodeValue+"px"}else{a.height=a.clientHeight}return a}};function V(a){var b=a.srcElement;switch(a.propertyName){case "width":b.style.width=b.attributes.width.nodeValue+"px";b.getContext().clearRect();break;case "height":b.style.height=b.attributes.height.nodeValue+"px";b.getContext().clearRect();break}}function W(a){var b=a.srcElement;
if(b.firstChild){b.firstChild.style.width=b.clientWidth+"px";b.firstChild.style.height=b.clientHeight+"px"}}Q.init();var R=[];for(var E=0;E<16;E++){for(var F=0;F<16;F++){R[E*16+F]=E.toString(16)+F.toString(16)}}function J(){return[[1,0,0],[0,1,0],[0,0,1]]}function G(a,b){var c=J();for(var d=0;d<3;d++){for(var e=0;e<3;e++){var g=0;for(var h=0;h<3;h++){g+=a[d][h]*b[h][e]}c[d][e]=g}}return c}function N(a,b){b.fillStyle=a.fillStyle;b.lineCap=a.lineCap;b.lineJoin=a.lineJoin;b.lineWidth=a.lineWidth;b.miterLimit=
a.miterLimit;b.shadowBlur=a.shadowBlur;b.shadowColor=a.shadowColor;b.shadowOffsetX=a.shadowOffsetX;b.shadowOffsetY=a.shadowOffsetY;b.strokeStyle=a.strokeStyle;b.d=a.d;b.e=a.e}function O(a){var b,c=1;a=String(a);if(a.substring(0,3)=="rgb"){var d=a.indexOf("(",3),e=a.indexOf(")",d+1),g=a.substring(d+1,e).split(",");b="#";for(var h=0;h<3;h++){b+=R[Number(g[h])]}if(g.length==4&&a.substr(3,1)=="a"){c=g[3]}}else{b=a}return[b,c]}function S(a){switch(a){case "butt":return"flat";case "round":return"round";
case "square":default:return"square"}}function K(a){this.a=J();this.m=[];this.k=[];this.c=[];this.strokeStyle="#000";this.fillStyle="#000";this.lineWidth=1;this.lineJoin="miter";this.lineCap="butt";this.miterLimit=m*1;this.globalAlpha=1;this.canvas=a;var b=a.ownerDocument.createElement("div");b.style.width=a.clientWidth+"px";b.style.height=a.clientHeight+"px";b.style.overflow="hidden";b.style.position="absolute";a.appendChild(b);this.j=b;this.d=1;this.e=1}var j=K.prototype;j.clearRect=function(){this.j.innerHTML=
"";this.c=[]};j.beginPath=function(){this.c=[]};j.moveTo=function(a,b){this.c.push({type:"moveTo",x:a,y:b});this.f=a;this.g=b};j.lineTo=function(a,b){this.c.push({type:"lineTo",x:a,y:b});this.f=a;this.g=b};j.bezierCurveTo=function(a,b,c,d,e,g){this.c.push({type:"bezierCurveTo",cp1x:a,cp1y:b,cp2x:c,cp2y:d,x:e,y:g});this.f=e;this.g=g};j.quadraticCurveTo=function(a,b,c,d){var e=this.f+0.6666666666666666*(a-this.f),g=this.g+0.6666666666666666*(b-this.g),h=e+(c-this.f)/3,l=g+(d-this.g)/3;this.bezierCurveTo(e,
g,h,l,c,d)};j.arc=function(a,b,c,d,e,g){c*=m;var h=g?"at":"wa",l=a+M(d)*c-A,n=b+L(d)*c-A,o=a+M(e)*c-A,f=b+L(e)*c-A;if(l==o&&!g){l+=0.125}this.c.push({type:h,x:a,y:b,radius:c,xStart:l,yStart:n,xEnd:o,yEnd:f})};j.rect=function(a,b,c,d){this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+d);this.lineTo(a,b+d);this.closePath()};j.strokeRect=function(a,b,c,d){this.beginPath();this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+d);this.lineTo(a,b+d);this.closePath();this.stroke()};j.fillRect=function(a,
b,c,d){this.beginPath();this.moveTo(a,b);this.lineTo(a+c,b);this.lineTo(a+c,b+d);this.lineTo(a,b+d);this.closePath();this.fill()};j.createLinearGradient=function(a,b,c,d){var e=new H("gradient");return e};j.createRadialGradient=function(a,b,c,d,e,g){var h=new H("gradientradial");h.n=c;h.o=g;h.i.x=a;h.i.y=b;return h};j.drawImage=function(a,b){var c,d,e,g,h,l,n,o,f=a.runtimeStyle.width,k=a.runtimeStyle.height;a.runtimeStyle.width="auto";a.runtimeStyle.height="auto";var q=a.width,r=a.height;a.runtimeStyle.width=
f;a.runtimeStyle.height=k;if(arguments.length==3){c=arguments[1];d=arguments[2];h=(l=0);n=(e=q);o=(g=r)}else if(arguments.length==5){c=arguments[1];d=arguments[2];e=arguments[3];g=arguments[4];h=(l=0);n=q;o=r}else if(arguments.length==9){h=arguments[1];l=arguments[2];n=arguments[3];o=arguments[4];c=arguments[5];d=arguments[6];e=arguments[7];g=arguments[8]}else{throw"Invalid number of arguments";}var s=this.b(c,d),t=[],v=10,w=10;t.push(" <g_vml_:group",' coordsize="',m*v,",",m*w,'"',' coordorigin="0,0"',
' style="width:',v,";height:",w,";position:absolute;");if(this.a[0][0]!=1||this.a[0][1]){var x=[];x.push("M11='",this.a[0][0],"',","M12='",this.a[1][0],"',","M21='",this.a[0][1],"',","M22='",this.a[1][1],"',","Dx='",i(s.x/m),"',","Dy='",i(s.y/m),"'");var p=s,y=this.b(c+e,d),z=this.b(c,d+g),B=this.b(c+e,d+g);p.x=Math.max(p.x,y.x,z.x,B.x);p.y=Math.max(p.y,y.y,z.y,B.y);t.push("padding:0 ",i(p.x/m),"px ",i(p.y/m),"px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",x.join(""),", sizingmethod='clip');")}else{t.push("top:",
i(s.y/m),"px;left:",i(s.x/m),"px;")}t.push(' ">','<g_vml_:image src="',a.src,'"',' style="width:',m*e,";"," height:",m*g,';"',' cropleft="',h/q,'"',' croptop="',l/r,'"',' cropright="',(q-h-n)/q,'"',' cropbottom="',(r-l-o)/r,'"'," />","</g_vml_:group>");this.j.insertAdjacentHTML("BeforeEnd",t.join(""))};j.stroke=function(a){var b=[],c=O(a?this.fillStyle:this.strokeStyle),d=c[0],e=c[1]*this.globalAlpha,g=10,h=10;b.push("<g_vml_:shape",' fillcolor="',d,'"',' filled="',Boolean(a),'"',' style="position:absolute;width:',
g,";height:",h,';"',' coordorigin="0 0" coordsize="',m*g," ",m*h,'"',' stroked="',!a,'"',' strokeweight="',this.lineWidth,'"',' strokecolor="',d,'"',' path="');var l={x:null,y:null},n={x:null,y:null};for(var o=0;o<this.c.length;o++){var f=this.c[o];if(f.type=="moveTo"){b.push(" m ");var k=this.b(f.x,f.y);b.push(i(k.x),",",i(k.y))}else if(f.type=="lineTo"){b.push(" l ");var k=this.b(f.x,f.y);b.push(i(k.x),",",i(k.y))}else if(f.type=="close"){b.push(" x ")}else if(f.type=="bezierCurveTo"){b.push(" c ");
var k=this.b(f.x,f.y),q=this.b(f.cp1x,f.cp1y),r=this.b(f.cp2x,f.cp2y);b.push(i(q.x),",",i(q.y),",",i(r.x),",",i(r.y),",",i(k.x),",",i(k.y))}else if(f.type=="at"||f.type=="wa"){b.push(" ",f.type," ");var k=this.b(f.x,f.y),s=this.b(f.xStart,f.yStart),t=this.b(f.xEnd,f.yEnd);b.push(i(k.x-this.d*f.radius),",",i(k.y-this.e*f.radius)," ",i(k.x+this.d*f.radius),",",i(k.y+this.e*f.radius)," ",i(s.x),",",i(s.y)," ",i(t.x),",",i(t.y))}if(k){if(l.x==null||k.x<l.x){l.x=k.x}if(n.x==null||k.x>n.x){n.x=k.x}if(l.y==
null||k.y<l.y){l.y=k.y}if(n.y==null||k.y>n.y){n.y=k.y}}}b.push(' ">');if(typeof this.fillStyle=="object"){var v={x:"50%",y:"50%"},w=n.x-l.x,x=n.y-l.y,p=w>x?w:x;v.x=i(this.fillStyle.i.x/w*100+50)+"%";v.y=i(this.fillStyle.i.y/x*100+50)+"%";var y=[];if(this.fillStyle.p=="gradientradial"){var z=this.fillStyle.n/p*100,B=this.fillStyle.o/p*100-z}else{var z=0,B=100}var C={offset:null,color:null},D={offset:null,color:null};this.fillStyle.h.sort(function(T,U){return T.offset-U.offset});for(var o=0;o<this.fillStyle.h.length;o++){var u=
this.fillStyle.h[o];y.push(u.offset*B+z,"% ",u.color,",");if(u.offset>C.offset||C.offset==null){C.offset=u.offset;C.color=u.color}if(u.offset<D.offset||D.offset==null){D.offset=u.offset;D.color=u.color}}y.pop();b.push("<g_vml_:fill",' color="',D.color,'"',' color2="',C.color,'"',' type="',this.fillStyle.p,'"',' focusposition="',v.x,", ",v.y,'"',' colors="',y.join(""),'"',' opacity="',this.e,'" />')}else if(a){b.push('<g_vml_:fill color="',d,'" opacity="',this.e,'" />')}else{b.push("<g_vml_:stroke",' opacity="',
this.e,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',S(this.lineCap),'"',' weight="',this.lineWidth,'px"',' color="',d,'" />')}b.push("</g_vml_:shape>");this.j.insertAdjacentHTML("beforeEnd",b.join(""));this.c=[]};j.fill=function(){this.stroke(true)};j.closePath=function(){this.c.push({type:"close"})};j.b=function(a,b){return{x:m*(a*this.a[0][0]+b*this.a[1][0]+this.a[2][0])-A,y:m*(a*this.a[0][1]+b*this.a[1][1]+this.a[2][1])-A}};j.save=function(){var a={};N(this,a);
this.k.push(a);this.m.push(this.a);this.a=G(J(),this.a)};j.restore=function(){N(this.k.pop(),this);this.a=this.m.pop()};j.translate=function(a,b){var c=[[1,0,0],[0,1,0],[a,b,1]];this.a=G(c,this.a)};j.rotate=function(a){var b=M(a),c=L(a),d=[[b,c,0],[-c,b,0],[0,0,1]];this.a=G(d,this.a)};j.scale=function(a,b){this.d*=a;this.e*=b;var c=[[a,0,0],[0,b,0],[0,0,1]];this.a=G(c,this.a)};j.clip=function(){};j.arcTo=function(){};j.createPattern=function(){return new P};function H(a){this.p=a;this.n=0;this.o=
0;this.h=[];this.i={x:0,y:0}}H.prototype.addColorStop=function(a,b){b=O(b);this.h.push({offset:1-a,color:b})};function P(){}G_vmlCanvasManager=Q;CanvasRenderingContext2D=K;CanvasGradient=H;CanvasPattern=P})()};
JS={extend:function(a,b){b=b||{};
for(var c in b){if(a[c]===b[c])continue;
a[c]=b[c]}return a},makeFunction:function(){return function(){return this.initialize?(this.initialize.apply(this,arguments)||this):this}},makeBridge:function(a){var b=function(){};
b.prototype=a.prototype;return new b},delegate:function(a,b){return function(){return this[a][b].apply(this[a],arguments)}},bind:function(){var a=JS.array(arguments),b=a.shift(),c=a.shift()||null;return function(){return b.apply(c,a.concat(JS.array(arguments)))}},callsSuper:function(a){return a.SUPER===undefined?a.SUPER=/\bcallSuper\b/.test(a.toString()):a.SUPER},mask:function(a){var b=a.toString().replace(/callSuper/g,'super');
a.toString=function(){return b};return a},array:function(a){if(!a)return[];
if(a.toArray)return a.toArray();
var b=a.length,c=[];while(b--)c[b]=a[b];
return c},indexOf:function(a,b){for(var c=0,d=a.length;
c<d;c++){if(a[c]===b)return c}return-1},isFn:function(a){return a instanceof Function},ignore:function(a,b){return/^(include|extend)$/.test(a)&&typeof b==='object'}};
JS.Module=JS.makeFunction();
JS.extend(JS.Module.prototype,{initialize:function(a,b){b=b||{};
this.__mod__=this;this.__inc__=[];this.__fns__={};this.__dep__=[];this.__res__=b._1||null;
this.include(a||{})},define:function(a,b,c){c=c||{};this.__fns__[a]=b;if(JS.Module._0&&c._0&&JS.isFn(b))JS.Module._0(a,c._0);
var d=this.__dep__.length;
while(d--)this.__dep__[d].resolve()},instanceMethod:function(a){var b=this.lookup(a).pop();
return JS.isFn(b)?b:null},include:function(a,b,c){if(!a)return c&&this.resolve();b=b||{};
var d=a.include,f=a.extend,e,g,j,h,i=b._4||this;if(a.__inc__&&a.__fns__){this.__inc__.push(a);
a.__dep__.push(this);
if(b._2)a.extended&&a.extended(b._2);else a.included&&a.included(i)}else{if(b._5){for(h in a){if(JS.ignore(h,a[h]))continue;
this.define(h,a[h],{_0:i||b._2||this})}}else{if(typeof d==='object'){e=[].concat(d);for(g=0,j=e.length;g<j;g++)i.include(e[g],b)}if(typeof f==='object'){e=[].concat(f);
for(g=0,j=e.length;g<j;g++)i.extend(e[g],false);
i.extend()}b._5=true;return i.include(a,b,c)}}c&&this.resolve()},includes:function(a){if(Object===a||this===a||this.__res__===a.prototype)return true;var b=this.__inc__.length;while(b--){if(this.__inc__[b].includes(a))return true}return false},ancestors:function(a){a=a||[];
for(var b=0,c=this.__inc__.length;b<c;b++)this.__inc__[b].ancestors(a);var d=(this.__res__||{}).klass,f=(d&&this.__res__===d.prototype)?d:this;
if(JS.indexOf(a,f)===-1)a.push(f);return a},lookup:function(a){var b=this.ancestors(),c=[],d,f,e;
for(d=0,f=b.length;d<f;d++){e=b[d].__mod__.__fns__[a];
if(e)c.push(e)}return c},make:function(a,b){if(!JS.isFn(b)||!JS.callsSuper(b))return b;
var c=this;
return function(){return c.chain(this,a,arguments)}},chain:JS.mask(function(c,d,f){var e=this.lookup(d),g=e.length-1,j=c.callSuper,h=JS.array(f),i;
c.callSuper=function(){var a=arguments.length;
while(a--)h[a]=arguments[a];
g-=1;
var b=e[g].apply(c,h);
g+=1;return b};
i=e.pop().apply(c,h);
j?c.callSuper=j:delete c.callSuper;return i}),resolve:function(a){var a=a||this,b=a.__res__,c,d,f,e;
if(a===this){c=this.__dep__.length;
while(c--)this.__dep__[c].resolve()}if(!b)return;
for(c=0,d=this.__inc__.length;c<d;c++)this.__inc__[c].resolve(a);
for(f in this.__fns__){e=a.make(f,this.__fns__[f]);
if(b[f]!==e)b[f]=e}}});
JS.ObjectMethods=new JS.Module({__eigen__:function(){if(this.__meta__)return this.__meta__;var a=this.__meta__=new JS.Module({},{_1:this});
a.include(this.klass.__mod__);
return a},extend:function(a,b){return this.__eigen__().include(a,{_2:this},b!==false)},isA:function(a){return this.__eigen__().includes(a)},method:function(a){var b=this,c=b.__mcache__=b.__mcache__||{};
if((c[a]||{}).fn===b[a])return c[a].bd;return(c[a]={fn:b[a],bd:JS.bind(b[a],b)}).bd}});
JS.Class=JS.makeFunction();
JS.extend(JS.Class.prototype=JS.makeBridge(JS.Module),{initialize:function(a,b){var c=JS.extend(JS.makeFunction(),this);
c.klass=c.constructor=this.klass;if(!JS.isFn(a)){b=a;a=Object}c.inherit(a);
c.include(b,null,false);
c.resolve();
do{a.inherited&&a.inherited(c)}while(a=a.superclass);return c},inherit:function(a){this.superclass=a;if(this.__eigen__){this.__eigen__().include(a.__eigen__?a.__eigen__():new JS.Module(a.prototype));
this.__meta__.resolve()}this.subclasses=[];
(a.subclasses||[]).push(this);
var b=this.prototype=JS.makeBridge(a);
b.klass=b.constructor=this;
this.__mod__=new JS.Module({},{_1:this.prototype});
this.include(JS.ObjectMethods,null,false);
if(a!==Object)this.include(a.__mod__||new JS.Module(a.prototype,{_1:a.prototype}),null,false)},include:function(a,b,c){if(!a)return;var d=this.__mod__,b=b||{};
b._4=this;
return d.include(a,b,c!==false)},extend:function(a){if(!this.callSuper)return;
this.callSuper();
var b=this.subclasses.length;while(b--)this.subclasses[b].extend()},define:function(){var a=this.__mod__;a.define.apply(a,arguments);a.resolve()},includes:JS.delegate('__mod__','includes'),ancestors:JS.delegate('__mod__','ancestors'),resolve:JS.delegate('__mod__','resolve')});JS.Module=JS.extend(new JS.Class(JS.Module.prototype),JS.ObjectMethods.__fns__);
JS.Module.include(JS.ObjectMethods);
JS.Class=JS.extend(new JS.Class(JS.Module,JS.Class.prototype),JS.ObjectMethods.__fns__);
JS.Module.klass=JS.Module.constructor=JS.Class.klass=JS.Class.constructor=JS.Class;JS.Module.extend({_3:[],methodAdded:function(a,b){this._3.push([a,b])},_0:function(a,b){var c=this._3,d=c.length;while(d--)c[d][0].call(c[d][1]||null,a,b)}});
JS.extend(JS,{Interface:new JS.Class({initialize:function(d){this.test=function(a,b){var c=d.length;
while(c--){if(!JS.isFn(a[d[c]]))return b?d[c]:false}return true}},extend:{ensure:function(){var a=JS.array(arguments),b=a.shift(),c,d;
while(c=a.shift()){d=c.test(b,true);if(d!==true)throw new Error('object does not implement '+d+'()');}}}}),Singleton:new JS.Class({initialize:function(a,b){return new(new JS.Class(a,b))}})});

JGraph = {

  array: function(list) {
    if (list.length === undefined) return [list];
    var ary = [], i = list.length;
    while (i--) ary[i] = list[i];
    return ary;
  },
  
  each: function(list, block, context) {
    for (var i = 0, n = list.length; i < n; i++) {
      block.call(context || null, list[i], i);
    }
  },
  
  reverse_each: function(list, block, context) {
    var i = list.length;
    while (i--) block.call(context || null, list[i], i);
  },
  
  sum: function(list) {
    var sum = 0, i = list.length;
    while (i--) sum += list[i];
    return sum;
  },
  
  Mini: {}
};
 
JGraph.Base = new JS.Class({
  extend: {
    // Draw extra lines showing where the margins and text centers are
    DEBUG: false,
    
    // Used for navigating the array of data to plot
    DATA_LABEL_INDEX: 0,
    DATA_VALUES_INDEX: 1,
    DATA_COLOR_INDEX: 2,
 
    // Space around text elements. Mostly used for vertical spacing
    LEGEND_MARGIN: 10,
    TITLE_MARGIN: 10,
    LABEL_MARGIN: 12,
 
    DEFAULT_TARGET_WIDTH: 800
  },
  
  marker_size: null,
  
  // Blank space above the graph
  top_margin: null,
 
  // Blank space below the graph
  bottom_margin: 10,
 
  // Blank space to the right of the graph
  right_margin: null,
 
  // Blank space to the left of the graph
  left_margin: null,
 
  // A hash of names for the individual columns, where the key is the array
  // index for the column this label represents.
  //
  // Not all columns need to be named.
  //
  // Example: {0: 2005, 3: 2006, 5: 2007, 7: 2008}
  labels: null,
 
  // Used internally for spacing.
  //
  // By default, labels are centered over the point they represent.
  center_labels_over_point: null,
 
  // Used internally for horizontal graph types.
  has_left_labels: null,
 
  // A label for the bottom of the graph
  x_axis_label: null,
 
  // A label for the left side of the graph
  y_axis_label: null,
  
  
   // A label for the right side of the graph
  y2_axis_label: null,
  
   // A label for the right side of the graph
  y2_axis_type: null,
 
  // x_axis_increment: null,
 
  // Manually set increment of the horizontal marking lines
  y_axis_increment: null,
  
   // Manually set increment of the horizontal marking lines
  y2_axis_increment: null,
 
  // Get or set the list of colors that will be used to draw the bars or lines.
  colors: null,
 
  // The large title of the graph displayed at the top
  title: null,
 
  // Font used for titles, labels, etc.
  font: null,
  
  
  tooltipid: null,
  
  graphid: null,
 
  font_color: null,
 
  // Prevent drawing of line markers
  hide_line_markers: null,
 
  // Prevent drawing of the legend
  hide_legend: null,
 
  // Prevent drawing of the title
  hide_title: null,
 
  // Prevent drawing of line numbers
  hide_line_numbers: null,
 
  // Message shown when there is no data. Fits up to 20 characters. Defaults
  // to "No Data."
  no_data_message: null,
 
  // The font size of the large title at the top of the graph
  title_font_size: null,
 
  // Optionally set the size of the font. Based on an 800x600px graph.
  // Default is 20.
  //
  // Will be scaled down if graph is smaller than 800px wide.
  legend_font_size: null,
 
  // The font size of the labels around the graph
  marker_font_size: null,
 
  // The color of the auxiliary lines
  marker_color: null,
 
  // The number of horizontal lines shown for reference
  marker_count: null,
 
  // You can manually set a minimum value instead of having the values
  // guessed for you.
  //
  // Set it after you have given all your data to the graph object.
  minimum_value: null,
 
  // You can manually set a maximum value, such as a percentage-based graph
  // that always goes to 100.
  //
  // If you use this, you must set it after you have given all your data to
  // the graph object.
  maximum_value: null,
  
  
  range_name: null,
  
  range_low: null,
  
  range_high : null,
  
  range_color: null,
  
  intervals : null,
  
  interval_length : null,
  
  start_dttm: null,
  
  stop_dttm: null,
  
  
    range_opacity: 0.01,
  
    // You can manually set a minimum value instead of having the values
  // guessed for you.
  //
  // Set it after you have given all your data to the graph object.
  y2_minimum_value: null,
 
  // You can manually set a maximum value, such as a percentage-based graph
  // that always goes to 100.
  //
  // If you use this, you must set it after you have given all your data to
  // the graph object.
  y2_maximum_value: null,
 
  // Set to false if you don't want the data to be sorted with largest avg
  // values at the back.
  sort: null,
 
  // Experimental
  additional_line_values: null,
 
  // Experimental
  stacked: null,
 
  // Optionally set the size of the colored box by each item in the legend.
  // Default is 20.0
  //
  // Will be scaled down if graph is smaller than 800px wide.
  legend_box_size: null,
  
  // If one numerical argument is given, the graph is drawn at 4/3 ratio
  // according to the given width (800 results in 800x600, 400 gives 400x300,
  // etc.).
  //
  // Or, send a geometry string for other ratios ('800x400', '400x225').
  initialize: function(renderer, target_width) {
    this._d = new JGraph.Renderer(renderer);
    target_width = target_width || this.klass.DEFAULT_TARGET_WIDTH;
    
    this.top_margin = this.bottom_margin =
    this.left_margin = this.right_margin = 20;
    
    var geo;
    
    if (typeof target_width != 'number') {
      geo = target_width.split('x');
      this._columns = parseFloat(geo[0]);
      this._rows = parseFloat(geo[1]);
    } else {
      this._columns = parseFloat(target_width);
      this._rows = this._columns * 0.75;
    }
    
    this.initialize_ivars();
    
    this._reset_themes();
    this.theme_keynote();
  },
  
  // Set instance variables for this object.
  //
  // Subclasses can override this, call super, then set values separately.
  //
  // This makes it possible to set defaults in a subclass but still allow
  // developers to change this values in their program.
  initialize_ivars: function() {
    // Internal for calculations
    this._raw_columns = 800;
    this._raw_rows = 800 * (this._rows/this._columns);
    this._column_count = 0;
    this.marker_count = null;
    this.maximum_value = this.minimum_value = this.y2_maximum_value = this.y2_minimum_value =  null;
    this._has_data = false;
    this._data = [];
    this.labels = {};
    this._labels_seen = {};
    this.sort = true;
    this.title = null;
 
    this._scale = this._columns / this._raw_columns;
 
    this.marker_font_size = 21.0;
    this.legend_font_size = 20.0;
    this.title_font_size = 36.0;
    
    this.legend_box_size = 20.0;
 
    this.no_data_message = "No Qualifying Data Found";
 
    this.hide_line_markers = this.hide_legend = this.hide_title = this.hide_line_numbers = false;
    this.center_labels_over_point = true;
    this.has_left_labels = false;
 
    this.additional_line_values = [];
    this._additional_line_colors = [];
    this._theme_options = {};
    
    this.x_axis_label = this.y_axis_label = this.y2_axis_label =null;
    this.y_axis_increment = this.y2_axis_increment = null;
    this.stacked = null;
    this._norm_data = null;
  },
  
  // Sets the top, bottom, left and right margins to +margin+.
  set_margins: function(margin) {
    this.top_margin = this.left_margin = this.right_margin = this.bottom_margin = margin;
  },
 
  // Sets the font for graph text to the font at +font_path+.
  set_font: function(font_path) {
    this.font = font_path;
    this._d.font = this.font;
  },
 
  // Add a color to the list of available colors for lines.
  //
  // Example:
  // add_color('#c0e9d3')
  add_color: function(colorname) {
    this.colors.push(colorname);
  },
 
  // Replace the entire color list with a new array of colors. You need to
  // have one more color than the number of datasets you intend to draw. Also
  // aliased as the colors= setter method.
  //
  // Example:
  // replace_colors ['#cc99cc', '#d9e043', '#34d8a2']
  replace_colors: function(color_list) {
    this.colors = color_list || [];
  },
 
  // You can set a theme manually. Assign a hash to this method before you
  // send your data.
  //
  // graph.set_theme({
  // colors: ['orange', 'purple', 'green', 'white', 'red'],
  // marker_color: 'blue',
  // background_colors: ['black', 'grey']
  // })
  //
  // background_image: 'squirrel.png' is also possible.
  //
  // (Or hopefully something better looking than that.)
  //
  set_theme: function(options) {
    this._reset_themes();
    
    this._theme_options = {
      colors: ['black', 'white'],
      additional_line_colors: [],
      marker_color: 'white',
      font_color: 'black',
      background_colors: null,
      background_image: null
    };
    for (var key in options) this._theme_options[key] = options[key];
 
    this.colors = this._theme_options.colors;
    this.marker_color = this._theme_options.marker_color;
    this.font_color = this._theme_options.font_color || this.marker_color;
    this._additional_line_colors = this._theme_options.additional_line_colors;
    
    this._render_background();
  },
 
  // A color scheme similar to the popular presentation software.
  theme_keynote: function() {
    // Colors
    this._blue = '#6886B4';
    this._yellow = '#FDD84E';
    this._green = '#72AE6E';
    this._red = '#D1695E';
    this._purple = '#8A6EAF';
    this._orange = '#EFAA43';
    this._white = 'white';
    this.colors = [this._yellow, this._blue, this._green, this._red, this._purple, this._orange, this._white];
 
    this.set_theme({
      colors: this.colors,
      marker_color: 'white',
      font_color: 'white',
      background_colors: ['black', '#4a465a']
    });
  },
 
  // A color scheme plucked from the colors on the popular usability blog.
  theme_37signals: function() {
    // Colors
    this._green = '#339933';
    this._purple = '#cc99cc';
    this._blue = '#336699';
    this._yellow = '#FFF804';
    this._red = '#ff0000';
    this._orange = '#cf5910';
    this._black = 'black';
    this.colors = [this._yellow, this._blue, this._green, this._red, this._purple, this._orange, this._black];
 
    this.set_theme({
      colors: this.colors,
      marker_color: 'black',
      font_color: 'black',
      background_colors: ['#d1edf5', 'white']
    });
  },
  
  theme_mine: function() {
    // Colors    
    this._green = '#339933';
    this._green2 = '#17AE23';
    this._navy = '#000080;';
    this._blue = '#5555FF';
    this._yellow = '#FFF804';
    this._red = '#ff0000';
    this._orange = '#cf5910';
    this._black = 'black';
    this._maroon = '#AC0000';
    this.colors = [this._yellow, this._blue, this._green, this._green2, this._maroon, this._red, this._navy, this._orange, this._black, ];
 
    this.set_theme({
      colors: this.colors,
      marker_color: '#666666',
      font_color: '#666666',
      background_colors: ['#E5EEFC', 'white']
    });
  },
 
  // A color scheme from the colors used on the 2005 Rails keynote
  // presentation at RubyConf.
  theme_rails_keynote: function() {
    // Colors
    this._green = '#00ff00';
    this._grey = '#333333';
    this._orange = '#ff5d00';
    this._red = '#f61100';
    this._white = 'white';
    this._light_grey = '#999999';
    this._black = 'black';
    this.colors = [this._green, this._grey, this._orange, this._red, this._white, this._light_grey, this._black];
    
    this.set_theme({
      colors: this.colors,
      marker_color: 'white',
      font_color: 'white',
      background_colors: ['#0083a3', '#0083a3']
    });
  },
 
  // A color scheme similar to that used on the popular podcast site.
  theme_odeo: function() {
    // Colors
    this._grey = '#202020';
    this._white = 'white';
    this._dark_pink = '#a21764';
    this._green = '#8ab438';
    this._light_grey = '#999999';
    this._dark_blue = '#3a5b87';
    this._black = 'black';
    this.colors = [this._grey, this._white, this._dark_blue, this._dark_pink, this._green, this._light_grey, this._black];
    
    this.set_theme({
      colors: this.colors,
      marker_color: 'white',
      font_color: 'white',
      background_colors: ['#ff47a4', '#ff1f81']
    });
  },
 
  // A pastel theme
  theme_pastel: function() {
    // Colors
    this.colors = [
        '#a9dada', // blue
        '#aedaa9', // green
        '#daaea9', // peach
        '#dadaa9', // yellow
        '#a9a9da', // dk purple
        '#daaeda', // purple
        '#dadada' // grey
      ];
    
    this.set_theme({
      colors: this.colors,
      marker_color: '#aea9a9', // Grey
      font_color: 'black',
      background_colors: 'white'
    });
  },
 
  // A greyscale theme
  theme_greyscale: function() {
    // Colors
    this.colors = [
        '#282828', //
        '#383838', //
        '#686868', //
        '#989898', //
        '#c8c8c8', //
        '#e8e8e8' //
      ];
    
    this.set_theme({
      colors: this.colors,
      marker_color: '#aea9a9', // Grey
      font_color: 'black',
      background_colors: 'white'
    });
  },
  
  // Parameters are an array where the first element is the name of the dataset
  // and the value is an array of values to plot.
  //
  // Can be called multiple times with different datasets for a multi-valued
  // graph.
  //
  // If the color argument is nil, the next color from the default theme will
  // be used.
  //
  // NOTE: If you want to use a preset theme, you must set it before calling
  // data().
  //
  // Example:
  // data("Bart S.", [95, 45, 78, 89, 88, 76], '#ffcc00')
  data: function(name, data_points, min, max,color,data_hover_points,gtype) {
    data_points = (data_points === undefined) ? [] : data_points;
	data_hover_points = (data_hover_points === undefined) ? [] : data_hover_points;
    color = color || null;
    gtype = gtype|| "line";
    data_points = JGraph.array(data_points); // make sure it's an array
    data_hover_points =  JGraph.array(data_hover_points); // make sure it's an array
    this._data.push([name, data_points, (color || this._increment_color()),min, max,data_hover_points,gtype]);
	
    // Set column count if this is larger than previous counts
    this._column_count = (data_points.length > this._column_count) ? data_points.length : this._column_count;
 
    // Pre-normalize
    JGraph.each(data_points, function(data_point, index) {
      if (data_point === undefined) return;
      
      // Setup max/min so spread starts at the low end of the data points
      if (max === null && min === null)
        max = min = data_point;
      
      // TODO Doesn't work with stacked bar graphs
      // Original: @maximum_value = _larger_than_max?(data_point, index) ? max(data_point, index) : @maximum_value
      max = data_point > max ? data_point : max;
      if (max >= 0) this._has_data = true;
      
      min = data_point < min  ? data_point : min;
      if (min < 0) this._has_data = true;
    }, this);
  },
  
  // Overridden by subclasses to do the actual plotting of the graph.
  //
  // Subclasses should start by calling super() for this method.
  draw: function() {
    if (this.stacked) this._make_stacked();
    this._setup_drawing();
    
    this._debug(function() {
      // Outer margin
      this._d.rectangle(this.left_margin, this.top_margin,
                                  this._raw_columns - this.right_margin, this._raw_rows - this.bottom_margin,1);
      // Graph area box
      this._d.rectangle(this._graph_left, this._graph_top, this._graph_right, this._graph_bottom,1);
    });
  },
  
  clear: function() {
    this._render_background();
	var par_el = document.getElementById(this.graphid);
	 var hover_els = par_el.getElementsByTagName("SPAN");
	 var initlength = hover_els.length;
	for(var i = 0; i < initlength;i++ )
	{
				par_el.removeChild(par_el.getElementsByTagName("SPAN")[0]);
	}
  },
  
  // Calculates size of drawable area and draws the decorations.
  //
  // * line markers
  // * legend
  // * title
  _setup_drawing: function() {
    // Maybe should be done in one of the following functions for more granularity.
    if (!this._has_data) return this._draw_no_data();
    
    this._normalize();
    this._setup_graph_measurements();
    if (this.sort) this._sort_norm_data();
    
    this._draw_legend();
    this._draw_line_markers();
    this._draw_axis_labels();
    this._draw_title();
  },
  
  // Make copy of data with values scaled between 0-100
  _normalize: function(force) {
    if (this._norm_data === null || force === true) {
      this._norm_data = [];
      if (!this._has_data) return;
      
     
      
 
  JGraph.each(this._data, function(data_row) {
        var norm_data_points = [];  // contains the actual data
		var norm_data_leftright = []; // contains the data's right offset
        JGraph.each(data_row[this.klass.DATA_VALUES_INDEX], function(data_point) {
			
			 this._calculate_spread(data_row[4],data_row[3]);
          if (data_point === null || data_point === undefined) {
		  	norm_data_points.push(null);
		  	norm_data_leftright.push(null);
		  }
		  else {
		  	norm_data_points.push((data_point.split("|")[0] - data_row[3]) / this._spread);
			norm_data_leftright.push(data_point.split("|")[1] +"|"+data_point.split("|")[2]+"|"+data_point.split("|")[3]);
		  }
        }, this);
        this._norm_data.push([data_row[this.klass.DATA_LABEL_INDEX], norm_data_points, data_row[this.klass.DATA_COLOR_INDEX],data_row[3],data_row[4],norm_data_leftright,data_row[5],data_row[6]]);
      }, this);
    }
	 this._calculate_spread(this.maximum_value,this.minimum_value);
  },
  _calculate_spread: function(max,min) {
    this._spread = max - min;
    this._spread = this._spread > 0 ? this._spread : 1;
  },
  
  // Calculates size of drawable area, general font dimensions, etc.
  _setup_graph_measurements: function() {
    this._marker_caps_height = this.hide_line_markers ? 0 :
                                this._calculate_caps_height(this.marker_font_size);
    this._title_caps_height = this.hide_title ? 0 :
                                this._calculate_caps_height(this.title_font_size);
    this._legend_caps_height = this.hide_legend ? 0 :
                                this._calculate_caps_height(this.legend_font_size);
    
    var longest_label,
        longest_left_label_width,
        line_number_width,
        last_label,
        extra_room_for_long_label,
        x_axis_label_height,
        key;
    
    if (this.hide_line_markers) {
      this._graph_left = this.left_margin;
      this._graph_right_margin = this.right_margin;
      this._graph_bottom_margin = this.bottom_margin;
    } else {
      longest_left_label_width = 0;
      if (this.has_left_labels) {
        longest_label = '';
        for (key in this.labels) {
          longest_label = longest_label.length > this.labels[key].length
              ? longest_label
              : this.labels[key];
        }
        longest_left_label_width = this._calculate_width(this.marker_font_size, longest_label) * 1.25;
      } else {
        longest_left_label_width = this._calculate_width(this.marker_font_size, this._label(this.maximum_value));
      }
      
      // Shift graph if left line numbers are hidden
      line_number_width = this.hide_line_numbers && !this.has_left_labels
                            ? 0
                            : longest_left_label_width + this.klass.LABEL_MARGIN * 2;
      
      this._graph_left = this.left_margin +
                         line_number_width +
                         (this.y_axis_label == null ? 0.0 : this._marker_caps_height + this.klass.LABEL_MARGIN * 2);
      // Make space for half the width of the rightmost column label.
      // Might be greater than the number of columns if between-style bar markers are used.
      last_label = -Infinity;
      for (key in this.labels)
        last_label = last_label > Number(key) ? last_label : Number(key);
      last_label = Math.round(last_label);
      extra_room_for_long_label = (last_label >= (this._column_count-1) && this.center_labels_over_point)
          ? this._calculate_width(this.marker_font_size, this.labels[last_label]) / 2
          : 0.0;
      this._graph_right_margin = 30;//this.right_margin + extra_room_for_long_label;

      this._graph_bottom_margin = this.bottom_margin +
                                  this._marker_caps_height + this.klass.LABEL_MARGIN;
    }
    
    this._graph_right = this._raw_columns - this._graph_right_margin;

    this._graph_width = this._raw_columns - this._graph_left - this._graph_right_margin;
    
    // When hide_title, leave a TITLE_MARGIN space for aesthetics.
    // Same with hide_legend
    this._graph_top = this.top_margin +
                        (this.hide_title ? this.klass.TITLE_MARGIN : this._title_caps_height + this.klass.TITLE_MARGIN * 2) +
                        (this.hide_legend ? this.klass.LEGEND_MARGIN : this._legend_caps_height + this.klass.LEGEND_MARGIN * 2);
    
    x_axis_label_height = (this.x_axis_label === null) ? 0.0 :
                            this._marker_caps_height + this.klass.LABEL_MARGIN;
    this._graph_bottom = this._raw_rows - this._graph_bottom_margin - x_axis_label_height;
    this._graph_height = this._graph_bottom - this._graph_top;
  },
  
  // Draw the optional labels for the x axis and y axis.
  _draw_axis_labels: function() {
    if (this.x_axis_label) {
      // X Axis
      // Centered vertically and horizontally by setting the
      // height to 1.0 and the width to the width of the graph.
      var x_axis_label_y_coordinate = this._graph_bottom + this.klass.LABEL_MARGIN * 2 + this._marker_caps_height;
      
      // TODO Center between graph area
      this._d.fill = this.font_color;
      if (this.font) this._d.font = this.font;
      this._d.stroke = 'transparent';
      this._d.pointsize = this._scale_fontsize(this.marker_font_size);
      this._d.gravity = 'north';
      this._d.annotate_scaled(
                    this._raw_columns, 1.0,
                    0.0, x_axis_label_y_coordinate,
                    this.x_axis_label, this._scale);
      this._debug(function() {
        this._d.line(0.0, x_axis_label_y_coordinate, this._raw_columns, x_axis_label_y_coordinate,1);
      });
    }
     if (this.y_axis_label) {
      // X Axis
      // Centered vertically and horizontally by setting the
      // height to 1.0 and the width to the width of the graph.
      var y_axis_label_x_coordinate = this._graph_left  - this.klass.LABEL_MARGIN * 5.5;
 		var y_axis_label_y_coordinate = this._graph_top  + this.klass.LABEL_MARGIN * 4;
      // TODO Center between graph area
      this._d.fill = this.font_color;
      if (this.font) this._d.font = this.font;
      this._d.stroke = 'transparent';
      this._d.pointsize = this._scale_fontsize(this.marker_font_size);
      this._d.gravity = 'west';
      this._d.annotate_vert_scaled(   this._raw_columns,  1.0,  	y_axis_label_x_coordinate,y_axis_label_y_coordinate ,
                    this.y_axis_label, this._scale,1);
     
    }
	
	  if (this.y2_axis_label) {
      // X Axis
      // Centered vertically and horizontally by setting the
      // height to 1.0 and the width to the width of the graph.
      var y_axis_label_x_coordinate = this._graph_right  + this.klass.LABEL_MARGIN*2.0 ;
 var y_axis_label_y_coordinate = this._graph_top  + this.klass.LABEL_MARGIN * 4;
      // TODO Center between graph area
      this._d.fill = this.font_color;
      if (this.font) this._d.font = this.font;
      this._d.stroke = 'transparent';
      this._d.pointsize = this._scale_fontsize(this.marker_font_size);
      this._d.gravity = 'west';
      this._d.annotate_vert_scaled(
                   this._raw_columns,  1.0,
				   	y_axis_label_x_coordinate,y_axis_label_y_coordinate ,
                    this.y2_axis_label, this._scale,-1);
     
    }
	
  },
  valid_range: function()
  {
  	return(this.range_low != null && this.range_high != null &&this.range_high >=this.range_low && this.range_low >= this.minimum_value && this.range_high <= this.maximum_value);
  },
  // Draws horizontal background lines and labels
  _draw_line_markers: function() {
    if (this.hide_line_markers) return;
    
    if (this.y_axis_increment === null) {
      // Try to use a number of horizontal lines that will come out even.
      //
      // TODO Do the same for larger numbers...100, 75, 50, 25

      if (this.marker_count === null) {
        JGraph.each([3,4,5,6,7], function(lines) {
          if (!this.marker_count && this._spread % lines == 0)
            this.marker_count = lines;
        }, this);
        this.marker_count = this.marker_count || 4;
      }
      this._increment = (this._spread > 0) ? this._significant(this._spread / this.marker_count) : 1;
    } else {
      // TODO Make this work for negative values
      this.maximum_value = Math.max(Math.ceil(this.maximum_value), this.y_axis_increment);
      this.minimum_value = Math.floor(this.minimum_value);
	  if (this.y2_axis_type == true) {
	  	this.y2_maximum_value = Math.max(Math.ceil(this.y2_maximum_value), this.y_axis_increment);
	  	this.y2_minimum_value = Math.floor(this.y2_minimum_value);
	  }
      this._calculate_spread();
      this._normalize(true);
      
      this.marker_count = Math.round(this._spread / this.y_axis_increment);
      this._increment = this.y_axis_increment;
    }
	if (this.valid_range()) // if valid range values
	{
		y = this._graph_top + this._graph_height - Math.round((this._graph_height / (this.maximum_value - this.minimum_value))*( this.range_high  - Math.round((this.range_high - this.range_low)/2) ));
		this._d.stroke_width = Math.ceil((this._graph_height / this._spread)*(this.range_high - this.range_low));
		this._d.stroke = this.range_color;
		if(this.y_axis_label != null)
      this._d.line(this._graph_left - this.klass.LABEL_MARGIN*3, y, this._graph_right, y,this.range_opacity);
	  else
	   this._d.line(this._graph_left, y, this._graph_right, y,this.range_opacity);
	}
    this._increment_scaled = this._graph_height / (this._spread / this._increment);
    
    // Draw horizontal line markers and annotate with numbers
    var index, n, y, marker_label;
    for (index = 0, n = this.marker_count; index <= n; index++) {
      y = this._graph_top + this._graph_height - index * this._increment_scaled;
      
      this._d.stroke = this.marker_color;
      this._d.stroke_width = 1;
	  if(this.y_axis_label != null)
      this._d.line(this._graph_left - this.klass.LABEL_MARGIN*3, y, this._graph_right, y,1);
	  else
	   this._d.line(this._graph_left, y, this._graph_right, y,1);
      
      marker_label = index * this._increment + this.minimum_value;
      
      if (!this.hide_line_numbers) {
	  	this._d.fill = this.font_color;
	  	if (this.font) 
	  		this._d.font = this.font;
	  	this._d.font_weight = 'normal';
	  	this._d.stroke = 'transparent';
	  	this._d.pointsize = this._scale_fontsize(this.marker_font_size);
	  	this._d.gravity = 'east';
	  	
	  	// Vertically center with 1.0 for the height
				if(this.y_axis_label != null)
				this._d.annotate_scaled(this._graph_left - this.klass.LABEL_MARGIN*3.4, 1.0, 0.0, y, this._label(marker_label), this._scale);
				else
				this._d.annotate_scaled(this._graph_left - this.klass.LABEL_MARGIN, 1.0, 0.0, y, this._label(marker_label), this._scale);
				if (this.y2_axis_type == true) // if a right y axis type is present
				{
					marker_label = index * this.y2_axis_increment + this.y2_minimum_value;
					if(this.y2_axis_label != null)
					this._d.annotate_scaled(this._graph_right + this.klass.LABEL_MARGIN, 1.0, 0.0, y, this._label(marker_label), this._scale);
					else
					this._d.annotate_scaled(this._graph_right + this.klass.LABEL_MARGIN * 2, 1.0, 0.0, y, this._label(marker_label), this._scale);
				}
			}
    }
  },
  
  _center: function(size) {
    return (this._raw_columns - size) / 2;
  },
  
  // Draws a legend with the names of the datasets matched to the colors used
  // to draw them.
  _draw_legend: function() {
    if (this.hide_legend) return;
    
    this._legend_labels = [];
    for (var i = 0, n = this._data.length; i < n; i++)
      this._legend_labels.push(this._data[i][this.klass.DATA_LABEL_INDEX]);
    if(this.valid_range())
	this._legend_labels.push(this.range_name);
    var legend_square_width = this.legend_box_size; // small square with color of this item
    
    // May fix legend drawing problem at small sizes
    if (this.font) this._d.font = this.font;
    this._d.pointsize = this.legend_font_size;
    
    var label_widths = [[]]; // Used to calculate line wrap
    JGraph.each(this._legend_labels, function(label) {
      var last = label_widths.length - 1;
      var metrics = this._d.get_type_metrics(label);
      var label_width = metrics.width + legend_square_width * 2.7;
      label_widths[last].push(label_width);
      
      if (JGraph.sum(label_widths[last]) > (this._raw_columns * 0.9))
        label_widths.push([label_widths[last].pop()]);
    }, this);
    
    var current_x_offset = this._center(JGraph.sum(label_widths[0]));
    var current_y_offset = this.hide_title ?
                            this.top_margin + this.klass.LEGEND_MARGIN :
                            this.top_margin +
                            this.klass.TITLE_MARGIN + this._title_caps_height +
                            this.klass.LEGEND_MARGIN;
    
    this._debug(function() {
      this._d.stroke_width = 1;
      this._d.line(0, current_y_offset, this._raw_columns, current_y_offset,1);
    });
    
    JGraph.each(this._legend_labels, function(legend_label, index) {
      
      // Draw label
      this._d.fill = this.font_color;
      if (this.font) this._d.font = this.font;
      this._d.pointsize = this._scale_fontsize(this.legend_font_size);
      this._d.stroke = 'transparent';
      this._d.font_weight = 'normal';
      this._d.gravity = 'west';
      this._d.annotate_scaled(this._raw_columns, 1.0,
                              current_x_offset + (legend_square_width * 1.7), current_y_offset,
                              legend_label, this._scale);
      // Now draw box with color of this dataset
	
	 	if ((index <= this._data.length - 1 && this.range_name != null) || this.range_name == null) {
	 		this._d.stroke = 'transparent';
	 		this._d.fill = this._data[index][this.klass.DATA_COLOR_INDEX];
	 		this._d.rectangle(current_x_offset, current_y_offset - legend_square_width / 2.0, current_x_offset + legend_square_width, current_y_offset + legend_square_width / 2.0,1);
	 		
	 		this._d.pointsize = this.legend_font_size;
	 	}
		else if (index == this._data.length  && this.valid_range())
			{
				this._d.stroke = 'transparent';
				if(this.range_color == null)
	 			this._d.fill = 'black';
				else
				this._d.fill = this.range_color;
	 			this._d.rectangle(current_x_offset, current_y_offset - legend_square_width / 2.0, current_x_offset + legend_square_width, current_y_offset + legend_square_width / 2.0,this.range_opacity);
	 			this._d.pointsize = this.legend_font_size;
			}
      var metrics = this._d.get_type_metrics(legend_label);
      var current_string_offset = metrics.width + (legend_square_width * 2.7),
          line_height;
      
      // Handle wrapping
      label_widths[0].shift();
      if (label_widths[0].length == 0) {
        this._debug(function() {
          this._d.line(0.0, current_y_offset, this._raw_columns, current_y_offset,1);
        });
        
        label_widths.shift();
        if (label_widths.length > 0) current_x_offset = this._center(JGraph.sum(label_widths[0]));
        line_height = Math.max(this._legend_caps_height, legend_square_width) + this.klass.LEGEND_MARGIN;
        if (label_widths.length > 0) {
          // Wrap to next line and shrink available graph dimensions
          current_y_offset += line_height;
          this._graph_top += line_height;
          this._graph_height = this._graph_bottom - this._graph_top;
        }
      } else {
        current_x_offset += current_string_offset;
      }
    }, this);
    this._color_index = 0;
  },
  
  // Draws a title on the graph.
  _draw_title: function() {
    if (this.hide_title || !this.title) return;
    
    this._d.fill = this.font_color;
    if (this.font) this._d.font = this.font;
    this._d.pointsize = this._scale_fontsize(this.title_font_size);
    this._d.font_weight = 'bold';
    this._d.gravity = 'north';
    this._d.annotate_scaled(this._raw_columns, 1.0, 0, this.top_margin, this.title, this._scale);
  },
  
  // Draws column labels below graph, centered over x_offset
  //--
  // TODO Allow WestGravity as an option
  _draw_label: function(x_offset, index) {
    if (this.hide_line_markers) return;
    
    var y_offset;
    
    if (this.labels[index] && !this._labels_seen[index]) {
      y_offset = this._graph_bottom + this.klass.LABEL_MARGIN;
      
      this._d.fill = this.font_color;
      if (this.font) this._d.font = this.font;
      this._d.stroke = 'transparent';
      this._d.font_weight = 'normal';
      this._d.pointsize = this._scale_fontsize(this.marker_font_size);
      this._d.gravity = 'north';
      this._d.annotate_scaled(1.0, 1.0, x_offset, y_offset, this.labels[index], this._scale);
      this._labels_seen[index] = true;
      
      this._debug(function() {
        this._d.stroke_width = 1;
        this._d.line(0.0, y_offset, this._raw_columns, y_offset,1);
      });
    }
  },
  
  // Shows an error message because you have no data.
  _draw_no_data: function() {
    this._d.fill = this.font_color;
    if (this.font) this._d.font = this.font;
    this._d.stroke = 'transparent';
    this._d.font_weight = 'normal';
    this._d.pointsize = this._scale_fontsize(8);
    this._d.gravity = 'center';
    this._d.annotate_scaled(this._raw_columns, this._raw_rows/2, 0, 10, this.no_data_message, this._scale);
  },
  
  // Finds the best background to render based on the provided theme options.
  _render_background: function() {
    var colors = this._theme_options.background_colors;
    switch (true) {
      case colors instanceof Array:
        this._render_gradiated_background.apply(this, colors);
        break;
      case typeof colors == 'string':
        this._render_solid_background(colors);
        break;
      default:
        this._render_image_background(this._theme_options.background_image);
        break;
    }
  },
  
  // Make a new image at the current size with a solid +color+.
  _render_solid_background: function(color) {
    this._d.render_solid_background(this._columns, this._rows, color);
  },
 
  // Use with a theme definition method to draw a gradiated background.
  _render_gradiated_background: function(top_color, bottom_color) {
    this._d.render_gradiated_background(this._columns, this._rows, top_color, bottom_color);
  },
 
  // Use with a theme to use an image (800x600 original) background.
  _render_image_background: function(image_path) {
    // TODO
  },
  
  // Resets everything to defaults (except data).
  _reset_themes: function() {
    this._color_index = 0;
    this._labels_seen = {};
    this._theme_options = {};
    this._d.scale(this._scale, this._scale);
  },
  
  _scale_value: function(value) {
    return this._scale * value;
  },
  
  // Return a comparable fontsize for the current graph.
  _scale_fontsize: function(value) {
    var new_fontsize = value * this._scale;
    return new_fontsize;
  },
  
  _clip_value_if_greater_than: function(value, max_value) {
    return (value > max_value) ? max_value : value;
  },
 
  // Overridden by subclasses such as stacked bar.
  _larger_than_max: function(data_point, index) {
    return data_point > this.maximum_value;
  },
 
  _less_than_min: function(data_point, index) {
    return data_point < this.minimum_value;
  },
 
  // Overridden by subclasses that need it.
  _max: function(data_point, index) {
    return data_point;
  },
 
  // Overridden by subclasses that need it.
  _min: function(data_point, index) {
    return data_point;
  },
  
  _significant: function(inc) {
    if (inc == 0) return 1.0;
    var factor = 1.0;
    while (inc < 10) {
      inc *= 10;
      factor /= 10;
    }
    
    while (inc > 100) {
      inc /= 10;
      factor *= 10;
    }
    
    return Math.floor(inc) * factor;
  },
  
  // Sort with largest overall summed value at front of array so it shows up
  // correctly in the drawn graph.
  _sort_norm_data: function() {
    var sums = this._sums, index = this.klass.DATA_VALUES_INDEX;
    this._norm_data.sort(function(a,b) {
      return sums(b[index]) - sums(a[index]);
    });
  },
  
  _sums: function(data_set) {
    var total_sum = 0;
    JGraph.each(data_set, function(num) { total_sum += num; });
    return total_sum;
  },
  
  _make_stacked: function() {
    var stacked_values = [], i = this._column_count;
    while (i--) stacked_values[i] = 0;
    JGraph.each(this._data, function(value_set) {
      JGraph.each(value_set[this.klass.DATA_VALUES_INDEX], function(value, index) {
        stacked_values[index] += value;
      }, this);
      value_set[this.klass.DATA_VALUES_INDEX] = JGraph.array(stacked_values);
    }, this);
  },
  
  // Takes a block and draws it if DEBUG is true.
  //
  // Example:
  // debug { @d.rectangle x1, y1, x2, y2 }
  _debug: function(block) {
    if (this.klass.DEBUG) {
      this._d.fill = 'transparent';
      this._d.stroke = 'turquoise';
      block.call(this);
    }
  },
  
  _increment_color: function() {
    if (this._color_index == 0) {
      this._color_index += 1;
      return this.colors[0];
    } else {
      if (this._color_index < this.colors.length) {
        this._color_index += 1;
        return this.colors[this._color_index - 1];
      } else {
        // Start over
        this._color_index = 0;
        return this.colors[this.colors.length - 1];
      }
    }
  },
  
  // Return a formatted string representing a number value that should be
  // printed as a label.
  _label: function(value) {
    if (this._spread % this.marker_count == 0 || this.y_axis_increment !== null) {
      return String(Math.round(value));
    }
    
    if (this._spread > 10)
      return String(Math.floor(value));
    else if (this._spread >= 3)
      return String(Math.floor(value * 100) / 100);
    else
      return String(value);
  },
  
  // Returns the height of the capital letter 'X' for the current font and
  // size.
  //
  // Not scaled since it deals with dimensions that the regular scaling will
  // handle.
  _calculate_caps_height: function(font_size) {
    return this._d.caps_height(font_size);
  },
  
  // Returns the width of a string at this pointsize.
  //
  // Not scaled since it deals with dimensions that the regular
  // scaling will handle.
  _calculate_width: function(font_size, text) {
    return this._d.text_width(font_size, text);
  }
}
);JGraph.Renderer = new JS.Class({
  extend: {
    WRAPPER_CLASS: 'JGraph-wrapper',
    TEXT_CLASS: 'JGraph-text'
  },
 
  font: 'Arial, Helvetica, Verdana, sans-serif',
  gravity: 'north',
  
  initialize: function(canvasId) {
    this._canvas = document.getElementById(canvasId);
    this._ctx = this._canvas.getContext('2d');
  },
  
  scale: function(sx, sy) {
    this._sx = sx;
    this._sy = sy || sx;
  },
  
  caps_height: function(font_size) {
    var X = this._sized_text(font_size, 'X'),
        height = this._element_size(X).height;
    this._remove_text_node(X);
    return height;
  },
  
  text_width: function(font_size, text) {
    var element = this._sized_text(font_size, text);
    var width = this._element_size(element).width;
    this._remove_text_node(element);
    return width;
  },
  
  get_type_metrics: function(text) {
    var node = this._sized_text(this.pointsize, text);
    document.body.appendChild(node);
    var size = this._element_size(node);
    this._remove_text_node(node);
    return size;
  },
  
  clear: function(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
    this._ctx.clearRect(0, 0, width, height);
    var wrapper = this._text_container(), children = wrapper.childNodes, i = children.length;
    wrapper.style.width = width + 'px';
    wrapper.style.height = height + 'px';
    while (i--) {
      if (children[i] && children[i].className == this.klass.TEXT_CLASS)
        this._remove_text_node(children[i]);
    }
  },
  
  push: function() {
    this._ctx.save();
  },
  
  pop: function() {
    this._ctx.restore();
  },
  
  render_gradiated_background: function(width, height, top_color, bottom_color) {
    this.clear(width, height);
    var gradient = this._ctx.createLinearGradient(0,0, 0,height);
    gradient.addColorStop(0, top_color);
    gradient.addColorStop(1, bottom_color);
    this._ctx.fillStyle = gradient;
    this._ctx.fillRect(0, 0, width, height);
  },
  
  render_solid_background: function(width, height, color) {
    this.clear(width, height);
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, width, height);
  },
  
    annotate_vert_scaled: function(width, height, x, y, text, scale,dir) {
    var scaled_width = (width * scale) >= 1 ? (width * scale) : 1;
    var scaled_height = (height * scale) >= 1 ? (height * scale) : 1;
    var text = this._sized_text(this.pointsize, text);
    text.style.color = this.fill;
    text.style.fontWeight = this.font_weight;
    text.style.textAlign = 'center';
	text.style.writingMode = 'tb-rl';
	if(dir> 0)
		{text.style.filter= 'fliph flipv';}
    text.style.left = (this._sx * x + this._left_adjustment(text, scaled_width)) + 'px';
    text.style.top = (this._sy * y + this._top_adjustment(text, scaled_height)) + 'px';
  },
  
  annotate_scaled: function(width, height, x, y, text, scale) {
    var scaled_width = (width * scale) >= 1 ? (width * scale) : 1;
    var scaled_height = (height * scale) >= 1 ? (height * scale) : 1;
    var text = this._sized_text(this.pointsize, text);
    text.style.color = this.fill;
    text.style.fontWeight = this.font_weight;
    text.style.textAlign = 'center';
    text.style.left = (this._sx * x + this._left_adjustment(text, scaled_width)) + 'px';
    text.style.top = (this._sy * y + this._top_adjustment(text, scaled_height)) + 'px';
  },
  
  circle: function(origin_x, origin_y, perim_x, perim_y, arc_start, arc_end) {
    var radius = Math.sqrt(Math.pow(perim_x - origin_x, 2) + Math.pow(perim_y - origin_y, 2));
    this._ctx.fillStyle = this.fill;
    this._ctx.beginPath();
    var alpha = (arc_start || 0) * Math.PI/180;
    var beta = (arc_end || 360) * Math.PI/180;
    if (arc_start !== undefined && arc_end !== undefined) {
      this._ctx.moveTo(this._sx * (origin_x + radius * Math.cos(beta)), this._sy * (origin_y + radius * Math.sin(beta)));
      this._ctx.lineTo(this._sx * origin_x, this._sy * origin_y);
      this._ctx.lineTo(this._sx * (origin_x + radius * Math.cos(alpha)), this._sy * (origin_y + radius * Math.sin(alpha)));
    }
    this._ctx.arc(this._sx * origin_x, this._sy * origin_y, this._sx * radius, alpha, beta, false);
    this._ctx.fill();
  },
  
  		hoverpopup: function(left,top,width,hovertxt,tooltipid,graphid)
		{
			
			dat_element = document.createElement("SPAN")
			dat_element.name = "hoverpopup"
			dat_element.style.width = "7px";
			dat_element.style.height = "7px";
			dat_element.style.position = "absolute";
			dat_element.style.zIndex = 500;
			dat_element.style.left =  (this._sx*(left-width))+"px";
			dat_element.style.top =  (this._sx*(top-width))+"px"
			dat_element.value =  hovertxt;
			//dat_element.style.background = "rgb(0,0,0)";
			dat_element.tooltip =  document.getElementById(tooltipid);
			dat_element.onmouseover = function() 
									{
									 event.srcElement.tooltip.innerHTML =  event.srcElement.value;
									 if(event.clientX  >= (document.documentElement.scrollWidth/2))
									  event.srcElement.tooltip.style.left = (event.clientX + document.documentElement.scrollLeft)- event.srcElement.tooltip.offsetWidth;
									 else
									 	event.srcElement.tooltip.style.left = event.clientX + document.documentElement.scrollLeft;
									if(event.clientY  >= (document.documentElement.scrollHeight/2))
									 	 event.srcElement.tooltip.style.top =  (event.clientY + document.documentElement.scrollTop)- event.srcElement.tooltip.offsetHeight;
									 else
									 	event.srcElement.tooltip.style.top =  event.clientY + document.documentElement.scrollTop+5;
									 event.srcElement.tooltip.style.visibility = "visible";
									};
			dat_element.onmouseout = function() 
									{
										  event.srcElement.tooltip.style.visibility = "hidden";
									};						
			document.getElementById(graphid).appendChild(dat_element);
		},
  
  line: function(sx, sy, ex, ey,opacity) {
    this._ctx.strokeStyle = this.stroke;
    this._ctx.lineWidth = this.stroke_width;
    this._ctx.beginPath();
	this._ctx.e = opacity;
    this._ctx.moveTo(this._sx * sx, this._sy * sy);
    this._ctx.lineTo(this._sx * ex, this._sy * ey);
    this._ctx.stroke();
  },
  polyline: function(points) {
    this._ctx.fillStyle = this.fill;
    this._ctx.globalAlpha = this.fill_opacity || 1;
    try { this._ctx.strokeStyle = this.stroke; } catch (e) {}
    var x = points.shift(), y = points.shift();
    this._ctx.beginPath();
    this._ctx.moveTo(this._sx * x, this._sy * y);
    while (points.length > 0) {
      x = points.shift(); y = points.shift();
      this._ctx.lineTo(this._sx * x, this._sy * y);
    }
    this._ctx.fill();
  },
  
  rectangle: function(ax, ay, bx, by,opacity) {
    var temp;
	this._ctx.e = opacity;
    if (ax > bx) { temp = ax; ax = bx; bx = temp; }
    if (ay > by) { temp = ay; ay = by; by = temp; }
    try {
      this._ctx.fillStyle = this.fill;
      this._ctx.fillRect(this._sx * ax, this._sy * ay, this._sx * (bx-ax), this._sy * (by-ay));
	  
    } catch (e) {}
    try {
      this._ctx.strokeStyle = this.stroke;
      if (this.stroke != 'transparent')
        this._ctx.strokeRect(this._sx * ax, this._sy * ay, this._sx * (bx-ax), this._sy * (by-ay));
    } catch (e) {}
  },
  
  _left_adjustment: function(node, width) {
    var w = this._element_size(node).width;
    switch (this.gravity) {
      case 'west': return 0;
      case 'east': return width - w;
      case 'north': case 'south': case 'center':
        return (width - w) / 2;
    }
  },
  
  _top_adjustment: function(node, height) {
    var h = this._element_size(node).height;
    switch (this.gravity) {
      case 'north': return 0;
      case 'south': return height - h;
      case 'west': case 'east': case 'center':
        return (height - h) / 2;
    }
  },
  
  _text_container: function() {
    var wrapper = this._canvas.parentNode;
    if (wrapper.className == this.klass.WRAPPER_CLASS) return wrapper;
    wrapper = document.createElement('div');
    wrapper.className = this.klass.WRAPPER_CLASS;
    
    wrapper.style.position = 'relative';
    wrapper.style.border = 'none';
    wrapper.style.padding = '0 0 0 0';
    
    this._canvas.parentNode.insertBefore(wrapper, this._canvas);
    wrapper.appendChild(this._canvas);
    return wrapper;
  },
  
  _sized_text: function(size, content) {
    var text = this._text_node(content);
    text.style.fontFamily = this.font;
    text.style.fontSize = (typeof size == 'number') ? size + 'px' : size;
    return text;
  },
  
  _text_node: function(content) {
    var div = document.createElement('div');
    div.className = this.klass.TEXT_CLASS;
    div.style.position = 'absolute';
    div.appendChild(document.createTextNode(content));
    this._text_container().appendChild(div);
    return div;
  },
  
  _remove_text_node: function(node) {
    node.parentNode.removeChild(node);
  },
  
  _element_size: function(element) {
    var display = element.style.display;
    return (display && display != 'none')
        ? {width: element.offsetWidth, height: element.offsetHeight}
        : {width: element.clientWidth, height: element.clientHeight};
  }
});
 JGraph.Line = new JS.Class(JGraph.Base, {
  // Draw a dashed line at the given value
  baseline_value: null,
  
  // Color of the baseline
  baseline_color: null,
  
  // Hide parts of the graph to fit more datapoints, or for a different appearance.
  hide_dots: null,
  hide_lines: null,
 
  // Call with target pixel width of graph (800, 400, 300), and/or 'false' to omit lines (points only).
  //
  // g = new JGraph.Line('canvasId', 400) // 400px wide with lines
  //
  // g = new JGraph.Line('canvasId', 400, false) // 400px wide, no lines (for backwards compatibility)
  //
  // g = new JGraph.Line('canvasId', false) // Defaults to 800px wide, no lines (for backwards compatibility)
  //
  // The preferred way is to call hide_dots or hide_lines instead.
  initialize: function(renderer) {
    if (arguments.length > 3) throw 'Wrong number of arguments';
    if (arguments.length == 1 || (typeof arguments[1] != 'number' && typeof arguments[1] != 'string'))
      this.callSuper(renderer, null);
    else
      this.callSuper();
    
    this.hide_dots = this.hide_lines = false;
    this.baseline_color = 'red';
    this.baseline_value = null;
  },
  
  draw: function() {
    this.callSuper();
    
    if (!this._has_data) return;
	var grid_increment =  Math.floor(Math.floor((this._graph_right - this._graph_left + this.klass.LABEL_MARGIN * 3 ) / (this.intervals-1)));

	for(var i = 0; i<= this.intervals;i++)
	{
		
		this._d.stroke = "black";
		this._d.fill ="black";
		this._d.stroke_width = 1.0;
		if(i > 0 && i < this.intervals)
		this._d.line((i*Math.floor((this._graph_right - this._graph_left + this.klass.LABEL_MARGIN * 3.4 ) / (this.intervals)))+ this.klass.LABEL_MARGIN * 3.0, this._graph_top, (i*Math.floor((this._graph_right - this._graph_left + this.klass.LABEL_MARGIN * 3.4 ) / (this.intervals)))+ this.klass.LABEL_MARGIN * 3.0, this._graph_bottom,1);
		this._draw_label((i*Math.floor((this._graph_right - this._graph_left + this.klass.LABEL_MARGIN * 3.4 ) / (this.intervals)))+ this.klass.LABEL_MARGIN * 3.0, i);
	
	}
    
    // Check to see if more than one datapoint was given. NaN can result otherwise.
    this.x_increment = (this._column_count > 1) ? (this._graph_width / (this._column_count - 1)) : this._graph_width;
    
    var level;
    
    if (this._norm_baseline !== undefined) {
      level = this._graph_top + (this._graph_height - this._norm_baseline * this._graph_height);
      this._d.push();
      this._d.stroke = this.baseline_color;
      // TODO, opacity, dashes
      this._d.stroke_width = 3.0;
    //  this._d.line(this._graph_left, level, this._graph_left + this._graph_width, level,1);
	//  this._d.line(this._graph_right, this._graph_top, this._graph_right, this._graph_bottom,1);
      this._d.pop();
    }

	    
	var dataarray = []; //
	var curline ; //
	var cur_cntr = 0; // 
	var tot_cntr = 0; //
	var prev_datax;
    var prev_datay;
	 var curline;
	var   prev_index = 0;
	 var prev_left = 0;
	  var prev_right=0;
	var new_data = false;	
	var vert_draw = false;
	var curhover ;
	var curtype;
		var curdttm = new Date();
		var dttm_length = (this._graph_right - (this._graph_left - this.klass.LABEL_MARGIN * 3))/(this.stop_dttm.getTime()- this.start_dttm.getTime())
//	if (this.y_axis_label != null) {
		this._d.line(this._graph_left - this.klass.LABEL_MARGIN * 3, this._graph_top, this._graph_left - this.klass.LABEL_MARGIN * 3, this._graph_bottom,1);
		this._d.line(this._graph_right , this._graph_top, this._graph_right, this._graph_bottom,1);
//		}
//	else {
//		this._d.line(this._graph_left, this._graph_top, this._graph_left, this._graph_bottom,1);
//	}
		    
		
	  
	
    JGraph.each(this._norm_data, function(data_row) {
      var prev_x = null, prev_y = null;
      
	  curline = data_row[0];
	  curmax = data_row[4];
	  curmin = data_row[3];
	  curtype = data_row[7];
	  cur_cntr = 0; // 
	  prev_index = 0;
	  prev_left = 0;
	  prev_right=0;
      JGraph.each(data_row[this.klass.DATA_VALUES_INDEX], function(data_point, index) {

		curleft = data_row[5][index].split("|")[0];
	    curright = data_row[5][index].split("|")[1];
		curlabel = data_row[5][index].split("|")[2];
		curhover = data_row[6][index];


        	  	  if(prev_left ==  curleft && prev_right ==  curright)
		  {
			dataindex++;
		  }
		  else if(curleft >0)
		  {
		  
		  	prev_left=  curleft;
			prev_right = curright;
			dataindex  = 1;
		  
		  }
	  datacnt  = 0;
	 for(var i = 0; i <= data_row[5].length-1; i++)
	  {
	  	if(curleft != -1 && (data_row[5][i].split("|")[0] == curleft) && (data_row[5][i].split("|")[1] == curright))
		{
			datacnt++;
		}
	  }
		
		var new_x;
		
        if (data_point === undefined) return;
        
       	  if(data_point >= 0)
		{				
			  var date1 = curlabel.split("/");
			  var year1 = date1[2].split(" ");
			  var time1 = year1[1].split(":");			
			  curdttm.setFullYear(year1[0], date1[0] - 1, date1[1]);
			  curdttm.setMinutes(time1[1]);
			  curdttm.setHours(time1[0]);
			 // alert(dttm_length);
			  cur_pos = dttm_length*(curdttm.getTime()-this.start_dttm.getTime());
			 // alert(cur_pos);
			  new_x = cur_pos+ this.klass.LABEL_MARGIN * 3;					
		}
        
        var new_y = this._graph_top + (this._graph_height - data_point * this._graph_height);

			    
		
		
		
		if(data_point > 0)
		dataarray[tot_cntr] = curline+"::"+data_point+"::"+(new_x-5 )+"::"+ new_y +"::"+cur_cntr+"::"+curmin+"::"+curmax  ;//
        else
		dataarray[tot_cntr] = curline+"::"+data_point+"::"+-1000+"::"+ -1000 +"::"+cur_cntr+"::"+curmin+"::"+curmax ;//
		
        // Reset each time to avoid thin-line errors
        this._d.stroke = data_row[this.klass.DATA_COLOR_INDEX];
        this._d.fill = data_row[this.klass.DATA_COLOR_INDEX];
        this._d.stroke_opacity = 1.0;
		
        this._d.stroke_width = this._clip_value_if_greater_than(this._columns / (this._norm_data[0][1].length * 6), 3.0);
        
	
       if (data_row[this.klass.DATA_VALUES_INDEX][index - 1] > 0) {
	   	prev_datax = prev_x;
	   	prev_datay = prev_y;
		prev_line = curline;
		new_data = true;
	   }
	   
        var circle_radius = this._clip_value_if_greater_than(this._columns / (this._norm_data[0][1].length * 2), 2.0);
	   if (curtype == "line") {
	   	if ((!this.hide_lines && prev_x !== null && prev_y !== null) && data_point > 0 && new_data && curline == prev_line) // if the previous data point was defined
					{
						this._d.line(prev_datax, prev_datay, new_x, new_y, 1);
						new_data = false;
					}
        if (!this.hide_dots && data_point > 0) this._d.circle(new_x, new_y, new_x - circle_radius, new_y);
				}
		else{
			
			if(prev_x == null)
			this._d.circle(new_x, new_y, new_x - circle_radius, new_y);
			   	if ((!this.hide_lines && prev_x !== null && prev_y !== null) && data_point > 0 && curline == prev_line) // if the previous data point was defined
					{
						if (prev_datay == new_y) {						
							this._d.line(prev_datax, new_y, new_x, new_y, 1);							
							
						}
						else {
							this._d.line(prev_datax, prev_datay, new_x, prev_datay, 1);
							this._d.circle(new_x, prev_datay, new_x - circle_radius, prev_datay);
						}
						
							 if (!this.hide_dots && data_point > 0) {
							 	this._d.circle(new_x, new_y, new_x - circle_radius, new_y);
							 }
					}
       
		}		
        
    	if(data_point > 0)
			this._d.hoverpopup(new_x,new_y,circle_radius,curhover,this.tooltipid,this.graphid)
        prev_x = new_x;
        prev_y = new_y;
      cur_cntr++;//
	  tot_cntr++;//
	  }, this); vert_draw = true;}, this);
	  dataarray[dataarray.length] =this._graph_bottom + this.klass.LABEL_MARGIN;
	return(dataarray);},
  
  _normalize: function() {
    this.maximum_value = Math.max(this.maximum_value, this.baseline_value);
    this.callSuper();
    if (this.baseline_value !== null) this._norm_baseline = this.baseline_value / this.maximum_value;
  }
})