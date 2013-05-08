var applicationsContainer = document.getElementById("list-of-applications");

// get info from sessionStorage
var userEmail = sessionStorage.getItem("userEmail");
var sessionToken = sessionStorage.getItem("id");

var emptyMessage = document.createElement("span");
emptyMessage.innerHTML = "No applications found.";
emptyMessage.className="no-results";

var filterInput=document.getElementById("filter-apps");
var pageLimit=document.getElementById("page-limit");
var filterPages=document.getElementById("pages");

var myPagination = new filterPagination(pageLimit,filterPages);
var myFilter = new filter(filterInput, myPagination,applicationsContainer, emptyMessage);


var is_desktop=localStorage.getItem("isDesktop")=="true"?true:false;
var is_tablet=localStorage.getItem("isTablet")=="true"?true:false;

var arrowMessage=document.getElementById("arrow-message");

function deleteCurApp() {
};// just an empty function which will be overwritten later

// the dialogs
var deleteAppModal = new modalView({
	id : "deleteModal",
	autoShow : false,
	type : "m-submit",
	width : 300,
	title : "Delete application",
	content : "You are about to delete this application.\n Please confirm.",
	approve : {
		label : "Delete",
		action : "deleteCurApp"
	},
	deny : {
		scope : "self",
		label : "Cancel",
		action : "hide"
	}
});


var tmpWidth=90;
var tmpUnits="%";
if(is_tablet){
	var tmpWidth=300;
	var tmpUnits="px";
}

//special kind of modal used for buttons
var actionButtonsModal = new modalView({
	id : "actions",
	autoShow : false,
	title : "Options",
	type : "m-submit",
	width:tmpWidth,
	widthUnits:tmpUnits,
	approve : {
		scope : "self",
		label : "Cancel",
		action : "hide"
	}
});


//actionButtonsModal.dataContainer.className+=" m-actions";
//actionButtonsModal.background.className="full-bg";


var hideDisabled = document.getElementById("show-disabled-apps");
var value = false;

var mobileButtons=[];

var applicationJustCreated=sessionStorage.getItem("applicationJustCreated");
sessionStorage.removeItem("applicationJustCreated");
var group1=getAnchorsAndPanelById("t2");
var group2=getAnchorsAndPanelById("t5");
if(applicationJustCreated){
	group1.anchor.parentNode.removeChild(group1.anchor);
	group1.panel.parentNode.removeChild(group1.panel);
}else{
	group2.anchor.parentNode.removeChild(group2.anchor);
	group2.panel.parentNode.removeChild(group2.panel);
}


try {
	value = localStorage.getItem(userEmail + '.ShowDisabledApps');
} catch (e) {
	localStorage.setItem(userEmail + '.ShowDisabledApps', hideDisabled.checked);
}

hideDisabled.checked = value=="true"?true:false;

myFilter.restriction = !hideDisabled.checked;

// events
hideDisabled.onclick = function() {
	localStorage.setItem(userEmail + '.ShowDisabledApps', this.checked);
	toogleDisplayDisabled(this.checked);
	myFilter.goToPage(1);
	checkFilterAndPaginationVisibility();
}

localStorage.removeItem(userEmail+".curAppKey");



var link= WhateverConfig.baseURL + 'core/app/listAll/' + userEmail + '/' + sessionToken;
myGuardian.ajaxClient.addRequestToQueue({
	  method:'GET', 
	  link:link,
	  callbackFunction:getAppsCallback, 
	  responseFormat:"JSON",
	});



function getAppsCallback(resultJSON) {
	applicationsContainer.innerHTML = "";
	if (resultJSON.statusCode != null) {
		switch (resultJSON.statusCode) {
		case "401":
			// than we have a problem
			myGuardian.showRelogin();
			break;
		case "204":
			
			showArrow();
			//myFilter.testEmptyList();
			//hideDisabled.parentNode.style.display="none";
			break;
		case "500":
			ErrorMessages.showError("Internal server error!");
			break;
		}
		return;
	}
    
	hideArrow();
	generateApplicatonsList(resultJSON);
	
	
}



function hideArrow(){
	arrowMessage.parentNode.removeChild(arrowMessage);
	var filterInput=document.getElementById("filter-apps").parentNode;
	var toShow=hideDisabled.parentNode.parentNode;
	filterInput.style.display="block";
	toShow.style.display="block";
}

function showArrow(){
		var toRemove=hideDisabled.parentNode.parentNode;
	    filterInput.parentNode.removeChild(filterInput);
	    toRemove.parentNode.removeChild(toRemove);
	    applicationsContainer.parentNode.removeChild(applicationsContainer);
	    arrowMessage.style.display="block";
		
}

function toogleMobileButtonsActive(active){
	for(var i=0;i<mobileButtons.length;i++){
		mobileButtons[i].style.display=active?"":"none";
	}
	actionButtonsModal.fill();
}
function generateLink(label,url,appKey,appAlias,appName){
	var link=document.createElement("a");
	link.className="page-btn";
	link.innerHTML=label;
	link.onclick=function(){
		localStorage.setItem(userEmail+".curAppAlias",appAlias); 
		localStorage.setItem(userEmail+".curAppKey",appKey);
		localStorage.setItem(userEmail+".curAppName",appName);
		window.location.href = "/"+url;
	}
	mobileButtons.push(link);
	return link;
}
// helper function - we generate an element representing the one application in
// the list
// - we also generate the events for edit, delete and change Active status

function generateListItem(appKey, appName, appDesc, appActive, appAlias) {
	
	var tmpElem = document.createElement("li");
	
	var elementContent=document.createElement("div");
	elementContent.className="element-content";
	elementContent.setAttribute('title','Go to application');
	
	if(appActive && is_desktop===true){
		elementContent.onclick=function(){
			    localStorage.setItem(userEmail+".curAppAlias",appAlias); 
				localStorage.setItem(userEmail+".curAppKey",appKey);
				localStorage.setItem(userEmail+".curAppName",appName);
		     	window.location.href = "/appDetails.html";
	    }
	}
	
	var elementActions=document.createElement("div");
	elementActions.className="element-actions";
	
	
	
	
	// the title
	var tmpTitle = document.createElement("h2");
	tmpTitle.innerHTML = appName;

	

	// the delete button
	var tmpDelete = document.createElement("a");
	tmpDelete.className = is_desktop?"white-page-button":"page-btn";
	tmpDelete.innerHTML = "Delete";
	
	if(!is_desktop){
	   tmpDelete.innerHTML+= " App";
	}
	tmpDelete.onclick = setDeleteOneAppEvent(tmpDelete, appKey, sessionToken,tmpElem);
	

	
	

	// the activate/deactivate button
	var tmpEnable = document.createElement("a");
	tmpEnable.className = is_desktop?"white-page-button":"page-btn";
	
	var label = "Disable";
	if (!appActive) {
		label = "Enable";
		tmpElem.className = "disabled";
	} else {
		tmpElem.className = "";
	}
	if(is_desktop===false){
		label+= " App";
	}
	tmpEnable.innerHTML = label;

	// add event to the enable/disable button
	var lastActiveChanged = {
		container : tmpElem,
		buttonsContainer:elementActions,
		button : tmpEnable,
		previewButton:elementContent,
		appAlias:appAlias,
		appKey:appKey,
		appName:appName,
		pointer : {
			isActive : appActive
		},
		delButton : tmpDelete,
		title : tmpTitle,
		
	}
	tmpEnable.onclick = setActivateDeactivateEvent(lastActiveChanged, appKey, sessionToken);
	

	// the description container
	
	var tmpDescription = document.createElement("div");
	tmpDescription.innerHTML = appDesc;

	
	
	// the close button
	if(!is_desktop){
		var closeButton=document.createElement("a");
		closeButton.innerHTML="x";
		closeButton.className="m-close";
		closeButton.onclick=function(){
			actionButtonsModal.hide();
		}
	
		
		elementActions.appendChild(generateLink("App Details","appDetails.html",appKey,appAlias));
		elementActions.appendChild(generateLink("App Settings","editApplication.html",appKey,appAlias));
		//elementActions.appendChild(generateLink("Customize Services","createCapability.html",appKey,appAlias));
		toogleMobileButtonsActive(appActive);
		
	}	
		// adding all the elements to the container
	elementContent.appendChild(tmpTitle);
	if(appDesc!=""){
	  elementContent.appendChild(tmpDescription);
	}
	tmpElem.appendChild(elementContent);
	
	elementActions.appendChild(tmpEnable);
	elementActions.appendChild(tmpDelete);
	
	
		// adding the two containers to the element
		
	if(is_desktop){
	   tmpElem.appendChild(elementActions);
	   tmpElem.onmouseover=function(){
			elementActions.style.visibility="visible";
		}
		tmpElem.onmouseout=function(){
			elementActions.style.visibility="hidden";
		}
	}else{
		// set the click event on the list element
		tmpElem.onclick=function(){
			actionButtonsModal.contentContent.innerHTML="";
			actionButtonsModal.contentContent.appendChild(elementActions);
			
			toogleMobileButtonsActive(lastActiveChanged.pointer.isActive);
			actionButtonsModal.show();
		}
	}
	
	return tmpElem;
}



function setActivateDeactivateEvent(paramsObject, appKey, sessionToken) {
	return function() {
		var cmd = "enable";
		var tmethod = "PUT";
		if (paramsObject.pointer.isActive) {
			cmd = "disable"
			tmethod = "DELETE";
		}
		// and launch the request
		var serviceLink = WhateverConfig.baseURL + 'core/app/' + cmd + '/' + appKey + '/' + sessionToken;
		myGuardian.ajaxClient.addRequestToQueue({
			  method:tmethod, 
			  link:serviceLink,
			  callbackFunction:statusChangeAppCallback, 
			  responseFormat:"JSON",
			  callbackFunctionParameters : [ paramsObject ]
			});
		
	}

}

function setDeleteOneAppEvent(button, appKey, sessionToken,toRemove) {
	return function() {
		deleteAppModal.show();
		// setting the deleteCurApp function with arguments in order for modal
		// view to grab
		deleteCurApp = function() {
			
			var link=WhateverConfig.baseURL + 'core/app/' + appKey + '/' + sessionToken;
			myGuardian.ajaxClient.addRequestToQueue({
				  method:"DELETE", 
				  link:link,
				  callbackFunction:delAppCallback, 
				  responseFormat:"JSON",
				  callbackFunctionParameters : [ toRemove, appKey ]
				});
		}

	}

}

function statusChangeAppCallback(resultJSON, lastActiveChanged) {
	if (resultJSON.statusCode != null) {
		switch (resultJSON.statusCode) {
		case "401":
			// than we have a problem
			myGuardian.showRelogin();
			break;
		case "500":
			ErrorMessages.showError("Internal server error!");
			break;
		}
	} else {
		if(!is_desktop){
			toogleMobileButtonsActive(resultJSON.active);
		}
		
		var appsList=myGuardian.retreiveStorageAppsList(userEmail);
		
		if (resultJSON.active) {
			lastActiveChanged.button.innerHTML = "Disable";
			// next we change the style and actions
			lastActiveChanged.container.className = "";
			lastActiveChanged.previewButton.onclick=function(){
				localStorage.setItem(userEmail+".curAppAlias",lastActiveChanged.appAlias);
				localStorage.setItem(userEmail+".curAppKey",lastActiveChanged.appKey);
				window.location.href = "/appDetails.html";
			}
			
			var indexToEnable=appsList.storageAppKeys.indexOf(lastActiveChanged.appKey);
			if(indexToEnable>-1){
				appsList.storageAppActive[indexToEnable]="true";
			}
			
		} else {
			lastActiveChanged.button.innerHTML = "Enable";
			// next we change the style too
			lastActiveChanged.container.className = "disabled";
			lastActiveChanged.previewButton.onclick=null;
			
			var indexToDisable=appsList.storageAppKeys.indexOf(lastActiveChanged.appKey);
			if(indexToDisable>-1){
				appsList.storageAppActive[indexToDisable]="false";
			}
			
		}
		
		myGuardian.saveAppList(userEmail,appsList);
		
		if(is_desktop===false){
			lastActiveChanged.button.innerHTML += " App";
		}

		lastActiveChanged.pointer.isActive = resultJSON.active;

		// change the restricted flag on this element
		myFilter.changeRestrictedFlag(lastActiveChanged.container,
				!resultJSON.active);

		toogleDisplayDisabled(hideDisabled.checked);
		
		myFilter.goToPage(null);
		checkFilterAndPaginationVisibility();
		checkShowDisabledVisibility();
	}
	
}

function delAppCallback(resultJSON, lastDeleted, appKey) {
	if(!is_desktop){
		actionButtonsModal.hide();
	}
	if (resultJSON.statusCode != null) {
		switch (resultJSON.statusCode) {
		case "401":
			// than we have a problem
			myGuardian.showRelogin();
			break;
		case "500":
			ErrorMessages.showError("Internal server error!");
			break;
		}
	} else {
		if (lastDeleted) {
			myFilter.removeElement(lastDeleted);
		}
		if(myFilter.dataMap.length<=0){
			pageLimit.style.visibility="hidden";
		}
		
		/*remove it also from the storage list*/
		var appsList=myGuardian.retreiveStorageAppsList(userEmail);
		var indexToDelete=appsList.storageAppKeys.indexOf(appKey);
		if(indexToDelete>-1){
			appsList.storageAppActive[indexToDelete]="false";
		}
		myGuardian.saveAppList(userEmail,appsList);
		checkShowDisabledVisibility();
		ErrorMessages.showSuccess("Application successfully deleted.");
	}
}

function checkShowDisabledVisibility(){
	if(myFilter.totalRestricted<=0){
		hideDisabled.parentNode.style.display="none";
	}else{
		hideDisabled.parentNode.style.display="block";
	}
}

function generateApplicatonsList(dataJSON) {
	var myList = document.createElement("ul");

	var sortVector = [];
	var preInsertVector = [];
    var storageAppNames=[];
    var storageAppAliases=[];
    var storageAppKeys=[];
    var storageAppActive=[];
	for ( var i = 0; i < dataJSON.length; i++) {
		
		
		
		// virtually create the element
		var newelem = generateListItem(dataJSON[i].id, dataJSON[i].name,
				dataJSON[i].desc, dataJSON[i].active,dataJSON[i].alias);

		// select the search term for sorting
		searchTerm = dataJSON[i].modifiedTimestamp;

		// we search for the insertion position
		var cnt = 0;
		while (cnt < sortVector.length && searchTerm < sortVector[cnt]) {
			cnt++;
		}
		sortVector.splice(cnt, 0, searchTerm);
        
		storageAppNames.splice(cnt,0,dataJSON[i].name);
		storageAppAliases.splice(cnt,0,dataJSON[i].alias);
		storageAppKeys.splice(cnt,0,dataJSON[i].id);
		storageAppActive.splice(cnt,0,dataJSON[i].active);
		
        
		
		preInsertVector.splice(cnt, 0, {
			strData : dataJSON[i].name + " " + dataJSON[i].desc,
			domElement : newelem,
			restricted : !dataJSON[i].active
		});
	}
	localStorage.setItem(userEmail+".storageAppNames",storageAppNames);
	localStorage.setItem(userEmail+".storageAppAliases",storageAppAliases);
	localStorage.setItem(userEmail+".storageAppKeys",storageAppKeys);
	localStorage.setItem(userEmail+".storageAppActive",storageAppActive);

	// in the end, adding the virtual sorted list to dom
	for ( var i = 0; i < preInsertVector.length; i++) {
		myList.appendChild(preInsertVector[i].domElement);
		// and adding the new element to filter
		myFilter.addElement(preInsertVector[i]);
	}

	applicationsContainer.appendChild(myList);
	sortVector = null;
	preInsertVector = null;
	// and show elements according to show/hide checkbox
	toogleDisplayDisabled(hideDisabled.checked);
	myFilter.goToPage(1);
	checkFilterAndPaginationVisibility();
	checkShowDisabledVisibility();
}



// helper function
function toogleDisplayDisabled(checked) {
	// tell the filter if it is in a restricted status
	myFilter.restriction = !checked;
	myFilter.filterData();
	checkFilterAndPaginationVisibility();

}

function getAnchorsAndPanelById(id){
	var allElements=document.getElementsByClassName("tooltip-anchor");
	for(var i=0;i<allElements.length;i++){
		if(allElements[i].getAttribute("tid")==id){
			  var tmpElem=allElements[i].nextSibling;
			   while(tmpElem.className!="tooltip-panel" && tmpElem.nextSibling){
			      tmpElem=tmpElem.nextSibling;
			   } 
			   return {"anchor":allElements[i],"panel":tmpElem};
		}
	}    	
}

function checkFilterAndPaginationVisibility(){
	if(myFilter.totalVisible<=5){
		filterInput.style.display="none";
		pageLimit.style.display="none";
		/*filterPages=style.display="none";*/
	}else{
		filterInput.style.display="block";
		pageLimit.style.display="block";
		/*filterPages=style.display="block";*/
	}
}