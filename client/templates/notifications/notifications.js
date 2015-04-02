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
    return Router.routes.passagePage.path({storyId: this.storyId, _id: this.passageId});
  },
  notificationActivityTypeLabel: function() {
    return this.activityType;
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