Template.storySubmit.created = function() {
  Session.set('storySubmitErrors', {});
};

Template.storySubmit.rendered = function() {
    $('.collaborators').tagsinput(getCollaboratorTagInputConfig());
    $('.visibility-toggle').click(function() {
      $('.visibility-toggle > .btn').toggleClass('active');  
    });
};

Template.storySubmit.helpers({
  errorMessage: function(field) {
    return Session.get('storySubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('storySubmitErrors')[field] ? 'has-error' : '';
  }
});


Template.storySubmit.events({
  'submit form': function(e) {
    e.preventDefault();
     
    var visibilityVal = $('.visibility-toggle > .btn.active').attr('id');
    var collabVal = $(e.target).find('[name=collaborators]').val();
    var story = {
       title: $(e.target).find('[name=title]').val(),
       collaborators: (collabVal? collabVal.split(',') : []),
       isPrivate: (visibilityVal === "private")
    };
    
    var errors = validateStory(story);
    if (errors.title) {
      return Session.set('storySubmitErrors', errors);
    }
    
    Meteor.call('storyInsert', story, function(error, result) {
      // display the error to the user and abort
      if (error) {
        return Errors.throw(error.reason);
      }

      Router.go('storyPage', {_id: result._id});  
    });

  },
  // TODO:refactor to reuse this across story edit and submit
  'click .cancel': function(e) {
    e.preventDefault();
    if (confirm("Cancel without creating this story?")) {
      Router.go('storiesList');
    }
  }
});