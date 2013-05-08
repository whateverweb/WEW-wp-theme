Array.prototype.swap=function(a, b)
{
	var tmp=this[a];
	this[a]=this[b];
	this[b]=tmp;
}

/**
 * Sorts an array based on external rules and reordering function
 *
 */
function Sorter(){
   this.indexes=[];
   this.reorderFunction=null;
}



/* quick sort function*/
Sorter.prototype.partition=function(array, begin, end, pivot,tosort)
{
	var piv=array[pivot];
	array.swap(pivot, end-1);
	var store=begin;
	var ix;
	for(ix=begin; ix<end-1; ++ix) {
		if(this.sortingFunction.call({__proto__:this.sortScope},array[ix],piv,tosort)) {
			array.swap(store, ix);
			++store;
		}
	}
	array.swap(end-1, store);

	return store;
}

Sorter.prototype.quickSort=function(array, begin, end,tosort)
{
	if(end-1>begin) {
		var pivot=begin+Math.floor(Math.random()*(end-begin));

		pivot=this.partition(array, begin, end, pivot,tosort);

		this.quickSort(array, begin, pivot,tosort);
		this.quickSort(array, pivot+1, end,tosort);
	}
}
/*-------------------------------------------------------*/

Sorter.prototype.sort=function(toSort,compareFunction,reorderFunction,scope){
    
	this.sortScope=scope;
	
	this.reorderFunction=reorderFunction;

	var t1=new Date().getTime();
	
	this.indexes=[];
	
	for(var i=0;i<toSort.length;i++){
	  this.indexes.push(i);
	}
	
	this.sortingFunction=compareFunction;
	this.quickSort(this.indexes,0,this.indexes.length,toSort);
	var t2=new Date().getTime()
	if(this.reorderFunction){
		this.reorderFunction.call({__proto__:this.sortScope},this.indexes,toSort);
	}
	var t3=new Date().getTime()
	
}


