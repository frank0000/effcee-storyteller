Activities = new Mongo.Collection('activities');
Activities.allow({
  // updates and deletes not allowed to activities
});

createPassageActivity = function(passage) {

  // var passage = Passages.findOne(passage._id);
  // TODO: handle not able to find post case

  var activity = {
      userId: passage.userId,
      userName: passage.author,
      timeCompleted: passage.submitted,
      storyId: passage.storyId,
      passageId: passage._id,
      activityType: "added passage"
  }

  Activities.insert(activity);

  createActivityNotification(activity);
};

createCurrentAuthorActivity = function(story) {
  var currentAuthorActivity = {
      userId: Meteor.user()._id,
      userName: getUserName(Meteor.user()),
      timeCompleted: new Date(),
      storyId: story._id,
      activityType: "changed author to " + story.currentAuthorName
  } 

  currentAuthorActivity._id = Activities.insert(currentAuthorActivity);

  createActivityNotification(currentAuthorActivity);
}

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      storyId: String,
      passageId: Match.Optional(String),
      body: String
    });
    
    var user = Meteor.user();
    var story = Stories.findOne(commentAttributes.storyId);
    

    if (!story) {
      throw new Meteor.Error('invalid-comment', 'You must comment on a valid story');
    }

    if (commentAttributes.passageId) {
      var passage = Passages.findOne(commentAttributes.passageId);
      if (!passage) {
        throw new Meteor.Error('invalid-comment', 'You must comment on a valid passage');
      }
    }

    commentActivity = _.extend(commentAttributes, {
      userId: user._id,
      userName: getUserName(user),
      activityType: 'added comment',
      timeCompleted: new Date()
    });
    
    commentActivity._id = Activities.insert(commentActivity);

    createActivityNotification(commentActivity);

    return commentActivity._id;
  }
});
