var Roof=(function(){
	var Roof = function(){
		this.use={
				scale:false,
				multiple:1.5
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
			this.banPool.create(Math.ceil(rows*(cols)*2*(multiple)));
//			console.log(this.banPool.tiles);
			
			var creator = new TileCreator(options.tong);
			this.tongPool = new TilePool({
				type:Tile.TONGWA,
				creator:creator
			});
			this.tongPool.create(Math.ceil(rows*(cols-1)*2*(multiple)));
//			console.log(this.tongPool.tiles);
		}
		//搭建靠近屋檐的第一行
		this.runFirstRowA=function(map,pool,usedCallback,banMap){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			var row = 0;
			var colCount = pool.type==Tile.TONGWA?(cols-1):cols;
			for(var col=0;col<colCount;col++){
				var tileCol = map[col];
				if(!tileCol){
					tileCol=map[col]=new Array(rows);
				}
				var tileInfo;
				if(pool.type==Tile.TONGWA){
					tileInfo = pool.getCanUsed(null,this,banMap,col,row,col-1);
				}else{
					tileInfo=pool.shift();
				}
				if(tileInfo){
					tileInfo.row=row;
					tileInfo.col=col;
					tileInfo.type="A";
					tileCol[row]=tileInfo;
					if(usedCallback)usedCallback(tileInfo);
				}
			}
		}
		//搭建某一列
		this.runOneColA=function(map,col,pool,usedCallback,banMap){
			var rows = this.options.config.rows;
			for(var row=1;row<rows;row++){
				var tileCol = map[col];
				if(!tileCol){
					tileCol=map[col]=new Array(rows);
				}
				var prev = tileCol[row-1];
				if(!prev.tile){
					break;
				}
				var tileInfo = pool.getCanUsed(prev.tile,this,banMap,col,row,col-1);
				if(tileInfo){
					tileInfo.row=row;
					tileInfo.col=col;
					tileInfo.type="A";
					tileCol[row]=tileInfo;
					if(usedCallback)usedCallback(tileInfo);
				}else{
					break;
				}
			}
		}
		//搭建靠近屋檐的第一行
		this.runFirstRowB=function(map,pool,usedCallback,banMap){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			var row = 0;
			var colCount = pool.type==Tile.TONGWA?(cols-1):cols;
			for(var col=colCount-1;col>=0;col--){
				var tileCol = map[col];
				if(!tileCol){
					tileCol=map[col]=new Array(rows);
				}
				var tileInfo;
				if(pool.type==Tile.TONGWA){
					tileInfo = pool.getCanUsed(null,this,banMap,col,row,col+1);
				}else{
					tileInfo=pool.shift();
				}
				if(tileInfo){
					tileInfo.row=row;
					if(pool.type==Tile.TONGWA){
						tileInfo.col=cols-col-2;
					}else{
						tileInfo.col=cols-col-1;
					}

					tileInfo.type="B";
					tileCol[row]=tileInfo;
					if(usedCallback)usedCallback(tileInfo);
				}
				
			}
		}
		//搭建某一列
		this.runOneColB=function(map,col,pool,usedCallback,banMap){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			for(var row=1;row<rows;row++){
				var tileCol = map[col];
				if(!tileCol){
					tileCol=map[col]=new Array(rows);
				}
				var prev = tileCol[row-1];
				if(!prev.tile){
					break;
				}
				var tileInfo = pool.getCanUsed(prev.tile,this,banMap,col,row,col+1);
				if(tileInfo){
					tileInfo.row=row;
					if(pool.type==Tile.TONGWA){
						tileInfo.col=cols-col-2;
					}else{
						tileInfo.col=cols-col-1;
					}
					tileInfo.type="B";
					tileCol[row]=tileInfo;
					if(usedCallback)usedCallback(tileInfo);
				}else{
					break;
				}
			}
		}
		
		this.run = function(usedCallback){
			var rows = this.options.config.rows;
			var cols = this.options.config.cols;
			
			this.banMapA=new Array(cols);
			this.runFirstRowA(this.banMapA,this.banPool,usedCallback,this.banMapA);
			this.banMapB=new Array(cols);
			this.runFirstRowB(this.banMapB,this.banPool,usedCallback,this.banMapB);
			
			for(var col=0;col<cols;col++){
				this.runOneColA(this.banMapA,col,this.banPool,usedCallback,this.banMapA);
				this.runOneColB(this.banMapB,cols-col-1,this.banPool,usedCallback,this.banMapB);
			}
//			console.log("板瓦剩余："+this.banPool.tiles.length+"个");
//			console.log(this.banPool.tiles);
//
//			console.log("--------------板瓦间距统计 start---------------");
//			for(var row=0;row<rows;row++){
//				var dises=[];
//				for(var col=1;col<cols;col++){
//					var leftBanTileInfo = this.banMapA[col-1][row];
//					var rightBanTileInfo = this.banMapA[col][row];
//					if(!leftBanTileInfo||!rightBanTileInfo){
//						continue;
//					}
//					var dis = leftBanTileInfo.tile.distance(rightBanTileInfo.tile);
//					if(dis>10){
//						console.log("dis:"+dis);
//						console.log("left:");
//						console.log(leftBanTileInfo.tile.toString().replaceAll("<br/>","\n"));
//						console.log("right:");
//						console.log(rightBanTileInfo.tile.toString().replaceAll("<br/>","\n"));
//					}
//					dises.push(dis);
//				}
//				console.log(dises.join(","));
//			}
//			console.log("--------------板瓦间距统计 end---------------");
//			
//			
			this.tongMapA=new Array(cols-1);
			this.runFirstRowA(this.tongMapA,this.tongPool,usedCallback,this.banMapA);
			this.tongMapB=new Array(cols-1);
			this.runFirstRowB(this.tongMapB,this.tongPool,usedCallback,this.banMapB);
			for(var col=0;col<cols-1;col++){
				this.runOneColA(this.tongMapA,col,this.tongPool,usedCallback,this.banMapA);
				this.runOneColB(this.tongMapB,cols-col-2,this.tongPool,usedCallback,this.banMapB);
			}
//			console.log("筒瓦剩余："+this.tongPool.tiles.length+"个");
//			console.log(this.tongPool.tiles);
//			console.log(this.tongMap);
			
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
					if(tileInfo){
						if(tileInfo.tryCount>0){
							value=getMaxValue(value,tileInfo.tryCount);
						}
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
					if(tileInfo){
						if(tileInfo.tryCount>0){
							value=getMaxValue(value,tileInfo.tryCount);
						}
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
					if(tileInfo){
						if(tileInfo.tryCount>0){
							value=getMaxValue(value,tileInfo.tryCount);
						}
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
					if(tileInfo){
						if(tileInfo.tryCount>0){
							value=getMaxValue(value,tileInfo.tryCount);
						}
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
			ctileSorts =this.chartFirstRowB(arrayList,getValue);
			lineChart=lineChart.concat(ctileSorts);
			
			for(var col=0;col<cols;col++){
				ctileSorts =this.chartOneColA(arrayList,col,getValue);
				lineChart=lineChart.concat(ctileSorts);
				ctileSorts =this.chartOneColB(arrayList,cols-col-1,getValue);
				lineChart=lineChart.concat(ctileSorts);
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
					var totalCount = 0;
					var totalCount2 = 0;
					for(var i=0;i<arrayList.length;i+=2){
						var array = arrayList[i];
						var tileInfo=array[col][row];
						if(tileInfo){
							if(tileInfo.tryCount>0){
								totalCount=getMaxValue(totalCount,tileInfo.tryCount);
							}
						}else{
							totalCount=getMaxValue(totalCount,2000);
						}

						var array2 = arrayList[i+1];
						var tileInfo=array2[col][row];
						if(tileInfo){
							if(tileInfo.tryCount>0){
								totalCount2=getMaxValue(totalCount2,tileInfo.tryCount);
							}
						}else{
							totalCount2=getMaxValue(totalCount2,2000);
						}
					}

					var val2 = totalCount2;
					if(val2>0)countMin = Math.min(val2,countMin);
					if(val2>0)countMax = Math.max(val2,countMax);
					countRet.push([col,row,parseFloat(val2.toFixed(3))]);
					
					
					var val = totalCount;
					if(val>0)countMin = Math.min(val,countMin);
					if(val>0)countMax = Math.max(val,countMax);
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