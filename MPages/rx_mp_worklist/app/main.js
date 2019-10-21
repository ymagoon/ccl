requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-2.3.0.debug',
        'jquery': '../lib/jquery/jquery-1.9.1.min',
        'jqueryui': '../lib/jquery-ui/jquery-ui-1.9.2.custom',
        'mpages': '../lib/mpages',
        'i18next': '../lib/i18next/i18next.amd.withJQuery-1.7.1.min',
        'toastr': '../lib/toastr/js/toastr',
        'ko.command': '../lib/knockout/knockout.command',
        'ko.activity': '../lib/knockout/knockout.activity',
        'ko.dirtyFlag': '../lib/knockout/knockout.dirtyFlag',
        'ko.mapping': '../lib/knockout/knockout.mapping',
        "moment": "../lib/moment/moment-with-langs",
        "numeral": "../lib/numeral/numeral.min",
        "lang": "../lib/numeral/languages",
        "locale": "../app/locales"
    },
    shim: {
        'toastr': { deps: ['jquery'], exports: 'toastr' },
        'jqueryui': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    },
    deps: ['knockout', 'ko.mapping', 'lang/' + CERN_locale.toLowerCase()],
    callback: function (ko, mapping) {
        ko.mapping = mapping;
    },
    waitSeconds: 0

});

require(['require', 'durandal/system', 'durandal/app', 'durandal/viewLocator', 'durandal/binder', 'mpages/load_timer', 'i18next', 'toastr', 'plugins/dialog', 'services/dialog_context', 'numeral', 'lang/' + CERN_locale.toLowerCase(), 'locale/' + CERN_locale + '/i18n'],
    function (require, system, app, viewLocator, binder, loadTimer, i18n, toastr, dialog, dContext, numeral, numeralLang, i18nData) {
        // Set the i18n options
        var resources = {};
        resources[CERN_locale] = i18nData;
        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");
        var i18nNOptions = {
            detectFromHeaders: false,
            lng: CERN_locale,
            fallbackLang: 'en-US',
            ns: 'app',
            useCookie: false,
            getAsync: false,
            resStore: resources
        };

        // enable dialog plugin
        app.configurePlugins({
            dialog: true
        });

        // configure toastr  options
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        var $ = require('jquery');
        // set the custom modal dialog and custom message box
        dialog.addContext('custom', dContext);
        dialog.MessageBox.setViewUrl('views/message_box');

        var lang = require('lang/' + CERN_locale.toLowerCase());
        if (lang) {
            // load the language settings
            numeral.language(CERN_locale.toLowerCase(), lang);
            // switch to use the language settings
            numeral.language(CERN_locale.toLowerCase());
        }

        /*Listen for a ctrl + \ key combination and activate debugging once pressed*/
        document.onkeypress = function (evt) {
            if (!evt) {
                evt = window.event;
            }
            if (evt.ctrlKey == 1 && evt.keyCode == 28) {
                //Activate blackbird logging
                if (log && log.activateLogging) {
                    log.activateLogging();
                }
            }
        };

        app.start().then(function () {
            // load timer is a singleton. start it as the initial application load. It will
            // stop automatically once patientPopulationLoaded and populationLinksLoaded are
            // set to true
            loadTimer.start();

            //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
            //Look for partial views in a 'views' folder in the root.
            viewLocator.useConvention();

            i18n.init(i18nNOptions, function () {
                binder.binding = function (obj, view) {
                    $(view).i18n();
                };

                binder.bindingComplete = function (obj, view) {
                    $(view).find("button.btn").button();
                };
            });

            //Show the app by setting the root view model for our application with a transition.
            app.setRoot('viewmodels/shell', 'entrance');
        });
    });