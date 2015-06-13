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
    } else {
      activityLabel += " to";
    }
    return activityLabel;
  },
  notificationStoryTitle: function() {
    return Stories.findOne({_id: this.storyId}).title;
  }
})

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
})