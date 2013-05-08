function checkboxSwitch(id,callback){
	var container=document.getElementById(id);
	container.innerHTML="";
	this.checkbox=document.createElement("input");
	this.checkbox.type="checkbox";
	container.appendChild(this.checkbox);
	this.state=false;
	
	var scope=this;
	this.checkbox.onchange=function(){
		scope.state=this.checked;
		if(callback){
     		callback();
     	}
	}
}

checkboxSwitch.prototype.refreshState=function(){
   this.checkbox.checked=this.state;
}

checkboxSwitch.prototype.setState=function(newState){
	this.state=newState;
	this.refreshState();
}
//------------------------------------------------------------------------

var userEmail = sessionStorage.getItem("userEmail");

var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");

var switchDebugMode=new switchButton("debug-mode",sendDebugMode);
var sending=false;
var debugMode;

//the git settings part---------------------------------
var switchPublishing=new checkboxSwitch("git-publishing",showPublishSettings);
var switchCompressJs=new checkboxSwitch("git-compress-js",checkApplyVisibility);
var switchOptimizeImages=new checkboxSwitch("git-optimize-images",checkApplyVisibility);
var switchEnableSass=new checkboxSwitch("git-enable-sass",checkApplyVisibility);
var gitPublishSSH=document.getElementById("git-ssh");

var applyButton=document.getElementById("git-send");
applyButton.className="cyan-page-button disabled";

var oldGitValues={};

var showGitSettingsButton=document.getElementById("git-setup-show");
//var settingsForm=document.getElementById("git-setup");

var gitSubsettings=document.getElementById("git-settings-subsection");

var gitServicesDom=document.getElementById("git-settings-subsection").getElementsByClassName("label-text");
var deploymentHistory=document.getElementById("deployment-history");
var gitServices=Array.prototype.slice.call(gitServicesDom);



switchCompressJs.setState(true);
switchOptimizeImages.setState(true);
switchEnableSass.setState(true);
applyButton.disabled=true;

function setAllElementsDisabledStatus(value){
	switchCompressJs.checkbox.disabled=value;
	switchOptimizeImages.checkbox.disabled=value;
	switchEnableSass.checkbox.disabled=value;
	applyButton.disabled=value;
	var tmpClassName=value?"label-text-disabled":"label-text";
	for(var i=0;i<gitServices.length;i++){
		gitServices[i].className=tmpClassName;
	}
}

gitPublishSSH.disabled=true;
setAllElementsDisabledStatus(true);
//--------------------------------------------------------------------
//getting the application details and fill the form
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
		case "500":
			ErrorMessages.showError("Internal server error");
			break;
		}
	} else {
		
		switchDebugMode.setState(resultJSON.debugMode);
		debugMode=resultJSON.debugMode;
		
		// filling in the info of git settings
		switchPublishing.setState(resultJSON.gitPublishing);
		switchCompressJs.setState(resultJSON.compressJS);
		switchEnableSass.setState(resultJSON.enableSASS);
		switchOptimizeImages.setState(resultJSON.optimizeImages);
		
		/*if(resultJSON.gitPublishing){
			//gitPublishSSH.style.display="block";
			gitPublishSSH.disabled=false;
			setAllElementsDisabledStatus(false);
		}else{
			gitPublishSSH.disabled=true;
			setAllElementsDisabledStatus(true);
		}*/
		if(resultJSON.sshKey){
		   gitPublishSSH.value=resultJSON.sshKey;
		}
		
		oldGitValues.switchPublishing=switchPublishing.state;
		oldGitValues.switchCompressJs=switchCompressJs.state;
		oldGitValues.switchEnableSass=switchEnableSass.state;
		oldGitValues.switchOptimizeImages=switchOptimizeImages.state;
		oldGitValues.gitPublishSSH=gitPublishSSH.value;
		
		showPublishSettings(true);
		toggleMasterPreloader(false);
		
	}
}


//git publishing button and actions----------------------------------


gitPublishSSH.onkeyup=checkApplyVisibility;

function checkApplyVisibility(){
 if(gitPublishSSH.value=="" || gitPublishSSH.disabled){
	 setAllElementsDisabledStatus(true);
 }else{
	 setAllElementsDisabledStatus(false);
 }	
	
 if(checkAgainstoldGitValues() || gitPublishSSH.value=="" || gitPublishSSH.disabled ){
	   applyButton.className="cyan-page-button disabled";
	   applyButton.disabled=true;
 }else{
	 applyButton.className="cyan-page-button";
	 applyButton.disabled=false;
 }
}

function showPublishSettings(firstTime){
	
	deploymentHistory.style.display=switchPublishing.state?"block":"none";
	
	if(switchPublishing.state){
		var oldStatus=gitPublishSSH.disabled;
		gitPublishSSH.disabled=false;
		setAllElementsDisabledStatus(false);
	}else{
		gitPublishSSH.disabled=true;
		setAllElementsDisabledStatus(true);
		if(!checkAgainstoldGitValues()){
		   sendGitSettings();
		}
	}
	checkApplyVisibility();
}


//---------------------------------------------------------------

function checkAgainstoldGitValues(){
	return (oldGitValues.switchPublishing==switchPublishing.state &&
			oldGitValues.switchCompressJs==switchCompressJs.state &&
			oldGitValues.switchEnableSass==switchEnableSass.state &&
			oldGitValues.switchOptimizeImages==switchOptimizeImages.state &&
			oldGitValues.gitPublishSSH==gitPublishSSH.value);
}


function sendGitSettings(){
 //validation----------------------------
    /*if(this.disabled){
    	return;
    }*/
	if(checkAgainstoldGitValues()){
		ErrorMessages.showError("No changes since last save.");
		return;
	}
	if(switchPublishing.state && gitPublishSSH.value==""){
		return;
	}
	
 //----------------------------------------	
	
	
 var compressJs=switchCompressJs.state;
 var optimizeImages=switchOptimizeImages.state;
 var enableSass=switchEnableSass.state;
 if(!switchPublishing.state){
	 compressJs=optimizeImages=enableSass=false;
 }
 toggleMasterPreloader(false);	
 var link=WhateverConfig.baseURL + 'core/app/'+appKey+'/'+sessionToken+'/';
 link+="?";
 link+="gitPublishing="+switchPublishing.state;
 link+="&";
 link+="compressJS="+compressJs;
 link+="&";
 link+="optimizeImages="+optimizeImages;
 link+="&";
 link+="enableSASS="+enableSass;
 
 myGuardian.ajaxClient.addRequestToQueue({
		  method:'POST', 
		  link:link,
		  callbackFunction:sendGitSettingsCallback, 
		  responseFormat:"JSON",
		  plainMessage:gitPublishSSH.value
		});

}

function sendGitSettingsCallback(resultJSON){
	if(resultJSON.statusCode!=null){
		switch(resultJSON.statusCode){
		   case "401":
			// than we have a problem
			   myGuardian.showRelogin();
		      break;
		   case "400":
			   ErrorMessages.showError("Please, ensure you have provided a valid SSH Key.");
			   break;
		   case "500":
			   ErrorMessages.showError("Internal server error.");
			  break;
		}
	}else{
		oldGitValues.switchPublishing=switchPublishing.state;
		oldGitValues.switchCompressJs=switchCompressJs.state;
		oldGitValues.switchEnableSass=switchEnableSass.state;
		oldGitValues.switchOptimizeImages=switchOptimizeImages.state;
		oldGitValues.gitPublishSSH=gitPublishSSH.value;
		checkApplyVisibility();
		toggleMasterPreloader(false);
		ErrorMessages.showSuccess("Git settings successfully updated");
	}
}

/*debug mode functions*/
function sendDebugMode(){
	if(sending || switchDebugMode.state==debugMode){
		return false;
	}
	sending=true;
	
	var link=WhateverConfig.baseURL + 'core/app/' + appKey + '/'+switchDebugMode.state+'/' + sessionToken;
	myGuardian.ajaxClient.addRequestToQueue({
		  method:'PUT', 
		  link:link,
		  callbackFunction:sendDebugModeCallback, 
		  responseFormat:"JSON",
		});
}

function sendDebugModeCallback(resultJSON) {
	if (resultJSON.statusCode != null) {
	  switch (resultJSON.statusCode) {
		case "401":
			// than we have a problem
			  myGuardian.showRelogin();
			break;
		case "500":
			ErrorMessages.showError("Internal server error.");
			break;
	  }
	  switchDebugMode.setState(debugMode);
    
	} else {
		switchDebugMode.setState(resultJSON.debugMode);
		debugMode=resultJSON.debugMode;
	}
	sending=false;
}
/*---------------------------------*/

applyButton.onclick=sendGitSettings;