HTMLElement.prototype.ExtendEvents = function () {
    var thisElement = this;
    thisElement.style.position = "relative";
    thisElement.style.zIndex = "0";

    thisElement.Redraw = function (e) {
        if (thisElement.value) thisElement.setAttribute("Empty", "");
        else thisElement.removeAttribute("Empty");

        if (thisElement.ownerDocument.activeElement == thisElement) thisElement.setAttribute("Focused", "");
        else thisElement.removeAttribute("Focused");

        if (thisElement.isValid) {
            if (thisElement.isValid(this.value)) thisElement.setAttribute("Valid","");
            else thisElement.removeAttribute("Valid");
        }		
    }



    thisElement.Redraw(null);
    this.addEventListener("input", thisElement.Redraw);
    this.addEventListener("paste", thisElement.Redraw);
    this.addEventListener("focus", thisElement.Redraw);
    this.addEventListener("blur", thisElement.Redraw);
}

HTMLElement.prototype.setMenu = function () {	
    this.Clear = function () {
        this.Selected = undefined;
        this.innerHTML = "";
        this.setAttribute("Count", 0)
    }

    this.onkeydown = function (e) {
        //console.log(e);
        if (e.keyCode == 40) {
            this.Select(+1);
        }
        if (e.keyCode == 38) {
            this.Select(-1);
        }
        if (e.keyCode == 13) {			
            this.Click();			
        }
    }


    this.Select = function (e) {

        //console.log(typeof(e));
        if (typeof (e) == "number") {				
            if (e < 0) {
                if (!this.Selected) 
                    this.Select(this.lastElementChild);
                else if (this.Selected && this.Selected.previousSibling)
                    this.Select(this.Selected.previousSibling);
                else
                    this.Select(null);
            }
            if (e > 0) {
                if (this.Selected && this.Selected.nextSibling)
                    this.Select(this.Selected.nextSibling);
                else
                    this.Select(this.firstElementChild);
            }
            return;
        }

        if (typeof(e) == "object") {
            if (this.Selected && this.Selected != e) {
                //this.Selected.className = this.Selected.classNameDefault;
                this.Selected.removeAttribute("Selected");
            }

            this.Selected = e;
            if (e) {
                //e.className = e.classNameDefault + " Selected";
                e.setAttribute("Selected", "");
            }
        }
    }

    this.Click = function (o) {
        if (!o) o = this.Selected;
        if (!o) o = this.defaultOption;
        
        var ce = new CustomEvent("Option");
        ce.Option = o;
        this.dispatchEvent(ce);
        o.tabIndex = 0;
        o.focus();
        return o;

    }

    this.addOption = function (index, source) {
        if (typeof source === "object") {
            n = this.appendChild(source);
        } else {
            n = this.appendChild(document.createElement("div"));
            if (source) n.innerHTML = source;
        }
        n.parentMenu = this;
        n.className = "Option";
        
        n.addEventListener("mouseover", function (e) {
                this.parentMenu.Select(this);
        });		
        n.addEventListener("click", function (e) {
            this.parentMenu.Click(this);
        });
        this.setAttribute("Count", parseInt(this.getAttribute("Count")) + 1);
        return n;
        
    }
    this.Clear();

}