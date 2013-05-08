var menuWeb=document.getElementById("main-menu");
var menuButWeb=document.getElementById("web-menu-trigger");

var menuAdmin=document.getElementById("links-menu");
var menuButAdmin=document.getElementById("admin-menu-trigger");
//setWrap();
var isDesktop=localStorage.getItem("isDesktop")=="true"?true:false;
var isTablet=localStorage.getItem("isTablet")=="true"?true:false;


var expandedAdmin=false;
var expandedWeb=false;

if(!isDesktop){
	if(menuButAdmin){
		menuButAdmin.onclick=function(){
			expandedAdmin=!expandedAdmin;
			toogleButtonsVisibility(expandedAdmin,menuAdmin);
		}
	}
	
	
	
	menuButWeb.onclick=function(){
		   expandedWeb=!expandedWeb;
		   toogleButtonsVisibility(expandedWeb,menuWeb); 
	}
}


function toogleButtonsVisibility(expanded,element){
	element.style.display=expanded?"block":"none";
	if(expanded && element==menuAdmin){
		if(!isDesktop && !isTablet){
			menuWeb.style.display="none";
			expandedWeb=false;
		}
	}
	if(expanded && element==menuWeb){
		if(menuAdmin){
			menuAdmin.style.display="none";
		}
		expandedAdmin=false;
		
	}
}

/*function setWrap(){
  menuWeb.style.overflow="hidden";
   var links=menuWeb.getElementsByTagName("span");
   for(var i=0;i<links.length;i++){
     links[i].style["white-space"]="nowrap";
   }
}*/

/*function initMenu(){
	var isDesktop=sessionStorage.getItem("isDesktop")=="true"?true:false;
	var fromStorage=sessionStorage.getItem("sideMenuExpanded");
	expanded=isDesktop;
		   
	if(isDesktop){
		if(fromStorage!=undefined && fromStorage!=null){
			expanded=fromStorage=="true"?true:false;
		}
	}
	menu.style.width=expanded?offsetWidth:minWidth;
	menu.style.visibility="visible";
}   */