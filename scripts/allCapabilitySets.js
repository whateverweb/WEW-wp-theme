var ajaxClient=new Ajax();

var userEmail = sessionStorage.getItem("userEmail");

var appAlias = localStorage.getItem(userEmail+".curAppAlias");
var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");

var tableContainer=document.getElementById("list-all-capabilities");
var listContainer=tableContainer.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0];

var masterHeader=tableContainer.getElementsByTagName("table")[0].getElementsByTagName("th")[0];


var groupedDataNames=[];
var containersList=[];
var groupedValues=[];
var sorter=new Sorter();
var sortOrder=false;

var listOfTabsIndex=[];
var listOfCapaSetNames=[];


getSets();


function getSets(){
   var link=WhateverConfig.baseURL+'ddr/admin/cset/def/'+appKey;
   ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:link,
			  callbackFunction:getSetsCallback, 
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
	
	var deleteContainer=document.createElement("div");
	var deleteButton=createLink("Delete");
	deleteContainer.className="delete-capability";
	
	var editButton=createLink("Edit");
	
	
	
	deleteContainer.appendChild(deleteButton);
	setDeleteEvent(deleteButton,trContainer,capaName);
	
	deleteContainer.appendChild(editButton);
	// set the event for edit
	setEditEvent(editButton,capaName);
	
	tdContainer.appendChild(expandButton);
	tdContainer.appendChild(capaNameContainer);
	tdContainer.appendChild(deleteContainer);
	
	trContainer.appendChild(tdContainer);
	
	var valuesListContainer=generateValuesTable();
	tdContainer.appendChild(valuesListContainer.table);
	
	containerTBody.appendChild(trContainer);
	
	
	setExpandCollapseEvent(expandButton,capaNameContainer,valuesListContainer.table,tdContainer);
	
	valuesListContainer.table.style.display="none";
	
	
	listOfTabsIndex.push({"trigger":expandButton,"list":valuesListContainer.table,"capaSet":capaName});
	listOfCapaSetNames.push(capaName);
	
	return {"tbody":valuesListContainer.tbody,"masterContainer":trContainer,"trigger":expandButton};
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


function generateLine(capaName){
   var containerTr=document.createElement("tr");
   var td0=document.createElement("td");
   var strong=document.createElement("strong");
   strong.innerHTML="Value:";
   var span=document.createElement("span");
   span.innerHTML=capaName
   td0.appendChild(strong);
   td0.appendChild(span);
   
   containerTr.appendChild(td0);
   
   return containerTr;
}



function treatGetSetsErrors(statusCode){
	 switch(statusCode){
	     case "204":
	    	 ErrorMessages.showError("No custom capability sets created");
		 break;
	     case "404":
	    	 ErrorMessages.showError("No custom capability sets created");
		 break;
		 case "500":
			 ErrorMessages.showError("Internal server error");
		 break;
	 }
}

function groupSetsByName(responseJSON){
	groupedDataNames=[];
	groupedValues=[];
	for(var i=0;i<responseJSON.length;i++){
	     var setName=responseJSON[i].name;
	     groupedValues.push(setName);
	     
	     var setNames=[];
		 for(var j=0;j<responseJSON[i].capabilityNames.length;j++){
	    	 setNames.push(responseJSON[i].capabilityNames[j]);
	     }
	     groupedDataNames.push(setNames);
	     
	}
}

function fillTable(){
	var currentCapaSet=sessionStorage.getItem(userEmail+".currentCapaSet");
	for(var i=0;i<groupedDataNames.length;i++){
		 var newGroup=generateCapabilityGroupContainer(listContainer,groupedValues[i]);
	     var valuesListContainer=newGroup.tbody;
	     containersList.push(newGroup.masterContainer);
	     for(var j=0;j<groupedDataNames[i].length;j++){
		     var newLine=generateLine(groupedDataNames[i][j]);
			 valuesListContainer.appendChild(newLine);
		 }
	     if(currentCapaSet && currentCapaSet==groupedValues[i]){
	 		newGroup.trigger.click();
	 	 }
	}
}

function tableHeaderOnClick(){
	sortOrder=sortOrder?false:true;
	masterHeader.className=sortOrder?"descending":"ascending";
	var sortingFunction=sortOrder?compareASCList:compareDSCList;
	sorter.sort(groupedValues,sortingFunction,reOrderListElements);
}


function getSetsCallback(responseJSON){
  toggleMasterPreloader(false);
  if(responseJSON.statusCode){
	  treatGetSetsErrors(responseJSON.statusCode);
	  return;
  }
 
  groupSetsByName(responseJSON);
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



function reOrderListElements(indexes){
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
			  buffer[i]=groupedValues[i];
			  bufferContainers[i]=containersList[i];
			}
			if(buffer[j]){
			  groupedValues[i]=buffer[j];
			  containersList[i]=bufferContainers[j];
			}else{
			  groupedValues[i]=groupedValues[j];
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



function setDeleteEvent(deleteButton,trContainer,capaName){
	deleteButton.onclick=function(){
		deleteCapaSet(trContainer,capaName);
	}
}

function setEditEvent(editButton,capaSetName){
	editButton.onclick=function(){
		sessionStorage.setItem(userEmail+".currentCapaSet",capaSetName);
		window.location.href = "/editCapabilitySet.html";
	}
}

function deleteCapaSet(trContainer,capaName){
	var link=WhateverConfig.baseURL+'ddr/admin/cset/def/'+appKey+'/'+WhateverUtils.fixedEncodeURIComponent(capaName);
	ajaxClient.addRequestToQueue({
				  method:'DELETE', 
				  link:link,
				  callbackFunction:deleteCapaSetCallback,
				  callbackFunctionParameters:[trContainer],
				  responseFormat:"JSON",
				});
}



function deleteCapaSetCallback(responseJSON,trContainer){
	if(responseJSON.statusCode){
	     switch(responseJSON.statusCode){
	     	case "200":
	     		ErrorMessages.showSuccess("Capability set deleted");
			    trContainer.parentNode.removeChild(trContainer);
			 break;
		     
			 default:
				 ErrorMessages.showError("Internal server error");
			 
		 }
	  }
}