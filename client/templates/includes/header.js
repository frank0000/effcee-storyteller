Template.header.helpers({
  getAuthoringStoriesCount: function() {
    return getAuthoringStoriesForCurrentUser().count();
  },
  getOwnedStoriesCount: function() {
    return getOwnedStoriesForCurrentUser().count();
  },
  getCollaboratingStoriesCount: function() {
    return getCollaboratingStoriesForCurrentUser().count();
  }
});
