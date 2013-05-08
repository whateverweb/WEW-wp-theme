var userEmail = sessionStorage.getItem("userEmail");

var appAlias = localStorage.getItem(userEmail+".curAppAlias");
var appKey = localStorage.getItem(userEmail+".curAppKey");
var sessionToken = sessionStorage.getItem("id");

var masterContainer=document.getElementById("new-capability-set");
var selectedItemsContainer=document.getElementById("selected-capabilities").getElementsByTagName("div")[0];
var allItemsContainer=document.getElementById("all-capabilities").getElementsByTagName("div")[0];
var saveButton=document.getElementById("save-capa-set");
var selectAllButton=document.getElementById("select-all-capas");
var unselectAllButton=document.getElementById("unselect-all-capas");
var capabilityNameInput=masterContainer.getElementsByTagName("input")[0];

var ajax=new Ajax();

var currentSelection={};
var columnsDomList;

var myFilter = new filter(document.getElementById("filter-apps"));//, null,	null, null);
myFilter.restriction=true;


saveButton.onclick=function(){
	validateCapabilitySet();
}
selectAllButton.onclick=function(){
	selectAll();
}
unselectAllButton.onclick=function(){
	unselectAll();
}

getAllCapabilities();

function getAllCapabilities(){
	//var link="http://virt01.mobiletech.no:8080/wew-ddr/capabilityNames";
	 //var link='http://'+appAlias+'/ddr/capabilityNames';
	var link=WhateverConfig.baseURL+'ddr/capabilityNames';
	 ajax.addRequestToQueue({
				  method:'GET', 
				  link:link,
				  callbackFunction:getAllCapabilitiesCallback, 
				  responseFormat:"JSON",
		});
}


function getAllCapabilitiesCallback(responseJSON){
	toggleMasterPreloader(false);
	var perpage=Math.floor(responseJSON.length/4);
	
  /* cnt=0;
   var columns=[];
   columnsDomList=document.createElement("ul");
   for(var i=0;i<4;i++){
       var li=document.createElement("li");
       columnsDomList.appendChild(li);
       columns.push(li);
   }*/
   columnsDomList=document.createElement("ul");	
   allItemsContainer.appendChild(columnsDomList);
   
   for(var i=0;i<responseJSON.length;i++){
	   var newItem=createItem(responseJSON[i]);
	   //columns[i%4].appendChild(newItem);
	   columnsDomList.appendChild(newItem);
	   
	   myFilter.addElement({
					strData : responseJSON[i],
					domElement : newItem,
					restricted : false
				});
   }
}

function createItem(name){
	var item=document.createElement("li");
	item.innerHTML=name;
	setItemClickEvent(item,name);
	return item;
}

function createSelectedItem(name){
	var selectedItem=document.createElement("span");
	selectedItem.appendChild(document.createTextNode(name));
	return selectedItem;
}

function setSelectedItemClickEvent(item,selectedItem,name){
	selectedItem.onclick=function(){
		selectedItemsContainer.removeChild(selectedItem);
		item.style.display="";
		delete currentSelection[name];
		 myFilter.changeRestrictedFlag(item,false);
	}
}

function setItemClickEvent(item,name){
	item.onclick=function(){
	   var newSelectedItem=createSelectedItem(name);
	   selectedItemsContainer.appendChild(newSelectedItem);
	   item.style.display="none";
	   setSelectedItemClickEvent(item,newSelectedItem,name);
	   currentSelection[name]={"item":item,"selectedItem":newSelectedItem};
	   myFilter.changeRestrictedFlag(item,true);
	}
}

function validateCapabilitySet(){
	var newName=capabilityNameInput.value;
	if(newName.length<1){
		ErrorMessages.showError("Please insert a valid set name");
		return;
	}
	
	var set=[];
	for(var id in currentSelection){
		set.push(id);
	}
	//set=set.join(",");
	//set="?"+set;
	saveCapabilitiesSet(newName,set);
	
}

function saveCapabilitiesSet(setName,set){
	toggleMasterPreloader(true);
	var link=WhateverConfig.baseURL+"ddr/admin/cset/def"; 
	var request={};
	request.appId=appKey;
	request.name=setName;
	request.capabilityNames=set;
	 ajax.addRequestToQueue({
				  method:'POST', 
				  link:link,
				  requestParameters : JSON.stringify(request),
				  requestParametersComputing : false, 
				  callbackFunction:saveCapabilitiesSetCallback, 
				  responseFormat:"JSON",
		});
}


function saveCapabilitiesSetCallback(responseJSON){
	toggleMasterPreloader(false);
	if(responseJSON.statusCode){
	     switch(responseJSON.statusCode){
		     case "201":
		    	ErrorMessages.showSuccess("Set created"); 
			    resetForm();
			 break;
		     case "403":
		    	 myGuardian.showRelogin();
		     break;
		     case "400":
		    	 ErrorMessages.showError("Cannot save empty sets."); 
		     break;
			 default:
				 ErrorMessages.showError("Internal server error");
			  
		 }
	  }
}

function resetForm(){
	for(var id in currentSelection){
		var selItem=currentSelection[id].selectedItem;
		var item=currentSelection[id].item;
		capabilityNameInput.value="";
		item.style.display="";
		selItem.parentNode.removeChild(selItem);
		delete currentSelection[id];
	}
}

function selectAll(){
   selectedItemsContainer.style.display="none";
   var allItems=columnsDomList.getElementsByTagName("div");
   for(var i=0;i<allItems.length;i++){
      if(allItems[i].style.display!="none"){
    	  allItems[i].click(); 
      }
   }
   selectedItemsContainer.style.display="";

}
function unselectAll(){
	   selectedItemsContainer.style.display="none";
	   columnsDomList.style.display="none";
	   for(var id in currentSelection){
		   currentSelection[id].selectedItem.click();
	   }
	   selectedItemsContainer.style.display="";
	   columnsDomList.style.display="";

	}