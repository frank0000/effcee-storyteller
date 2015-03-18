Meteor.publish('stories', function() {
  return Stories.find();
});

Meteor.publish('storyBlurbs', function() {
  return StoryBlurbs.find();
})