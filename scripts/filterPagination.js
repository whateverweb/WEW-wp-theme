function filterPagination(perPageContainer,pagesContainer) {
	
	
	// attributes
	
	
	this.filter = null;
	this.perPageOpts = [ "All" , 5 ];
	this.perPageLabels = [ "Continous" , "Paginated"];
	this.perPageLabelsId = [ "first", "last" ];
	this.curPage = 1;
	var defaultVal="All";
	this.perPage = "All";
	this.paginationButtons=[];
	
	this.perPageContainer=perPageContainer;
	this.pagesContainer=pagesContainer;
	
	this.userEmail = sessionStorage.getItem("userEmail");
	this.localStorageAddr=this.userEmail+'.AppsPerPage';
	this.perPage = localStorage.getItem(this.localStorageAddr) || this.perPageOpts[0];
	if(!this.perPage){
		this.perPage=defaultVal;
		localStorage.setItem(this.localStorageAddr,this.perPage);
	}
	this.perPageOriginal=this.perPage;
	
	// ---------------------------------
  
}

// methods----------------------------------------------

filterPagination.prototype.goToPage = function(pageNrParam) {
	var pageNr = pageNrParam;
	
	if(this.perPage=='All'){
		this.perPage=this.filter.totalVisible;
    }
	if (!pageNr) {
		pageNr = this.curPage;
		
		var totalPages = Math.ceil(this.filter.totalVisible /this.perPage);
		if (pageNr > totalPages) {
			pageNr = totalPages;
		}
	}
	
	this.curPage = pageNr;
	this.showCurrentPageElements();
	this.drawPage();
}

filterPagination.prototype.showCurrentPageElements=function(){
	var cnt = 0;
	var startIndex = (this.curPage - 1) * this.perPage;
	var endIndex = startIndex*1 + this.perPage*1;
	var total = this.filter.domElemsMap.length;
	
	for (var i = 0; i < total; i++) {
		if (this.filter.visibleMap[i]) {
			if (cnt >= startIndex && cnt < endIndex) {
				this.filter.domElemsMap[i].style.display = "";
			} else {
				this.filter.domElemsMap[i].style.display = "none";
			}
			cnt++;
		} else {
			this.filter.domElemsMap[i].style.display = "none";
		}

	}
}



filterPagination.prototype.drawPage = function() {
	this.pagesContainer.innerHTML="";
	this.perPageContainer.innerHTML="";
	
 	var totalPages = Math.ceil(this.filter.totalVisible / this.perPage);
   
	if (totalPages <= 1 || !this.filter.totalVisible) {
		  this.generatePerPageSelector();
		  return;
	}
    
	this.generatePerPageSelector();
	this.generatePageSelector(totalPages);
}



filterPagination.prototype.generatePageSelector=function(totalPages){
	var lateralPageIndexes=this.calculateFirstAndLastPageLinks(totalPages);

	var tmpcontainer = this.pagesContainer;
	tmpcontainer.innerHTML="";
	
	
	var first = this.generatePageLink(1, "&laquo;");
	first.id="first";
	tmpcontainer.appendChild(first);
	if (lateralPageIndexes.halfLeft == this.curPage) {
		first.className = "disabled";
	}

	
	for ( var i = lateralPageIndexes.halfLeft; i <= lateralPageIndexes.halfRight; i++) {
		tmpcontainer.appendChild(this.generatePageLink(i, i, this));
	}
	
	
	var last = this.generatePageLink(totalPages, "&raquo;", this);
	last.id="last";
	tmpcontainer.appendChild(last);
	if (lateralPageIndexes.halfRight == this.curPage) {
		last.className = "disabled";
	}
	
	
}



filterPagination.prototype.calculateFirstAndLastPageLinks=function(totalPages){
	var nrpages = 3;
	var mid = Math.floor(nrpages / 2);
	var halfLeft = this.curPage - mid;
	var halfRight = halfLeft + nrpages - 1;
	if (halfLeft < 1) {
		halfLeft = 1
		halfRight = halfLeft + nrpages - 1;
		if (halfRight > totalPages) {
			halfRight = totalPages;
		}
	}
	if (halfRight > totalPages) {
		var dif = halfRight - totalPages;
		halfRight = totalPages;
		halfLeft = halfRight - nrpages + 1;
		if (halfLeft < 1) {
			halfLeft = 1;
		}
	}
	return {"halfLeft":halfLeft,"halfRight":halfRight};
}



filterPagination.prototype.generatePerPageSelector = function() {
	var container = this.perPageContainer;
	container.innerHTML="";
	
	for ( var i = 0; i < this.perPageOpts.length; i++) {
		container.appendChild(this.generatePerPageLink(this.perPageOpts[i],this.perPageLabels[i],this.perPageLabelsId[i]));
	}
}


filterPagination.prototype.generatePageLink = function(pageNr, text) {
	var tmpa = document.createElement("a");
	tmpa.innerHTML = text;
	if (pageNr == this.curPage) {
		tmpa.className = "current-page";
		return tmpa;
	}
	
	var scope=this;
	tmpa.onclick = function() {
		scope.goToPage(pageNr);
	}
	return tmpa;
}


filterPagination.prototype.generatePerPageLink = function(nr, label, htmlId) {
	var tmpa = document.createElement("a");
	tmpa.innerHTML = label;
	tmpa.setAttribute("id",htmlId);
	this.paginationButtons.push(tmpa);
	var tmpNr=nr;
	/*if(tmpNr=="All"){
		tmpNr=this.perPage;
	}*/
	if (tmpNr == this.perPageOriginal) {
		tmpa.className = "current-item";
		return tmpa;
	}
	var scope=this;
	tmpa.onclick = function() {
		scope.perPageLinkBehavior(nr);
	}
	return tmpa;
}



filterPagination.prototype.perPageLinkBehavior=function(perPage){
	this.perPageOriginal=perPage;
	this.perPage = perPage;
	localStorage[this.userEmail+'.AppsPerPage']=this.perPage;
	this.goToPage(1);
}

//------------------------------------------