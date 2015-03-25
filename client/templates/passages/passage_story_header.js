Template.passageStoryHeader.helpers({
  ownStory: function() {
    return this.userId == Meteor.userId();
  },
  storyTitle: function() {
    console.log("storyTitle - this", this);
    return Stories.findOne({_id: this.storyId}).title;
  },
  storyAuthor: function() {
    return Stories.findOne({_id: this.storyId}).author;
  },
});