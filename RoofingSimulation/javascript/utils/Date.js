// JavaScript Document

Date.prototype.parseStr = function(str) {
		var strArr = str.split(" ");
		var strArr1 = strArr[0].split("-");
		
		this.setYear(parseInt(strArr1[0]));
		this.setMonth(parseInt(strArr1[1]));
		this.setDate(parseInt(strArr1[2]));
		
		try {
			if (strArr[1].length > 0) {
				var strArr2 = strArr[1].split(":");
				
				this.setHours(parseInt(strArr2[0]));
				this.setMinutes(parseInt(strArr2[1]));
				this.setSeconds(parseInt(strArr2[2]));
				
			}
		} catch (E) {
		}
}

Date.prototype.toString = function() {
	var h =  this.getHours();
	if (h == 0) {
		h = 12;
	}
	return this.getYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " "
			+ h + ":" + this.getMinutes() + ":" + this.getSeconds();
}

Date.prototype.format = function(format)
{
var o = {
"M+" : this.getMonth()+1, //month
"d+" : this.getDate(),    //day
"h+" : this.getHours(),   //hour
"m+" : this.getMinutes(), //minute
"s+" : this.getSeconds(), //second
"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
"S" : this.getMilliseconds() //millisecond
}
if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
(this.getFullYear()+"").substr(4 - RegExp.$1.length));
for(var k in o)if(new RegExp("("+ k +")").test(format))
format = format.replace(RegExp.$1,
RegExp.$1.length==1 ? o[k] :
("00"+ o[k]).substr((""+ o[k]).length));
return format;
}

Date.stringToDate = function(strDate){
   var strSeparator = "-"; 
   var strDateArray;
   strDateArray = strDate.split(strSeparator);
   var strDateS = new Date(strDateArray[0] + "/" + strDateArray[1] + "/" + strDateArray[2]);
   return strDateS
}
