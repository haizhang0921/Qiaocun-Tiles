function Tile(type){
	this.type=type;
	this._bigNWidth=undefined;
	this._smallWWidth=undefined;
	this.thickness=undefined;
	this._tryCount=0;
	this.noUse=true;
	this._isDiscard=false;
	this.α=undefined;//小角度值
//	if(type==Tile.BANWA){
//		this.length=45;
//	}else{
		this.length=40;
//	}
	this.failInfos = [];
	this.canUse= function(preTile,roof,banMap,col,row){
		this._tryCount++;
		$('.tile_'+this.type+'_'+this.index).removeClass("tile-trycount");
		var ret = {
			status:true,
			msg:""
		};
		if(this.type==Tile.BANWA){
			if(this.smallWWidth<(preTile.bigNWidth+4*this.thicknessSigma)){
//			if(this.smallWWidth<preTile.bigNWidth){
//				if(this.smallWWidth>preTile.smallNWidth){
//					
//				}else{
//					ret.status=false;
//					ret.msg="小头外宽小于前一个小头内宽，不匹配";
//					this.failInfos.push({index:this._tryCount,msg:ret.msg});
//					return ret;
//				}
				return ret;
			}else{
				ret.status=false;
				ret.msg="小头外宽大于前一个大头内宽";
				ret.type="headFail";
				this.failInfos.push({index:this._tryCount,msg:ret.msg});
				return ret;
			}
		}else{
			if(preTile){
				if((this.bigNWidth+4*this.thicknessSigma)>preTile.smallWWidth){
//				if(this.bigNWidth>preTile.smallWWidth){
					ret.status=true;
				}else{
					ret.status=false;
					ret.type="headFail";
					ret.msg="C_W_n+1^li < or = C_W_n^se";
				}
			}else{
				ret.status=true;
			}
			if(ret.status==false){
				this.failInfos.push({index:this._tryCount,msg:ret.msg});
				return ret;
			}
//			if(roof.use.scale==true&&preTile){
//				ret.status = preTile.bigNScale>this.smallWScale;
//				if(ret.status==false){
//					ret.msg="高宽比不匹配";
//					this.failInfos.push({index:this._tryCount,msg:ret.msg});
//					return ret;
//				}
//			}
			var rows = roof.rows;
			var cols = roof.cols;
			if(banMap){
				if(row==rows-1){
					var leftBanTileInfo = banMap[col][row];
					var rightBanTileInfo = banMap[col+1][row];
					if(!leftBanTileInfo||!leftBanTileInfo.tile||!rightBanTileInfo||!rightBanTileInfo.tile){
						ret.status=false;
						ret.msg="没有板瓦，无法铺设";
						ret.type="noBanTileFail";
						return ret;
					}
					var dis = leftBanTileInfo.tile.distance(rightBanTileInfo.tile);
					if(dis>8){
//						debugger;
					}
					var sigma4=2*this.thicknessSigma+2*rightBanTileInfo.tile.thicknessSigma;
					if(dis<this.bigNWidth+sigma4){
//					if(dis<=(this.bigNWidth)){
						this.banLeftRightDistance = dis;
						return ret;
					}else{
						ret.status=false;
						ret.msg="C_W_n^li < or = ((P_left_W_n+1^le ﹣P_left_W_n+1^si)/2 + (P_right_W_n+1^le ﹣P_right_W_n+1^le si)/2)";
						ret.type="bigNWidthFail";
						this.failInfos.push({index:this._tryCount,msg:ret.msg});
						return ret;
					}
					return ret;
				}else{
					var leftBanTileInfo = banMap[col][row+1];
					var rightBanTileInfo = banMap[col+1][row+1];
					if(!leftBanTileInfo||!leftBanTileInfo.tile||!rightBanTileInfo||!rightBanTileInfo.tile){
						ret.status=false;
						ret.msg="没有板瓦，无法铺设";
						ret.type="noBanTileFail";
						return ret;
					}
					var dis = leftBanTileInfo.tile.distance(rightBanTileInfo.tile);
//					if(dis>8){
//						debugger;
//					}
					var sigma4=2*this.thicknessSigma+2*rightBanTileInfo.tile.thicknessSigma;
					if(dis<this.dingNWidth+sigma4){
//					if(dis<=(this.dingNWidth)){
						this.banLeftRightDistance = dis;
						return ret;
					}else{
						ret.status=false;
						ret.msg="C_W_n^si < or = ((P_left_W_n+1^le ﹣P_left_W_n+1^si)/2 + (P_right_W_n+1^le ﹣P_right_W_n+1^le si)/2)";
						ret.type="smallNWidthFail";
						this.failInfos.push({index:this._tryCount,msg:ret.msg});
						return ret;
					}
				}
			}
			return ret;
		}
		return ret;
	}
	/**
	 * Pan tile：横向两瓦之间小头距离
	 */
	this.distance = function(tile){
		var halfdis1 = this.halfDistance();
		var halfdis2 = tile.halfDistance();
		var dis = halfdis1+halfdis2;
		
		return dis;
	}
	this.halfDistance = function(){
		var halfdis1 = (this.bigWWidth-this.smallNWidth)/2;
		return halfdis1;
	}
	
	/**
	 * 竖向之间两瓦重叠长度
	 */
	this.computeOverlapLength = function(nextTile){

		var aTile;
		var bTile;
		var α;
		if(this.type==Tile.BANWA){
			aTile = this;
			bTile = nextTile;
			α=Math.PI-bTile.α;
			var x = aTile.bigNWidth;
			var y = bTile.smallWWidth;
			var l1=Math.overlap(x,y,α);
			if(l1<0){
				l1=bTile.length;
			}
			
			var alength = aTile.length*Math.sin(α);
			x = bTile.smallNWidth;
			y = aTile.smallNWidth;
			α=Math.PI-aTile.α;
			var l_l = Math.overlap(x,y,α);
			var l2 = alength-l_l;
			if(l2<0){
				this.overlapLength=l1;
				return ;
			}
			var len =Math.min(l1,l2);
			this.overlapLength=len;
		}else{
			aTile = nextTile;
			bTile = this;
			α=Math.PI-bTile.α;
			var x = aTile.bigNWidth;
			var y = bTile.smallWWidth;
			var l1=Math.overlap(x,y,α);
			if(l1<0){
				l1=bTile.length;
			}
			
			var alength = aTile.length*Math.sin(α);
			x = bTile.smallNWidth;
			y = aTile.smallNWidth;
			α=Math.PI-aTile.α;
			var l_l = Math.overlap(x,y,α);
			var l2 = alength-l_l;
			if(l2<0){
				l2=bTile.length;
			}
			this.overlapLength=Math.min(l1,l2);
		}
	}
	this.getFailInfoString=function(){
		if(this.failInfos&&this.failInfos.length>0){
			var map = {};
			for(var i=0;i<this.failInfos.length;i++){
				var info = this.failInfos[i];
				var msg = info.msg;
				if(map[msg]==undefined){
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
	this.getGroupName=function(){
		return TileCreator.getGroupName(this.bigGroup,this.smallGroup);
	}
	this.isDiscard = function(creator){
		if(this.bigWWidth<this.smallWWidth){
			return true;
		}
		var bigGroup = creator.getGroupNum("bigWWidth",this.bigWWidth);
		if(bigGroup==-1){
			return true;
		}
		var smallGroup = creator.getGroupNum("smallWWidth",this.smallWWidth);
		if(smallGroup==-1){
			return true;
		}
//		if(this.type ==Tile.BANWA&&bigGroup==0){
//			return true;
//		}
//
//		if(this.type ==Tile.TONGWA&&smallGroup==TileCreator.MAX_LEVEL){
//			return true;
//		}
//		if(
//			!(bigGroup==smallGroup||smallGroup==bigGroup-1)
//		){
//			return true;
//		}
		this.bigGroup=bigGroup;
		this.smallGroup=smallGroup;

		this.bigGroupName=TileCreator.getBigGroupName(bigGroup);
//		if(this.type ==Tile.BANWA&&this.bigGroupName=="D"){
//			return true;
//		}
		this.smallGroupName=TileCreator.getSmallGroupName(smallGroup);
//		if(this.type ==Tile.TONGWA&&this.smallGroupName=="a"){
//			return true;
//		}
		
	}
	this.toString=function(noType){
		var string=[];
		if(!noType){
			string.push(this.type==Tile.BANWA?"Pan tile":"Cover tile");
		}

		
		string.push("Group:"+this.getGroupName()+",Level："+TileCreator.getGroupLevel(this.getGroupName()));
//		if(this.type==Tile.BANWA){
			string.push("The width of exterior side of smaller ends:"+this.smallWWidth.toFixed(2));
			string.push("The width of interior side of smaller ends:"+this.smallNWidth.toFixed(2));
			if(this.type ==Tile.TONGWA){
				string.push("The width of interior side of rivet:"+this.dingNWidth.toFixed(2));
			}
//			string.push("高："+this.smallWHeight.toFixed(2));
//			string.push("高宽比（外）："+this.smallWScale.toFixed(2));
//			string.push("高宽比（内）："+this.smallNScale.toFixed(2));
			string.push("The width of exterior side of larger ends:"+this.bigWWidth.toFixed(2));
//			string.push("高："+this.bigWHeight.toFixed(2));
//			string.push("高宽比（外）："+this.bigWScale.toFixed(2));
//			string.push("高宽比（内）："+this.bigNScale.toFixed(2));
//		}else if(this.type ==Tile.TONGWA){
//			string.push("大头内宽:"+this._bigNWidth.toFixed(2));
//			string.push("The width of exterior side of smaller ends:"+this._smallWWidth.toFixed(2));
//		}
		string.push("Thickness："+this.thickness.toFixed(2));
		string.push("Length："+this.length);
//		string.push("延展角度："+Math.rad2deg(this.α).toFixed(2)+"°");
//		if(this.isDiscard==true){
//			string.push("Status："+"<span class='red'>"+this.discordMsg+"</span>");
//		}else{
			if(this.noUse==true&&this._tryCount==0){
				string.push("Status：<span style='color:#b3b300;'>Not used,Not Attempt</span>");
			}else{
				string.push("Status："+(this.noUse==true?"<span class='red'>Not used</span>":"Used"));
			}
//		}
		string.push("Attempt times："+this._tryCount);
		var failsInfos = this.getFailInfoString();
		if(failsInfos){
			string.push(failsInfos);
		}
		return string.join("<br/>");
	}
}
Tile.BANWA="ban";
Tile.TONGWA="tong";
Tile.TONGWA_FAIL_TYPES=["C_W_n+1^li < or = C_W_n^se","C_W_n^li < or = ((P_left_W_n+1^le ﹣P_left_W_n+1^si)/2 + (P_right_W_n+1^le ﹣P_right_W_n+1^le si)/2)","C_W_n^si < or = ((P_left_W_n+1^le ﹣P_left_W_n+1^si)/2 + (P_right_W_n+1^le ﹣P_right_W_n+1^le si)/2)"];
Tile.create = function(creator,type){
	var tile = new Tile(type);
	var info = creator.random(type);
	$.extend(tile,info);
	if(tile.isDiscard(creator)){
		return undefined;
	}
	if(tile.bigNWidth){
		tile.bigWWidth=tile.bigNWidth+tile.thickness*2;
	}
	
	if(tile.bigWWidth){
		tile.bigNWidth=tile.bigWWidth-tile.thickness*2;
	}
	
	var a = tile.smallWWidth;
	var b = tile.bigWWidth;
	var c = tile.length;
	tile.α=Math.PI-Math.acos(0.5*(b-a)/c);

	if(tile.type==Tile.BANWA){
//		var a = Math.rad2deg(tile.α);
//		tile.isDiscard = !(90<=a&&a<=94);
//		if(tile.isDiscard==true){
//			tile.discordMsg="延展角度过大，不合格";
//		}
	}
//	console.log(Math.rad2deg(tile.α)+" "+tile.isDiscard+"  "+tile._isDiscard);
	if(tile.bigWHeight){
		tile.bigNHeight=tile.bigWHeight-tile.thickness*2;
	}

	if(tile.smallWHeight){
		tile.smallNHeight=tile.smallWHeight-tile.thickness*2;
	}

	if(tile.smallWWidth){
		tile.smallNWidth=tile.smallWWidth-tile.thickness*2;
	}
	var minheight=Math.min(tile.bigWHeight,tile.smallWHeight);
	var maxheight=Math.max(tile.bigWHeight,tile.smallWHeight);
	tile.bigWHeight = maxheight;
	tile.smallWHeight = minheight;

	var minheight=Math.min(tile.bigNHeight,tile.smallNHeight);
	var maxheight=Math.max(tile.bigNHeight,tile.smallNHeight);
	tile.bigNHeight = maxheight;
	tile.smallNHeight = minheight;
	if(tile.type==Tile.TONGWA){
		var w = 3/Math.tan(Math.PI-tile.α);
		var a = Math.rad2deg(Math.PI-tile.α);
		tile.dingNWidth = tile.smallNWidth+2*w;
	}
	return tile;
}
Object.defineProperties(Tile.prototype, {
	bigWScale:{
		get:function(){
			return this.bigWHeight/this.bigWWidth;
		}
	},
	bigNScale:{
		get:function(){
			return this.bigNHeight/this.bigNWidth;
		}
	},
	smallWScale:{
		get:function(){
			return this.smallWHeight/this.smallWWidth;
		}
	},
	smallNScale:{
		get:function(){
			return this.smallNHeight/this.smallNWidth;
		}
	},
	  tryCount: {
	    get: function () {
		      return this._tryCount;
		},
	  },
	  bigNWidth: {
	    get: function () {
		      return this._bigNWidth;
		},
		set:function(v){
			if(this._bigNWidth!=v){
				this._bigNWidth = v;
			}
		}
	  }, 
	  smallWWidth: {
	    get: function () {
		      return this._smallWWidth;
		},
		set:function(v){
			if(this._smallWWidth!=v){
				this._smallWWidth = v;
			}
		}
	  },
});