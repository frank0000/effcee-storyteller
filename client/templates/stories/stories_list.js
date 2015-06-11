Template.storiesList.helpers({
  stories: function() {
    if (this.filter && this.filter === "author") {
      FlashMessages.sendInfo("You're seeing only the stories you are currently authoring. "
        + "<a href='/'>See all your stories.</a>",
        { autoHide: false });
      return getAuthoringStoriesForCurrentUser();
    }
    if (this.filter && this.filter === "owner") {
      FlashMessages.sendInfo("You're seeing only the stories you own. "
        + "<a href='/'>See all your stories.</a>",
        { autoHide: false });
      return getOwnedStoriesForCurrentUser();
    }
    if (this.filter && this.filter === "collaborator") {
      FlashMessages.sendInfo("You're seeing only the stories you are collaborating on. "
        + "<a href='/'>See all your stories.</a>",
        { autoHide: false });
      return getCollaboratingStoriesForCurrentUser();
    }
    return getAllStoriesForCurrentUser();
  }
});