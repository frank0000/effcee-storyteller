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

Template.storyEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var collabVal = $(e.target).find('[name=collaborators]').val();
    var storyProperties = {
      _id: this._id,
      title: $(e.target).find('[name=title]').val(),
      collaborators: (collabVal? collabVal.split(',') : [])
    }

    var errors = validateStory(storyProperties);
    if (errors.title) {
      return Session.set('storyEditErrors', errors);
    }
    
    Meteor.call('storyUpdate', storyProperties, function(error, result) {
      // display the error to the user and abort
      if (error) {
        return Errors.throw(error.reason);
      }

      history.go(-1);  
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