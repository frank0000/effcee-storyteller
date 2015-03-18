Template.storyPage.helpers({
  storyBlurbs: function() {
    return StoryBlurbs.find({storyId: this._id});
  }
});