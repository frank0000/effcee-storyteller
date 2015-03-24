Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) && 
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

createActivityNotification = function(activity) {
  var story = Stories.findOne(activity.storyId);
  //TODO: also notify any other users who have contributed a passage
  if (activity.userId !== story.userId) {
    Notifications.insert({
      userId: story.userId,
      storyId: activity.storyId,
      passageId: activity.passageId,
      activityId: activity._id,
      activityUserId: activity.userId,
      activityUserName: activity.userName,
      activityType: activity.activityType,
      read: false
    });
  }
};