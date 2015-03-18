Template.storyEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentStoryId = this._id;
    
    var storyProperties = {
      title: $(e.target).find('[name=title]').val()
    }
    
    Stories.update(currentStoryId, {$set: storyProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
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