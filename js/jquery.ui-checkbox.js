/**
 * jQuery UI-CheckBox component
 * @author Denis Izmaylov <izmaylov.dm@gmail.com>
 * @date 2013-07-31
 *
 * Usage:
 * 1. Create:
 *    $(elem).UICheckBox({
 *      value: true,
 *      title: 'Example',
 *      createElements: false
 *    });
 *
 * 2. Read:
 *    $(elem).UICheckBox('value');
 *    // => true
 *
 *    $(elem).UICheckBox('disabled');
 *    // => false
 *
 * 3. Update:
 *    $(elem).UICheckBox('disabled', true);
 *    $(elem).UICheckBox({disabled: false, value: true});
 *
 * 4. Destroy:
 *    $(elem).UICheckBox('destroy');
 *
 * 5. Events:
 *    $(elem).on('change', function (value) { ... } ); // when user changes are complete
 */

;(function (factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {

        // AMD. Register as an anonymous module
        define(['jquery'], factory);

    } else if (typeof exports === 'object') {

        // NodeJS / CommonJS
        factory(require('jquery'));

    } else {

        // Browser globals
        factory(jQuery);
    }

})(function ($) {

    'use strict';

    var
        /**
         * Default component options,
         * you can override it via component constructor
         * @type {Object}
         */
        defaultOptions = {

            disabled: false,
            value: true,
			example: '',

            createElements: true

        }, // defaultOptions {...}


        /** @type {String} */
        basicTemplate =
            '<div class="ui-checkbox-icon"></div>' +
			'<div class="ui-checkbox-title"></div>',



        /** @type {ComponentInstance[]} */
        componentInstances = [],


        ComponentPrototype = {

            /**
             * Create DOM elements, attach event handlers, etc
             * @param {Object} options
             */
            create: function (options) {

                this._onMouseDown = this.onMouseDown.bind(this);
				

                /**
                 * Create and bind DOM element
                 */
                if (options.createElements) {

                    this.owner.append(basicTemplate);
                }
				
				
				this.titleObj = this.owner.find('.ui-checkbox-title');
				

                this.owner.addClass('ui-checkbox-control');



                /**
                 * Bind event handlers
                 */
                this.owner.on('mousedown', this._onMouseDown);



                /**
                 * Assign specified options
                 */
                this.update(options);

            }, // create()


            /**
             * Disable edit mode, detach event handlers
             */
            destroy: function () {

                this.owner.off('mousedown', this._onMouseDown);
				
                this.setEditMode(false);

            }, // destroy()


            /**
             * Calls when the user tries to update component options
             * @param {Object} options
             */
            update: function (options) {

                for (var key in options) {
                    if (!options.hasOwnProperty(key)) continue;

                    this.setOption(key, options[key]);
                }

            }, // update()


            /**
             * @param {String} name
             * @param {*} value
             * @todo we can extract DOM operations to external method
             */
            setOption: function (name, value) {

                var previousValue = this.options[name];

                this.options[name] = value;


                switch (name) {

                    case 'value':

                        this.owner
							.trigger('change', [value, previousValue])
							.toggleClass('ui-checkbox-checked', value);
						
						break;
						
					case 'disabled':
					
						this.owner.toggleClass('ui-checkbox-disabled', value);
							
						break;
						
					case 'title':
					
						this.titleObj.html(value);
							
						break;

                } // switch (...)

            }, // setOption()


            /**
             * @param {String} name
             * @returns {*}
             */
            getOption: function (name) {

                // there we can post-process specified value
				
				return this.options[name];

            }, // getOption()


            /*
             * Snippet:
             * Repairs jquery event object to support iPhone and iPad events
             * @param {Object} [event] jQuery event
             */
            prepareJQueryTouchEvent: function (event) {

                var original_event = event.originalEvent || event;

                if (original_event.targetTouches && original_event.targetTouches[0]) {
                    event.pageX = original_event.targetTouches[0].pageX;
                    event.pageY = original_event.targetTouches[0].pageY;
                }
                if (typeof original_event.preventDefault == 'function'
                    && typeof event.stopPropagation != 'function') {
                    event.stopPropagation = original_event.preventDefault.bind(original_event);
                }

            },// prepareJQueryTouchEvent()


            /**
             * Handles custom actions (except 'create', 'update', 'destroy')
             * @param {String} action
             * @param {Array} params
             * @returns {*}
             */
            handleAction: function (action, params) {

                /**
                 * Is it options key?
                 * In this case we:
                 * a) detect which is requested operation - get or set value?
                 * b) process the operation.
                 */
                if (typeof this.options[action] !== 'undefined') {

                    if (arguments.length === 1) { // get value

                        return this.getOption(action);

                    } else { // set value

                        this.setOption(action, params[0]);
                    }
                }

            }, // handleAction()



            /**************************************************************************************
             * CUSTOM COMPONENT METHODS
             */


            /**
             * @param {Object} event
             * @private
             */
            onMouseDown: function (event) {

                if (!this.options['disabled']) {
				
					this.setOption('value', !this.options['value']);

					event.preventDefault();
					event.stopPropagation();
				}

            } // onMouseDown()

        }, // ComponentPrototype {...}



        /**
         * Component instance constructor,
         * will be placed at <componentInstances>
         * @param {jQuery} [owner]
         * @param {Object} [options]
         * @constructor
         */
        ComponentInstance = function (owner, options) {

            /** @type {jQuery} */
            this.owner = owner;

            /** @type {Object} */
            this.options = {};


            this.create(
                $.extend({}, defaultOptions, options)
            );

        }; // ComponentInstance()


    $.extend(ComponentInstance.prototype, ComponentPrototype);



    /**
     * jQuery Plugin Interface layer
     * @param {String|Object} [param] action name (i.e. 'destroy') or params to update
     * @this {jQuery}
     */
    $.fn.UICheckBox = function (param) {

        var result,
            action = (typeof param === 'string') ? param : 'create',
            options = (typeof param === 'object') ? param : arguments[1];


        // Process each element
        this.each(function () {

            var $this = $(this);

            /**
             * Try to find a component instance for this element,
             * also update <action> in successful ('create' --> 'update')
             */
            var currentInstance,
                currentIndex;

            for (var index = 0, length = componentInstances.length;
                index < length; index++) {

                if (componentInstances[index].owner.is($this)) {

                    currentInstance = componentInstances[index];
                    currentIndex    = index;

                    if (action === 'create') {

                        action = 'update';
                    }

                    break;
                }
            }



            /**
             * Process basic actions ('create', 'update', 'destroy')
             */
            switch (action) {

                case 'create':

                    currentInstance = new ComponentInstance(
                        $this,
                        $.extend({}, options) // copy defaults options and override it by specified
                    );

                    componentInstances.push(currentInstance);

                    break;



                case 'update':

                    if (currentInstance) {

                        currentInstance.update(options);
                    }

                    break;



                case 'destroy':

                    if (currentIndex) {

                        currentInstance.destroy();

                        componentInstances.splice(currentIndex, 1);
                    }

                    break;



                default:

                    if (currentInstance) {

                        if (typeof currentInstance[action] === 'function') {

                            result = currentInstance[action](options);

                        } else {

                            result = currentInstance.options[action];

                            if (typeof options !== 'undefined') {

                                currentInstance.setOption(action, options);
                            }
                        }
                    }

                    break;

            } // switch (action)

        });


        return (typeof result !== 'undefined') ? result : this;

    }; // $.fn.UISlider()

});