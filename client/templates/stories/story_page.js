Template.storyPage.helpers({
  passages: function() {
    return Passages.find({storyId: this._id});
  }
});