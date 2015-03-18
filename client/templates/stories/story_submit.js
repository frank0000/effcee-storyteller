Template.storySubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var story = {
       title: $(e.target).find('[name=title]').val()
    };
    
     Meteor.call('storyInsert', story, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);
      
      Router.go('storyPage', {_id: result._id});  
    });

  }
});