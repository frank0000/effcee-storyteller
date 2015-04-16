Template.storyPage.helpers({
  passages: function() {
    return Passages.find({storyId: this._id});
  },
  currentUserIsCollaborator: function() {
    if (Meteor.user() === null) {
      return false;
    } 
    if (Meteor.user()._id === this.userId) {
      return true;
    }
    if (Stories.findOne({'_id': this._id, 'collaborators.userid': Meteor.user()._id})) {
      return true;
    }
    return false;
  }
});