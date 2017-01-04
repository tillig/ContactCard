/*********************************
* ContactCard 1.2
* (c)2006 Travis Illig
* http://www.paraesthesia.com
* See readme.txt for usage/license.
**********************************/

var ContactCard = Class.create();
ContactCard.prototype = {
	initialize: function(gamertag, name, emailName, emailDomain, url, description){
		this.Gamertag = this.convertEmptyToNull(gamertag);
		this.Description = this.convertEmptyToNull(description);
		if(this.convertEmptyToNull(emailName) == null || this.convertEmptyToNull(emailDomain) == null){
			this.Email = null;
		}
		else{
			this.Email = emailName + "@" + emailDomain;
		}
		this.Name = this.convertEmptyToNull(name);
		this.Url = this.convertEmptyToNull(url);
	},
	
	convertEmptyToNull: function(str){
		if(str == ""){
			return null;
		}
		return str;
	},
	
	emailHTML: function(){
		if(this.Email == null){
			return null;
		}
		return "<a href=\"mai" + "lto:" + escape(this.Email) + "\">" + this.Email.escapeHTML() + "</a>";
	},
	
	gamertagHTML: function(){
		if(this.Gamertag == null){
			return null;
		}
		return "<iframe src=\"http://gamercard.xbox.com/" + escape(this.Gamertag) + ".card\" scrolling=\"no\" frameBorder=\"0\" height=\"140\" width=\"204\">" + this.Gamertag.escapeHTML() + "</iframe>";
	},
	
	urlHTML: function(){
		if(this.Url == null){
			return null;
		}
		return "<a href=\"" + this.Url + "\">" + this.Url.escapeHTML() + "</a>";
	}
}

var ContactCardTabSet = Class.create();
ContactCardTabSet.prototype = {
	Content: null,
	ContentHTML: "",
	ID: "",
	Tab: null,
	TabText: "",
	initialize: function(){}
}

var ContactCardElementSet = Class.create();
ContactCardElementSet.prototype = {
	initialize: function(element, cardID){
		this.Element = element;
		this.CardID = cardID;
	}
}

var ContactCardProvider = {
	/***
	 BEGIN CONFIGURABLE VALUES
	 ***/
	// Color of the active tab and content background
	ActiveTabColor: "white",
	// Number of pixels that the active tab will extend beyond inactive tabs
	ActiveTabPopout: 2,
	// Base Z index of the contact card
	BaseZIndex: 100,
	// Primary border color
	BorderColor: "black",
	// Primary border width
	BorderWidth: 2,
	// CSS class used for determining which elements are contacts (classname.contactID)
	CSSClass: "contactcard",
	// Font used in contact card display
	FontFamily: "Tahoma, Arial, Helvetica, Sans-Serif",
	// Color of inactive tabs
	InactiveTabColor: "#E0E0E0",
	// Indicates if links that match a contact's URL but are not marked with the
	// CSSClass will be automatically rewritten with a contact card
	RewriteMatchingLinks: true,
	// Amount of padding around the text on each tab
	TabPadding: 3,
	/***
	 END CONFIGURABLE VALUES
	 ***/
	
	ElementCardMap: $A(new Array()),
	HideTimerID: null,
	MouseIsOverElement: false,
	MouseIsOverPopup: false,
	Popup: null,
	PopupTabs: $A(new Array()),
	TabContentHeight: 140,
	TabContentWidth: 204,
	TabHeight: 12,
	TabWidth: 51,
	
	activateTab: function(tabID){
		var tab = null;
		var tabIndex = -1;
		for(i = 0; i < ContactCardProvider.PopupTabs.length; i++){
			var tab = ContactCardProvider.PopupTabs[i];
			if(tab.ID == tabID){
				Element.setStyle(
				tab.Content,
				{
					backgroundColor: ContactCardProvider.ActiveTabColor,
					"z-index": ContactCardProvider.BaseZIndex + 2
				});
				Element.setStyle(
				tab.Tab,
				{
					backgroundColor: ContactCardProvider.ActiveTabColor,
					"z-index": ContactCardProvider.BaseZIndex + 3,
					height: ContactCardProvider.calculateTabHeight(true) + "px"
				});
			}
			else{
				Element.setStyle(
				tab.Content,
				{
					backgroundColor: ContactCardProvider.InactiveTabColor,
					"z-index": ContactCardProvider.BaseZIndex
				});
				Element.setStyle(
				tab.Tab,
				{
					backgroundColor: ContactCardProvider.InactiveTabColor,
					"z-index": ContactCardProvider.BaseZIndex,
					height: ContactCardProvider.calculateTabHeight(false) + "px"
				});
			}
		}
	},
	
	addTab: function(tabID, tabText, contentInnerHTML){
		var content = document.createElement('div');
		content.id = tabID + "_Content";
		Element.setStyle(
		content,
		{
			backgroundColor: ContactCardProvider.ActiveTabColor,
			border: ContactCardProvider.border(),
			height: ContactCardProvider.TabContentHeight + "px",
			left: "0px",
			padding: "0px",
			position: "absolute",
			top: "0px",
			width: ContactCardProvider.TabContentWidth + "px"
		});
		Element.update(content, contentInnerHTML);
		ContactCardProvider.Popup.appendChild(content);
		var tab = document.createElement('div');
		tab.id = tabID + "_Tab";
		Element.setStyle(
		tab,
		{
			"background-color": ContactCardProvider.ActiveTabColor,
			"border-bottom": ContactCardProvider.border(),
			"border-left": ContactCardProvider.border(),
			"border-right": ContactCardProvider.border(),
			cursor: "default",
			height: ContactCardProvider.calculateTabHeight(false) + "px",
			left: (ContactCardProvider.PopupTabs.length * (ContactCardProvider.TabWidth + (2 * ContactCardProvider.TabPadding) + ContactCardProvider.BorderWidth)) + "px",
			overflow: "hidden",
			padding: ContactCardProvider.TabPadding + "px",
			position: "absolute",
			top: ContactCardProvider.TabContentHeight + ContactCardProvider.BorderWidth + "px",
			width: ContactCardProvider.TabWidth + "px"
		});
		Element.update(tab, tabText);
		ContactCardProvider.Popup.appendChild(tab);
		Event.observe(tab, "click", ContactCardProvider.tabClick, false);
		var tabContentSet = new ContactCardTabSet();
		tabContentSet.ID = tabID;
		tabContentSet.Tab = tab;
		tabContentSet.Content = content;
		tabContentSet.TabText = tabText;
		tabContentSet.ContentHTML = contentInnerHTML;
		ContactCardProvider.PopupTabs.push(tabContentSet);
	},
	
	appendTrailingSlash: function(url){
		if(url == null){
			return null;
		}
		if(url == ""){
			return "";
		}
		if(url.lastIndexOf("/") != url.length - 1){
			return url + "/";
		}
		return url;
	},
	
	body: function(){
		return document.body ? document.body : document.documentElement;
	},
	
	border: function(){
		return ContactCardProvider.BorderWidth + "px solid " + ContactCardProvider.BorderColor;
	},
	
	calculateTabHeight: function(isActive){
		if(isActive){
			return ContactCardProvider.TabHeight + ContactCardProvider.ActiveTabPopout;
		}
		return ContactCardProvider.TabHeight;
	},
	
	clearCard: function(){
		ContactCardProvider.Popup.innerHTML = "";
		ContactCardProvider.PopupTabs = $A(new Array());
	},
	
	connect: function(){
		Event.observe(window, "load", ContactCardProvider.init, false);
	},
	
	createCard: function(){
		ContactCardProvider.Popup = document.createElement('div');
		ContactCardProvider.Popup.id = "ContactCardPopup";
		Element.setStyle(
		ContactCardProvider.Popup,
		{
			"font-family": ContactCardProvider.FontFamily,
			"font-size": "11px",
			height: ContactCardProvider.TabContentHeight + ContactCardProvider.TabHeight + (2* ContactCardProvider.TabPadding) + ContactCardProvider.ActiveTabPopout + (2 * ContactCardProvider.BorderWidth) + "px",
			padding: "0px",
			position: "absolute",
			width: ContactCardProvider.TabContentWidth + (2 * ContactCardProvider.BorderWidth) + "px",
			"z-index": ContactCardProvider.BaseZIndex
		});
		ContactCardProvider.hideCard();
		ContactCardProvider.body().appendChild(ContactCardProvider.Popup);
		Event.observe(ContactCardProvider.Popup, "mouseover", ContactCardProvider.mouseOverPopup, false);
		Event.observe(ContactCardProvider.Popup, "mouseout", ContactCardProvider.mouseOutPopup, false);
	},
	
	createContentDiv: function(){
		var container = document.createElement("div");
		Element.setStyle(
		container,
		{
			background: ContactCardProvider.ActiveTabColor,
			height: ContactCardProvider.TabContentHeight + "px",
			width: ContactCardProvider.TabContentWidth + "px"
		});
		return container;
	},
	
	createStdItemDiv: function(header, text){
		var retVal = document.createElement("div");
		Element.setStyle(
		retVal,
		{
			padding: "3px"
		});
		var retValHTML = "";
		if(header != null){
			retValHTML += "<b>" + header + "</b>: ";
		}
		if(text != null){
			retValHTML += text;
		}
		if(retValHTML != ""){
			retVal.innerHTML = retValHTML;
		}
		return retVal;
	},
	
	createStdItemHeader: function(header, text){
		var retVal = ContactCardProvider.createStdItemDiv(header, text);
		Element.setStyle(
		retVal,
		{
			"border-bottom": "1px solid " + ContactCardProvider.BorderColor,
			"font-size": "13px",
			"font-weight": "bold",
			"margin-bottom": "3px",
			"margin-left": "0px",
			"margin-right": "0px",
			"margin-top": "0px"
		});
		return retVal;
	},
	
	createProfileHTML: function(card){
		var emailHTML = card.emailHTML();
		var urlHTML = card.urlHTML();
		if(card.Name == null && card.Description == null && emailHTML == null && urlHTML == null){
			return null;
		}
		
		var container = ContactCardProvider.createContentDiv();
		var name = ContactCardProvider.createStdItemHeader(null, card.Name == null ? "[No Name]" : card.Name);
		container.appendChild(name);
		if(emailHTML != null){
			var emailDiv = ContactCardProvider.createStdItemDiv("Email", emailHTML);
			container.appendChild(emailDiv);
		}
		if(urlHTML != null){
			var urlDiv = ContactCardProvider.createStdItemDiv("URL", urlHTML);
			container.appendChild(urlDiv);
		}
		if(card.Description != null){
			var descDiv = ContactCardProvider.createStdItemDiv(null, card.Description);
			container.appendChild(descDiv);
		}
		var returnContainer = document.createElement("div");
		returnContainer.appendChild(container);
		var retVal = returnContainer.innerHTML;
		return retVal;
	},
	
	createXFNHTML: function(element){
		var foundRelationship = ContactCardXFNParser.getRelationships(element);
		if(foundRelationship.length < 1){
			return null;
		}
		var container = ContactCardProvider.createContentDiv();
		var header = ContactCardProvider.createStdItemHeader(null, "XHTML Friends Network");
		container.appendChild(header);
		container.appendChild(ContactCardProvider.createStdItemDiv("Relationships", foundRelationship.join(", ")));
		container.appendChild(ContactCardProvider.createStdItemDiv("Definitions", "<a href=\"http://gmpg.org/xfn/11\" target=\"_blank\">http://gmpg.org/xfn/11</a>"));
		var returnContainer = document.createElement("div");
		returnContainer.appendChild(container);
		var retVal = returnContainer.innerHTML;
		return retVal;
	},
	
	hideCard: function(){
		if(!ContactCardProvider.MouseIsOverElement && !ContactCardProvider.MouseIsOverPopup){
			Element.hide(ContactCardProvider.Popup);
		}
	},
	
	init: function(){
		ContactCardProvider.createCard();
		ContactCardProvider.rewritePage();
	},
	
	mouseOutElement: function(event){
		ContactCardProvider.MouseIsOverElement = false;
		ContactCardProvider.startHideTimer();
	},
	
	mouseOutPopup: function(event){
		ContactCardProvider.MouseIsOverPopup = false;
		ContactCardProvider.startHideTimer();
	},
	
	mouseOverPopup: function(event){
		ContactCardProvider.MouseIsOverPopup = true;
	},
	
	position: function(event){
		var currentElement = Event.element(event);
		var currentElementDimensions = Element.getDimensions(currentElement);
		
		var left = 0;
		if(event.pageX){
			left = event.pageX;
		}
		else{
			left = event.clientX + ContactCardProvider.body().scrollLeft;
		}
		left = left - 20;
		
		var top = Position.cumulativeOffset(currentElement)[1] + currentElementDimensions.height - 2;

		var docbody = ContactCardProvider.positionElement();
		var rightedge = 0;
		if(docbody.clientWidth){
			rightedge = docbody.clientWidth;
		}
		else{
			rightedge = docbody.innerWidth - 20;
		}
		var bottomedge = docbody.scrollTop;
		if(docbody.clientHeight){
			bottomedge += docbody.clientHeight;
		}
		else{
			bottomedge += docbody.innerHeight;
		}
		
		var popupDimensions = Element.getDimensions(ContactCardProvider.Popup);

		if(top + popupDimensions.height > bottomedge){
			top = Position.cumulativeOffset(currentElement)[1] - popupDimensions.height + 5;
		}
		if(top < 5){
			top = 5;
		}

		if(left + popupDimensions.width > rightedge + 5){
			left = rightedge - 5 - popupDimensions.width;
		}
		if(left < 5){
			left = 5;
		}
		
		Element.setStyle(
		ContactCardProvider.Popup,
		{
			left: left + "px",
			top: top + "px"
		});
	},
	
	positionElement: function(){
		return document.documentElement ? document.documentElement : document.body;
	},
	
	removeTab: function(tabID){
		var originalTabs = ContactCardProvider.PopupTabs;
		ContactCardProvider.clearCard();
		for(i = 0; i < originalTabs.length; i++){
			if(originalTabs[i].ID != tabID){
				ContactCardProvider.addTab(originalTabs[i].ID, originalTabs[i].TabText, originalTabs[i].ContentHTML);
			}
		}
	},
	
	rewritePage: function(){
		var allElements = document.getElementsByTagName("*");
		var elements = $A(allElements);
		elements.each(function(element){
			var classNames = Element.classNames(element);
			var contactID = "";
			var contactClass = "";
			var fixupCss = false;
			classNames.each(function(className){
				if(contactID != ""){
					return;
				}
				if(className.indexOf(ContactCardProvider.CSSClass + ".") == 0){
					contactClass = className;
					contactID = contactClass.substring(ContactCardProvider.CSSClass.length + 1, contactClass.length);
					fixupCss = true;
					return;
				}
			});
			if(contactID == "" && ContactCardProvider.RewriteMatchingLinks && element.tagName.toLowerCase() == "a"){
				var contactkeys = ContactCardList.keys();
				for(var i = 0; i < contactkeys.length && contactID == ""; i++){
					var contacturl = ContactCardProvider.appendTrailingSlash(ContactCardList[contactkeys[i]].Url);
					var elementurl = ContactCardProvider.appendTrailingSlash(element.href);
					if(contacturl != null && elementurl != null){
						if(contacturl == elementurl){
							contactID = contactkeys[i];
						}
					}
				}
			}
			if(contactID == ""){
				var XFNRelationships = ContactCardXFNParser.getRelationships(element);
				if(XFNRelationships.length < 1){
					return;
				}
			}
			if(fixupCss){
				Element.removeClassName(element, contactClass);
				Element.addClassName(element, ContactCardProvider.CSSClass);
			}
			if(element.tagName.toLowerCase() != "a"){
				Element.setStyle(element, {cursor: "default"});
			}
			Event.observe(element, "mouseout", ContactCardProvider.mouseOutElement, false);
			Event.observe(element, "mouseover", ContactCardProvider.showCard, false);
			var elementCardSet = new ContactCardElementSet(element, contactID);
			ContactCardProvider.ElementCardMap.push(elementCardSet);
		});
	},
	
	showCard: function(event){
		ContactCardProvider.MouseIsOverElement = true;
		ContactCardProvider.clearCard();
		var element = Event.element(event);
		var card = null;
		for(i = 0; i < ContactCardProvider.ElementCardMap.length; i++){
			if(ContactCardProvider.ElementCardMap[i].Element == element){
				card = ContactCardList[ContactCardProvider.ElementCardMap[i].CardID];
			}
		}
		if(card != null){
			var profileHTML = ContactCardProvider.createProfileHTML(card);
			if(profileHTML != null){
				ContactCardProvider.addTab("profile", "Profile", profileHTML);
			}
			var gamertagHTML = card.gamertagHTML();
			if(gamertagHTML != null){
				ContactCardProvider.addTab("gamercard", "Gamercard", gamertagHTML);
			}
		}
		var xfnHTML = ContactCardProvider.createXFNHTML(element);
		if(xfnHTML != null){
			ContactCardProvider.addTab("xfn", "XFN", xfnHTML);
		}
		if(ContactCardProvider.PopupTabs.length > 0){
			ContactCardProvider.activateTab(ContactCardProvider.PopupTabs[0].ID);
			ContactCardProvider.position(event);
			Element.show(ContactCardProvider.Popup);
		}
	},
	
	startHideTimer: function(){
		if(ContactCardProvider.HideTimerID){
			clearTimeout(ContactCardProvider.HideTimerID);
			ContactCardProvider.HideTimerID = null;
		}
		ContactCardProvider.HideTimerID = setTimeout("ContactCardProvider.hideCard()", 25);
	},
	
	tabClick: function(event){
		var clickedTab = Event.element(event);
		for(i = 0; i < ContactCardProvider.PopupTabs.length; i++){
			var currentTab = ContactCardProvider.PopupTabs[i];
			if(currentTab.Tab == clickedTab){
				ContactCardProvider.activateTab(currentTab.ID);
			}
		}
	}
};

var ContactCardXFNParser = {
	Relationships: $A(["friend", "acquaintance", "contact", "met", "co-worker", "colleague", "co-resident", "neighbor", "child", "parent", "sibling", "spouse", "kin", "muse", "crush", "date", "sweetheart", "me"]),

	getRelationships: function(element){
		var retVal = new Array();
		if(element == null || element.tagName == null || element.tagName.toLowerCase() != "a"){
			return retVal;
		}
		var rel = element.getAttribute("rel");
		if(rel == null || rel == ""){
			return retVal;
		}
		var relArray = rel.split(" ");
		if(relArray.length < 1){
			return retVal;
		}
		for(var i = 0; i < relArray.length; i++){
			if(ContactCardXFNParser.Relationships.indexOf(relArray[i]) >= 0){
				retVal.push(relArray[i]);
			}
		}
		return retVal;
	}
};

var ContactCardList = $H({});
ContactCardProvider.connect();
