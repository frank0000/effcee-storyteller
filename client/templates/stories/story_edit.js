Template.storyEdit.created = function() {
  Session.set('storyEditErrors', {});
}

Template.storyEdit.helpers({
  errorMessage: function(field) {
    return Session.get('storyEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('storyEditErrors')[field] ? 'has-error' : '';
  },

});

Template.storyEdit.rendered = function() {
    $('.collaborators').tagsinput({
      itemValue: '_id',
      itemText: 'username',
      typeahead: {
        source: function() {
          usersList = Meteor.users.find({_id: {$ne: Meteor.user()._id}}).fetch().map(function(u){ return {_id: u._id, username: u.username}; });
          return (usersList);
        },
        displayKey: 'username'
      }
    });
    
    this.data.collaborators.forEach(function(c) {
      $('.collaborators').tagsinput('add', {"_id": c.userid, "username": c.username});
    })
    
};

// TODO: Refactor to use Meteor method so only do update operation on the server side
Template.storyEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentStoryId = this._id;
    
    var collabVal = $(e.target).find('[name=collaborators]').val();
    var collaborators = (collabVal? collabVal.split(',') : null);
    var collaboratorList = [];
    if (collaborators) {
      collaboratorList = collaborators.map(function(c) {
        matchedUser = Meteor.users.findOne({_id: c});
        return {userid: matchedUser._id, username: matchedUser.username};
      });
    }

    var storyProperties = {
      title: $(e.target).find('[name=title]').val(),
      collaborators: collaboratorList
    }

    var errors = validateStory(storyProperties);
    if (errors.title) {
      return Session.set('storyEditErrors', errors);
    }

    /*
    var storyWithSameTitle = Stories.findOne({title: storyProperties.title});
    if (storyWithSameTitle) {
      if (storyWithSameTitle._id === currentStoryId) {
        Errors.throw('No changes made');
        return Router.go('storyPage', {_id: currentStoryId});
      }
      else {
        return Errors.throw('A story with this title already exists');
      }
    }
    */
    
    Stories.update(currentStoryId, {$set: storyProperties}, function(error) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
      } else {
        Router.go('storyPage', {_id: currentStoryId});
      }
    });
  },
  
  // TODO:refactor to reuse this across story edit and submit
  'click .cancel': function(e) {
    e.preventDefault();
    if (confirm("Cancel without updating this story?")) {
      history.go(-1);
    }
  }
});