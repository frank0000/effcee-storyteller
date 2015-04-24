var getAuthorsOptionList = function(story) {
  var authorsList = [];
  authorsList.push({text: story.author, value: story.author});
  story.collaborators.forEach(function(collab) {
    authorsList.push({text: collab.userName, value: collab.userName});
  });
  
  return authorsList;
};

var currentAuthorInList = function(story) {
  if (!story.currentAuthorId) {
    return true;
  }
  if (story.currentAuthorId === story.userId) {
    return true;
  }
  for (var i =0, len=(story.collaborators? selfStory.collaborators.length : 0); i < len; i++) {
        var collabIt = selfStory.collaborators[i];
        if (story.currentAuthorId === collabIt.userId) {
          return true;
        }
      }
      return false;
}

getCurrentAuthor = function(story) {
  return (story.currentAuthorName? story.currentAuthorName : story.author);
};

var getSubmitCurrentAuthorFunction = function(story) {
  var selfStory = story;
  return function(inputValue) {
    if (inputValue === selfStory.currentAuthorName) {
      return;
    }
    var storyProperties;
    if (inputValue === selfStory.author) {
      storyProperties = {currentAuthorId: selfStory.userId, currentAuthorName: selfStory.author};
    } else {
      for (var i =0, len=(selfStory.collaborators? selfStory.collaborators.length : 0); i < len; i++) {
        var collabIt = selfStory.collaborators[i];
        if (inputValue === collabIt.userName) {
          storyProperties = {currentAuthorId: collabIt.userId, currentAuthorName: collabIt.userName};
          break;
        }
      }
    }
    if (!storyProperties) {
      Errors.throw("invalid input for current author");
    }
    Stories.update(selfStory._id, {$set: storyProperties}, function(error) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
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
    return getCurrentAuthor(this);
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
  },

  'change .authorsList': function(e, f) {
    var selectPickerIdName = '#story' + this._id + '-authorpicker';
    var selectedAuthor = $(selectPickerIdName).val();
    var found={};
    for (var i =0, len=this.authorsList.length; i < len; i++) {
      if (this.authorsList[i].userid === selectedAuthor) {
        found = this.authorsList[i];
        break;
      }
    }
    
    if (found.userid !== this.currentAuthorId) {
      var storyProperties = {
        currentAuthorId: found.userId,
        currentAuthorName: found.userName
      }
      Stories.update(this._id, {$set: storyProperties}, function(error) {
        if (error) {
          // display the error to the user
          Errors.throw(error.reason);
        }
      });
    }
  }
});
