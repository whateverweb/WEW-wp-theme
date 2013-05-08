
var userEmail = sessionStorage.getItem("userEmail");

var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");

var myExplorer=new deviceExplorer("devices");

toggleMasterPreloader(false);

var senderButtonContainer=document.getElementById("custom-top-action");
var submitBut=document.getElementById("save-capa");

var capaNameInput=document.getElementsByName("capaName")[0];
var capaValueInput=document.getElementsByName("capaValue")[0];

submitBut.onclick=function(){
	var capaName=capaNameInput.value;
	var capaValue=capaValueInput.value;
	
	if(capaName.length<1){
		ErrorMessages.showError("Please insert a valid capability name");
		return false;
	}
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
function addCapabilityToDevicesId(capaName,capaValue){
	   
		request={};
		request.appId=appKey;
		
	   errors="Problems setting custom capability (";
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
			ErrorMessages.showSuccess("Capability successfully saved");
			capaNameInput.value='';
			capaValueInput.value='';
		}
	}
	
}