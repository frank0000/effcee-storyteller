var getAuthorsOptionList = function(story) {
  var authorsList = [];
  authorsList.push({text: story.author, value: story.userId});
  story.collaborators.forEach(function(collab) {
    authorsList.push({text: collab.userName, value: collab.userId});
  });
  
  return authorsList;
};

getCurrentAuthor = function(story) {
  return (story.currentAuthorId? story.currentAuthorId : story.userId);
};

var getSubmitCurrentAuthorFunction = function(story) {
  var selfStory = story;
  return function(inputValue) {
    console.log("submit author - ", inputValue);
    if (!inputValue || inputValue === selfStory.currentAuthorId) {
      return;
    }
    // TODO: see if can do this using IDs straight, not looking for IDs from names
    var storyProperties = {_id: selfStory._id, currentAuthorId: inputValue};
    Meteor.call('storyUpdate', storyProperties, function(error, result) {
      // display the error to the user and abort
      if (error) {
        return Errors.throw(error.reason);
      }
    });
  }
};

Template.storyDocument.helpers({
  options: function() {
    return {
      type: 'select',
      position: 'bottom',
      value: getCurrentAuthor(this),
      source: getAuthorsOptionList(this),
      onsubmit: getSubmitCurrentAuthorFunction(this)
    };
  },
  ownStory: function() {
    return this.userId == Meteor.userId();
  },
  collaboratorsList: function() {
    if (!this.collaborators || this.collaborators.length === 0) {
      return "";
    }
    return this.collaborators.reduce(function(cum, cur) { 
      return (cum === ""? cur.userName : cum + ", " + cur.userName); 
    }, "");
  },
  getCurrentAuthorName: function() {
    return this.currentAuthorName;
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
