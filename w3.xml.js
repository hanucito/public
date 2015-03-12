HTMLElement.prototype.AjaxMe = function (Url) {
	var a = AjaxElement(this);
	if (Url) a.Call(Url);
	return a;
}
/*
Element.prototype.addEventListener = function (event, callback) {
	if (!this._events) this._events = new Object();
	if (!this._events[event]) this._events[event] = new Array();
	this._events[event].push(callback);
	console.log("Evento agregado");
}
*/

Node.prototype.FromJSON = function (data) {
	for (var ob in data) {
		if (Array.isArray(data[ob])) {
			for (var a = 0; a < data[ob].length; a++) {
				var Child = this.ownerDocument.createElement(ob);
				this.appendChild(Child);
				Child.FromJSON(data[ob][a]);
			}
		} else if (typeof data[ob] == "object") {
			var Child = this.ownerDocument.createElement(ob);
			this.appendChild(Child);
			Child.FromJSON(data[ob]);
			//Node.setAttribute(ob, data[ob]);
		} else {
			this.setAttribute(ob, data[ob]);
		}
	}
}
Node.prototype.childsByType = function (type) {
	if (!type) type = 1;
	var cs = this.childNodes;
	var ret = [];
	for (var c in cs) {
		if (cs[c].nodeType == type) ret.push(cs[c]);
	}
	return ret;
	/*
	if (!type) type = "Element"
	var cs = this.childNodes;
	var ret = [];
	for (var c in cs) {
		if (cs[c].nodeName) ret.push(cs[c]);
	}
	return ret;
	*/
}

Node.prototype.Attribute = function (name) {
	if (!this.hasAttribute(name)) this.setAttribute(name, "");
	return this.getAttributeNode(name);
	
}

Node.prototype.GetString = function () {
	if (this.documentElement) return XMLToString(this.documentElement);
	return XMLToString(this);
}

Node.prototype.xPath1 = function (xPathString) {
	x = xPath(this, xPathString)[0];
	if (x) return x;
	return null;
}

Node.prototype.xPath = function (xPathString) {
	return xPath(this, xPathString);
}

Node.prototype.xText = function (xPathString) {
	x = this.xPath1(xPathString);
	if (x) return x.textContent;
	return null;
}

Node.prototype.xDyn = function (xPathString) {
	xs = xPathString.split("/");
	Create = this.ownerDocument.xPathCreate;

	Current = new Object;
	Current.Parent = this;
	for (x in xs) {
		Current.String = xs[x];
		if (Current.String.substr(0, 1) == "+") {
			Current.String = Current.String.substr(1);
			Current.ForceCreate = true;
		}

		Current.S1 = Current.String.split("[")[0];
		if (Current.String.split("[")[1]) {
			Current.S2 = Current.String.split("[")[1].split("]")[0];
		}

			

		Current.Query = xPath(Current.Parent, Current.String)[0];
		if (!Current.Query || Current.ForceCreate) {
			if (!Create) return null;			
			if (Current.S2 == " ") {
				
			}

			n = this.ownerDocument.createElement(Current.S1);

			Current.Parent.appendChild(n);
			Current.Query = n;
		}
	

		//console.log(Current.Query);

		if (x == xs.length - 1) return Current.Query;

		Child = new Object();
		Child.Parent = Current.Query;
		Current = Child;
		
	}
}

Node.prototype.Remove = function () {
	this.parentNode.removeChild(this);
}



function XMLToString(oXML) {
	if (window.ActiveXObject) {
		return oXML.xml;
	} else { return (new XMLSerializer()).serializeToString(oXML); }
}

XMLHttpRequest.prototype.Load = function (Url) {
	//this.withCredentials = true;
	this.Url = Url;
	//this.ResponseHandlers.OK = Function;
	this.Type = "xml";
	this.Method = "GET";
	if (this.PostData) {
		this.Method = "POST";
	}
	this.onreadystatechange = function () {
		var Response = this;
		if (this.readyState == 4 && this.status == 200 && this.OK) return this.OK(Response);
		return null;
	}
	this.open(this.Method, Url, true);
	//this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	if (this.PostData) {
		//this.setRequestHeader("Access-Control-Allow-Origin", "*");
		//this.setRequestHeader("Content-Length", this.PostData.length);
		if (this.PostDataType == "xml") this.setRequestHeader("Content-Type", "application/xml; charset=UTF-8");
		else this.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	} else {
		this.setRequestHeader("Access-Control-Allow-Origin", "*");
		this.setRequestHeader("Content-Type", "application/xml; charset=UTF-8");
	}
	this.send(this.PostData);    //used for post methods//
	return this;
}
if (!window.ActiveXObject) {
	Node.prototype.selectNodes = function (String) {
		var ownerDocument = this;
		if (this.ownerDocument) ownerDocument = this.ownerDocument;
		var list = ownerDocument.evaluate(String, this, null, 5, null);
		var ret = [];
		var c = list.iterateNext();
		while (c) {
			ret.push(c);
			var c = list.iterateNext();
		}
		return ret;
	}
	Node.prototype.selectSingleNode = function (String) {
		var ownerDocument = this;
		if (this.ownerDocument) ownerDocument = this.ownerDocument;
		var list = ownerDocument.evaluate(String, this, null, 5, null);
		return list.iterateNext();
	}
}

function xPath(Node, String) {
    if (!Node) return null;
	if (window.ActiveXObject) {
		return Node.selectNodes(String);
	} else {
		var ownerDocument = Node.ownerDocument;
		if (!ownerDocument) ownerDocument = Node;


		var list = ownerDocument.evaluate(String, Node, null, 5, null);
		var ret = [];
		var c = list.iterateNext();
		while (c) {
			ret.push(c);
			var c = list.iterateNext();
		}
		return ret;
		//return Node.querySelector(String);
		//var Nodes = Data.documentElement.evaluate();
	}
}





function XmlDocument(data) {
	var doc;
	if (document.implementation && data.charAt(0) != "<") {
		doc = document.implementation.createDocument("", data, null);
		return doc;
	}
	else if (window.DOMParser) {
		if (data.charAt(data.length - 1) != ">") {
			data = data + ">";
		}
		parser = new DOMParser();
		doc = parser.parseFromString(data, "application/xml");
		var r = doc.selectNodes("//parsererror");
		for (var rr in r) r[rr].parentNode.removeChild(r[rr]);
	}
	else // Internet Explorer
	{
		doc = new ActiveXObject("Microsoft.XMLDOM");
		doc.async = "false";
		doc.loadXML(data);
	}
	return doc;
}
function AjaxElement(target) {
	target.Ajax = new AjaxClass();
	target.Ajax.AjaxElement(target);
	target.Ajax.Auto.Target = target;
	target.Ajax.ProcessScripts.Enabled = true;
	return target.Ajax;
}
function AjaxClass() {
	var thisClass = this;
	this.Http = new XMLHttpRequest();
	this.AjaxElement = function (target) {
		if (!target.AjaxCall) {
			target.AjaxCall = function (Url) {
				thisClass.Call(Url, null, 
					function(response) {
						target.innerHTML = response;
					}
				)
			}
		} else {
			target.AjaxCall = null;
		} 
	}
	this.ProcessScripts = function (Data) {
		var s = document.getElementsByTagName('script');
		for (var i = 0; i < s.length; ++i) {
			if (s[i].byAjax == true) {
				s[i].parentNode.removeChild(s[i]);
			}
		}
		Temp = document.createElement("body");
		Temp.innerHTML = Data;
		var s = Temp.getElementsByTagName('script');
		for (var i = 0; i < s.length; ++i) {
			var news = document.createElement('script');
			news.byAjax = true;
			news.innerHTML = s[i].innerHTML;
			if (news.src) news.src = s[i].src;
			s[i].parentNode.removeChild(s[i]);
			--i;
			thisClass.Scripts.push(news);
		}
		return Temp.innerHTML;
	}
	this.ProcessScripts.Enabled = true;

	this.ReCall = function () {
		return this.Call(this.Last.Url, this.Last.fnLoading, this.Last.fnDone);
	}

	this.Call = function (Url, fnLoading, fnDone) {
		var thisClass = this;
		
		if (!fnDone && this.Auto.Target) {
			fnDone = function(data) {
				if (thisClass.Auto.onLoad) return thisClass.Auto.onLoad(data);
				thisClass.Auto.Target.innerHTML = data;
			}
		}
		

		this.Last = new Object();
		this.Last.Url = Url;
		this.Last.fnLoading = fnLoading;
		this.Last.fnDone = fnDone;


		this.Http.Load(Url);
		if (fnLoading) fnLoading(null);
		


		this.Http.OK = function (e) {
			responseText = e.responseText;
			if (thisClass.ProcessScripts.Enabled) {
				thisClass.Scripts = [];
				responseText = thisClass.ProcessScripts(responseText);
			}
			fnDone(responseText);
			if (thisClass.Scripts) {
				for (var i = 0; i < thisClass.Scripts.length; ++i) {
					if (thisClass.Scripts[i].byAjax) {
						document.body.appendChild(thisClass.Scripts[i]);
					}
				}
				thisClass.Scripts = [];
			}
			var evt = document.createEvent('UIEvents');
			evt.initUIEvent('resize', true, false, window, 0);
			window.dispatchEvent(evt);
		}
	}
	this.ClickEvent = function (e) {	
		e = e || window.event;
		var element = e.target || e.srcElement;
		if (e.button != 0) return false;
		var url = "";
		var target = e.target;
		if (target.form && target.tagName == "BUTTON") {
			url = target.form.action;
		} else if (target.form && target.type == "submit") {
			url = target.form.action;
		} else {
			while (true) {
				if (target.href) { break; }
				if (!target.parentNode) return false;
				target = target.parentNode;
			}
			//if (target.href) return false;
			//alert(target.tagName);
			url = target.href;
		}
		if (url.substr(0, 7) == "mailto:") return;
		if (target.getAttribute("Ajax") == "true" || target.getAttribute("target") == "_ajax") {
			console.log ("DEPRECATED attribute: Ajax='true'; use target='_ajax_' instead")
			if (e.target.form) {
				if (e.target.tagName == "BUTTON" || target.type == "submit") {
					thisClass.Http.PostData = getFormString(e.target.form);
				}
			}
			e.preventDefault();
			if (thisClass.Auto.Target) {
				thisClass.Call(url, function (data) {
					if (thisClass.Auto.Target && thisClass.Auto.LoadingContent) {
						thisClass.Auto.Target.innerHTML = thisClass.Auto.LoadingContent.outerHTML;
					}
				}, function (data) {
					if (thisClass.Auto.onLoad) return thisClass.Auto.onLoad(data);
					if (thisClass.Auto.Target) {
						thisClass.Auto.Target.innerHTML = data;
					}
					//alert(data);
				})
			}
			if (target.Ajax) {
				thisClass.Call(url, target.AjaxLoading, target.Ajax);
			}
			return false;
		} else {
			//window.alert("The url is " + url);
			return false;
		}
	}	
	this.Auto = function (Enabled) {
		if (Enabled) {
			document.addEventListener("click", thisClass.ClickEvent, false);
		} else {
			document.removeEventListener("click", thisClass.ClickEvent, false);
		}
	}
	this.Auto.Call = function (url) {
		if (thisClass.Auto.Target) {
			thisClass.Call(url, function (data) {
				if (thisClass.Auto.Target && thisClass.Auto.LoadingContent) {
					thisClass.Auto.Target.innerHTML = thisClass.Auto.LoadingContent.outerHTML;
				}
			}, function (data) {
				if (thisClass.Auto.onLoad) return thisClass.Auto.onLoad(data);
				if (thisClass.Auto.Target) {
					thisClass.Auto.Target.innerHTML = data;
				}
				if (thisClass.Auto.Done) thisClass.Auto.Done();
				//alert(data);
			})
		}
	}
	this.QuickAuto = function (target) {
		thisClass.Auto(true);
		thisClass.Auto.Target = target;
		thisClass.ProcessScripts.Enabled = true;
		thisClass.Auto.LoadingContent = document.createElement("div");
		thisClass.Auto.LoadingContent.innerHTML = target.innerHTML;
	}
}
function getFormString(form) {
	str = "";
	childs = form.elements;
	for (c in childs) {
		child = childs[c];
		if (child.tagName == "INPUT" || child.tagName == "TEXTAREA" || child.tagName == "SELECT") {
			if (child.type == "radio" && !child.checked) continue
			if (str != "") str += "&";
			if (child.getAttribute("datadefault")) {
				str += child.name + "=" + encodeURIComponent(child.uservalue);
			} else {
				str += child.name + "=" + encodeURIComponent(child.value);
			}
		}
	}
	/*
	childs = form.getElementsByTagName("textarea");
	for (c in childs) {
		child = childs[c];
		if (child.tagName == "TEXTAREA") {
			str += child.id + "=" + child.value + "&";
		}		
	}
	*/
	return str;
}
function CleanXMLText(t) {
	t = t.trim().split("\n").join("<br>");
	return t;
}