
var userEmail = sessionStorage.getItem("userEmail");

var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");
var myExplorer=new deviceExplorer("devices");


/*test to see if we have a capa to edit*/

var currentCapa=sessionStorage.getItem(userEmail+".currentCapa");
if(!currentCapa){
	window.location.href = "/allCapabilities.html";
}




/*var capaNameContainer=document.getElementById("currentCapName");
capaNameContainer.innerHTML=currentCapa;*/

var capaNameTitleContainer=document.getElementById("currentCapNameTitle");
capaNameTitleContainer.innerHTML=currentCapa;

//getCustomCapabilitiesPerCapaName();

toggleMasterPreloader(false);

var senderButtonContainer=document.getElementById("custom-top-action");
var submitBut=document.getElementById("save-capa");


var capaValueInput=document.getElementsByName("capaValue")[0];

submitBut.onclick=function(){
	var capaName=currentCapa;
	var capaValue=capaValueInput.value;
	
	
	if(capaValue.length<1){
		ErrorMessages.showError("Please insert a valid capability value");
		return false;
	}
	addCapabilityToDevicesId(capaName,capaValue);
}

var request={};
var cntDevices=0;
var targets=[];
var link="";
var errors="Problems setting custom capability (";
var hadAddError=false;

function getCustomCapabilitiesPerCapaName(){
	var link=WhateverConfig.baseURL+"ddr/admin/custom/"+appKey;//?deviceId={deviceId}
	 myGuardian.ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:link,
			  async:false,
			  callbackFunction:getCustomCapabilitiesCallback, 
			  responseFormat:"JSON",
			});
}

function getCustomCapabilitiesCallback(resultJSON){
	
}


function addCapabilityToDevicesId(capaName,capaValue){
	   
		request={};
		request.appId=appKey;
		
		errors="Problems setting custom capability (" ;
		cntDevices=0;
		
	   link=WhateverConfig.baseURL+"ddr/admin/custom";
	   targets=[];
	   for(var id in myExplorer.selectedItems){
	     targets.push(id);
	   }
	   if(targets.length==0){
		   ErrorMessages.showError("Please select a device or a device group");
		   return false;
	   }
	   request.capabilityName=WhateverUtils.fixedEncodeURIComponent(capaName);
	   request.capabilityValue=WhateverUtils.fixedEncodeURIComponent(capaValue);
	   toggleMasterPreloader(true);
	   
	   request.deviceId=targets[0];
	   myGuardian.ajaxClient.addRequestToQueue({
				  method:'POST', 
				  link:link,
				  requestParameters : JSON.stringify(request),
				  requestParametersComputing : false, 
				  callbackFunctionParameters :[targets[0]],
				  callbackFunction:addCapabilityToDevicesIdCallback, 
				  responseFormat:"JSON"
		});
	   
}

function addCapabilityToDevicesIdCallback(responseJSON,deviceName){
	if(responseJSON.statusCode){
		if(responseJSON.statusCode!="201"){
		    hadAddError=true;
		    errors+=" "+deviceName;
		}
	}
	cntDevices++;
	if(cntDevices<targets.length){
		   request.deviceId=targets[cntDevices];
		   myGuardian.ajaxClient.addRequestToQueue({
				  method:'POST', 
				  link:link,
				  requestParameters : JSON.stringify(request),
				  requestParametersComputing : false, 
				  callbackFunctionParameters :[targets[cntDevices]],
				  callbackFunction:addCapabilityToDevicesIdCallback, 
				  responseFormat:"JSON"
			});
	}else{
		toggleMasterPreloader(false);
		errors+=")";
		if(hadAddError){
		  ErrorMessages.showError(errors);
		  hadAddError=false;
		}else{
			window.location.href = "/allCapabilities.html";
		}
	}
	
}