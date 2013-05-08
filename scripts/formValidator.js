/**
 * Single tone class for validating any HTML form providing rules
 */
var formValidator=(function(){
	return{
		/**
		 * Check if the browser supports place holders
		 */	
		supports_input_placeholder : function() {
			var i = document.createElement('input');
			return 'placeholder' in i;
		},
	    
		/**
		 * Creates artificial placeholder support
		 */
		init : function() {
				var fields1 = Array.prototype.slice.call(document.getElementsByTagName('input'));
				var fields2 = Array.prototype.slice.call(document.getElementsByTagName('textarea'));
				var fields=fields1.concat(fields2);
				for ( var i = 0; i < fields.length; i++) {
					if (fields[i].hasAttribute('placeholder')) {
						this.setFieldBehavure(fields[i]);
					}
					
				}
			
	
		},
		setFieldBehavure : function(field){
				if (this.supports_input_placeholder()) {
					return;
				}
				var defaultValue=field.getAttribute('placeholder');
				var originalType=field.type;
				var alternativeType=originalType;
				if(originalType=="password"){
					alternativeType="text";
				}
				
				field.value=defaultValue;
				field.type=alternativeType;
				
				field.onfocus = function() {
					if(originalType=="password"){
						this.type=originalType;
					}
					if (this.value == defaultValue){
						this.value = '';
					}
				}
				field.onblur = function() {
					if (this.value == ''){
						if(originalType=="password"){
							this.type=alternativeType;
						}
						this.value = defaultValue;
					}
				}
			
		},
		
		/**
		 * Validates a form based on a set of rules
		 * 
		 * @param {DOM} 		form
		 * @param {JSON} 		rules
		 * @param {Function}	errorCallback
		 * @param {Function}	successCallback
		 */
		validate : function(form, rules, errorCallback, successCallback) {
			var callerForm = form;
	
			for ( var i = 0; i < rules.length; i++) {
				for (j = 0; j < rules[i].rules.length; j++) {
					var field = callerForm[rules[i].field];
					var rule = rules[i].rules[j];
					var errorExp = rules[i].errors[j];
					// checkout if there is some equlity condition (like retype
					// password)
					if (rule.charAt(0) == '=') {
						var equalsWith = rule.slice(1);
						rule = "equals";
					}
	
					// checkout if there is any regExp condition
					if (rule.indexOf("regexp") == 0) {
						var regexp = rule.slice(rule.indexOf(":") + 1);
						rule = "regexp";
						regexp = "^" + regexp + "$";
						var re = new RegExp(regexp);
					}
	
					switch (rule) {
					case "notempty":
						if (!this.validateNotEmpty(field.value)) {
							field.focus();
							errorCallback(errorExp);
							return false;
						}
						break;
					case "email":
						if (!this.validateEmail(field.value)) {
							field.focus();
							errorCallback(errorExp);
							return false;
						}
						break;
	
					case "equals":
						var field2 = callerForm[equalsWith];
						if (!this.validateEquality(field, field2)) {
							field.focus();
							errorCallback(errorExp);
							return false;
						}
						break;
	
					case "regexp":
						if (!re.test(field.value)) {
							field.focus();
							errorCallback(errorExp);
							return false;
						}
						break;
					}
				}
			}
			successCallback(form);
			return false;
		},
	
		
	    /**
	     * Helper method. Checks if a string is empty
	     * 
	     * @param {String}  fieldval
	     */
		validateNotEmpty : function(fieldval) {
			if (fieldval == undefined) {
				return false;
			}
			if (fieldval == "") {
				return false;
			}
			return true;
		},
	
		/**
		 * Helper function. Checks if a string is a valid email
		 * 
		 * @param {String}  fieldval
		 */
		validateEmail : function(fieldval) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(fieldval);
		},
	
		
		/**
		 * Helper function. Checks if two input texts have the same values
		 * 
		 * @param {HTMLElement}  field1
		 * @param {HTMLElement}  field2
		 */
		validateEquality : function(field1, field2) {
			if (field1 == undefined || field2 == undefined) {
				return false;
			}
			var val1 = field1.value;
			var val2 = field2.value;
			if (val1 == "" || val2 == "" || val1 != val2) {
				return false;
			}
			return true;
		},
	
		
		/**
		 * Removes the values from a form
		 * 
		 * @param {HTMLElement} form
		 */
		emptyForm : function(form) {
			var txtFields = form.getElementsByTagName("input");
			for ( var i = 0; i < txtFields.length; i++) {
				if (txtFields[i].type == "text" || txtFields[i].type == "password"
						|| txtFields[i].type == "email") {
					txtFields[i].value = "";
				}
			}
			txtFields = form.getElementsByTagName("textarea");
			for ( var i = 0; i < txtFields.length; i++) {
				txtFields[i].value = "";
			}
		}
	};	
})();

formValidator.init();
