(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend(
    /**
     * @lends Alpaca.Fields.DateField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class Date control for JSON schema date format.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         * @param {Function} errorCallback Error callback.
         */
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            this.base(container, data, options, schema, view, connector, errorCallback);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {

            this.base();

            if (!this.options.dateFormat) {
                this.options.dateFormat = Alpaca.defaultDateFormat;
            }
            if (!this.options.dateFormatRegex) {
                this.options.dateFormatRegex = Alpaca.regexps.date;
            }
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();

            if (this.field && $.datepicker)
            {
                var datePickerOptions = this.options.datepicker;
                if (!datePickerOptions)
                {
                    datePickerOptions = {
                        "changeMonth": true,
                        "changeYear": true
                    };
                }
                if (!datePickerOptions.dateFormat)
                {
                    datePickerOptions.dateFormat = this.options.dateFormat;
                }
                this.field.datepicker(datePickerOptions);

                if (this.fieldContainer) {
                    this.fieldContainer.addClass('alpaca-controlfield-date');
                }
            }

        },

        /**
         * @see Alpaca.Field#onChange
         */
        onChange: function(e) {
            this.base();
            this.renderValidationState();
        },

        /**
         * @see Alpaca.Fields.TextField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateDateFormat();
            valInfo["invalidDate"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.view.getMessage("invalidDate"), [this.options.dateFormat]),
                "status": status
            };

            return baseStatus && valInfo["invalidDate"]["status"];
        },

        /**
         * Validates date format.
         * @returns {Boolean} True if it is a valid date, false otherwise.
         */
        _validateDateFormat: function() {
            var value = this.field.val();

            if ($.datepicker) {
                try {
                    $.datepicker.parseDate(this.options.dateFormat, value);
                    return true;
                } catch(e) {
                    return false;
                }
            } else {
                //validate the date without the help of datepicker.parseDate
                return value.match(this.options.dateFormatRegex);
            }
        },

        getValue: function() {
            var value = null;            
            if (this.field) {
                value = this.field.val();
            } else {
                value = this.base();
            }
            
            if(this.options.storeIsoDate){              
              var d = $.datepicker.parseDate(this.options.dateFormat, value);
              value =  $.datepicker.formatDate('yy-mm-dd', d);            
            }            
            
            return value;
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(val) {
            // skip out if no date
            if (val === "") {
                this.base(val);
                return;
            }

            if(this.options.storeIsoDate){
              var d = $.datepicker.parseDate('yy-mm-dd', val);
              val =  $.datepicker.formatDate(this.options.dateFormat, d);
            }

            this.base(val);
        },//__BUILDER_HELPERS

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfSchema
         */
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"date",
                        "enum" : ["date"],
                        "readonly":true
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForSchema
         */
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getSchemaOfOptions
         */
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dateFormat": {
                        "title": "Date Format",
                        "description": "Date format",
                        "type": "string",
                        "default": Alpaca.defaultDateFormat
                    },
                    "dateFormatRegex": {
                        "title": "Format Regular Expression",
                        "description": "Regular expression for validation date format",
                        "type": "string",
                        "default": Alpaca.regexps.date
                    },
                    "datepicker": {
                        "title": "Date Picker options",
                        "description": "Optional configuration to be passed to jQuery UI DatePicker control",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.Fields.TextField#getOptionsForOptions
         */
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dateFormat": {
                        "type": "text"
                    },
                    "dateFormatRegex": {
                        "type": "text"
                    },
                    "datetime": {
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Date Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Date Field.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "date";
        }//__END_OF_BUILDER_HELPERS
    });

    Alpaca.registerMessages({
        "invalidDate": "Invalid date for format {0}"
    });
    Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");
})(jQuery);
