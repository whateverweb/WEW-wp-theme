var userEmail = sessionStorage.getItem("userEmail");

var masterPreloader=document.getElementById("wait-for-page");

var appAlias = localStorage.getItem(userEmail+".curAppAlias");
var storageAppNames=localStorage.getItem(userEmail+".storageAppNames").split(",");
var storageAppAliases=localStorage.getItem(userEmail+".storageAppAliases").split(",");
var storageAppKeys=localStorage.getItem(userEmail+".storageAppKeys").split(",");
var storageAppActive=localStorage.getItem(userEmail+".storageAppActive").split(",");

var isDesktop=localStorage.getItem("isDesktop")=="true"?true:false ;



var appNameContainer=document.getElementById("top-stripe");

var prevApButton=appNameContainer.getElementsByTagName("a")[0];
var nextApButton=appNameContainer.getElementsByTagName("a")[1];
var currentAppNameContainer=document.getElementById("apps-name");

var initialX=0;
var initialY=0;

var actualX=0;
var actualY=0;
var dragging=false;

/*clean the list of notActive apps*/
var cnt=0;
while(cnt<storageAppNames.length){
	if(storageAppActive[cnt]!=="true"){
		storageAppNames.splice(cnt,1);
		storageAppAliases.splice(cnt,1);
		storageAppKeys.splice(cnt,1);
		storageAppActive.splice(cnt,1);
	}else{
		cnt++;
	}
}
/*----------------------------*/

var currentAppIndex=storageAppAliases.indexOf(appAlias);

if(currentAppNameContainer){
	currentAppNameContainer.innerHTML=storageAppNames[currentAppIndex];
	
	if(isDesktop){
		var label=document.createTextNode("Application: ");
		currentAppNameContainer.parentNode.insertBefore(label,currentAppNameContainer);
	}
	
	if(currentAppIndex>=storageAppNames.length-1 ){
		nextApButton.style.visibility="hidden";
	}else{
		nextApButton.style.visibility="block";
	}
	
	if(currentAppIndex<=0 ){
		prevApButton.style.visibility="hidden";
	}else{
		prevApButton.style.visibility="block";
	}
}

function jump(step){
	currentAppIndex+=step;
	
	if(currentAppIndex>=storageAppNames.length){
		currentAppIndex=0;
	}
	if(currentAppIndex<0){
		currentAppIndex=storageAppNames.length-1;
	}
	localStorage.setItem(userEmail+".curAppAlias",storageAppAliases[currentAppIndex]);
	localStorage.setItem(userEmail+".curAppKey",storageAppKeys[currentAppIndex]);
	window.location.href = window.location.href;
}


if(currentAppNameContainer){
	prevApButton.onclick=function(){
		jump(-1);
	}
	
	nextApButton.onclick=function(){
		jump(1);
	}
		
	if(!isDesktop){
		currentAppNameContainer.parentNode.addEventListener("touchstart", handleStart,false);
		currentAppNameContainer.parentNode.addEventListener("touchmove", handleMove,false);
		currentAppNameContainer.parentNode.addEventListener("touchend", handleEnd,false);
	}else{
		currentAppNameContainer.parentNode.addEventListener("mousedown", handleStart,false);
		currentAppNameContainer.parentNode.addEventListener("mouseover", handleMove,false);
		currentAppNameContainer.parentNode.addEventListener("mouseup", handleEnd,false);
	}
}


function toggleMasterPreloader(state){
	if(masterPreloader){
		masterPreloader.style.display=state?"block":"none";
	}
}


function handleStart(evt){
	evt.preventDefault();
	if(!isDesktop){
		initialX=evt.changedTouches[0].clientX;
		initialY=evt.changedTouches[0].clientY;
	}else{
		initialX=evt.clientX;
		initialY=evt.clientY;
		dragging=true;
	}
	//alert(">>"+initialX+","+initialY);
}

function handleMove(evt){
	evt.preventDefault();
	if(!isDesktop){
		actualX=evt.changedTouches[0].clientX;
		actualY=evt.changedTouches[0].clientY;
	}else{
		if(!dragging){
			return;
		}
		actualX=evt.clientX;
		actualY=evt.clientY;
	}
	var dx=actualX-initialX;
	currentAppNameContainer.parentNode.style.marginLeft=dx+"px";
}

function handleEnd(evt){
	evt.preventDefault();
	var dx=actualX-initialX;
	var dy=actualY-initialY;
	//alert(dx+","+dy);
	
	if((Math.abs(dx)>Math.abs(dy))&& (Math.abs(dx)>80)){
		evt.preventDefault();
		if(dx>0){
			jump(-1);
		}else{
			jump(1);
		}
	}else{
		currentAppNameContainer.parentNode.style.marginLeft="0px";
	}
	dragging=false;
}
