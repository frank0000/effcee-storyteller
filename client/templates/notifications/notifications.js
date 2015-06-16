Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
    return Notifications.find({userId: Meteor.userId(), read: false}).count();
  }
});

Template.notificationItem.helpers({
  notificationStoryPath: function() {
    var selectedStory = Stories.findOne(
      {$and: [{_id: this.storyId},  
        {$or: [{userId: Meteor.userId()}, {'collaborators.userId': Meteor.userId()}, {isPrivate: false}]}
    ]});
    if (!selectedStory) {
      return "#";
    }
    if (this.passageId) {
      return Router.routes.passagePage.path({storyId: this.storyId, _id: this.passageId});
    } 
    if (this.activityType === "added comment") {
      return Router.routes.storyPage.path({_id: this.storyId}) + "#comments";
    }
    return Router.routes.storyPage.path({_id: this.storyId});
  },
  notificationActivityTypeLabel: function() {
    var activityLabel = this.activityType;
    if (this.activityType.startsWith("changed author to")) {
      activityLabel += " for";
    } else if (this.activityType.startsWith("added")) {
      activityLabel += " to";
    } else if (this.activityType.startsWith("removed")) {
      activityLabel += " from";
    }
    if (this.activityTargetUserId === Meteor.userId()) {
      return activityLabel.replace(getUserName(Meteor.user()), "you");
    }
    return activityLabel;
  },
  notificationStoryTitle: function() {
    selectedStory = Stories.findOne({_id: this.storyId});
    if (!selectedStory) {
      return "[private story]";
    }
    return selectedStory.title;
  }
})

Template.notificationItem.events({
  'click a': function() {
    var notificationsListToUpdate = null;
    if (this.passageId) {
      notificationsListToUpdate = 
        Notifications.find({storyId: this.storyId, passageId: this.passageId, userId: Meteor.userId(), read: false});
    } else {
      notificationsListToUpdate = 
        Notifications.find({storyId: this.storyId, userId: Meteor.userId(), read: false});
    }
    notificationsListToUpdate.forEach(function(notification) {
      Notifications.update({_id: notification._id}, {$set: {read: true}});
    });
  }
})