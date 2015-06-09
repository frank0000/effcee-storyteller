Meteor.publish('stories', function() {
  if (this.userId === null) {
    return Stories.find({isPrivate: false});
  }
  return Stories.find({$or: [{userId: this.userId}, {'collaborators.userId': this.userId}, {isPrivate: false}]});
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

Meteor.publish('users', function() {
  return Meteor.users.find({});
});