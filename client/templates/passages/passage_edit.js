Template.passageEdit.created = function() {
  Session.set('passageEditErrors', {});
}

Template.passageEdit.helpers({
  errorMessage: function(field) {
    return Session.get('passageEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('passageEditErrors')[field] ? 'has-error' : '';
  }
});

Template.passageEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPassageId = this._id;
    var currentStoryId = this.storyId;
    
    var passageProperties = {
      body: $(e.target).find('[name=body]').val()
    }

    var errors = validatePassage(passageProperties);
    if (errors.title) {
      return Session.set('passageEditErrors', errors);
    }
    
    Passages.update(currentPassageId, {$set: passageProperties}, function(error) {
      if (error) {
        // display the error to the user
        Errors.throw(error.reason);
      } else {
        Router.go('passagePage', {storyId: currentStoryId, _id: currentPassageId});
      }
    });
  }
});