Template.storyDocument.helpers({
  ownStory: function() {
    return this.userId == Meteor.userId();
  },
});