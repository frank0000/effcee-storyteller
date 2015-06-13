Meteor.publish('stories', function() {
  if (this.userId == null) {
    return Stories.find({isPrivate: false});
  }
  return Stories.find({$or: [{userId: this.userId}, {'collaborators.userId': this.userId}, {isPrivate: false}]});
});

Meteor.publish('passages', function(storyId) {
  check(storyId, String);
  
  // get the story if have proper acccess permission
  var containingStory;
  if (this.userId == null) {
    containingStory = Stories.findOne({_id: storyId, isPrivate: false});
  } else {
    containingStory = Stories.findOne(
      {$and: [{_id: storyId},  {$or: [{userId: this.userId}, {'collaborators.userId': this.userId}, {isPrivate: false}]}]});
  }
  
  if (!containingStory) {
    // story doesn't exist or don't have permission, return empty list of passages
    return Passages.find({storyId: storyId, _id: null});
  }

  // story exists and have permission, get all passages
  return Passages.find({storyId: storyId}, {sort: {submitted: 1}});
});

Meteor.publish('activities', function(params) {
  check(params, {
    storyId: String,
    passageId: Match.Optional(String)
  });

  if (params.passageId) {
    return Activities.find({storyId: params.storyId, passageId: params.passageId});
  } else {
    return Activities.find({storyId: params.storyId});
  }
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('users', function() {
  return Meteor.users.find({});
});