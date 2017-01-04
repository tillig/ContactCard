ContactCardList = ContactCardList.merge($H({
	// Leave values that you don't want to include as null.
	// Add a comma to the end of each definition EXCEPT the last one.
	//
	// Format for a new contact:
	// contactID: new ContactCard(Gamertag, Name, EmailName, EmailDomain, Url, Description)
	//
	// Examples:
	user1: new ContactCard("Gamertag1", "User One", "user1", "domain1.com", "http://www.domain1.com", "The first user."),
	user2: new ContactCard(null, "User Two", "user2", "domain2.com", null, "The second user."),
	user3: new ContactCard("Gamertag3", "User Three", "user3", "domain3.com", "http://www.domain3.com", "The third user.")
}));
