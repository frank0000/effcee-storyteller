Template.passageSubmit.created = function() {
  Session.set('passageSubmitErrors', {});
}

Template.passageSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('passageSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('passageSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.passageSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    
    var $body = $(e.target).find('[name=body]');
    var passage = {
      body: $body.val(),
      storyId: template.data._id
    };
    
    var errors = {};
    if (! passage.body) {
      errors.body = "Passage empty, please write some content";
      return Session.set('passageSubmitErrors', errors);
    }
    
    Meteor.call('passageInsert', passage, function(error, passageId) {
      if (error){
        FlashMessages.sendError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});