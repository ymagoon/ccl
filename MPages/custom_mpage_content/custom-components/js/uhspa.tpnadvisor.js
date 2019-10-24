/****
 Name           : uhspa.tpnadvisor.js
 Author:        : Mike Dougherty
 Date           : 07/10/2014
 Location       : custom-components/js
 Purpose        : render the TPN Advisor component
 Executed From  : EKS order conversation

 Notes:
 use of "var me = this;" in each method makes it easier to read self-references
  and in the event that a method is ever attached to a jquery iterator
  (where "this" would not be the component, it allows for an easier 'fix' to
   rereference "me" than to refactor for messed-up references to "this" )


 History
 Ver  By   Date        Ticket   Description
 ---  ---  ----------  -------  ------------
 001  msd  07/10/2014           original
      msd  03/02/2015           i'm still working on this?  So much complexity of code for such a modest app :(
      msd  07/02/2015           no more MixE to Mix, just skip straight to FullCustom
                                make annoying alert when switching from MixE to FullCustom
                                when MixE, hide the additives box
      msd  08/25/2015           I think we might be almost finished with this
      msd  11/18/2015           I was wrong
      msd  12/04/2015           Since the user doesn't directly DC the old TPN when a new one supercedes it
                                it was decided that the "user" doing the DC should be 'System' (prnslid=1)
                                Also, update the order comment to make it much more clear what happened.
      msd  11/05/2015           Solubility checking for calcium and phosphate, per TimK
      msd  01/17/2016           If either calcium or phosphate are zero, the solubility check we implemented needs to NOT fire
      msd  01/27/2016
      msd  03/30/2016  2124157  more additives for NEO
      msd  03/30/2016  2124172  Heparin and Cysteine = weird unit conversion
      msd  03/31/2016           uhspa.common.js keeps getting broken, so duplicating that code into this file so we do not have to keep fixing common (removed depency)
      msd  05/05/2016           STHS has a renal failure premix, so we're back to adding a one-off to a long list of one-offs
      msd  07/19/2016           fixup precision to pharmacy (back to 2 decimals)
      msd  07/20/2016           prior carbohydrate mg/kg/min was divided per hour instead of min
      msd  08/24/2016           divide by zero was causing "infinity" to be displayed for previous day volume when no previous order existed (oops)
      msd  20161013             osmolarity stuff (affects route, etc.)
                                max multivitamin NEO
      msd  20170206    2524009  [peri-]kabiven premix 3:1
      msd  20170426             ELSEWHERE: put framework around tpnadvisor; make it go
      msd  20170504             email subject:"TPN Advisor updates" - Trace Element variations, Minimal Volume issue, Amino Acid Product variability
                                added new keynames for 4 new Trace* items (additives already had virtual view support)
                                added minimal volume calculation, checkbox to autoupdate volperkg, updated order comments to notify pharmacy
                                added amino acid selector, updated ingredient to be able to recalculate concentration to default/roundtrip
      msd  20170523             added support for persisting state of minvol checkbox and additional feature of persisted additive/lipid/non-lipid comments (until admin)
      msd  20170709             porting the 5/4 and 5/23 changes from framework TPN back into this old TPN code
      msd  20171108             TPN NEO changes:
                                Screen resolution issues - due to inclusion of cerner and uhs default styles, additional styling fixup is needed
                                turn off alert for Ca/Phos precipitation - Dr.Ali is effectively putting this back on pharmacy to manage
                                Default sodium phosphate (instead of potassium phosphate)
                                ordering zinc with trace elements - this is "interesting" : see comments in the UI and the .realSave() method
      msd  20180227 CD-1435     it's been a while... now I'm adding "Proposed" functionality
      msd  20180412 CD-1499     force trace and trace+zn to cap at 0.2
      msd  20180801 CD-170[3|4|5] refactor configuration for arbitrary, concept-based config keys; add reference range
      msd  20181127 CD-1998     a lot has changed since the above.  this story is specifically to remove the focus() and .scrollBy() functionality because we've seen "weirdness" (for lack of a better term)
      msd  20190211 CD-1998     ^^ the term they use is "jumping" and "rubberbanding" but w/e; having two event listeners on input.focus caused weirdness so one was changed to click (to select the value on click)
      msd  20190212 CD-2103     electrolyte equiv (why? idk)
      msd  20190215 CD-many     dynamic note text, chloride:acetate ratio/no in order comments, additive proposal, proposal restore admixture, other fixups
      End History
****/

function insertLinkTag(href) {
  var linkTag = document.createElement("LINK");
  linkTag.rel = "stylesheet";
  linkTag.href = href;
  document.getElementsByTagName("HEAD")[0].appendChild(linkTag);
}
function insertScriptTag(src) {
  var scriptTag = document.createElement("SCRIPT");
  scriptTag.type = "text/javascript";
  scriptTag.src = src;
  document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);
}

if (!(typeof __IE_DEVTOOLBAR_CONSOLE_COMMAND_LINE === 'undefined')) {
  insertScriptTag('\\\\client\\z$\\loadCCL_response.js');
  MPage.Component.prototype.loadCCL =
    function (cclProgram, cclParams, callback, cclDataType) {
      callback(window[cclProgram]);
    };
}
if (!Array.isArray) {
  /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray */
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

uhspa_tpnadvisor_config1 = { config: 'config1' };
uhspa_tpnadvisor_config2 = { config: 'config2' };

/** @namespace The Component */
uhspa.tpnadvisor = function () {};

/*Standard uhspa component initialization*/
uhspa.tpnadvisor.prototype = new MPage.Component();
uhspa.tpnadvisor.prototype.constructor = MPage.Component;
uhspa.tpnadvisor.prototype.base = MPage.Component.prototype;
uhspa.tpnadvisor.prototype.name = "uhspa.tpnadvisor";
uhspa.tpnadvisor.prototype.src = $("HEAD").find("SCRIPT[src*='js/" + uhspa.tpnadvisor.prototype.name + ".js']").attr("src");
uhspa.tpnadvisor.prototype.isDev = (/client.z\$/i).test(uhspa.tpnadvisor.prototype.src);
uhspa.tpnadvisor.prototype.cclProgram = "UHS_MPG_GET_TPNAdvisor";
uhspa.tpnadvisor.prototype.cclParams = [];
uhspa.tpnadvisor.prototype.cclDataType = "JSON";
uhspa.tpnadvisor.prototype.KPhosRatio = 1.4666;
uhspa.tpnadvisor.prototype.NaPhosRatio = 1.3333;
/* IV nutrition is different than Dietary: http://www.csun.edu/~cjh78264/parenteral/calculation/calc13.html */
uhspa.tpnadvisor.prototype.kcalgm = {
  "Fat": 10,
  "Protein": 4,
  "Carbohydrates": 3.4
};
uhspa.tpnadvisor.prototype.STOPInfusing = false;
uhspa.tpnadvisor.prototype.css = uhspa.tpnadvisor.prototype.src.replace(
  'js/' + uhspa.tpnadvisor.prototype.name + '.js'
  , 'css/' + uhspa.tpnadvisor.prototype.name + '.css'
)
;

uhspa.tpnadvisor.prototype.insertCSS = insertLinkTag;
uhspa.tpnadvisor.prototype.insertScript = insertScriptTag;
uhspa.tpnadvisor.prototype.strCernerEmptyDate = '/Date(0000-00-00T00:00:00.000+00:00)/';

uhspa.tpnadvisor.prototype.config = { config1: {}, config2: {} };

/* retrieve a config object from a name/key */
uhspa.tpnadvisor.prototype.getConfig = function (p) {
  return this.config[p];
};
uhspa.tpnadvisor.prototype.resize = function () {};
uhspa.tpnadvisor.prototype.init = function () {
  if (!this.css) {
    this.css = uhspa.rootPath + 'css/' + this.name + '.css';
  }
  this.insertCSS(this.css);

  this.cclParams[0] = "MINE";
  this.cclParams[1] = this.getProperty("personId");
  this.cclParams[2] = this.getProperty("encounterId");
  this.cclParams[3] = this.getProperty("userId");
  this.cclParams[4] = this.name;

  //  var cfgname = this.options["config"]  ;               /* no default */
  var cfgname = this.options["config"] || "config1"; /* default if nothing passed */
  var cfgobj = this.getConfig(cfgname);

  if (cfgobj) {
    this.setProperty("cfgname", cfgname);
    this.cclParams[5] = this.getProperty("cfgname");
  }
  else {
    this.render = function () {
      var component = this;
      var sHTML = [];
      sHTML.push("<p>" + this.name + ": invalid option object</p>");
      sHTML.push("<dl><dt>Valid options:</dt>");
      $.each(component.config, function (key, val) {
        sHTML.push("<dd>" + component.name.replace(/\./g, "_") + "_" + key + "</dd>");
      });
      sHTML.push("</dl>");
      $(sHTML.join('')).appendTo(component.getTarget());
    };
  }
};
uhspa.tpnadvisor.prototype.hoursdiff = function UHS_TPNADVISOR_HOURSDIFF(strISODate) {
  var jsdttm = new Date();
  jsdttm.setISO8601(strISODate);
  return Math.abs(jsdttm.getTime() - Date.now()) / (60 /*m/h*/ * 60 /*s/m*/ * 1000/*ms/s*/);
};
uhspa.tpnadvisor.prototype.render = function () {
  var me = this;

  var strReq = $('#EKMREQUESTJSON').text();
  if ((/\{/).test(strReq)) {
    var objref = JSON.parse(strReq);
    if (objref) {
      me.EKMR = objref['REQUEST'];
      me.orderProviderId = me.EKMR.ORDERLIST[0].PHYSICIAN;
    }
  }
  if (false) {
    if (!me.orderProviderId || me.orderProviderId == 0) {
    /* no EKMR, try the next place */
      var opid = me.data.RREC.META.ORDERPROVIDERID;
      if (opid && opid > 0) {
        me.orderProviderId = opid;
      }
    }
  }
  if (!me.orderProviderId || me.orderProviderId == 0) { /* give up */
    throw new Error('Could not get ProviderId');
  }

  me.communicationTypeCd = me.data.RREC.OREQ.ORDERLIST[0].COMMUNICATIONTYPECD;

  me.blob_HASTPNPROPOSAL = {
    "RREC": {
      "person_id": me.getProperty('personId'),
      "encntr_id": me.getProperty('encounterId'),
      "concept_name_key": 'HASTPNPROPOSAL',
      "action_object": me.name
    }
  };

  me.className = (me.name).replace(/\./g, "_");
  var jqTgt = $(me.getTarget());

  jqTgt.find('span').text('Rendering...');

  var oiA = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM];
  var icrdh = me.getProperty('rule_data');
  if (oiA.RULE_DATA == icrdh
    && oiA.ORDERSTATUS == 'Ordered' /* not cancel/dc */
  ) {
    /* ask */
    me.dcask = $('<div>Are you sure you want to STOP the currently infusing TPN bag?</div>');
    me.dcask
      .dialog({
        modal: true,
        dialogClass: me.className + '_dcask',
        width: 340,
        position: { my: 'center', at: 'center', of: window },
        buttons: [
          {
            text: "Yes",
            click: function () {
              me.STOPInfusing = true;
              $(this).dialog('close');
            }
          },
          {
            text: "No",
            click: function () {
              me.STOPInfusing = false;
              $(this).dialog('close');
            }
          }
        ],
        open: function (event, ui) {
          $(window).resize(/* attach handler to window.resize */
            function () { /* anonymous closure over 'me' */
              /* force position to re-center */
              me.dcask.dialog('option', 'position', 'center');
            }
          );
          $(".ui-widget-overlay")
            .css({
              opacity: 1.0,
              filter: "Alpha(Opacity=100)",
              backgroundColor: "gray"
            })
          ;
        }
      });
  }

  setTimeout(function () {
    me.render2();
  }, 1);
};
uhspa.tpnadvisor.prototype.render2 = function () {
  var me = this;
  me.id = me.id || me.getComponentUid();

  var jqTgt = $(me.getTarget());
  jqTgt.addClass(me.className); /* enhance the container with my classname */

  jqTgt.addClass(me.data.RREC.META.CONFIG_KEY); /* enhance the container with config_key */

  me.prepData();

  jqTgt.html('');

  if (me.isDev) {
    var topdev = $('<div class="topdev">').appendTo(jqTgt);
  }

  if (me.nomode === true) {
    me.renderNoMode({ parent: jqTgt });
  }
  else {
    jqTgt.on('keypress', 'input[type=number]', function (evt) {
      if ((evt.which >= 48 && evt.which <= 57) /* digits */
          || evt.which == 46 /* period (decimal point) */
          || evt.which < 32 /* low characters */
          || evt.which >= 127 /* high characters */
      ) { /* ok, you can type that */ }
      else {
        evt.preventDefault();
      }
    });
    jqTgt.on('click', 'input', function (evt) {
      var tgt = $(evt.target);
      setTimeout(function () {
        tgt.select();
      }, 3);
    });
    jqTgt.on('keydown', 'input', function (evt) {
      if (evt.which == 13) {
        evt.preventDefault(); /* prevent enter from submitting in input */
        var tgt = $(evt.target);
        tgt.trigger('blur');
        tgt.select();
      }
    });

    var sections = [{
      parent: $('<div>').appendTo(jqTgt),
      css: 'patientinfo',
      HeaderText: 'Patient Information',
      render: 'renderPatientInfo'
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'route',
      HeaderText: 'Route',
      render: 'renderRoute'
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'infuse',
      HeaderText: 'Infusion Schedule',
      render: 'renderInfuse'
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'dose',
      HeaderText: 'Dosing Weight',
      render: 'renderDosingWeight',
      inglbl: 1
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'volenergy',
      HeaderText: 'Volume/Energy',
      render: 'renderVolumeEnergy',
      inglbl: 1
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'electrolyte',
      HeaderText: 'Electrolytes',
      render: 'renderElectrolyte',
      inglbl: 1
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'additive',
      HeaderText: 'Additives',
      render: 'renderAdditive',
      inglbl: 2
    },
    {
      parent: $('<div>').appendTo(jqTgt),
      css: 'ordercomment',
      HeaderText: 'Order Comments',
      render: 'renderOrderComment'
    }
    ];

    if (me.data.RREC.META.CANSIGN === 1
      && me.data.RREC.MP_ORDERABLE.length > 0
    ) {
      sections.push({
        parent: $('<div>').appendTo(jqTgt),
        css: 'addorder',
        HeaderText: 'Additional Orders',
        render: 'renderAddOrder'
      });
    }
    //$.each(sections, function (sectionix, section) {
    $.when.apply($, $.map(sections, function (section, sectionidx) {
      var dfd = $.Deferred();
      /* if 'me' has a function specified with the name given be section.render ... */
      if (typeof me[section.render] == 'function') {
        /* apply the "this" scope as a 'me' reference (thanks jquery) and pass a newSection to 'cn' and the current iteration object as 'p' */
        //me[section.render].apply(me, [me.newSection(section), section]);
        setTimeout(function () {
          me[section.render].apply(me, [me.newSection(section), section]);
          dfd.resolve(true);
        }
          , sectionidx * (2000 / sections.length) /* schedule the parts to render over 2 seconds (give or take) */
        );
      }
      else {
        alert('missing function: ' + section.render);
        dfd.resolve(false);
      }
      return dfd.promise();
    })).then(
      function finish_rendering_afterasynch(p) {
        $('<div class="uhspa-tpnadvisor-title" title="Config Key: ' + me.data.RREC.META.CONFIG_KEY + '"></div>')
          .text(me.pref('ADVISOR_TITLE', 'TPN Advisor'))
          .appendTo('.patientinfo header')
          .on('click', function (evt) {
            var configobject;
            /* if you CONTROL+SHIFT-click (like uppercase), launch configurator for the main config */
            if (evt.ctrlKey && evt.shiftKey) {
              /* see if the current user is allowed to launch config from here
                using FLEX.MAIN array, .filter() for name is ADMINISTRATIVE_USERNAME
                then see if any of the resulting array elements have a value that
                when passed to regular expression constructor and tested against the username yields true
                to exit the .some()
              */
              if (true === me.data.RREC.FLEX.MAIN
                .filter(function (fm) {
                  return fm.NAME.toUpperCase() === 'ADMINISTRATIVE_USERNAME';
                })
                .some(function (au) {
                  return RegExp('^' + au.VALUE + '$').test(me.data.RREC.META.USERNAME);
                })
              ) {
                configobject = {
                  selected_component: {
                    component_name: 'uhspa.tpnadvisor_main',
                    CONFIG_KEY: 'MAIN'
                  }
                };
              }
            }
            else {
              /* if you CONTROL-click this title, launch configurator for this key */
              if (evt.ctrlKey) {
                /* same as above, but start with FLEX.MAIN and add FLEX.CONFIG before .filter() and  .some()  */
                if (true === me.data.RREC.FLEX.MAIN.concat(me.data.RREC.FLEX.CONFIG)
                  .filter(function (fm) {
                    return fm.NAME.toUpperCase() === 'ADMINISTRATIVE_USERNAME';
                  })
                  .some(function (au) {
                    return RegExp('^' + au.VALUE + '$').test(me.data.RREC.META.USERNAME);
                  })
                ) {
                  configobject = {
                    selected_component: {
                      component_name: 'uhspa.tpnadvisor_config',
                      CONFIG_KEY: me.data.RREC.META.CONFIG_KEY
                    }
                  };
                }
              }
            }
            if (configobject !== undefined) {
              evt.stopPropagation(); /* in case header clicks are active, don't bubble to it */
              /* something bad happens to double-quotes during transport/round-trip of configobject through uhs_mpg_driver
                so this exact combination of singlequote,doublequote,carat string delimiters is the only combination that 'works'
                because there was a workaround to the problem that involves turning valid JSON into carat-delimited prop/val
                then when the object is written into the html source, the invalid carats are written as doublequote
              */
              me.CCLNSW({
                reportName: "UHS_MPG_DRIVER",
                reportParams: [
                  "'MINE'",
                  (Number(me.getProperty("personId")) || 0),
                  (Number(me.getProperty("encounterId")) || 0),
                  (Number(me.getProperty("userId")) || 0),
                  (Number(me.getProperty("positionCd")) || 0),
                  (Number(me.getProperty("pprCd")) || 0),
                  "''",
                  "''",
                  "'uhs_mpg_std_comp.html'",
                  "'" + JSON.stringify(configobject).replace(/"/g, '^') + "'", /* see note above regarding this .replace() */
                  "'config'",
                  "'PROD'",
                  "''"
                ]
              });
            }
          })
        ;

        $('header span.new,header span.new2').text(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].COLHEAD);
        $('header span.old,header span.old2').text(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM].COLHEAD);

        var ftr = $('<footer>');
        me.renderFooter({ parent: ftr });
        ftr.appendTo(jqTgt);

        me.iospark();
        me.spark();
        //me.setEditMode( me.EditMode ); /* editmode was set before Additive was put into the DOM, so now reset the DOM */
        var reqix = parseInt($('.sltn').find(':checked').val(), 10) || 0;
        if (reqix != 0) {
          /* 20160506msd it doesn't matter anymore, it's either compoound or standard because MixE/Custom died a long time ago */
          me.setEditMode('Standard');
        }

        me.draw(); /* this call sets some data into the dom that is needed for calcs */
        me.setByRequestable(reqix); /* this call is dependent on dom being already ready (above) */
        me.draw(); /* this call presents the finishied 'start' view */

        if (me.data.RREC.META.PROPOSALDATA !== "") {
          me.restoreProposal();
        }
      }
    );

    /* helpful dev stuff */
    if (me.isDev) {
      $('<button style="position: fixed; top:0;left:0; z-index:100;">reload(WL)</button>')
        .appendTo(topdev)
        .on('click', function (evt) {
          window.location = window.location.href.split('#')[0];
        })
      ;

      $('<textarea title="me.data postmapping" >' + JSON.stringify(me.data) + '</textarea>').appendTo('.topdev');
      $('<textarea id="osmodbg" title="osmo debug" ></textarea>').appendTo('.topdev');

      $('<button>restoreProposal</button>').appendTo('.topdev').on('click', function (evt) {
        me.restoreProposal.call(me);
        me.draw.call(me);
      });

      $('<div id="dbgproposal">').appendTo('.topdev');
      var proposaldata = "";
      try {
        proposaldata = JSON.stringify(JSON.parse(me.data.RREC.META.PROPOSALDATA), null, 2);
      }
      catch (err) {}
      $('<textarea>' + proposaldata + '</textarea>').appendTo('#dbgproposal');
      $('<button>update Proposal</button>').appendTo('#dbgproposal').on('click', function (evt) {
        me.data.RREC.META.PROPOSALDATA = $('#dbgproposal textarea').val();
      });

      $('<textarea title="TPNAdvisor.Data - postmapping">' + JSON.stringify(me.data) + '</textarea>')
        .appendTo(topdev)
      ;
      $('<button>reload data</button>')
        .on('click', function (evt) {
          me.refresh();
        })
        .appendTo(topdev)
      ;
      $('<button>order TPN</button>')
        .on('click', function (evt) {
          $('section').addClass('collapse');
          me.save();
        })
        .appendTo(topdev)
      ;
      $('<button>EtoS</button>')
        .on('click', function (evt) {
          $('#EtoS').val(JSON.stringify(me.EtoS()).replace(/,/g, "\n,"));
        })
        .appendTo(topdev)
      ;
      $('<textarea id="EtoS"></textarea>')
        .appendTo(topdev)
      ;
      $('<a href="#section_additives">jump to additives</a>')
        .on('click', function (evt) {
          setTimeout(function () {
            window.scrollBy(0, -100);
          }, 500);
        })
        .appendTo(topdev)
      ;

      jqTgt.find('section').on('click', 'header'
        , function (evt) {
          $(evt.delegateTarget).toggleClass('collapse');
        }
      );

      var dbg = $('<div id="dbg">');
      var btnTog =
        $('<button>section E/C</button>')
          .on('click'
            , function (evt) {
              $('section').toggleClass('collapse');
            }
          )
          .appendTo(dbg)
        ;
      var btnTDB =
        $('<button>TDB Execute</button>')
          .on('click'
            , function (evt) {
              $('.uhspa_hack_tdbexecute').toggle();
            }
          )
          .appendTo(dbg)
        ;
      dbg.appendTo(jqTgt);

      var OrderDebug = $('<div id="orderdebug">').hide().appendTo(jqTgt);
      $('<textarea class="req" id="' + me.id + 'req"></textarea>').appendTo(OrderDebug);
      $('<textarea class="req" id="' + me.id + 'reqexe"></textarea>').appendTo(OrderDebug);
      $('<textarea class="xlog" id="' + me.id + 'xlog"></textarea>').appendTo(OrderDebug);
    } /* if( me.isDev ) */
  }
};
uhspa.tpnadvisor.prototype.CCLNSW = function (a) {
  CCLNEWSESSIONWINDOW(
    ('javascript:CCLLINK("reportName","reportParams",0)')
      .replace(/reportName/, a.reportName)
      .replace(/reportParams/, a.reportParams.join(','))
    , "_blank"
    , "top=0,left=0,width=" + screen.width * 0.8 + ",height=" + screen.height * 0.9 + ",toolbar=yes,scrollbar=yes"
    , 0
    , 1
  );
};
uhspa.tpnadvisor.prototype.newSection = function (p) {
/* section builder */
  /* allows extension of the "basic box" for all uses of this function */
  var me = this;
  var parent = $(p.parent || me.getTarget());

  var sctn = $('<section class="' + p.css + '">').appendTo(parent);
  var hedr = $('<header></header>').appendTo(sctn);
  switch (p.inglbl) {
    case 1 :
      $('<h1>' + p.HeaderText + '</h1>'
        + '<span class="new"></span>'
        + '<span class="old"></span>'
        + '<span class="lab">Labs</span>'
      ).appendTo(hedr)
      ;
      break;
    case 2 :
      $('<div>'
        + '<h1>' + p.HeaderText + '</h1>'
        + '<span class="new2"></span>'
        + '<span class="old2"></span>'
        + '</div>'
        + '<div>'
        + '<span class="lbl">&nbsp;</span>'
        + '<span class="new2"></span>'
        + '<span class="old2"></span>'
        + '</div>'
      ).appendTo(hedr)
      ;
      break;
    default :
      $('<h1>' + p.HeaderText + '</h1>'
      ).appendTo(hedr)
      ;
      break;
  }
  var cn = $('<div>').appendTo(sctn);

  return cn;
};
uhspa.tpnadvisor.prototype.ingredientUI = function (p) {
  var isIngredient;
  var me = this;
  var ingPrec = 0;
  fvolumelock = '<div class="uhspa-fvolumelock" '
              + 'title="Amount is locked to volume by concentration" '
              + '>'
              + '<div class="uhspa-fvolumelock-top"></div>'
              + '<div class="uhspa-fvolumelock-bottom"></div>'
              + '</div>'
  ;
  if (true /* ingredientUI init/preamble */) {
    p.id = (p.id) ? p.id : this.id + Math.random().toString();

    var b2Label = 'Current';
    var oiA = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM];
    var oiN = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW];

    var ing = me.data.RREC.INGREDIENT_map[p.keyname];
    if (ing) {
      isIngredient = true;
      if (p.hasOwnProperty('ingredient')
      && p.ingredient == false
      ) {
        isIngredient = false;
      }
    }
    else {
      ing = {};
      isIngredient = false;
    }
    var equiv = ing.ALTUOM || p.equiv || [];
    var note = ing.NOTE || p.note || [];
    var uom_disp = ing.UOM_DISP || p.uom_disp;

    var oldvalue = ing.OLDVALUE || p.oldvalue || 0; /* from the ingredient array, from the parameter or zero */
    if (oldvalue == 0) { /* if zero, try computing from the salts in the ingredient array */
      oldvalue = parseFloat(me.EfromS(p.keyname, 'OLDVALUE')) || 0;
    }
    if (oldvalue == 0) { /* if still zero, try computing from premix info */
      var PMI = me.data.RREC.PREMIXINFO_map[oiA.ORDERMNEMONIC];
      if (PMI) {
        var PMIi = PMI.INGREDIENT_map[p.keyname];
        if (PMIi) {
          oldvalue = me.computePremixAmount(PMIi, oiA.ORDERDOSEWEIGHTKG, oiA.ORDERTOTALVOLUME);
        }
      }
    }
    oldvalue = parseFloat(oldvalue);

    var newvalue = ing.NEWVALUE || p.newvalue || 0;
    if (newvalue == 0) {
      newvalue = parseFloat(me.EfromS(p.keyname, 'NEWVALUE')) || 0;
    }
    if (newvalue == 0) { /* if still zero, try computing from premix info */
      var PMI = me.data.RREC.PREMIXINFO_map[oiN.ORDERMNEMONIC];
      if (PMI) {
        var PMIi = PMI.INGREDIENT_map[p.keyname];
        if (PMIi) {
          newvalue = me.computePremixAmount(PMIi, oiN.ORDERDOSEWEIGHTKG, oiN.ORDERTOTALVOLUME);
        }
      }
    }
    newvalue = parseFloat(newvalue);

    var alreadyperkg = {
      "Volume": true,
      "Protein": true,
      "Carbohydrates": true,
      "Fat": true
    };
    if ((/\/kg\//).test(uom_disp)
    && !alreadyperkg[p.keyname]
    ) {
      oldvalue = oldvalue / oiA.ORDERDOSEWEIGHTKG;
      newvalue = newvalue / oiN.ORDERDOSEWEIGHTKG;
    }

    /* 21050306 msd - now the direction is to use the ordertotalvolume for the total volume
    this will set the total volume (that is otherwise keyed) and the recalculation of [non/]lipidvoltotal will handle the rest
  */
    if (p.keyname == "Volume") {
      oldvalue = (oiA.ORDERDOSEWEIGHTKG === 0) ? 0 : (oiA.ORDERTOTALVOLUME / oiA.ORDERDOSEWEIGHTKG);
      newvalue = (oiN.ORDERDOSEWEIGHTKG === 0) ? 0 : (oiN.ORDERTOTALVOLUME / oiN.ORDERDOSEWEIGHTKG);
    }

    var oldLipidConcentration = parseFloat(oiA.LIPIDCONCENTRATION || 0.2); /* 20% = 20g/100mL */
    var newLipidConcentration = parseFloat(oiN.LIPIDCONCENTRATION || 0.2); /* 20% = 20g/100mL */

    var fat = me.data.RREC.INGREDIENT_map['Fat'];
    var oldFat = fat.OLDVALUE;
    var newFat = fat.NEWVALUE;

    var oldLipidAmountTotal = oldFat * oiA.ORDERDOSEWEIGHTKG;
    var newLipidAmountTotal = newFat * oiN.ORDERDOSEWEIGHTKG;

    var oldLipidVolTotal = oldLipidAmountTotal / oldLipidConcentration;
    var newLipidVolTotal = newLipidAmountTotal / newLipidConcentration;

    oldnlv = oiA.ORDERTOTALVOLUME - oldLipidVolTotal;
    newnlv = oiN.ORDERTOTALVOLUME - newLipidVolTotal;

    /* 20160331msd #2124172 weird uom */
    if (p.keyname == 'Heparin') {
      /* ingredient(heparin) UOM not literally 'units' */
      if (ing.UOM_DISP !== 'units') {
        /* ... the only other usage is units/mL of volume, which is dependent on admixture */
        var oldvol = (oiA.SEPARATELIPID === 0 /* admixture=3:1 */
          ? oiA.ORDERTOTALVOLUME
          : oldnlv
        );
        var newvol = (oiN.SEPARATELIPID === 0 /* admixture=3:1 */
          ? oiN.ORDERTOTALVOLUME
          : newnlv
        );
        oldvalue = oldvalue / oldvol;
        newvalue = newvalue / newvol;
      }
    }
    if (p.keyname == 'Cysteine') {
      if (ing.UOM_DISP === 'mg/gm AA') {
        var protein = me.data.RREC.INGREDIENT_map['Protein'];
        oldvalue = oldvalue / (protein.OLDVALUE * oiA.ORDERDOSEWEIGHTKG);
        newvalue = newvalue / (protein.NEWVALUE * oiN.ORDERDOSEWEIGHTKG);
      }
    }
    /* /20160331msd #2124172 weird uom */

    var editmode = ing.EDITMODE || p.editmode || 'None';
    var labs = ing.LABS || p.labs || [];
    var display = ing.DISPLAY || p.display || p.keyname;
  }

  switch (p.keyname) {
    case 'Fat' :
    case 'Protein' :
    case 'Carbohydrates' :
      var ingPrec = me.precision['macro'];
      break;
    case 'Potassium' :
    case 'Sodium' :
    case 'Calcium' :
    case 'Magnesium' :
    case 'Phosphate' :
    case 'Chloride' :
    case 'Acetate' :
      var ingPrec = me.precision['micro'];
      break;
    case 'Volume' :
      var ingPrec = me.precision['mL'];
      break;
    case 'DoseWeightKg' :
      var ingPrec = me.precision['kg'];
      break;
    default :
      if ((/\/kg/i).test(ing.UOM_DISP)) {
        var ingPrec = me.precision['kg'];
      }
      else {
        var ingPrec = me.precision['default'];
      }
      break;
  }

  var box = [];
  if (true /* box0 */) {
    var notesrc = $.map(note, function (obj) {
      return (obj.TEXT || obj.text || "");
    }).join('\n');

    var noteparsed = me.evaluate.apply(me, [notesrc, p.keyname]);
    var notetype = ((notesrc === noteparsed) ? 'static' : 'dynamic');

    box[0] = $('<dl class="b0">'
            + '<dt>' + display + '</dt>'
            + '<dd class="uhspa-tpnadvisor-ingnote uhspa-tpnadvisor-ingnote-' + notetype + '">'
            + ((notetype === 'dynamic')
              ? '<pre class="uhspa-tpnadvisor-ingnote-source" style="display:none;">' + notesrc + '</pre>'
              : ''
            )
            + '<div class="uhspa-tpnadvisor-ingnote-parsed" >' + noteparsed.replace(/\n/g, '<br>') + '</div>'
            + '</dd>'
            + '</dl>'
    );
    switch (p.keyname) {
      case 'Phosphate' :
        cfgPrefKNA = me.pref('PREF_SALT_PHOSPHATE', 'Potassium');
        $('<dd class="prefKNa">'
        + '<select id="' + me.id + 'prefKNa' + '" title="Salt Preference">'
          + '<option value="Potassium" '
            + (cfgPrefKNA === 'Potassium' ? 'selected="selected" ' : '')
            + '>Potassium</option>'
          + '<option value="Sodium" '
            + (cfgPrefKNA === 'Sodium' ? 'selected="selected" ' : '')
            + '>Sodium</option>'
        + '</select>'
        + '</dd>'
        ).appendTo(box[0])
          .on('change'
            , function (evt) {
              me.draw();
            }
          )
        ;
        break;
      case 'Fat' :
        $('<dd class="pref' + p.keyname + '">'
        + '<select>'
        + $.map(me.data.RREC.INGPROD_keyname[p.keyname].PRODUCT, function (objIP, idxIP) {
          return '<option '
                      + 'value="' + objIP.CONCENTRATION + '" '
                      + (objIP.SELECTED === 1
                        ? 'selected="selected" '
                        : ''
                      )
                      + '>'
                      + objIP.DISPLAY
                      + '</option>'
          ;
        }).join('')
        + '</select>'
        + '</dd>'
        )
          .appendTo(box[0])
          .on('change'
            , function (evt) {
              me.draw();
            }
          )
        ;
        break;
      case 'Protein' :
        $('<dd class="pref' + p.keyname + '">'
      + '<select>'
      + $.map(me.data.RREC.INGPROD_keyname[p.keyname].PRODUCT, function (objIP, idxIP) {
        return '<option '
                    + 'value="' + objIP.CONCENTRATION + '" '
                    + (objIP.SELECTED === 1
                      ? 'selected="selected" '
                      : ''
                    )
                    + '>'
                    + objIP.DISPLAY
                    + '</option>'
        ;
      }).join('')
      + '</select>'
      + '</dd>'
        )
          .appendTo(box[0])
          .on('change'
            , function (evt) {
              me.draw();
            }
          )
        ;
        break;
    }
  }

  if (true /* box1 */) {
    var volumeDisplay = '';
    var htmlEquiv = '';
    if (equiv.length > 0) {
      htmlEquiv = $.map(equiv, function (obj, ix) {
        return '<dd class="eq ' + obj.NAME + '">'
              + '<span>'
              + '<span class="nm">' + (obj.LABEL ? obj.LABEL + ':' : '') + '</span>'
              + '<span class="vl" '
              + 'id="' + me.id + p.keyname + obj.NAME + '"'
              + 'data-precision="' + ingPrec + '" '
              + '>'
              + (me.maxP(obj.VALUE, ingPrec) || '')
              + '</span>'
              + '<span class="uom">' + obj.UOM_DISP + '</span>'
              + '</span>'
              + '</dd>'
        ;
      }).join('');
    }
    switch (p.keyname) {
      case 'Chloride' :
      case 'Acetate' :
        if (true /* box1-Chloride/Acetate */) {
          box[1] = $('<dl class="b1 ' + editmode + '">'
            + '<dt>' + oiN.COLHEAD + '</dt>'
            + '<dd>'
            + fvolumelock
            + '<span class="itm bal">'
            + '<input id="' + me.id + 'bal' + p.keyname + '" '
            + 'type="radio" checked="checked" '
            + 'name="rdo' + p.keyname + '" '
            + 'value="ToBalance">'
            + '<label for="' + me.id + 'bal' + p.keyname + '">'
            + 'To Balance'
            + '</label>'


            + ((p.keyname == 'Chloride')
              ? '<br /><select class="ratioCLAc" id="' + me.id + 'ratioCLAc" title="Chloride/Acetate Ratio">'

              + '<option value="1ac:1ch">1 Chloride : 1 Acetate</option>'
              + '<option value="2ac:1ch">1 Chloride : 2 Acetate</option>'
              + '<option value="3ac:1ch">1 Chloride : 3 Acetate</option>'
              + '<option value="1ac:2ch">2 Chloride : 1 Acetate</option>'
              + '<option value="1ac:3ch">3 Chloride : 1 Acetate</option>'
              + '<option value=""></option>'

              + '</select>'
              : ''
            )

            + '</span>'

            + '<span class="itm cst">'
            + '<input id="' + me.id + 'cst' + p.keyname + '" '
            + 'type="radio" '
            + 'name="rdo' + p.keyname + '" '
            + 'value="Custom">'
            + '<label for="' + me.id + 'cst' + p.keyname + '">'
            + 'Custom'
            + '</label>'
            + '<br>'
            + '<input name="cst' + p.keyname + '" '
            + 'type="number" '
            + 'data-name="' + p.keyname + '" '
            + 'data-keyname="' + p.keyname + '" '
            + 'data-editmode="' + editmode + '" '
            + 'data-precision="' + ingPrec + '" '
            + 'data-uom="' + uom_disp + '" '
            + 'class="v '
            + ((isIngredient)
              ? 'ingredient'
              : ''
            )
            + '">'
            + ' <span class="uom">' + uom_disp + '</span>'
            + '</span>'
            + '</dd>'
            + htmlEquiv
            + '</dl>'
          );
          box[1].on('keydown', 'input.v'
            , function (evt) {
              if (me.EditMode == 'Compound') {
                if (evt.which != 9) {
                  var theobj = $(this).siblings('input');
                  setTimeout(function () {
                    theobj.prop('checked', true);
                  }, 10);
                  me.getObject('ratioCLAc').val('');
                  if ($(this).data('keyname') == 'Acetate') {
                    me.getObject('Chloride').val('');
                    me.getObject('rdoChlorideToBal').prop('checked', true);
                  }
                  else {
                    me.getObject('Acetate').val('');
                    me.getObject('rdoAcetateToBal').prop('checked', true);
                  }
                }
              }
            }
          );
          box[1].on('click', 'input[type=radio]'
            , function (evt) {
              if (me.EditMode == 'Compound') {
                me.getObject('Chloride').val('');
                me.getObject('Acetate').val('');
                me.draw();
              }
            }
          );
          box[1].on('change', 'select'
            , function (evt) {
              if (me.EditMode == 'Compound') {
                me.getObject('rdoChlorideToBal').prop('checked', true);
                me.getObject('rdoAcetateToBal').prop('checked', true);
                me.getObject('Chloride').val('');
                me.getObject('Acetate').val('');
                me.draw();
              }
            }
          );
        }
        break;
      case 'Volume' :
        var b1vpd = '<div id="lipidvol">'
                    + '<input tabindex="-1" id="LipidVolTotal" '
                    + 'data-precision="' + ingPrec + '" '
                    + 'readonly="readonly" class="amt" value="0" '
                    + '>'
                    + '<span class="lbl">mL/day Lipid</span>'
                  + '</div>'
                  + '<div id="nonlipidvol">'
                    + '<input tabindex="-1" id="NonLipidVolTotal" '
                    + 'data-precision="' + ingPrec + '" '
                    + 'readonly="readonly" class="amt" value="0" '
                    + '>'
                    + '<span class="lbl">mL/day Non-Lipid</span>'
                  + '</div>'
                  ;
        var b1vph = '<div id="lipidvolrate">'
                    + '<input tabindex="-1" id="lipidvolhr" '
                    + 'data-precision="' + ingPrec + '" '
                    + 'readonly="readonly" class="amt" value="0" '
                    + '>'
                    + '<span class="lbl">mL/hr Lipid</span>'
                  + '</div>'
                  + '<div id="nonlipidvolrate">'
                    + '<input tabindex="-1" id="nonlipidvolhr" '
                    + 'data-precision="' + ingPrec + '" '
                    + 'readonly="readonly" class="amt" value="0" '
                    + '>'
                    + '<span class="lbl">mL/hr Non-Lipid</span>'
                  + '</div>'
                  ;
        volumeDisplay = '<dd class="voldisp">'
                      + (equiv[0].NAME === 'tvol' /* someone configured priority? */
                        ? b1vpd + b1vph /* day then hour */
                        : b1vph + b1vpd /* hour then day */
                      )
                      + '</dd>'
        ;
        /* falls through */
      default :
        box[1] = $('<dl class="b1 ' + editmode + '">'
                    + '<dt>' + oiN.COLHEAD + '</dt>'
                    + '<dd>'
                    + fvolumelock
                    + (p.readonly
                      ? ('<span class="ro">'
                        + '<span class="rom" id="' + p.id + '">' + me.maxP(newvalue, ingPrec) + '</span>'
                        + '<span>' + uom_disp + '</span>'
                        + '</span>'
                      )
                      : ('<input '
                        + 'id="' + p.id + '" '
                        + 'type="number" '
                        + 'data-name="' + p.keyname + '" '
                        + 'data-keyname="' + p.keyname + '" '
                        + 'data-editmode="' + editmode + '" '
                        + 'data-precision="' + ingPrec + '" '
                        + 'data-uom="' + uom_disp + '" '
                        + 'class="hi '
                        + ((isIngredient)
                          ? ' ingredient '
                          : ''
                        )
                        + ((p.keyname == 'DoseWeightKg' || p.keyname == 'Volume')
                          ? ' uhspa-required '
                          : ''
                        )
                        + '"'
                        + 'value="' + me.maxP((newvalue || 0), ingPrec) + '" '
                        + '>'
                        + '<label>' + uom_disp + '</label>'
                      )
                    )
                    + '</dd>'
                    + htmlEquiv
                    + volumeDisplay
                    + '</dl>'
        );
        break;
    }
  }

  if (true /* box2 */) {
    var oi = oiA;
    var DWKG = oi.ORDERDOSEWEIGHTKG;
    var aStart = oi.ORDERINFUSESTART.split(':');
    var hStart = parseFloat(aStart[0]) + parseFloat(aStart[1] / 60);
    var aStop = oi.ORDERINFUSESTOP.split(':');
    var hStop = parseFloat(aStop[0]) + parseFloat(aStop[1] / 60);
    var dur = oi.ORDERINFUSEOVER;

    var volumeDisplay = '';
    if (p.keyname == 'Volume') {
      var oldconcentration = parseFloat(oiA.LIPIDCONCENTRATION || 0.2);
      var oldweightkg = parseFloat(oiA.ORDERDOSEWEIGHTKG);
      var oldfatvoltotal = ((me.data.RREC.INGREDIENT_map['Fat'].OLDVALUE || 0) * oldweightkg) / oldconcentration;
      var oldnonfatvoltotal = ((oldvalue * oldweightkg) - oldfatvoltotal) || 0;

      var b2vpd = '<div id="b2lipidvol">'
        + '<input tabindex="-1" readonly="readonly" class="amt" value="' + me.maxP(oldfatvoltotal, ingPrec) + '" >'
        + '<span class="lbl">mL/day Lipid</span>'
        + '</div>'
        + '<div id="b2nonlipidvol">'
        + '<input tabindex="-1" readonly="readonly" class="amt" value="' + me.maxP(oldnonfatvoltotal, ingPrec) + '">'
        + '<span class="lbl">mL/day Non-Lipid</span>'
        + '</div>';
      var b2vph = '<div id="b2lipidvolrate">'
        + '<input tabindex="-1" readonly="readonly" class="amt" value="' + me.maxP(oldfatvoltotal / oi.ORDERLIPIDINFUSEOVER, ingPrec) + '" >'
        + '<span class="lbl">mL/hr Lipid</span>'
        + '</div>'
        + '<div id="b2nonlipidvolrate">'
        + '<input tabindex="-1" readonly="readonly" class="amt" value="' + me.maxP(oldnonfatvoltotal / oi.ORDERINFUSEOVER, ingPrec) + '">'
        + '<span class="lbl">mL/hr Non-Lipid</span>'
        + '</div>';
      volumeDisplay = '<dd class="voldisp">'
                    + (equiv[0].NAME === 'tvol' /* someone configured priority? */
                      ? b2vpd + b2vph /* day then hour */
                      : b2vph + b2vpd /* hour then day */
                    )
                    + '</dd>'
      ;
    }
    var precxoldval = parseFloat(me.maxP(oldvalue, 2)); /* x = 2 */
    box[2] = $('<dl class="b2 ' + (oi.SEPARATELIPID === 1 ? 'adm21' : 'adm31') + '">'
            + '<dt>' + oiA.COLHEAD + '</dt>'
            + '<dd>'
            + '<span class="vl TBD">' + me.maxP((oldvalue || 0), ingPrec) + '</span>'
            + '<span class="uom">' + uom_disp + '</span>'
            + '</dd>'
            + $.map(equiv
              , function (obj, idx) {
                var dv;
                var ti = '';
                if (obj.UOM_DISP == uom_disp) {
                  dv = precxoldval;
                }
                switch (p.keyname) {
                  case 'Volume' :
                    dv = (obj.UOM_DISP == 'mL/hr')
                      ? me.maxP((oi.ORDERTOTALVOLUME / dur || 0), ingPrec /*me.precision['mL']*/)
                      : me.maxP(oi.ORDERTOTALVOLUME, ingPrec /*me.precision['mL']*/)
                    ;
                    break;
                  case 'Protein' :
                    dv = (obj.UOM_DISP == 'gm/day')
                      ? me.maxP(precxoldval * DWKG, ingPrec /*me.precision['macro']*/)
                      : me.maxP(me.kcalgm['Protein'] * precxoldval * DWKG, ingPrec /*0*/)
                    ;
                    break;
                  case 'Carbohydrates' :
                    switch (obj.UOM_DISP) {
                      case 'gm/day' :
                        dv = me.maxP((precxoldval * DWKG || 0), ingPrec /*me.precision['macro']*/);
                        break;
                      case 'Kcal/day' :
                        dv = me.maxP((me.kcalgm['Carbohydrates'] * precxoldval * DWKG || 0), ingPrec /*0*/);
                        break;
                      case 'mg/kg/min' :
                        dv = me.maxP((precxoldval * 1000 / (dur * 60) || 0), ingPrec /*me.precision['macro']*/);
                        break;
                      default :
                        /* dextrose percentage has admixture dependency */
                        if ((/^\% dex/i).test(obj.UOM_DISP)) {
                          var vol = (oi.SEPARATELIPID === 1
                            ? oldnlv /* box2 would always use "old" value */
                            : oi.ORDERTOTALVOLUME
                          );
                          dv = 100 * precxoldval * DWKG / vol;
                          //ti = me.maxP( precxoldval * DWKG,1 ) + ' gm / ' + me.maxP( vol , 0 ) + ' mL';
                        }
                        else {
                          dv = '';
                        }
                        break;
                    }

                    break;
                  case 'Fat' :
                    dv = (obj.UOM_DISP == 'gm/day')
                      ? me.maxP((precxoldval * DWKG || 0), ingPrec /*me.precision['macro']*/)
                      : me.maxP((me.kcalgm['Fat'] * precxoldval * DWKG || 0), ingPrec /*0*/)
                    ;

                    break;
                  case 'Heparin' :
                    if (obj.UOM_DISP == 'units/day') {
                      var vol = (oi.SEPARATELIPID === 0
                        ? oi.ORDERTOTALVOLUME
                        : oldnlv /* box2 would always use "old" value */
                      );
                      dv = me.maxP(((oldvalue * vol) || 0), 0);
                    }
                  case 'Cysteine' :
                    if (obj.UOM_DISP == 'mg/day') {
                      dv = me.maxP((oldvalue * me.getValue("Protein") * DWKG || 0), 0 /*me.precision['macro']*/);
                    }
                  default :
                    if (uom_disp !== obj.UOM_DISP
                      && uom_disp.replace(/kg\//, '') === obj.UOM_DISP
                    ) {
                      dv = me.maxP((oldvalue * DWKG || 0), ingPrec - 1 /*me.precision['macro']*/);
                    }
                    break;
                }
                return '<dd class="eq ' + obj.NAME + '">'
                        + '<span '
                        + (ti === ''
                          ? ''
                          : 'title="' + ti + '" '
                        )
                        + '>'
                        + '<span class="nm"></span>'
                        + '<span class="vl" '
                        + 'data-precision="' + ingPrec + '" '
                        + '>' + me.maxP((dv || 0), ingPrec) + '</span>'
                        + '<span class="uom">' + obj.UOM_DISP + '</span>'
                        + '</span>'
                        + '</dd>'
                ;
              }
            ).join('')
            + volumeDisplay
            + '</dl>'
    );
  }

  if (true /* box3 */) {
    if (labs && labs.length > 0 && labs[0].DISPLAY != '') {
      box[3] = $('<dl class="b3">'
              + '<dt>Labs</dt>'
              + '<dd>'
              + $.map(labs
                , function (obj) {
                  return '<span class="lab">'
                          + '<span class="nm">' + obj.DISPLAY + '</span>'
                          + '<span class="vl">' + '' + '</span>'
                          + '<span class="uom">' + '' + '</span>'
                          + '<span class="dt">' + '' + '</span>'
                          + '<span class="sparkline" data-esn="' + obj.EVENT_SET_NAME + '">'
                          + '{' + obj.EVENT_SET_NAME + '}'
                          + '</span>'
                          + '</span>'
                  ;
                }
              ).join('<br>')
              + '</dd>'
              + '</dl>'
      );
    }

    if (p.keyname == 'Volume') {
      var IO = me.data.RREC.PATIENTINFO.IO;
      if (IO.length == 0) {
        box[3] = $('<dl class="b3">'
                  + '<dt>Labs</dt>'
                  + '<dd>'
                    + '<span class="lab">'
                      + '<span class="nm">Intake</span>'
                      + '<span class="vl">' + '' + '</span>'
                      + '<span class="uom">' + '' + '</span>'
                      + '<span class="dt">' + '' + '</span>'
                      + '<span class="XIOspark" data-type="INTAKE">'
                      + 'No Data'
                      + '</span>'
                    + '</span>'
                    + '<span class="lab">'
                      + '<span class="nm">Output</span>'
                      + '<span class="vl">' + '' + '</span>'
                      + '<span class="uom">' + '' + '</span>'
                      + '<span class="dt">' + '' + '</span>'
                      + '<span class="XIOspark" data-type="OUTPUT">'
                      + 'No Data'
                      + '</span>'
                    + '</span>'
                    + '<span class="lab">'
                      + '<span class="nm">Balance</span>'
                      + '<span class="vl">' + '' + '</span>'
                      + '<span class="uom">' + '' + '</span>'
                      + '<span class="dt">' + '' + '</span>'
                      + '<span class="XIOspark" data-type="BAL">'
                      + 'No Data'
                      + '</span>'
                    + '</span>'
                  + '</dd>'
                  + '</dl>'
        );
      }
      else {
        var latest = IO[0]; /* descending:: first is latest */
        var bal = parseFloat(latest.INTAKE) - parseFloat(latest.OUTPUT);
        var latestdttm = latest.START_DT_TM_FORMATTED.slice(0, 10);
        box[3] = $('<dl class="b3">'
                + '<dt>Labs</dt>'
                + '<dd>'
                  + '<span class="lab">'
                    + '<span class="nm">Intake</span>'
                    + '<span class="vl">' + latest.INTAKE + '</span>'
                    + '<span class="uom">mL</span>'
                    + '<span class="dt">' + latestdttm + '</span>'
                    + '<span class="IOspark" data-type="INTAKE">'
                    + $.map(IO
                      , function (obj) {
                        return obj.INTAKE.toString();
                      }
                    ).join(',')
                    + '</span>'
                  + '</span>'
                  + '<span class="lab">'
                    + '<span class="nm">Output</span>'
                    + '<span class="vl">' + latest.OUTPUT + '</span>'
                    + '<span class="uom">mL</span>'
                    + '<span class="dt">' + latestdttm + '</span>'
                    + '<span class="IOspark" data-type="OUTPUT">'
                    + $.map(IO
                      , function (obj) {
                        return obj.OUTPUT.toString();
                      }
                    ).join(',')
                    + '</span>'
                  + '</span>'
                  + '<span class="lab">'
                    + '<span class="nm">Balance</span>'
                    + '<span class="vl">' + bal + '</span>'
                    + '<span class="uom">mL</span>'
                    + '<span class="dt">' + latestdttm + '</span>'
                    + '<span class="IOspark" data-type="BAL">'
                    + $.map(IO
                      , function (obj) {
                        obj.BAL = obj.INTAKE - obj.OUTPUT;
                        return obj.BAL.toString();
                      }
                    ).join(',')
                    + '</span>'
                  + '</span>'
                + '</dd>'
                + '</dl>'
        );
      }
    }
  }

  box[1].on('focus', 'input', function (evt) {
    var jqThs = $(this);
    jqThs.data('wasvalue', jqThs.val());
  });
  box[1].on('change', 'input', function (evt) {
    var rv = true;
    var jqThs = $(this);
    var thsdata = jqThs.data();

    var em = jqThs.attr('data-editmode');
    if (em == 'Custom') {
      em = 'Compound';
    } /* 20150702msd MixE to Compound, no Mix */
    var proceed = true;

    if (me.EditMode != 'Compound'
        && em == 'Compound'
    ) { /* 20150702msd add annoying popup to confirm intention/warn */
      proceed = confirm('Non-standard amounts require Custom solution\n\nSwitch TPN Solution to Custom Formula?');
    }

    var reqix = parseInt($('.sltn').find(':checked').val(), 10) || 0;

    if (proceed) {
      if (em && me.EditMode != em) {
        me.setEditMode(em);
      }
      if (em == 'Compound') {
        var reqix = 0;
      }
      //else {
      //  var reqix = parseInt( $('.sltn').find(':checked').val(), 10 ) || 0;
      //  }
      /* set to the custom template... (this is kind of a hack) */
    }
    else {
      rv = false;
    }

    me.setByRequestable(reqix);
    /* 20150924 msd - hacky way to solve a problem where stuff is out of date due to changes : set it twice
      this wasn't a problem when each keyup caused a redraw, but now that the event is change...
    */
    me.setByRequestable(reqix);

    setTimeout(function () {
      me.draw();
    }, 3);

    return rv;
  }
  );
  /* checking reference range checking moved from change to blur because "30" fired a warn/complain on the 3 before the user can enter 0 */
  box[1].on('blur', 'input', function (evt) {
    var rv = true;
    var jqThs = $(this);
    var thsdata = jqThs.data();

    var thsing = me.data.RREC.INGREDIENT_map[thsdata.keyname];
    /* if this IS an ingredient, check for reference ranges */
    if (thsing !== undefined) {
      if (thsing.refrng === undefined) {
        thsing.refrng = me.ReferenceRangeArrayToObject(thsing.REFERENCE_RANGE);
      }
      if (thsing.refrng.contraints > 0) {
        var thsval = parseFloat(jqThs.val());
        var wasval = parseFloat(thsdata.wasvalue);
        var checkresult = thsing.refrng.check(thsval);
        switch (checkresult.stop) {
          case 'hard' :
            alert(
              (thsing.DISPLAY || thsdata.keyname) + ':\n\n' +
              (checkresult.status
                    + '\n\n' + 'The value will be reset to ' + wasval + ' UOM'
              ).replace(/UOM/g, thsdata.uom)
            );
            jqThs.val(wasval);
            break;
          case 'firm' :
            var hadClass = jqThs.hasClass('uhspa-range-warn');
            jqThs.addClass('uhspa-range-warn');
            if (wasval !== thsval) {
              var cfm = confirm(
                (thsing.DISPLAY || thsdata.keyname) + ':\n\n' +
                (checkresult.status
                      + '\n'
                      + '\n' + 'OK: Continue with ' + thsval + ' UOM'
                      + '\n' + 'Cancel: Revert to ' + wasval + ' UOM'
                ).replace(/UOM/g, thsdata.uom)
              );
              if (cfm === false) {
                jqThs.val(wasval);
                if (hadClass === false) {
                  jqThs.removeClass('uhspa-range-warn');
                }
                jqThs.trigger('change'); /* removing guard above may cause cancel loop */
              }
            }
            break;
          case 'soft' :
            jqThs.addClass('uhspa-range-warn');
            break;
          default :
            jqThs.removeClass('uhspa-range-warn');
            break;
        }
      }
    }
    /* ensure the blur call stack has completed before attempting to redraw */
    setTimeout(function () {
      me.draw();
    }, 3);
  });

  return box;
};
uhspa.tpnadvisor.prototype.ReferenceRangeArrayToObject = function (rangeArray) {
  /* start with an object containing the 6 normalcy thresholds set to empty objects */
  var rv = {
    contraints: 0,
    Feasible_Low: {},
    Critical_Low: {},
    Normal_Low: {},
    Normal_High: {},
    Critical_High: {},
    Feasible_High: {}
  };
  /* update the return with configured range info */
  if (rangeArray !== undefined && rangeArray.length > 0) {
    rv.contraints = rangeArray.length;
    rangeArray.forEach(function (range) {
      rv[range.THRESHOLD.replace(/\s/g, '_')] = range;
    });
  }
  /* give this object a convenience function for the caller */
  rv.check = uhspa.tpnadvisor.prototype.ReferenceRangeCheck.bind(rv);

  return rv;
};
uhspa.tpnadvisor.prototype.ReferenceRangeCheck = function (checkval) {
  var rv = { status: '', name: '', stop: '' };
  var message_template = 'The value of ENTRYVALUE UOM is SIDE the THRESHOLDNAME of THRESHOLDVALUE UOM';
  var exceeded = false;
  var range = this;

  rv.found = ([{ name: 'Feasible_Low', op: '<', stop: 'hard' },
    { name: 'Feasible_High', op: '>', stop: 'hard' },
    { name: 'Critical_Low', op: '<', stop: 'firm' },
    { name: 'Critical_High', op: '>', stop: 'firm' },
    { name: 'Normal_Low', op: '<', stop: 'soft' },
    { name: 'Normal_High', op: '>', stop: 'soft' }
  ]).some(function (dowhat) {
    var normalcyvalue = range[dowhat.name].VALUE;
    if (normalcyvalue !== undefined) {
      switch (dowhat.op) {
        case '<' : exceeded = checkval < normalcyvalue; break;
        case '>' : exceeded = checkval > normalcyvalue; break;
      }
      if (exceeded === true) {
        rv.status = message_template.replace(/ENTRYVALUE/g, checkval)
          .replace(/THRESHOLDNAME/g, dowhat.name.replace(/_/, ' '))
          .replace(/THRESHOLDVALUE/g, normalcyvalue)
          .replace(/SIDE/g, (dowhat.op === '<' ? 'below' : 'above'))
        ;
        rv.name = dowhat.name;
        rv.stop = dowhat.stop;
        return true; /* found it, .some() can be finished */
      }
    }
  });
  return rv;
};
uhspa.tpnadvisor.prototype.renderPatientInfo = function (cn, p) {
  var me = this;
  cn.html('');
  var jqUL = $('<ul>');

  var jqLI = $('<li class="allergy">'
              + '<dl>'
              + '<dt><h2>Allergies</h2></dt>'
              + '<dd class="allergy_data">'
              + '<span class="TBD">None Found</span>'
              + '</dd>'
              + '</dl>'
              + '</li>'
  )
    .appendTo(jqUL)
    .on('click'
      , function mpeAllergy(evt) {
        var viewname = me.pref('ALLERGY_VIEWNAME', '');
        if (viewname === '') {
          MPAGES_EVENT("ALLERGY"
            , me.getProperty('personId')
            + '|'
            + me.getProperty('encounterId')
            + '|0|0|||0||0|0'
          );
        }
        else {
          me.CCLNSW({
            reportName: 'mp_unified_driver',
            reportParams: [
              '^MINE^',
              me.getProperty('personId'),
              me.getProperty('encounterId'),
              me.getProperty('userId'),
              me.getProperty('positionCd'),
              me.getProperty('pprCd'),
              '^powerchart.exe^',
              '^^',
              '^' + viewname + '^'
            ]
          });
        }
        me.loadAllergy();
      }
    )
              ;
  me.loadAllergy();

  var jqLI = $('<li class="meds">'
              + '<dl>'
              + '<dt><h2>Active Medications</h2></dt>'
              + '<dd>'
              + $.map(me.data.RREC.PATIENTINFO.MEDS
                , function (obj, idx) {
                  if (obj.MNEMONIC !== '') {
                    return '<div title="' + obj.CLINICAL_DISPLAY + '">'
                        + '<strong>' + obj.MNEMONIC + '</strong>'
                        + '<span>' + obj.SIMPLIFIED_DISPLAY + '</span>'
                        + '</div>';
                  }
                }
              ).join('')
              + '</dd>'
              + '</dl>'
              + '</li>'
  )
    .appendTo(jqUL)
              ;

  var jqLI = $('<li class="labs">'
              + '<dl class="b3">'
              + '<dt><h2>Labs</h2></dt>'
              + '<dd>'
              + $.map(me.data.RREC.PATIENTINFO.LABS
                , function (obj) {
                  return '<span class="lab">'
                          + '<span class="nm">' + obj.DISPLAY + '</span>'
                          + '<span class="vl">' + '' + '</span>'
                          + '<span class="uom">' + '' + '</span>'
                          + '<span class="dt">' + '' + '</span>'
                          + '<span class="sparkline" data-esn="' + obj.EVENT_SET_NAME + '">'
                          + '{' + obj.EVENT_SET_NAME + '}'
                          + '</span>'
                          + '</span>'
                  ;
                }
              ).join('<br>')
              + '</dl>'
              + '</li>'
  )
    .appendTo(jqUL)
              ;

  jqUL.appendTo(cn);
};
uhspa.tpnadvisor.prototype.renderRoute = function (cn, p) {
  var me = this;
  cn.html('');

  var jqUL = $('<ul>');

  var jqLI = $('<li class="adms">'
              + '<dl>'
              + '<dt><h2>Administration Site</h2></dt>'
              + '<dd>'
              + '<span>'
              + '<input type="radio" id="' + me.id + 'adms_Cent" name="' + me.id + 'adms" value="Central" >'
              + '<label for="' + me.id + 'adms_Cent" >Central</label>'
              + '</span>'
              + '<br>'
              + '<span>'
              + '<input type="radio" id="' + me.id + 'adms_Peri" name="' + me.id + 'adms" value="Peripheral" >'
              + '<label for="' + me.id + 'adms_Peri" title="' + me.data.RREC.META.PERIPHERAL_OSMOLARITY_MAXIMUM + ' mOsm/L or less">Peripheral</label>'
              + '</span>'
              + '<br>'
              + '<br><span id="OsmoLabel"></span><span id="OsmoValue"></span>'
              + '</dd>'
              + '</dl>'
              + '</li>'
  )
    .appendTo(jqUL)
              ;

  var jqLI = $('<li class="sltn">'
              + '<dl>'
              + '<dt><h2>TPN Solution</h2></dt>'
              + '<dd>'
              + $.map(me.data.RREC.REQUESTABLE_list
                , function (obj, ix) {
                  var rv = '';
                  if (obj.DISPLAY != '') {
                    rv = '<span>'
                          + '<input type="radio" '
                          + 'id="' + me.id + 'adms_' + ix + '" '
                          + 'name="' + me.id + 'sltn" '
                          + 'value="' + ix + '" '
                          + ((obj.selected) ? 'checked="checked" ' : '')
                          + '>'
                          + '<label for="' + me.id + 'adms_' + ix + '" >'
                          + obj.DISPLAY
                            .replace(/^TPN /, '') /* remove needless prefix */
                            .replace(/\(Clinimix E?\)/, "Clinimix/E") /* remove parens, convey that "E" is optional */
                    //+ '<b style="float: right;" title="base osmolarity"> [' + ( me.data.RREC.PREMIXINFO_map[ obj.Standard.MNEMONIC ] ? me.data.RREC.PREMIXINFO_map[ obj.Standard.MNEMONIC ].BASE_OSMOLARITY : '0') + ']</b>'
                          + '</label>'
                          + '</span>'
                    ;
                  }
                  return rv;
                }
              ).join('')
              + '</dd>'
              + '</dl>'
              + '</li>'
  )
    .appendTo(jqUL)
    .on('click', 'input'
      , function (evt) {
        var jqTgt = $(evt.target);
        jqTgt.closest('span').find('input').prop('checked', true);
        var tix = jqTgt.val() || jqTgt.attr('data-tix');
        tix = parseInt(tix, 10);
        if (tix != 0) {
          me.setEditMode('Standard');
        }
        me.setByRequestable(tix);
        me.draw();
      }
    )
    ;

  var defaultADMS = me.appstate.IVAdminSite || 'Central';
  jqUL.find('.adms').find('input[value=' + defaultADMS + ']').prop('checked', true);

  jqUL.appendTo(cn);
};
uhspa.tpnadvisor.prototype.renderInfuse = function (cn, p) {
  var me = this;
  cn.html('');

  var oi = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW];

  var opHs = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23'
  ].map(function (el, idx) {
    return '<option value="' + el + '"'
                        + ((el == '21')
                          ? ' selected="selected" '
                          : ''
                        )
                        + '>'
                        + el
                        + '</option>';
  })
    .join('');
  var opMs = [
    '00',
    '15',
    '30',
    '45'
  ].map(function (el, idx) {
    return '<option value="' + el + '">' + el + '</option>';
  })
    .join('');

  if (true /* different input options */) {
    var admixture = me.pref('ADMIXTURE_DEFAULT', '2:1');
    if (oi.ORDERID > 0) {
      if (oi.SEPARATELIPID === 1) {
        admixture = '2:1';
      }
      else {
        admixture = '3:1';
      }
    }

    var orderStart =
        oi.ORDERINFUSESTART == ''
          ? me.pref('ORDERSTART_DEFAULT', '2100')
          : oi.ORDERINFUSESTART.replace(/\D/g, '')
      ;
    var tpninfusehours =
        parseFloat(oi.ORDERINFUSEOVER) === 0
          ? me.pref('TPNINFUSEOVER_DEFAULT', '24')
          : oi.ORDERINFUSEOVER
          ;
    tpninfusehours = (tpninfusehours > 24 ? 24 : tpninfusehours);
    var lipidinfusehours =
        parseFloat(oi.ORDERLIPIDINFUSEOVER) === 0
          ? me.pref('LIPIDINFUSEOVER_DEFAULT', '24')
          : oi.ORDERLIPIDINFUSEOVER
          ;
    lipidinfusehours = (lipidinfusehours > 24 ? 24 : lipidinfusehours);

    $('<span class="uhspa-reqstart">'
    + '<label>Order starts at '
    + '<input type="number" class="uhspa-reqstart-time" value="' + parseFloat(orderStart) + '" />'
    + '</label>  '
    + '</span>'
    + '<span class="uhspa-tpninfuseover">'
    + '<label>and infuses over '
    + '<input type="number" class="uhspa-tpninfuse-hours" value="' + parseFloat(tpninfusehours) + '" />'
    + '</label> hours. '
    + '</span>'
    + '<span class="uhspa-lipidinfuse" >'
    + '<label>'
    + '<span>' + me.pref('SeparateLipidOrder_LabelText', 'Infuse separate lipid order') + ' </span>'
    + '<input type="checkbox" class="uhspa-infuse-lipid-cb" '
    + (admixture === '2:1' ? 'checked="checked" ' : '')
    + '/>'
    + '</label>'
    + '</span>'
    + '<span class="uhspa-lipidinfuseover">'
    + '<label> over '
    + '<input type="number" class="uhspa-lipidinfuse-hours" value="' + parseFloat(lipidinfusehours) + '" />'
    + '</label> hours. '
    + '</span>'
    )
      .appendTo(cn)
      .on('change', 'input', function (evt) {
        var comp = $(me.getTarget());
        var tgt = $(evt.target);
        var sv = tgt.val();
        var v = parseFloat(sv);
        if (tgt.hasClass('uhspa-infuse-lipid-cb')) {
          me.admixtureresetview();
        }
        if (tgt.hasClass('uhspa-reqstart-time')) {
          if ((/[^0-9]/).test(sv)
          || v < 0
          || v > 2400
          || v % 100 > 59
          ) {
            tgt.val(orderStart);
          }
        }
        if (tgt.hasClass('uhspa-tpninfuse-hours')) {
          if ((/[^0-9\.]/).test(sv)
          || v <= 0
          || v > 24
          ) {
            tgt.val(tpninfusehours);
          }
        }
        if (tgt.hasClass('uhspa-lipidinfuse-hours')) {
          if ((/[^0-9\.]/).test(sv)
          || v <= 0
          || v > 24
          ) {
            tgt.val(lipidinfusehours);
          }
        }
        me.draw();
      });

    me.admixtureresetview();
  }
};
uhspa.tpnadvisor.prototype.admixtureresetview = function () {
  try {
    var me = this;
    var comp = $(me.getTarget());
    var cb = $('.uhspa-infuse-lipid-cb');
    var lipidinfuseover = cb.closest('div').find('.uhspa-lipidinfuseover');
    if (cb.is(':checked')) {
      comp.addClass('adm21').removeClass('adm31');
      lipidinfuseover.show();
    }
    else {
      comp.removeClass('adm21').addClass('adm31');
      lipidinfuseover.hide();
    }
  }
  catch (err) {
    alert(err.description);
  }
};
uhspa.tpnadvisor.prototype.renderDosingWeight = function (cn, p) {
  var me = this;
  cn.html('');

  /* dose weight is frequently updated for NEO but for adults is a rarely-changing number */
  var doseWTKG = me.data.RREC.PATIENTINFO.DOSEWEIGHTKG;
  var doseweightdttm = new Date();
  if (me.data.RREC.PATIENTINFO.DOSEWEIGHTKGDTTM) {
    doseweightdttm.setISO8601(me.data.RREC.PATIENTINFO.DOSEWEIGHTKGDTTM);
  }

  /* start with weight that was ordered */
  var newval = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDOSEWEIGHTKG;
  var orderDatetime = new Date();
  if (me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDTTM) {
    orderDatetime.setISO8601(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDTTM);
  }

  /* ... so[/but] if the dose weight is newer than the weight that was/is on the order */
  if (doseweightdttm > orderDatetime
    || me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDTTM == me.strCernerEmptyDate
  ) {
    switch (me.pref('ON_NEWER_DOSE_WEIGHT', 'RESET')) {
      case 'ASK' :
        var msg = 'New Dose Weight Available'
              + '\n'
              + '\n' + (doseWTKG || 0) + ' kg charted on ' + (me.fmtDate(doseweightdttm, 'read') || '')
              + '\n' + (newval || 0) + ' kg ordered on ' + (me.fmtDate(orderDatetime, 'read') || '')
              + '\n'
              + '\n' + 'Reset TPN dose weight?'
              ;
        if (newval > 0 && confirm(msg)) {
          newval = 0;
        }
        break;
      case 'IGNORE' :
        break;
      case 'RESET' : /* falls through */
      default :
        newval = 0;
        break;
    }
  }

  var noteArray = [];
  var twd = (me.pref('TPN_WEIGHT_DISPLAY', 'NONE')).toUpperCase();
  switch (twd) {
    case 'IBWTPN' :
      var IBW = ({
        Male: 50,
        Female: 45.5
      })[me.data.RREC.PATIENTINFO.GENDER]; /* gender base... */
      /* 20170515msd if height is greater than 5 feet add 2.3kg per inch */
      if (me.data.RREC.PATIENTINFO.HEIGHTCM > 60 * 2.54) {
        var IBW = IBW
              + (2.3 /* plus additional kg per ... */
                * ((me.data.RREC.PATIENTINFO.HEIGHTCM / 2.54) /* inches ... */
                  - (5 * 12) /* over five feet */
                )
              );
      }
      var TPNDW = (0.25 * (doseWTKG - IBW)) + IBW;

      if (newval == 0) {
        if (doseWTKG > (IBW * 1.2)) {
          /* patient weight exceeds 20% over the IBW */
          newval = TPNDW;
        }
        else {
          /* else if doseWTKG is more than IBW */
          if (doseWTKG > IBW) {
            /* use IBW */
            newval = IBW;
          }
          else {
            /* use the doseWTKG (as of 20151106) */
            newval = doseWTKG;
          }
        }
      }

      var hilightIBW = me.maxP(IBW, me.precision['kg']) == me.maxP(newval, me.precision['kg']);
      var hilightTPNDW = me.maxP(TPNDW, me.precision['kg']) == me.maxP(newval, me.precision['kg']);

      noteArray = [{
        text:
                      ((hilightIBW) ? '<strong>' : '')
                    + 'Ideal Body Weight (devine) - ' + me.maxP(IBW, me.precision['kg']) + ' kg'
                    + ((hilightIBW) ? '</strong>' : '')
                    + '<br>'
                    + '<span class="vsm">Males: IBW(kg) = 50kg + 2.3kg for each inch over 5 feet</span><br>'
                    + '<span class="vsm">Females: IBW(kg) = 45.5kg + 2.3kg for each inch over 5 feet</span><br>'
      },
      {
        text:
                      ((hilightTPNDW) ? '<strong>' : '')
                    + 'TPN Dosing Weight - ' + me.maxP(TPNDW, me.precision['kg']) + ' kg'
                    + ((hilightTPNDW) ? '</strong>' : '')
                    + '<br>'
                    + '<span class="vsm">(ABW - IBW x 0.25) + IBW</span>'
      }
      ];
      break;
    case 'NONE' :
    case 'BIRTHWEIGHT' :
    default :
      if (newval == 0) {
        newval = doseWTKG;
      }
      noteArray = [{
        text: 'Dose Weight: ' + me.maxP(doseWTKG, me.precision['kg']) + ' kg (' + me.fmtDate(doseweightdttm, 'read') + ')'
      }];
      if (twd == 'BIRTHWEIGHT') { /* CD-1894 */
        var birthweightkg = me.data.RREC.PATIENTINFO.BIRTHWEIGHTKG;
        if (birthweightkg > 0) {
          var birthweightdttm = new Date();
          birthweightdttm.setISO8601(me.data.RREC.PATIENTINFO.BIRTHWEIGHTKGDTTM);
          noteArray.push({
            text: 'Birth Weight: ' + me.maxP(birthweightkg, me.precision['kg']) + ' kg (' + me.fmtDate(birthweightdttm, 'read') + ')'
          });
        }
      }
      break;
  }

  var a = [{
    name: 'TPN Dosing Weight',
    display: 'TPN Dosing Weight',
    equiv: [],
    mnemonic: 'doseweightkg',
    keyname: 'DoseWeightKg',
    editmode: 'None',
    css: 'doseweightkg',
    ingredient: false,
    note: noteArray,
    uom_disp: 'kg',
    oldvalue: me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM].ORDERDOSEWEIGHTKG,
    newvalue: newval,
    labs:
              [{
                DISPLAY: "Daily Weight",
                EVENT_SET_NAME: 'TPN Weight',
                GRAPH: 1
              }
              ]
  }
  ];

  var ingWeight = me.data.RREC.INGREDIENT_map['Weight'];
  if (ingWeight !== undefined) {
    ingWeight.name = 'TPN Dosing Weight';
    ingWeight.display = ingWeight.DISPLAY;
    ingWeight.equiv = [];
    ingWeight.mnemonic = ingWeight.MNEMONIC;
    ingWeight.keyname = 'DoseWeightKg';
    ingWeight.editmode = 'None';
    ingWeight.css = 'doseweightkg';
    ingWeight.ingredient = false;
    ingWeight.note = noteArray.concat(ingWeight.NOTE);
    ingWeight.uom_disp = me.getCode('54_kg').DISPLAY;
    ingWeight.oldvalue = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM].ORDERDOSEWEIGHTKG;
    ingWeight.newvalue = newval;
    ingWeight.labs = ingWeight.LABS;
    /* overwrite a */
    a = [ingWeight];
  }

  var jqUL = $('<ul class="ing" >');
  $.each(a
    , function (ix, obj) {
      var jqLI = $('<li class="' + (p.css || '') + '">').appendTo(jqUL);
      jqLI.append(me.ingredientUI.apply(me, [obj]));
    }
  );

  jqUL.appendTo(cn);
};
uhspa.tpnadvisor.prototype.renderVolumeEnergy = function (cn, p) {
  var me = this;
  cn.html('');
  var volIng = me.data.RREC.INGREDIENT_map['Volume'];
  var eIng = me.data.RREC.INGREDIENT_map['Energy'];

  var a = [{ keyname: 'Volume', ingredient: false },
    { keyname: 'Fat' },
    { keyname: 'Protein' },
    { keyname: 'Carbohydrates' },
    {
      keyname: 'TotalEnergy',
      display: 'Energy (Kcal/day)',
      note: eIng.NOTE,
      uom_disp: 'Kcal/kg/day',
      oldvalue: 0,
      newvalue: 0,
      readonly: true
    }
  ];

  var jqUL = $('<ul class="ing ' + (p.css || '') + '" >');

  $.each(a
    , function (ix, obj) {
      var jqLI = $('<li class="' + (obj.css || '') + ' ' + (obj.keyname || '') + '">')
        .appendTo(jqUL)
        ;
      var bxCN = me.ingredientUI.apply(me, [obj]);

      switch (obj.keyname) {
        case 'Volume' :
          $('<label class="minvol">Est. Minimum Volume: <span>?</span> mL/kg/day '
            + '<input type="checkbox" '
            + (me.appstate && me.appstate.minvol_checked
              ? 'checked="checked" '
              : ''
            )
            + 'value="1" />'
            + '</label>'
          )
            .appendTo(bxCN[0])
            .on('click', 'input', function (evt) {
              var volkg = me.getObject('VolumePerKG');
              var checked = $(evt.target).prop('checked');
              if (checked) {
                volkg.addClass('uhspa-disabled');
                me.draw();
              }
              else {
                volkg.removeClass('uhspa-disabled');
              }
            })
          ;
          var volUI = bxCN[1].find('input[data-keyname=Volume]');
          if (me.appstate && me.appstate.minvol_checked) { /* if the minvol checkbox is checked */
            /* ..disable the volume input */
            volUI.addClass('uhspa-disabled');
          }
          else {
            /* ..enable the volume input */
            volUI.removeClass('uhspa-disabled');
          }
          break;
        case 'TotalEnergy' :
          var DWKG = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM].ORDERDOSEWEIGHTKG;
          /* sum Kcal/day of macronutrients */
          var sumkcal = 0;
          $.each([
            'Carbohydrates',
            'Protein',
            'Fat'
          ], function (ingkeynameix, ingkeyname) {
            sumkcal += me.kcalgm[ingkeyname] * me.data.RREC.INGREDIENT_map[ingkeyname].OLDVALUE * DWKG;
          });

          $(bxCN[2]).find('.vl').text(me.maxP((sumkcal / DWKG || 0), 0));

          bxCN[3] = $('<table class="sumform">'
                    + '<caption>Formulation provides:</caption>'
                    + '<tr class="fat">'
                    + '<th>Fat</th>'
                    + '<td><span class="pcnt">NNN</span>%</td>'
                    + '<td><span class="kcd">NNN</span>Kcal/day</td>'
                    + '<td><span class="kckgd">NN</span>Kcal/kg/day</td>'
                    + '</tr>'
                    + '<tr class="protein">'
                    + '<th>Protein</th>'
                    + '<td><span class="pcnt">NNN</span>%</td>'
                    + '<td><span class="kcd">NNN</span>Kcal/day</td>'
                    + '<td><span class="kckgd">NN</span>Kcal/kg/day</td>'
                    + '</tr>'
                    + '<tr class="carbohydrates">'
                    + '<th>Carbohydrates</th>'
                    + '<td><span class="pcnt">NNN</span>%</td>'
                    + '<td><span class="kcd">NNN</span>Kcal/day</td>'
                    + '<td><span class="kckgd">NN</span>Kcal/kg/day</td>'
                    + '</tr>'
                    + '<tr class="total">'
                    + '<th>Total</th>'
                    + '<td><span class="pcnt"></span></td>'
                    + '<td><span class="kcd">3NNN</span>Kcal/day</td>'
                    + '<td><span class="kckgd">3NN</span>Kcal/kg/day</td>'
                    + '</tr>'
                    + '</table>'
          );
          break;
      }

      jqLI.append(bxCN);
    }
  );

  jqUL.appendTo(cn);
  cn.on('change', 'input.ingredient'
    , function (evt) {
      me.draw();
    }
    //me.draw.apply(me,[]); }
  );
};
uhspa.tpnadvisor.prototype.renderElectrolyte = function (cn, p) {
  var me = this;
  cn.html('');
  var a = [{ keyname: 'Potassium', ingredient: true },
    { keyname: 'Sodium', ingredient: true },
    { keyname: 'Calcium', ingredient: true },
    { keyname: 'Magnesium', ingredient: true },
    { keyname: 'Phosphate', ingredient: true },
    { keyname: 'Chloride', ingredient: true },
    { keyname: 'Acetate', ingredient: true }
  ];

  var jqUL = $('<ul class="ing" >');

  $.each(a
    , function (ix, obj) {
      var jqLI = $('<li class="' + obj.keyname + ' ' + (obj.css || '') + '">').appendTo(jqUL);
      var bxCN = me.ingredientUI.apply(me, [obj]);
      jqLI.append(bxCN);
    }
  );

  jqUL.appendTo(cn);

  /* reset the preference drop-down */
  jqUL.find('.prefKNa select').val(me.EfromS('prefKNa', 'NEWVALUE'));

  /* reset the CL:Ac drop-down */
  var r = me.EfromS('ratioCLAc', 'NEWVALUE');
  jqUL.find('.ratioCLAc').val(r);
  if (r == '') {
    var ch = me.EfromS('Chloride', 'NEWVALUE');
    var ac = me.EfromS('Acetate', 'NEWVALUE');
    var setwhat = ''; /* i don't know yet */
    if (setwhat === '' && ch <= 0) {
      setwhat = 'ch';
    }
    if (setwhat === '' && ac <= 0) {
      setwhat = 'ac';
    }
    if (setwhat === '' && ch > ac) {
      setwhat = 'ch';
    }
    if (setwhat === '' && ch < ac) {
      setwhat = 'ac';
    }

    if (setwhat === 'ch') {
      var obj1 = me.getObject('Chloride');
      var obj2 = me.getObject('Acetate');
      var setval = ch;
    }
    else {
      var obj1 = me.getObject('Acetate');
      var obj2 = me.getObject('Chloride');
      var setval = ac;
    }
    setval = ((/\/kg/).test(obj1.data('uom'))
      ? setval / me.getValue('DoseWeightKG')
      : setval
    );
    obj1.val(me.maxP(setval, obj1.data('precision')));

    obj1.closest('li').find('[value=Custom]').prop('checked', true);
    obj2.find('[value=ToBalance]').prop('checked', true);
  }

  jqUL.on('click', 'input.v,input[value=ToBalance],input[value=Custom]'
    , function (evt) {
      if ($(this).closest('li').hasClass('Chloride')) {
        jqOther = jqUL.find('.Acetate');
      }
      else {
        jqOther = jqUL.find('.Chloride');
      }
      jqOther.find('input[value=ToBalance]').prop('checked', true);
      jqOther.find('select option[value=per]').attr('selected', true);
      jqOther.find('input.v').val('');
    }
  );
};
uhspa.tpnadvisor.prototype.renderAdditive = function (cn, p) {
  var me = this;
  cn.html('');

  var jqUL = $('<ul id="section_additives" class="ing " >');
  var cntAdditive = 0;
  var injectPTC = me.pref('PRETERMTRACECOMBO', 'NO') === 'YES';
  me.data.RREC.INGREDIENT.forEach(function (ing) {
    if (ing.TYPE === "Additive" && ing.VVIN === 1) {
      cntAdditive++;
      $('<li class="' + (p.css || '') + '">')
        .appendTo(jqUL)
        .append(
          me.ingredientUI.apply(me, [{
            keyname: ing.KEYNAME,
            ingredient: true
          }])
        )
      ;
      if (injectPTC === true && (/Trace/i).test(ing.DISPLAY)) {
        cntAdditive++;
        $('<li class="' + (p.css || '') + '">')
          .appendTo(jqUL)
          .append(
            me.ingredientUI.apply(me, [{
              keyname: 'PretermTraceCombo',
              ingredient: true
            }])
          )
        ;
      }
    }
  });

  jqUL
    .appendTo(cn)
  ;

  $('<p>Other Additives:</p>').appendTo(cn);
  $('<textarea id="' + me.id + 'OtherAdditive">'
    + ((me.appstate && me.appstate.OtherAdditives /* there exists appstate and appstate has OtherAdditives */
      && me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ADMINISTEREDDTTM === me.strCernerEmptyDate /* the new/current order has not been administered */
      && me.hoursdiff(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDTTM) < 24 /* and the new/current order is less than 24 hours old */
    )
      ? me.appstate.OtherAdditives
      : ''
    )
    + '</textarea>').appendTo(cn);
};
uhspa.tpnadvisor.prototype.renderOrderComment = function (cn, p) {
  var me = this;
  cn.html('');
  $('<p>Non-Lipid Order Comments:</p>').appendTo(cn);
  $('<textarea id="' + me.id + 'OrderComment" class="nonlipid">'
  + ((me.appstate && me.appstate.UserOrderComments /* there exists appstate and appstate has UserOrderComments */
      && me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ADMINISTEREDDTTM === me.strCernerEmptyDate /* the new/current order has not been administered */
      && me.hoursdiff(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDTTM) < 24 /* and the new/current order is less than 24 hours old */
  )
    ? me.appstate.UserOrderComments
    : ''
  )
  + '</textarea>').appendTo(cn);

  $('<p>Lipid Order Comments:</p>').appendTo(cn);
  $('<textarea id="' + me.id + 'LipidOrderComment" class="lipid">'
  + ((me.appstate && me.appstate.LipidOrderComments /* there exists appstate and appstate has LipidOrderComments */
      && me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ADMINISTEREDDTTM === me.strCernerEmptyDate /* the new/current order has not been administered */
      && me.hoursdiff(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERDTTM) < 24 /* and the new/current order is less than 24 hours old */
  )
    ? me.appstate.LipidOrderComments
    : ''
  )
  + '</textarea>').appendTo(cn);
};
uhspa.tpnadvisor.prototype.renderAddOrder = function (cn, p) {
  var me = this;
  cn.html('');

  var jqLab =
    $('<dl class="lab">'
      + '<dt><h2></h2></dt>'
      + '<dd></dd>'
      + '</dl>'
    );

  var jqUL = $('<ul class="laborder">');

  $.each(me.data.RREC.MP_ORDERABLE, function (ix, obj) {
    //if( obj.TYPE == 'Laboratory' ){
    $('<li>'
        + '<label for="' + me.id + obj.NAME + '">'
        + '<input '
        + 'type="checkbox" '
        + 'id="' + me.id + obj.NAME + '" '
        + 'value="' + obj.ORDERACTION + '" '
        + 'data-mnemonic="' + obj.MNEMONIC + '" '
        + 'data-osdline="' + obj.DISPLAYLINE + '" '
        + '/>'
        + '<span class="mnemonic">'
        + obj.MNEMONIC + ' '
        + '</span>'
        + '<span class="display">'
        + obj.DISPLAYLINE
        + '</span>'
        + '<label>'
        + '</li>'
    ).appendTo(jqUL);
    //  }
  });
  jqUL.appendTo(jqLab.find('dd'));
  jqLab.appendTo(cn);
};
uhspa.tpnadvisor.prototype.renderFooter = function (p) {
  var me = this;
  var cn = p.parent; /* no newSection, this IS the content area */

  me.isPhysician = (me.data.RREC.META.PHYSICIAN_IND == 1);

  if (me.isPhysician) {
    cn.addClass('physician');
  }
  if (me.data.RREC.META.CANSIGN === 1) {
    $('<div class="comtypcd">'
        + '<label>Communication Type: '
        + '<select class="communicationtypecd">'
        + '<option value=""></option>'
        + ((me.data.RREC.MODEL_CODE.length > 0 && me.data.RREC.MODEL_CODE_name['ORDERTYPE'].VALUE.length > 0)
          ? $.map(me.data.RREC.MODEL_CODE_name['ORDERTYPE'].VALUE_display, function (cnobj, cnidx) {
            return '<option '
                          + 'value="' + cnobj.VALUEID + '" '
                          + ((me.isPhysician
                                && cnobj.DISPLAY === me.pref('ORDERTYPE_DISPLAY_PHYSICIAN', 'Written')
                          )
                            ? 'selected="selected" '
                            : ''
                          )
                          + '>'
                          + cnobj.DISPLAY
                          + '</option>'
            ;
          }).join('')
          : '<option value="">Configuration Error: ORDERTYPE_DISPLAY</option>'
        )
        + '</select>'
        + '</label>'
        + '</div>'
    ).appendTo(cn);
  }

  var cxl = $('<button id="footercancelbutton" title="Quit Advisor" class="cxl">Cancel</button>').appendTo(cn);
  if (me.data.RREC.META.PROPOSALDATA !== "") {
    var rej = $('<button id="footerrejectbutton" title="Reject existing proposal, Reload" class="reject">Reject</button>').appendTo(cn);
  }
  if (me.data.RREC.META.CANPROPOSE === 1) {
    var prp = $('<button id="footerproposebutton" title="Propose now, Sign later" class="propose">Propose</button>').appendTo(cn);
  }
  if (me.data.RREC.META.CANSIGN === 1) {
    var ats = $('<button id="footersignbutton" title="Create TPN Order" class="add">Sign</button>').appendTo(cn);
  }

  cn.on('click', 'button', function (evt) {
    me.DWmsg.close_action = evt.target.className;
    switch (evt.target.className) {
      case 'add' :
        me.save(me.close);
        break;
      case 'propose' :
        me.propose(me.close);
        break;
      case 'reject' :
        me.reject(function () {
          window.location = window.location.href.split('#')[0];
        });
        break;
      default :
        me.close();
        break;
    }
  });
};
uhspa.tpnadvisor.prototype.renderNoMode = function (p) {
  var me = this;
  var cn = p.parent;

  var nm = $('<div class="uhspa-tpn-nomode">');

  $('<p title="Check Order Catalog Build and Virtual View settings">'
    + '<b>' + me.data.RREC.META.MODEPRODUCTMNEMONIC + '</b>'
    + ' is not available at '
    + '<b>' + me.data.RREC.PATIENTINFO.LOC_FACILITY_NAME + '</b>'
    + '</p>'
    + '<br>'
    + '<button>Close</button>'
  ).appendTo(nm);

  nm.on('click', 'button', function (evt) {
    me.close();
  });

  //$('<textarea style="width: 100%; height: 500px;">').text( JSON.stringify( me.data.RREC.PATIENTINFO,undefined,2 )).appendTo(nm);


  nm.appendTo(cn);
};
uhspa.tpnadvisor.prototype.close = function () {
  var me = this;

  /* send the DWmsg to the DW */
  me.sendDWmsg().then(function (p) {
    /* if there was any other checking to be done before a 'proper' close, put it in here */
    switch (me.getProperty('rule_action')) {
      case 'ORDER' : /* that means EKSReply needs to kill the 'TPN Advisor' patient care orderable that evoked this advisor */
      case 'CANCELREORDER' :
        try {
          var myEKSReply = new EksReply();
          if (myEKSReply.setup) {
            myEKSReply.setup(1); /* cancel the incoming order */
          }
          else {
            myEKSReply.setScratchPadChangeInd(1);
            myEKSReply.setCancelOrder(99);
            var sp = myEKSReply.getScratchPad();
            if (sp) {
              sp.setActionFlag(1); /* cancel the order */
            }
          }
          CCLEVENT("EVENT_EKS_REPLY", myEKSReply.toXML()); /* send the request */
          CCLEVENT("EVENT_EKS_OK", ""); /* request to close window */
        }
        catch (err) { /* no EKS conversation or conversation attempt failed, just close the window */
          var forceClose = true;
        }
        break;

      case 'MODIFY' :
        /* there is a possibility that we're actively editing the current orderable,
          and the modify action is only detectable by a SignOrder event, so EKSReply isn't a thing anyway
          */
        CCLEVENT("EVENT_EKS_OK", ""); /* request to close window */
        break;

      case '@MESSAGE:[RULE_ACTION]' :
      default : /* if not in Advisor.. or any other mode/value */
        var forceClose = true;
    }

    if (forceClose) {
      try {
        CCLEVENT("EVENT_EKS_OK", ""); /* request to close window (blindly try) */
      }
      catch (err) {}
      window.open('', '_self', ''); /* IE silliness */
      window.close(); /* buh-bye */
    }
  });
};
uhspa.tpnadvisor.prototype.sendDWmsg = function () {
  var me = this;
  /* get a jquery deferred object, which is like-a-promise */
  var dfd = $.Deferred();
  /* mark the end time of this advisor/form/data entry session */
  me.DWmsg.advisor_close = Date.now();
  /* get the url/uri of the place to send the DWmsg */
  var url = String(me.pref('DataWarehouseWebserviceURL', ''));
  /* if it's blank */
  if (url === '') {
    /* resolve the deferred with false because there's nothing to do but we know someone is waiting for a resolution */
    dfd.resolve(false);
  }
  else { /* url is not blank */
    /* if the protocol part of the url begins with http (includes https) */
    if ((/^http/i).test(url)) {
      /* use jquery .post to send DWmsg to the url */
      $.post(url, JSON.stringify(me.DWmsg))
        .then(function (p) {
          /* resolve the pending deferred with whatever the $.post() promise-result returns */
          dfd.resolve(p);
        })
        .fail(function (p) {
          /* resolve the pending deferred with false, too bad it failed but it's not important enough to do anything */
          dfd.resolve(false);
        })
      ;
    } /* not http*, so check if url begins with ccl */
    else if ((/^ccl/i).test(url)) {
      /* strip ccl:// and .prg from url, call the resulting program with standard mpage prompts and blob_in as serialized DWmsg */
      me.loadCCLwithBlob(
        url.replace(/^ccl:\/\/|\.prg$/gi, ''),
        [
          me.getProperty('personId'),
          me.getProperty('encounterId'),
          me.getProperty('userId'),
          me.getProperty('positionCd'),
          me.getProperty('pprCd')
        ],
        function (d) {
          /* resolve the pending deferred with the data returned from the ccl */
          dfd.resolve(d);
        },
        'JSON',
        JSON.stringify(me.DWmsg)
      );
    }
    else {
      /* malformed url does not start with either http or ccl, so just resolve the pending deferred with false and move on */
      dfd.resolve(false);
    }
  }
  /* immediately return a .promise() associated with the deferred that the caller can use as .then()able */
  return dfd.promise();
};
uhspa.tpnadvisor.prototype.setByRequestable = function (tix) {
  var me = this;

  if (tix == 0) {
    var ixWas = $('.sltn input:checked').eq(0).attr('value');
    $('.sltn input[value=' + tix + ']').prop('checked', true);

    /* 20160606msd */
    if (ixWas != 0 || me.EditMode != 'Compound') {
      $('input[value=ToBalance]').prop('checked', true);
      var Chloride = me.getObject('Chloride');
      Chloride.val('');
      var Acetate = me.getObject('Acetate');
      Acetate.val('');
    }
    /* /20160606msd */

    me.setEditMode('Compound');
  }
  else {
    var req = me.data.RREC.REQUESTABLE_list[tix][me.EditMode];
    if (!req) {
      me.setByRequestable(0);
    }
    else {
      var DW_kg = me.getValue('DoseWeightKG');

      var reqmap = req.INGREDIENT_map;
      var PMI = me.data.RREC.PREMIXINFO_map[req.MNEMONIC];

      var tVol = me.getValue('TotalVolume');
      var nlVol = me.getValue('NonLipidVolume');

      var calcVol = nlVol; /* start with non-lipid volume */

      var objFat = me.getObject('Fat');
      if (PMI !== undefined) {
        var fatIng = PMI.INGREDIENT_map['Fat'];
        /* if fat/lipid is an ingredient in the premix, use "per Total Volume" calculation */
        if (fatIng !== undefined) {
          calcVol = tVol;
          objFat.closest('dl').removeClass('None').addClass('Compound');
          objFat.attr('data-editmode', 'Compound');
        }
        else {
          calcVol = nlVol;
          objFat.closest('dl').removeClass('Compound').addClass('None');
          objFat.attr('data-editmode', 'None');
        }
      }

      /* 20160506 msd - while trying to understand wth is going on here, i figured i'd leave a comment to my future self (or whatever poor soul is reading this)
        the REQuestable.ingredient_MAP contains details about the ingredients in the given requestable
        for "compound" aka 'full custom' aka 'not premix' this is the place for details: all ingredients' uom (important stuff) and probably 0 amounts
        for "clinimix w/ Custom Electrolytes" the macronutrients are part of the mix and are not configured as line item ingredients
        for "clinimix w/ Standard Electrolytes" the macro AND electrolytes are in the mix so are not configured as line item ingredients
        So how do we express to the user what amount of 'stuff' is in the premixes?  PREMIXINFO_map[ mnemonic ]  (PMI = PreMixInfo)
        use PMI[ keyname ] for 'thisIng' because it's the details hidden in the mix

        So for each dom object with a class of 'ingredient'
          - initialize vl variable to zero, get jqObj dom reference, and retrieve the 'keyname' from that object
          - figure out (see comments above) where to get information about the ingredient jqObj references
          - update the vl variable via a poorly-named function (because it's being called even if the ingredient isn't IN a premix, but whatever)
          - figure out display precision (it is what it is; and yeah it is suboptimal hackery)
          - based on editmode, update the dom element via jquery .val() setter  (or don't)
          - draw() the screen again to update all the alternate uom presentations/etc.
      */
      /* 20160506 msd - now that the above is said (how it "worked") I have to introduce support for STHS "TPN Renal"
        it's not a premix in the sense that it's clinimix or some other manufactured product
        it is a premix in the sense that it has a fixed concentration
        unlike our original assumptions about clinimix containing no lipids, this "Texas Renal Ale" (h/t Dr.Reddy) does contain lipid
          - So now we have to decide if the premix contains fat/lipid, use the total volume but if not containing fat use the non-lipid volume
      */
      $('.ingredient').each(
        function (ix, el) {
          var jqObj = $(el);
          var keyname = jqObj.attr('data-keyname');
          var vl = 0; /* default to zero */

          //jqObj.val( vl );

          /* 20160513 msd it used to check first for the reqmap, then go to premix... but i think it makes more sense to check premix info first
              we control the premix info config, so it's more likely to be "right" (for some definition of right) than pharmacy build of IV set
              (I know that doesn't sound like it should be true, but it's part of the curse of TPN)
            */
          if (PMI) {
            var thisIng = PMI.INGREDIENT_map[keyname];
          }
          else {
            if (reqmap /* map exists */
                && keyname /* we have a valid keyname */
                && reqmap[keyname] /* and this keyname is in the map */
                /* consider: "compound", the only place to find 'thisIng' is in the reqmap */
            ) {
              var thisIng = reqmap[keyname];
            }
          }

          if (thisIng) {
            vl = me.computePremixAmount(thisIng, DW_kg, calcVol);
          }

          if (false && (tVol > 0 || nlVol > 0)) {
            alert(
              'DW_kg: ' + DW_kg
  + '\n' + 'tVol: ' + tVol
  + '\n' + 'nlVol: ' + nlVol
  + '\n' + 'keyname: ' + keyname
  + '\n' + 'vl: ' + vl
  + '\n' + 'calcVol: ' + calcVol
  + '\n' + 'thisIng:\n' + JSON.stringify(thisIng)
            );
          }

          switch (keyname) {
            case 'Fat' :
            case 'Protein' :
            case 'Carbohydrates' :
              var ingPrec = me.precision['macro'];
              break;
            case 'Potassium' :
            case 'Sodium' :
            case 'Calcium' :
            case 'Magnesium' :
            case 'Phosphate' :
            case 'Chloride' :
            case 'Acetate' :
              var ingPrec = me.precision['micro'];
              break;
            default :
              var ingPrec = me.precision['default'];
              break;
          }

          if (me.EditMode == 'Standard') {
            if (jqObj.attr('data-editmode') == 'None') { /* don't overwrite */ }
            else {
              jqObj.val(me.maxP(vl, ingPrec));
            }

            switch (keyname) {
              case 'Chloride' :
              case 'Acetate' :
                jqObj.val(''); /* prevent this from being visible, despite being known */
                jqP = jqObj.closest('li');

                if (vl > 0) {
                  jqP.find('input[value=Custom]').prop('checked', true);
                  jqObj.val(me.maxP(vl, ingPrec));
                  me.getObject('ratioCLAc').val('');
                }
                else {
                  jqP.find('input[value=ToBalance]').prop('checked', true);
                }

                //jqP.find('select option[value=per]').attr('selected',true);


                break;
            }
          }
          if (me.EditMode == 'Custom') {
            if (keyname == 'Protein'
                || keyname == 'Carbohydrates'
            ) {
              jqObj.val(me.maxP(vl, ingPrec));
            }
          }
        }
      );
    }
  }
  me.draw();
};
uhspa.tpnadvisor.prototype.setEditMode = function (p) {
  /* p = 'Standard','Custom','Compound'
  maybe these should not be passed straight through but instead be enumeration of modes or such... *shrug*
  */
  var me = this;
  if (p == 'None') { /* don't change mode */ }
  else {
    me.EditMode = p;

    var jqTgt = $(me.getTarget());
    jqTgt
      .removeClass(me.className + '_Standard')
      .removeClass(me.className + '_Custom')
      .removeClass(me.className + '_Compound')
      .addClass(me.className + '_' + p)
    ;
    /* 20151119msd flex based on facility in custom code set TPNPremixNoAdditive */
    if (me.data.RREC.META.TPNPREMIXNOADDITIVE == 1) {
      /* 20150702msd hide the additives when the edit mode is not Compound */
      if (p == 'Compound') {
        $('section.additive').show();
      }
      else {
        $('section.additive').hide().find('input').val(0);
      }
    }

    if (me.EditMode === 'Standard') {
      me.getObject('minvol').find('input').prop('checked', false);
      me.getObject('VolumePerKG').removeClass('uhspa-disabled');
      me.getObject('minvol').hide();
      me.getObject('prefProtein').hide();
    }
    else {
      me.getObject('minvol').show();
      me.getObject('prefProtein').show();
    }
  }
};
uhspa.tpnadvisor.prototype.canSave = function () {
  var me = this;
  var rv = true;

  var jqDW_kg = me.getObject('DoseWeightKG');
  if (parseFloat(jqDW_kg.val()) == 0 || jqDW_kg.val() == '') {
    alert('Dose Weight is required');
    rv = false;
    //jqDW_kg.focus();
    //window.scrollBy(0, -90);
  }
  var jqVolPerKG = me.getObject('VolumePerKG');
  if (parseFloat(jqVolPerKG.val()) == 0 || jqVolPerKG.val() == '') {
    alert('TPN Volume is required');
    rv = false;
    //jqVolPerKG.focus();
    //window.scrollBy(0, -90);
  }

  me.saltError = false; /* force reset this flag so it repops if you're trying to save with an error */
  var salts = me.EtoS();
  if (salts.Error !== '') {
    rv = false;
  }

  var objCTC = $('.comtypcd').find('.communicationtypecd');
  var strCTC = objCTC.val();

  if (strCTC == '') {
    alert('Communication Type is required');
    //objCTC.eq(0).focus();
    objCTC.eq(0).select();
    rv = false;
  }
  else {
    me.communicationTypeCd = parseFloat(strCTC);
  }

  return rv;
};
uhspa.tpnadvisor.prototype.pref = function (what, other) {
  var me = this;
  var rv = other;
  if (me.data.RREC.FLEX_name[what.toUpperCase()]) {
    rv = me.data.RREC.FLEX_name[what.toUpperCase()].VALUE;
  }
  return rv;
};
uhspa.tpnadvisor.prototype.save = function (cb) {
  var me = this;
  if (me.canSave()) {
    var dfd = $.Deferred();
    dfd.then(
      function (p) {
        if (p) {
          var btn = $('#footersignbutton');
          btn.text('Processing...');
          btn.attr('disabled', true);
          setTimeout(function () {
            me.realsave.call(me, cb);
          }
            , 1
          );
        }
      }
    );

    if (me.getValue('IVAdminSite') == 'Peripheral') {
      var dexPcnt = parseFloat(me.getValue('DexPercent'));
      var prefDexPcntMax = me.pref('PERIPHERAL_DEXTROSE_MAX_PERCENT', 'OFF');
      if (prefDexPcntMax !== 'OFF'
        && dexPcnt > parseFloat(prefDexPcntMax)) {
        $('<div title="Dextrose percentage" class="uhspa-dexalert">'
        + '<p>'
        + me.maxP(dexPcnt, 1) + '% exceeds maximum peripheral dextrose percentage of ' + prefDexPcntMax + '%'
        + '</p>'
        + '<p>'
        + 'Modify Administration Site from Peripheral to Central?'
        + '</p>'
        + '</div>'
        ).dialog({
          resizable: false,
          height: 'auto',
          width: 650,
          modal: true,
          buttons: {
            //"Disagree": function (evt) {
            "Resolve": function (evt) {
              setTimeout(function () {
                window.scrollTo(0, 0);
              }, 100);
              dfd.resolve(false);
              $(this).dialog("close");
            }
            //,
            //"Agree": function (evt) {
            //  var obj = me.getObject('IVAdminSite_Central');
            //  obj.prop('checked', true);
            //  dfd.resolve(true);
            //  $(this).dialog("close");
            //}
          }
        });
      }
      else {
        var osmoValue = me.getValue('OsmoValue');
        /* move this value onto the front of the queue */
        me.DWmsg.osmo.unshift({
          value: osmoValue,
          timestamp: Date.now()
        });
        var peripheralOsmoMax = me.getValue('PeripheralOsmoMax');
        if (osmoValue > peripheralOsmoMax) {
          $('<div title="Osmolarity Alert" class="uhspa-osmoalert">'
            + '<p>'
            + osmoValue + ' mOsm/L exceeds maximum peripheral osmolarity of ' + peripheralOsmoMax + ' mOsm/L'
            + '</p>'
            + '</div>'
          ).dialog({
            resizable: false,
            height: 'auto',
            width: 650,
            modal: true,
            buttons: {
              "Resolve": function (evt) {
                dfd.resolve(false);
                $(this).dialog("close");
              }
            }
          });
        }
        else {
          var peripheralOsmoWarn = me.pref('PERIPHERAL_OSMOLARITY_WARNOVER', 'OFF');
          if (peripheralOsmoWarn !== 'OFF' && osmoValue > parseFloat(peripheralOsmoWarn)) {
            $('<div title="Osmolarity Alert" class="uhspa-osmoalert">'
              + '<p>'
              + osmoValue + ' mOsm/L exceeds peripheral osmolarity of ' + peripheralOsmoWarn + ' mOsm/L'
              + '</p>'
              + '</div>'
            ).dialog({
              resizable: false,
              height: 'auto',
              width: 650,
              modal: true,
              buttons: {
                "Proceed": function (evt) {
                  dfd.resolve(true);
                  $(this).dialog("close");
                },
                "Resolve": function (evt) {
                  dfd.resolve(false);
                  $(this).dialog("close");
                }
              }
            });
          }
          else {
            dfd.resolve(true);
          }
        }
      }
    }
    else {
      dfd.resolve(true);
    }
  }
};
uhspa.tpnadvisor.prototype.realsave = function (cb) {
  var me = this;
  try {
    if (true) {
      var callback = cb;
      var audit = [];
      var oc = [];
      var ingInfo = [];
      var aOrders = [];
      var aConsults = [];
      var aLabs = [];
      var aStarterBag = [];
      var SeparateLipidOrder = me.getValue('admixture') === '2:1';
      var pharmnote = '';
      var usingTraceCombo = me.pref('PretermTraceCombo', 'NO') === 'YES' && parseFloat(me.getValue('PretermTraceCombo')) > 0;
      if (me.getValue('IVAdminSite') === 'Peripheral') {
        pharmnote = 'Peripheral';
        me.DWmsg.site = 'Peripheral';
      } /* Peripheral is unusual enough to comment, Central is not worth mentioning */

      /* which order set are we using? */
      var tmpl = me.data.RREC.REQUESTABLE_list[
        $('.sltn').find('input:checked').val()
      ][me.EditMode];

      var PMI = me.data.RREC.PREMIXINFO_map[tmpl.MNEMONIC];
      var fatIng = undefined;
      if (PMI) {
        fatIng = PMI.INGREDIENT_map['Fat'];
      }

      var newReq = me.newRequest();
      var now = new Date();
      var rdh = 'TPN Advisor ' + now.getTime();

      /* build/send request for consults / lab orders */
      $.each(
        [{ sel: '.route .cnsl input:checked', into: aConsults },
          { sel: '.laborder input:checked', into: aLabs },
          {
            sel: 'ul.starterbag input:checked:not([value=""])',
            into: aStarterBag
          }
        ]
        , function (widx, witm) {
          $(witm.sel).each(
            function (didx, ditm) {
              var jqItm = $(ditm);
              aOrders.push(jqItm.val());
              witm.into.push(jqItm.attr('data-mnemonic') + ' ' + jqItm.attr('data-osdline'));
            }
          );
        }
      );

      /* .push operation on the audit array with each of the elements in the array as arguments */
      if (aConsults.length > 0) {
        audit.push('CONSULTS:');
        Array.prototype.push.apply(audit, aConsults);
      }
      if (aLabs.length > 0) {
        audit.push('LABS:');
        Array.prototype.push.apply(audit, aLabs);
      }
      if (aStarterBag.length > 0) {
        audit.push('STARTERBAG:');
        Array.prototype.push.apply(audit, aStarterBag);
      }

      if (aOrders.length > 0) {
        MPAGES_EVENT("ORDERS"
          , me.getProperty('personId')
        + "|" + me.getProperty('encounterId')
        + "|" + aOrders.join()
        + "|0"
        + "|{2|127}"
        + "|32" /* sign screen */
        + "|1" /* silent sign */
        );
      }

      /* build the ingredient information for reading/comments */
      var realTE;
      var realZS;
      var realv;
      if (usingTraceCombo === true) {
        var ptc = parseFloat(me.getValue('PretermTraceCombo'));
        if (ptc > 0) {
          realTE = ptc;
          realZS = realTE / 0.2 * 100; /* 100 mcg per every 0.2 of the PretermTraceCombo amount ordered */
          realv = { "TraceElements": realTE, "ZincSulfate": realZS };
        }
      }
      var salts = me.EtoS(); /* compute the salts (and CL, Ac, etc) */

      ingInfo.push('MACRONUTRIENTS:\n '
                + ([
                  'Protein: ' + me.maxP(me.getObject('Protein').val(), 3) + ' ' + me.getObject('Protein').data('uom'),
                  'Carbohydrates: ' + me.maxP(me.getObject('Carbohydrates').val(), 3) + ' ' + me.getObject('Carbohydrates').data('uom'),
                  'Fat: ' + me.maxP(me.getObject('Fat').val(), 3) + ' ' + me.getObject('Fat').data('uom')
                ]).join(' + ')
                + (SeparateLipidOrder ? ' (Fat moved to separate lipid order)' : '')
      );
      ingInfo.push('ELECTROLYTES:\n '
                + ([{ k: 'Potassium', u: 'mEq' },
                  { k: 'Sodium', u: 'mEq' },
                  { k: 'Calcium', u: 'mEq' },
                  { k: 'Magnesium', u: 'mEq' },
                  { k: 'Phosphate', u: 'mmol' },
                  { k: 'Chloride', u: 'mEq' },
                  { k: 'Acetate', u: 'mEq' }
                ]).reduce(
                  function (st, itm) {
                    var obj = me.getObject(itm.k);
                    var uom = obj.data('uom');
                    var v = obj.val();

                    if ((/Chloride|Acetate/).test(itm.k)) {
                      var ratio = me.getValue('ratioCLAc');
                      if (ratio === '') {
                        if (parseFloat(v) === 0) {
                          st.push('No ' + itm.k);
                        }
                      }
                      else {
                        if (itm.k === 'Chloride') {
                          st.push(ratio.replace(/:/, ' : ').replace(/ch/, ' Chloride ').replace(/ac/, ' Acetate '));
                        }
                      }
                    }
                    if (v > 0) {
                      st.push(itm.k + ': ' + me.maxP(v, 3) + ' ' + uom + ' ');
                    }
                    return st;
                  }
                  , []
                ).join(' + ')
      );
      ingInfo.push('ADDITIVES:\n ' +
        me.data.RREC.INGREDIENT
          .filter(function (ing) {
            return ing.TYPE === "Additive" && ing.VVIN === 1;
          })
          .reduce(function (st, itm) {
            var obj = me.getObject(itm.KEYNAME);
            var uom = obj.data('uom');
            var v = parseFloat(obj.val());
            if (usingTraceCombo === true && realv !== undefined && parseFloat(realv[itm.KEYNAME]) > 0) {
              v = parseFloat(realv[itm.KEYNAME]);
              if ((/\/kg/i).test(obj.data('uom'))) {
                v = v / parseFloat(me.getValue('DoseWeightKG'));
              }
            }
            if (v > 0) {
              st.push(itm.KEYNAME + ': ' + me.maxP(v, 3) + ' ' + uom + ' ');
            }
            return st;
          }, [])
          .join(' + ')
      );
      var otherAdditive = me.getValue('OtherAdditives');
      if (otherAdditive != '') {
        ingInfo.push('OTHER ADDITIVE:\n ** ' + otherAdditive + ' **');
      }

      var infuseStartDTTM = new Date();
      var infuseStopDTTM = new Date();
      var lipidinfuseStartDTTM = new Date();
      var lipidinfuseStopDTTM = new Date();
      var startDTTM = me.getValue('OrderStart');
      var stopDTTM = new Date();
      stopDTTM.setTime(startDTTM.getTime() + (24 * 60 * 60 * 1000)); /* 24 hours later */

      /* order information */
      var oiN = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW];
      var oiA = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDADM];

      /* start with an order action */
      var newOrder = me.newOrder();

      //?newOrder.GETLATESTDETAILSIND = 1;
      newOrder.SYNONYMID = tmpl.SYNONYMID;
      newOrder.IVSETSYNONYMID = tmpl.IVSETSYNONYMID;
      newOrder.CATALOGCD = tmpl.CATALOGCD;
      newOrder.CATALOGTYPECD = tmpl.CATALOGTYPECD;
      newOrder.ACTIONTYPECD = me.getCode('6003_Order').ID; /* this might be updated below... */
      /* already set in template
    newOrder.ORDERPROVIDERID = me.getProperty('orderProviderId');
    newOrder.COMMUNICATIONTYPECD = me.getProperty('communicationTypeCd');
    */

      var DCReq = me.newRequest({ ACTIONPERSONNELID: 1 });
      if (me.STOPInfusing) {
        var commentText = 'User requested STOP Infusing';
        var AOrder = me.newOrder();
        AOrder.ORDERID = oiA.ORDERID;
        AOrder.SYNONYMID = oiA.SYNONYM_ID;
        AOrder.CATALOGCD = oiA.CATALOG_CD;
        AOrder.CATALOGTYPECD = oiA.CATALOG_TYPE_CD;
        AOrder.ACTIONTYPECD = me.getCode('6003_Discontinue').ID;
        AOrder.LASTUPDATEACTIONSEQUENCE = oiA.LASTACTIONSEQUENCE;
        AOrder.LASTUPDTCNT = oiA.LASTUPDTCNT;
        AOrder.COMMENTLIST.push(
          me.newOrderComment({
            COMMENTTYPE: me.getCode('14_Order Comment').ID,
            COMMENTTEXT: commentText
          })
        );
        DCReq.ORDERLIST.push(AOrder);

        /* the 'administered' order has an associated lipid order */
        if (oiA.LIPIDORDERID > 0) {
          var adcfatord = me.newOrder();
          adcfatord.ORDERID = oiA.LIPIDORDERID;
          adcfatord.SYNONYMID = me.data.RREC.LIPID[0].SYNONYMID;
          adcfatord.CATALOGCD = me.data.RREC.LIPID[0].CATALOGCD;
          adcfatord.CATALOGTYPECD = me.data.RREC.LIPID[0].CATALOGTYPECD;
          adcfatord.ACTIONTYPECD = me.getCode('6003_Discontinue').ID;

          adcfatord.LASTUPDATEACTIONSEQUENCE = oiA.LIPIDLASTACTIONSEQUENCE;
          adcfatord.LASTUPDTCNT = oiA.LIPIDLASTUPDTCNT;

          adcfatord.COMMENTLIST.push(
            me.newOrderComment({
              COMMENTTYPE: me.getCode('14_Order Comment').ID,
              COMMENTTEXT: commentText
            })
          );
          DCReq.ORDERLIST.push(adcfatord);
        }
      }
      if (oiN.ORDERID != oiA.ORDERID) { /* ...not the same order as above */
        if (oiN.ORDERSTATUS == 'Ordered') { /* not cancel/dc */
          if (oiN.ADMINISTEREDDTTM == me.strCernerEmptyDate) { /* and was not administered */
            var commentText = 'New order replaces non-administered order';

            /* it can be discontinued */
            var NOrder = me.newOrder();
            NOrder.ORDERID = oiN.ORDERID;
            NOrder.SYNONYMID = oiN.SYNONYM_ID;
            NOrder.CATALOGCD = oiN.CATALOG_CD;
            NOrder.CATALOGTYPECD = oiN.CATALOG_TYPE_CD;
            NOrder.ACTIONTYPECD = me.getCode('6003_Discontinue').ID;
            NOrder.LASTUPDATEACTIONSEQUENCE = oiN.LASTACTIONSEQUENCE;
            NOrder.LASTUPDTCNT = oiN.LASTUPDTCNT;
            NOrder.COMMENTLIST.push(
              me.newOrderComment({
                COMMENTTYPE: me.getCode('14_Order Comment').ID,
                COMMENTTEXT: commentText
              })
            );
            DCReq.ORDERLIST.push(NOrder);

            /* the 'new' order has an associated lipid order */
            if (oiN.LIPIDORDERID > 0) {
              var dcfatord = me.newOrder();
              dcfatord.ORDERID = oiN.LIPIDORDERID;
              dcfatord.SYNONYMID = me.data.RREC.LIPID[0].SYNONYMID;
              dcfatord.CATALOGCD = me.data.RREC.LIPID[0].CATALOGCD;
              dcfatord.CATALOGTYPECD = me.data.RREC.LIPID[0].CATALOGTYPECD;
              dcfatord.ACTIONTYPECD = me.getCode('6003_Discontinue').ID;

              dcfatord.LASTUPDATEACTIONSEQUENCE = oiN.LIPIDLASTACTIONSEQUENCE;
              dcfatord.LASTUPDTCNT = oiN.LIPIDLASTUPDTCNT;

              dcfatord.COMMENTLIST.push(
                me.newOrderComment({
                  COMMENTTYPE: me.getCode('14_Order Comment').ID,
                  COMMENTTEXT: commentText
                })
              );
              DCReq.ORDERLIST.push(dcfatord);
            }
          }
        }
      }
      if (DCReq.ORDERLIST.length > 0) {
        callback = function (p) {
          me.callOrderServer(DCReq, cb);
        };
      }


      if (false /* tryToUseExistingOrder */) {
        /* Can we use the existing order? */
        if (oiN.ORDERID > 0 /* there is an existing order */
      && oiN.ORDERMNEMONIC == tmpl.MNEMONIC /* it is the requested mnemonic */
      && oiN.ORDERSTATUS == 'Ordered' /* it is in a state that can be modified (still active) */
        ) {
          /* YES :: change action to modify */
          newOrder.ACTIONTYPECD = me.getCode('6003_Modify').ID;
          /* set the order info to be modified */
          newOrder.ORDERID = oiN.ORDERID;
          newOrder.LASTUPDATEACTIONSEQUENCE = oiN.LASTACTIONSEQUENCE;
          newOrder.LASTUPDTCNT = oiN.LASTUPDTCNT;

          /* does the 'newest' order still have an empty administered datetime?
        OR does it have a lastActionSequence higher than AdministeredAction
      */
          if (oiN.ADMINISTEREDDTTM == me.strCernerEmptyDate
        || oiN.LASTACTIONSEQUENCE > oiN.ADMINISTEREDACTION
          ) { /* yes:: supersede - this is probably an oopsfix/update */
            /* bring forward the same start/stop times from the new/pending order */
            startDTTM.setISO8601(oiN.ORDERSTART);
            stopDTTM.setISO8601(oiN.ORDERSTOP);
          }
          else { /* this order has been administered, so we let the current bag run out before this next order */
            /* [msd] i think it is assumed this order will be left pending until tomorrow's labs
          provide updated context then this order will be in the other side of this if..else */

            /* set start/end date for tomorrow/after current administered order */
            startDTTM.setISO8601(oiN.ORDERSTOP);
            stopDTTM.setTime(startDTTM.getTime() + (24 * 60 * 60 * 1000)); /* +24 hours after start */
          }
        }
        else { /* NO :: now what? */
          /* does the existing order need to be cancel/DC-ed? */
          if (oiN.LASTACTIONSEQUENCE > oiN.ADMINISTEREDACTION) {
            /* the existing order is in a pending-administration state
          ex:  actionsequence ?? administeredaction
            1>0 : new(1), not yet verified by pharmacy(-), not administered(0) :: Cancel
            2>0 : modified(2), not verified by pharmacy(-), not administered(0) :: Cancel
            2>0 : new(1), verified by pharmacy(2), not administered(0) :: Cancel
            3>2 : new(1), verified(2), administered(2), pending(3) :: Discontinue
          ! 2=2 : new(1), verified(2), administered(2)  :: allow to complete
        */
            /* is the existing order still active? (already Cancel/Discontinue/complete/etc cannot be canceled again  */
            if (oiN.ORDERSTATUS == 'Ordered') {
              /* pending + active, so cancel/DC it */
              /* use order server to discontinue....
            fwiw POWERORDERS.MOEW [no silent sign, so very weird workflow]
              or MPAGE_EVENT('Orders',..) [crash powerchart over several permutations of attempts]
            */
              var XOrder = me.newOrder();
              XOrder.ORDERID = oiN.ORDERID;
              XOrder.SYNONYMID = oiN.SYNONYM_ID;
              XOrder.CATALOGCD = oiN.CATALOG_CD;
              XOrder.CATALOGTYPECD = oiN.CATALOG_TYPE_CD;
              XOrder.ACTIONTYPECD = me.getCode('6003_Discontinue').ID;
              XOrder.LASTUPDATEACTIONSEQUENCE = oiN.LASTACTIONSEQUENCE;
              XOrder.LASTUPDTCNT = oiN.LASTUPDTCNT;
              newReq.ORDERLIST.push(XOrder);
            }
          }

          /* was the order administered */
          if (!(oiN.ADMINISTEREDDTTM == me.strCernerEmptyDate)) { /* yes [it's not an empty date] */
            /* is the currently-administered order stopping after now? */
            var caOrdStop = new Date();
            caOrdStop.setISO8601(oiA.ORDERSTOP);
            if (caOrdStop > now) {
              /* set start/end date for tomorrow/after administered order */
              startDTTM.setISO8601(oiA.ORDERSTOP);
              stopDTTM.setTime(startDTTM.getTime() + (24 * 60 * 60 * 1000)); /* +24 hours after start */
            }
          }
          else { /* no, so that means it was pending ... */
            /* does the existing order have a non-empty OrderStart date and is it an active order */
            if (!(oiN.ORDERSTART == me.strCernerEmptyDate)
          && oiN.ORDERSTATUS == 'Ordered' /* and still an active order  */
            ) {
              /* bring forward the same start/stop times from the pending order */
              startDTTM.setISO8601(oiN.ORDERSTART);
              stopDTTM.setISO8601(oiN.ORDERSTOP);
            } /* [else use the start/stop that was initialized already] */
          }
        } /* ELSE: use existing?  (..&..&..) */
      } /* tryToUseExistingOrder */

      var tVol = me.getValue('TotalVolume');

      var NonLipidVolTotal = me.getValue('NonLipidVolTotal');
      var LipidVolTotal = me.getValue('LipidVolTotal');
      if (SeparateLipidOrder) {
        tVol = NonLipidVolTotal;
      }
      var dwkg = me.getValue('DoseWeightKG');
      var infuseover = me.getValue('InfuseOver');
      var lipidinfuseover = me.getValue('LipidInfuseOver');

      var rate = tVol / infuseover;
      var rateFat = LipidVolTotal / lipidinfuseover;

      /* 20170512msd minvol and protein are more priority than user comments */
      var objMinVol = me.getObject('minvol');
      var isMinVol = objMinVol.find('input').get(0).checked;
      var proteinConcentration = me.getValue('prefProteinConcentration');
      var proteinAmt = me.getValue('Protein');
      pharmnote = pharmnote
        + ((pharmnote === '') ? '' : ', ')
        + ((isMinVol) ? 'Minimum Volume, ' : '')
        + (proteinAmt > 0 && 0 === parseFloat($('.sltn').find('input:checked').val()) ? me.getValue('prefProteinText') : '')
      ;

      var usercomment = me.getValue('UserOrderComments');
      var lipidordercomments = me.getValue('LipidOrderComments');

      /* Order Comments, if entered should be first-read */
      if (usercomment != '') {
        oc.push(' ** ' + usercomment + ' **');
      }

      /* if not separatelipidorder, put lipid comments here */
      if (!SeparateLipidOrder) {
        if (lipidordercomments != '') {
          oc.push(' ** ' + lipidordercomments + ' **');
        }
        if (LipidVolTotal > 0) {
          pharmnote = pharmnote + ' ' + me.getValue('prefFatText');
        }
      }

      var infuseNote = '';
      oc.push('INFUSION NOTE: '
        + 'Infuse over ' + String(infuseover) + ' hours, '
        + 'Starting at ' + me.fmtDate(startDTTM, 'read')
        + (infuseNote != ''
          ? '\n ** ' + infuseNote + ' **'
          : ''
        )
      );

      /* then ordered consults */
      if (aConsults.length > 0) {
        oc.push('CONSULTS:\n ' + aConsults.join('\n '));
      }

      /* then DoseWeight */
      oc.push('DOSING WEIGHT: ' + me.getValue('DoseWeightKG') + ' kg');

      /* then Order & Ingredient Info */
      if (fatIng === undefined) {
        oc.push('ORDERING: (via ' + me.getValue('IVAdminSite') + ') ' + me.getValue('VolumePerKG') + ' mL/kg\n'
              + ' '
              + ((isMinVol)
                ? 'Minimal Volume '
                : NonLipidVolTotal + ' mL '
              )
              + 'of ' + tmpl.MNEMONIC + '\n'
              + ((LipidVolTotal > 0)
                ? ' ' + LipidVolTotal + ' mL of '
                + (tmpl.INGREDIENT_map['Fat'] === undefined
                  ? 'Lipid'
                  : tmpl.INGREDIENT_map['Fat'].MNEMONIC
                )
                : ''
              )
              + (SeparateLipidOrder ? ' (Fat moved to separate lipid order)' : '')
        );
      }
      else {
        oc.push('ORDERING: (via ' + me.getValue('IVAdminSite') + ')\n'
              + ' ' + (NonLipidVolTotal + LipidVolTotal) + ' mL of ' + tmpl.MNEMONIC
              + (SeparateLipidOrder ? ' (Fat moved to separate lipid order)' : '')
        );
      }

      oc.push(ingInfo.join(' \n'));

      /* fyi: ordered labs */
      /* 20161128msd turned off labs in order comments "because reasons" */
      /*
    if( aLabs.length > 0 ){
      oc.push( 'LABS:\n ' + aLabs.join('\n ') );
      }
    */

      /* order details */
      newOrder.DETAILLIST.push(me.mkNOD('Rule Data (Hidden)', rdh));

      if (pharmnote !== '') {
        newOrder.DETAILLIST.push(me.mkNOD('RxProductSelectNote', pharmnote));
      }

      newOrder.DETAILLIST.push(me.mkNOD('RXROUTE', '4001_IV'));
      newOrder.DETAILLIST.push(me.mkNOD('CONSTANTIND', 'Yes'));
      newOrder.DETAILLIST.push(me.mkNOD('DURATION', 24));
      //newOrder.DETAILLIST.push( me.mkNOD('STOPTYPE', 'Hard Stop' ) );
      newOrder.DETAILLIST.push(me.mkNOD('STOPTYPE', '4009_Physician Stop'));

      newOrder.DETAILLIST.push(me.mkNOD('VOLUMEDOSEUNIT', '54_mL'));
      newOrder.DETAILLIST.push(me.mkNOD('RATEUNIT', '54_mL/hr'));
      newOrder.DETAILLIST.push(me.mkNOD('WEIGHTUNIT', '54_kg'));
      newOrder.DETAILLIST.push(me.mkNOD('DURATIONUNIT', '54_hr'));
      newOrder.DETAILLIST.push(me.mkNOD('INFUSEOVERUNIT', '54_hr'));

      /* 20161020msd CAPS integration couldn't fit the order comment spew on their label, so it was decided
      that CAPS would get only the Special Instructions (SPECINX) for the label - since they already
      list the salts and the ions and the route and the line and the duration anyway
       there is no change to the information in the order comments
       20161021msd SPECINX order detail field has a hard limit of 255 characters (and that's not ok)
      */
      // newOrder.DETAILLIST.push(
      // me.mkNOD('SPECINX'
      // ,usercomment
      // + (SeparateLipidOrder
      // ? ''                        /* 2:1+1 = there's no need to include lipid comments in this order */
      // : '\n' + lipidordercomments /* 3:1 = put lipid comments in this order */
      // )
      // )
      // );
      /* 20161021msd ... so use the Special Instructions comment type */
      var CAPSComment = usercomment
                    + (SeparateLipidOrder
                      ? '' /* 2:1+1 = there's no need to include lipid comments in this order */
                      : '\n' + lipidordercomments /* 3:1 = put lipid comments in this order */
                    );
      if (CAPSComment.replace(/\s/g, '').length > 0) { /* there's something to say */
        newOrder.COMMENTLIST.push(
          me.newOrderComment({
            COMMENTTYPE: me.getCode('14_Special Instructions').ID,
            COMMENTTEXT: CAPSComment
          })
        );
      }

      newOrder.DETAILLIST.push(me.mkNOD('TOTALVOLUME', parseFloat(me.maxP(tVol, me.precision['mL']))));
      newOrder.DETAILLIST.push(me.mkNOD('VOLUMEDOSE', parseFloat(me.maxP(tVol, me.precision['mL']))));

      newOrder.DETAILLIST.push(me.mkNOD('WEIGHT', parseFloat(me.maxP(dwkg, me.precision['kg']))));
      newOrder.DETAILLIST.push(me.mkNOD('INFUSEOVER', parseFloat(infuseover)));
      newOrder.DETAILLIST.push(me.mkNOD('RATE', parseFloat(me.maxP(rate, me.precision['mL']))));

      newOrder.DETAILLIST.push(me.mkNOD('REQSTARTDTTM', me.fmtDate(startDTTM, 'read'), me.fmtDate(startDTTM, 'serialize')));
      newOrder.DETAILLIST.push(me.mkNOD('STOPDTTM', me.fmtDate(stopDTTM, 'read'), me.fmtDate(stopDTTM, 'serialize')));

      newOrder.DETAILLIST.push(me.mkNOD('RXPRIORITY', '4010_Routine'));
      newOrder.DETAILLIST.push(me.mkNOD('PHARMORDERTYPE', 2));
      newOrder.DETAILLIST.push(me.mkNOD('ADHOCFREQINSTANCE', -1));

      /* 20141030 msd - turned off because phamedmgr presents strangely when both duration and stoptime are specified */
      //newOrder.DETAILLIST.push( me.mkNOD('STOPDTTM',me.fmtDate(stopDTTM,'read'),me.fmtDate(stopDTTM,'serialize') ) );

      Array.prototype.push.apply(audit, salts.log); /* .push operation on the audit array with each of the elements in the salts.log array as arguments */

      /* add line item / ingredient */
      for (var lnI = 0, lnImax = tmpl.INGREDIENT.length; lnI < lnImax; lnI++) {
        //for( var lnI=0,lnImax=1; lnI<lnImax; lnI++ ){
        var amt = 0; /* initialize per iteration */
        var ingredientType = 3; /* additive */
        var ING = tmpl.INGREDIENT[lnI];
        //alert( ING.KEYNAME + '\n' + ING.MNEMONIC );
        var ingPrec = me.precision['salt'];
        amt = salts[ING.KEYNAME]; /* amt is whatever amount is in the salts object */
        if (!amt) { /* it's not one of the things in the salts object */
          var amt = me.getValue(ING.KEYNAME); /* try getting it directly */

          /* since only full compound would have ingredient references for macronutrients (and there's only 3 of them)
          check to see if the requested ingredient is one that is currently expressed as a 'per kg' measure and adjust it
          */
          if (ING.KEYNAME == 'Protein'
          || ING.KEYNAME == 'Carbohydrates'
          || ING.KEYNAME == 'Fat'
          ) {
            amt = parseFloat(amt) * parseFloat(me.getValue('DoseWeightKG'));
          }
          if (ING.KEYNAME == 'Mix'
          || ING.KEYNAME == 'MixE'
          ) {
          /* 20150306 msd - always send non-lipid volume for the mix and water ingredient */
          /* amt = parseFloat(me.getValue('TotalVolume')); */
          //amt = parseFloat(me.getValue('NonLipidVolTotal'));
          /* 20170208 msd - [peri]kabiven is the first premix with lipid, so now the old assumption is wrong
                            since the tVol is already "separate lipid order" aware (above) just use it here
          */
            amt = parseFloat(tVol);
            ingredientType = 2; /* base */
          }

          /* 20150722 per TimK email 'TPN Advisor change requests'(7/16/2015 7:57p) "3.	Change Sterile water value to 0.1 ml that is placed by advisor into medmanager" */
          if (ING.KEYNAME == 'Water') {
            if (isMinVol) { /* if minvol then set amt to 0 so this ingredient is not set/used */
              amt = 0;
            }
            else {
              amt = 0.1;
            }
          }

          /* 20150312 send the total volume to TPNVolume */
          if (ING.KEYNAME == 'TPNVolume') {
            amt = parseFloat(tVol);
            ingredientType = 2; /* base */
          }

          if (usingTraceCombo === true) {
            if (ING.KEYNAME === 'TraceElements') {
              amt = realTE;
            }
            if (ING.KEYNAME === 'ZincSulfate') {
              amt = realZS;
            }
          }
          /* it wasn't a salt, try to determine what it is */
          if (false /* prior to 20150914 */) {
            switch (ING.KEYNAME) {
              case 'Water' :
                var ingPrec = 1;
                break;
              case 'Fat' :
              case 'Protein' :
              case 'Carbohydrates' :
                var ingPrec = me.precision['macro'];
                break;
              case 'Potassium' :
              case 'Sodium' :
              case 'Calcium' :
              case 'Magnesium' :
              case 'Phosphate' :
              case 'Chloride' :
              case 'Acetate' :
                var ingPrec = me.precision['micro'];
                break;
              default :
                var ingPrec = me.precision['default'];
                break;
            }
          }
        }

        switch (ING.KEYNAME) {
          case 'Fat' :
          case 'Protein' :
          case 'Carbohydrates' :
            var ingPrec = 0;
            break;
          default :
            var ingPrec = 1;
            break;
        }
        /* 20160719 msd "rounding" was causing more problems (again) */
        ingPrec = 2;

        /* don't include ingredients that aren't used */
        /* 20150513msd amount greater than zero but less than the requested precision were causing "Incomplete" orders
        due to requests for ingredients with [rounded to]zero amounts. ex: SodiumAcetate( 0.004999 )
        I've been referring to this condition as "negligible salts" and we're now OK with discarding them
        with the understanding there may be some impact to the return to Electrolyte calculations because of
        the missing detail.  Any impact to the electrolyte will accurately reflect what the patient was given,
        and Dr.Ali agreed that is a better reflection of reality than to artificially 'snap' the Electrolyte amount
        to the nearest most-likely entered value for the sake of the physician's view of what was originally keyed
        */
        var lcAmt = me.maxP(amt || 0, ingPrec);

        /* is the numeric value of the post-rounded number is greater than zero... send it, else it's either not requested at all (truly zero) or "negligible" */
        if (parseFloat(lcAmt) > 0) {
          var amtuom = lcAmt
                    + ' '
                    + ((ING.STRENGTHDOSEUNIT == 0)
                      ? ING.VOLUMEDOSEUNITDISP
                      : ING.STRENGTHDOSEUNITDISP
                    );
          //oc.push( '- ' + ING.MNEMONIC + ': ' + amtuom );  /* pharmacy already sees these ingredients in their view */
          audit.push('- ' + ING.KEYNAME + '(' + ING.MNEMONIC + '): ' + amtuom);


          //alert( 'tmpl.MNEMONIC: ' + tmpl.MNEMONIC  + '\nING.KEYNAME: ' + ING.KEYNAME );

          var newOSC = me.newSubComponent({
            SCSYNONYMID: ING.SYNONYMID,
            SCCATALOGCD: ING.CATALOGCD,
            SCORDERMNEMONIC: ING.MNEMONIC,
            SCORDEREDASMNEMONIC: ING.MNEMONIC,
            SCHNAORDERMNEMONIC: ING.MNEMONIC,
            SCSTRENGTHDOSE: ((ING.STRENGTHDOSEUNIT == 0) ? 0 : parseFloat(lcAmt)),
            SCSTRENGTHDOSEDISP: ((ING.STRENGTHDOSEUNIT == 0 || amt == 0) ? '' : lcAmt), //+ ' ' + ING.STRENGTHDOSEUNITDISP)
            SCSTRENGTHUNIT: ING.STRENGTHDOSEUNIT,
            SCSTRENGTHUNITDISP: ING.STRENGTHDOSEUNITDISP,
            SCVOLUMEDOSE: ((ING.VOLUMEDOSEUNIT == 0) ? 0 : parseFloat(lcAmt)),
            SCVOLUMEDOSEDISP: ((ING.VOLUMEDOSEUNIT == 0 || amt == 0) ? '' : lcAmt), //+ ' ' + ING.VOLUMEDOSEUNITDISP)
            SCVOLUMEUNIT: ING.VOLUMEDOSEUNIT,
            SCVOLUMEUNITDISP: ING.VOLUMEDOSEUNITDISP,
            SCMODIFIEDFLAG: 1, //(me.data.RREC.INGREDIENT_map[ ING.KEYNAME ].NEWVALUE == 0) ? 0 : 1
            /* if this property isn't set correctly, order server response with error like
                        can't bring forward dose information because synonym(foo) did not exists
                      */
            SCPREVINGREDIENTSEQ: ((me.data.RREC.INGREDIENT_map[ING.KEYNAME].NEWVALUE == 0) /* no previous value */
              ? 0 /* set 'previous ingredient sequence' to zero */
              : oiN.LASTACTIONSEQUENCE /* else use lastactionsequence */
            ),
            SCAUTOASSIGNFLAG: 1,
            SCINGREDIENTTYPEFLAG: ingredientType
          });

          // if( ING.KEYNAME == 'PotassiumChloride' || ING.KEYNAME == 'SodiumAcetate' ){
          // var newDet = me.newSCDetail({
          // OEFIELDID :      634671.00
            // ,OEFIELDVALUE :  1410178173.00
            // ,OEFIELDDISPLAYVALUE : 'Vial-TPN'
            // ,OEFIELDMEANING : 'DRUGFORM'
            // ,OEFIELDMEANINGID : 2014
            // ,MODIFIEDIND : 1
            // });
          // newOSC.SCDETAILLIST.push( newDet );
          // }
          if (ING.KEYNAME == 'Protein') {
            newOSC.SCVOLUMEDOSE = amt / me.getValue('prefProteinConcentration');
            newOSC.SCVOLUMEDOSEDISP = me.maxP(newOSC.SCVOLUMEDOSE, 2).toString();
            newOSC.SCVOLUMEUNITDISP = 'mL';
            newOSC.SCVOLUMEUNIT = me.data.RREC.CODE_map[newOSC.SCVOLUMEUNITDISP].ID;
          }
          if (ING.KEYNAME == 'Carbohydrates') {
            newOSC.SCVOLUMEDOSE = amt / 0.7; /* all sites are using 70% concentration for Dextrose/Carbohydrates */
            newOSC.SCVOLUMEDOSEDISP = me.maxP(newOSC.SCVOLUMEDOSE, 2).toString();
            newOSC.SCVOLUMEUNITDISP = 'mL';
            newOSC.SCVOLUMEUNIT = me.data.RREC.CODE_map[newOSC.SCVOLUMEUNITDISP].ID;
          }

          if (ING.KEYNAME == 'Fat') {
            newOSC.SCVOLUMEDOSE = parseFloat(me.getValue('LipidVolTotal'));
            newOSC.SCVOLUMEDOSEDISP = me.maxP(parseFloat(me.getValue('LipidVolTotal')), 2).toString();
            newOSC.SCVOLUMEUNITDISP = 'mL';
            newOSC.SCVOLUMEUNIT = me.data.RREC.CODE_map[newOSC.SCVOLUMEUNITDISP].ID;

            /* if 2:1+1 ... */
            if (SeparateLipidOrder) {
              var ordFat = me.lipidOrder();
              var externalLipidMode = me.pref('ExternalLipidMode', 'Bag');
              switch (externalLipidMode) {
                case 'Syringe' :
                  /* CD-1959 more than 12 hours requires splitting the infusion into 2 doses */
                  var doses = (lipidinfuseover > 12 ? 2 : 1);
                  /* order details */
                  ordFat.DETAILLIST.push(me.mkNOD('DURATION', doses));
                  ordFat.DETAILLIST.push(me.mkNOD('DURATIONUNIT', '54_Doses'));
                  ordFat.DETAILLIST.push(me.mkNOD('DRUGFORM', '4008_IV SYRINGE'));
                  ordFat.DETAILLIST.push(me.mkNOD('DISPENSECATEGORY', '18309_TPN'));
                  ordFat.DETAILLIST.push(me.mkNOD('VOLUMEDOSE', parseFloat(me.maxP(LipidVolTotal / doses, me.precision['mL']))));
                  ordFat.DETAILLIST.push(me.mkNOD('TOTALVOLUME', parseFloat(me.maxP(LipidVolTotal / doses, me.precision['mL']))));
                  ordFat.DETAILLIST.push(me.mkNOD('INFUSEOVER', parseFloat(lipidinfuseover / doses)));
                  ordFat.DETAILLIST.push(me.mkNOD('REPLACEEVERY', lipidinfuseover / doses));
                  ordFat.DETAILLIST.push(me.mkNOD('REPLACEEVERYUNIT', '54_hr'));
                  /* ingredient details */
                  newOSC.SCSTRENGTHDOSE = parseFloat(newOSC.SCSTRENGTHDOSE / doses);
                  newOSC.SCSTRENGTHDOSEDISP = String(newOSC.SCSTRENGTHDOSE);
                  newOSC.SCVOLUMEDOSE = parseFloat(me.getValue('LipidVolTotal') / doses);
                  newOSC.SCVOLUMEDOSEDISP = String(newOSC.SCVOLUMEDOSE);
                  break;
                case 'Bag' : /* falls through */
                default :
                  ordFat.DETAILLIST.push(me.mkNOD('DISPENSECATEGORY', '18309_TPN'));
                  ordFat.DETAILLIST.push(me.mkNOD('VOLUMEDOSE', parseFloat(me.maxP(LipidVolTotal, me.precision['mL']))));
                  ordFat.DETAILLIST.push(me.mkNOD('TOTALVOLUME', parseFloat(me.maxP(LipidVolTotal, me.precision['mL']))));
                  ordFat.DETAILLIST.push(me.mkNOD('INFUSEOVER', parseFloat(lipidinfuseover)));
                  ordFat.DETAILLIST.push(me.mkNOD('DURATION', 24));
                  ordFat.DETAILLIST.push(me.mkNOD('DURATIONUNIT', '54_hr'));
                  //newOSC.SCFREQUENCY =      614491.00;
                  //newOSC.SCIVSEQ = 63;
                  break;
              }
              ordFat.DETAILLIST.push(me.mkNOD('RxProductSelectNote', me.getValue('prefFatText')));
              ordFat.DETAILLIST.push(me.mkNOD('Continuous IV', 1));
              ordFat.DETAILLIST.push(me.mkNOD('PHARMORDERTYPE', 2));
              ordFat.DETAILLIST.push(me.mkNOD('REQSTARTDTTM', me.fmtDate(startDTTM, 'read'), me.fmtDate(startDTTM, 'serialize')));
              ordFat.DETAILLIST.push(me.mkNOD('STOPDTTM', me.fmtDate(stopDTTM, 'read'), me.fmtDate(stopDTTM, 'serialize')));
              ordFat.DETAILLIST.push(me.mkNOD('RATE', parseFloat(me.maxP(rateFat, 2))));
              ordFat.DETAILLIST.push(me.mkNOD('WEIGHT', parseFloat(me.maxP(dwkg, me.precision['kg']))));
              /* overwrite properties on the subcomponent declared in the main order ingredient loop */
              newOSC.SCSYNONYMID = ordFat.SYNONYMID;
              newOSC.SCCATALOGCD = ordFat.CATALOGCD;
              newOSC.SCORDERMNEMONIC = me.data.RREC.LIPID[0].MNEMONIC;
              newOSC.SCORDEREDASMNEMONIC = me.data.RREC.LIPID[0].MNEMONIC;
              newOSC.SCHNAORDERMNEMONIC = me.data.RREC.LIPID[0].MNEMONIC;
              /* make sure this ingredient contributes its volume to the order total */
              newOSC.SCINCLUDEINTOTALVOLUMEFLAG = 2; /* yeah, 2 = yes */
              /* make sure this isn't an additive anymore, it's the base/diluent */
              newOSC.SCINGREDIENTTYPEFLAG = 2;

              newOSC.SCVOLUMEUNITDISP = 'mL';
              var hack = me.mkNOD('VOLUMEDOSEUNIT', newOSC.SCVOLUMEUNITDISP);
              newOSC.SCVOLUMEUNIT = hack.OEFIELDVALUE;

              /* add this ingredient to the fat order */
              ordFat.SUBCOMPONENTLIST.push(newOSC);

              ordFat.COMMENTLIST.push(
                me.newOrderComment({
                  COMMENTTYPE: me.getCode('14_Administration Note').ID,
                  COMMENTTEXT: 'Lipid Order with TPN Advisor Order\n'
                })
              );
              ordFat.COMMENTLIST.push(
                me.newOrderComment({
                  COMMENTTYPE: me.getCode('14_Pharm Comments').ID,
                  COMMENTTEXT: 'Lipid Order with TPN Advisor Order\n'
                })
              );
              ordFat.COMMENTLIST.push(
                me.newOrderComment({
                  COMMENTTYPE: me.getCode('14_Order Comment').ID,
                  COMMENTTEXT: (lipidordercomments != ''
                    ? ' ** ' + lipidordercomments + ' ** \n'
                    : ''
                  )
                  + 'Fat: ' + me.getObject('Fat').val() + ' ' + me.getObject('Fat').data('uom')
                  + ' (' + me.maxP(me.getValue('DoseWeightKG') * me.getValue('Fat'), me.getObject('Fat').data('precision'))
                  + ' ' + me.getObject('Fat').data('uom').replace(/\/kg/, '')
                  + ') to be infused over ' + lipidinfuseover + ' hours'
                  + '\nTPN Advisor Lipid Order'
                })
              );

              newOrder.COMMENTLIST.push(
                me.newOrderComment({
                  COMMENTTYPE: me.getCode('14_Administration Note').ID,
                  COMMENTTEXT: 'Additional/Separate TPN Lipid Order Exists\n'
                })
              );
              newOrder.COMMENTLIST.push(
                me.newOrderComment({
                  COMMENTTYPE: me.getCode('14_Pharm Comments').ID,
                  COMMENTTEXT: 'Additional/Separate TPN Lipid Order Exists\n'
                })
              );

              newReq.ORDERLIST.push(ordFat);
            }
            else { /* else 3:1 */
              newOrder.SUBCOMPONENTLIST.push(newOSC);
            }
          }
          else {
          /* add this ingredient to the order subcomponentlist */
            newOrder.SUBCOMPONENTLIST.push(newOSC);
          }
        } /* if ( "nonzero ingredient" ) */
      } /* end for lnI [ingedient] */

      newOrder.COMMENTLIST.push(
        me.newOrderComment({
          COMMENTTYPE: me.getCode('14_Order Comment').ID,
          COMMENTTEXT: oc.join(' \n')
        })
      );


      /* add this newOrder to the request */
      newReq.ORDERLIST.push(newOrder);

      var mylog = {
        appstate: {
          minvol_checked: me.getObject('minvol').find('input').prop('checked'),
          prefProteinConcentration: me.getValue('prefProteinConcentration'),
          prefProteinText: me.getValue('prefProteinText'),
          prefFatConcentration: me.getValue('prefFatConcentration'),
          prefFatText: me.getValue('prefFatText'),
          UserOrderComments: me.getValue('UserOrderComments'),
          LipidOrderComments: me.getValue('LipidOrderComments'),
          OtherAdditives: me.getValue('OtherAdditives'),
          IVAdminSite: me.getValue('IVAdminSite')
        },
        audit: audit
      };

      newOrder.COMMENTLIST.push(
        me.newOrderComment({
          COMMENTTYPE: me.getCode('14_System Note').ID,
          COMMENTTEXT: JSON.stringify(mylog)
        })
      );

      //me.callOrderServer(newReq, callback);
      me.callOrderServer(newReq, function (d) {
        /* the last order added was the TPN order, so that's the one we want the ID of */
        me.DWmsg.orderid = d.REPLY.ORDERLIST[newReq.ORDERLIST.length - 1].ORDERID;
        /* remove this person/encounter from the "hasTPNProposal" concept, order date already supercedes any proposal data */
        me.loadCCLwithBlob(
          "UHS_MPG_DEL_CONCEPT_PERSON"
          , ["MINE"]
          , function (d) {
            callback.call(me);
          }
          , "JSON"
          , me.blob_HASTPNPROPOSAL
        );
      });
    }
  }
  catch (err) {
    alert('save error: ' + err.description);
  }
}; /* end realsave */
uhspa.tpnadvisor.prototype.reject = function (cb) {
  var me = this;
  try {
    me.loadCCLwithBlob(
      'UHS_MPG_UPD_MPG_CONFIG2'
      , [
        'MINE',
        'uhspa.tpnadvisor',
        '0.0', /* userid */
        String(me.data.RREC.PATIENTINFO.ENCNTRID),
        'ENCOUNTER',
        'proposal'
      ]
      , function (data) {
        /* remove this person/encounter from the "hasTPNProposal" concept */
        me.loadCCLwithBlob(
          "UHS_MPG_DEL_CONCEPT_PERSON"
          , ["MINE"]
          , function (d) {
            cb.call(me);
          }
          , "JSON"
          , me.blob_HASTPNPROPOSAL
        );
      }
      , "JSON"
      , "" /* store empty string so even if the record isn't expired, it's equivalent to no proposal data on reload */
    );
  }
  catch (err) {
    alert('reject error: ' + err.description);
  }
};
uhspa.tpnadvisor.prototype.propose = function (cb) {
  var me = this;
  try {
    var tpnproposal = {
      data: {
        /* set these properties with what is in the UI control regardless of uom because they only exist to round-trip
        so use getObject( ).val() then restoreProposal via getObject( ).val() unless otherwise required
        */
        /* Route */
        //IVAdminSite: me.getValue('IVAdminSite'),
        IVAdminSite_Central: me.getObject('IVAdminSite_Central').prop('checked'),
        IVAdminSite_Peripheral: me.getObject('IVAdminSite_Peripheral').prop('checked'),
        /* Infusion Schedule */
        OrderStart: me.getObject('OrderStart').val(),
        InfuseOver: me.getObject('InfuseOver').val(),
        admixturecheckbox: me.getObject('admixturecheckbox').val(),
        LipidInfuseOver: me.getObject('LipidInfuseOver').val(),
        /* Dosing Weight */
        DoseWeightKG: me.getObject('DoseWeightKG').val(),
        /* Volume/Energy */
        Volume: me.getObject('VolumePerKG').val(),
        minvolinput: me.getObject('minvolinput').prop('checked'),
        Fat: me.getObject('Fat').val(),
        prefFatConcentration: me.getValue('prefFatText'),
        //prefFatText: me.getValue('prefFatText'),
        Protein: me.getObject('Protein').val(),
        prefProteinConcentration: me.getValue('prefProteinText'),
        //prefProteinText: me.getValue('prefProteinText'),

        Carbohydrates: me.getObject('Carbohydrates').val(),
        /* Electrolytes */
        Potassium: me.getObject('Potassium').val(),
        Sodium: me.getObject('Sodium').val(),
        Calcium: me.getObject('Calcium').val(),
        Magnesium: me.getObject('Magnesium').val(),
        Phosphate: me.getObject('Phosphate').val(),
        prefKNa: me.getObject('prefKNa').val(),
        Chloride: me.getObject('Chloride').val(),
        ratioCLAc: me.getObject('ratioCLAc').val(),
        Acetate: me.getObject('Acetate').val(),
        //rdoChloride: me.getValue('rdoChloride'),
        //rdoAcetate: me.getValue('rdoAcetate'),
        rdoChlorideToBal: me.getObject('rdoChlorideToBal').prop('checked'),
        rdoChlorideCustom: me.getObject('rdoChlorideCustom').prop('checked'),
        rdoAcetateToBal: me.getObject('rdoAcetateToBal').prop('checked'),
        rdoAcetateCustom: me.getObject('rdoAcetateCustom').prop('checked'),
        /* Additives : (mostly moved to the ingredient.filter.forEach below) */
        OtherAdditives: me.getObject('OtherAdditives').val(),
        /* Order Comments */
        UserOrderComments: me.getObject('UserOrderComments').val(),
        LipidOrderComments: me.getObject('LipidOrderComments').val(),
        /* Solution/Premix */
        SolutionPremix: parseInt($('.sltn').find(':checked').val(), 10) || 0
      },
      meta: {
        /* Proposing user & time */
        ProposingUserId: me.data.RREC.META.PRSNL_ID,
        ProposingUserFullname: me.data.RREC.META.FULLNAME,
        ProposingDateTime: Date.now()
      }
    };

    /* additives */
    me.data.RREC.INGREDIENT
      .filter(function (ing) {
        return ing.TYPE === "Additive" && ing.VVIN === 1;
      })
      .forEach(function (ing) {
        tpnproposal.data[ing.KEYNAME] = me.getObject(ing.KEYNAME).val();
      });

    me.loadCCLwithBlob(
      'UHS_MPG_UPD_MPG_CONFIG2'
      , [
        'MINE',
        'uhspa.tpnadvisor',
        '0.0', /* userid */
        String(me.data.RREC.PATIENTINFO.ENCNTRID),
        'ENCOUNTER',
        'proposal'
      ]
      , function (data) {
        /* add this person/encounter to the "hasTPNProposal" concept */
        me.loadCCLwithBlob(
          "UHS_MPG_ADD_CONCEPT_PERSON"
          , ["MINE"]
          , function (d) {
            cb.call(me);
          }
          , "JSON"
          , me.blob_HASTPNPROPOSAL
        );
      }
      , "JSON"
      , JSON.stringify(tpnproposal)
    );
  }
  catch (err) {
    alert('propose error:' + err.description);
  }
};
uhspa.tpnadvisor.prototype.restoreProposal = function () {
  var me = this;
  try {
    var tpnproposal = JSON.parse(me.data.RREC.META.PROPOSALDATA);
    Object.keys(tpnproposal.data).forEach(function (field) {
      myobj = me.getObject(field);
      switch (myobj.prop('nodeName') + '.' + myobj.prop('type')) {
        case 'SELECT.select-one' : /* falls through */
        case 'TEXTAREA.textarea' : /* falls through */
        case 'INPUT.number' : /* falls through */
          if (field === 'prefProteinText'
            || field === 'prefFatText'
          ) {
            myobj.find('option').filter(function (idx, op) {
              return $(op).text() === tpnproposal.data[field];
            }).prop('selected', true);
          }
          else {
            myobj.val(tpnproposal.data[field]);
          }
          break;
        case 'INPUT.radio' : /* falls through */
        case 'INPUT.checkbox' : /* falls through */
          myobj.prop('checked', tpnproposal.data[field]);
          if (field === 'minvolinput') {
            var volUI = me.getObject('VolumePerKG');
            if (tpnproposal.data[field]) {
              volUI.addClass('uhspa-disabled');
            }
            else {
              volUI.removeClass('uhspa-disabled');
            }
          }
          if (field === 'admixturecheckbox') {
            me.admixtureresetview();
          }
          break;
        default :
          if (field === 'SolutionPremix') {
            me.setByRequestable(tpnproposal.data[field]);
          }
          else {
            // alert( 'Cannot restore:\n'
            // + field
            // + ': ' +myobj.prop('nodeName')
            // + '.' + myobj.prop('type')
            // + '\n'
            // + tpnproposal.data[field]
            // );
          }
      }
    });
    //    me.getObject('Cyc_StopHour').trigger('change');
  }
  catch (err) {
    alert('restoreProposal error: ' + err.description);
  }
};
uhspa.tpnadvisor.prototype.lipidOrder = function () {
  var me = this;
  var ordFat = me.newOrder();

  ordFat.ORDERMNEMONIC = me.data.RREC.LIPID[0].MNEMONIC;
  ordFat.ORDEREDASMNEMONIC = me.data.RREC.LIPID[0].MNEMONIC;
  ordFat.SYNONYMID = me.data.RREC.LIPID[0].SYNONYMID;
  ordFat.CATALOGCD = me.data.RREC.LIPID[0].CATALOGCD;
  ordFat.CATALOGTYPECD = me.data.RREC.LIPID[0].CATALOGTYPECD;
  ordFat.ACTIONTYPECD = me.getCode('6003_Order').ID;

  ordFat.DETAILLIST.push(me.mkNOD('RXROUTE', '4001_IV'));
  ordFat.DETAILLIST.push(me.mkNOD('VOLUMEDOSEUNIT', 'mL'));
  ordFat.DETAILLIST.push(me.mkNOD('RATEUNIT', 'mL/hr'));
  ordFat.DETAILLIST.push(me.mkNOD('WEIGHTUNIT', 'kg'));
  ordFat.DETAILLIST.push(me.mkNOD('INFUSEOVERUNIT', 'hr'));
  ordFat.DETAILLIST.push(me.mkNOD('RXPRIORITY', 'Routine'));
  ordFat.DETAILLIST.push(me.mkNOD('ADHOCFREQINSTANCE', -1));
  ordFat.DETAILLIST.push(me.mkNOD('STOPTYPE', 'Physician Stop'));

  return ordFat;
}; /* lipidOrder */
uhspa.tpnadvisor.prototype.starterBagOrder = function () {
  var me = this;
  var newOrder = false;
  var jqSB = $('li.ntrm').find(':checked');
  var idx = jqSB.val();
  if (idx != '') {
    var mdrSB = me.data.RREC.STARTERBAG[idx];

    newOrder = me.newOrder();

    newOrder.SYNONYMID = mdrSB.SYNONYMID;
    newOrder.IVSETSYNONYMID = mdrSB.IVSETSYNONYMID;
    newOrder.CATALOGCD = mdrSB.CATALOGCD;
    newOrder.CATALOGTYPECD = mdrSB.CATALOGTYPECD;
    newOrder.ACTIONTYPECD = me.getCode('6003_Order').ID;

    newOrder.DETAILLIST.push(me.mkNOD('RXROUTE', '4001_IV'));
    newOrder.DETAILLIST.push(me.mkNOD('CONSTANTIND', 'Yes'));

    newOrder.DETAILLIST.push(me.mkNOD('VOLUMEDOSEUNIT', '54_mL'));
    newOrder.DETAILLIST.push(me.mkNOD('RATEUNIT', '54_mL/hr'));
    newOrder.DETAILLIST.push(me.mkNOD('WEIGHTUNIT', '54_kg'));
    //newOrder.DETAILLIST.push( me.mkNOD('DURATIONUNIT', 'hr' ) );
    //newOrder.DETAILLIST.push( me.mkNOD('INFUSEOVERUNIT', 'hr' ) );

    //newOrder.DETAILLIST.push( me.mkNOD('DURATION', 24 ) );

    //    newOrder.DETAILLIST.push( me.mkNOD('TOTALVOLUME', parseFloat( '131' ) ) );
    //    newOrder.DETAILLIST.push( me.mkNOD('VOLUMEDOSE', parseFloat( '131' ) ) );

    newOrder.DETAILLIST.push(me.mkNOD('STOPTYPE', '4009_Physician Stop'));

    var rateMLKGHR = parseFloat($('li.ntrm').find('div input').val());
    var DWKG = parseFloat(me.getValue('DoseWeightKG'));
    var rateMLHR = rateMLKGHR * DWKG;

    newOrder.DETAILLIST.push(me.mkNOD('WEIGHT', parseFloat(DWKG)));
    newOrder.DETAILLIST.push(me.mkNOD('RATE', parseFloat(me.maxP(rateMLHR, 2))));

    var startDTTM = new Date();
    newOrder.DETAILLIST.push(me.mkNOD('REQSTARTDTTM'
      , me.fmtDate(startDTTM, 'read')
      , me.fmtDate(startDTTM, 'serialize')
    )
    );

    for (var lnI = 0, lnImax = mdrSB.INGREDIENT.length; lnI < lnImax; lnI++) {
      var ING = mdrSB.INGREDIENT[lnI];
      var newOSC = me.newSubComponent({
        SCSYNONYMID: ING.SYNONYMID,
        SCCATALOGCD: ING.CATALOGCD,
        SCORDERMNEMONIC: ING.MNEMONIC,
        SCORDEREDASMNEMONIC: ING.MNEMONIC,
        SCHNAORDERMNEMONIC: ING.MNEMONIC,
        SCSTRENGTHDOSE: ING.STRENGTHDOSEVALUE,
        SCSTRENGTHDOSEDISP: (ING.STRENGTHDOSEVALUE > 0) ? '' + ING.STRENGTHDOSEVALUE : '',
        SCSTRENGTHUNIT: ING.STRENGTHDOSEUNIT,
        SCSTRENGTHUNITDISP: ING.STRENGTHDOSEUNITDISP,
        SCVOLUMEDOSE: ING.VOLUMEDOSEVALUE,
        SCVOLUMEDOSEDISP: (ING.VOLUMEDOSEVALUE > 0) ? '' + ING.VOLUMEDOSEVALUE : '',
        SCVOLUMEUNIT: ING.VOLUMEDOSEUNIT,
        SCVOLUMEUNITDISP: ING.VOLUMEDOSEUNITDISP,
        SCMODIFIEDFLAG: 1, //(me.data.RREC.INGREDIENT_map[ ING.KEYNAME ].NEWVALUE == 0) ? 0 : 1
        SCAUTOASSIGNFLAG: 1
      });
      /* add this ingredient to the order subcomponentlist */
      newOrder.SUBCOMPONENTLIST.push(newOSC);
    }
  }
  return newOrder;
};
uhspa.tpnadvisor.prototype.mkNOD = function (fMeaning, fValue, fValueDTTM) {
  var me = this;

  var rv = me.newOrderDetail(me.data.RREC.ORDERDETAIL_map[fMeaning]);

  if (typeof fValue == 'number') {
    rv.OEFIELDVALUE = fValue;
  }

  rv.OEFIELDDISPLAYVALUE = String(fValue);

  var cmv = me.getCode(fValue);
  if (cmv) {
    rv.OEFIELDVALUE = cmv.ID;
    rv.OEFIELDDISPLAYVALUE = cmv.DISPLAY;
  }
  if (fValueDTTM) {
    rv.OEFIELDDTTMVALUE = fValueDTTM;
  }

  return rv;
};
uhspa.tpnadvisor.prototype.newRequest = function (p) {
  return $.extend(
    {}
    , this.data.RREC.OREQ
    , {
      ORDERLIST: []
    } /* overwrite reference to non-primitive type object (that we'll load later anyway) */
    , p
  );
};
uhspa.tpnadvisor.prototype.newOrder = function (p) {
  return $.extend(
    {}
    , this.data.RREC.OREQ.ORDERLIST[0]
    , {
      ORDERPROVIDERID: this.orderProviderId || 0,
      COMMUNICATIONTYPECD: this.communicationTypeCd || 0,
      DETAILLIST: [],
      COMMENTLIST: [],
      SUBCOMPONENTLIST: []
    }
    , p
  );
};
uhspa.tpnadvisor.prototype.newOrderDetail = function (p) {
  return $.extend(
    {}
    , this.data.RREC.OREQ.ORDERLIST[0].DETAILLIST[0]
    /* nothing I need/care to overwrite */
    , p
  );
};
uhspa.tpnadvisor.prototype.newOrderComment = function (p) {
  return $.extend(
    {}
    , this.data.RREC.OREQ.ORDERLIST[0].COMMENTLIST[0]
    /* no overwrite */
    , p
  );
};
uhspa.tpnadvisor.prototype.newSubComponent = function (p) {
  return $.extend(
    {}
    , this.data.RREC.OREQ.ORDERLIST[0].SUBCOMPONENTLIST[0]
    , { SCDETAILLIST: [] }
    , p
  );
};
uhspa.tpnadvisor.prototype.newSCDetail = function (p) {
  return $.extend(
    {}
    , this.data.RREC.OREQ.ORDERLIST[0].SUBCOMPONENTLIST[0].SCDETAILLIST[0]
    /* no overwrite */
    , p
  );
};
uhspa.tpnadvisor.prototype.fmtDate = function (dt, fmt) {
  var me = this;
  try {
    var rv = '';
    var YYYY = dt.getFullYear();
    var YY = YYYY - 2000;
    YY = (YY < 10) ? '0' : '' + YY;
    var M = dt.getMonth() + 1;
    var MM = ((M < 10) ? '0' : '') + M;
    var D = dt.getDate();
    var DD = ((D < 10) ? '0' : '') + D;
    var h = dt.getHours();
    var hh = ((h < 10) ? '0' : '') + h;
    var m = dt.getMinutes();
    var mm = ((m < 10) ? '0' : '') + m;
    var s = dt.getSeconds();
    var ss = ((s < 10) ? '0' : '') + s;
    //var tz = '+00:00';
    var tz = '-0' + parseInt(dt.getTimezoneOffset() / 60, 10) + ':00';


    switch (fmt) {
      case 'read' :
        rv = MM + '/' + DD + '/' + YY + ' ' + hh + ':' + mm;
        break;
      case 'serialize' :
        rv = '/Date(' + YYYY + '-' + MM + '-' + DD
            + 'T' + hh + ':' + mm + ':' + ss
            + '.000' + tz
            + ')/'
        ;
        break;
      case 'cerner' :
        rv = DD
            + '-'
            + [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ][M - 1].slice(0, 3)
            + '-'
            + YYYY
            + ' '
            + hh
            + ':'
            + mm
            + ':'
            + ss
        ;
        break;
      case 'pompu' : /* as in: PowerOrdersMPageUtils.InvokeCancelDCAction( ..,..,cxldate,.. ) */
        rv = YYYY + MM + DD + hh + mm + ss + '00'; /* centiseconds?? zero. */
        break;
      default :
        rv = '?' + fmt + '?';
        break;
    }
  }
  catch (err) {
    alert('fmtDate error:' + dt + '\n' + fmt);
  }
  return rv;
};
uhspa.tpnadvisor.prototype.getCode = function (p) {
  return this.data.RREC.CODE_map[p];
};
uhspa.tpnadvisor.prototype.getObject = function (p) {
  var me;
  var rv;
  switch (p) {
    case 'VolumePerKG' :
      rv = $('section.volenergy').find('.b1').find('input[data-keyname=Volume]');
      break;
    case 'DoseWeightKG' :
      rv = $('.dose').find('input[data-keyname=DoseWeightKg]');
      break;
    case 'UserOrderComments' :
      rv = $('.ordercomment').find('textarea.nonlipid');
      break;
    case 'LipidOrderComments' :
      rv = $('.ordercomment').find('textarea.lipid');
      break;
    case 'IVAdminSite' :
      rv = $('.route').find('.adms').find('input:checked');
      break;
    case 'IVAdminSite_Central' :
      rv = $('.route').find('.adms').find('input[value=Central]');
      break;
    case 'IVAdminSite_Peripheral' :
      rv = $('.route').find('.adms').find('input[value=Peripheral]');
      break;

    case 'OtherAdditives' :
      rv = $('.additive').find('textarea');
      break;
    case 'prefKNa' :
      rv = $('section.electrolyte').find('.Phosphate').find('.b0').find('select');
      break;

    case 'ratioCLAc' :
      rv = $('section.electrolyte').find('.Chloride').find('.b1').find('select.ratioCLAc');
      break;

    case 'rdoChloride':
      rv = $('section.electrolyte').find('.Chloride').find('.b1').find('input[name=rdoChloride]:checked');
      break;
    case 'rdoAcetate':
      rv = $('section.electrolyte').find('.Acetate').find('.b1').find('input[name=rdoAcetate]:checked');
      break;
    case 'rdoChlorideToBal':
      rv = $('section.electrolyte').find('.Chloride').find('.b1 .bal').find('input[value=ToBalance]');
      break;
    case 'rdoAcetateToBal':
      rv = $('section.electrolyte').find('.Acetate').find('.b1 .bal').find('input[value=ToBalance]');
      break;
    case 'rdoChlorideCustom':
      rv = $('section.electrolyte').find('.Chloride').find('.b1 .cst').find('input[value=Custom]');
      break;
    case 'rdoAcetateCustom':
      rv = $('section.electrolyte').find('.Acetate').find('.b1 .cst').find('input[value=Custom]');
      break;
    /*
    case 'balChloride':
      rv = $('section.electrolyte').find('.Chloride').find('.b1').find('select');
      break;
    case 'balAcetate':
      rv = $('section.electrolyte').find('.Acetate').find('.b1').find('select');
      break;
    */
    case 'infuse' :
      rv = $('section.infuse').children('div');
      break;
    case 'InfusionNote' :
      rv = $('section.infuse').children('div').find('textarea');
      break;

    // case 'Lipid_StartHour' :
    // case 'Lipid_StartMin' :
    // case 'Lipid_StopHour' :
    // case 'Lipid_StopMin' :
      // rv = $('section.infuse').find('select.' + p);
      // break;

    // case 'Cyc_StartHour' :
    // case 'Cyc_StartMin' :
    // case 'Cyc_StopHour' :
    // case 'Cyc_StopMin' :
      // rv = $('section.infuse').find('select.' + p);
      // break;

    case 'Volume' :
    case 'Protein' :
    case 'Carbohydrates' :
    case 'Fat' :
      rv = $('section.volenergy').find('.b1').find('input[data-keyname=' + p + ']');
      break;
    case 'prefFat' :
      rv = $('section.volenergy').find('.prefFat');
      break;
    case 'prefFatConcentration' :
      rv = $('section.volenergy').find('.prefFat').find('select');
      break;
    case 'minvol' :
      rv = $('section.volenergy').find('.b0').find('.minvol');
      break;
    case 'minvolinput' :
      rv = $('section.volenergy').find('.b0').find('.minvol input');
      break;
    case 'prefProtein' :
      rv = $('section.volenergy').find('.prefProtein');
      break;
    case 'prefProteinConcentration' :
      rv = $('section.volenergy').find('.prefProtein').find('select');
      break;

    case 'Potassium' :
    case 'Sodium' :
    case 'Calcium' :
    case 'Magnesium' :
    case 'Phosphate' :
    case 'Chloride' :
    case 'Acetate' :
      rv = $('section.electrolyte').find('.b1').find('input[data-keyname=' + p + ']');
      break;

    case 'MultiVitamin' :
    case 'TraceElements' :
    case 'PretermTraceCombo' :
    case 'Trace4' :
    case 'Trace4C' :
    case 'Trace5' :
    case 'Trace5C' :
    case 'Famotidine' :
    case 'Ranitidine' :
    case 'VitaminK' :
    case 'Insulin' :
    case 'ZincSulfate' :
    case 'Selenium' :
    case 'Levocarnitine' :
    case 'Thiamine' :
    case 'FolicAcid' :
    case 'Pyridoxine' :
    case 'AscorbicAcid' :
    case 'Heparin' :
    case 'Cysteine' :
    case 'Copper' :
    case 'Chromium' :
    case 'Manganese' :
      rv = $('section.additive').find('.b1').find('input[data-keyname=' + p + ']');
      break;

    case 'TraceElementChoice' :
      rv = $('section.additive').find('.TraceElementChoice');
      break;

    case 'admixturecheckbox' :
      rv = $('.uhspa-infuse-lipid-cb');
      break;
    case 'InfuseOver' :
      rv = $('.uhspa-tpninfuse-hours');
      break;
    case 'LipidInfuseOver' :
      rv = $('.uhspa-lipidinfuse-hours');
      break;
    case 'OrderStart' :
      rv = $('.uhspa-reqstart-time');
      break;
    case 'LipidVolTotal' : /* falls through */
    case 'NonLipidVolTotal' : /* falls through */
    default : /* assume p = id */
      rv = $('#' + p);
      if (rv.length === 0) {
        rv = $('[data-keyname=' + p + ']');
      }
      break;
  }

  if (!rv) {
    rv = $();
  }

  return rv;
};
uhspa.tpnadvisor.prototype.getValue = function (p) {
  var me = this;
  var rv;
  switch (p) {
    case 'Mix' :
    case 'MixE' :
    case 'Water' :
    case 'NonLipidVolume' :
      rv = me.getValue('NonLipidVolTotal');
      break;
    case 'TotalVolume' :
      rv = me.getValue('VolumePerKG')
          * me.getValue('DoseWeightKG')
      ;
      break;
    case 'DexPercent' :
      rv = me.dexpcnt;
      break;
    case 'OsmoValue' :
      rv = parseFloat(me.getObject(p).text());
      break;

      /* 20160623 we don't need this anymore, schedule is now always face-up */
      /*
    case 'InfuseSchedule' :
      rv  = ( (me.getObject('infuse').hasClass('showCyc'))
          ? 'Cyc'
          : 'Cont'
            )
          ;
      break;
      */
    case 'admixture' :
      rv = me.getObject('admixturecheckbox').is(':checked')
        ? '2:1'
        : '3:1'
      ;
      break;
    case 'OrderStart' :
      var os = me.getObject('OrderStart').val();
      var hrs = parseInt(parseFloat(os) / 100, 10);
      var mns = parseFloat(os % 100);
      var rv = new Date();
      rv.setHours(hrs, mns, 0);
      if (rv.getTime() < Date.now()) {
        rv.setTime(rv.getTime() + 24 * 60 * 60 * 1000);
      }
      break;

    /* the following measures are expected to be per kg and should not get the "per kg" multiplier */
    case 'VolumePerKG' :
    case 'Protein' :
    case 'Carbohydrates' :
    case 'Fat' :
      var obj = me.getObject(p);
      var v = obj.val();
      rv = parseFloat(v);
      if (isNaN(rv)
        || rv.toString() != v
      ) {
        rv = v;
      }
      break;

    /* 20160331msd #2124172 weird uom */
    case 'Heparin' :
      var ing = me.data.RREC.INGREDIENT_map['Heparin'];
      var obj = me.getObject(p);
      var v = obj.val();
      rv = parseFloat(v); /* assume that's what was entered */
      if (ing !== undefined) {
        switch (ing.UOM_DISP.toLowerCase()) {
          case 'units/ml' : /* actual units then needs to be multiplied by volume */
            /* volume is based on admixture */
            var volume = (me.getValue('admixture') === '3:1'
              ? me.getValue('TotalVolume')
              : me.getValue('NonLipidVolume')
            );
            rv = parseFloat(v) * volume;
            break;
        }
      }
      break;
    case 'Cysteine' :
      var ing = me.data.RREC.INGREDIENT_map['Cysteine'];
      var obj = me.getObject(p);
      var v = obj.val();
      rv = parseFloat(v); /* assume mg was entered */
      if (ing !== undefined) {
        switch (ing.UOM_DISP.toLowerCase()) {
          case 'mg/gm aa' : /* actual mg then needs to be multiplied by total protein */
            var dwkg = me.getValue('DoseWeightKG');
            var aa = me.getValue('Protein');
            /* convert entered value then multiply by total protein[ml] (which is doseweight[kg] times protein [mg/kg] ) */
            rv = parseFloat(v) * (dwkg * aa);
            break;
        }
      }
      break;
    /* /20160331msd #2124172 */

    case "OrderComments" :
    case "LipidOrderComments" :
      rv = me.getObject(p).val();
      break;

    case 'PeripheralOsmoMax' :
      rv = parseFloat(me.data.RREC.META.PERIPHERAL_OSMOLARITY_MAXIMUM);
      break;

    case 'prefFatText' :
      rv = me.getObject('prefFatConcentration').find(':selected').text();
      break;
    case 'prefProteinText' :
      rv = me.getObject('prefProteinConcentration').find(':selected').text();
      break;

    default : /* pass the key through to get the object and parseFloat it's value */
      var obj = me.getObject(p);
      var objv = obj.val();

      var v = objv;
      if ((/\/kg\//).test(obj.data('uom'))) {
        v = objv * me.getValue('DoseWeightKG');
      }

      rv = parseFloat(v);
      if (isNaN(rv)
        || rv.toString() != v
      ) {
        rv = v;
      }

      break;
  }
  return rv;
};
uhspa.tpnadvisor.prototype.listToIndex = function (aList, objKey) {
  if (aList) {
    return aList.reduce(
      function (rv, cv) {
        if (cv[objKey] != '') {
          rv[cv[objKey]] = cv;
        }
        return rv;
      }
      , {}
    );
  }
  else {
    return {};
  }
};
uhspa.tpnadvisor.prototype.prepData = function () {
  var me = this;

  /* prep data */
  me.appstate = {};
  try {
    me.appstate = JSON.parse(me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].SYSTEMNOTE).appstate;
  }
  catch (err) {}

  me.data.RREC.FLEX_name = {};
  me.data.RREC.FLEX.MAIN.forEach(function (flex) {
    me.data.RREC.FLEX_name[flex.NAME.toUpperCase()] = Object.defineProperty(flex, 'nametoupper'
      , { value: flex.NAME.toUpperCase() }
    );
  });
  me.data.RREC.FLEX.CONFIG.forEach(function (flex) {
    me.data.RREC.FLEX_name[flex.NAME.toUpperCase()] = Object.defineProperty(flex, 'nametoupper'
      , { value: flex.NAME.toUpperCase() }
    );
  });
  me.data.RREC.INGPROD_keyname = me.listToIndex(me.data.RREC.INGPROD, 'KEYNAME');

  me.DWmsg = {
    client_mnemonic: me.data.RREC.META.CLIENT_MNEMONIC,
    domain: me.data.RREC.META.DOMAIN,
    loc_facility_cd: me.data.RREC.PATIENTINFO.LOC_FACILITY_CD,
    person_id: me.getProperty('personId'),
    encntr_id: me.getProperty('encounterId'),
    user_id: me.getProperty('userId'),
    physician_ind: (me.data.RREC.META.PHYSICIAN_IND == 1),
    position_cd: me.data.RREC.META.POSITION_CD,
    ppr_cd: me.data.RREC.META.PPR_CD,
    providerid: me.orderProviderId,
    site: 'Central', /* default, will update in .realSave() */
    orderid: 0, /* default, will update after .realSave() calls order server */
    advisor_open: Date.now(),
    advisor_close: 0, /* default, will update in .sendDWmsg() */
    close_action: '', /* default, will update in .close() */
    osmo: []
  };

  /* use what was 'adult' as the default */
  me.precision = {
    "default": 0,
    "macro": 2,
    "micro": 2,
    "salt": 1,
    "mL": 0,
    "gm": 0,
    "kg": 1
  };
  Object.keys(me.precision).forEach(function (k) {
    /* ... then update with configured preferences */
    me.precision[k] = parseFloat(me.pref('NUMBER_PRECISION_' + k, me.precision[k]));
  });

  /* figure out what products are shown based on counts/default/appstate */
  $.each([
    {
      keyname: 'Fat',
      appstateprop: 'prefFatText',
      prefkey: 'PREF_PRODUCT_FAT',
      prefconcentration: 'PREF_PRODUCT_FAT_DEFAULTCONCENTRATION',
      failsafeconcentration: 0.20
    },
    {
      keyname: 'Protein',
      appstateprop: 'prefProteinText',
      prefkey: 'PREF_PRODUCT_PROTEIN',
      prefconcentration: 'PREF_PRODUCT_PROTEIN_DEFAULTCONCENTRATION',
      failsafeconcentration: 0.10
    }
  ]
    , function (idxTODO, objTODO) {
    /* if there's only one product, it should be selected */
    if (me.data.RREC.INGPROD_keyname[objTODO.keyname].PRODUCT.length === 1) {
      me.data.RREC.INGPROD_keyname[objTODO.keyname].PRODUCT[0].SELECTED = 1;
    }
    else {
      var nextBest = undefined;
      var lastResort = undefined;
      var countSelected = 0;
      /* try to find a selected product */
      $.each(me.data.RREC.INGPROD_keyname[objTODO.keyname].PRODUCT, function (idxIP, objIP) {
        /* if we're iterating on the one that was selected in the advisor last time, remember it to use later */
        if (objIP.DISPLAY === me.appstate[objTODO.appstateprop]) {
          nextBest = objIP;
        }
        if (objIP.DISPLAY === me.pref(objTODO.prefkey, 'nope')) {
          lastResort = objIP;
        }
        /* increment the countSelected with the currently iterating object's SELECTED property */
        countSelected = countSelected + objIP.SELECTED;
      });
      /* if there were none selected and we found the one that should be selected, set it to selected */
      if (countSelected === 0 && nextBest !== undefined) {
        nextBest.SELECTED = 1;
        countSelected = 1; /* because we just selected it */
      }
      /* if still none selected, use the lastResort option */
      if (countSelected === 0 && lastResort !== undefined) {
        lastResort.SELECTED = 1;
        countSelected = 1; /* because we just selected it */
      }
      if (countSelected === 0) { /* still none selected? */
        /* either use the configured preferred concentation, or the hardcoded failsafe */
        var conc = parseFloat(me.pref(objTODO.prefconcentration, objTODO.failsafeconcentration));
        me.data.RREC.INGPROD_keyname[objTODO.keyname].PRODUCT.push({
          DISPLAY: String(conc * 100) + '%',
          CONCENTRATION: conc,
          SELECTED: 1
        });
        countSelected = 1; /* because we just added one preselected */
      }
    }
  });

  me.data.RREC.MODEL_CODE_name = me.listToIndex(me.data.RREC.MODEL_CODE, 'NAME');
  $.each(me.data.RREC.MODEL_CODE_name
    , function (cidx, code) {
      code.VALUE_display = me.listToIndex(code.VALUE, 'DISPLAY');
    }
  );

  me.data.RREC.CODE_map =
    me.data.RREC.CODE.reduce(
      function (st, itm) {
        st[itm.ID] = itm;
        st[itm.DISPLAY] = itm;
        st[itm.CVMKEY] = itm;
        return st;
      }
      , {}
    );
  me.data.RREC.ORDERDETAIL_map =
    me.data.RREC.OREQ.ORDERLIST[0].DETAILLIST.reduce(
      function (st, itm) {
        st[itm.OEFIELDMEANING] = itm;
        st[itm.OEFIELDDESCRIPTION] = itm;
        /* remove OEFIELDDESCRIPTION because it's not in the orderable */
        delete itm.OEFIELDDESCRIPTION;

        return st;
      }
      , {}
    );

  try {
    me.data.RREC.INGREDIENT_map =
    me.data.RREC.INGREDIENT.reduce(
      function (st, itm) {
        st[itm.KEYNAME] = itm;
        return st;
      }
      , {}
    );
  }
  catch (err) {
    me.data.RREC.INGREDIENT_map = {};
  }

  if (me.pref('PretermTraceCombo', 'NO') === 'YES') {
    /* create a PretermTraceCombo product from TraceElements & ZincSulfate */
    var TE = me.data.RREC.INGREDIENT_map['TraceElements'];
    var ZS = me.data.RREC.INGREDIENT_map['ZincSulfate'];
    var newItem = $.extend(true, {}, TE);
    newItem.KEYNAME = 'PretermTraceCombo';
    newItem.MNEMONIC = 'TraceElements&ZincSulfate'; /* this doesn't matter but is a good reminder */
    newItem.DISPLAY = 'Neonatal trace elements Plus Extra Zinc';
    newItem.SYNONYMID = 0;

    newItem.OLDVALUE = 0;
    newItem.NEWVALUE = 0;
    newItem.NOTE = [{
      TYPE: '',
      TEXT: '0.2 mL/kg'
    },
    {
      TYPE: '',
      TEXT: 'Provides additional 100 mcg/kg Zinc Sulfate for each 0.2 mL/kg of Neonatal trace elements'
    }
    ];

    /* get the old|new value from TE+ZS */
    $.each(["OLDVALUE", "NEWVALUE"], function (idx, prop) {
      /* if trace value is greater than 0 AND zinc value is greater than zero */
      if (TE[prop] > 0 && ZS[prop] > 0) {
        /* make this new item's value the amount from trace */
        newItem[prop] = TE[prop];
        /* since the value has moved to the new ingredient, remove it from both trace and zinc */
        TE[prop] = 0;
        ZS[prop] = 0;
      }
    });

    me.data.RREC.INGREDIENT_map[newItem.KEYNAME] = newItem;
  }

  /* look for MixE (standard) */
  volIng = me.data.RREC.INGREDIENT_map['MixE'];
  if (volIng
    && volIng.NEWVALUE > 0
  ) {
    me.setEditMode('Standard');
  }
  else { /* look for Mix (plus custom)*/
    volIng = me.data.RREC.INGREDIENT_map['Mix'];
    if (volIng
      && volIng.NEWVALUE > 0
    ) {
      me.setEditMode('Custom');
    }
    else { /* else it must be Water (compounding) */
      var volIng = me.data.RREC.INGREDIENT_map['TPNVolume'];
      if (!volIng) {
        var volIng = me.data.RREC.INGREDIENT_map['Water']; /* compounding */
      }
      me.setEditMode('Compound');
    }
  }
  me.data.RREC.INGREDIENT_map['Volume'] = volIng;


  me.data.RREC.REQUESTABLE_map =
    me.data.RREC.REQUESTABLE.reduce(
      function (st, itm) {
        itm.INGREDIENT_map =
          itm.INGREDIENT.reduce(
            function (ist, iitm) {
              /*
              if( iitm.MNEMONIC && iitm.MNEMONIC!='' ){ ist[ iitm.MNEMONIC ] = iitm; }
              */
              ist[iitm.KEYNAME] = iitm;
              return ist;
            }
            , {}
          );
        st[itm.MNEMONIC] = itm;
        return st;
      }
      , {}
    );


  var cmpd = me.data.RREC.REQUESTABLE[0];
  me.data.RREC.REQUESTABLE_list =
    me.data.RREC.REQUESTABLE.reduce(
      function (st, itm) {
        if (itm.DISPLAY != '') {
          var itmdisplay = itm.DISPLAY;

          var cstm = me.data.RREC.REQUESTABLE_map[itm.CUSTOMMNEMONIC];
          if (itm.CUSTOMMNEMONIC != "" && !cstm) {
            var nceid = me.NotifyConfigError(
              'Requestable "' + itm.MNEMONIC + '" CUSTOMMNEMONIC not found: "' + itm.CUSTOMMNEMONIC + '" '
            );
            /* itmdisplay = '<em title="Config Error (see above)">' + itm.DISPLAY + '</em>';
            */
          }

          var selected = (itm.MNEMONIC == me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERMNEMONIC
                          || (cstm && cstm.MNEMONIC == me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW].ORDERMNEMONIC)
          );

          st.push({
            DISPLAY: itmdisplay,
            Standard: itm,
            Custom: cstm,
            Compound: cmpd,
            selected: selected
          });

          if (selected) {
            me.PriorRequestableIdx = st.length - 1;
          }
        }
        return st;
      }
      , []
    );


  if (!me.PriorRequestableIdx) {
    if (me.data.RREC.REQUESTABLE_list
      && me.data.RREC.REQUESTABLE_list.length > 0
    ) {
      me.data.RREC.REQUESTABLE_list[0].selected = true;
    }
    else {
      //alert('No TPN solution available - check virtual view?');
    }
  }

  if (me.data.RREC.REQUESTABLE_list.length === 0
    || (
      me.data.RREC.REQUESTABLE_list[0] !== undefined
      && me.data.RREC.META.MODEPRODUCTMNEMONIC !== me.data.RREC.REQUESTABLE_list[0].Standard.MNEMONIC
    )
  ) {
    me.nomode = true;
  }


  me.data.RREC.PREMIXINFO_map =
    me.data.RREC.PREMIXINFO.reduce(
      function (st, itm) {
        itm.INGREDIENT_map =
          itm.INGREDIENT.reduce(
            function (ist, iitm) {
              ist[iitm.KEYNAME] = iitm;
              return ist;
            }
            , {}
          );
        st[itm.MNEMONIC] = itm;
        return st;
      }
      , {}
    );
};
uhspa.tpnadvisor.prototype.NotifyConfigError = function (msg) {
  var me = this;
  var jsNCE = $('#NotifyConfigError');
  if (jsNCE.length == 0) {
    jsNCE = $('<div id="NotifyConfigError">').appendTo(me.getTarget());
    $('<h1>Configuration Error</h1>').appendTo(jsNCE);
  }
  nceid = ((new Date()).getTime() + '' + Math.random()).replace(/\./g, '');
  $('<p id="NCE' + nceid + '">' + msg + '</p>').appendTo(jsNCE);
  return nceid;
};
uhspa.tpnadvisor.prototype.getCLAc = function (PIR) {
  var me = this;
  var rv = { Ac: 0, CL: 0, Error: '' };
  var CL = parseFloat(me.getValue('Chloride'));
  var Ac = parseFloat(me.getValue('Acetate'));

  var rdoChloride = me.getValue('rdoChloride');
  var rdoAcetate = me.getValue('rdoAcetate');

  if (rdoChloride == 'Custom'
    || rdoAcetate == 'Custom'
  ) {
    /* there isn't a ratio because one of these is known :: the other is used used for 'the rest' */
    // 20150820 msd Dr.Ali discovered that keying 0 custom acetate wasn't working if( Ac > 0 ){ /* Ac is specified */
    if (rdoAcetate == 'Custom') {
      if (parseFloat(me.maxP(Ac, me.precision['salt']))
        > parseFloat(me.maxP(PIR, me.precision['salt']))
      ) { /* too much Ac (negative) for PIR Positive Ion Remaining */
        rv.Error = 'Error: Solution is Unbalanced\n\n'
                  + 'Acetate ( ' + me.maxP(Ac, me.precision['salt']) + ' mEq ) EXCEEDS\n'
                  + 'Remaining Potassium and Sodium ( ' + me.maxP(PIR, me.precision['salt']) + ' mEq )'
        ;
      }
      else {
        /* After the Ac is used, the rest of PIR must be consumed by CL */
        CL = PIR - Ac;
      }
    }
    else { /* Ac wasn't specified, use CL */
      if (parseFloat(me.maxP(CL, me.precision['salt']))
        > parseFloat(me.maxP(PIR, me.precision['salt']))
      ) { /* too much XCL (negative) for PIR Positive Ion Remaining */
        rv.Error = 'Error: Solution is Unbalanced\n\n'
                  + 'Chloride ( ' + me.maxP(CL, me.precision['salt']) + ' mEq ) EXCEEDS\n'
                  + 'Remaining Potassium and Sodium ( ' + me.maxP(PIR, me.precision['salt']) + ' mEq )'
        ;
      }
      else {
        /* After the CL is used, the rest of PIR must be consumed by Ac */
        Ac = PIR - CL;
      }
    }
  }
  else {
    /* set electrolyte required based on ratio
      1:1 => 1 * PIR / (1+1) => 1/2 PIR
      1:2 => 1 * PIR / (1+2) => 1/3 PIR
             2 * PIR / (1+2) => 2/3 PIR
      etc
    */
    var ratioStr = me.getValue('ratioCLAc');
    if (ratioStr == '') {
      ratioStr = '1:1';
    }
    var ratio = ratioStr.split(':');

    ratioAc = parseInt(ratio[0], 10);
    ratioCL = parseInt(ratio[1], 10);

    Ac = (ratioAc * PIR) / (ratioAc + ratioCL);
    CL = (ratioCL * PIR) / (ratioAc + ratioCL);
  }
  rv.Ac = Ac;
  rv.CL = CL;
  return rv;
};
uhspa.tpnadvisor.prototype.EtoS = function (p) {
  /* compute (s)alts from (e)lectrolytes */
  /* chooses to consume DOM directly because proper interface encapsulation is hard, etc. */
  var me = this;

  var rv = {
    SodiumChloride: 0,
    SodiumAcetate: 0,
    SodiumPhosphate: 0,
    PotassiumChloride: 0,
    PotassiumAcetate: 0,
    PotassiumPhosphate: 0,
    CalciumGluconate: 0,
    MagnesiumSulfate: 0,
    Chloride: 0,
    Acetate: 0,
    Precipitation: 0,
    NonLipidVolume: 0,
    KorNaPhos: me.getValue('prefKNa'),
    log: [],
    Error: ''
  };

  var K = me.getValue('Potassium');
  var Na = me.getValue('Sodium');
  var Ca = me.getValue('Calcium');
  var Mg = me.getValue('Magnesium');
  var Phos = me.getValue('Phosphate');
  var CL = me.getValue('Chloride');
  var Ac = me.getValue('Acetate');


  rv.log.push('Begin Electrolyte to Salt Calculation');
  rv.log.push('K(' + K + ') '
            + 'Na(' + Na + ') '
            + 'Ca(' + Ca + ') '
            + 'Mg(' + Mg + ') '
            + 'Phos(' + Phos + ') '
            + 'CL(' + CL + ')[requested] '
            + 'Ac(' + Ac + ')[requested]'
  );
  rv.log.push('Phos pref: ' + rv.KorNaPhos);

  rv['CalciumGluconate'] = Ca;
  rv['MagnesiumSulfate'] = Mg;

  if (rv.KorNaPhos == 'Potassium') {
    E1 = {
      name: 'Potassium',
      phosratio: me.KPhosRatio,
      value: K
    }; /* E1 = electrolyte1 */
    E2 = {
      name: 'Sodium',
      phosratio: me.NaPhosRatio,
      value: Na
    }; /* E2 = electrolyte2 */
  }
  else {
    E1 = { name: 'Sodium', phosratio: me.NaPhosRatio, value: Na };
    E2 = { name: 'Potassium', phosratio: me.KPhosRatio, value: K };
  }

  /* is Phos more than E1.value + E2.value ? */
  var phoscation = (E1.value / E1.phosratio) + (E2.value / E2.phosratio);
  if (Phos > phoscation) {
    /* not enough positive ions to absorb all the negative ion in Phos */
    rv.Error = 'Error: Solution is Unbalanced\n\nPhosphate ( ' + me.maxP(Phos, me.precision['salt']) + ' mmol ) EXCEEDS\n'
            + 'Potassium and Sodium ( ' + me.maxP(phoscation, me.precision['salt']) + ' mmol )'
    ;
  }
  else {
    /* use Phos to consume E1 */
    var E1_r = E1.value - (Phos * E1.phosratio); /* E1_r : Electrolyte 1 remaining after combine with phosphate */
    if (E1_r >= 0) { /* there is E1 remaining */
      rv[E1.name + 'Phosphate'] = Phos;
      rv.log.push(E1.name + 'Phosphate(' + Phos + ')');

      var PIR = E1_r + E2.value; /* positive ion remaining */

      var CLAc = me.getCLAc(PIR);
      if (CLAc.Error) {
        rv.Error = CLAc.Error;
      }
      else {
        if (CLAc.CL > 0) {
          CL = CLAc.CL;
          rv.log.push('CL(' + CL + ') [computed]');
        }
        if (CLAc.Ac > 0) {
          Ac = CLAc.Ac;
          rv.log.push('Ac(' + Ac + ') [computed]');
        }
      }

      /* now sub2 */
      var E2_r = E2.value - Ac;
      if (E2_r >= 0) { /* we still have some E2 */
        rv[E2.name + 'Acetate'] = Ac;
        rv.log.push(E2.name + 'Acetate (' + Ac + ')');

        /* E1_r, E2_r => Chl (soak up the remainings with chloride) */
        rv[E1.name + 'Chloride'] = E1_r;
        rv.log.push(E1.name + 'Chloride (' + E1_r + ')');
        rv[E2.name + 'Chloride'] = E2_r;
        rv.log.push(E2.name + 'Chloride (' + E2_r + ')');
      }
      else { /* not enough sub2 for all the Ace */
        rv[E2.name + 'Acetate'] = E2.value; /* make E2Ac to consume all the E2 we have ... */
        rv.log.push(E2.name + 'Acetate (' + E2.value + ')');

        var Ac_r = Ac - E2.value; /* Ac remaining */
        var E1_r2 = E1_r - Ac_r; /* E1 remaining after E1Ac is made */

        /* put E1_r with Ac_r */
        rv[E1.name + 'Acetate'] = Ac_r;
        rv.log.push(E1.name + 'Acetate (' + Ac_r + ')');

        /* put E1_r2 into Chloride */
        rv[E1.name + 'Chloride'] = E1_r2;
        rv.log.push(E1.name + 'Chloride (' + E1_r2 + ')');
        /* there won't be a case that Ac_r is larger than E1_r, E1+CL will never be negative b/c handled above */
      }
    }
    else { /* there wasn't enough E1 for all the Phos */
      rv[E1.name + 'Phosphate'] = (E1.value / E1.phosratio); /* make as much E1Phos as we can */
      rv.log.push(E1.name + 'Phosphate (' + (E1.value / E1.phosratio) + ')');

      var Phos_r = Phos - (E1.value / E1.phosratio); /* Phos remaining = how much we started with minus E1Phos */
      if (Phos_r > 0) {
        rv[E2.name + 'Phosphate'] = Phos_r; /* use E2 for the rest of the phos */
        rv.log.push(E2.name + 'Phosphate (' + Phos_r + ')');
      }

      var E2_r = ((E2.value / E2.phosratio) - Phos_r) * E2.phosratio; /* how much E2 remains after E2Phos is made (* convert back to mEq from mmol) */
      if (E2_r > 0) {
        var CLAc = me.getCLAc(E2_r); /* returns CL and Ac based on required Positive Ions Remaining (E2_r) */
        if (CLAc.Error) {
          rv.Error = CLAc.Error;
        }
        else {
          if (CLAc.CL > 0) {
            CL = CLAc.CL;
            rv.log.push('CL(' + CL + ') [computed]');
          }
          if (CLAc.Ac > 0) {
            Ac = CLAc.Ac;
            rv.log.push('Ac(' + Ac + ') [computed]');
          }
        }

        /* make E2CL */
        rv[E2.name + 'Chloride'] = CL;
        rv.log.push(E2.name + 'Chloride (' + CL + ')');

        /* make E2Ac */
        rv[E2.name + 'Acetate'] = Ac;
        rv.log.push(E2.name + 'Acetate (' + Ac + ')');
      }

      rv['Chloride'] = CL;
      rv['Acetate'] = Ac;
    }
  }

  /* 20181001msd - new precipitation checking */
  /* what line type?  peripheral typically contains less dextrose (for osmo reasons) and that affects solubility */
  if (me.getValue('IVAdminSite') === 'Peripheral') {
    rv['linetype'] = 'Peripheral';
    rv['limit'] = me.pref('PRECIPITATION_THRESHOLD_PERIPHERAL', 'OFF');
  }
  else {
    rv['linetype'] = 'Central';
    rv['limit'] = me.pref('PRECIPITATION_THRESHOLD_CENTRAL', 'OFF');
  }
  /* if the limit is not set to off */
  if (rv['limit'] !== 'OFF') {
    rv['NonLipidVolumeML'] = parseFloat(me.getValue('NonLipidVolume'));
    rv['TotalVolumeML'] = parseFloat(me.getValue('TotalVolume'));

    /* admixture determines volume to use */
    rv['admixture'] = me.getValue('admixture');
    if (rv['admixture'] === '2:1') {
      rv['precipitation_volume_ml'] = rv['NonLipidVolumeML'];
    }
    else {
      rv['precipitation_volume_ml'] = rv['TotalVolumeML'];
    }
    /* since we're in a salt calculation, use the salts to refer to the requested total amount of electrolytes */
    rv['CaMEQ'] = rv['CalciumGluconate'];
    rv['PhosMMOL'] = rv['SodiumPhosphate'] + rv['PotassiumPhosphate'];

    /* retrieve function body from configuration */
    rv['precipitation_function'] = me.pref('PRECIPITATION_FUNCTION', 'return (CaMEQ+PhosMMOL)/VolumeML*1000>LIMIT');

    /* create a new function with 4 parameters and the function body,
      call it with the corresponding inputs,
      assign this to the precipitation_risk property
      */
    try {
      rv['precipitation_risk'] = (new Function('CaMEQ', 'PhosMMOL', 'VolumeML', 'LIMIT', rv['precipitation_function']))(
        rv['CaMEQ'],
        rv['PhosMMOL'],
        rv['precipitation_volume_ml'],
        parseFloat(rv['limit'])
      );
    }
    catch (err) {
      rv.Error = err.description + '\n\n' + rv['precipitation_function'] + '\n\n'
        + 'Supported parameters: '
        + '\n  CaMEQ, PhosMMOL, VolumeML, LIMIT'
      ;
    }
    rv.log.push('precipitation_risk: ' + rv['precipitation_risk']);
    if (rv['precipitation_risk'] === true) {
      var warn = me.pref('PRECIPITATION_WARNTEXT', 'Precipition Risk for LINE exceeds LIMIT');
      warn = warn.replace(/LINE/g, rv['linetype']);
      warn = warn.replace(/LIMIT/g, rv['limit']);
      warn = warn.replace(/CaMEQ/g, rv['CaMEQ']);
      warn = warn.replace(/PhosMMOL/g, rv['PhosMMOL']);
      warn = warn.replace(/VolumeML/g, rv['precipitation_volume_ml']);
      rv['precipitation_warn'] = warn;
      rv.Error = 'Error: Precipitation Risk\n\n' + warn;
    }
  }

  if (me.EditMode == 'Compound') {
    if (rv.Error != '') {
      if (me.saltError === undefined || me.saltError === false) {
        /* prevent refiring this alert */
        me.saltError = true;
        /* shoot me now */
        alert(rv.Error);
      }
      rv.log.push(rv.Error);
    }
    else {
      me.saltError = false; /* reset the saltError flag (don't refire until it's been fixed or forced) */
    }
  }
  else {
    rv.Error = ''; /* reset to blank because only Compound mode shows or cares about salt/precip errors */
  }
  rv.log.push('End Electrolyte to Salt Calculation');


  return rv;
};
uhspa.tpnadvisor.prototype.EfromS = function (e, v) {
  var me = this;
  var rv = 0;
  switch (e) {
    case 'prefKNa' : /* return the electrolyte preference by examining salts */
      /* if config prefs sodium and otherwise indeterminant, use sodium */
      if (me.pref('pref_salt_phosphate', 'Sodium') === 'Sodium'
        && (parseFloat(me.data.RREC.INGREDIENT_map['SodiumPhosphate'][v]) || 0) === 0
        && (parseFloat(me.data.RREC.INGREDIENT_map['PotassiumPhosphate'][v]) || 0) === 0
      ) {
        rv = 'Sodium';
      }
      else {
      /* else not pref sodium or there is a non-zero value for one of the these so determine from values */
        rv = (((parseFloat(me.data.RREC.INGREDIENT_map['SodiumPhosphate'][v]) || 0) * me.NaPhosRatio)
            > ((parseFloat(me.data.RREC.INGREDIENT_map['PotassiumPhosphate'][v]) || 0) * me.KPhosRatio)
          ? 'Sodium'
          : 'Potassium'
        );
      }
      break;
    case 'ratioCLAc' :
      /* use inclusive ranges top and bottom because that's how "normal" people think */
      rv = ''; /* don't have a ratio at all */
      var Ac = me.EfromS('Acetate', v);
      var Ch = me.EfromS('Chloride', v);
      if (Ac === 0 && Ch === 0) { /* 20190305 special case of 0+0 is the default 1:1 balance */
        rv = '1ac:1ch';
      }
      else {
        var AcCh = Ac / Ch; /* acetate to chloride */
        var ChAc = Ch / Ac; /* chloride to acetate */
        if (AcCh >= 0.9 && AcCh <= 1.1) {
          rv = '1ac:1ch';
        }
        if (AcCh >= 1.8 && AcCh <= 2.2) {
          rv = '2ac:1ch';
        }
        if (AcCh >= 2.7 && AcCh <= 3.3) {
          rv = '3ac:1ch';
        }
        if (ChAc >= 1.8 && ChAc <= 2.2) {
          rv = '1ac:2ch';
        }
        if (ChAc >= 2.7 && ChAc <= 3.3) {
          rv = '1ac:3ch';
        }
      }
      break;
    case 'Potassium' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['PotassiumChloride'][v]) || 0)
          + (parseFloat(me.data.RREC.INGREDIENT_map['PotassiumAcetate'][v]) || 0)
          + ((parseFloat(me.data.RREC.INGREDIENT_map['PotassiumPhosphate'][v]) || 0) * me.KPhosRatio)
      ;
      break;
    case 'Sodium' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['SodiumChloride'][v]) || 0)
          + (parseFloat(me.data.RREC.INGREDIENT_map['SodiumAcetate'][v]) || 0)
          + ((parseFloat(me.data.RREC.INGREDIENT_map['SodiumPhosphate'][v]) || 0) * me.NaPhosRatio)
      ;
      break;
    case 'Calcium' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['CalciumGluconate'][v]) || 0);
      break;
    case 'Magnesium' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['MagnesiumSulfate'][v]) || 0);
      break;
    case 'Phosphate' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['SodiumPhosphate'][v]) || 0)
          + (parseFloat(me.data.RREC.INGREDIENT_map['PotassiumPhosphate'][v]) || 0)
      ;
      break;
    case 'Chloride' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['SodiumChloride'][v]) || 0)
          + (parseFloat(me.data.RREC.INGREDIENT_map['PotassiumChloride'][v]) || 0)
      ;
      break;
    case 'Acetate' :
      rv = (parseFloat(me.data.RREC.INGREDIENT_map['SodiumAcetate'][v]) || 0)
          + (parseFloat(me.data.RREC.INGREDIENT_map['PotassiumAcetate'][v]) || 0)
      ;
      break;
  }

  return rv;
};
uhspa.tpnadvisor.prototype.computePremixAmount = function (ing, DW_kg, tVol) {
  /* how much ingredient is in a given volume */
  var concentration = (ing.STRENGTHDOSEVALUE / ing.VOLUMEDOSEVALUE);
  /* the total amount of the ingredient is the concentration times total volume */
  var amt = concentration * tVol;

  /* is this ingredient measured as gm/mL? */
  if (ing.STRENGTHDOSEUNITDISP == 'gm'
    && ing.VOLUMEDOSEUNITDISP == 'mL'
  ) { /* yes:: the advisor is gm per kg, so divide */
    if (DW_kg > 0) {
      vl = (amt) / DW_kg;
    }
    else { /* this is technically an error, but zero it rather than NaN */
      vl = 0.0;
    }
  }
  else { /* No :: just return the total amount of ingredient at the requested volume */
    vl = amt;
  }

  return vl;
};
uhspa.tpnadvisor.prototype.maxP = function (n, p) {
  /* since .toFixed() natively returns a string version of a number, I think it's ok to do the same here */
  var rv = n;
  if (typeof rv == 'number') {
    rv = rv.toFixed(p);
    if ((/\./).test(rv)) {
      rv = rv.replace(/\.?0+$/, '').replace(/\.$/, ''); /* trim trailing zeroes on a .toFixed(2) string version of the number (also eat the literal dot to prevent a trailing weird dot) */
    }
  }
  return rv;
};
uhspa.tpnadvisor.prototype.draw = function () {
  var me = this;

  var DW_kg = me.getValue('DoseWeightKG');
  var vVolPerKG = me.getValue('VolumePerKG');
  var vTotalVolume = me.getValue('TotalVolume');
  var vInfuseOver = me.getValue('InfuseOver');
  var vLipidInfuseOver = me.getValue('LipidInfuseOver');
  var admixture = me.getValue('admixture');
  if (admixture === '3:1') {
    vLipidInfuseOver = vInfuseOver;
  }

  var P_kgd = me.getValue('Protein') || 0;
  var C_kgd = me.getValue('Carbohydrates') || 0;
  var F_kgd = me.getValue('Fat') || 0;

  /* lipid/non-lipid volume
  vol * 20gm/100mL = 50gm ( volume times concentration = amount )
  vol * ( 0.2 )gm/mL = 50gm ( reduce concentration )
  vol = 50g / 0.2gm/mL ( divide both sides by concentration )
  vol = 250mL (this is what we wanted to know)
  */
  var oiN = me.data.RREC.ORDERINFO[me.data.RREC.META.NORDNEW];
  //var lipidConcentration = parseFloat(oiN.LIPIDCONCENTRATION || 0.2); /* 20% = 20g/100mL */
  var lipidConcentration = parseFloat(me.getValue('prefFatConcentration'));
  var lipidAmountTotal = F_kgd * DW_kg;
  var lipidVolTotal = lipidAmountTotal / lipidConcentration;
  var lipidVolKG = lipidVolTotal / DW_kg;
  var lipidvolhr = lipidVolTotal / vLipidInfuseOver;

  //var proteinConcentration = parseFloat( oiN.PROTEINCONCENTRATION||0.1 ); /* 10% = 10g/100mL */
  var proteinConcentration = parseFloat(me.getValue('prefProteinConcentration'));
  var proteinAmountTotal = P_kgd * DW_kg;
  var proteinVolTotal = parseFloat(proteinAmountTotal / proteinConcentration);

  var carbConcentration = parseFloat(oiN.CARBCONCENTRATION || 0.7); /* 70% = 70g/100mL */
  var carbAmountTotal = C_kgd * DW_kg;
  var carbVolTotal = parseFloat(carbAmountTotal / carbConcentration);

  var minvolkg = (lipidVolTotal + proteinVolTotal + carbVolTotal) / DW_kg || 0;
  var objMinVol = me.getObject('minvol');

  objMinVol.find('span')
    .text(me.maxP(minvolkg, me.precision['mL']))
    //.prop('title', 'f: ' + lipidVolTotal + ',p:' + proteinVolTotal + ',c:' + carbVolTotal )
  ;

  if (objMinVol.length > 0 && objMinVol.find('input').get(0).checked) {
    var objVpKg = me.getObject('VolumePerKG');
    objVpKg.val(me.maxP(minvolkg, me.precision['mL']));
    var vVolPerKG = minvolkg;
    var vTotalVolume = vVolPerKG * DW_kg;
  }

  var nonlipidVolTotal = vTotalVolume - lipidVolTotal;
  var nonlipidVolKG = nonlipidVolTotal / DW_kg;
  var nonlipidvolhr = nonlipidVolTotal / vInfuseOver;

  var jqLipidVolTotal = me.getObject('LipidVolTotal');
  jqLipidVolTotal.val(me.maxP(lipidVolTotal, jqLipidVolTotal.data('precision')));
  var jqNonLipidVolTotal = me.getObject('NonLipidVolTotal');
  jqNonLipidVolTotal.val(me.maxP(nonlipidVolTotal, jqNonLipidVolTotal.data('precision')));
  // /*
  var jqLipidVolHR = me.getObject('lipidvolhr');
  jqLipidVolHR.val(me.maxP(lipidvolhr, jqLipidVolTotal.data('precision')));
  var jqNonLipidVolHR = me.getObject('nonlipidvolhr');
  jqNonLipidVolHR.val(me.maxP(nonlipidvolhr, jqLipidVolTotal.data('precision')));
  // */
  var P_kckgd = me.kcalgm['Protein'] * P_kgd;
  var C_kckgd = me.kcalgm['Carbohydrates'] * C_kgd;
  var F_kckgd = me.kcalgm['Fat'] * F_kgd;
  var T_kckgd = P_kckgd + C_kckgd + F_kckgd;

  if (admixture === '3:1') {
    me.dexpcnt = 100 * C_kgd * DW_kg / vTotalVolume;
  }
  else {
    me.dexpcnt = (nonlipidVolTotal <= 0) ? '' : 100 * C_kgd * DW_kg / nonlipidVolTotal;
  }

  $.each([{ n: 'Volume' + 'rate', v: vTotalVolume / vInfuseOver },
    { n: 'Volume' + 'tvol', v: vTotalVolume },
    { n: 'Protein' + 'gmd', v: P_kgd * DW_kg },
    { n: 'Protein' + 'kcd', v: P_kckgd * DW_kg },
    { n: 'Carbohydrates' + 'gmd', v: C_kgd * DW_kg },
    {
      n: 'Carbohydrates' + 'gmpcnt',
      v: me.dexpcnt
    },
    {
      n: 'Carbohydrates' + 'mgkgmin',
      v: C_kgd * 1000 / (vInfuseOver * 60)
    },
    { n: 'Carbohydrates' + 'kcd', v: C_kckgd * DW_kg },
    { n: 'Fat' + 'gmd', v: F_kgd * DW_kg },
    { n: 'Fat' + 'kcd', v: F_kckgd * DW_kg }
  ]
    , function (idx, obj) {
    var ref = $('#' + me.id + obj.n);
    ref.text(me.maxP(obj.v, ref.data('precision')));
  }
  );


  $('section.additive input[data-keyname]').each(
    function (sidx) {
      var ths = $(this);
      var kn = ths.data('keyname');
      var p = ths.data('precision') - 1;
      if (p < 0) {
        p = 0;
      }

      $('#' + me.id + kn + 'tvol').text(me.maxP(me.getValue(kn), p));
    }
  );

  var jqSumForm = $('.volenergy').find('table.sumform');
  jqSumForm.find('tr.protein').find('.pcnt').text(me.maxP((100 * P_kckgd / T_kckgd || 0), 1));
  jqSumForm.find('tr.carbohydrates').find('.pcnt').text(me.maxP((100 * C_kckgd / T_kckgd || 0), 1));
  jqSumForm.find('tr.fat').find('.pcnt').text(me.maxP((100 * F_kckgd / T_kckgd || 0), 1));

  jqSumForm.find('tr.protein').find('.kckgd').text(me.maxP(P_kckgd, me.precision['kg']));
  jqSumForm.find('tr.carbohydrates').find('.kckgd').text(me.maxP(C_kckgd, me.precision['kg']));
  jqSumForm.find('tr.fat').find('.kckgd').text(me.maxP(F_kckgd, me.precision['kg']));
  jqSumForm.find('tr.total').find('.kckgd').text(me.maxP(T_kckgd, me.precision['kg']));

  jqSumForm.find('tr.protein').find('.kcd').text(me.maxP((P_kckgd * DW_kg), 0));
  jqSumForm.find('tr.carbohydrates').find('.kcd').text(me.maxP((C_kckgd * DW_kg), 0));
  jqSumForm.find('tr.fat').find('.kcd').text(me.maxP((F_kckgd * DW_kg), 0));
  jqSumForm.find('tr.total').find('.kcd').text(me.maxP((T_kckgd * DW_kg), 0));

  $('.TotalEnergy span.rom').text(me.maxP(T_kckgd, 0));

  var salt = me.EtoS();
  var minAmtToShow = 0;

  var E = [{
    name: 'Potassium',
    S: [{ label: 'Potassium Chloride', prop: 'PotassiumChloride' },
      { label: 'Potassium Acetate', prop: 'PotassiumAcetate' },
      {
        label: 'Potassium Phosphate',
        prop: 'PotassiumPhosphate',
        UOM: 'mmol'
      }
    ]
  },
  {
    name: 'Sodium',
    S: [{ label: 'Sodium Chloride', prop: 'SodiumChloride' },
      { label: 'Sodium Acetate', prop: 'SodiumAcetate' },
      {
        label: 'Sodium Phosphate',
        prop: 'SodiumPhosphate',
        UOM: 'mmol'
      }
    ]
  },
  {
    name: 'Calcium',
    S: [{ label: 'Calcium Gluconate', prop: 'CalciumGluconate' }
    ]
  },
  {
    name: 'Magnesium',
    S: [{ label: 'MagnesiumSulfate', prop: 'MagnesiumSulfate' }
    ]
  },
  {
    name: 'Phosphate',
    S: [{
      label: 'Potassium Phosphate',
      prop: 'PotassiumPhosphate',
      UOM: 'mmol'
    },
    {
      label: 'Sodium Phosphate',
      prop: 'SodiumPhosphate',
      UOM: 'mmol'
    }
    ]
  },
  {
    name: 'Chloride',
    S: [{ label: 'Potassium Chloride', prop: 'PotassiumChloride' },
      { label: 'Sodium Chloride', prop: 'SodiumChloride' }
    ]
  },
  {
    name: 'Acetate',
    S: [{ label: 'Potassium Acetate', prop: 'PotassiumAcetate' },
      { label: 'Sodium Acetate', prop: 'SodiumAcetate' }
    ]
  }
  ];

  $.each(E
    , function (Eidx, Eobj) {
      /* jquery reference to the currently iterating electrolyte object's name */
      var jqE = me.getObject(Eobj.name);
      /* jquery reference to the closest .b1 ancestor */
      var jqEb1 = jqE.closest('.b1');
      /* refer to total value in the jqEb1 */
      var jqEtotal = jqEb1.find('.total .vl');
      /* if it was found */
      if (jqEtotal.length > 0) {
        /* if the electrolyte's uom minus the "per kg" part is equal to the total's uom sibling text */
        if (jqE.data('uom').replace(/kg\//, '') === jqEtotal.siblings('.uom').text()) {
          /* try to get the electrolyte amount from the salt object returned by EtoS() */
          var ev = ((/Chloride|Acetate/).test(Eobj.name)
          /* the two salts that make these electrolytes */
            ? salt['Potassium' + Eobj.name] + salt['Sodium' + Eobj.name]
          /* the input amount times the weight */
            : parseFloat(jqE.val()) * DW_kg
          );
          /* set the total's text with ev using the same precision as the input; fix the appearance of 'negative zero' */
          var setvalue = (ev <= 0 ? '0' : me.maxP(ev, jqE.data('precision')));
          jqEtotal.text(setvalue);
        }
      }
      jqEb1.find('.salt').remove(); /* clear whatever was shown here */
      /* convey error states */
      if (Eobj.name === 'Phosphate') {
        if ((/Solution is Unbalanced/).test(salt.Error)) {
          jqEb1.append('<dd class="salt uhspa-salt-error">Solution is Unbalanced</dd>');
        }
      }
      if (Eobj.name === 'Calcium') {
        if ((/Precipitation Risk/).test(salt.Error)) {
          jqEb1.append('<dd class="salt uhspa-salt-error">Precipitation Risk</dd>');
        }
      }
      /* if no error, show the salt details */
      if (salt.Error === '') {
        $.each(Eobj.S
          , function (sidx, sobj) {
            var disp = me.maxP(salt[sobj.prop], me.precision['salt']);
            if (parseFloat(disp) > 0) {
              jqEb1.append('<dd class="salt">' + sobj.label + ': ' + disp + ' ' + (sobj.UOM || 'mEq') + '/day</dd>');
            }
          }
        );
      }
    }
  );

  if (me.pref('TRACE_EXCLUSIVITY', 'NONE') === 'MUTUAL') {
    /* 20160331msd #2124157 Trace more special handling .. */
    var TE = $().add(me.getObject('TraceElements'))
      .add(me.getObject('Trace4'))
      .add(me.getObject('Trace4C'))
      .add(me.getObject('Trace5'))
      .add(me.getObject('Trace5C'))
        ;
    var TECom = me.getObject('PretermTraceCombo');
    var TEzn = me.getObject('ZincSulfate');
    var TEcu = me.getObject('Copper');
    var TEmn = me.getObject('Manganese');
    var TEcr = me.getObject('Chromium');
    var TEse = me.getObject('Selenium');
    var TEparts = $().add(TEzn).add(TEcu).add(TEmn).add(TEcr); /* start with trace4 */
    switch (TE.eq(0).data('keyname')) {
      case 'Trace5' : /* falls through */
      case 'Trace5C' : /* falls through */
        TEparts.add(TEse); /* if trace5/5c, add the selenium */
        break;
    }

    /* start with mutually exclusive groups available */
    $().add(TEparts).add(TE).add(TECom)
      .prop('readonly', false)
      .removeAttr('title')
      .closest('li').removeClass('dithered')
    ;
    /* conditionally set a group to 'dithered' state */
    if (parseFloat(TE.val()) > 0) {
      $().add(TEparts).add(TECom)
        .prop('readonly', true)
        .prop('title', "To enable this: set 'Neonatal trace elements' to zero")
        .closest('li').addClass('dithered')
      ;
    }
    if (parseFloat(TECom.val()) > 0) {
      $().add(TEparts).add(TE)
        .prop('readonly', true)
        .prop('title', "To enable this: set 'Preterm trace elements' to zero")
        .closest('li').addClass('dithered')
      ;
    }
    if (TEparts.filter(function (idx, obj) {
      return parseFloat($(obj).val()) > 0;
    }).length > 0) {
      $().add(TE).add(TECom)
        .prop('readonly', true)
        .prop('title', "To enable this: set Zinc, Copper, Manganese, and Chromium to zero")
        .closest('li').addClass('dithered')
      ;
    }
    /* /20160331msd #2124157 */
  }

  /* 20180810 msd CD-1705 sprint ends today and implementing ALTUOM reference range is more work (ie: risk) than it's worth
    to implement this neo-specific functionality as an extra-extra build.  So replace this specific feature with a FLEX name
    and leave the extra-extra to either a specific ask or for TPN Advisor burndown+do-over
  */
  var multivitamintvolmax = me.pref('MULTIVITAMIN_TVOL_MAX', 'OFF');
  if (multivitamintvolmax !== 'OFF') { /* because else there's no need to check on this */ /* 20161122msd #2408512 hard stop the neo multivitamin on total >5mL/day */
    var pfmvtvmax = parseFloat(multivitamintvolmax);
    var kn = 'MultiVitamin';
    var jqTotalMVI = $('#' + me.id + kn + 'tvol');

    if (parseFloat(jqTotalMVI.text()) > pfmvtvmax) {
      var jqMVIperKG = me.getObject(kn);
      var dwkg = me.getValue('DoseWeightKG');
      var maxPerKG = me.maxP(pfmvtvmax / dwkg, 2);
      var msg = 'Multivitamin '
              + jqMVIperKG.val() + ' mL/kg * ' + dwkg + ' kg exceeds maximum of ' + pfmvtvmax + ' mL'
              + '\n'
              + '\n' + 'Reset to maximum: ' + maxPerKG + ' mL/kg ?';
      if (!jqMVIperKG.data('warned') && confirm(msg)) {
        jqMVIperKG.val(maxPerKG);
        setTimeout(function () {
          me.draw();
        }, 10); /* after current execution stack, redraw */
      }
      else {
        /* i've already pestered you about this, so don't pester again... */
        jqMVIperKG.data('warned', true);
        jqMVIperKG.data('warnfn', function (evt) {
          jqMVIperKG.data('warned', false); /* reset pester flag */
          jqMVIperKG.off('blur', jqMVIperKG.data('warnfn')); /* remove event listener */
        });
        /* ... until change resets this flag */
        jqMVIperKG.on('change', jqMVIperKG.data('warnfn'));
      }
    }
  }

  /* Check for 0 requirement satisfied */
  var jqDW_kg = me.getObject('DoseWeightKG');
  if (parseFloat(jqDW_kg.val()) == 0 || jqDW_kg.val() == '') {
    jqDW_kg.removeClass('uhspa-satisfied');
  }
  else {
    jqDW_kg.addClass('uhspa-satisfied');
  }
  var jqVolPerKG = me.getObject('VolumePerKG');
  if (parseFloat(jqVolPerKG.val()) == 0 || jqVolPerKG.val() == '') {
    jqVolPerKG.removeClass('uhspa-satisfied');
  }
  else {
    jqVolPerKG.addClass('uhspa-satisfied');
  }

  /* 20161013 msd compute osmolarity
    i considered tracking this throughout the above code rather than iterating collections more than once,
    but the number of times i've come back to turn on/off features makes me think this would be better handled
    in a redundant iteration that is easily isolated to an on/off code block
  */
  if (true /* compute osmolarity */) {
    var osmodbg = $('#osmodbg');
    osmodbg.text('');
    /* from the .save() method: find the current template for orderable */
    var tmpl = me.data.RREC.REQUESTABLE_list[
      $('.sltn').find('input:checked').val()
    ][me.EditMode];

    if (tmpl) {
      var osmoTotal = 0;
      var osmoFat = 0;
      var osmoBase = 0;
      var osmoLabel = "";
      var osmoValue = 0;

      /* if premix start with base osmo */
      var pmi = me.data.RREC.PREMIXINFO_map[tmpl.MNEMONIC];

      if (pmi) {
        if (pmi.INGREDIENT_map.Fat === undefined) { /* premix has no lipid in it */
          osmoBase = osmoBase + ((nonlipidVolTotal / 1000) * pmi.BASE_OSMOLARITY);
          osmodbg.text(osmodbg.text() + '\nnonlipidVolTotal = ' + nonlipidVolTotal);
          osmodbg.text(osmodbg.text() + '\npmi.BASE_OSMOLARITY = ' + pmi.BASE_OSMOLARITY);
          osmodbg.text(osmodbg.text() + '\nosmoBase = ' + osmoBase);
        }
        else {
          osmoBase = osmoBase + ((vTotalVolume / 1000) * pmi.BASE_OSMOLARITY);
          osmodbg.text(osmodbg.text() + '\nvTotalVolume = ' + vTotalVolume);
          osmodbg.text(osmodbg.text() + '\npmi.BASE_OSMOLARITY = ' + pmi.BASE_OSMOLARITY);
          osmodbg.text(osmodbg.text() + '\nosmoBase = ' + osmoBase);
        }
      }

      /* iterate ingredient/line items */
      $.each(tmpl.INGREDIENT, function (idxIng, objIng) {
        var osmoIngedient = 0;
        var amt = 0;
        var keyname = objIng.KEYNAME;

        var ingredient = me.data.RREC.INGREDIENT_map[keyname];

        if (ingredient) {
          /* try to get value directly from application */
          var obj = me.getObject(keyname);
          var amt = me.getValue(keyname);

          //if( (/\/kg\//i).test( obj.data('uom') ) ){
          if (keyname == 'Protein'
            || keyname == 'Carbohydrates'
            || keyname == 'Fat'
          ) {
            amt = amt * DW_kg;
          }

          /* if not, try to get from salt */
          if (String(amt) === 'undefined' || isNaN(amt)) {
            amt = salt[keyname];
          }
          /* if not, reset to zero (give up) */
          if (String(amt) === 'undefined' || isNaN(amt)) {
            amt = 0;
          }

          /* multiply amt times ratio */
          osmoIngedient = amt * ingredient.OSMO_RATIO;

          if (keyname == 'Fat') {
            osmoFat = osmoIngedient;
            if (!pmi || pmi.INGREDIENT_map.Fat === undefined) { /* no premix OR the premix does not have lipid in it */
              osmoTotal = osmoTotal + osmoIngedient;
            }
          }
          else {
            osmoTotal = osmoTotal + osmoIngedient;
          }

          osmodbg.text(osmodbg.text() + '\n' + keyname + '(' + String(amt) + ' * ' + String(ingredient.OSMO_RATIO) + ') = ' + osmoIngedient);
        }
      });

      osmoTotalPerL = (osmoTotal + osmoBase) / (vTotalVolume / 1000);


      osmodbg.text(osmodbg.text() + '\nosmoFat = ' + osmoFat);
      osmodbg.text(osmodbg.text() + '\nosmoTotal = ' + osmoTotal);
      osmodbg.text(osmodbg.text() + '\nosmoTotalPerL = ' + osmoTotalPerL);

      if ((osmoBase > 0 /* premix */
              && pmi.INGREDIENT_map.Fat === undefined /* does NOT have lipid in it */
      )
          //|| me.pref('ADMIXTURE_DEFAULT', '3:1') !== '3:1'
          || me.getValue('admixture') === '2:1'
      ) {
        osmoLabel = 'Est. Non-Lipid mOsm/L: ';
        osmoValue = (osmoBase + osmoTotal - osmoFat) / (nonlipidVolTotal / 1000);
      }
      else {
        osmoLabel = 'Est. Total mOsm/L: ';
        osmoValue = (osmoTotal + osmoBase) / (vTotalVolume / 1000);
      }

      if (vTotalVolume === 0) {
        $('#OsmoLabel').text('mOsm/L: ');
        $('#OsmoValue').html('<span style="font-size:smaller;">(Unknown Volume)</span>');
      }
      else {
        $('#OsmoLabel').text(osmoLabel);
        $('#OsmoValue').text(me.maxP(osmoValue, 0));
      }
    }
  }

  $('.uhspa-tpnadvisor-ingnote-dynamic').each(function (idx, ingnote) {
    var p = $(ingnote).closest('.b0');
    var ctx = p.find('dt').text();
    var notesrc = p.find('.uhspa-tpnadvisor-ingnote-source').text();
    var parsed = me.evaluate.apply(me, [notesrc, ctx]);
    var noteparsed = p.find('.uhspa-tpnadvisor-ingnote-parsed');
    noteparsed.html(parsed.replace(/\n/g, '<br>'));
  });

  /* hack to fixup sizes of boxes */
  $('ul.ing').find('li').each(function (idxing, jqIng) {
    var maxheight = 0;
    var boxes = $(jqIng).find('dl');
    boxes.each(function (idxbox, box) {
      var thisheight = parseFloat($(box).height('auto').css('height'));
      if (thisheight > maxheight) {
        maxheight = thisheight;
      }
    });
    boxes.css('height', '' + maxheight + 'px');
  });
};
uhspa.tpnadvisor.prototype.loadAllergy = function () {
  var me = this;
  var laf =

  me.loadCCL(
    'UHS_MPG_GET_ALLERGIES'
    , [
      "MINE",
      this.getProperty("personId"),
      this.getProperty("encounterId"),
      0.0,
      this.getProperty("userId"),
      0.0
    ]
    , function laf(data) {
      if (data) {
        var jqTgt = $(me.getTarget()).find(".allergy_data");
        jqTgt.html('');

        //$( '<textarea>' + JSON.stringify( data ) + '</textarea>' ).appendTo( jqTgt );
        try {
          $.each(data.RECORD_DATA.ALLERGY
            , function (idx, el) {
              $('<span>' + el.NAME + '</span>').appendTo(jqTgt);
            }
          );
        }
        catch (err) {
          $('<span>Load failed</span><span>Click to Open Allergy Widget</span>').appendTo(jqTgt);
        }
      }
    }
    , 'JSON'
  );
};
uhspa.tpnadvisor.prototype.lab = function (cn, esn) {};
uhspa.tpnadvisor.prototype.spark = function () {
  var me = this;

  var endDate = (new Date());
  var startDate = (new Date());

  var lkb = me.data.RREC.META.LOOKBACK.split(/[\s,]/);
  var diff = 0;
  switch (lkb[1].toUpperCase()) {
    case 'W' : diff = parseFloat(lkb[0]) * 7 * 24 * 60 * 60 * 1000; break;
    case 'D' : diff = parseFloat(lkb[0]) * 24 * 60 * 60 * 1000; break;
    case 'H' : diff = parseFloat(lkb[0]) * 60 * 60 * 1000; break;
    case 'M' : diff = parseFloat(lkb[0]) * 60 * 1000; break;
    case 'S' : diff = parseFloat(lkb[0]) * 1000; break;
  }

  startDate.setTime(endDate.getTime() - (diff));

  if (me.isDev) {
    startDate.setTime(endDate.getTime() - (52 * 7 * 24 * 3600 * 1000));
  }

  var cfStartDate = me.fmtDate(startDate, 'cerner');
  var cfEndDate = me.fmtDate(endDate, 'cerner');
  //$('<textarea style="width: 100%; height: 125px;" id="UHS_MPG_GET_EVENTS"></textarea>').prependTo( jqTgt );
  //$('.sparkline[data-esn="TPN Fat Triglycerides"]').first().each(
  $('.sparkline').each(
    function (itm) {
      jqThs = $(this);
      jqThs.text('loading...');
      var esn = jqThs.attr('data-esn');
      var params = '"MINE"'
                  + ',' + me.getProperty('personId') + '.0'
                  + ',' + me.getProperty('encounterId') + '.0'
                  + ',' + '"' + esn + '"'
                  + ',' + '"' + cfStartDate + '"'
                  + ',' + '"' + cfEndDate + '"'
                  ;

      //$('#UHS_MPG_GET_EVENTS').val(  $('#UHS_MPG_GET_EVENTS').val() + 'UHS_MPG_GET_EVENTS ' + params + ' go\n' );
      me.loadCCL(
        "UHS_MPG_GET_EVENTS"
        , params
        , function (data) {
          //if( (/TPN Weight/).test( data.REVT.PARENT_EVENT_SET ) ) {
          //  $(me.getTarget()).prepend('<textarea title="' + data.REVT.PARENT_EVENT_SET + '" >' + JSON.stringify(data) + '</textarea>' );
          //  }
          if (data) {
            var jqThs = $('[data-esn="' + data.REVT.PARENT_EVENT_SET + '"]');
            /* build a flat result array */
            var res = [];
            $.each(data.REVT.EC /* for each EC ... */
              , function (eci, ecv) {
                $.each(ecv.DTA /* ... and each DTA ... */
                  , function (dtai, dtav) {
                    Object.defineProperty(dtav, 'parent', {
                      value: ecv
                    }); /* add a non-enumerable parent reference */
                    //dtav.parent = ecv; /* add a parent reference */
                    $.each(dtav.RESULT /* ... and each RESULT ... */
                      , function (ri, rv) {
                        Object.defineProperty(rv, 'parent', {
                          value: dtav
                        }); /* add a non-enumerable parent reference */
                        //rv.parent = dtav;
                        rv.EVENT_CD_DISP = dtav.EVENT_CD_DISP;
                        res.push(rv); /* add this result item to res */
                      }
                    );
                  }
                );
              }
            );

            /* 20160212 msd:  We're here again... ticket #2124187 requests putting I/O in the opposite direction
              however, the I/O was not changed when the non-I/O was "fixed" so we're returning the non-I/O sparklines
              to how they were working before the backwards-ifying.
            */
            if (res.length > 0) {
              res.sort(
                function (a, b) {
                  var aDtTm = new Date();
                  aDtTm.setISO8601(a.EVENT_END_DT_TM);
                  var bDtTm = new Date();
                  bDtTm.setISO8601(b.EVENT_END_DT_TM);
                  //return aDtTm.getTime() - bDtTm.getTime(); // ascending sort*/
                  return bDtTm.getTime() - aDtTm.getTime(); // descending sort*/
                }
              );
              /* store a reference to this array on jqThs */
              jqThs.prop('res', res);

              //var lastRes = res[ res.length - 1 ]; // lastRes is the LAST element ascending sort
              var lastRes = res[0]; // lastRes is the first element thanks to the descending sort */
              if (res.length > 1) {
                try {
                  jqThs
                    .text(
                      $.map(res
                        , function (el, idx) {
                          return el.RESULT_VAL;
                        }
                      ).join(',')
                    )
                    .sparkline('html'
                      , {
                        width: '100%',
                        height: '100%',
                        spotRadius: 5,
                        highlightSpotColor: 'black',
                        spotColor: 'green',
                        minSpotColor: 'green',
                        maxSpotColor: 'green',
                        valueSpots: { '0:': 'green' },
                        tooltipFormatter:
                          function (sparkline, options, fields) {
                            /* find this result (using fields.offset into the stored 'res' data) */
                            var r = $(sparkline.target.canvas).parent().prop('res')[fields.offset];
                            return r.RESULT_VAL
                                  + ' '
                                  + r.UOM_DISP
                                  + ' (' + r.EVENT_END_DT_TM_FORMATTED	+ ')'
                                  + '<br>'
                                  + r.EVENT_CD_DISP
                            ;
                          }
                      }
                    ).click(function (evt) {
                      var comp = me;
                      var lbunit = lkb[0];
                      var lbtype = ({
                        H: { v: 1, t: 'Hours' },
                        D: { v: 2, t: 'Days' },
                        W: { v: 3, t: 'Weeks' },
                        M: { v: 4, t: 'Months' },
                        Y: { v: 5, t: 'Years' }
                      })[lkb[1]];
                      var params = '^MINE^';
                      params = params + "," + comp.getProperty('personId') + ".0";
                      params = params + "," + comp.getProperty('encounterId') + ".0";
                      params = params + "," + evt.currentTarget.res[0].parent.EVENT_CD + ".0";
                      params = params + "," + '^' + comp.getProperty('staticLocation') + '/UnifiedContent/discrete-graphing^';
                      params = params + "," + "0.0"; //Group
                      params = params + "," + comp.getProperty('userId') + ".0";
                      params = params + "," + "0.0"; //Position
                      params = params + "," + "0.0"; //PPR
                      params = params + "," + lbunit; //"72"; //Lookback units
                      params = params + "," + lbtype.v;
                      "1"; //Lookback unit type
                      params = params + "," + "999"; //Max results
                      params = params + "," + "^Last " + lbunit + " " + lbtype.t + "^"; //Lookback text
                      params = params + "," + "^" + evt.currentTarget.res[0].parent.EVENT_CD_DISP + "^"; //Graph Title
                      params = params + "," + "^^"; //Evt1 Label
                      params = params + "," + "^^"; //Evt2 Label
                      CCLLINK('mp_retrieve_graph_results', params, 0);
                    })
                  ;
                }
                catch (err) {
                  if ((/sparkline/).test(err.description)) {
                    jqThs.text('sparkline n/a');
                  }
                }
              }
              else {
                jqThs
                  .text('')
                ;
              }
            }
            else {
              jqThs.text("No data");
              var lastRes = { RESULT_VAL: '', UOM_DISP: '' };
            }

            var jqP = jqThs.closest(".lab");
            jqP.find(".vl").text(lastRes.RESULT_VAL);
            jqP.find(".uom").text(lastRes.UOM_DISP);
            jqP.find(".dt").text(lastRes.EVENT_END_DT_TM_FORMATTED);
          }
        }
        , "JSON"
      );
    }
  );
};
uhspa.tpnadvisor.prototype.iospark = function () {
  var me = this;
  var jqels = $('.IOspark');
  if (jqels.length > 0) {
    try {
      jqels.sparkline('html'
        , {
          width: '100%',
          height: '100%',
          spotRadius: 5,
          highlightSpotColor: 'black',
          spotColor: 'green',
          minSpotColor: 'green',
          maxSpotColor: 'green',
          valueSpots: { '0:': 'green' },

          tooltipFormatter:
            function (sparkline, options, fields) {
              /* find this result (using fields.offset into the stored 'res' data) */
              var r = me.data.RREC.PATIENTINFO.IO[fields.offset];
              return r[$(sparkline.target.canvas).parent().attr('data-type')]
                    + ' mL'
                    + ' (' + r.START_DT_TM_FORMATTED	+ ')'
              ;
            }
        }
      )
      ;
    }
    catch (err) {
      if ((/sparkline/).test(err.description)) {
        jqels.text('sparkline n/a');
      }
    }
  }
};
uhspa.tpnadvisor.prototype.callOrderServer = function (newReq, cb) {
  var me = this;

  var blob_in = '{"OWSREQUEST":'
              + JSON.stringify(newReq)
                .replace(/:"\/(Date\(.+?\))\/"/g, ':"\\/$1\\/"') /* escape-escaped date serialization expected by CCL */
                .replace(/\\n/g, "\n") /* escape-escaped newlines to be actual newlines */
              + '}'
              ;

  //  $( '#' + me.id + 'req' ).val( JSON.stringify( newReq )  );    /* unfixed date */
  //  $( '#' + me.id + 'reqexe' ).val( 'Execute uhs_mpg_call_ORDERWRITESYNCH "MINE",' + blob_in );
  //  $( '#orderdebug').show();

  me.loadCCLwithBlob(
    'uhs_mpg_call_orderwritesynch'
    , ['MINE']
    , function (data) {
      //$( '#' + me.id + 'xlog' ).val( JSON.stringify(data) );
      //$('<textarea title="order request">' + blob_in.replace(/\n/g,"|") + '</textarea>').appendTo( 'body' );
      if (data.REPLY.BADORDERCNT == 0) {
        if (typeof cb == 'function') { /* if cb is a function */
          cb.apply(me, [
            data
          ]); /* call it with 'me' as this and pass it 'data' */
        }
      }
      else {
        $('<textarea title="OWSREQUEST">' + blob_in + '</textarea>').appendTo('body');
        $('<textarea title="OWSREPLY">' + JSON.stringify(data) + '</textarea>').appendTo('body');
        var ordErr = data.REPLY.ORDERLIST.filter(function (ord) {
          return ord.ERRORNBR > 0;
        })[0];
        switch (ordErr.ERRORNBR) {
          case 999997536644 :
            alert('Could not complete the order'
              + '\n' + 'because actions outside this advisor'
              + '\n' + 'may have changed the order state'
              + '\n'
              + '\n' + 'Click OK to reload, please try again'
            );
            window.location = window.location.href.split('#')[0];
            break;
          default :
            alert('OWS Error: '
              + '\n'
              + '\n' + ordErr.ERRORSTR
              + '\n'
              + '\n' + ordErr.SPECIFICERRORSTR
            );
            break;
        }
      }

      return;
    }
    , "JSON"
    , blob_in
  );
};
uhspa.tpnadvisor.prototype.loadCCLwithBlob = function (cclProgram, cclParams, callback, cclDataType, blob) {
  if (blob === undefined) { /* if you don't pass "blob" then you're really just using loadCCL */
    this.loadCCL(cclProgram, cclParams, callback, cclDataType);
  }
  else { /* load blob_in with blob */
    var xcr = new XMLCclRequest();
    var asynch = !(callback === undefined);
    xcr.open("GET", cclProgram, asynch);

    /* lifted this wrapper from MPageComponent [fwiw: I really dislike the assumption of state] */
    var collapseParams = function () { /* closure over cclParams */
      if (typeof cclParams == "string") {
        return cclParams;
      }
      else {
        var params = [];
        for (var i = 0; i < cclParams.length; ++i) {
          var arg = cclParams[i];
          if (!arg && parseFloat(arg) != arg) {
            params[i] = "";
          }
          if (typeof (arg) == 'string') {
            if (!/'/.test(arg)) {
              params[i] = "'" + arg + "'";
            }
            else if (!/\^/.test(arg)) {
              params[i] = '^' + arg + '^';
            }
            else if (!/"/.test(arg)) {
              params[i] = '"' + arg + '"';
            }
            else {
              throw new Error("Unable to find a quote for " + arg);
            }
          }
          else if (typeof (arg) == 'object') {
            valueParams = [];
            $.each(arg, function (idx, val) {
              if (typeof val == "string") {
                valueParams.push("^" + val + "^");
              }
              else if (typeof val == "number") {
                if (!/\.0$/.test(val)) {
                  valueParams.push(val + ".0");
                }
                else {
                  valueParams.push(val);
                }
              }
            });
            params[i] = 'value(' + valueParams.join() + ')';
          }
          else {
            params[i] = arg;
          }
        }
        return params.join();
      }
    };

    /* wrapper to turn responseText into requested return object */
    var processResult = function (response, cb) {
      //alert( 'response:|' + response + '|');
      var data = response;
      switch (cclDataType.toUpperCase()) {
        case "JSON":
          if (typeof JSON == "undefined") {
            data = response ? eval("(" + response + ")") : {};
          }
          else {
            data = response ? JSON.parse(response) : {};
          }
          break;
        case "XML":
          if (window.DOMParser) {
            data = new DOMParser().parseFromString(response, "text/xml");
          }
          else { // Internet Explorer
            data = new ActiveXObject("Microsoft.XMLDOM");
            data.async = "false";
            data.loadXML(response);
          }
          break;
      }

      if (cb) { /* if a callback was passed, use it */
        cb.call(this, data);
      }
      else {
        return data; /* else return this data */
      }
    };

    if (asynch) {
      /* register listener */
      xcr.onreadystatechange = function () {
        try {
          if (xcr.readyState == 4) { /* completed */
            if (xcr.status == "200" || status == "0") { /* ok */
              processResult(xcr.responseText, callback); /* hand the callback function to the processResult wrapper/function */
            }
            else { /* not ok, throw.. */
              throw new Error(
                [
                  '** Failed Callback **',
                  '\nprogram:' + cclProgram,
                  '\nStatus Text: [' + status + ']',
                  '\n\t' + xcr.statusText,
                  '\nResponse Text:',
                  '\n\t' + xcr.responseText
                ].join("")
              );
            }
          }
        }
        catch (err) {
          alert("xcr_asynch:\n" + err.message
            + "\nxcr.status: " + xcr.status
            + "\nxcr.statusText:\n" + xcr.statusText
          );
          if (this.log) {
            this.log(err);
            this.log(err.message);
          }
        }
      };
    }


    if (typeof blob == 'object') {
      /* insert linebreaks at a frequently-occurring character to minimize risk of >2k line lengths */
      xcr.setBlobIn(JSON.stringify(blob).replace(/,/g, "\n,"));
    }
    else {
      /* caller is responsible for line length issues with later rtl2 reads */
      xcr.setBlobIn(blob);
    }

    /* actually call CCL/server at the open() program, with blob_in set(above), specify the following parameters */
    xcr.send(collapseParams());

    if (!asynch) {
      return processResult(xcr.responseText); /* process result without callback to get and object to be returned */
    }
    else { /* the listener registered on xcr will pass on to the provided "callback" function */
      return null; /* because that's what loadCCL does... */
    }
  }
};
uhspa.tpnadvisor.prototype.evaluate = function (src, ctx) {
  var me = this;
  var rv = src;
  /* literal [f( prefix, then capture any character that is not nothing lazy expand zero or more times, then literal )] suffix */
  var reF = /\[f\(([^]*?)\)\]/g; // ex:  [f( code )]
  if (reF.test(src)) {
    rv = src.replace(reF, function (fullmatch, code) {
      var fnBody = 'try{ '
                  + ((/return/i).test(code) ? code : 'return (' + code + ')')
                  + ' } catch(err){ '
                  + ' throw err '
                  + ' } '
                  ;
      var fn = new Function('me', fnBody);
      try {
        var replace_result = fn.apply(me, [me]);
      }
      catch (err) {
        alert('Error in ' + JSON.stringify(ctx) + '\n' + err.description);
        replace_result = "***\n" + code + "\n***";
      }
      return replace_result;
    });
  }
  return rv;
};
/* end uhspa.tpnadvisor.js */
