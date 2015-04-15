Template.storySubmit.created = function() {
  Session.set('storySubmitErrors', {});
};

Template.storySubmit.usersSearch = function(query, callback) {
  Meteor.call('usersSearch', query, {}, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    callback(res.map(function(u){ return {value: u.username}; }));
  });
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
  },
  usersList: function() {
    return Meteor.users.find({_id: {$ne: Meteor.user()._id}}).fetch().map(function(u){ return u.username; });
  }
});

Template.storySubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var story = {
       title: $(e.target).find('[name=title]').val(),
       collaborators: $(e.target).find('[name=collaborators]').val().split(',')
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

  }
});