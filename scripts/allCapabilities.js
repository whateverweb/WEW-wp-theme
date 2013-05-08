var ajaxClient=new Ajax();

var userEmail = sessionStorage.getItem("userEmail");

var appAlias = localStorage.getItem(userEmail+".curAppAlias");
var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");

var tableContainer=document.getElementById("list-all-capabilities");
var listContainer=tableContainer.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];

var masterHeader=tableContainer.getElementsByTagName("table")[0].getElementsByTagName("th")[0];


var groupedCapaNames=[];
var groupedValues=[];
var containersList=[];
var sorter=new Sorter();
var sortOrder=false;


getCustomCapabilities();

var currentCapa=sessionStorage.getItem(userEmail+".currentCapa");
sessionStorage.removeItem(userEmail+".currentCapa");




function getCustomCapabilities(){
	var link=WhateverConfig.baseURL+"ddr/admin/custom/"+appKey;//?deviceId={deviceId}
   //var link="http://ddr." +appAlias+'/custom/';
   ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:link,
			  callbackFunction:getCustomCapabilitiesCallback, 
			  responseFormat:"JSON",
			});
}


function generateCapabilityGroupContainer(containerTBody,capaName){
    var trContainer=document.createElement("tr");
	var tdContainer=document.createElement("td");
	
	var expandButton=document.createElement("img");
	expandButton.src="images/expand.png";
	
	var capaNameContainer=document.createElement("div");
	capaNameContainer.innerHTML=capaName;
	capaNameContainer.className="capability-name";
	
	/*var deleteContainer=document.createElement("div");
	var deleteButton=createLink("Delete");
	deleteContainer.className="delete-capability";*/
	
	var editButton=createLink("Add more devices");
	
	
	tdContainer.appendChild(expandButton);
	tdContainer.appendChild(capaNameContainer);
	//tdContainer.appendChild(deleteContainer);
	tdContainer.appendChild(editButton);
	
	
	trContainer.appendChild(tdContainer);
	
	
	var valuesListContainer=generateValuesTable();
	tdContainer.appendChild(valuesListContainer.table);
	
	containerTBody.appendChild(trContainer);
	
	valuesListContainer.table.style.display="none";
	
	setEditDevicesEvent(editButton,capaName);
	setExpandCollapseEvent(expandButton,capaNameContainer,valuesListContainer.table,tdContainer);
	if(currentCapa==capaName){
		expandButton.click();
	}
	return {"tbody":valuesListContainer.tbody,"masterContainer":trContainer};
}

function setEditDevicesEvent(button,capaName){
	button.onclick=function(){
		sessionStorage.setItem(userEmail+".currentCapa",capaName);
		window.location.href = "/editCapability.html";
	}
}

function setExpandCollapseEvent(expandButton,title,valuesListContainer,tdContainer){
	expandButton.onclick=title.onclick=function(){
		   var visible=valuesListContainer.style.display=="none"?false:true;
		   valuesListContainer.style.display=visible?"none":"";
		   expandButton.src=visible?"images/expand.png":"images/collapse.png";
		}
}

function generateValuesTable(){
    var table=document.createElement("table");
    table.className="capability-values";
	var tbody=document.createElement("tbody");
	table.appendChild(tbody);
	
	return {"tbody":tbody,"table":table};
}

function generateLine(capaName,capaValue,deviceId,groupContainer){
   var containerTr=document.createElement("tr");
   var td0=document.createElement("td");
   var strong=document.createElement("strong");
   strong.innerHTML="Value:";
   var span=document.createElement("span");
   span.innerHTML=capaValue
   td0.appendChild(strong);
   td0.appendChild(span);
   
   
   var td1=document.createElement("td");
   var strong1=document.createElement("strong");
   strong1.innerHTML="Device ID:";
   var span1=document.createElement("span");
   span1.innerHTML=deviceId
   td1.appendChild(strong1);
   td1.appendChild(span1);
   
   var td2=document.createElement("td");
   createButtons(capaName,capaValue,deviceId,td2,span,groupContainer);
   td2.className="last-column";
   
   containerTr.appendChild(td0);
   containerTr.appendChild(td1);
   containerTr.appendChild(td2);
   
   return containerTr;
}


function treatGetCustomCapabilitiesErrors(statusCode){
	switch(statusCode){
	    case "204":
	    	ErrorMessages.showError("No custom capabilities created");
		 break;
		 case "500":
			 ErrorMessages.showError("Internal server error");
		 break;
		 default:
			 ErrorMessages.showError("An error occured.");
	}
}

function groupCapabilityNamesByValue(responseJSON){
	 groupedCapaNames=[];
	 groupedValues=[];
	 for(var i=0;i<responseJSON.length;i++){
	     var capName=responseJSON[i].capabilityName;
	     var capValue=responseJSON[i].capabilityValue;
	     var deviceIdString=responseJSON[i].deviceId;
	     
		 var indexOf=groupedCapaNames.indexOf(capName);
		 if(indexOf>-1){/* if it allready exists*/
		    groupedValues[indexOf].push({"capValue":capValue,"deviceId":deviceIdString});  
		 }else{
		    groupedCapaNames.push(capName);
			groupedValues.push([{"capValue":capValue,"deviceId":deviceIdString}]);
		 }
	  }
}

function fillTable(){
	for(var i=0;i<groupedCapaNames.length;i++){
		 var newGroup=generateCapabilityGroupContainer(listContainer,groupedCapaNames[i]);
	     var valuesListContainer=newGroup.tbody;
	     containersList.push(newGroup.masterContainer);
	     for(var j=0;j<groupedValues[i].length;j++){
		     var newLine=generateLine(groupedCapaNames[i],groupedValues[i][j].capValue,groupedValues[i][j].deviceId,newGroup.masterContainer);
			 valuesListContainer.appendChild(newLine);
		 }
	}
}

function tableHeaderOnClick(){
	sortOrder=sortOrder?false:true;
	masterHeader.className=sortOrder?"descending":"ascending";
	var sortingFunction=sortOrder?compareASCList:compareDSCList;
	sorter.sort(groupedCapaNames,sortingFunction,reOrderCapaGroups);
}

function getCustomCapabilitiesCallback(responseJSON){
  toggleMasterPreloader(false);
  if(responseJSON.statusCode){
	  treatGetCustomCapabilitiesErrors(responseJSON.statusCode);
	  return;
  }   
 
  groupCapabilityNamesByValue(responseJSON);
  fillTable();
  
  masterHeader.onclick=function(){
	  tableHeaderOnClick();
  }
}



function compareASCList(elem1,elem2,toSort){
    return (toSort[elem1].toUpperCase()<toSort[elem2].toUpperCase());
}

function compareDSCList(elem1,elem2,toSort){
    return (toSort[elem1].toUpperCase()>toSort[elem2].toUpperCase());
}
	

function reOrderCapaGroups(indexes){
	listContainer.style.display="none";
	for(var i=0;i<containersList.length;i++){
		 containersList[i].parentNode.removeChild(containersList[i]);
	}
	var buffer=[];
	var bufferContainers=[];
	for(var i=0;i<indexes.length;i++){
		if(indexes[i]!=i){
			var j=indexes[i];
			if(!buffer[i]){
			  buffer[i]=groupedCapaNames[i];
			  bufferContainers[i]=containersList[i];
			}
			if(buffer[j]){
			  groupedCapaNames[i]=buffer[j];
			  containersList[i]=bufferContainers[j];
			}else{
			  groupedCapaNames[i]=groupedCapaNames[j];
			  containersList[i]=containersList[j];
			}
		}
	}
	for(var i=0;i<containersList.length;i++){
		listContainer.appendChild(containersList[i]);
	}
	listContainer.style.display="";
}



function createLink(text){
	var link=document.createElement("a");
	link.innerHTML=text;
	link.className="white-page-button";
	return link;
}

function setCancelEvent(element,value,container,editButton,saveButton,deleteButton,cancelButton){
	   element.onclick=function(){
		   container.innerHTML=value;
	       editButton.style.display="";
	       saveButton.style.display="none";
	       deleteButton.style.display="";
	       cancelButton.style.display="none"; 
	   }  
	}

function setEditEvent(element,value,container,saveButton,deleteButton,cancelButton){
   element.onclick=function(){
	   var editBox=document.createElement("input");
       editBox.type="text";
       editBox.value=value;
       editBox.id="newCapaValue";
    	   
       container.innerHTML="";
       container.appendChild(editBox);
       
       this.style.display="none";
       saveButton.style.display="";
       deleteButton.style.display="none";
       cancelButton.style.display="";
   }  
}

function saveCapability(capName,capValue,idString,container,saveButton,editButton,deleteButton,cancelButton){
	 toggleMasterPreloader(true); 
	 var request={};
	 request.appId=appKey;
	 request.deviceId=idString;
	 request.capabilityName=WhateverUtils.fixedEncodeURIComponent(capName);
	 request.capabilityValue=WhateverUtils.fixedEncodeURIComponent(capValue);
	 var link=WhateverConfig.baseURL+"ddr/admin/custom";
	 
	 ajaxClient.addRequestToQueue({
		  method:'POST', 
		  link:link,
		  requestParameters : JSON.stringify(request),
		  requestParametersComputing : false, 
		  callbackFunction:saveCapabilityCallback, 
		  responseFormat:"JSON",
		  callbackFunctionParameters:[capValue,container,saveButton,editButton,deleteButton,cancelButton]
	});
}

function saveCapabilityCallback(responseJSON,newVal,container,saveButton,editButton,deleteButton,cancelButton){
	toggleMasterPreloader(false);
	if(responseJSON.statusCode){
	  switch(responseJSON.statusCode){
		case "201":
			   container.innerHTML=newVal;
			   saveButton.style.display="none";
			   deleteButton.style.display="";
			   cancelButton.style.display="none";
			   editButton.style.display="";
			   setEditEvent(editButton,newVal,container,saveButton,deleteButton,cancelButton);
			   setCancelEvent(cancelButton,newVal,container,editButton,saveButton,deleteButton,cancelButton);
			   
			break;
		default:
			ErrorMessages.showError("An error occured. Please try again");
	   }
	}
}

function setSaveEvent(element,name,container,idString,editButton,deleteButton,cancelButton){
	   element.onclick=function(){
	       var editBox=document.getElementById("newCapaValue");
	       var capValue=WhateverUtils.fixedEncodeURIComponent(editBox.value);
	       saveCapability(name,capValue,idString,container,this,editButton,deleteButton,cancelButton);
	   }  
}

function setDeleteEvent(element,name,container,idString,groupContainer){
	   element.onclick=function(){
	       deleteCapability(name,idString,container,groupContainer);
	   }  
}

function deleteCapability(capName,idString,container,groupContainer){
	 var link=WhateverConfig.baseURL+"ddr/admin/custom/def/capa/"+appKey+"/"+idString+"/"+WhateverUtils.fixedEncodeURIComponent(capName);
	 ajaxClient.addRequestToQueue({
		  method:'DELETE', 
		  link:link,
	 	  callbackFunction:deleteCapabilityCallback, 
		  responseFormat:"JSON",
		  callbackFunctionParameters:[container,groupContainer]  
	});
}

function deleteCapabilityCallback(responseJSON,container,groupContainer){
	if(responseJSON.statusCode){
	  switch(responseJSON.statusCode){
		case "200":
			var toDelete=container.parentNode;
			var toDeleteParent=toDelete.parentNode;
			toDeleteParent.removeChild(toDelete);
			if(!toDeleteParent.children.length){
				groupContainer.parentNode.removeChild(groupContainer);
			}
			ErrorMessages.showSuccess("Capability deleted");
			break;
		default:
			ErrorMessages.showError("An error occured. Please try again");
	   }
	}
	
}




function createButtons(name,value,idString,container,changeContainer,groupContainer){
   
   var disableButton,editButton,saveButton,deleteButton;
	
   saveButton=createLink("Save");
   editButton=createLink("Edit");
   deleteButton=createLink("Delete");
   cancelButton=createLink("Cancel");
   
   cancelButton.style.display="none";
   
   setSaveEvent(saveButton,name,changeContainer,idString,editButton,deleteButton,cancelButton);
   saveButton.style.display="none";
   
   setEditEvent(editButton,value,changeContainer,saveButton,deleteButton,cancelButton);
   setCancelEvent(cancelButton,value,changeContainer,editButton,saveButton,deleteButton,cancelButton);
   setDeleteEvent(deleteButton,name,container,idString,groupContainer)
   
   container.appendChild(editButton);
   container.appendChild(saveButton);
   container.appendChild(deleteButton);
   container.appendChild(cancelButton);
}