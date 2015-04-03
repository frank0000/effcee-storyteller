Meteor.publish('stories', function() {
  return Stories.find();
});

Meteor.publish('passages', function(storyId) {
  check(storyId, String);
  return Passages.find({storyId: storyId}, {sort: {submitted: 1}});
});

Meteor.publish('activities', function(passageId) {
  check(passageId, String);
  return Activities.find({passageId: passageId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});