document.getElementByxPath = function (path) {
    it = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    ret = new Array();
    var n = it.iterateNext();
    while (n) {
        ret.push(n);
        n = it.iterateNext();
    }	
    return ret;
}

document.QueryToObject = function (s) {
    var n = new Object()
    if (s.indexOf("?") > -1) s = s.substr(s.indexOf("?")+1)
    sa = s.split("&");
    for (sai in sa) {
        ss = sa[sai].split("="); n[ss[0]] = ss[1];
    }
    return n;
}
document.Query = document.QueryToObject(window.location.search);

function trim(s) {
    return s.replace(/^\s+|\s+$/gm,'');
}

function Translator (queryFilter) {
    var me = this;
    this.defaultLang = "en-us";
    this.queryFilter = "*";
    this.Data = null;
    if (queryFilter) this.queryFilter = queryFilter;
    
    this.Init = function () {
        all = document.querySelectorAll(this.queryFilter);
        for(q in all) {      
            q = all[q];
            for (c in q.childNodes) {
                c = q.childNodes[c];
                if (c.nodeType == 3) if (trim(c.data)) c.defaultData = c.data; 
            }            
            if (q.text) q.defaultText = q.text;
        }
        this.loadStrings("Strings");
    }

    this.loadStrings = function (lang) {
        l = new XMLHttpRequest();
        l.Load("index."+lang+".xml").OK = function (r) {
            me.Data = r.responseXML;
        }
    }

    this.Translate = function (lang, text) {
        if (!this.Data) return text;
        ss = this.Data.xPath1("//String[@Text = '"+ text +"']/"+lang);
        if (!ss) return text;
        return ss.textContent;
        
        
    }

    this.TranslateTo = function (lang) {
        
        all = document.querySelectorAll(this.queryFilter);
        for(q in all) {
            q = all[q];
            for (c in q.childNodes) {
                c = q.childNodes[c];
                if (c.nodeType == 3 && c.defaultData) c.data = this.Translate(lang, c.defaultData);
            }
            if (q.defaultText) {
                q.text = this.Translate(lang, q.defaultText);
            }
        }
        
    
    }


    if (document.readyState === "complete") { 
        this.Init();
    } else {
        window.addEventListener("load", function() {
        me.Init();
        me.TranslateTo(me.defaultLang);
        });        
    }
}

document.Translator = new Translator();
document.Translator.defaultLang = "en-us";
