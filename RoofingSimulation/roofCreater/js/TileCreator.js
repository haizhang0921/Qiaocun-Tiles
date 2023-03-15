function TileCreator(options){
	this.creators={};
	for(var key in options){
		var params =options[key];
		if(params.mean!=undefined&&params.variance!=undefined){
			this.creators[key]= gaussian(params.mean,params.variance);
		}
	}
	this.random=function(){
		var ret={};
		for(var key in this.creators){
			ret[key]=this.creators[key].random(1)[0];
		}
		return ret;
	}
	this.getThicknessSigma=function(){
		return this.getStandardDeviation("thickness");
	}
	this.getStandardDeviation=function(key){
		var gauss = this.creators[key];
		return gauss.standardDeviation;
	}
}