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

  if (story.collaborators) {
    story.collaborators.forEach(function(collab) {
      addActivityNotificationForUser(activity, collab.userId);
    });
  }
};

addActivityNotificationForUser = function(activity, userId) {
  if (activity.userId !== userId) {
    Notifications.insert({
      userId: userId,
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
