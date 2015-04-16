Template.storySubmit.created = function() {
  Session.set('storySubmitErrors', {});
};

Template.storySubmit.rendered = function() {
    $('.collaborators').tagsinput({
      itemValue: '_id',
      itemText: 'username',
      typeahead: {
        source: function() {
          usersList = Meteor.users.find({_id: {$ne: Meteor.user()._id}}).fetch().map(function(u){ 
            return {_id: u._id, username: u.username}; 
          });
          return (usersList);
        },
        displayKey: 'username'
      }
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
    
    var collabVal = $(e.target).find('[name=collaborators]').val();
    var story = {
       title: $(e.target).find('[name=title]').val(),
       collaborators: (collabVal? collabVal.split(',') : [])
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

      // show this result but route anyway
      if (result.storyExists) {
        return Errors.throw('A story with this title already exists');
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