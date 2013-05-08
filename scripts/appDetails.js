
var userEmail = sessionStorage.getItem("userEmail");

var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");

myGuardian.ajaxClient.addRequestToQueue({
	  method:'GET', 
	  link:WhateverConfig.baseURL + 'core/app/' + appKey + '/' + sessionToken,
	  callbackFunction:getAppDetailsCallback, 
	  responseFormat:"JSON",
	});



function getAppDetailsCallback(resultJSON) {
	if (resultJSON.statusCode != null) {
		switch (resultJSON.statusCode) {
		case "401":
			// than we have a problem
			myGuardian.showRelogin();
			break;
			
		case "404":
			ErrorMessages.showError("Application not found.");
			break;	
			
		case "500":
			ErrorMessages.showError("Internal server error.");
			break;
		}
	} else {
		// should fill the form
		var appDescContainer = document.getElementById("app-description");
		var appKeyContainer = document.getElementById("app-key");
		var appIsContainer = document.getElementById("is-url");
		var appDdrContainer = document.getElementById("ddr-url");
		var appMqContainer = document.getElementById("mq-url");
		var gitAddrContainer=document.getElementById("git-url");
		
		if(resultJSON.desc!=""){
			appDescContainer.innerHTML = resultJSON.desc;
		}else{
			appDescContainer.parentNode.parentNode.removeChild(appDescContainer.parentNode);
		}
		appKeyContainer.innerHTML = resultJSON.id;
		
       
		var baseServURL = "http://";
		var imgServURL = baseServURL + resultJSON.imgURL + "/";
		imgServURL += "path-to-image";
		appIsContainer.innerHTML = imgServURL;

		var ddrServURL = baseServURL + resultJSON.ddrURL + "/[parameters]";
		appDdrContainer.innerHTML = ddrServURL;
		var cssServURL = baseServURL + resultJSON.cssURL + "/path-to-css-file";
		appMqContainer.innerHTML = cssServURL;
	
		if(resultJSON.gitPublishing){
			gitAddrContainer.innerHTML="git@scm.wew.io:"+appKey+".git";
			gitAddrContainer.parentNode.style.display="";
		}else{
			gitAddrContainer.parentNode.parentNode.removeChild(gitAddrContainer.parentNode);
		}
		toggleMasterPreloader(false);
	//---------------------------------------
	}
}

