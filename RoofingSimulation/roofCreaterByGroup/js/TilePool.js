function TilePool(options){
	this.type=options.type;
	this.creator = options.creator;
	this.tiles=[];
	this.allTiles=[];
	this.groupMap={};
	this.create= function(count){
		this.clear();
		for(var i=0;i<count;i++){
			var tile = Tile.create(this.creator,this.type);
			if(!tile){
				i--;
				continue;
			}
			tile.index = i;
			tile.thicknessSigma = this.creator.getThicknessSigma();
			this.allTiles.push(tile);
			var groupName = tile.getGroupName();
			var list = this.groupMap[groupName];
			if(!list){
				list = this.groupMap[groupName]=[];
			}
			list.push(tile);
			tile.list = list;
			this.tiles.push(tile);
		}
		var groupCount=0;
		var groupList = [];
		for(var groupName in TileCreator.GROUP_LEVELS){
			groupCount++;
			var list = this.groupMap[groupName];
			if(!list){
				list = this.groupMap[groupName]=[];
			}
			groupList.push(groupName);
		}
		
		this.groupCount=groupCount;
		if(this.type==Tile.BANWA){
			console.log("Pan tile池:共"+count+"块，分为："+this.groupCount+"组【"+groupList.join("、")+"】，各组占比情况------------");
		}else{
			console.log("Cover tile池:共"+count+"块，分为："+this.groupCount+"组【"+groupList.join("、")+"】，各组占比情况------------");
		}
		for(var groupName in TileCreator.GROUP_LEVELS){
			var list = this.groupMap[groupName];
			console.log(groupName+":共"+list.length+"块，占比:"+(list.length/count*100).toFixed(2)+"%");
		}
	}
	this.getTileCountByGroupNames=function(groupNames){
		var count = 0;
		for(var i=0;i<groupNames.length;i++){
			var list = this.groupMap[groupNames[i]];
			count+=list.length;
		}
		return count;
	}
	this.randomTileByGroupNames=function(groupNames){
		var count = 0;
		for(var i=0;i<groupNames.length;i++){
			var list = this.groupMap[groupNames[i]];
			count+=list.length;
		}
		var index = Math.floor(Math.random()*count);
		for(var i=0;i<groupNames.length;i++){
			var list = this.groupMap[groupNames[i]];
			if(index<list.length){
				return list[index];
			}
			index=index-list.length;
		}
		debugger;
		console.error("遗漏取瓦");
		return this.randomTile();
	}

	this.clear = function(){
		this.allTiles.length =0;
		this.tiles.length=0;
		for(var groupName in this.groupMap){
			delete this.groupMap[groupName];
		}
	}
	this.randomTile=function(){
		var count = this.tiles.length;
		var index = Math.floor(Math.random()*count);
		return this.tiles[index];
	}
	this.shift = function(){
		if(this.type==Tile.BANWA){
			var groupNames=TileCreator.getGroupNamesInBigGroupNames(["B","C"],[1]);
			var tile = this.randomTileByGroupNames(groupNames);
			tile.list.remove(tile);
			this.tiles.remove(tile);
			return new TileInfo({tryCount:0,tile:tile,failInfos:[]});
		}else{
			var groupNames=TileCreator.getGroupNamesInSmallGroupNames(["b","c"],[1]);
			var tile = this.randomTileByGroupNames(groupNames);
			tile.list.remove(tile);
			this.tiles.remove(tile);
			return new TileInfo({tryCount:0,tile:tile,failInfos:[]});
		}
	}
	this.getBanWaGroupNames = function(tile,leftTileInfo){
		var groupNames=TileCreator.getGroupNamesByLevel(1);
		if(tile){
			var bigGroup=tile.bigGroup;
			var smallGroup=tile.smallGroup;
			if(this.type==Tile.BANWA&&leftTileInfo&&leftTileInfo.tile){
				var groupNames_;
				var leftTileLevel = TileCreator.getGroupLevel(leftTileInfo.tile.getGroupName());
//				if(bigGroup==TileCreator.MAX_LEVEL){
//					groupNames_=TileCreator.getUseGroupNamesByLevel(leftTileLevel);
//				}else{
					var levels=TileCreator.getUseLevelsByLevel(leftTileLevel);
					groupNames_=TileCreator.getGroupNamesByBigGroup(bigGroup,levels);
//				}
				var count = this.getTileCountByGroupNames(groupNames_);
				var bigName = TileCreator.getBigGroupName(bigGroup);
//				console.log(tile.getGroupName()+","+bigName+":"+count+","+groupNames_.join("、"));
				if(count>0){
					groupNames=groupNames_;
				}else{
					console.log("没有找到优先级更高的互补数据："+leftTileLevel);
					return undefined;
				}
			}else{
//				if(bigGroup==TileCreator.MAX_LEVEL){
//					groupNames=TileCreator.getGroupNames(bigGroup,smallGroup);
//				}else{
					groupNames=TileCreator.getGroupNamesByBigGroup(bigGroup);
//				}
			}
		}
		return groupNames;
	}
	this.getTongWaGroupNames= function(tile){
		if(tile){
			var smallGroup=tile.smallGroup;
			var groupNames=TileCreator.getGroupNamesBySmallGroup(smallGroup);
			var count = 0;
			for(var i=0;i<groupNames.length;i++){
				var list = this.groupMap[groupNames[i]];
				count+=list.length;
			}
			var smallName = TileCreator.getSmallGroupName(smallGroup);
//			console.log(smallName+":"+count);
			if(count==0){
				return undefined;
			}
			return groupNames;
		}else{
			var groupNames=TileCreator.getGroupNamesInSmallGroupNames(["b","c"],[1]);
			return groupNames;
		}
	}
	this.getUnUsedTilesCount=function(tile,leftTileInfo){
		if(this.type==Tile.BANWA){
			var groupNames=this.getBanWaGroupNames(tile,leftTileInfo);
			if(!groupNames){
				return 0;
			}
			var count = 0;
			for(var i=0;i<groupNames.length;i++){
				var list = this.groupMap[groupNames[i]];
				count+=list.length;
			}
			return count;
		}else{
			if(!tile){
				var groupNames=TileCreator.getGroupNamesInSmallGroupNames(["b","c"],[1]);
				var count = 0;
				for(var i=0;i<groupNames.length;i++){
					var list = this.groupMap[groupNames[i]];
					count+=list.length;
				}
				return count;
			}
			var groupNames=this.getTongWaGroupNames(tile);
			if(!groupNames){
				return 0;
			}else{
				var count = 0;
				for(var i=0;i<groupNames.length;i++){
					var list = this.groupMap[groupNames[i]];
					count+=list.length;
				}
				return count;
			}
		}
	}
	this.bootstrapTile = function(tile,leftTileInfo){
		if(this.type==Tile.BANWA){
			var groupNames=this.getBanWaGroupNames(tile,leftTileInfo);
			if(!groupNames){
				return undefined;
			}else{
				var ret = this.randomTileByGroupNames(groupNames);
				return ret;
			}
		}else{
			var groupNames=this.getTongWaGroupNames(tile);
			if(!groupNames){
				return undefined;
			}else{
				var ret = this.randomTileByGroupNames(groupNames);
				return ret;
			}
		}
	}
	this.bootstrapTileAll = function(tile,leftTileInfo){
		var ret = this.randomTile();
		return ret;
	}
	this.getCanUsed = function(tile,roof,banMap,col,row,leftCol){
		var failInfos=[];
		var leftTile=undefined;
		if(this.type==Tile.BANWA&&banMap[leftCol]){
			leftTile=banMap[leftCol][row];
		}
		var count = this.getUnUsedTilesCount(tile,leftTile);
		for(var i=0;i<count;i++){
			var nextTile = this.bootstrapTile(tile,leftTile);
			var canUse=nextTile.canUse(tile,roof,banMap,col,row);
			if(canUse.status===true){
				nextTile.list.remove(nextTile);
				this.tiles.remove(nextTile);
				if(tile){
					if(tile.type==Tile.BANWA){
						var spacing=tile.bigNWidth-nextTile.smallWWidth;
						tile.spacing = spacing;
						var spacingPer=(spacing/tile.bigNWidth);
						tile.spacingPer = spacingPer;
						
					}else{
						var spacing=nextTile.bigNWidth-tile.smallWWidth;
						tile.spacing = spacing;
						var spacingPer=(spacing/nextTile.bigNWidth);
						tile.spacingPer = spacingPer;
						
					}
					tile.computeOverlapLength(nextTile);
					tile.noUse=false;
				}
				nextTile.noUse=false;
				return new TileInfo({tryCount:i,tile:nextTile,failInfos:failInfos});
			}else{
				failInfos.push({index:i,msg:canUse.msg,type:canUse.type});
			}
		}
		console.log(this.type+"优先级没有找到，从剩余全部里找！！！");
		var allCount = this.tiles.length;
		for(var i=0;i<allCount;i++){
			var nextTile = this.bootstrapTileAll(tile,leftTile);
			var canUse=nextTile.canUse(tile,roof,banMap,col,row);
			if(canUse.status===true){
				nextTile.list.remove(nextTile);
				this.tiles.remove(nextTile);
				if(tile){
					if(tile.type==Tile.BANWA){
						var spacing=tile.bigNWidth-nextTile.smallWWidth;
						tile.spacing = spacing;
						var spacingPer=(spacing/tile.bigNWidth);
						tile.spacingPer = spacingPer;
						
					}else{
						var spacing=nextTile.bigNWidth-tile.smallWWidth;
						tile.spacing = spacing;
						var spacingPer=(spacing/nextTile.bigNWidth);
						tile.spacingPer = spacingPer;
						
					}
					tile.computeOverlapLength(nextTile);
					tile.noUse=false;
				}
				nextTile.noUse=false;
				return new TileInfo({tryCount:i+count,tile:nextTile,failInfos:failInfos});
			}else{
				failInfos.push({index:i+count,msg:canUse.msg,type:canUse.type});
			}
		}
		return new TileInfo({tryCount:count+allCount,failInfos:failInfos});
	}
}

function TileInfo(options){
	this.tryCount = options.tryCount;
	this.tile = options.tile;
	this.failInfos = options.failInfos;
	this.toSimpleString=function(){
		var tile = this.tile;
		var tryCount =this.tryCount;
		var name = this.col+"_"+this.row;
		if(tryCount>0&&tryCount<5){
			tryCount='<span class="yellow">'+tryCount+'</span>';
		}else if(tryCount>=5){
			tryCount='<span class="red">'+tryCount+'</span>';
		}
		var html=name+"("+tryCount+")"+"<br>";
		if(!tile){
			html+='<span class="red">None</span>';
			return html;
		}
		if(this.type=="A"){
			if(tile.type==Tile.BANWA){
				html+=tile.smallGroupName+":"+tile.smallWWidth.toFixed(2)+"<br>";
			}else{
				html+=tile.bigWWidth.toFixed(2)+"<br>";
			}
		}else{
			if(tile.type==Tile.BANWA){
				html+=tile.bigGroupName+":"+tile.bigWWidth.toFixed(2)+"<br>";
			}else{
				html+=tile.smallWWidth.toFixed(2)+"<br>";
			}
		}
		
		
		var tryCount =tile.tryCount;
		if(tryCount>1&&tryCount<3){
			tryCount='<span class="yellow">'+tryCount+'</span>';
		}else if(tryCount>=3){
			tryCount='<span class="red">'+tryCount+'</span>';
		}
		
		html+=tryCount+"<br>";
		if(this.type=="A"){
			if(tile.type==Tile.BANWA){
				html+=tile.bigGroupName+":"+tile.bigWWidth.toFixed(2)+"<br>";
			}else{
				html+=tile.smallWWidth.toFixed(2)+"<br>";
			}
		}else{
			if(tile.type==Tile.BANWA){
				html+=tile.smallGroupName+":"+tile.smallWWidth.toFixed(2)+"<br>";
			}else{
				html+=tile.bigWWidth.toFixed(2)+"<br>";
			}
		}
//		html+=Math.rad2deg(tile.α).toFixed(2)+"°<br>";
		
//		if(tile.spacingPer){
//			var spacingPer=tile.spacingPer*100/2;
//			if(spacingPer>10&&spacingPer<20){
//				spacingPer='<span class="yellow">'+spacingPer.toFixed(2)+'%</span>';
//			}else if(spacingPer>=20){
//				spacingPer='<span class="red">'+spacingPer.toFixed(2)+'%</span>';
//			}else{
//				spacingPer=spacingPer.toFixed(2)+'%';
//			}
//			html+=spacingPer+"<br>";
//		}
		if(tile.type==Tile.BANWA){
			html+=tile.halfDistance().toFixed(2)+"<br/>";
		}else{
			html+=tile.dingNWidth.toFixed(2)+"<br/>";
			
		}
//		if(tile.overlapLength){
//			var overlapLength=tile.overlapLength;
//			if(overlapLength>tile.length/2&&overlapLength<tile.length){
//				overlapLength='<span class="yellow">'+overlapLength.toFixed(2)+'</span>';
//			}else if(overlapLength>=tile.length){
//				overlapLength='<span class="red">'+overlapLength.toFixed(2)+'</span>';
//			}else{
//				overlapLength='<span >'+overlapLength.toFixed(2)+'</span>';
//			}
//			html+=overlapLength+"<br/>";
//		}
		
		return html;
	}
	this.getFailInfoString=function(){
		if(this.failInfos&&this.failInfos.length>0){
			var map = {};
			for(var i=0;i<this.failInfos.length;i++){
				var info = this.failInfos[i];
				var msg = info.msg;
				if(!map[msg]){
					map[msg]=1;
				}else{
					map[msg]++;
				}
				
			}
			var ret = [];
			for(var key in map){
				ret.push(key+":"+map[key]);
			}
			return ret.join('<br/>');
		}
		return undefined;
	}
	this.getFailInfoMap=function(){
		if(this.failInfos&&this.failInfos.length>0){
			var map = {};
			for(var i=0;i<this.failInfos.length;i++){
				var info = this.failInfos[i];
				var msg = info.msg;
				if(!map[msg]){
					map[msg]=1;
				}else{
					map[msg]++;
				}
			}
			return map;
		}
		return undefined;
	}
	this.toString=function(){
		var tryCount =this.tryCount;
		var failInfo = this.getFailInfoString();
		if(tryCount>0&&tryCount<5){
			tryCount='<span class="yellow">'+tryCount+'</span>';
			if(failInfo){
				failInfo='<span class="yellow">'+failInfo+"</span>";
			}
		}else if(tryCount>=5){
			tryCount='<span class="red">'+tryCount+'</span>';
			if(failInfo){
				failInfo='<span class="red">'+failInfo+"</span>";
			}
		}
		var tile = this.tile;
		var name = this.col+"_"+this.row;
		
		var html="Id："+name+"<br/>";
		if(tile){
			var tips = tile.type==Tile.BANWA?"Pan tile":"Cover tile";
			tips+=":<br>";
			html=tips+html;
		}
		html+="Number of tile attempts at this position："+tryCount+"<br>";
		if(failInfo){
			html+=failInfo+"<br>";
		}
		if(!tile){
			return html;
		}
		var tryCount =tile.tryCount;
		var failInfo = tile.getFailInfoString();
		if(tryCount>1&&tryCount<3){
			tryCount='<span class="yellow">'+tryCount+'</span>';
			if(failInfo){
				failInfo='<span class="yellow">'+failInfo+"</span>";
			}
		}else if(tryCount>=3){
			tryCount='<span class="red">'+tryCount+'</span>';
			if(failInfo){
				failInfo='<span class="red">'+failInfo+"</span>";
			}
		}
		html+="Number of tile attempts at the tile："+tryCount+"<br>";
		if(failInfo){
			html+=failInfo+"<br>";
		}
		html+=tile.toString(true)+"<br>";

//		if(tile.spacingPer){
//			html+="和下瓦对接间隙："+(tile.spacing/2).toFixed(2)+"<br>";
//			var spacingPer=tile.spacingPer*100/2;
//			if(spacingPer>10&&spacingPer<20){
//				spacingPer='<span class="yellow">'+spacingPer.toFixed(2)+'%</span>';
//			}else if(spacingPer>=20){
//				spacingPer='<span class="red">'+spacingPer.toFixed(2)+'%</span>';
//			}else{
//				spacingPer=spacingPer.toFixed(2)+'%';
//			}
//			html+="对接间隙百分比："+spacingPer+"<br>";
//		}
//		if(tile.type==Tile.BANWA){
//			html+="小头外宽："+tile.smallWWidth.toFixed(2)+"<br>";
//			html+="大头内宽："+tile.bigNWidth.toFixed(2)+"<br>";
//		}else{
//			html+="大头内宽："+tile.bigNWidth.toFixed(2)+"<br>";
//			html+="小头外宽："+tile.smallWWidth.toFixed(2)+"<br>";
//		}
//		html+="厚度："+tile.thickness.toFixed(2)+"<br>";
//		html+="长度："+tile.length+"<br>";
//		html+="延展角度："+Math.rad2deg(tile.α).toFixed(2)+"°<br>";
		if(tile.banLeftRightDistance){
			html+="Spacing of the tiles："+tile.banLeftRightDistance.toFixed(2)+"<br>";
		}
		if(tile.overlapLength){
			var overlapLength=tile.overlapLength;
			if(overlapLength>tile.length/2&&overlapLength<tile.length){
				overlapLength='<span class="yellow">'+overlapLength.toFixed(2)+'</span>';
			}else if(overlapLength>=tile.length){
				overlapLength='<span class="red">'+overlapLength.toFixed(2)+'</span>';
			}else{
				overlapLength='<span >'+overlapLength.toFixed(2)+'</span>';
			}
			html+="Overlapping length："+overlapLength+"<br>";
		}
		return html;
	}
}