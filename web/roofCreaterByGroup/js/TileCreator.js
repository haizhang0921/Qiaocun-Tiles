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
	this.getGroupNum=function(key,value){
		var gauss = this.creators[key];
		var mean = gauss.mean;
		var standardDeviation = gauss.standardDeviation;
		var min =mean- 2*standardDeviation;
		if(value<min){
			return -1;
		}
		var max =mean+ 2*standardDeviation;
		if(value>max){
			return -1;
		}
		var min =mean- standardDeviation;
		if(value<min){
			return 0;
		}
		if(value>=min&&value<mean){
			return 1;
		}
		var max =mean+ standardDeviation;
		if(value>=mean&&value<=max){
			return 2;
		}
		
		if(value>max){
			return 3;
		}
		debugger;
		console.error("遗漏分组");
	}

}
TileCreator.getGroupName=function(bigGroup,smallGroup){
	var biggroupName=TileCreator.getBigGroupName(bigGroup);
	if(!biggroupName){
		return undefined;
	}
	var smallgroupName=TileCreator.getSmallGroupName(smallGroup);
	if(!smallgroupName){
		return undefined;
	}
	return biggroupName+"_"+smallgroupName;
}
TileCreator.MAX_LEVEL=3;
TileCreator.getBigGroupName=function(bigGroup){
	var biggroupName;
	if(bigGroup==0){
		biggroupName="D";
	}else if(bigGroup==1){
		biggroupName="C";
	}else if(bigGroup==2){
		biggroupName="B";
	}else if(bigGroup==3){
		biggroupName="A";
	}
	if(!biggroupName){
		return undefined;
	}
	return biggroupName;
}
TileCreator.getSmallGroupName=function(smallGroup){
	var smallgroupName;
	if(smallGroup==0){
		smallgroupName="d";
	}else if(smallGroup==1){
		smallgroupName="c";
	}else if(smallGroup==2){
		smallgroupName="b";
	}else if(smallGroup==3){
		smallgroupName="a";
	}
	if(!smallgroupName){
		return undefined;
	}
	return smallgroupName;
}
TileCreator.GROUP_LEVELS={
	"D_d":2,
	"D_c":1,
	"D_b":1,
	"D_a":5,
	"C_d":3,
	"C_c":2,
	"C_b":1,
	"C_a":1,
	"B_d":4,
	"B_c":3,
	"B_b":2,
	"B_a":1,
	"A_d":5,
	"A_c":4,
	"A_b":3,
	"A_a":2,
};

TileCreator.LEVEL_GROUPS={
};
for(var groupName in TileCreator.GROUP_LEVELS){
	var l = TileCreator.GROUP_LEVELS[groupName];
	if(!TileCreator.LEVEL_GROUPS[l]){
		TileCreator.LEVEL_GROUPS[l]=[];
	}
	TileCreator.LEVEL_GROUPS[l].push(groupName);
}
TileCreator.getGroupLevel=function(groupName){
	return TileCreator.GROUP_LEVELS[groupName];
}
//根据level获取互补的分组名称
TileCreator.getUseGroupNamesByLevel=function(level){
	var levels = TileCreator.getUseLevelsByLevel(level);
	var groupNames=[];
	for(var i=0;i<levels.length;i++){
		var l = levels[i];
		var groupNames_ = TileCreator.getGroupNamesByLevel(l);
		groupNames=groupNames.concat(groupNames_);
	}
	return groupNames.unique();
}
TileCreator.getUseLevelsByLevel=function(level){
	var levels = [];
	if(level==5){
		levels.push(1);
	}else if(level==4){
		levels.push(1,2);
	}else if(level==3){
		levels.push(1,2,3);
	}else if(level==2){
		levels.push(1,2,3,4);
	}else if(level==1){
		levels.push(1,2,3,4,5);
	}
//	if(level==5){
//		levels.push(1);
//	}else if(level==4){
//		levels.push(1,2);
//	}else if(level==3){
//		levels.push(1,2);
//	}else if(level==2){
//		levels.push(1,2);
//	}else if(level==1){
//		levels.push(1,2);
//	}
	return levels;
}
//根据level获取对应优先级的分组名称
TileCreator.getGroupNamesByLevel=function(level){
	return TileCreator.LEVEL_GROUPS[level];
}
TileCreator.getGroupNamesInBigGroupNames=function(bigGroupNames,levels){
	var ret=[];
	for(var groupName in TileCreator.GROUP_LEVELS){
		var bigName=groupName.split("_")[0];
		if(bigGroupNames.contains(bigName)){
			if(levels){
				var l = TileCreator.GROUP_LEVELS[groupName];
				if(levels.contains(l)){
					ret.push(groupName);
				}
			}else{
				ret.push(groupName);
			}
		}
	}
//	console.log("板瓦："+bigName+"---》"+ret.join("、"));
	return ret;
}
TileCreator.getGroupNamesInSmallGroupNames=function(smallGroupNames,levels){
	var ret=[];
	for(var groupName in TileCreator.GROUP_LEVELS){
		var smallName=groupName.split("_")[1];
		if(smallGroupNames.contains(smallName)){
			if(levels){
				var l = TileCreator.GROUP_LEVELS[groupName];
				if(levels.contains(l)){
					ret.push(groupName);
				}
			}else{
				ret.push(groupName);
			}
		}
	}
//	console.log("板瓦："+bigName+"---》"+ret.join("、"));
	return ret;
}
TileCreator.getGroupNamesByBigGroup=function(bigGroup,levels){
	var bigName = TileCreator.getBigGroupName(bigGroup);
	var smallNames=[];
	if(bigName=="A"||bigName=="B"){
		smallNames.push("a","b","c","d");
	}else if(bigName=="C"){
		smallNames.push("b","c","d");
	}else if(bigName=="D"){
		smallNames.push("c","d");
	}
	var ret=[];
	for(var groupName in TileCreator.GROUP_LEVELS){
		var smallName=groupName.split("_")[1];
		if(smallNames.contains(smallName)){
			if(levels){
				var l = TileCreator.GROUP_LEVELS[groupName];
				if(levels.contains(l)){
					ret.push(groupName);
				}
			}else{
				ret.push(groupName);
			}
		}
	}
//	console.log("板瓦："+bigName+"---》"+ret.join("、"));
	return ret;
}
TileCreator.getGroupNamesBySmallGroup=function(smallGroup){
	var smallName=TileCreator.getSmallGroupName(smallGroup);
	var bigNames=[];
	if(smallName=="a"){
		bigNames.push("A","B");
	}else if(smallName=="b"){
		bigNames.push("A","B");
	}else if(smallName=="c"){
		bigNames.push("A","B","C","D");
	}else if(smallName=="d"){
		bigNames.push("A","B","C","D");
	}
//	if(smallName=="a"){
//		bigNames.push("A");
//	}else if(smallName=="b"){
//		bigNames.push("A","B");
//	}else if(smallName=="c"){
//		bigNames.push("A","B","C");
//	}else if(smallName=="d"){
//		bigNames.push("A","B","C","D");
//	}
	var ret=[];
	for(var groupName in TileCreator.GROUP_LEVELS){
		var bigName=groupName.split("_")[0];
		if(bigNames.contains(bigName)){
			ret.push(groupName);
		}
	}
//	console.log("筒瓦："+smallName+"---》"+ret.join("、"));
	return ret;
}
TileCreator.getGroupNames=function(bigGroup,smallGroup){
	var ret=[];
	var n = TileCreator.getGroupName(bigGroup,smallGroup-1);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup,smallGroup);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup,smallGroup+1);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup+1,smallGroup+1);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup+1,smallGroup);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup+1,smallGroup-1);
	if(n){
		ret.push(n);
	}
	

	n = TileCreator.getGroupName(bigGroup-1,smallGroup+1);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup-1,smallGroup);
	if(n){
		ret.push(n);
	}
	n = TileCreator.getGroupName(bigGroup-1,smallGroup-1);
	if(n){
		ret.push(n);
	}
	return ret;
	
}