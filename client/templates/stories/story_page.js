Template.storyPage.helpers({
  passages: function() {
    return Passages.find({storyId: this._id});
  },
  comments: function() {
    return Activities.find({storyId: this._id, activityType: 'added comment'}, {sort: {timeCompleted: -1}});
  },
  activities: function() {
    return Activities.find({storyId: this._id}, {sort: {timeCompleted: -1}});
  },
  commentsEmpty: function() {
    return (Activities.find({storyId: this._id, activityType: 'added comment'}).count() === 0);
  },
  activitiesEmpty: function() {
    return (Activities.find({storyId: this._id}).count() === 0);
  },
  passagesEmpty: function() {
    return (Passages.find({storyId: this._id}).count() === 0);
  },
  currentUserIsCurrentAuthor: function() {
    if (Meteor.user() === null) {
      return false;
    } 
    if (Meteor.user()._id === this.currentAuthorId) {
      return true;
    }
    return false;
  }
});

Template.storyPage.rendered = function() {
  var selectedTab = (Router.current().params && Router.current().params.hash? Router.current().params.hash : null);
  if (!selectedTab) {
    return;
  }
  if (selectedTab === 'comments') {
    $('.story-single-nav-bar a[href="#comments"]').tab('show');
  }
  if (selectedTab === 'story') {
    $('.story-single-nav-bar a[href="#story"]').tab('show');
  }
};