Template.passagePage.helpers({
  canEditPassage: function() {
    var story = Stories.find({_id: this.storyId});
    return Meteor.userId() === this.userId || Meteor.userId() === story.userId;
  },
  comments: function() {
    return Activities.find({passageId: this._id, activityType: 'added comment'}, {sort: {timeCompleted: -1}});
  },
  commentsEmpty: function() {
    return (Activities.find({passageId: this._id, activityType: 'added comment'}).count() === 0);
  },
  prevPassagePath: function() {
    if (this.prevPassageId) {
      return Router.routes['passagePage'].path({storyId: this.storyId, _id: this.prevPassageId});
    } else {
      return null;
    }
  },
  nextPassagePath: function() {
    if (this.nextPassageId) {
      return Router.routes['passagePage'].path({storyId: this.storyId, _id: this.nextPassageId});
    } else {
      return null;
    }
  }
});