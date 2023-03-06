(function(){
	// JavaScript Document

	var CommonUtil = new Object();
	CommonUtil.getValueById = function(id) {
		var ele = document.getElementById(id);
		if (ele == null)
			return null;// 判断元素存在
		if (typeof ele.value == "undefined")
			return null;// 判断元素有value属性
		if (ele.value.trim().length==0)
			return null;// 判断元素的value值有值
		return ele.value.trim();
	}
	CommonUtil.initSearchObject = function(param) {
		var filter = {};
		for ( var k in param) {
			filter[k] = CommonUtil.getValueById(param[k]);
		}
		return filter;
	}
	CommonUtil.queryGetObject=function(name,handler){
		var obj = CommonUtil.getObject(name);
		if(typeof(handler)=="function"){
			handler(obj);
		}
		var ret = [];
		for(var key in obj){
			var value = obj[key];
			if(value!==null&&value!==undefined&&value!==""){
				ret.push(key+"="+value);
			}
		}
		return ret.join("&");
	}
	CommonUtil.getObject = function(name,notClear) {
		var ret;
//		try {
//			ret = Validator.Validate(name, 2);
//		} catch (e) {
//			ret = false;
//		}
//		if (!ret) return false;
		var obj = CommonUtil.getObjectCore(null, name);
		if (!notClear && obj != null) {
//			CommonUtil.clearObject(name);
		}
		return obj;
	}
	/**
	 * name：元素name
	 * dialog：弹出窗口
	 * fun:执行方法
	 */
	CommonUtil.execute = function(dialog,name,fun) {
		if(typeof name== 'undefined'||name==null) alert("CommonUtil.execute的name参数为必填项");
		var ret = CommonUtil.getObject(name);
		if (ret){
			if(typeof fun=='function') fun(ret);
		}
		return ret;
	}
	CommonUtil.getElementsByName = function(name) {
		var objArr=[];
		if(typeof(name)=="string"){
			var array = $("[name^='"+name+"']");
			for ( var i = 0; i < array.length; i++){
				var unsetvalue = array[i].getAttribute("unsetvalue");
				if(unsetvalue=="true"){
					continue;
				}
				objArr.push(array[i]);
			}
		}else{
			var myObject= name;
			if(name.length&&name.length>0){
				myObject=name[0];
			}
			var inputArr = myObject.getElementsByTagName("INPUT");
			var textareArr = myObject.getElementsByTagName("TEXTAREA");
			var selectArr = myObject.getElementsByTagName("SELECT");
			for ( var i = 0; i < inputArr.length; i++)
				objArr.push(inputArr[i]);
			for ( var i = 0; i < textareArr.length; i++)
				objArr.push(textareArr[i]);
			for ( var i = 0; i < selectArr.length; i++)
				objArr.push(selectArr[i]);
		}
		return objArr;
	}
	/**
	 * 设置元素值或内容
	 * 相关属性配置说明：
	 * unsetvalue:如果为true，不设置值，否则赋值
	 * setdefault：false：不赋值，否则赋值
	 * notTrigger：true：不触发值改变事件，否则触发
	 * notTrigger：true：不触发值改变事件，否则触发
	 * updateValue:true:触发updateValue事件，否则不触发
	 */
	CommonUtil.setObject = function(name, obj,notTrigger) {
		var objArr = CommonUtil.getElementsByName(name);
		for ( var i = 0; i < objArr.length; i++) {
			var htmlObj = objArr[i];
			var unsetvalue = htmlObj.getAttribute("unsetvalue");
			var setDefault = htmlObj.getAttribute("setdefault");
			
			if(unsetvalue=="true"||(setDefault=="false")){
				continue;
			}
			var valueChange = htmlObj.getAttribute("valueChange");
			if(valueChange){
//				valueChange = eval(valueChange);
//				if(typeof(valueChange)=="function"){
					$(htmlObj).unbind("change").bind("change",function(){
						var valueChange = this.getAttribute("valueChange");
						evalFunc.apply(this,[valueChange]);
//						valueChange = eval(valueChange);
//						valueChange(this, obj);
					});
//				}
			}
			
			var property = htmlObj.getAttribute("property");

			if(property==null||property==""){
				continue;
			}
			if(!CommonUtil.hasOwnProperty(obj,property)){
				continue;
			}
			var subproperty = htmlObj.getAttribute("subproperty");
			var value = "";
			if(obj[property]!=null&&typeof(obj[property])!="undefined"){
				if (typeof obj[property] == 'object'&&Cesium.defined(obj[property].time) && subproperty == null) {
					var newTime = new Date(obj[property].time);
					value = newTime.format("yyyy-MM-dd");
				} else if (typeof obj[property] == 'object'
						&& subproperty != null) {
					value = obj[property][subproperty];
				} else{
					value = obj[property];
				}
			}

			var dataValue = htmlObj.getAttribute("dataValue");
			if(dataValue){
				dataValue = eval(dataValue);
			}

			if(value==""){
				if (property.indexOf(".")>0||property.indexOf("[")>0) {
					try{
						value = CommonUtil.eval(obj,property);
					}catch(e){
						
					}
				}
			}
			var setValue = htmlObj.getAttribute("setValue");
			if(setValue){
				setValue = eval(setValue);
				if(typeof(setValue)=="function"){
					value=setValue(value,obj,property,htmlObj);
					if(value==undefined){
						continue;
					}
				}
			}
			if(dataValue!=null&&typeof(dataValue)=="object"){
				if(typeof(dataValue.setValue)=="function"){
					value=dataValue.setValue(value,obj,property,htmlObj);
					if(value==undefined){
						continue;
					}
				}
			}
			if(value==undefined){
				continue;
			}
			var objNotTrigger = false;
			if($(htmlObj).attr("notTrigger")=="true"){
				objNotTrigger=true;
			}
			if (htmlObj.tagName == "INPUT" || htmlObj.tagName == "TEXTAREA") {
				if (htmlObj.getAttribute("type") == "checkbox") {
					value = CommonUtil.getPropShowVal(value);
					if (value===true||htmlObj.value == value||htmlObj.value == (value+"")) {
						htmlObj.checked = true;
					} else {
						htmlObj.checked = false;
					}
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
				}else if(htmlObj.getAttribute("type") == "radio"){
					if(htmlObj.value != value){
						continue;
					}
					htmlObj.checked = true;
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
					continue;
				}else if (htmlObj.getAttribute("type") == "color") {
					if (value.toCssHexString) {
						$(htmlObj).val(value.toCssHexString()).trigger('change');
					}else if (value.rgbaf&&Array.isArray(value.rgbaf) ) {
						var red = value.rgbaf[0];
						var green = value.rgbaf[1];
						var blue = value.rgbaf[2];
						var alpha = value.rgbaf[3];
						value = new Cesium.Color(red, green, blue, alpha).toCssHexString();
						$(htmlObj).val(value);
					} else {
						$(htmlObj).val(value);
					}
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
				}else if (htmlObj.getAttribute("type") == "file") {
					if($(htmlObj).hasClass("showFileName")){
						$(htmlObj).prev().html(value);
						$(htmlObj).val("");
					}
				}else if(htmlObj.getAttribute("type") == "hidden"){
					$(htmlObj).val(value);
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
				}else {
					$(htmlObj).val(value);
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
				}
			} else if (htmlObj.tagName == "SELECT") {
				if(typeof(value)!="undefined"){
					CommonUtil.initSelectIndex(htmlObj, value);
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
				}
			} else {
				if(typeof(value)!="undefined"){
					if(typeof(value)!="string"){
						if(Array.isArray(value)){
							value.forEach(function(item,index){
								$(htmlObj).append(item);
							});
						}else{
							$(htmlObj).append(value);
						}
					}else{
						htmlObj.innerHTML = value;
					}
					if(!notTrigger&&!objNotTrigger)$(htmlObj).trigger('change');
				}
			}
			
			var updateValue = htmlObj.getAttribute("updateValue");
			if(updateValue=="true"){
				$(htmlObj).trigger('updateValue',[value]);
			}
		}
	}
	/**
	 * 如果objID==null则根据元素name属性得到所有元素
	 * 如果objID!=null则得到objID下所有表单元素
	 */
	CommonUtil.getObjectCore = function(objID, name) {
		var retObj = new Object();
		var objArr;
		if (objID != null) {
			objArr = new Array();
			var myObject;
			if(typeof(objID)=='string'){
				myObject = document.getElementById(objID);
			}else{
				myObject = objID;
				if(objID.length&&objID.length>0){
					myObject = objID[0];
				}
			}
			var inputArr = myObject.getElementsByTagName("INPUT");
			var textareArr = myObject.getElementsByTagName("TEXTAREA");
			var selectArr = myObject.getElementsByTagName("SELECT");
			for ( var i = 0; i < inputArr.length; i++)
				objArr.push(inputArr[i]);
			for ( var i = 0; i < textareArr.length; i++)
				objArr.push(textareArr[i]);
			for ( var i = 0; i < selectArr.length; i++)
				objArr.push(selectArr[i]);
		} else {
//			objArr = document.getElementsByName(name);
			objArr=CommonUtil.getElementsByName(name);
		}
		for ( var i = 0; i < objArr.length; i++) {
			var htmlObj = objArr[i];
			
			var unsetvalue = htmlObj.getAttribute("unsetvalue");
			var ignoreValue = $(htmlObj).attr("ignoreValue");//ignoreValue：忽略此内容，主要用于显示内容时不需要获取值使用
			if(unsetvalue=="true"||ignoreValue=="true"){
				continue;
			}
			var property = htmlObj.getAttribute("property");
			var subproperty = htmlObj.getAttribute("subproperty");
			var value=null;
			var tempObj = new Object();
			var cType = htmlObj.getAttribute("customType");
			if (htmlObj.tagName == "INPUT" || htmlObj.tagName == "TEXTAREA") {
				/** 页面date数据的格式转换 */
				if (cType == 'date') {
					if (htmlObj.value != "") {
						// retObj[property] = Date.stringToDate(htmlObj.value);
						value = htmlObj.value.toDate();
					} else {
						value = null;
					}
				} else {
					var inputType = htmlObj.getAttribute("type");
					inputType = inputType=null?inputType.toLowerCase():inputType;
					if (!subproperty) {
						if(inputType=="checkbox"){
							value = $(htmlObj).is(":checked");
						}else if(inputType=="radio"){
							if($(htmlObj).is(":checked")!=true){
								continue;
							}
							value=$(htmlObj).val();
						}else if(inputType=="file"){
							value=htmlObj.files;
						}else{
							value = htmlObj.value;
						}
						
					} else {
						tempObj[subproperty] = htmlObj.value;
						value = tempObj;
					}

				}
			} else if (htmlObj.tagName == "SELECT") {
				if (htmlObj.options && htmlObj.options.length > 0) {
					if (!subproperty) {
						value = htmlObj.options[htmlObj.selectedIndex].value;
					} else {
						tempObj[subproperty] = htmlObj.options[htmlObj.selectedIndex].value;
						value = tempObj;
					}
				}
			} else {
				if (!subproperty) {
					value = htmlObj.innerHTML;
				} else {
					tempObj[subproperty] = htmlObj.innerHTML;
					value = tempObj;
				}
			}
			if(cType=="float"){
				try{
					value =parseFloat(value);
				}catch(e){
					console.log(e);
				}
				if(isNaN(value)){
					value = 0.0;
				}
			}else if(cType=="int"){
				try{
					value =parseInt(value);
				}catch(e){
					console.log(e);
				}
				if(isNaN(value)){
					value = 0;
				}
			}else if(cType=="boolean"){
				try{
					value =value === 'true';
				}catch(e){
					console.log(e);
					value=false;
				}
			}
			var toValue = htmlObj.getAttribute("toValue");
			if(toValue){
				try{
					toValue =eval(toValue);
					if(typeof(toValue)=="function"){
						value=toValue(value,retObj,htmlObj);
					}
				}catch(e){
					console.log(e);
				}
			}
			var dataValue = htmlObj.getAttribute("dataValue");
			if(dataValue){
				try{
					dataValue = eval(dataValue);
					if(dataValue!=null&&typeof(dataValue)=="object"&&typeof(dataValue.toValue)=="function"){
						value=dataValue.toValue(value,retObj,htmlObj);
					}
				}catch(e){
					console.log(e);
				}
			}
			if(property==null||property==""){
				continue;
			}
			if(property.indexOf(".")>0||property.indexOf("[")>0){
				property = property.replace(".split('/')","");
				var propertys = property.split(".");
				var temp = retObj;
				for(var kk=0;kk<propertys.length;kk++){
					var pp = propertys[kk];
					var index =-1;
					if(pp.indexOf("[")>0){
						index = parseInt(pp.substring(pp.indexOf("[")+1,pp.indexOf("]")));
						pp = pp.substring(0,pp.indexOf("["));
					}
					if(!temp[pp]){
						if(index>=0){
							temp[pp]=[];
						}else{
							temp[pp]={};
						}
					}
					if(kk==propertys.length-1){
						if(index>=0){
							temp[pp][index]=value;
							if(property.indexOf("[")>0){
								if(typeof(toValue)=="function"){
									temp[pp] = toValue(temp[pp],retObj);
								}else if(dataValue!=null&&typeof(dataValue)=="object"&&typeof(dataValue.toValue)=="function"){
									temp[pp] = dataValue.toValue(temp[pp],retObj);
								}
							}
						}else{
							temp[pp] = value;
						}
					}
					temp = temp[pp];
				}
			}else{
				retObj[property] = value;
			}
			// debugger;
			
			var flag = false;
			var errorInfo = "";
			if (htmlObj.getAttribute("notNull") == "true") {
				if (value === "") {
					errorInfo = htmlObj.getAttribute("notNullEInfo");
					if (errorInfo == null || typeof errorInfo == "undefined") {
						errorInfo = "必填字段不能为空";
					}
					var tempBorder = $(htmlObj).css("border");
					$(htmlObj).css("border","1px solid red");
					$(htmlObj).attr("placeholder",errorInfo);
					$(htmlObj).change(function(){
						$(htmlObj).css("border",tempBorder);
					});
					flag = true;
					return null;
				}

			}

			if (htmlObj.getAttribute("isInt") == "true") {
				if (value === ""||isNaN(value)) {
					errorInfo = htmlObj.getAttribute("eInfo");
					if (errorInfo == null || typeof errorInfo == "undefined") {
						errorInfo = "数据格式不对,必须为数字的格式不能为字符。";
					}
					var tempBorder = $(htmlObj).css("border");
					$(htmlObj).css("border","1px solid red");
					$(htmlObj).attr("placeholder",errorInfo);
					$(htmlObj).change(function(){
						$(htmlObj).css("border",tempBorder);
					});
					flag = true;
					return null;
				}
			}
			if (flag) {
				var terrorObj = document.getElementById(htmlObj
						.getAttribute("eId"));
				if (terrorObj != null && typeof terrorObj != "undefined") {
					terrorObj.innerHTML = errorInfo;
				} else {
					alert(errorInfo);
				}
				return null;
			}
		}
		return retObj;
	}
	CommonUtil.eval = function(data,property) {
		try{

			if(property){
				return eval("arguments[0]."+property);
			}else{
				return eval(data);
			}
		}catch(e){
			return undefined;
		}
	}
	CommonUtil.clearObject = function(name,noClearPropertys) {
		var objArr = CommonUtil.getElementsByName(name);

		for ( var i = 0; i < objArr.length; i++) {
			var property = objArr[i].getAttribute("property")
			if(noClearPropertys&&CommonUtil.hasValue(property,noClearPropertys)){
				continue;
			}
			if (objArr[i].getAttribute("notClear") == "true") {
				continue;
			}
			if (objArr[i].tagName == "INPUT" || objArr[i].tagName == "TEXTAREA") {
				if (objArr[i].type != "checkbox")
					objArr[i].value = "";
			} else if (objArr[i].tagName == "SELECT") {
				objArr[i].selectedIndex = 0;
			} else {
				objArr[i].innerHTML = "";
			}
		}
	}
	CommonUtil.hasValue = function(property,noClearPropertys) {
		for ( var i = 0; i < noClearPropertys.length; i++) {
			var tempp = noClearPropertys[i];
			if (tempp == property) {
				return true;
			}
		}
		return false;
	}
	
	CommonUtil.clearSpanObject = function(id) {
		var tableObj = document.getElementById(id);
		var objArr = tableObj.getElementsByTagName("SPAN");

		for ( var i = 0; i < objArr.length; i++) {
			objArr[i].innerHTML = "";
		}
	}

	CommonUtil.setDetailObject = function(name, obj) {
		var tableObj = document.getElementById(name);
		var objArr = tableObj.getElementsByTagName("SPAN");
		for ( var i = 0; i < objArr.length; i++) {
			var property = objArr[i].getAttribute("property");
			var subproperty = objArr[i].getAttribute("subproperty");
			var innerHTML = "";
			if (obj[property] == null) {
				innerHTML = "";
			} else {
				if (subproperty != null) {
					if (obj[property][subproperty] == null) {
						innerHTML = "";
					} else {
						innerHTML = obj[property][subproperty];
					}
				} else {
					innerHTML = obj[property];
				}
			}

			objArr[i].innerHTML = innerHTML;
		}
	}
	CommonUtil.setDetailObject4 = function(name, obj,ctime) {
		var tableObj = document.getElementById(name);
		var objArr = tableObj.getElementsByTagName("SPAN");
		for ( var i = 0; i < objArr.length; i++) {
			var property = objArr[i].getAttribute("property");
			if (property == null) {
			} else {
				innerHTML = obj[property];
				if(property==ctime){
					var time = innerHTML;
					if(typeof(time)=="object"){
						time=time.time;
					}
					var newTime = new Date(time); 
					innerHTML=newTime.format("yyyy-MM-dd");
				}
				objArr[i].innerHTML = innerHTML;
			}

			
		}
	}
	
	CommonUtil.setDetailObject3 = function(name, obj,ctime) {
		var tableObj = document.getElementById(name);
		var objArr = tableObj.getElementsByTagName("TD");
		for ( var i = 0; i < objArr.length; i++) {
			var property = objArr[i].getAttribute("property");
			var innerHTML = "";
			if (property == null) {
				//innerHTML = "";
			} else {
				innerHTML = obj[property];
				if(property==ctime){
					var time = innerHTML.time;
					var newTime = new Date(time); 
					innerHTML=newTime.format("yyyy-MM-dd");
				}
				objArr[i].innerHTML = innerHTML;
			}
			
		}
	}
	CommonUtil.setDetailObject5 = function(name, obj,ctime) {
		var tableObj = document.getElementById(name);
		var objArr = tableObj.getElementsByTagName("TD");
		for ( var i = 0; i < objArr.length; i++) {
			var property = objArr[i].getAttribute("property");
			var innerHTML = "";
			if (property == null) {
				//innerHTML = "";
			} else {
				innerHTML = obj[property];
				if(property==ctime){
					var time = innerHTML.time;
					var newTime = new Date(time); 
					innerHTML=newTime.format("yyyy-MM-dd hh:mm:ss");
				}
				objArr[i].innerHTML = innerHTML;
			}
			
		}
	}
	
	CommonUtil.hasOwnProperty = function(obj,property) {
		if(property.indexOf(".")>0||property.indexOf("[")>0){
			try{
				var value = CommonUtil.eval(obj,property);
				return value!=undefined;
			}catch(e){
				return false;
			}
		}else{
			return obj.hasOwnProperty(property);
		}
	}
	CommonUtil.getValue = function(htmlObj) {
		var property = htmlObj.getAttribute("property");
		var subproperty = htmlObj.getAttribute("subproperty");
		var value=null;
		var retObj = new Object();
		var tempObj = new Object();
		var cType = htmlObj.getAttribute("customType");
		if (htmlObj.tagName == "INPUT" || htmlObj.tagName == "TEXTAREA") {
			/** 页面date数据的格式转换 */
			if (cType == 'date') {
				if (htmlObj.value != "") {
					value = htmlObj.value.toDate();
				} else {
					value = null;
				}
			} else {
				var inputType = htmlObj.getAttribute("type");
				inputType = inputType=null?inputType.toLowerCase():inputType;
				if (!subproperty) {
					if(inputType=="checkbox"||inputType=="radio"){
						value = $(htmlObj).is(":checked");
					}else if(inputType=="radio"){
						value = $(htmlObj).val();
					}else{
						value = htmlObj.value;
					}
					
				} else {
					tempObj[subproperty] = htmlObj.value;
					value = tempObj;
				}

			}
		} else if (htmlObj.tagName == "SELECT") {
			if (htmlObj.options && htmlObj.options.length > 0) {
				if (!subproperty) {
					value = htmlObj.options[htmlObj.selectedIndex].value;
				} else {
					tempObj[subproperty] = htmlObj.options[htmlObj.selectedIndex].value;
					value = tempObj;
				}
			}
		} else {
			if (!subproperty) {
				value = htmlObj.innerHTML;
			} else {
				tempObj[subproperty] = htmlObj.innerHTML;
				value = tempObj;
			}
		}
		if(cType=="float"){
			try{
				value =parseFloat(value);
			}catch(e){
				console.log(e);
			}
			if(isNaN(value)){
				value = 0.0;
			}
		}else if(cType=="int"){
			try{
				value =parseInt(value);
			}catch(e){
				console.log(e);
			}
			if(isNaN(value)){
				value = 0;
			}
		}
		var toValue = htmlObj.getAttribute("toValue");
		if(toValue){
			try{
				toValue =eval(toValue);
				if(typeof(toValue)=="function"){
					value=toValue(value,retObj);
				}
			}catch(e){
				console.log(e);
			}
		}
		var dataValue = htmlObj.getAttribute("dataValue");
		if(dataValue){
			try{
				dataValue = eval(dataValue);
				if(dataValue!=null&&typeof(dataValue)=="object"&&typeof(dataValue.toValue)=="function"){
					value=dataValue.toValue(value,retObj);
				}
			}catch(e){
				console.log(e);
			}
		}
		if(property==null||property==""){
			return value;
		}
		if(property.indexOf(".")>0||property.indexOf("[")>0){
			property = property.replace(".split('/')","");
			var propertys = property.split(".");
			var temp = retObj;
			for(var kk=0;kk<propertys.length;kk++){
				var pp = propertys[kk];
				var index =-1;
				if(pp.indexOf("[")>0){
					index = parseInt(pp.substring(pp.indexOf("[")+1,pp.indexOf("]")));
					pp = pp.substring(0,pp.indexOf("["));
				}
				if(!temp[pp]){
					if(index>=0){
						temp[pp]=[];
					}else{
						temp[pp]={};
					}
				}
				if(kk==propertys.length-1){
					if(index>=0){
						temp[pp][index]=value;
						if(property.indexOf("[")>0){
							if(typeof(toValue)=="function"){
								temp[pp] = toValue(temp[pp],retObj);
							}else if(dataValue!=null&&typeof(dataValue)=="object"&&typeof(dataValue.toValue)=="function"){
								temp[pp] = dataValue.toValue(temp[pp],retObj);
							}
						}
					}else{
						temp[pp] = value;
					}
				}
				temp = temp[pp];
			}
		}else{
			retObj[property] = value;
		}
		return retObj;
	}
	
	function evalFunc(func){
		eval(func);
	}
	CommonUtil.enabled=function(elemObj,enValue,filter,filterValue){
		var isEnabled = false;
		if(elemObj.getAttribute("type") == "radio"){
			var value =$("input[type='radio'][name='"+$(elemObj).attr("name")+"']:checked").val();
			isEnabled=value==enValue;
		}else if(elemObj.getAttribute("type") == "checkbox"){
			var value =$(elemObj).is(":checked");
			isEnabled=value==enValue;
		}else{
			var value = $(elemObj).val();
			isEnabled=value==enValue;
		}

		if(isEnabled){
			if(filterValue!=undefined){
				$(filter).val(filterValue);
			}
			$(filter).attr("disabled",false);
//			$(filter).attr("unsetvalue","false");
		}else{
//			if(filterValue!=undefined){
//				$(filter).val("");
//			}
			$(filter).attr("disabled",true);
//			$(filter).attr("unsetvalue","true");
		}
	}
	CommonUtil.getPropShowVal = function(v) {
		if(Array.isArray(v)){
			for(var i=0;i<v.length;i++){
				var value = CommonUtil.getPropShowVal(v[i]);
				if(value==true){
					return true;
				}
			}
			return false;
		}else if(typeof(v)=='object'&&Cesium.defined(v.boolean)){
			return v.boolean;
		}else{
			return v;
		}
	}
	

	CommonUtil.getValues = function(name, validation, notinnerValidation) {

		var objArr = document.getElementsByName(name);

		var arrValue = new Array();

		for ( var i = 0; i < objArr.length; i++) {
			if (objArr[i].tagName == "INPUT" || objArr[i].tagName == "TEXTAREA") {
				arrValue[i] = objArr[i].value;
				if (notinnerValidation != true) {
					if (objArr[i].getAttribute("notnull") == "true"
							&& arrValue[i] == "") {
						alert("必须填写的字段不能为空");
						return null;
					}
				}
			} else if (objArr[i].tagName == "SELECT") {
				arrValue[i] = objArr[i].options[objArr[i].selectedIndex].value;
			} else {
				arrValue[i] = objArr[i].innerHTML;
			}
		}

		if (typeof validation == "function") {
			return validation(arrValue);
		} else {
			return arrValue
		}
	}
	CommonUtil.subLen = function(data, len) {
		if (data) {
			if (data.length > len) {
				data = data.substring(0, len) + "...";
			}
		} else {
			data = "";
		}
		return data;
	}
	CommonUtil.setValues = function(name, arrValue) {

		var objArr = document.getElementsByName(name);

		for ( var i = 0; i < objArr.length; i++) {
			if (arrValue[i] == null) {
				arrValue[i] = "";
			}
			if (objArr[i].tagName == "INPUT" || objArr[i].tagName == "TEXTAREA") {
				objArr[i].value = arrValue[i];
			} else if (objArr[i].tagName == "SELECT") {
				CommonUtil.fillInSelect(objArr[i], arrValue[i]);
			} else {
				objArr[i].innerHTML = arrValue[i];
			}
		}

	}

	// not init select
	CommonUtil.setValues0 = function(name, arrValue) {

		var objArr = document.getElementsByName(name);

		for ( var i = 0; i < objArr.length; i++) {
			if (arrValue[i] == null) {
				arrValue[i] = "";
			}
			if (objArr[i].tagName == "INPUT" || objArr[i].tagName == "TEXTAREA") {
				objArr[i].value = arrValue[i];
			} else if (objArr[i].tagName == "SELECT") {
				CommonUtil.initSelectIndex(objArr[i], arrValue[i]);
			} else {
				objArr[i].innerHTML = arrValue[i];
			}
		}
	}
	//在网页内设置值
	CommonUtil.setHTMLValues = function(tagName, name, arrValue) {

		var objArr = document.getElementsByTagName(tagName);
		var counter = 0
		for ( var i = 0; i < objArr.length; i++) {
			if (arrValue[i] == null) {
				arrValue[i] = "";
			}
			if (objArr[i].getAttribute("name") == name) {

				objArr[i].innerHTML = arrValue[counter++];
			}
		}

	}
	//判断是否为数组
	CommonUtil.isArray = function(object){
	    return  object && typeof object==='object' &&    
	            typeof object.length==='number' &&  
	            typeof object.splice==='function' &&    
	             
	            !(object.propertyIsEnumerable('length'));
	}
	CommonUtil.getParam = function(key) {
		var surl = window.location;
		surl += "";

		var start = surl.lastIndexOf(key);

		if (start <= 0) {
			return null;
		}

		start += key.length + 1;

		var end = surl.indexOf("&", start);
		if (end <= 0) {
			end = surl.indexOf("#", start);
			if (end <= 0) {
				end = surl.length;
			}
		}

		return surl.substring(start, end);
	};
	CommonUtil.valuesSame =function(obj,data){
		var isEdit =true;
		if(obj&&data){
			for(var key in obj){
				if(typeof(obj[key])=="function"){
					continue;
				}
				if(obj[key]!=data[key]){
					return false;
				}
			}
			return true;
		}
		return false;
	}
	CommonUtil.fillInSelect = function(obj, g, indexValue) {
		obj.length = g.length / 2;

		var index = 0;

		for ( var i = 0; i < obj.length; i++) {
			obj.options[i].value = g[2 * i];
			obj.options[i].text = g[2 * i + 1];

			if (typeof indexValue == "undefined") {
				if (obj.options[i].value == indexValue) {
					index = i;
				}
			}
		}
		obj.selectedIndex = index;
	};

	CommonUtil.initSelectIndex = function(obj, v) {
		for ( var i = 0; i < obj.options.length; i++) {
			if (obj.options[i].value == v) {
				obj.options[i].selected = true;
				break;
			}
		}
	}

	CommonUtil.initSelectIndex2 = function(obj, v, p) {
		if (v != null) {
			CommonUtil.initSelectIndex(obj, p);
		}
	}

	CommonUtil.getSelectValue = function(container) {
		var obj = document.getElementById(container);
		return obj.options[obj.selectedIndex].value;
	}
	CommonUtil.setSelectValue = function(id,values) {
		var obj = document.getElementById(id);
		for (var i in values) {
			var o = document.createElement("option");
			o.value = i;
			o.text = values[i];
			obj.add(o);
		}
	}
	CommonUtil.setSelectValues = function(id,values,fields) {
		var obj = document.getElementById(id);
		for (var i=0;i<values.length;i++) {
			var o = document.createElement("option");
			o.value = values[i][fields.value];
			o.text = values[i][fields.text];
			obj.add(o);
		}
	}
	// 2008/05/12 YANJINAZHONG ADD BEGIN
	CommonUtil.viewStr = function(str, len) {
		str = CommonUtil.delHtmlTag(str);
		str = $.trim(str);
		if (!len)
			len = 30;
		if (str.length > len) {
			return str.substr(0, len) + "...";
		}
		return str;
	}
	CommonUtil.delHtmlTag=function(str){
	  return str.replace(/<[^>]+>|\s/g,"");//去掉所有的html标记
	 }
	// 2008/05/12 YANJINAZHONG ADD END

	CommonUtil.tab = function() {
		var arr = document.getElementsByTagName("INPUT");
		for ( var i = 0; i < arr.length; i++) {
			arr[i].setAttribute("myTabIndex", i);
			arr[i].onfocus = function() {
				this.select();
			}
			arr[i].attachEvent("onkeydown", function(event) {
				var ti = parseInt(event.srcElement.getAttribute("myTabIndex"));
				if (event.keyCode == 13 && event.srcElement.tagName == "INPUT"
						|| event.keyCode == 40) {
					while ((ti++) < arr.length - 1) {
						try {
							arr[ti].focus();
							break;
						} catch (E) {

						}
					}
				} else if (event.keyCode == 38) {
					while ((ti--) > 0) {
						try {
							arr[ti].focus();
							break;
						} catch (E) {

						}
					}

				}
			});
		}
	}

	// 字符串转化成时间类型
	CommonUtil.str2Date = function(dateStr) {
		return new Date(Date.parse(dateStr.replace(/-/g, "/")))
	}

	var popUpWin = 0;

	function popUpWindow(URLStr, width, height, name) {
		var left = (screen.width / 2) - width / 2;
		var top = (screen.height / 2) - height / 2;
		if (popUpWin) {
			if (!popUpWin.closed)
				popUpWin.close();
		}
		if (typeof name == "undefined" || name == null) {
			name = "_blank"
		}
		popUpWin = open(
				URLStr,
				name,
				'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width='
						+ width
						+ ',height='
						+ height
						+ ',left='
						+ left
						+ ', top='
						+ top + ',screenX=' + left + ',screenY=' + top + '');

		return popUpWin;
	}
	function findObjFromAllWindow(pageObj, pagePaths) {
		// alert(pageObj.opener.location)
		var page = pageObj.opener;

		if (typeof page == "undefined") {
			if (pageObj.parent.location != pageObj.location) {
				page = pageObj.parent;
			} else {
				return null
			}
		}

		var url = page.location + "";

		for ( var i = 0; i < pagePaths.length; i++) {
			if (url.indexOf("/" + pagePaths[i]) > 0) {
				return [ page, i ];
			}
		}
		return findObjFromAllWindow(page, pagePaths);
	}

	function initListener() {
		if (typeof document.body != "undefined") {
			CommonUtil.tab();
		} else {
			window.setTimeout(initListener, 500);
		}
	}

	var checkbox = {};
	checkbox.selectAll = function(obj, subname) {
		if (!obj) {
			return;
		}
		var boxes = document.getElementsByName(subname);
		if (!boxes) {
			return;
		}
		for ( var i = 0; i < boxes.length; i++) {
			boxes[i].checked = obj.checked;
		}
	}

	checkbox.convertSelect = function(subname) {
		if (!subname) {
			return;
		}
		var boxes = document.getElementsByName(subname);
		if (!boxes) {
			return;
		}
		var selAll = true;
		for ( var i = 0; i < boxes.length; i++) {
			if (boxes[i].checked) {
				boxes[i].checked = "";
				selAll = false;
			} else {
				boxes[i].checked = "checked";
			}
		}
		if (document.getElementById("selectAll")) {
			if (selAll) {
				document.getElementById("selectAll").checked = true;
			} else {
				document.getElementById("selectAll").checked = false;
			}
		}
	}

	checkbox.getAllSelectedValues = function(subname) {
		var array = new Array();
		var boxes = document.getElementsByName(subname);
		if (!boxes) {
			return array;
		}
		for ( var i = 0; i < boxes.length; i++) {
			if (boxes[i].checked) {
				array[array.length] = boxes[i].value;
			}
		}
		return array;

	}
//	var input.getAllValuesByName = function(subname) {
//		var array = new Array();
//		var boxes = document.getElementsByName(subname);
//		if (!boxes) {
//			return array;
//		}
//		for (var i = 0; i < boxes.length; i++) {
//			array[array.length] = boxes[i].value;
//		}
//		return array;
//
//	}
	String.prototype.replaceAll = function(src, target) {
		raRegExp = new RegExp(src, "g");
		return this.replace(raRegExp, target);
	}

	String.prototype.endWith = function(str) {
		if (str == null || str == "" || this.length == 0
				|| str.length > this.length)
			return false;
		if (this.substring(this.length - str.length) == str)
			return true;
		else
			return false;
	}

	String.prototype.startWith = function(str) {
		if (str == null || str == "" || this.length == 0
				|| str.length > this.length)
			return false;
		if (this.substr(0, str.length) == str)
			return true;
		else
			return false;
	}
	String.prototype.isChiness = function() {
		var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
		return reg.test(this);
	}


/*Date.stringToDate = function(str) {
	var tempDate = new Date();
	var strArr = str.split(" ");
    alert("str"+str);
	var strArr1 = strArr[0].split("-");
	alert("strArr1"+strArr1);
	tempDate.setYear(parseInt(strArr1[0]));
	tempDate.setMonth(parseInt(strArr1[1])-1);
	tempDate.setDate(parseInt(strArr1[2]));

	try {
		if (strArr[1].length > 0) {
			var strArr2 = strArr[1].split(":");

			tempDate.setHours(parseInt(strArr2[0]));
			tempDate.setMinutes(parseInt(strArr2[1]));
			tempDate.setSeconds(parseInt(strArr2[2]));

		}
	} catch (E) {
	}
	alert("tempDate"+tempDate);
	return tempDate;
}
*/

String.prototype.toDate = function(style) {
	 if (style == null) style = 'yyyy-MM-dd hh:mm:ss';
	 var o = {
		        'y+' : 'y',
		        'M+' : 'M',
		        'd+' : 'd',
		        'h+' : 'h',
		        'm+' : 'm',
		        's+' : 's'
		  };
	 var result = {
		        'y' : '',
		        'M' : '',
		        'd' : '',
		        'h' : '00',
		        'm' : '00',
		        's' : '00'
		    }
	 var tmp = style;
	    for (var k in o) {
	         if (new RegExp('(' + k + ')').test(style)) {
	            result[o[k]] = this.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
	        }
	    }
	return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);   
}
	CommonUtil.getCheckBoxValue = function(type, pro) {
		var arr = document.getElementsByName(type);
		var array = new Array();
		for ( var i = 0; i < arr.length; i++) {
			var property = arr[i].getAttribute("property");
			if (property == pro) {
				if (arr[i].checked) {
					array.push(arr[i].value);
				}
			}
		}
		return array.join(",");
	}
	CommonUtil.setCheckBoxValue = function(type, pro, strValues) {
		var array1 = strValues.split(",");
		var arr = document.getElementsByName(type);
		for ( var i = 0; i < arr.length; i++) {
			var property = arr[i].getAttribute("property");
			if (property == pro) {
				for ( var j = 0; j < array1.length; j++) {
					if (arr[i].value == array1[j]) {
						arr[i].checked = true;
						break;
					}

				}
			}
		}
	}

	// 填充Select控件
	CommonUtil.fillSelect = function(list, listInfo, container, size) {
		this.resetSelect(container, size);
		var selectObj = document.getElementById(container);
		var length = list.length;
		for ( var i = 0; i < length; i++) {
			var obj = list[i];
			var op = new Option(obj[listInfo.value], obj[listInfo.key]);
			selectObj.options.add(op);
		}
	}
	
	
	/**
	 *  设置td里面的值
	 */
	CommonUtil.setDetailObject2 = function(name, obj) {
		var tableObj = document.getElementById(name);
		var objArr = tableObj.getElementsByTagName("td");
		for ( var i = 0; i < objArr.length; i++) {
			var property = objArr[i].getAttribute("property");
			var subproperty = objArr[i].getAttribute("subproperty");
			var innerHTML = "";
			if (obj[property] == null) {
				innerHTML = "";
			} else {
				if (subproperty != null) {
					if (obj[property][subproperty] == null) {
						innerHTML = "";
					} else {
						innerHTML = obj[property][subproperty];
					}
				} else {
					innerHTML = obj[property];
				}
			}

			objArr[i].innerHTML = innerHTML;
		}
	}
	// 重置Select控件
	CommonUtil.resetSelect = function(container, size) {
		document.getElementById(container).options.length = size;
	}

	function getFileType(name) {
		var pIndex = name.lastIndexOf(".");
		var postFixT = "undefined";
		if (pIndex > 0) {
			postFixT = name.substring(pIndex + 1, name.length);
		}
		postFixT = postFixT.toLowerCase();
		return postFixT;
	}
	CommonUtil.isImageFile = function(name) {
		var imageFilePromiss = "gif,jpg,bmp,png";
		return (imageFilePromiss.indexOf(getFileType(name)) >= 0);
	}
	CommonUtil.isInteger = function(num) {
		var isInteger = /^\d+$/;
		return isInteger.test(num)
	}
	CommonUtil.isUrl = function(url) {
		var reg = new RegExp("^[a-zA-z]+://*");
		return reg.test(url);
	}
	CommonUtil.isEmail = function(email) {
		var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		return reg.test(email);
	}
	// wangxu只能由中文、字母、数字以及下划线组成
	CommonUtil.isKeyWord = function(key) {
		var reg = /^[0-9a-zA-Z_\u0391-\uFFE5]+$/;
		return reg.test(key);
	}
	// wangxu验证时间 格式为YYYY-MM-DD hh:mm:ss
	CommonUtil.isDateTime = function(str) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		var r = str.match(reg);
		if (r == null)
			return false;
		var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
		return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3]
				&& d.getDate() == r[4] && d.getHours() == r[5]
				&& d.getMinutes() == r[6] && d.getSeconds() == r[7]);
	}
	CommonUtil.resizeIFrameHeight = function(obj) {
		var win = obj;
		if (document.getElementById) {
			if (win && !window.opera) {
				if (win.contentDocument && win.contentDocument.body.offsetHeight)
					win.height = win.contentDocument.body.offsetHeight;
				else if (win.Document && win.Document.body.scrollHeight)
					win.height = win.Document.body.scrollHeight;
			}
		}
	}

	function HdhtEditorFilter(str) {
		var tempStr = str.replace(/<[a-z][^>]*\s*on[a-z]+\s*=[^>]+/ig,
				function($0, $1) {
					return $0.replace(
							/\s*on[a-z]+\s*=\s*("[^"]+"|'[^']+'|[^\s]+)\s*/ig, "");
				});
		tempStr = tempStr
				.replace(
						/<[a-z][^>]*\s*(href|src)\s*=[^>]+/ig,
						function($0, $1) {
							$0 = $0
									.replace(
											/&#(6[5-9]|[78][0-9]|9[0789]|1[01][0-9]|12[012]);?/g,
											function($0, $1) {
												return String.fromCharCode($1);
											});
							return $0
									.replace(
											/\s*(href|src)\s*=\s*("\s*(javascript|vbscript):[^"]+"|'\s*(javascript|vbscript):[^']+'|(javascript|vbscript):[^\s]+)/ig,
											"");
						});
		tempStr = tempStr
				.replace(
						/<[a-z][^>]*\s*style\s*=[^>]+/ig,
						function($0, $1) {
							$0 = $0
									.replace(
											/&#(6[5-9]|[78][0-9]|9[0789]|1[01][0-9]|12[012]);?/g,
											function($0, $1) {
												return String.fromCharCode($1);
											});
							return $0
									.replace(
											/\s*style\s*=\s*("[^"]+(expression)[^"]+"|'[^']+\2[^']+'|[^\s]+\2[^\s]+)\s*/ig,
											"");
						});
		tempStr = tempStr.replace(/<(script|link|style|iframe)(.|\n)*\/\1>\s*/ig,
				"");
		return tempStr;
	}

	CommonUtil.CompWS = function() {
		var de = document.documentElement, db = document.body;
		var L = (window.pageXOffset || (de && de.scrollLeft) || db.scrollLeft || 0);
		var T = (window.pageYOffset || (de && de.scrollTop) || db.scrollTop || 0);
		var W = (window.innerWidth || (de && de.clientWidth) || db.clientWidth || 0);
		var H = (window.innerHeight || (de && de.clientHeight) || db.clientHeight || 0);
		var pW = (db.scrollWidth || db.offsetWidth || 0);
		var pH = (db.scrollHeight || db.offsetHeight || 0);
		return {
			top :T,
			left :L,
			width :W,
			height :H,
			pWidth :pW,
			pHeight :pH
		};
	}

	// 自定义一个StringBuffer类。以便提高String的连接字符串性能
	function StringBuffer() {
		this._strings = new Array;
	}
	StringBuffer.prototype.append = function(str) {
		this._strings.push(str);
	}
	StringBuffer.prototype.toString = function() {
		return this._strings.join("");
	}

	CommonUtil.open = function(url, args, w, h) {
		var reandomId = ("_" + Math.random() + "_").replace("0.", "_");
		var diag = new parent.FDialog("Diag" + reandomId);
		var sb = new StringBuffer();
		var j = 0;
		if (args) {
			for ( var k in args) {
				sb.append(((j == 0) ? "?" : "&") + k + "=" + args[k]);
				j++;
			}
		}
		var comp = new CommonUtil.CompWS();
		diag.Width = w ? w : (comp.width - 60);
		diag.Height = h ? h : comp.height;
		diag.Title = "查看";
		diag.URL = url + sb.toString();
		diag.OKEvent = function() {
		}
		diag.show();
	}
	/**
	 * 表单提交地址,提交的数据
	 */
	CommonUtil.downloadForm = function(url,submitData){
		var hid_form = "hidden_download_form";
		$("#"+hid_form).remove();
		var html = [];
		html.push("<form name='"+hid_form+"' id='"+hid_form+"' action='"+url+"' method='post' style='display: none'>");
		html.push("<input type='hidden' name='token' value='"+tokenUser.token+"'/>");
		html.push("<input type='hidden' name='projectId' value='"+User_Curr_ProjectId+"'/>");
		for(var i in submitData){
			html.push("<input type='hidden' name='"+i+"' value='"+submitData[i]+"'>");
		}
		html.push("</form>");
		$(document.body).append(html.join(""));
		$("#"+hid_form).submit();
	};
	function queryList_(json,arr,childField) {
	    for (var i = 0; i < json.length; i++) {
	        var sonList = json[i][childField];
	        if (!sonList||sonList.length == 0) {
	            arr.push(json[i]);
	        } else {
	        	queryList_(sonList, arr);
	        }
	    }
	}
	CommonUtil.getAllNodes=function(list,childField){
		var ret = [];
		for (var i = 0; i < list.length; i++) {
	        var data = list[i];
	        ret.push(data);
	        var children = data[childField];
	        if(children&&children.length>0){
	        	queryList_(children, ret);
	        }
	    }
		return ret;
	};
	window.CommonUtil = CommonUtil;
	window.checkbox = checkbox;
})()