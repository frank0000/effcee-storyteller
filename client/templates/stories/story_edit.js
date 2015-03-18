Template.storyEdit.created = function() {
  Session.set('storyEditErrors', {});
}

Template.storyEdit.helpers({
  errorMessage: function(field) {
    return Session.get('storyEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('storyEditErrors')[field] ? 'has-error' : '';
  }
});

Template.storyEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentStoryId = this._id;
    
    var storyProperties = {
      title: $(e.target).find('[name=title]').val()
    }

    var errors = validateStory(storyProperties);
    if (errors.title) {
      return Session.set('storyEditErrors', errors);
    }

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
    
    Stories.update(currentStoryId, {$set: storyProperties}, function(error) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
      } else {
        Router.go('storyPage', {_id: currentStoryId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this story?")) {
      var currentStoryId = this._id;
      Stories.remove(currentStoryId);
      Router.go('storiesList');
    }
  }
});