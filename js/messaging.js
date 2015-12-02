//Messaging.js

Messaging = new (function(){
	var types = {};
	var responseHandlers = {};
	
	this.registerType = function(typename,type){
		type.prototype["@type"] = typename;
		types[typename] = type;
	}
	this.constructType = function(raw){
		var type = types[raw["@type"]];
		if(type){
			var obj = new type();
		}
		else{
			console.log("Type cannot be constructed from object. No registered type for '@type':'"+raw["@type"]+"'");
			var obj = new Object();
		}
		for(var key in raw){
			var value = raw[key];
			if(value instanceof Object && value["@type"]){
				obj[key] = Messaging.constructType(value);
			}
			else if(value instanceof Array){
				for(var i=0; i<value.length; i++){
					var subvalue = value[i];
					if(subvalue instanceof Object && subvalue["@type"]){
						value[i] = Messaging.constructType(subvalue);
					}
					else{
						value[i] = subvalue;
					}
				}
				obj[key] = value;
			}
			else{
				obj[key] = value;
			}
		}
		return obj;
	}
	this.registerRequest = function(typename,type){
		Messaging.registerType(typename,type);
		type.prototype.send = function(success,fail){
			if(success)
				this.success(success);
			if(fail)
				this.fail(fail);
			Messaging.sendMessage(this);
			return this;
		}
		type.prototype.success = function(callback){
			if(callback){
				this.successCallback = callback;
				return this;
			}
		}
		type.prototype.fail = function(callback){
			if(callback){
				this.failCallback = callback;
				return this;
			}
		}
	}
	this.sendMessage = function(message){
		$.ajax({
			url:"requests",
			type:"post",
			data:JSON.stringify(Messaging.insertInheritedProperties(message)),
			dataType:"json",
			success:function(data){
				var resp = Messaging.constructType(data);
				Messaging.defaultCallback(resp,message);
			}
		});
	}
	this.registerDefaultResponseHandler = function(type,handler){
		var typename = type.prototype["@type"];
		responseHandlers[typename] = handler;
	}
	this.defaultCallback = function(response,request){
		if(request.successCallback)
			request.successCallback(response,request);
		else if(responseHandlers[response["@type"]])
			responseHandlers[response["@type"]](response,request);
		else
			console.log("No default response handler for @type:'"+response["@type"]+"'");
	}
	
	this.insertInheritedProperties = function(object){
		for(var protoKey in object.__proto__){
			var protoVal = object.__proto__[protoKey];
			object[protoKey] = protoVal;
			
		}
		for(var key in object){
			var value = object[key];
			if(value instanceof Object){
				object[key] = Messaging.insertInheritedProperties(value);
			}
			if(value instanceof Array){
				for(var i=0; i<value.length; i++){
					value[i] = Messaging.insertInheritedProperties(value[i]);
				}
			}
		}
		return object;
	}
	
	return this;
})();


BatchRequest = function(requests){
	this.requests = requests;
}
Messaging.registerRequest("srl.distributed.messages.BatchRequest",BatchRequest);

BatchResponse = function(){
	this.responses = [];
}
Messaging.registerType("srl.distributed.messages.BatchResponse",BatchResponse);

Messaging.registerDefaultResponseHandler(BatchResponse,function(response,request){
	for(var i=0; i<response.responses.length; i++){
		Messaging.defaultCallback(response.responses[i],request.requests[i]);
	}
});

