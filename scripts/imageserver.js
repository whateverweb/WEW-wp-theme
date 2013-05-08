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
	
	}else{
		
		var imgServURL = "http://" + resultJSON.imgURL + "/path-to-image";
		var container=document.getElementById("is-url");
		container.innerHTML=imgServURL;
	}
}