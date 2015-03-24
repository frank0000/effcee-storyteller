Meteor.publish('stories', function() {
  return Stories.find();
});

Meteor.publish('passages', function(storyId) {
  check(storyId, String);
  return Passages.find({storyId: storyId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});