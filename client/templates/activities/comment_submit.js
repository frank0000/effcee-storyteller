Template.commentSubmit.created = function() {
  Session.set('commentSubmitErrors', {});
}

Template.commentSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  },
  getCommentSubmitLabel: function(parentContext) {
    if (parentContext.storyId) {
      return "Comment on this passage";
    } else {
      return "Comment on this story";
    }
  }
});

Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();
    
    var $body = $(e.target).find('[name=body]');
    var comment;
    if (template.data.storyId) {
      comment = {
        body: $body.val(),
        storyId: template.data.storyId,
        passageId: template.data._id
      };
    } else {
      comment = {
        body: $body.val(),
        storyId: template.data._id
      };
    }

    var errors = {};
    if (! comment.body) {
      errors.body = "Please write some content";
      return Session.set('commentSubmitErrors', errors);
    }
    
    Meteor.call('commentInsert', comment, function(error, commentId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});