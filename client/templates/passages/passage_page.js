Template.passagePage.helpers({
  canEditPassage: function() {
    var story = Stories.find({_id: this.storyId});
    return Meteor.userId() === this.userId || Meteor.userId() === story.userId;
  }
});