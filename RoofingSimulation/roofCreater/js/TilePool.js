function TilePool(options){
	this.type=options.type;
	this.creator = options.creator;
//	this.bigNWidth=undefined;
//	this.smallWWidth=undefined;
	this.tiles=[];
	this.allTiles=[];
	this.create= function(count){
		this.clear();
		for(var i=0;i<count;i++){
			var tile = Tile.create(this.creator,this.type);
			if(!tile){
				i--;
				continue;
			}
			this.allTiles.push(tile);
			tile.thicknessSigma = this.creator.getThicknessSigma();
			tile.index = i;
			this.tiles.push(tile);
		}
	}
	this.shift = function(){
		var tile = this.bootstrapTile();
		this.tiles.remove(tile);
		return new TileInfo({tryCount:0,tile:tile,failInfos:[]});
	}
	this.clear = function(){
		this.allTiles.length =0;
		this.tiles.length=0;
	}
	this.bootstrapTile = function(){
		var index = Math.floor(Math.random()*this.tiles.length);
		return this.tiles[index];
	}
	this.getCanUsed = function(tile,roof,map,col,row){
		var failInfos=[];
		for(var i=0;i<this.tiles.length;i++){
			var nextTile = this.bootstrapTile();
			var canUse=nextTile.canUse(tile,roof,map,col,row);
			if(canUse.status===true){
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
		return null;
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
		if(this.type=="A"){
			if(tile.type==Tile.BANWA){
				html+=tile.smallWWidth.toFixed(2)+"<br>";
			}else{
				html+=tile.bigWWidth.toFixed(2)+"<br>";
			}
		}else{
			if(tile.type==Tile.BANWA){
				html+=tile.bigWWidth.toFixed(2)+"<br>";
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
				html+=tile.bigWWidth.toFixed(2)+"<br>";
			}else{
				html+=tile.smallWWidth.toFixed(2)+"<br>";
			}
		}else{
			if(tile.type==Tile.BANWA){
				html+=tile.smallWWidth.toFixed(2)+"<br>";
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
		var tile = this.tile;
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
		var tips = tile.type==Tile.BANWA?"Pan tile":"Cover tile";
		tips+=":<br>";
		var name = this.col+"_"+this.row;
		
		var html=tips+"Id："+name+"<br/>";
		html+="Number of tile attempts at this position："+tryCount+"<br>";
		if(failInfo){
			html+=failInfo+"<br>";
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