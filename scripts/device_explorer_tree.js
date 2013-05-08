var TreeElement=function(parent,label,deviceParams){
    this.parent=parent;
    this.deviceParams=deviceParams;
    this.hasChildren=this.deviceParams.hasDescendants;
    this.isDevice=this.deviceParams.actualDevice;
	this.id=this.deviceParams.deviceId;
	this.expanded=false;
	this.container=document.createElement("li");
	
	
	this.plusSign=document.createElement("img");
	this.plusSign.src="images/expand.png";
	if(!this.hasChildren){
	  this.plusSign.style.visibility="hidden";	
	  //this.container.className="node-collapsed";
	}
	this.checkbox=document.createElement("input");
	this.checkbox.type="checkbox";
	this.link=document.createElement("a");
	this.list=document.createElement("ul");
	
	if(label){
	   this.link.appendChild(document.createTextNode(label));
	}else{
	   this.link.appendChild(document.createTextNode(this.id));	
	}
	if(this.isDevice){
	  this.link.className="actual-device";	
	}
	
	this.container.appendChild(this.plusSign);
	this.container.appendChild(this.checkbox);
	this.container.appendChild(this.link);
	
	this.container.appendChild(this.list);
	
	this.setExpandState=function(isExpanded){
		this.expanded=isExpanded;
		this.plusSign.src=this.expanded?"images/collapse.png":"images/expand.png";
		
	}
}

var TableElement=function(parent,id){
   this.parent=parent;
   this.id=id;
   
   this.checkbox=document.createElement("input");
   this.checkbox.type="checkbox";
   
   if(this.parent.checkbox.checked){
      this.checkbox.checked=true;
   }
   
}

/**
 * Explores devices from the WARFL and displays it on a dom structure 
 * provided by containerId
 * 
 * @param {String} containerId
 */
function deviceExplorer(containerId){
    this.globalContainer=document.getElementById(containerId);
	this.treeContainer=document.getElementById("tree-navigation").getElementsByTagName("ul")[0];
	this.tableElement=this.globalContainer.getElementsByClassName('pricing-table')[0];
	this.headersList=this.tableElement.getElementsByTagName("th");
	
	this.listContainer=this.tableElement.getElementsByTagName('tbody')[0];
	this.selectedItemsContainer=document.getElementById("selected-devices").getElementsByTagName("div")[0];
	
	this.preloaderTreeDiv=document.getElementById("tree-preloader");
	this.preloaderTableDiv=document.getElementById("table-preloader");
	
	
	
	this.ajaxClient=new Ajax();
	this.sorter=new Sorter();
	
	this.selectedItems={};
	this.treeItems={};
	this.actualDevices={};
	
	this.devicesDatamap=[];
	this.sortDirections=[];
	
	// get the inputs for filter
	var filterform=document.getElementById("filter-devices-form");
	this.fields={};
	
	this.fields.brand=filterform.capabilityBrand;
	this.fields.model=filterform.capabilityModel;
	this.fields.os=filterform.capabilityOs;
	this.fields.osVersion=filterform.capabilityOsVersion;
	this.fields.browser=filterform.capabilityBrowser;
	this.fields.browserVersion=filterform.capabilityBrowserVersion;
	var scope=this;
	filterform.onsubmit=function(){
	  scope.searchByParams();
	  return false;
	}
	
	
	this.init();
 
	
}


/**
 * Initiates the class
 * 
 * 
 * @method init
 */
deviceExplorer.prototype.init=function(){
   this.currentTreeNode=null;
   var root=new TreeElement(null,"Devices by Groups and Fallbacks",{"hasDescendants":true,"actualDevice":false,"deviceId":"generic"});
   this.treeContainer.appendChild(root.container);
   this.setNodeClickEvent(root);
   this.configureCheckbox(root);
   this.treeItems[root.id]=root;
   root.link.className="devices-root";
   root.plusSign.click();
   
   this.mainCheckBox=this.headersList[0].getElementsByTagName("input")[0];
   var scope=this;
   this.mainCheckBox.onchange=function(){
      var val=true;
	  if(this.checked){
	      val=true;
	  }else{
	     val=false;
	  }
	  for(var id in scope.actualDevices){
		scope.actualDevices[id].checkbox.checked=val;
		scope.actualDevices[id].checkbox.onchange();
	  }
   }
   
   for(var i=1;i<this.headersList.length;i++){
      this.setHeaderClickEvent(this.headersList[i],i);
   }
   
   this.preloaderTreeDiv.style.position="absolute";
   this.preloaderTreeDiv.style.left="50%";
   this.preloaderTreeDiv.style.top="0px";
   this.preloaderTreeDiv.style.marginLeft="-32px";
   
   
}

deviceExplorer.prototype.tooglePreloader=function(visible){
   if(!visible){
      this.preloaderTreeDiv.style.display="none";
	  this.preloaderTableDiv.style.display="none";
	  this.listContainer.style.display="";
	  this.treeContainer.style.visibility="visible";
   }else{
      this.preloaderTreeDiv.style.display="";
	  this.preloaderTableDiv.style.display="";
	  this.listContainer.style.display="none";
	  this.treeContainer.style.visibility="hidden";
   }
}

deviceExplorer.prototype.collapseNode=function(nodeElement){
	nodeElement.list.innerHTML="";
	//this.listContainer.innerHTML="";
	nodeElement.setExpandState(false);
	
	if(!nodeElement.hasChildren){
		return;
	}
	//nodeElement.container.className="node-collapsed";
	//this.currentTreeNode.container.className="node-collapsed";
	for(var id in this.treeItems){
	   if(this.treeItems[id].parent==nodeElement){
	      this.collapseNode(this.treeItems[id]);
		  delete this.treeItems[id];
	   }
	   
	}
	
}

deviceExplorer.prototype.collapseSiblings=function(nodeElement){
	for(var id in this.treeItems){
	      if(this.treeItems[id].parent==this.currentTreeNode.parent && this.treeItems[id]!=this.currentTreeNode){
		     this.collapseNode(this.treeItems[id]);
		  }
	}
}

deviceExplorer.prototype.setNodeClickEvent=function(nodeElement){
   var scope=this;
   nodeElement.plusSign.onclick=function(){
	 scope.currentTreeNode=nodeElement;
	 if(!nodeElement.expanded){
		scope.collapseSiblings(nodeElement);
		scope.getDevicesById(nodeElement.id);
	 }else{
	    scope.collapseNode(nodeElement);
	 }
   }
   nodeElement.link.onclick=function(){
	   scope.currentTreeNode=nodeElement;
	   scope.getChildrenDevices(nodeElement.id);
	      
   }
   
}


// network acivity---------------------------------------------
deviceExplorer.prototype.getDevicesById=function(deviceId){
    this.tooglePreloader(true);
    var link=WhateverConfig.baseURL + 'core/device/drill/'+deviceId+'/';
	this.ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:link,
			  callbackFunction:this.getDevicesByIdCallback, 
			  responseFormat:"JSON",
			  callbackScope:this
			});
}

deviceExplorer.prototype.getDevicesByIdCallback=function(responseJSON){
   this.buildTree(responseJSON.allDescendants);
   this.tooglePreloader(false);
   
   
}

deviceExplorer.prototype.getChildrenDevices=function(deviceId){
    this.tooglePreloader(true);
    var link=WhateverConfig.baseURL + 'core/device/drill/'+deviceId+'/';
	this.ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:link,
			  callbackFunction:this.getChildrenDevicesCallback, 
			  responseFormat:"JSON",
			  callbackScope:this
			});
}

deviceExplorer.prototype.getChildrenDevicesCallback=function(responseJSON){
   this.buildTable(responseJSON.actualDeviceDescendants);
   this.tooglePreloader(false);
}


deviceExplorer.prototype.searchByParams=function(){
    this.tooglePreloader(true);
    var link=WhateverConfig.baseURL + 'core/device/search?';
	link+="brand="+this.fields.brand.value;
	link+="&model="+this.fields.model.value;
	link+="&os="+this.fields.os.value;
	link+="&osVersion="+this.fields.osVersion.value;
	link+="&browser="+this.fields.browser.value;
	link+="&browserVersion="+this.fields.browserVersion.value;
	
	this.ajaxClient.addRequestToQueue({
			  method:'GET', 
			  link:link,
			  callbackFunction:this.searchByParamsCallback, 
			  responseFormat:"JSON",
			  callbackScope:this
			});
	
}

deviceExplorer.prototype.searchByParamsCallback=function(resultJSON){
   this.listContainer.innerHTML="";
   this.actualDevices={};
   
   if(resultJSON.statusCode){
		switch(resultJSON.statusCode){
		 case "204":
			 ErrorMessages.showError("No items found");
		   break;
		  case "500":
			  ErrorMessages.showError("Internal server error");
		   break; 
		}
	}else{
	     var ordList=[];
	     this.currentTreeNode=null;
		 this.treeContainer.innerHTML="";
		 for(var i=0;i<resultJSON.length;i++){
		    var root=new TreeElement(null,null,resultJSON[i]);
			
		    
			this.setNodeClickEvent(root);	
			
			this.configureCheckbox(root);
			this.treeItems[root.id]=root;
			ordList.push(root);
			if(resultJSON.length==1 && root.hasChildren){
			   root.plusSign.click();
			}
		 } 
		 this.sorter.sort(ordList,this.compareASCTree,this.reOrderTreeElements,this);
		 for(var i=0;i<ordList.length;i++){
	       this.treeContainer.appendChild(ordList[i].container);
	     }
	  }
	  
	  this.tooglePreloader(false);
}


//---------------------------------------------------------
deviceExplorer.prototype.buildTree=function(nonDeviceRoots){
       
       this.currentTreeNode.list.innerHTML="";
	   if(!nonDeviceRoots.length){
		 return;
	   }
	   var ordList=[];
	   for(var i=0;i<nonDeviceRoots.length;i++){
	      var newNode=new TreeElement(this.currentTreeNode,null,nonDeviceRoots[i]);
		  this.setNodeClickEvent(newNode);
		  this.configureCheckbox(newNode);
		  newNode.checkbox.checked=this.currentTreeNode.checkbox.checked;
		  if(this.selectedItems[newNode.id]){
		      newNode.checkbox.checked=true;
		  }
		  this.treeItems[newNode.id]=newNode;
		  ordList.push(newNode);
	   }
	   
	   this.sorter.sort(ordList,this.compareASCTree,this.reOrderTreeElements,this);
	   
	   for(var i=0;i<ordList.length;i++){
	      this.currentTreeNode.list.appendChild(ordList[i].container);
	   }
	   
	   if(ordList.length>0){
	      this.currentTreeNode.setExpandState(true);
	      /*if(this.currentTreeNode.hasChildren){
		     //this.currentTreeNode.container.className="node-expanded";
	      }*/
	   }
	   
	   
}


// tree navigation and selection functions--------------------------------------------------------------
deviceExplorer.prototype.addSiblingsToSelectedList=function(nodeElement){
	for(var id in this.treeItems){
	   if(this.treeItems[id].parent==nodeElement.parent && this.treeItems[id].checkbox.checked){
		  this.selectedItems[this.treeItems[id].id]=this.treeItems[id];
	   }
	}
	
	for(var id in this.actualDevices){
	   if(this.actualDevices[id].parent==nodeElement.parent && this.actualDevices[id].checkbox.checked){
		  this.selectedItems[this.actualDevices[id].id]=this.actualDevices[id];
	   }
	}
}

deviceExplorer.prototype.clearCheckedThisAndPrents=function(nodeElement){
	nodeElement.checkbox.checked=false;
	delete this.selectedItems[nodeElement.id];
	var parent=nodeElement.parent;
	if(parent!=null){
	  this.clearCheckedThisAndPrents(parent);
	}
}

deviceExplorer.prototype.clearCheckedThisAndChildren=function(nodeElement){
	nodeElement.checkbox.checked=false;
	delete this.selectedItems[nodeElement.id];
	
	for(var id in this.actualDevices){
		   if(this.actualDevices[id].parent==nodeElement){
		     this.clearCheckedThisAndChildren(this.actualDevices[id]);
		   }
	}
	
	if(!nodeElement.hasChildren){
		return;
	}
	for(var id in this.treeItems){
	   if(this.treeItems[id].parent==nodeElement){
	     this.clearCheckedThisAndChildren(this.treeItems[id]);
	   }
	}
	
	
   
}

deviceExplorer.prototype.checkChildrenAndRemoveFromSelectedList=function(nodeElement){
    nodeElement.checkbox.checked=true;
	delete this.selectedItems[nodeElement.id];
	
	for(id in this.actualDevices){
		   if(this.actualDevices[id].parent==nodeElement){
		        this.checkChildrenAndRemoveFromSelectedList(this.actualDevices[id]);     
	       }	   
		}
	
	if(!nodeElement.hasChildren){
		return;
	}
	for(id in this.treeItems){
	   if(this.treeItems[id].parent==nodeElement){
	        this.checkChildrenAndRemoveFromSelectedList(this.treeItems[id]);     
       }	   
	}
	
	
}

deviceExplorer.prototype.searchAllSiblings=function(nodeElement){
   var searching=true;
   var currentNodeElement=nodeElement;
   while(searching){
       var all=true;
	    var cnt=0;
		for(var i in this.treeItems){
		  if(this.treeItems[i].parent==currentNodeElement.parent && !this.treeItems[i].checkbox.checked){
			 all=false;
		  }
		  
		}
		if(all){
		   for(var i in this.actualDevices){
			  if(this.actualDevices[i].parent==currentNodeElement.parent && !this.actualDevices[i].checkbox.checked){
				 all=false;
			  }
			}
		}
		if(all){
		   if(currentNodeElement.parent){
		     currentNodeElement=currentNodeElement.parent;
			 currentNodeElement.checkbox.checked=true;
		   }else{
		     searching=false;
		   }
		}else{
		   searching=false;
		}
	}
	return currentNodeElement;
}

//---------------------------------------------------------------
deviceExplorer.prototype.configureCheckbox=function(nodeElement){
	if(this.selectedItems[nodeElement.id]){
	 nodeElement.checkbox.checked=true;
	 this.selectedItems[nodeElement.id]=nodeElement;
	}
	var scope=this;
	nodeElement.checkbox.onchange=function(){
		 if(this.checked){
			  var root=scope.searchAllSiblings(nodeElement);
			  scope.checkChildrenAndRemoveFromSelectedList(root);
			  scope.selectedItems[root.id]=root;
		  }else{
  		      scope.clearCheckedThisAndPrents(nodeElement);
			  scope.clearCheckedThisAndChildren(nodeElement);
			  scope.addSiblingsToSelectedList(nodeElement);
			  delete scope.selectedItems[nodeElement.id];
		 }
		 scope.refreshSelectedItems();
		 // and check the master checkbox from the table
		 scope.checkMainCheckBox();
		 
	}
}

deviceExplorer.prototype.checkMainCheckBox=function(){
   var val=true;
   cnt=0;
   for(var id in this.actualDevices){
     cnt++;
     if(!this.actualDevices[id].checkbox.checked){
       val=false;
	   break;
	 }	 
   }
   if(!cnt){
     val=false;
   }
   this.mainCheckBox.checked=val;
}
//----------------the table part---------------------------------------------
deviceExplorer.prototype.buildTable=function(deviceRoots){
	this.listContainer.innerHTML="";
	this.actualDevices={};
	for(var i=0;i<this.sortDirections.length;i++){
	   this.sortDirections[i]=false;
	}
	
	this.listContainer.appendChild(this.createRow(this.currentTreeNode.deviceParams));
    
	if(!deviceRoots.length){
		 return;
	}
	
	var title=document.createElement("tr");
	var th=document.createElement("th");
	th.innerHTML="Has actual devices:";
	th.setAttribute("colspan","7");
	title.appendChild(th);
	
	this.listContainer.appendChild(title);
	
	this.devicesDatamap=[];
	
	for(var i=0;i<deviceRoots.length;i++){
	   this.listContainer.appendChild(this.createRow(deviceRoots[i]));
	   this.checkMainCheckBox();
	}
	
}


deviceExplorer.prototype.createSelector=function(container,id){
  
  var td=document.createElement("td");
  //if current item allready exists in the selected items
  var checkbox=new TableElement(this.currentTreeNode,id);
  this.actualDevices[id]=checkbox;
  
  td.appendChild(checkbox.checkbox);
  this.configureCheckbox(checkbox);
  container.appendChild(td);
  
  
}



deviceExplorer.prototype.setSelectedItemClickEvent=function(element,key){
  var scope=this;
  element.onclick=function(){
     if(scope.treeItems[key]){
	    scope.treeItems[key].checkbox.checked=false;
		scope.treeItems[key].checkbox.onchange();
	 }
	 if(scope.actualDevices[key]){
	    scope.actualDevices[key].checkbox.checked=false;
		scope.actualDevices[key].checkbox.onchange();
	 }
     delete scope.selectedItems[key];
	 scope.refreshSelectedItems();
  }
}

deviceExplorer.prototype.createTd=function(container,info){
   var td=document.createElement("td");
   var text=document.createTextNode(info || "None");
   td.appendChild(text);
   container.appendChild(td);
}

deviceExplorer.prototype.createRow=function(device){
	var tmpTr=document.createElement("tr");
	   this.createSelector(tmpTr,device.deviceId);
	   this.createTd(tmpTr,device.brand);
	   this.createTd(tmpTr,device.modelName);
	   this.createTd(tmpTr,device.os);
	   this.createTd(tmpTr,device.osVersion);
	   //this.createTd(tmpTr,device.marketingName);
	   this.createTd(tmpTr,device.browser);
	   this.createTd(tmpTr,device.browserVersion);
	   
	   var devicesDatamapLine=[""];
	   devicesDatamapLine.push(device.brand || " ",device.modelName || " " ,device.os || " ",device.osVersion || " ",device.browser || " ", device.browserVersion || " ");
	   
	   this.devicesDatamap.push(devicesDatamapLine);
     	  
	return tmpTr;
}





deviceExplorer.prototype.refreshSelectedItems=function(){
    this.selectedItemsContainer.style.display="none";
	this.selectedItemsContainer.innerHTML="";
	var scope=this;
	for(var key in this.selectedItems){
	   var tmpSpan=document.createElement("span");
	   var text=document.createTextNode(key);
	   tmpSpan.appendChild(text);
	   this.selectedItemsContainer.appendChild(tmpSpan);
	   this.setSelectedItemClickEvent(tmpSpan,key);
	}
	this.selectedItemsContainer.style.display="";
}


// tree sorting rules
deviceExplorer.prototype.compareASCTree=function(elem1,elem2,toSort){
		   return (toSort[elem1].id.toUpperCase()<toSort[elem2].id.toUpperCase());
		}

deviceExplorer.prototype.reOrderTreeElements=function(indexes,toSort){
   
	var buffer=[];
	for(var i=0;i<indexes.length;i++){
	  if(indexes[i]!=i){
		var j=indexes[i];
		if(!buffer[i]){
		  buffer[i]=toSort[i];
		}
		if(buffer[j]){
		  toSort[i]=buffer[j];
		}else{
		  toSort[i]=toSort[j];
		}
	 }
   }
}



deviceExplorer.prototype.setHeaderClickEvent=function(headerElement,column){
   var scope=this;
   headerElement.onclick=function(){
		   if(!scope.devicesDatamap.length){
		      return false;
		   }
		   scope.sortColumn=column;
		   scope.sortDirections[column]=!scope.sortDirections[column];
		   var sortFunction=scope.sortDirections[column]?scope.compareASCTable:scope.compareDSCTable;
		   
		   for(var i=0;i<scope.headersList.length;i++){
		      scope.headersList[i].className=scope.headersList[0].className;
		   }
		   this.className=scope.sortDirections[column]?"descending":"ascending";
		   //let's actually sort it 
		   scope.sorter.sort(scope.devicesDatamap,sortFunction,scope.reOrderTableElements,scope);
	}
}

// table sorting rules
deviceExplorer.prototype.compareASCTable=function(elem1,elem2,toSort){
           return (toSort[elem1][this.sortColumn].toUpperCase()<toSort[elem2][this.sortColumn].toUpperCase());
}

deviceExplorer.prototype.compareDSCTable=function(elem1,elem2,toSort){
           return (toSort[elem1][this.sortColumn].toUpperCase()>toSort[elem2][this.sortColumn].toUpperCase());
}
		

deviceExplorer.prototype.reOrderTableElements=function(indexes,toSort){
 	var buffer=[];
	for(var i=0;i<indexes.length;i++){
	  if(indexes[i]!=i){
		var j=indexes[i];
		if(!buffer[i]){
		  buffer[i]=toSort[i];
		}
		if(buffer[j]){
		  toSort[i]=buffer[j];
		}else{
		  toSort[i]=toSort[j];
		}
	 }
   }
	var elemsList=[];
	this.listContainer.style.display="none";
	while(this.listContainer.firstChild){
		tmpelem=this.listContainer.firstChild;
		elemsList.push(tmpelem);
		this.listContainer.removeChild(tmpelem);
	}
	for(var i=0;i<elemsList.length;i++){
	   this.listContainer.appendChild(elemsList[indexes[i]]);
	}
	this.listContainer.style.display="";
}
