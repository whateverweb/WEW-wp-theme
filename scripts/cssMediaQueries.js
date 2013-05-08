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
		
		var cssServURL = "http://" + resultJSON.cssURL + "/path-to-css-file";
		var container=document.getElementById("mq-url");
		container.innerHTML=cssServURL;
	}
}