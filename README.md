# ContactCard

Rewrites any element with a given CSS class to provide a popup card containing contact information.  Also displays XHTML Friends Network information attached to links.

Uses the prototype library from `http://prototype.conio.net/` (now defunct). Yeah, I wrote it back in like 2005/2006 time and never updated it.

# Usage

Using the ContactCard script requires the following steps:

- Define your contacts
- Add JS references to your HTML
- Update HTML to render contact cards

## Define Your Contacts

First, define the list of contacts with respective information in a separate script file.  This script should look like this:

```js
ContactCardList = ContactCardList.merge($H({
	contactID1: new ContactCard(Gamertag1, Name1, EmailName1, EmailDomain1, Url1, Description1),
	contactID2: new ContactCard(Gamertag2, Name2, EmailName2, EmailDomain2, Url2, Description2)
}));
```

Each line in the list defines a contact ID ("contactID1") and a specific contact's information:

- Xbox Live Gamertag
- Name
- Email Address Name
- Email Address Domain
- Web Site URL
- Description

For example, a person named `Joe Smith` who has a Gamertag of `JoeGamer`, an email address `joe@domain.com`, a web site at `http://www.somedomain.com`, and a description of `My friend Joe` might look like this:

```js
ContactCardList = ContactCardList.merge($H({
	joesmith: new ContactCard("JoeGamer", "Joe Smith", "joe", "domain.com", "http://www.somedomain.com", "My friend Joe.")
}));
```

In this case, the ID for Joe Smith is `joesmith` - that will be used in your HTML.

Note that the email address is split into two pieces - email name and email domain.  This is so spam robots can't automatically harvest your contacts' email addresses from the script.

Leave any values you don't want to include or aren't applicable null.  For example, a person who doesn't have a Gamertag or a web site:

```js
ContactCardList = ContactCardList.merge($H({
	joesmith: new ContactCard(null, "Joe Smith", "joe", "domain.com", null, "My friend Joe.")
}));
```

Save the contact definitions in a separate .js file.  This will generally be called `contactcardlist.js`.

## Add JS References To Your HTML

Next, define references in the `<head>` element of your web page to the prototype library, the ContactCard script, and your contact card definitions:

```html
<script type="text/javascript" src="prototype.js"></script>
<script type="text/javascript" src="contactcard.js"></script>
<script type="text/javascript" src="contactcardlist.js"></script>
```

## Update HTML to Render Contact Cards

The contact card script will, by default, find links in your page that match a link associated with a defined contact.  If it finds such a link, a contact card will automatically be associated with it.  You may disable this behavior by setting the "RewriteMatchingLinks" value to false.

If you have other elements you wish to associate with contact cards, or if you disable the automatic link association, then for every element you want to have a popup contact card on, set the CSS class on the element to "contactcard.contactID".  For example, a link that has Joe Smith's popup card might look like:

```html
<a href="http://www.somedomain.com" class="contactcard.joesmith">Joe Smith</a>
```

The ContactCard script will automatically rewrite this to have the popup contact card with the information for ID "joesmith" and will remove the ".joesmith" portion from the CSS class (so every contact card element will end up with a CSS class of "contactcard").

---

# XHTML Friends Network (XFN) Support

ContactCard also recognizes XHTML Friends Network microformat information.  To make use of this microformat, you do not need to do anything special to your HTML for ContactCard, just use XFN as usual:

```html
<a href="http://www.somedomain.com" rel="friend met">Joe Smith</a>
```

ContactCard will recognize the relationships specified in the "rel" attribute and will automatically add a popup viewer for that data.  You can combine this with full contact information to achieve a more robust popup:

```html
<a href="http://www.somedomain.com" class="contactcard.joesmith" rel="friend met">Joe Smith</a>
```

In this case, the link will display both the contact information for Joe Smith as well as the XFN information.

---

# Advanced Configuration

Inside the contactcard.js script you will find a section marked "BEGIN CONFIGURABLE VALUES" that contains several values that can be changed to alter the appearance and behavior of the popup contact card.  Experiment with different values to make the card work for you.  Options include:

- **ActiveTabColor**: Color of the active tab and content background.
- **ActiveTabPopout**: Number of pixels that the active tab will extend beyond inactive tabs.
- **BaseZIndex**: Base Z index of the contact card.
- **BorderColor**: Primary border color.
- **BorderWidth**: Primary border width.
- **CSSClass**: CSS class used for determining which elements are contacts (classname.contactID).
- **FontFamily**: Font used in contact card display.
- **InactiveTabColor**: Color of inactive tabs.
- **RewriteMatchingLinks**: Indicates if links that match a contact's URL but are not marked with the CSSClass will be automatically rewritten with a contact card
- **TabPadding**: Amount of padding around the text on each tab.

---

# Version History

**1.0:** First release.

**1.1:**
- Added support for rendering XFN information for a link without having contact info attached.
- Fixed positioning bug.

**1.2:** Added option to automatically rewrite links that match the URL for a contact.  Enabled by default.