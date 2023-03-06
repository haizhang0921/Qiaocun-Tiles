let chart;
var layerIndex;
function showGaussChart(type,field){
	var chartData = CommonUtil.eval(data,field);
	console.log(chartData);
	ChartApp.data=chartData;

	var bootstrapdata;
	if(field=="tong.bigWWidth"){
		bootstrapdata=data.Tong.bigWWidth_bootstrap;
		ChartApp.bootstrapdata=bootstrapdata;
	}else if(field=="tong.smallWWidth"){
		bootstrapdata=data.Tong.smallWWidth_bootstrap;
		ChartApp.bootstrapdata=bootstrapdata;
	}else{
		delete ChartApp.bootstrapdata;
	}
	
	if(!layerIndex){
		layerIndex =layer.open({
		  title:type,
		  type: 1,
		  area: ['auto'],
		  skin: 'layui-layer-nobg', //没有背景色
		  shadeClose: true,
		  shade: false,
		  content: $('#chartInfo'),
		  success: function(layero, index){
		    console.log(layero, index);
		  },
		  end :function(){
			  layerIndex=undefined;
		  }
		});
	}
	layer.title(type, layerIndex) ;

	if(!chart) chart= echarts.init($("#chart")[0],'dark')
    // Echarts 图的配置
    let options = {
        // Echarts 图 -- 标题
        title: {
            text: 'Echarts 正态分布曲线',
            show:false
        },

        grid: {
          top: "40",
          left: "40",
          right: "40",
          right: "40",
        },
        // Echarts 图 -- 工具
        tooltip: {},
        // Echarts 图 -- 图例
        legend: {
            data: ["Archeological data",'Normal distribution curve of archeological data']
        },
        // Echarts 图 -- x 坐标轴刻度 -- 正态分布数值
        xAxis: [{
            // name : "标准刻度(0.1)",
            data: ChartApp.dataAfterCleanX,
            // min: this.min,
            // max: this.max
        }],
        // Echarts 图 -- y 坐标轴刻度
        yAxis: [{
                type: 'value',
                name: 'Frequency',
                position: 'left',
                // 网格线
                splitLine: {
                    show: false
                },
                axisLine: {
//                    lineStyle: {
//                        color: 'orange'
//                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: 'Probability',
                position: 'right',
                // 网格线
                splitLine: {
                    show: false
                },
                axisLine: {
//                    lineStyle: {
//                        color: 'black'
//                    }
                },
                axisLabel: {
                    formatter: '{value}'
                }
            },
        ],
        // Echarts 图 -- y 轴数据
        series: [{
            name: 'Archeological data', // y 轴名称
            type: 'bar', // y 轴类型
            yAxisIndex: 0,
            barGap: 0,
//            barWidth: 27,
            itemStyle: {
                normal: {
                    show: true,
                    color: 'rgba(0, 0, 255,.8)', //柱子颜色
                    borderColor: 'blue' //边框颜色
                }
            },
            data: ChartApp.dataAfterCleanY, // y 轴数据 -- 源数据
        }, {
            name: 'Normal distribution curve of archeological data', // y 轴名称
            type: 'line', // y 轴类型
            // symbol: 'none', //去掉折线图中的节点
            smooth: true, //true 为平滑曲线
            yAxisIndex: 1,
            data: ChartApp.normalDistribution, // y 轴数据 -- 正态分布
            itemStyle: {
                normal: {
                    show: true,
                    color: 'LawnGreen', //柱子颜色
                }
            },
            lineStyle: {
                color: 'LawnGreen'
            },
            // 警示线
            markLine: {
                symbol: ['none'], // 箭头方向
                lineStyle: {
                    type: "silent",
                    color: "green",
                },
                itemStyle: {
                    normal: {
                        show: true,
                        color: 'black'
                    }
                },
                label: {
                    show: true,
                    position: "middle"
                },
                data: [
                	{
                        name: 'μ-σ',
                        xAxis: ChartApp.standarDevRangeOfOne.low.toFixed(3),
                        // 当 n 倍标准差在坐标轴外时，将其隐藏，否则它会默认显示在最小值部分，容易引起混淆
                    }, {
                        name: 'μ+σ',
                        xAxis: ChartApp.standarDevRangeOfOne.up.toFixed(3),
                    }, {
                        name: 'μ-2σ',
                        xAxis: ChartApp.standarDevRangeOfTwo.low.toFixed(3),
                    }, {
                        name: 'μ+2σ',
                        xAxis: ChartApp.standarDevRangeOfTwo.up.toFixed(3),
                    },
//                    {
//                        name: '三倍标准差',
//                        xAxis: ChartApp.standarDevRangeOfThree.low.toFixed(3),
//                    }, {
//                        name: '三倍标准差',
//                        xAxis: ChartApp.standarDevRangeOfThree.up.toFixed(3),
//                    },
                {
                    name: 'average',
                    // type: 'average',
                    xAxis: ChartApp.average.toFixed(3),
                    lineStyle: {
                        color: 'LawnGreen'
                    }
                }, ]
            }
        }],
    }
	
	if(bootstrapdata){
		options.legend.data.push('模拟数据正态分布');
		options.series.push({
			name: '模拟数据正态分布', // y 轴名称
            type: 'line', // y 轴类型
            // symbol: 'none', //去掉折线图中的节点
            smooth: true, //true 为平滑曲线
            yAxisIndex: 1,
            data: ChartApp.getGaussianData(bootstrapdata), // y 轴数据 -- 正态分布
            itemStyle: {
                normal: {
                    show: true,
                    color: 'red', //柱子颜色
                }
            },
            lineStyle: {
                color: 'red'
            },
         // 警示线
            markLine: {
                symbol: ['none'], // 箭头方向
                lineStyle: {
                    type: "silent",
                    color: "green",
                },
                itemStyle: {
                    normal: {
                        show: true,
                        color: 'black'
                    }
                },
                label: {
                    show: true,
                    position: "middle"
                },
                data: [
                {
                    name: '模拟数据平均值',
                    // type: 'average',
                    xAxis: bootstrapdata.mean.toFixed(3),
                    lineStyle: {
                        color: 'red'
                    }
                }, ]
            }
		});
	}
    chart.setOption(options)
}

var ChartApp ={
		get axisCount(){
			return 720;//this.data.length;//20;
		},
        /**
         * @Description： 有序数据源（方便操作）
         * @Author： ChengduMeng
         * @Date： 2020-11-28 14:17:24
         * */
        get dataOrderBy() {
            const data = this.data.concat([]); // 为防止 sort 方法修改原数组，对原数组进行拷贝，操作副本。
            return data.sort((a, b) => a - b)
        },
        /**
         * @Description： 数据整理。原数据整理为：{数据值 : 数据频率}
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:59:12
         * */
        get dataAfterClean() {
            let res = {}
            const data = this.dataOrderBy
            for (let i = 0; i < this.data.length; i++) {
                let key = this.data[i].toFixed(3) // 这里保留 1 位小数
                if (key !== "NaN" && parseFloat(key) === 0)
                    key = 0.0; //这个判断用来处理保留小数位后 -0.0 和 0.0 判定为不同 key 的 bug
                if (res[key])
                    res[key] += 1
                else
                    res[key] = 1
            }
            return res
        },
        /**
         * @Description： 数据整理。返回源数据所有值（排序后）
         * @Author： ChengduMeng
         * @Date： 2020-11-28 14:35:52
         * */
        get dataAfterCleanX() {
        	var ret = [];
        	var average = this.average;
        	ret.push(average.toFixed(3));
        	var one = this.standarDevRangeOfOne;
        	ret.push(one.low.toFixed(3));
        	ret.push(one.up.toFixed(3));
        	var two = this.standarDevRangeOfTwo;
        	ret.push(two.low.toFixed(3));
        	ret.push(two.up.toFixed(3));
        	var range= this.standarDevRangeOfThree;
        	ret.push(range.low.toFixed(3));
        	ret.push(range.up.toFixed(3));
        	var up = range.up;
        	var low = range.low;
        	var length = this.axisCount;
        	var step = (up-low)/length;
        	for(var i=0;i<=length;i++){
        		ret.push((low+step*i).toFixed(3));
        	}

        	for (let i = 0; i < this.data.length; i++) {
        		var x = this.data[i];
        		ret.push(x.toFixed(3));
        	}
        	if(this.bootstrapdata){
        		ret.push(this.bootstrapdata.mean.toFixed(3));
        	}
        	ret.sort((a, b) => a - b);
//        	console.log(ret);
        	ret=ret.unique();
        	return ret;
//            return Object.keys(this.dataAfterClean).sort((a, b) => a - b).map(t => parseFloat(t)
//                .toFixed(1)) // 保留 1 位小数
            // return Object.keys(this.dataAfterClean) // 不保证顺序一致
        },
        /**
         * @Description： 数据整理。返回源数据所有值对应的频率（排序后） -- 与 dataAfterCleanX 顺序一致
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:59:12
         * */
        get dataAfterCleanY() {
            let r = []
            var dataAfterCleanX=this.dataAfterCleanX;
            var dataAfterClean=this.dataAfterClean;
            for (let i = 0; i < dataAfterCleanX.length; i++) {
                r.push(dataAfterClean[dataAfterCleanX[i]])
            }
            return r
        },
        /**
         * @Description： 计算平均数。这里的平均数指的是数学期望、算术平均数
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
        get average() {
            return Math.mean(this.data)
        },
        /**
         * @Description： 计算总体/样本方差
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
        get variance() {
            return Math.variance(this.data);
        },
        /**
         * @Description： 计算总体/样本标准差
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
        get standardDeviation() {
            return Math.sqrt(this.variance)
        },
        /**
         * @Description： 计算一倍标准差范围
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:26:03
         * */
        get standarDevRangeOfOne() {
            return {
                low: this.average - 1 * this.standardDeviation,
                up: this.average + 1 * this.standardDeviation
            }
        },
        /**
         * @Description： 计算三倍标准差范围
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:29:43
         * */
        get standarDevRangeOfTwo() {
            return {
                low: this.average - 2 * this.standardDeviation,
                up: this.average + 2 * this.standardDeviation
            }
        },
        /**
         * @Description： 计算三倍标准差范围
         * @Author： ChengduMeng
         * @Date： 2020-11-27 15:30:49
         * */
        get standarDevRangeOfThree() {
            return {
                low: this.average - 3 * this.standardDeviation,
                up: this.average + 3 * this.standardDeviation
            }
        },
        /**
         * @Description： 正态分布(高斯分布)计算公式
         * @Author： ChengduMeng
         * @Date： 2020-11-28 13:46:18
         * */
        get normalDistribution() {
        	var gauss=gaussian(this.average,this.variance);
        	var res=[];
            var range= this.standarDevRangeOfThree;
        	var up = range.up;
        	var low = range.low;
        	var length = this.dataAfterCleanX.length;
        	var step = (up-low)/length;
        	for(var i=0;i<length;i++){
        		var x=(low+step*i);
                const y=gauss.pdf(x);
                res.push(y)
        	}

//        	for (let i = 0; i < this.data.length; i++) {
//        		var x = this.data[i];
//                const y=gauss.pdf(x);
//                res.push(y)
//        	}
//        	res.sort((a, b) => a - b);
            return res;
        },
        getGaussianData:function(gaussianParams){
        	var gauss=gaussian(gaussianParams.mean,gaussianParams.variance);
        	var res=[];
            var range= this.standarDevRangeOfThree;
        	var up = range.up;
        	var low = range.low;
        	var length = this.dataAfterCleanX.length;
        	var step = (up-low)/length;
        	for(var i=0;i<length;i++){
        		var x=(low+step*i);
                const y=gauss.pdf(x);
                res.push(y)
        	}
            return res;
        }

};
