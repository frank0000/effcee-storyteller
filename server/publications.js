Meteor.publish('stories', function() {
  return Stories.find();
});

Meteor.publish('storyBlurbs', function(storyId) {
  check(storyId, String);
  return StoryBlurbs.find({storyId: storyId});
});
