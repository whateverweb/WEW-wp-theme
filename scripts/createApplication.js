
var lastForm = null;

var userEmail = sessionStorage.getItem("userEmail");

var createApplicationForm=document.getElementById("create-application-form");

var trigger_standard=document.getElementById("configuration_standard");
var trigger_custom=document.getElementById("configuration_custom");

var trigger_standard_a=document.getElementById("configuration_standard_a");
var trigger_custom_a=document.getElementById("configuration_custom_a");

var customConfigurationContainer=document.getElementById("custom-configuration-container");

function checkFormCreateApplication(form) {
	
	lastForm=form;
	
	if(trigger_custom.checked){
		if(form.hostNameCustom.value=="" && form.baseURLCustom.value=="" ){
			ErrorMessages.showError("Please fill at least the domain or base URL field.");
			return false;
		}
	}
	
	var rules=[
	           {
			   		field:"appName",
			   		rules:["regexp:.{2,}"],
			   		errors:["Please enter the application name."]
				}
			];
	formValidator.validate(form,rules,checkFormCreateApplicationError,checkFormCreateApplicationSuccess);
	return false;
}

function checkFormCreateApplicationError(error){
	ErrorMessages.showError(error);
}

function checkFormCreateApplicationSuccess(form){
	var sessionToken = sessionStorage.getItem("id");
	var userEmail=sessionStorage.getItem("userEmail");
	var appName=form.appName.value;
	
	var link=WhateverConfig.baseURL+'core/app/'+WhateverUtils.fixedEncodeURIComponent(appName)+'/'+WhateverUtils.fixedEncodeURIComponent(userEmail)+'/'+sessionToken;
	link+='?desc=' + WhateverUtils.fixedEncodeURIComponent(form.appDescription.value);
	
	if(trigger_custom.checked){
		link+= '&alias='+WhateverUtils.fixedEncodeURIComponent(form.baseURLCustom.value);
		link+='&hostname=' + WhateverUtils.fixedEncodeURIComponent(form.hostNameCustom.value);
		link+= '&domain=';
		/*link+= '&domain='+WhateverUtils.fixedEncodeURIComponent(form.baseURLCustom.value);
		link+='&alias='+WhateverUtils.fixedEncodeURIComponent(form.cNameCustom.value);*/
	}
	
	myGuardian.ajaxClient.addRequestToQueue({
		  method:'POST', 
		  link:link,
		  callbackFunction:createAppCallback, 
		  responseFormat:"JSON",
		});
}


function createAppCallback(resultJSON) {
	if(resultJSON.statusCode!=null){
		switch(resultJSON.statusCode){
		   case "401":
			// than we have a problem
			   myGuardian.showRelogin();
		      break;
		   case "409":
				  // than we have a name duplicate
			   ErrorMessages.showError("You already have an application with this name, alias or site domain.");
			      break;
		   case "500":
			   ErrorMessages.showError("Internal server error.");
			  break;
		}
	}else{
		// we stock the current app id and send to appDetails
		
		var appsList=myGuardian.retreiveStorageAppsList(userEmail);
		
		var curAppAlias= resultJSON.alias;
		var curAppKey= resultJSON.id;
		var curAppName=resultJSON.name;
			
		appsList.storageAppAliases.unshift(curAppAlias);
		appsList.storageAppKeys.unshift(curAppKey);
		appsList.storageAppNames.unshift(curAppName);
		appsList.storageAppActive.unshift("true");
		
		localStorage.setItem(userEmail+".curAppKey",curAppKey);
		localStorage.setItem(userEmail+".curAppAlias",curAppAlias);
		localStorage.setItem(userEmail+".curAppName",curAppName);
		
		myGuardian.saveAppList(userEmail,appsList);
		
		
		formValidator.emptyForm(lastForm);
		sessionStorage.setItem("applicationJustCreated","true");
		window.location.href="/appDetails.html";
	}
}

function toggleElementsAvailability(trigger,enabled){
	var container=trigger.parentNode;
	var children=container.getElementsByClassName("options-subsection");
	var childrenInputs=container.getElementsByTagName("input");
	var newClassName=enabled?"options-subsection":"options-subsection disabled";
	for(var i=0;i<children.length;i++){
		children[i].className=newClassName;
	}
	for(var i=0;i<childrenInputs.length;i++){
		if(childrenInputs[i].type=="text" && childrenInputs[i].name!="cNameCustom"){
			childrenInputs[i].disabled=!enabled;
		}
	}
}

trigger_standard.onclick=trigger_custom.onclick=function(){
	if(trigger_custom.checked){
		toggleElementsAvailability(trigger_custom,true);
		toggleElementsAvailability(trigger_standard,false);
	}else{
		toggleElementsAvailability(trigger_custom,false);
		toggleElementsAvailability(trigger_standard,true);
	}
}

trigger_standard_a.onclick=function(){
	trigger_standard.click();
}

trigger_custom_a.onclick=function(){
	trigger_custom.click();
}

trigger_standard.click();