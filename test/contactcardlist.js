ContactCardList = ContactCardList.merge($H({
	// contactID: new ContactCard(Gamertag, Name, EmailName, EmailDomain, Url, Description)
	testuser1: new ContactCard("Paraesthesia", "Test User", "user", "domain.com", "http://www.paraesthesia.com", "This is a test user account."),
	nogamertag: new ContactCard(null, "Test User", "user", "domain.com", "http://www.paraesthesia.com", "This is a test user account."),
	noname: new ContactCard("Paraesthesia", null, "user", "domain.com", "http://www.paraesthesia.com", "This is a test user account."),
	noemailname: new ContactCard("Paraesthesia", "Test User", null, "domain.com", "http://www.paraesthesia.com", "This is a test user account."),
	noemaildomain: new ContactCard("Paraesthesia", "Test User", "user", null, "http://www.paraesthesia.com", "This is a test user account."),
	noemail: new ContactCard("Paraesthesia", "Test User", null, null, "http://www.paraesthesia.com", "This is a test user account."),
	nourl: new ContactCard("Paraesthesia", "Test User", "user", "domain.com", null, "This is a test user account."),
	nodescription: new ContactCard("Paraesthesia", "Test User", "user", "domain.com", "http://www.paraesthesia.com", null),
	nocontact: new ContactCard("Paraesthesia", null, null, null, null, null),
	nothing: new ContactCard(null, null, null, null, null, null)
}));
