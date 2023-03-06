Array.prototype.clear=function(callback){
	for(var i=0,n=0;i<this.length;i++)
    {
    	if(callback){
    		callback(this[i]);
    	}
    	//delete this[i];
    }
	this.length=0;
} 
Array.prototype.contains=function(obj)
{
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]===obj)
        {
            return true;
        }
    }
    return false;
} 
Array.prototype.indexOf=function(obj)
{
    for( var i=this.length-1;i>=0;i--)
    {
        if(this[i]==obj)
        {
            return i;
        }
    }
    return -1;
} 
Array.prototype.removeAt=function(index){
	return this.splice(index,1);
}
Array.prototype.insert = function (index, item) { 
	this.splice(index, 0, item); 
};
Array.prototype.remove=function(obj,callback){
	var index=this.indexOf(obj);
	if (index>=0){
		var removed = this.removeAt(index);
		if(callback){
    		callback(removed);
    	}
	}
}

Array.prototype.clone = function () { 
return this.slice(0); 
} 

Array.prototype.unique = function(){  
    var o = {}, re = [];  
    for(var i=0, len = this.length;i<len; i++){  
        if(!o[this[i]]){  
            o[this[i]] = true;  
            re.push(this[i]);  
        }  
    }  
    return re;  
}  