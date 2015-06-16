Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) && 
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

// Logger = require('pince');
// notLogger = new Logger('notifications');

createActivityNotification = function(activity) {
  var story = Stories.findOne(activity.storyId);
  
  addActivityNotificationForUser(activity, story.userId);
  addActivityNotificationForUser(activity, activity.targetUserId);

  if (story.collaborators) {
    story.collaborators.forEach(function(collab) {
      addActivityNotificationForUser(activity, collab.userId);
    });
  }
};

addActivityNotificationForUser = function(activity, userId) {
  if (userId == null || activity.userId === userId) {
    return;
  }
  if (Notifications.findOne({activityId: activity._id, userId: userId})) {
    return;
  }
  Notifications.insert({
    userId: userId,
    storyId: activity.storyId,
    passageId: activity.passageId,
    activityId: activity._id,
    activityUserId: activity.userId,
    activityUserName: activity.userName,
    activityTargetUserId: activity.targetUserId,
    activityType: activity.activityType,
    read: false
  });
};
