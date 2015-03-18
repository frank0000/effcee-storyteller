Template.blurbSubmit.created = function() {
  Session.set('blurbSubmitErrors', {});
}

Template.blurbSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('blurbSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('blurbSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.blurbSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    
    var $body = $(e.target).find('[name=body]');
    var storyBlurb = {
      body: $body.val(),
      storyId: template.data._id
    };
    
    var errors = {};
    if (! storyBlurb.body) {
      errors.body = "Please write some content";
      return Session.set('blurbSubmitErrors', errors);
    }
    
    Meteor.call('storyBlurbInsert', storyBlurb, function(error, storyBlurbId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});