if(!Math.rad2deg){
	Math.rad2deg=function(rad){
		return rad * (180 / Math.PI);
	} 
}
if(!Math.deg2rad){
	Math.deg2rad=function(deg){
		return deg * (Math.PI / 180);
	} 
}
if(!Math.mean){
	Math.mean=function(array){
		var total=0;
		for(var i=0;i<array.length;i++){
			total+=array[i];
		}
		return total/array.length;
	}
}

if(!Math.variance){
	Math.variance=function(array){
		var mean = Math.mean(array);
		var total=0;
		for(var i=0;i<array.length;i++){
			var x = array[i];
			var step = (x-mean);
			total+=step*step;
		}
		return total/array.length;
	}
}
if(!Math.overlap){
	Math.overlap=function(x,y,α){
		return (x-y)/2*Math.tan(α);
	}
}




