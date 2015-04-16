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