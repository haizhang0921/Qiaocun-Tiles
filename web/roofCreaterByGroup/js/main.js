
function bootstrap(array,count){
	count=count||1000;
	var length = array.length;
	var bigWidth = [];
	var smallWidth = [];
	for(var i=0;i<count;i++){
		var v1=array[Math.floor(Math.random()*length)];
		var v2 = array[Math.floor(Math.random()*length)];
		if(v1!=v2){
			bigWidth.push(Math.max(v1,v2));
			smallWidth.push(Math.min(v1,v2));
		}else{
			i--;
//			console.log(v1+" "+v2);
		}
	}
	return {
		bigWidth:bigWidth,
		smallWidth:smallWidth,
	};
}
	function computeWidths(){
		//大小头外宽
		var width=[20.6,29,18,20,22,26,29,26,21,21,22,18.4,18,20,17,22.7,26,23,22.4,28.8,25,24,24.6,27,22.6,17,23];
		width=[17,18,18,18.4,20,20,20.6,21,21,22,22,22.4,22.7,23,26,26,26,29,29,17,22.6,23,24,24.6,25,27,28.8,15,17,17,18,18,18,18.4,18.4,19,19,19,19,20,20,21,21,21.2,22,22,22,22.6,22.7,23,23,23,23,23,23.25,23.6,24,24,25,26,26,26,26,28,29,29];
		for(var i=0;i<5;i++){
			var widthbs=bootstrap(width);
			var bigWWidth=widthbs.bigWidth;
			var mean = Math.mean(bigWWidth);
			var variance = Math.variance(bigWWidth);
			console.log("bigWWidth-> mean:"+mean+",variance:"+variance);
			var smallWWidth=widthbs.smallWidth;

			var mean = Math.mean(smallWWidth);
			var variance = Math.variance(smallWWidth);
			console.log("smallWWidth-> mean:"+mean+",variance:"+variance);
		}

		var widthbs=bootstrap(width);
		var bigWWidth=widthbs.bigWidth;
		All_Ban.bigWWidth=bigWWidth;
		var mean = Math.mean(bigWWidth);
		var variance = Math.variance(bigWWidth);
		console.log("bigWWidth-> mean:"+mean+",variance:"+variance);
		
		var smallWWidth=widthbs.smallWidth;
		All_Ban.smallWWidth=smallWWidth;

		var mean = Math.mean(smallWWidth);
		var variance = Math.variance(smallWWidth);
		console.log("smallWWidth-> mean:"+mean+",variance:"+variance);
	}
	function computeTongWidths(){
		var width=[8,9.8,11.2,10.4,8.8,10.6,9.5,5.6,9.4,10,10.6,10.5,10,10.6,12,11,12.6,11,10.4,12,10.7,10,11.6,9.2,10.2,9.8,11,9,7,9,9,9,11.2,10.4,8,11,10,10,9,13,10,13,14,13.6,13,13,12,12,11,13.4,12,11,10.4,12,11,14,13.1,10.7,11.2,13.6,15,10.8,12.1,13.6,13.4,12,14,12.4,11.6,13,13,10.6,11.3,13,12.6,17.4,15,10.9,12,11,11,13.6,12,14,11,16.4,12.6,12,12,9.6,11,9,13,12.6,12.8,13,14,12.4,14,10];
		console.log("筒瓦大小头bootstrap处理5次，开始……");
		for(var i=0;i<5;i++){
			var widthbs=bootstrap(width);
			var bigWWidth=widthbs.bigWidth;
			var mean = Math.mean(bigWWidth);
			var variance = Math.variance(bigWWidth);
			console.log("第"+(i+1)+"次处理");
			console.log("Cover tile：大头外宽-> mean:"+mean+",variance:"+variance);
			var smallWWidth=widthbs.smallWidth;

			var mean = Math.mean(smallWWidth);
			var variance = Math.variance(smallWWidth);
			console.log("Cover tile：小头外宽-> mean:"+mean+",variance:"+variance);
		}
		console.log("筒瓦大小头bootstrap处理，完成！");

		var widthbs=bootstrap(width);
		var bigWWidth=widthbs.bigWidth;
		var mean = Math.mean(bigWWidth);
		var variance = Math.variance(bigWWidth);
		data.Tong={};
		data.Tong.bigWWidth_bootstrap={
				mean:mean,	
				variance:variance
		};

		var smallWWidth=widthbs.smallWidth;

		var mean = Math.mean(smallWWidth);
		var variance = Math.variance(smallWWidth);
		data.Tong.smallWWidth_bootstrap={
				mean:mean,	
				variance:variance
		};
	}
function init(){
	$("#chart").width($(window).width()*0.8);
	$("#chart").height($(window).height()*0.8);
	computeTongWidths();
	computeWidths();
	$(document).click(function(e){
		if($(e.target).hasClass("roof-tile")||$(e.target).hasClass("tile")){
			return;
		}
		layer.closeAll('tips');
	});
	var options ={
		ban:{},
		tong:{}
	};
	for(var key in All_Ban){
		var opt=options.ban[key]={};
		
		opt.mean = Math.mean(All_Ban[key]);
		opt.variance = Math.variance(All_Ban[key]);
	}
	
	for(var key in All_Tong){
		var opt=options.tong[key]={};
		
		opt.mean = Math.mean(All_Tong[key]);
		opt.variance = Math.variance(All_Tong[key]);
	}
//	console.log(options);
	CommonUtil.setObject("prototypes",options);
}
var roof;
function analysis(){
	layer.closeAll();
	var options = CommonUtil.getObject("prototypes");
//	console.log(options);
	
	$(".info").empty();
	var rows = options.config.rows;
	var cols = options.config.cols;
	$(".info").append('<span class="name">Pan tile：</span>');
	$(".info").append('<br/>');
	$(".info").append('<span class="value">'+rows+' rows，'+(cols)+' columns</span>');
	$(".info").append('<br/>');
	$(".info").append('<span class="value">Demand：'+(2*rows*(cols))+'</span>');
	$(".info").append('<br/>');
	$(".info").append('<br/>');
	$(".info").append('<span class="name">Cover tile：</span>');
	$(".info").append('<br/>');
	$(".info").append('<span class="value">'+rows+' rows，'+(cols-1)+' columns</span>');
	$(".info").append('<br/>');
	$(".info").append('<span class="value">Demand：'+(2*rows*(cols-1))+'</span>');
	
	
	if(!roof)roof = new Roof();
	
	roof.createPools(options);

	$(".banPool").empty();
	var banTiles = roof.banPool.allTiles;
	$(".banPoolCount").html(" The total number:"+banTiles.length+"");
	for(var i=0;i<banTiles.length;i++){
		$(".banPool").append(createTileDiv((i+1),banTiles[i]));
	}
	
	$(".tongPool").empty();
	var tongTiles = roof.tongPool.allTiles;
	$(".tongPoolCount").html(" The total number:"+tongTiles.length+"");
	for(var i=0;i<tongTiles.length;i++){
		$(".tongPool").append(createTileDiv((i+1),tongTiles[i]));
	}
	
	roof.run(function(tileInfo){
		var tile = tileInfo.tile;
		if(tile){
			$('.tile_'+tile.type+'_'+tile.index).removeClass("tile-nouse");
		}
	});

	$(".banPoolUsed").html("Used:"+(roof.banPool.allTiles.length-roof.banPool.tiles.length)+"");
	$(".banPoolSurplus").html("Remaining:"+roof.banPool.tiles.length+"");
	

	$(".tongPoolUsed").html("Used:"+(roof.tongPool.allTiles.length-roof.tongPool.tiles.length)+"");
	$(".tongPoolSurplus").html("Remaining:"+roof.tongPool.tiles.length+"");
	
	roof.createFaceA($(".roofA"),{
		height:120,
		banWidth:90,
		tongWidth:70
	},createRoofTileDiv);
	
	roof.createFaceB($(".roofB"),{
		height:120,
		banWidth:90,
		tongWidth:70
	},createRoofTileDiv);
	

	var visible = $('.ban-tile-showbt').is(":checked");
	if(visible){
		$('.roof-ban-tile').show();
	}else{
		$('.roof-ban-tile').hide();
	}
	var visible = $('.tong-tile-showbt').is(":checked");
	if(visible){
		$('.roof-tong-tile').show();
	}else{
		$('.roof-tong-tile').hide();
	}
}
var simulateCharts;
function showSimulateCharts(){
	if(!simulateCharts){
		simulateCharts=new SimulateCharts();
	}
	simulateCharts.show();
}
$(function(){
	init();
});

function createRoofTileDiv(type,name,tileInfo,class_){
	var html=tileInfo.toSimpleString();
	var div=$('<div class="roof-tile '+class_+' roof-'+type+'-tile">'+html+'</div>');
	div.click(function(){
		var tips=tileInfo.toString();
		layer.tips(tips, this,{
			  tips: [1, '#3595CC'],
			  time: 40000000
		});
	});
	return div;
}
function updateShow(checkbox,type){
	var visible = $(checkbox).is(":checked");
	if(visible){
		$('.roof-'+type+'-tile').show();
	}else{
		$('.roof-'+type+'-tile').hide();
	}
}
function createTileDiv(name,tile){
	var isDiscard = "";
	if(tile.isDiscard==true){
		isDiscard=" discard";
	}
	var div=$('<div class="tile tile_'+tile.type+' tile_'+tile.type+'_'+tile.index+' '+isDiscard+' tile-nouse tile-trycount">'+name+'</div>');
	div.click(function(){
		layer.tips(tile.toString(), this,{
			  tips: [1, '#3595CC'],
			  time: 40000000
		});
	});
	return div;
}

