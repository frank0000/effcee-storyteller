Template.storyPage.helpers({
  passages: function() {
    return Passages.find({storyId: this._id});
  },
  currentUserIsCurrentAuthor: function() {
    if (Meteor.user() === null) {
      return false;
    } 
    if (Meteor.user()._id === this.currentAuthorId) {
      return true;
    }
    return false;
  }
});