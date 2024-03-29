var Roof=(function(){
	var Roof = function(){
		this.use={
				scale:false,
				multiple:1.5,
				maxTryCount:5
		};
		this.createPools = function(options){
			this.options=options;
			$.extend(this.use,options.use);
			var multiple = this.use.multiple;
			var rows = options.config.rows;
			var cols = options.config.cols;
			this.rows = rows;
			this.cols = cols;
			var creator = new TileCreator(options.ban);
			this.banPool = new TilePool({
				type:Tile.BANWA,
				creator:creator
			});
			this.banPool.maxTryCount = this.use.maxTryCount;
			this.banPool.create(Math.ceil(rows*(cols)*2*(multiple)));
//			console.log(this.banPool.tiles);
			
			var creator = new TileCreator(options.tong);
			this.tongPool = new TilePool({
				type:Tile.TONGWA,
				creator:creator
			});
			this.tongPool.create(Math.ceil(rows*(cols-1)*2*(multiple)));
			this.tongPool.maxTryCount = this.use.maxTryCount;
//			console.log(this.tongPool.tiles);
		}
		this.runBan = function(type,banMap,col,row){
			var rows = this.options.config.rows;
			var tileCol = banMap[col];
			if(!tileCol){
				tileCol=banMap[col]=new Array(rows);
			}
			var oldTileInfo=tileCol[row];
			if(oldTileInfo&&oldTileInfo.replaceCount>0){
				oldTileInfo.isStop = true;
				oldTileInfo.row=row;
				oldTileInfo.col=col;
				oldTileInfo.type=banMap.type;
				tileCol[row]=oldTileInfo;
				return oldTileInfo;
			}
			var tileInfo;
			if(row==0){
				tileInfo=this.banPool.shift(oldTileInfo);
			}else{
				var prev = tileCol[row-1];
				if(type=="A"){
					tileInfo = this.banPool.getCanUsed(oldTileInfo,prev.tile,this,banMap,col,row,col-1);
				}else{
					tileInfo = this.banPool.getCanUsed(oldTileInfo,prev.tile,this,banMap,col,row,col+1);
				}
			}
			if(tileInfo.isStop){
				tileInfo.row=row;
				tileInfo.col=col;
				tileInfo.type=banMap.type;
				tileCol[row]=tileInfo;
				return tileInfo;
			}
			if(tileInfo&&tileInfo.tile){
				tileInfo.row=row;
				tileInfo.col=col;
				tileInfo.type=banMap.type;
				tileCol[row]=tileInfo;
			}
			return tileInfo;
		}
		this.runTong = function(type,tongMap,col,row,banMap){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			if(type=="A"){
				if(col>0){
					col = col-1;
					var tongTileCol = tongMap[col];
					if(!tongTileCol){
						tongTileCol=tongMap[col]=new Array(rows);
					}
					var oldTileInfo=tongTileCol[row];
					if(oldTileInfo&&oldTileInfo.replaceCount>0){
						oldTileInfo.isStop = true;
						oldTileInfo.row=row;
						oldTileInfo.col=col;
						oldTileInfo.type=tongMap.type;
						tongTileCol[row]=oldTileInfo;
						return oldTileInfo;
					}
					var prev = tongTileCol[row-1];
					var prevTile=null;
					if(prev){
						prevTile=prev.tile;
					}
					var tileInfo = this.tongPool.getCanUsed(oldTileInfo,prevTile,this,banMap,col,row);
					if(tileInfo&&tileInfo.isStop){
						tileInfo.row=row;
						tileInfo.col=col;
						tileInfo.type=tongMap.type;
						tongTileCol[row]=tileInfo;
						return tileInfo;
					}
					if(tileInfo&&tileInfo.tile){
						tileInfo.row=row;
						tileInfo.col=col;
						tileInfo.type=tongMap.type;
						tongTileCol[row]=tileInfo;
						return tileInfo;
					}else{
						var headFail=tileInfo.getFailCount("headFail");
						var smallNWidthFail=tileInfo.getFailCount("smallNWidthFail");
						if(headFail>=smallNWidthFail){
							var prev = tongMap[col][row-1];
							this.tongPool.backPushTile(prev.tile);
							var tileInfo =this.runTong(type,tongMap,col+1,row-1,banMap);
							if(tileInfo.isStop||!tileInfo.tile){
								tileInfo.isStop=true;
								return tileInfo;
							}else{
								var tileInfo =this.runTong(type,tongMap,col+1,row,banMap);
								if(tileInfo.isStop||!tileInfo.tile){
									tileInfo.isStop=true;
								}
								return tileInfo;
							}
						}else{
							var tileInfo=this.runBan(type,banMap,col+1,row+1);
							if(tileInfo.isStop||!tileInfo.tile){
								tileInfo.isStop=true;
								return tileInfo;
							}
							var tileInfo = this.runTong(type,tongMap,col+1,row,banMap);
							if(tileInfo.isStop||!tileInfo.tile){
								tileInfo.isStop=true;
							}
							return tileInfo;
						}
					}
				}else{
					debugger;
				}
			}else{
				if((cols-col-1)>0){
//					col = col-1;
					var tongTileCol = tongMap[col];
					if(!tongTileCol){
						tongTileCol=tongMap[col]=new Array(rows);
					}
					var oldTileInfo=tongTileCol[row];
					if(oldTileInfo&&oldTileInfo.replaceCount>0){
						oldTileInfo.isStop = true;
						oldTileInfo.row=row;
						oldTileInfo.col=col;
						oldTileInfo.type=tongMap.type;
						tongTileCol[row]=oldTileInfo;
						return oldTileInfo;
					}
					var prev = tongTileCol[row-1];
					var prevTile=null;
					if(prev){
						prevTile=prev.tile;
					}
					var tileInfo = this.tongPool.getCanUsed(oldTileInfo,prevTile,this,banMap,col,row);
					if(tileInfo.isStop){
						tileInfo.row=row;
						tileInfo.col=col;
						tileInfo.type=tongMap.type;
						tongTileCol[row]=tileInfo;
						return tileInfo;
					}
					if(tileInfo&&tileInfo.tile){
						tileInfo.row=row;
						tileInfo.col=col;
						tileInfo.type=tongMap.type;
						tongTileCol[row]=tileInfo;
						return tileInfo;
					}else{
						var headFail=tileInfo.getFailCount("headFail");
						var smallNWidthFail=tileInfo.getFailCount("smallNWidthFail");
						if(headFail>=smallNWidthFail){
							var prev = tongMap[col][row-1];
							this.tongPool.backPushTile(prev.tile);
							var tileInfo= this.runTong(type,tongMap,col,row-1,banMap);
							if(tileInfo.isStop||!tileInfo.tile){
								tileInfo.isStop=true;
								return tileInfo;
							}else{
								var tileInfo =this.runTong(type,tongMap,col,row,banMap);
								if(tileInfo.isStop||!tileInfo.tile){
									tileInfo.isStop=true;
								}
								return tileInfo;
							}
						}else{
							var tileInfo=this.runBan(type,banMap,col,row+1);
							if(tileInfo.isStop||!tileInfo.tile){
								tileInfo.isStop=true;
								return tileInfo;
							}
							var tileInfo= this.runTong(type,tongMap,col,row,banMap);
							if(tileInfo.isStop||!tileInfo.tile){
								tileInfo.isStop=true;
							}
							return tileInfo;
						}
					}
				}else{
					debugger;
				}
			}
		}
		
		//搭建某一列
		this.runOneCol=function(type,col,usedCallback){
			var banMap,tongMap;
			if(type=="A"){
				banMap=this.banMapA;
				tongMap=this.tongMapA;
			}else{
				banMap=this.banMapB;
				tongMap=this.tongMapB;
			}
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			var row=0;
			while(row<rows){
				var tileInfo=this.runBan(type,banMap,col,row);
				if(tileInfo.isStop){
					return false;
				}
				if(tileInfo&&tileInfo.tile){
					if(usedCallback)usedCallback(tileInfo);
					if(row>0){
						if((type=="A"&&col>0)||(type=="B"&&(cols-col-1)>0)){
							var tileInfo=this.runTong(type,tongMap,col,row-1,banMap);
							if(tileInfo.isStop){
								return false;
							}
							if(tileInfo&&tileInfo.tile){
								if(usedCallback)usedCallback(tileInfo);
							}
							if(row==rows-1){
								var tileInfo=this.runTong(type,tongMap,col,row,banMap);
								if(tileInfo.isStop){
									return false;
								}
								if(tileInfo&&tileInfo.tile){
									if(usedCallback)usedCallback(tileInfo);
								}
							}
						}
					}
					row++;
				}else{
					if(row>0){
						var prev = banMap[col][row-1];
						this.banPool.backPushTile(prev.tile);
						row-=1;
						continue;
					}else{
						return false;
					}
				}
			}
		}
		this.run = function(usedCallback){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			
			this.banMapA=new Array(cols);
			this.banMapA.type="A";
			this.banMapB=new Array(cols);
			this.banMapB.type="B";
			this.tongMapA=new Array(cols-1);
			this.tongMapA.type="A";
			this.tongMapB=new Array(cols-1);
			this.tongMapB.type="B";
			for(var col=0;col<cols;col++){
				this.banMapA[col]=new Array(rows);
				this.banMapB[col]=new Array(rows);
				if(col<cols-1){
					this.tongMapA[col]=new Array(rows);
					this.tongMapB[col]=new Array(rows);
				}
			}
			for(var col=0;col<cols;col++){
				var isSuccess=this.runOneCol("A",col,usedCallback);
				if(isSuccess==false){
					break;
				}
				var isSuccess=this.runOneCol("B",cols-col-1,usedCallback);
				if(isSuccess==false){
					break;
				}
			}
		}
		this.createFaceA = function(roofCont,config,createRoofTileDiv){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			roofCont.empty();
			var height = config.height;
			var banw = config.banWidth;
			var tongw = config.tongWidth;
			roofCont.height(rows*height);
			for(var row=0;row<rows;row++){
				var top=(row)*height;
				for(var col=0;col<cols;col++){
					if(!this.banMapA[col]){
						continue;
					}
					var tileInfo=this.banMapA[col][row];
					if(tileInfo){
						var div=createRoofTileDiv("ban",tileInfo.col+"_"+tileInfo.row,tileInfo,"roofA-ban-tile");
						var left=col*(banw+tongw);
						div.css({
							left:left,
							top:top
						});
						roofCont.append(div);
					}
					if(col<cols-1){
						if(!this.tongMapA[col]){
							continue;
						}
						var tileInfo=this.tongMapA[col][row];
						if(tileInfo){
							var div=createRoofTileDiv("tong",tileInfo.col+"_"+tileInfo.row,tileInfo,"roofA-tong-tile");
							var left=col*(banw+tongw)+banw;
							div.css({
								left:left,
								top:top+6
							});
							roofCont.append(div);
						}
					}
				}
			}
		}
		this.createFaceB = function(roofCont,config,createRoofTileDiv){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			roofCont.empty();
			var height = config.height;
			var banw = config.banWidth;
			var tongw = config.tongWidth;
			roofCont.height(rows*height);
			for(var row=0;row<rows;row++){
				var top=(rows-row-1)*height;
				for(var col=0;col<cols;col++){
					if(!this.banMapB[col]){
						continue;
					}
					var tileInfo=this.banMapB[col][row];
					if(tileInfo){
						var div=createRoofTileDiv("ban",tileInfo.col+"_"+tileInfo.row,tileInfo,"roofB-ban-tile");
						var left=col*(banw+tongw);
						div.css({
							left:left,
							top:top+6
						});
						roofCont.append(div);
					}
					if(col<cols-1){
						var tileInfo=this.tongMapB[col][row];
						if(tileInfo){
							var div=createRoofTileDiv("tong",tileInfo.col+"_"+tileInfo.row,tileInfo,"roofB-tong-tile");
							var left=col*(banw+tongw)+banw;
							div.css({
								left:left,
								top:top
							});
							roofCont.append(div);
						}
					}
				}
			}
		}
		
		this.chartAvgData = function(array,array2){
			var totalCount = 0;
			var count=0;
			var cols = array.length;
			var rows = array[0].length;
			var overlapTotal=0;
			var overlapCount=0;
			
			var headFailTotal=0;
			var headFailCount=0;
			

			var widthFailTotal=0;
			var widthFailCount=0;
			for(var row=0;row<rows;row++){
				for(var col=0;col<cols;col++){
					var tileInfo=array[col][row];
					count++;
					if(tileInfo){
						totalCount+=tileInfo.tryCount;
						var tile=tileInfo.tile;
						if(tile.overlapLength){
							var overlapLength = Math.min(tile.overlapLength,tile.length);
							overlapTotal+=overlapLength;
							overlapCount++;
						}
						if(tile.type==Tile.BANWA){
							headFailTotal+=tileInfo.failInfos.length;
							headFailCount++;
						}else{
							var headFails=0;
							var widthFails =0;
							for(var k=0;k<tileInfo.failInfos.length;k++){
								var failInfo = tileInfo.failInfos[k];
								if(failInfo.type=="headFail"){
									headFails++;
									headFailCount++;
								}else if(failInfo.type=="widthFail"){
									widthFails++;
									widthFailCount++;
								}
							}
							headFailTotal+=headFails;
							widthFailTotal+=widthFails;
						}
						
					}
				}
			}
			var cols = array2.length;
			var rows = array2[0].length;
			for(var row=0;row<rows;row++){
				for(var col=0;col<cols;col++){
					var tileInfo=array2[col][row];
					count++;
					if(tileInfo){
						totalCount+=tileInfo.tryCount;
						var tile=tileInfo.tile;
						if(tile.overlapLength){
							var overlapLength = Math.min(tile.overlapLength,tile.length);
							overlapTotal+=overlapLength;
							overlapCount++;
						}
						if(tile.type==Tile.BANWA){
							headFailTotal+=tileInfo.failInfos.length;
							headFailCount++;
						}else{
							var headFails=0;
							var widthFails =0;
							for(var k=0;k<tileInfo.failInfos.length;k++){
								var failInfo = tileInfo.failInfos[k];
								if(failInfo.type=="headFail"){
									headFails++;
									headFailCount++;
								}else if(failInfo.type=="widthFail"){
									widthFails++;
									widthFailCount++;
								}
							}
							headFailTotal+=headFails;
							widthFailTotal+=widthFails;
						}
					}
				}
			}
			var ret = {
				fail:totalCount/count,
				overlap:overlapTotal/overlapCount
			};
			if(headFailCount>0){
				ret.headFail = headFailTotal;
			}else{
				ret.headFail=0;
			}
			if(widthFailCount>0){
				ret.widthFail = widthFailTotal;
			}else{
				ret.widthFail=0;
			}
			return ret;
		}
		this.chartFirstRowA=function(list,getValue){
			var count = list.length/2;
			var cols = list[0].length;
			var row = 0;
			var ret = [];
			for(var col=0;col<cols;col++){
				var value = 0;
				for(var i=0;i<list.length;i+=2){
					var tileInfo=list[i][col][row];
					if(tileInfo&&tileInfo.tile){
						value=getMaxValue(value,tileInfo.tryCount);
					}else{
						value=getMaxValue(value,2000);
					}
				}
//				if(getValue){
//					value=getValue(totalCount,count);
//				}else{
//					value=totalCount/count;
//				}
				ret.push(value);
			}
			return ret;
		}
		//搭建某一列
		this.chartOneColA=function(arrayList,col,getValue){
			var count =arrayList.length/2;
			var cols = arrayList[0].length;
			var rows = arrayList[0][0].length;
			var ret = [];
			for(var row=1;row<rows;row++){
				var value = 0;
				for(var i=0;i<arrayList.length;i+=2){
					var tileInfo=arrayList[i][col][row];
					if(tileInfo&&tileInfo.tile){
						value=getMaxValue(value,tileInfo.tryCount);
					}else{
						value=getMaxValue(value,2000);
					}
				}
//				var value;
//				if(getValue){
//					value=getValue(totalCount,count);
//				}else{
//					value=totalCount/count;
//				}
				ret.push(value);
			}
			return ret;
		}
		function getMaxValue(v1,v2){
			return Math.max(v1,v2);
		}
		this.chartFirstRowB=function(list,getValue){
			var count = list.length/2;
			var cols = list[1].length;
			var row = 0;
			var ret = [];
			for(var col=cols-1;col>=0;col--){
				var value = 0;
				for(var i=1;i<list.length;i+=2){
					var tileInfo=list[i][col][row];
					if(tileInfo&&tileInfo.tile){
						value=getMaxValue(value,tileInfo.tryCount);
					}else{
						value=getMaxValue(value,2000);
					}
				}
//				var value;
//				if(getValue){
//					value=getValue(totalCount,count);
//				}else{
//					value=totalCount/count;
//				}
				ret.push(value);
			}
			return ret;
		}
		//搭建某一列
		this.chartOneColB=function(arrayList,col,getValue){
			var count =arrayList.length/2;
			var cols = arrayList[1].length;
			var rows = arrayList[1][0].length;
			var ret = [];
			for(var row=1;row<rows;row++){
				var value = 0;
				for(var i=1;i<arrayList.length;i+=2){
					var tileInfo=arrayList[i][col][row];
					if(tileInfo&&tileInfo.tile){
						value=getMaxValue(value,tileInfo.tryCount);
					}else{
						value=getMaxValue(value,2000);
					}
				}
//				var value;
//				if(getValue){
//					value=getValue(totalCount,count);
//				}else{
//					value=totalCount/count;
//				}
				ret.push(value);
			}
			return ret;
		}
		this.chartFailData = function(arrayA,arrayB){
			var cols = arrayA.length;
			var rows = arrayA[0].length;
			var lineChart=[];
			var arrayList=[arrayA,arrayB];
			var getValue = function(totalFailCount,count){
				return totalFailCount>0?0:1;
			}
			var ctileSorts =this.chartFirstRowA(arrayList,getValue);
			lineChart=lineChart.concat(ctileSorts);
//			ctileSorts =this.chartFirstRowB(arrayList,getValue);
//			lineChart=lineChart.concat(ctileSorts);
			
			for(var col=0;col<cols;col++){
				ctileSorts =this.chartOneColA(arrayList,col,getValue);
				lineChart=lineChart.concat(ctileSorts);
//				ctileSorts =this.chartOneColB(arrayList,cols-col-1,getValue);
//				lineChart=lineChart.concat(ctileSorts);
			}
			return lineChart;
		}
		this.chartAvgGridData = function(arrayList){
			var count =arrayList.length/2;
			var cols = arrayList[0].length;
			var rows = arrayList[0][0].length;
			var countRet=new Array();
			var countMin = Number.MAX_VALUE;
			var countMax = Number.MIN_VALUE;
			for(var row=0;row<rows;row++){
				for(var col=0;col<cols;col++){
					var totalCount = -1;
					var totalCount2 = -1;
					for(var i=0;i<arrayList.length;i+=2){
						var array = arrayList[i];
						var tileInfo=array[col][row];
						if(tileInfo&&tileInfo.tile){
							totalCount=getMaxValue(totalCount,tileInfo.tryCount);
						}else{
							totalCount=getMaxValue(totalCount,2000);
						}

						var array2 = arrayList[i+1];
						var tileInfo=array2[col][row];
						if(tileInfo&&tileInfo.tile){
							totalCount2=getMaxValue(totalCount2,tileInfo.tryCount);
						}else{
							totalCount2=getMaxValue(totalCount2,2000);
						}
					}

					var val2 = totalCount2;
					if(val2!=-1)countMin = Math.min(val2,countMin);
					if(val2!=-1)countMax = Math.max(val2,countMax);
					countRet.push([col,row,parseFloat(val2.toFixed(3))]);
					
					
					var val = totalCount;
					if(val!=-1)countMin = Math.min(val,countMin);
					if(val!=-1)countMax = Math.max(val,countMax);
					countRet.push([col,rows-row-1+rows,parseFloat(val.toFixed(3))]);
				}
			}
			var lineChart=[];
			var ctileSorts =this.chartFirstRowA(arrayList);
			lineChart=lineChart.concat(ctileSorts);
			ctileSorts =this.chartFirstRowB(arrayList);
			lineChart=lineChart.concat(ctileSorts);
			
			for(var col=0;col<cols;col++){
				ctileSorts =this.chartOneColA(arrayList,col);
				lineChart=lineChart.concat(ctileSorts);
				ctileSorts =this.chartOneColB(arrayList,cols-col-1);
				lineChart=lineChart.concat(ctileSorts);
			}
			
			if(countMin==countMax){
				countMax=countMin+1;
			}
			if(countMax==0||countMax==Number.MIN_VALUE){
				countMax=1;
			}
			var ret = {
				lineData:lineChart,
				count:countRet,
				countMin:countMin,
				countMax:countMax,
			};
			return ret;
		}
		
	}
	
	return Roof;
})();