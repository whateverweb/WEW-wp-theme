
var WhateverUtils = (function(){
	return{
		/**
		 * Encodes an extended set of characters 
		 *
		 * @param {String} 	str
		 */	
		fixedEncodeURIComponent : function(str) {
			  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
		}
	};
})();

