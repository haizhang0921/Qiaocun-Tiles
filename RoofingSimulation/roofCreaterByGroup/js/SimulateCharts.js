function SimulateCharts(){
	this.banRet=[];
	this.banPoolTiles=[];
	this.tongRet=[];
	this.tongPoolTiles=[];
	var that = this;
	var totalHeads=['The maximum number of replacement of pan tiles', 'The maximum number of replacement of cover tiles'];
	this.banFailCountDataList=[];
	this.tongFailCountDataList=[];
	this.totalOptions = {
			  tooltip: {
			    trigger: 'axis'
			  },
			  legend: {
//			    orient: 'vertical',
			    data: totalHeads
			  },
			  grid: {
			    left: '3%',
			    right: '4%',
			    bottom: '3%',
			    containLabel: true
			  },
			  toolbox: {
			    feature: {
			      dataView: {},
		          myDownExcel: {
		                show: true,
		                title: 'Download data',
		                icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADG0lEQVRYR8WXW4hNYRTHf2tvIlEkJUqREsnZQ4rURHEOijeevSiJ4mn2eMGLOTygiQdRyqPLEzLnnAeXiBhjyz0TuUUuQ26ROWdpfedsYZzLjNOcXfvs9vf9W+t31vet9e0llK7gTLiQIaxEmQaMBHwFX+xW9VXEtzEEzz0VH9SH4rhqUevmnVZLGtPFWt6D1w16MEqmD5lrsZ8gE25D2BrDDMpT2R6l0tskyIZrgMMlp8fUkyPyQz/3gfAd4ELyLKoI6HPWzZfT+awHVsUaA+gE5lAiKmc8yIZm2AFEy9LnKug0Nl5Ol8i0tovoRoF9BtADjKnBcN0AgmxoETiqQocE2ZYCiAwqgG344lJdsAj8AIY0COCSAXwDhjUCQOGKAXwBRjQCALgmQS78iDKqhvSqTxrG6eNzVlS7JMi1vkd19KAUn75ObtoSvAXGNgjgtgSZ8DXCuJr3QD1JhbuSyIQvRRjfIIAHtgTPgYn1AhA4qcozxNX8ale3ATwBJtULwB/uTbjevOPlr7OjIoI+tlL8CGRyvQCiZLp4xMeHV+UYPLUIPASmNgjghRWi++4rqPoxWzwNq1z9iYAqrwzgDsqMmithHQFQ3tgS3AJmVvtntc73JwLAOwOIgEStDqrp+gUg8kGaMi3XVWT2APfAR/FkPr06XT0OWEnvA6BsiVLptqZsa4eiqT/+gPDJInAVmDswAP0QJXeOMaOzMltmeqKHo2Tb3DgNRQv7b6R2HXfvuZY9qGz6K4JfJZENLwvMGxiAmZPO2Onvxmd3hFO7lqa7bawp17JRVdr/sXzfLQIXgQUDB3Bm33pSaO5asuve707mdB4Y2tvzuF1gXZm902sA54Hm/wRw9kVl1Y1Umwt5Ihc2SYG9CM3lN66qAZwGlqsnK24ubjtVTlxjacX6iyKNO4zGVc4a7bFCtBtlM3AsSqZX/zdAtTz9Mw2uimtK43bK6Av8u+uJW7N+OagqXtv45jRmLDWpG4ApYB+pknctpt3WN9m7ah6loJB3vZSb1+Jc/K4UbFxU8yqSd9qSHRW+ekq35jkR940/Afdd773vrE+AAAAAAElFTkSuQmCC',
		                onclick: function (){
		                    that.myDownExcel();
		                }
		          },
			      saveAsImage: {}
			    }
			  },
			  xAxis: {
			    type: 'category',
			    boundaryGap: false,
			    data: []
			  },
			  yAxis: {
			    type: 'value'
			  },
			  dataZoom: [
			    {
			      type: 'inside',
			      start: 0,
			      end: 20
			    },
			    {
			      start: 0,
			      end: 20
			    }
			  ],
			  series: [
			    {
			      name: 'The maximum number of replacement of pan tiles',
			      type: 'line',
			      smooth: true,
			      data: []
			    },
			    {
			      name: 'The maximum number of replacement of cover tiles',
			      type: 'line',
			      smooth: true,
			      data: []
			    },
//			    {
//			      name: '板瓦大小头不匹配',
//			      type: 'line',
//			      smooth: true,
//			      data: []
//			    },
//			    {
//			      name: '筒瓦失败平均数',
//			      type: 'line',
//			      smooth: true,
//			      data: []
//			    },
//			    {
//			      name: '筒瓦平均重叠长度',
//			      type: 'line',
//			      smooth: true,
//			      data: []
//			    },
//			    {
//			      name: '筒瓦大小头不匹配',
//			      type: 'line',
//			      smooth: true,
//			      data: []
//			    },
//			    {
//			      name: '筒瓦宽度不匹配',
//			      type: 'line',
//			      smooth: true,
//			      data: []
//			    }
			  ]
	};
	this.dynOptions = {
			  tooltip: {
			    trigger: 'axis'
			  },
			  legend: {
//			    orient: 'vertical',
			    data: ["The maximum number of failure of pan tiles","The maximum number of failure of cover tiles"]
			  },
			  grid: {
			    left: '3%',
			    right: '4%',
			    bottom: '3%',
			    containLabel: true
			  },
			  toolbox: {
			    feature: {
			      dataView: {},
		          myDownExcel: {
		                show: true,
		                title: 'Download data',
		                icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADG0lEQVRYR8WXW4hNYRTHf2tvIlEkJUqREsnZQ4rURHEOijeevSiJ4mn2eMGLOTygiQdRyqPLEzLnnAeXiBhjyz0TuUUuQ26ROWdpfedsYZzLjNOcXfvs9vf9W+t31vet9e0llK7gTLiQIaxEmQaMBHwFX+xW9VXEtzEEzz0VH9SH4rhqUevmnVZLGtPFWt6D1w16MEqmD5lrsZ8gE25D2BrDDMpT2R6l0tskyIZrgMMlp8fUkyPyQz/3gfAd4ELyLKoI6HPWzZfT+awHVsUaA+gE5lAiKmc8yIZm2AFEy9LnKug0Nl5Ol8i0tovoRoF9BtADjKnBcN0AgmxoETiqQocE2ZYCiAwqgG344lJdsAj8AIY0COCSAXwDhjUCQOGKAXwBRjQCALgmQS78iDKqhvSqTxrG6eNzVlS7JMi1vkd19KAUn75ObtoSvAXGNgjgtgSZ8DXCuJr3QD1JhbuSyIQvRRjfIIAHtgTPgYn1AhA4qcozxNX8ale3ATwBJtULwB/uTbjevOPlr7OjIoI+tlL8CGRyvQCiZLp4xMeHV+UYPLUIPASmNgjghRWi++4rqPoxWzwNq1z9iYAqrwzgDsqMmithHQFQ3tgS3AJmVvtntc73JwLAOwOIgEStDqrp+gUg8kGaMi3XVWT2APfAR/FkPr06XT0OWEnvA6BsiVLptqZsa4eiqT/+gPDJInAVmDswAP0QJXeOMaOzMltmeqKHo2Tb3DgNRQv7b6R2HXfvuZY9qGz6K4JfJZENLwvMGxiAmZPO2Onvxmd3hFO7lqa7bawp17JRVdr/sXzfLQIXgQUDB3Bm33pSaO5asuve707mdB4Y2tvzuF1gXZm902sA54Hm/wRw9kVl1Y1Umwt5Ihc2SYG9CM3lN66qAZwGlqsnK24ubjtVTlxjacX6iyKNO4zGVc4a7bFCtBtlM3AsSqZX/zdAtTz9Mw2uimtK43bK6Av8u+uJW7N+OagqXtv45jRmLDWpG4ApYB+pknctpt3WN9m7ah6loJB3vZSb1+Jc/K4UbFxU8yqSd9qSHRW+ekq35jkR940/Afdd773vrE+AAAAAAElFTkSuQmCC',
		                onclick: function (){
		                    that.myDownExcel();
		                }
		          },
			      saveAsImage: {}
			    }
			  },
			  xAxis: {
			    type: 'category',
			    boundaryGap: false,
			    data: []
			  },
			  yAxis: {
			    type: 'value'
			  },
			  dataZoom: [
			    {
			      type: 'inside',
			      start: 0,
			      end: 20
			    },
			    {
			      start: 0,
			      end: 20
			    }
			  ],
			  series: [
			    {
			      name: 'The maximum number of failure of pan tiles',
			      type: 'line',
			      smooth: true,
			      data: []
			    },
			    {
				      name: 'The maximum number of failure of cover tiles',
				      type: 'line',
				      smooth: true,
				      data: []
				 },
			  ]
	};
	function createHeadMapOption(name){
		var option={
			  tooltip: {
			    position: 'top'
			  },
			  grid: {
			    left: '3%',
			    right: '4%',
			    bottom: '3%',
			    containLabel: true
			  },
			  toolbox: {
			    feature: {
		          myDownExcel: {
		                show: true,
		                title: 'Download data',
		                icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADG0lEQVRYR8WXW4hNYRTHf2tvIlEkJUqREsnZQ4rURHEOijeevSiJ4mn2eMGLOTygiQdRyqPLEzLnnAeXiBhjyz0TuUUuQ26ROWdpfedsYZzLjNOcXfvs9vf9W+t31vet9e0llK7gTLiQIaxEmQaMBHwFX+xW9VXEtzEEzz0VH9SH4rhqUevmnVZLGtPFWt6D1w16MEqmD5lrsZ8gE25D2BrDDMpT2R6l0tskyIZrgMMlp8fUkyPyQz/3gfAd4ELyLKoI6HPWzZfT+awHVsUaA+gE5lAiKmc8yIZm2AFEy9LnKug0Nl5Ol8i0tovoRoF9BtADjKnBcN0AgmxoETiqQocE2ZYCiAwqgG344lJdsAj8AIY0COCSAXwDhjUCQOGKAXwBRjQCALgmQS78iDKqhvSqTxrG6eNzVlS7JMi1vkd19KAUn75ObtoSvAXGNgjgtgSZ8DXCuJr3QD1JhbuSyIQvRRjfIIAHtgTPgYn1AhA4qcozxNX8ale3ATwBJtULwB/uTbjevOPlr7OjIoI+tlL8CGRyvQCiZLp4xMeHV+UYPLUIPASmNgjghRWi++4rqPoxWzwNq1z9iYAqrwzgDsqMmithHQFQ3tgS3AJmVvtntc73JwLAOwOIgEStDqrp+gUg8kGaMi3XVWT2APfAR/FkPr06XT0OWEnvA6BsiVLptqZsa4eiqT/+gPDJInAVmDswAP0QJXeOMaOzMltmeqKHo2Tb3DgNRQv7b6R2HXfvuZY9qGz6K4JfJZENLwvMGxiAmZPO2Onvxmd3hFO7lqa7bawp17JRVdr/sXzfLQIXgQUDB3Bm33pSaO5asuve707mdB4Y2tvzuF1gXZm902sA54Hm/wRw9kVl1Y1Umwt5Ihc2SYG9CM3lN66qAZwGlqsnK24ubjtVTlxjacX6iyKNO4zGVc4a7bFCtBtlM3AsSqZX/zdAtTz9Mw2uimtK43bK6Av8u+uJW7N+OagqXtv45jRmLDWpG4ApYB+pknctpt3WN9m7ah6loJB3vZSb1+Jc/K4UbFxU8yqSd9qSHRW+ekq35jkR940/Afdd773vrE+AAAAAAElFTkSuQmCC',
		                onclick: function (){
		                    that.myDownExcel();
		                }
		          },
			      saveAsImage: {}
			    }
			  },
			  xAxis:[
				  {
				    type: 'category',
				    data: [],
				    splitArea: {
				      show: true
				    }
				  },
				  {
				    type: 'category',
				    data: [],
				    splitArea: {
				      show: false
				    }
				  }
			  ] ,
			  yAxis: {
			    type: 'category',
			    data: [],
			    splitArea: {
			      show: true
			    }
			  },
			  visualMap: {
			    min: 0,
			    max: 10,
			    calculable: true,
			    orient: 'horizontal',
			    left: 'center',
			    top: '15'
			  },
			  series: [
			    {
			      name: name,
			      type: 'heatmap',
			      data: [],
			      label: {
			        show: true
			      },
			      emphasis: {
			        itemStyle: {
			          shadowBlur: 10,
			          shadowColor: 'rgba(0, 0, 0, 0.5)'
			        }
			      }
			    }
			  ]
			};
		return option;
	}
	this.gridBanCountOptions = createHeadMapOption('Max number of replacement of P');
//	this.gridBanOverlapOptions = createHeadMapOption('板瓦每个位置重叠情况');
	this.gridTongCountOptions = createHeadMapOption('Max number of replacement of C');
//	this.gridTongOverlapOptions = createHeadMapOption('筒瓦每个位置重叠情况');
	
	this.show=function(){
		var that = this;
		if(!this.layerIndex){
			this.layerIndex =layer.open({
			  title:'The simulation results',
			  type: 1,
			  area: ['auto'],
			  offset: ['1px', '218px'],
			  skin: 'layui-layer-nobg', //没有背景色
			  shadeClose: true,
			  shade: false,
			  content: $('#SimulateChartInfo'),
			  success: function(layero, index){
			    console.log(layero, index);
			  },
			  end :function(){
				  that.layerIndex=undefined;
				  that.isStop = true;
			  }
			});
		}
		layer.title('The simulation results', this.layerIndex);
		if(!this.isInit){
			this.isInit=true;
			$(".chart .tab-item").click(function () {
                $(this).addClass("active").siblings().removeClass("active");
                $(".products .main").eq($(this).index()).show().siblings().hide();
            });
		}
		if(!this.simulateDynChart){
			this.simulateDynChart= echarts.init($("#simulateDynChart")[0],'dark');
			this.simulateDynChart.setOption(this.dynOptions);
			delete this.dynOptions.legend;
			delete this.dynOptions.yAxis;
			delete this.dynOptions.toolbox;
			delete this.dynOptions.grid;
			delete this.dynOptions.tooltip;
		}
//		if(!this.totalChart){
//			this.totalChart= echarts.init($("#simulateTotalChart")[0],'dark');
//			this.totalChart.setOption(this.totalOptions);
//			delete this.totalOptions.legend;
//			delete this.totalOptions.yAxis;
//			delete this.totalOptions.toolbox;
//			delete this.totalOptions.grid;
//			delete this.totalOptions.tooltip;
//		}

		if(!this.gridBanCountChart){
			this.gridBanCountChart= echarts.init($("#simulateGridBanCountChart")[0],'dark');
			this.gridBanCountChart.setOption(this.gridBanCountOptions);
			delete this.gridBanCountOptions.legend;
			delete this.gridBanCountOptions.toolbox;
			delete this.gridBanCountOptions.grid;
			delete this.gridBanCountOptions.tooltip;
		}
		

//		if(!this.gridBanOverlapChart){
//			this.gridBanOverlapChart= echarts.init($("#simulateGridBanOverlapChart")[0],'dark');
//			this.gridBanOverlapChart.setOption(this.gridBanOverlapOptions);
//			delete this.gridBanOverlapOptions.legend;
//			delete this.gridBanOverlapOptions.toolbox;
//			delete this.gridBanOverlapOptions.grid;
//			delete this.gridBanOverlapOptions.tooltip;
//		}

		if(!this.gridTongCountChart){
			this.gridTongCountChart= echarts.init($("#simulateGridTongCountChart")[0],'dark');
			this.gridTongCountChart.setOption(this.gridTongCountOptions);
			delete this.gridTongCountOptions.legend;
			delete this.gridTongCountOptions.toolbox;
			delete this.gridTongCountOptions.grid;
			delete this.gridTongCountOptions.tooltip;
		}

//		if(!this.gridTongOverlapChart){
//			this.gridTongOverlapChart= echarts.init($("#simulateGridTongOverlapChart")[0],'dark');
//			this.gridTongOverlapChart.setOption(this.gridTongOverlapOptions);
//			delete this.gridTongOverlapOptions.legend;
//			delete this.gridTongOverlapOptions.toolbox;
//			delete this.gridTongOverlapOptions.grid;
//			delete this.gridTongOverlapOptions.tooltip;
//		}
	}
	function clearOption(option){
		option.xAxis[0].data.length=0;
		option.xAxis[1].data.length=0;
		option.yAxis.data.length=0;
	}
	this.run = function(){
		var options = CommonUtil.getObject("prototypes");
		console.log(options);
		var cols = options.config.cols;
		var rows = options.config.rows;
		
		var tileCount=rows*cols*2;
		
		var totalCount = parseInt($(".simulateCount").val());
		$(".simulateStatus").html("Start");
		this.count=0;
		
		this.totalOptions.xAxis.data.length=0;
		for(var i=0;i<this.totalOptions.series.length;i++){
			this.totalOptions.series[i].data.length=0;
		}
		clearOption(this.gridBanCountOptions);
//		clearOption(this.gridBanOverlapOptions);
		clearOption(this.gridTongCountOptions);
//		clearOption(this.gridTongOverlapOptions);

		this.totalOptions.dataZoom[0].end=tileCount;
		this.totalOptions.dataZoom[1].end=tileCount;

		this.dynOptions.xAxis.data.length=0;

		for(var i=0;i<this.dynOptions.series.length;i++){
			this.dynOptions.series[i].data.length=0;
		}
		this.dynOptions.dataZoom[0].end=tileCount;
		this.dynOptions.dataZoom[1].end=tileCount;
		this.banFailCountDataList.length=0;
		this.tongFailCountDataList.length=0;
		
		
		for(var i=0;i<tileCount;i++){
			if(i==0){
				this.dynOptions.xAxis.data.push("The 1st");
				this.totalOptions.xAxis.data.push("The 1st");
			}else if(i==1){
				this.dynOptions.xAxis.data.push("The 2nd");
				this.totalOptions.xAxis.data.push("The 2nd");
			}else if(i==2){
				this.dynOptions.xAxis.data.push("The 3rd");
				this.totalOptions.xAxis.data.push("The 3rd");
			}else{
				this.dynOptions.xAxis.data.push("The "+(i+1)+"th");
				this.totalOptions.xAxis.data.push("The "+(i+1)+"th");
			}
		}
//		this.totalChart.setOption(this.totalOptions);
		
		this.simulateDynChart.setOption(this.dynOptions);
		
		for(var i=0;i<rows;i++){
			this.gridBanCountOptions.yAxis.data.push("B_"+i);
//			this.gridBanOverlapOptions.yAxis.data.push("B_"+i);
			
			this.gridTongCountOptions.yAxis.data.push("B_"+i);
//			this.gridTongOverlapOptions.yAxis.data.push("B_"+i);
		}

		for(var i=0;i<rows;i++){
			this.gridBanCountOptions.yAxis.data.push("A_"+(rows-1-i));
//			this.gridBanOverlapOptions.yAxis.data.push("A_"+(rows-1-i));
			
			this.gridTongCountOptions.yAxis.data.push("A_"+(rows-1-i));
//			this.gridTongOverlapOptions.yAxis.data.push("A_"+(rows-1-i));
		}

		for(var i=0;i<cols;i++){
			this.gridBanCountOptions.xAxis[0].data.push((cols-i)+"");
			this.gridBanCountOptions.xAxis[1].data.push((i+1)+"");
			
//			this.gridBanOverlapOptions.xAxis[0].data.push((cols-i)+"");
//			this.gridBanOverlapOptions.xAxis[1].data.push((i+1)+"");
			
			if(i<cols-1){
				this.gridTongCountOptions.xAxis[0].data.push((cols-i-1)+"");
				this.gridTongCountOptions.xAxis[1].data.push((i+1)+"");
				
//				this.gridTongOverlapOptions.xAxis[0].data.push((cols-i-1)+"");
//				this.gridTongOverlapOptions.xAxis[1].data.push((i+1)+"");
			}
		}
		
		this.banRet.length=0;
		this.tongRet.length=0;
		this.banPoolTiles.length=0;
		this.tongPoolTiles.length=0;
		
		this.isStop = false;
		this.runOne_(options,totalCount);
	}
	function failCountAvg(dataList){
		var ret = [];
		var tileCount = dataList[0].length;
		for(var i=0;i<tileCount;i++){
			var total=0;
			var max = Number.MIN_VALUE;
			for(var k=0;k<dataList.length;k++){
				var v = dataList[k][i];
				if(v==0){
					total++;
				} 
				max=Math.max(max,v);
			}
			ret.push(max);
		}
		return ret;
	}
	this.updateFailCountChart=function(){
		var banFailCountAvgData = failCountAvg(this.banFailCountDataList);
		var tongFailCountAvgData = failCountAvg(this.tongFailCountDataList);
		this.dynOptions.series[0].data=banFailCountAvgData;
		this.dynOptions.series[1].data=tongFailCountAvgData;
		this.simulateDynChart.setOption(this.dynOptions);
	}
	this.updateBanHeadMap=function (){
		var banAvgs = this.roof.chartAvgGridData(this.banRet);
		this.gridBanCountOptions.series[0].data=banAvgs.count;
		this.gridBanCountOptions.visualMap.min=banAvgs.countMin;
		this.gridBanCountOptions.visualMap.max=banAvgs.countMax;
		this.gridBanCountChart.setOption(this.gridBanCountOptions);
		this.totalOptions.series[0].data=banAvgs.lineData;
//		this.totalChart.setOption(this.totalOptions);
		
//		this.gridBanOverlapOptions.series[0].data=banAvgs.overlap;
//		this.gridBanOverlapOptions.visualMap.min=banAvgs.overlapMin;
//		this.gridBanOverlapOptions.visualMap.max=banAvgs.overlapMax;
//		this.gridBanOverlapChart.setOption(this.gridBanOverlapOptions);
	}
	this.updateTongHeadMap=function (){
		var avgs = this.roof.chartAvgGridData(this.tongRet);
		this.gridTongCountOptions.series[0].data=avgs.count;
		this.gridTongCountOptions.visualMap.min=avgs.countMin;
		this.gridTongCountOptions.visualMap.max=avgs.countMax;
		this.gridTongCountChart.setOption(this.gridTongCountOptions);
		this.totalOptions.series[1].data=avgs.lineData;
//		this.totalChart.setOption(this.totalOptions);
//		this.gridTongOverlapOptions.series[0].data=avgs.overlap;
//		this.gridTongOverlapOptions.visualMap.min=avgs.overlapMin;
//		this.gridTongOverlapOptions.visualMap.max=avgs.overlapMax;
//		this.gridTongOverlapChart.setOption(this.gridTongOverlapOptions);
	}
	this.runOne_=function(options,totalCount){
		this.count++;
		var rows = options.config.rows;
		var cols = options.config.cols;
		if(!this.roof)this.roof = new Roof();
		this.roof.createPools(options);
		
		this.roof.run();
		
//		this.totalOptions.xAxis.data.push(this.count+"");
//		var banAvgs = this.roof.chartAvgData(this.roof.banMapA,this.roof.banMapB);
//		this.totalOptions.series[0].data.push(banAvgs.fail.toFixed(2));
//		this.totalOptions.series[1].data.push(banAvgs.overlap.toFixed(2));
//		this.totalOptions.series[2].data.push(banAvgs.headFail.toFixed(2));
//		
//		
//		var tongAvgs = this.roof.chartAvgData(this.roof.tongMapA,this.roof.tongMapB);
//		this.totalOptions.series[3].data.push(tongAvgs.fail.toFixed(2));
//		this.totalOptions.series[4].data.push(tongAvgs.overlap.toFixed(2));
//		this.totalOptions.series[5].data.push(tongAvgs.headFail.toFixed(2));
//		this.totalOptions.series[6].data.push(tongAvgs.widthFail.toFixed(2));
		this.banPoolTiles.push(this.roof.banPool.allTiles);
		this.banRet.push(this.roof.banMapA.clone());
		this.banRet.push(this.roof.banMapB.clone());
		this.tongPoolTiles.push(this.roof.tongPool.allTiles);
		this.tongRet.push(this.roof.tongMapA.clone());
		this.tongRet.push(this.roof.tongMapB.clone());
//
//		this.totalOptions.dataZoom[0].start=Math.max(0,this.count-100);
//		this.totalOptions.dataZoom[0].end=this.count;
//		this.totalChart.setOption(this.totalOptions);
		
		var failCountData = this.roof.chartFailData(this.roof.banMapA,this.roof.banMapB);
		this.banFailCountDataList.push(failCountData);
		var failCountData = this.roof.chartFailData(this.roof.tongMapA,this.roof.tongMapB);
		this.tongFailCountDataList.push(failCountData);
		
		$(".simulateStatus").html("Completed["+this.count+"]times");

		if(this.isStop== true){
			this.updateFailCountChart();
			this.updateBanHeadMap();
			this.updateTongHeadMap();
			$(".simulateStatus").html("Stop");
			return ;
		}
		if(this.count>=totalCount){
			this.updateFailCountChart();
			this.updateBanHeadMap();
			this.updateTongHeadMap();
			$(".simulateStatus").html("Complete");
			return ;
		}
		var that = this;
		setTimeout(function(){
			that.runOne_(options,totalCount);
		},5);
	}
	function getVal(chartdata,col,row){
		for(var i=0;i<chartdata.length;i++){
			var data = chartdata[i];
			if(data[0]==col&&data[1]==row){
				var d = chartdata.splice(i, 1)[0];
				return d[2];
			}
		}
	}
	this.createHeadMapSheet = function(option){
		var chartdata = option.series[0].data.clone();
		var name = option.series[0].name;
		var xAxis = option.xAxis;
		var yAxis = option.yAxis;
		var cols = xAxis[0].data.length;
		var rows = yAxis.data.length;

		var sheetdata = [];
		var data=[""];
		for(var col=0;col<cols;col++){
			data.push(xAxis[1].data[col]);
		}
		sheetdata.push(data);
		for(var row=rows-1;row>=0;row--){
			var data=[];
			data.push(yAxis.data[row]);
			for(var col=0;col<cols;col++){
				var val = getVal(chartdata,col,row);
				data.push(val);
			}
			sheetdata.push(data);
		}

		var data=[""];
		for(var col=0;col<cols;col++){
			data.push(xAxis[0].data[col]);
		}
		sheetdata.push(data);
		return {
			name:name,
			data:sheetdata
		}
	}
	function appendFailTypeInfo(failTypeCountMap,failsMap){
		if(failsMap){
			for(var i=0;i<Tile.TONGWA_FAIL_TYPES.length;i++){
				var key=Tile.TONGWA_FAIL_TYPES[i];
				if(failsMap[key]!=undefined){
					if(failTypeCountMap[key]==undefined){
						failTypeCountMap[key]=0;
					}
					failTypeCountMap[key]=failTypeCountMap[key]+failsMap[key];
				}
			}
		}
	}
	function addInfo(mapA,mapB,tileInfoFails,index,tongTileOverlaps){
		var failTypeCountMap={
				
		};
		var cols = mapA.length;
		var rows = mapA[0].length;
		for(var col=0;col<cols;col++){
			for(var row=0;row<rows;row++){
				var tileInfo=mapA[col][row];
				if(tileInfo){
					var tile = tileInfo.tile;
					if(tile){
						tileInfoFails.push([tileInfo.tryCount,index]);
					}else{
						tileInfoFails.push([-1,index]);
					}
//					tileTryCounts.push([tile.tryCount,index]);
					if(tongTileOverlaps){
						if(tile&&tile.overlapLength){
							var overlapLength = Math.min(tile.overlapLength,tile.length);
							tongTileOverlaps.push([overlapLength,index]);
						}
					}
					if(tongTileOverlaps){
						var failsMap=tileInfo.getFailInfoMap();
						appendFailTypeInfo(failTypeCountMap,failsMap);
					}
				}else{
					tileInfoFails.push([-1,index]);
//					tileTryCounts.push([-1,index]);
				}
			}
		}
		var cols = mapB.length;
		var rows = mapB[0].length;
		for(var col=0;col<cols;col++){
			for(var row=0;row<rows;row++){
				var tileInfo=mapB[col][row];
				if(tileInfo){
					var tile = tileInfo.tile;
					if(tile){
						tileInfoFails.push([tileInfo.tryCount,index]);
					}else{
						tileInfoFails.push([-1,index]);
					}
//					tileTryCounts.push([tile.tryCount,index]);
					if(tongTileOverlaps){
						if(tile&&tile.overlapLength){
							var overlapLength = Math.min(tile.overlapLength,tile.length);
							tongTileOverlaps.push([overlapLength,index]);
						}
					}
					if(tongTileOverlaps){
						var failsMap=tileInfo.getFailInfoMap();
						appendFailTypeInfo(failTypeCountMap,failsMap);
					}
				}else{
					tileInfoFails.push([-1,index]);
//					tileTryCounts.push([-1,index]);
				}
			}
		}
		return failTypeCountMap;
	}
	function addTile(tiles,tileTryCounts,index){
		var failTypeCountMap={
				
		};
		for(var i=0;i<tiles.length;i++){
			var tile = tiles[i];
			if(tile.noUse==true&&tile.tryCount==0){
				tileTryCounts.push([-1,tile.bigWWidth,tile.smallWWidth,tile.thickness,index]);
			}else{
				tileTryCounts.push([tile.tryCount,tile.bigWWidth,tile.smallWWidth,tile.thickness,index]);
			}
			if(tile.type==Tile.TONGWA){
				var failsMap=tile.getFailInfoMap();
				appendFailTypeInfo(failTypeCountMap,failsMap);
			}
		}
		return failTypeCountMap;
	}
	this.myDownExcel=function(){
		if(this.totalOptions.xAxis.data.length==0){
			layer.msg("No data！", {icon: 5});
			return ;
		}
		layer.msg("Downloading……", {icon: 6,time: 40000000});
		var that = this;
		setTimeout(function(){
			that.myDownExcel_();
		},20);
	}
	this.myDownExcel_ = function(){
		//Failures of P in  the  pool
		var banTileInfoFails=[
			["Number of failures, -1 means no use","sequence No"]
		];
		//板瓦尝试次数
		var banTileFails=[
			["Number of attempts","width of exterior side of larger ends ","width of exterior side of smaller ends","thicknes","sequence No"]
		];
		for(var i=0;i<this.banRet.length;i+=2){
			var mapA = this.banRet[i];
			var mapB = this.banRet[i+1];
			addInfo(mapA,mapB,banTileInfoFails,(i/2)+1);
		}
		for(var i=0;i<this.banPoolTiles.length;i++){
			addTile(this.banPoolTiles[i],banTileFails,i+1);
		}

		//Failures of C in  the  pool
		var tongTileInfoFails=[
			["Number of failures, -1 means no use","sequence No"]
		];
		//筒瓦尝试次数
		var tongTileFails=[
			["Number of attempts","width of exterior side of larger ends","width of exterior side of smaller ends","thicknes","sequence No"]
		];
		//Length of the overlap of C
		var tongTileOverlaps=[
			["Length of the overlap","sequence No"]
		];
		//Failures of C in one simulation
		var titles = Tile.TONGWA_FAIL_TYPES.clone();
		titles.push("sequence No");
		var tongTileInfoFailTypes=[
			titles
		];
		//筒瓦失败分类次数
		var tongTileFailTypes=[
			titles
		];
		for(var i=0;i<this.tongRet.length;i+=2){
			var mapA = this.tongRet[i];
			var mapB = this.tongRet[i+1];
			var index = (i/2)+1;
			var failTypeCountMap=addInfo(mapA,mapB,tongTileInfoFails,index,tongTileOverlaps);
			var typeData=[];
			for(var k=0;k<Tile.TONGWA_FAIL_TYPES.length;k++){
				var key = Tile.TONGWA_FAIL_TYPES[k];
				var count = failTypeCountMap[key];
				if(count==undefined){
					typeData.push(0);
				}else{
					typeData.push(count);
				}
			}
			typeData.push(index);
			tongTileInfoFailTypes.push(typeData);
		}

		for(var i=0;i<this.tongPoolTiles.length;i++){
			var index = i+1;
			var failTypeCountMap=addTile(this.tongPoolTiles[i],tongTileFails,index);
			var typeData=[];
			for(var k=0;k<Tile.TONGWA_FAIL_TYPES.length;k++){
				var key = Tile.TONGWA_FAIL_TYPES[k];
				var count = failTypeCountMap[key];
				if(count==undefined){
					typeData.push(0);
				}else{
					typeData.push(count);
				}
			}
			typeData.push(index);
			tongTileFailTypes.push(typeData);
		}
//		var sheetdata = [
//			[""].concat(this.dynOptions.xAxis.data)
//		];
//		var length =this.banFailCountDataList.length;
//		for(var i=0;i<length;i++){
//			sheetdata.push(["第"+(i+1)+"times"].concat(this.banFailCountDataList[i]));
//		}
//		sheetdata.push(["平均值"].concat(this.dynOptions.series[0].data));
//		var data = this.dynOptions.series[0].data;
//		var total=0;
//		for(var i=0;i<data.length;i++){
//			total+=parseFloat(data[i]);
//		}
//		sheetdata.push(["总体平均值",total/data.length]);
//		var bansheet = XLSX.utils.aoa_to_sheet(sheetdata);
//		
//		var sheetdata = [
//			[""].concat(this.dynOptions.xAxis.data)
//		];
//		var length =this.banFailCountDataList.length;
//		for(var i=0;i<length;i++){
//			sheetdata.push(["第"+(i+1)+"times"].concat(this.tongFailCountDataList[i]));
//		}
//		sheetdata.push(["平均值"].concat(this.dynOptions.series[1].data));
//		var data = this.dynOptions.series[1].data;
//		var total=0;
//		for(var i=0;i<data.length;i++){
//			total+=parseFloat(data[i]);
//		}
//		sheetdata.push(["总体平均值",total/data.length]);
//		
//		var tongsheet = XLSX.utils.aoa_to_sheet(sheetdata);
		
		var sheetData = {
			'Failures of P in the pool':XLSX.utils.aoa_to_sheet(banTileInfoFails),
			'Info of P in the pool':XLSX.utils.aoa_to_sheet(banTileFails),
			'Failures of C in the pool':XLSX.utils.aoa_to_sheet(tongTileInfoFails),
			'Reasons of failed C in one sim':XLSX.utils.aoa_to_sheet(tongTileInfoFailTypes),
			'Info of C in the pool':XLSX.utils.aoa_to_sheet(tongTileFails),
			'Reasons of failed C in the pool':XLSX.utils.aoa_to_sheet(tongTileFailTypes),
			'Length of the overlap of C':XLSX.utils.aoa_to_sheet(tongTileOverlaps),
//			"板瓦每个位置平均失败情况":bansheet,
//			"筒瓦每个位置平均失败情况":tongsheet,
		};
		var array=[this.gridBanCountOptions,this.gridTongCountOptions];
		for(var i=0;i<array.length;i++){
			var sheetInfo=this.createHeadMapSheet(array[i]);
			var sheetObj = XLSX.utils.aoa_to_sheet(sheetInfo.data);
			sheetData[sheetInfo.name]=sheetObj;
		}
		delete array;
		var totalCount = parseInt($(".simulateCount").val());
		var blob = ExcelUtils.sheets2blob(sheetData);
		var name = "The simulation results"+new Date().format("yyyy.MM.dd");
		layer.closeAll();
		ExcelUtils.openDownloadDialog(blob,name+".xlsx");
	}
}