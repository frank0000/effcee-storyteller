Template.passageStoryHeader.helpers({
  ownStory: function() {
    return this.userId == Meteor.userId();
  },
  storyTitle: function() {
    return Stories.findOne({_id: this.storyId}).title;
  },
  storyAuthor: function() {
    return Stories.findOne({_id: this.storyId}).author;
  },
});