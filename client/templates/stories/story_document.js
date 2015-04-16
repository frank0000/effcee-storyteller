Template.storyDocument.helpers({
  ownStory: function() {
    return this.userId == Meteor.userId();
  },
  collaboratorsList: function() {
    if (!this.collaborators || this.collaborators.length === 0) {
      return "";
    }
    return this.collaborators.reduce(function(cum, cur) { 
      return (cum === ""? cur.username : cum + ", " + cur.username); 
    }, "");
  }
});

Template.storyDocument.events({
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this story?")) {
      var currentStoryId = this._id;
      Stories.remove(currentStoryId);
      Router.go('storiesList');
    }
  }
});