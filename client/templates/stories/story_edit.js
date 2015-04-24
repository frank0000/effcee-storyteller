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
    $('.collaborators').tagsinput(getCollaboratorTagInputConfig());
    
    this.data.collaborators.forEach(function(c) {
      $('.collaborators').tagsinput('add', getCollaboratorInputTagValue(c));
    })
    
};

// TODO: Refactor to use Meteor method so only do update operation on the server side
Template.storyEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentStoryId = this._id;
    
    var collabVal = $(e.target).find('[name=collaborators]').val();
    var collaboratorIdsList = (collabVal? collabVal.split(',') : null);
   
    var collaboratorsList = getPopulatedCollaboratorsList(collaboratorIdsList);

    var storyProperties = {
      title: $(e.target).find('[name=title]').val(),
      collaborators: collaboratorsList
    }

    if (!this.currentAuthorId || 
      !findInCollaboratorsList({userId: this.currentAuthorId}, collaboratorsList, 'userId')) {
      storyProperties.currentAuthorId = this.userId;
      storyProperties.currentAuthorName = this.author;
    }

    var errors = validateStory(storyProperties);
    if (errors.title) {
      return Session.set('storyEditErrors', errors);
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
  
  // TODO:refactor to reuse this across story edit and submit
  'click .cancel': function(e) {
    e.preventDefault();
    if (confirm("Cancel without updating this story?")) {
      history.go(-1);
    }
  }
});