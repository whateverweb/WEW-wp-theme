 

/* Filter class which takes elements and filters them based on a data mapping 
 * 
 */

function filter(searchBox, pagination, filterDomContainer, emptyMessage,minLen,hideWhenNothing) {

	/* attributes-------------------------------------------*/
	this.pagination = pagination;
	this.restriction = false;
	this.searchBox = searchBox;
	this.filteredMap = [];
	this.domElemsMap = [];
	this.dataMap = [];
	this.restricted = [];
	this.visibleMap = [];
	this.minLen=minLen;
	this.hideWhenNothing=hideWhenNothing;

	this.filterDomContainer = filterDomContainer;
	this.emptyMessage = emptyMessage;

	this.totalVisible = 0;
	this.totalRestricted = 0;
	

	
	this.init();
	
}


/* member functions*/
/**
 * Initiates the the class 
 */
filter.prototype.init = function() {
	this.setSearchBoxEvent(this.searchBox);

	if (this.pagination) {
		this.pagination.filter = this;
	} else {
		this.showWithNoPagination();
	}
}


/**
 * Filters data based on string
 * 
 * @param {String} 	string
 * The string representing the info to filter by 
 */
filter.prototype.filterData = function() {
	var toCompare = this.searchBox.value.toUpperCase();
	if(this.searchBox.value==this.searchBox.getAttribute("placeholder")){
		toCompare = "";
	}
	var totalVisible = 0;
	var totalRestricted=0;
	for ( var i = 0; i < this.dataMap.length; i++) {
		if (this.restricted[i]){
			totalRestricted++;
		}
		
		if (this.restricted[i] && this.restriction) {
			this.visibleMap[i] = false;
			continue;// did not find the element
		}
		var found = this.dataMap[i].toUpperCase().search(toCompare);
		if(this.hideWhenNothing && toCompare==""){
			found=-1;
		}
		if (found > -1) {
			totalVisible++;
			this.visibleMap[i] = true;
		} else {
			this.visibleMap[i] = false;
		}
	}
	this.totalVisible = totalVisible;
	this.totalRestricted = totalRestricted;

	if (!this.pagination) {
		this.showWithNoPagination();
	}
	this.testEmptyList();
}



/**
 * Basic filtering without a pagination class
 */
filter.prototype.showWithNoPagination = function() {
	for ( var i = 0; i < this.domElemsMap.length; i++) {
		if (this.visibleMap[i]) {
			this.domElemsMap[i].style.display = "";
		} else {
			this.domElemsMap[i].style.display = "none";
		}
	}
}


/**
 * Creates the keyup event for the input text
 * 
 * @param {DOM} 	searchBox
 * @param {DOM} 	scope
 * The string representing the style content 
 */
filter.prototype.setSearchBoxEvent = function(searchBox) {
	if (!searchBox) {
		return;
	}
	
	var scope=this;
	searchBox.onkeyup = function() {
	    if(scope.minLen){
			if(searchBox.value.length<scope.minLen){
			   return;
			}
		}
		scope.filterData();
		scope.goToPage(1);
	}
}


/**
 * Tests the filtered elements to see if there are any results
 * If not, the empty list DOM element will be revealed
 * 
 */
filter.prototype.testEmptyList = function() {
	if(!this.emptyMessage){
		return;
	}
	try {
		this.filterDomContainer.removeChild(this.emptyMessage);
	} catch (e) {
	}
	if (this.totalVisible <= 0) {// than we should display the message
		this.filterDomContainer.appendChild(this.emptyMessage);
	}
}


/**
 * If there is a pagination class this method will be used 
 * to go from within this class to a certain page
 * 
 * @param {Number} 	pageNr
 * The destination page 
 */
filter.prototype.goToPage = function(pageNr) {
	if (this.pagination) {
		this.pagination.goToPage(pageNr);
	}
}


/**
 * Adds data to the data map used for filtering 
 * 
 * @param {Object} 	elemEntity
 * An object containing the dom element to be displayed,
 * the data destined to be filtered and if the element is restricted  
 */
filter.prototype.addElement = function(elemEntity) {
	this.dataMap.push(elemEntity.strData.toString());
	this.domElemsMap.push(elemEntity.domElement);
	// set the flag of this element regarding restriction (if the class
	// restriction flag is true)
	this.restricted.push(elemEntity.restricted);
	this.visibleMap.push(true);
}


/**
 * Removes an element from the filter 
 * 
 * @param {DOM} domElement  
 */
filter.prototype.removeElement = function(domElement) {
	var index = this.domElemsMap.indexOf(domElement);
	if (index == -1) {
		return;
	}
	domElement.parentNode.removeChild(domElement);
	this.dataMap.splice(index, 1);
	this.domElemsMap.splice(index, 1);
	this.restricted.splice(index, 1);
	this.visibleMap.splice(index, 1);
	this.filterData();
	this.goToPage(null);
}


/**
 * Changes the restricted status of an filtered element 
 * 
 * @param {DOM} 		element
 * @param {Boolean} 	value
 */
filter.prototype.changeRestrictedFlag = function(element, value) {
	var index=this.domElemsMap.indexOf(element);
	if(index>-1){
	   this.restricted[index] = value;
	}
}
