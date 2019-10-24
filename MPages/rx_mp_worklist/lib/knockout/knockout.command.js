// By: Hans Fjällemark and John Papa
// https://github.com/CodeSeven/KoLite

(function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        define(["knockout", "exports"], factory);
    } else {
        factory(ko, ko);
    }
} (function (ko, exports) {
    if (typeof (ko) === undefined) {
        throw 'Knockout is required, please ensure it is loaded before loading the commanding plug-in';
    }

    function wrapAccessor(accessor) {
        return function () {
            return accessor;
        };
    };

    exports.command = function (options) {
        var 
            self = function () {
                return self.execute.apply(this, arguments);
            },
            canExecuteDelegate = options.canExecute,
            executeDelegate = options.execute;

        self.canExecute = ko.computed(function () {
            return canExecuteDelegate ? canExecuteDelegate() : true;
        });

        self.execute = function (arg1, arg2) {
            // Needed for anchors since they don't support the disabled state
            if (!self.canExecute()) return

            return executeDelegate.apply(this, [arg1, arg2]);
        };

        return self;
    };

    exports.asyncCommand = function (options) {
        var 
            self = function () {
                return self.execute.apply(this, arguments);
            },
            canExecuteDelegate = options.canExecute,
            executeDelegate = options.execute,

            completeCallback = function () {
                self.isExecuting(false);
            };

        self.isExecuting = ko.observable();

        self.canExecute = ko.computed(function () {
            return canExecuteDelegate ? canExecuteDelegate(self.isExecuting()) : !self.isExecuting();
        });

        self.execute = function (arg1, arg2) {
            // Needed for anchors since they don't support the disabled state
            if (!self.canExecute()) return

            var args = []; // Allow for these arguments to be passed on to execute delegate

            if (executeDelegate.length >= 2) {
                args.push(arg1);
            }

            if (executeDelegate.length >= 3) {
                args.push(arg2);
            }

            args.push(completeCallback);
            self.isExecuting(true);
            return executeDelegate.apply(this, args);
        };

        return self;
    };


    ko.bindingHandlers.loading = {
        init: function (element, valueAccessor, allBindingsAccessor) {

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).data('loader').remove();
                //delete element.activityIndicator;
            });
        },

        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = valueAccessor(),
                $element = $(element),
                valueUnwrapped = ko.utils.unwrapObservable(value),
                loader = $element.data('loader'),
                baseUrl = require.toUrl('').split(".js")[0];

            if (valueUnwrapped) {
                var options = valueUnwrapped.options;
                var defaultOptions = {
                    width: 12,
                    height: 12,
                    prepend: false
                };
                if (!options) {
                    options = defaultOptions;
                } else {
                    options.width = options.width ? options.width : defaultOptions.width;
                    options.height = options.height ? options.height : defaultOptions.height;
                    options.prepend = options.prepend ? options.prepend : defaultOptions.prepend;
                }

                if (!loader) {
                    loader = $('<span style="display: inline; margin: 2px;text-align:center;"><img height=' + options.height + 'width=' + options.width + 'style="padding-top:4px" src= "' + baseUrl + "../img/ajax-loader.gif" + '" alt="Loading..." /></span>');
                    loader.removeAttr("id");
                    if (options.prepend) {
                        loader.insertBefore($('#' + element.id));
                    } else {
                        loader.insertAfter($('#' + element.id));
                    }
                    $element.data('loader', loader);
                }


                if (valueUnwrapped.visible()) {
                    loader.css('top', $element.offset().top);
                    loader.css('left', $element.offset().left + $element.outerWidth());
                    loader.show();
                } else {
                    loader.hide();
                }
            }
        }
    };

    ko.bindingHandlers.command = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var 
                value = valueAccessor(),
                commands = value.execute ? { click: value} : value,

                isBindingHandler = function (handler) {
                    return ko.bindingHandlers[handler] !== undefined;
                },

                initBindingHandlers = function () {
                    for (var command in commands) {
                        if (!isBindingHandler(command)) {
                            continue;
                        };

                        ko.bindingHandlers[command].init(
                            element,
                            wrapAccessor(commands[command].execute),
                            allBindingsAccessor,
                            viewModel,
                            bindingContext
                        );
                    }
                },

                initEventHandlers = function () {
                    var events = {};

                    for (var command in commands) {
                        if (!isBindingHandler(command)) {
                            events[command] = commands[command].execute;
                        }
                    }

                    ko.bindingHandlers.event.init(
                        element,
                        wrapAccessor(events),
                        allBindingsAccessor,
                        viewModel,
                        bindingContext);
                };

            initBindingHandlers();
            initEventHandlers();
        },

        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var commands = valueAccessor();
            var canExecute = commands.canExecute;

            if (!canExecute) {
                for (var command in commands) {
                    if (commands[command].canExecute) {
                        canExecute = commands[command].canExecute;
                        break;
                    }
                }
            }

            if (!canExecute) {
                return;
            }

            ko.bindingHandlers.enable.update(element, canExecute, allBindingsAccessor, viewModel, bindingContext);
        }
    };
}));