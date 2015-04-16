Stories = new Mongo.Collection('stories');

Stories.allow({
  update: function(userId, story) { return ownsDocument(userId, story); },
  remove: function(userId, story) { return ownsDocument(userId, story); }
});

Stories.deny({
  update: function(userId, story, fieldNames) {
    var mylength = _.without(fieldNames, 'title', 'collaborators').length;
    console.log("update rule for Stories: mylength=", mylength);
    // may only edit the following two fields:
    return mylength > 0;
  }
});

validateStory = function (story) {
  var errors = {};

  if (!story.title) {
    errors.title = "Please provide a story title";
  }
  
  return errors;
}

Meteor.methods({
  storyInsert: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String,
      collaborators: [String]
    });

    var errors = validateStory(storyAttributes);
    if (errors.title) {
      throw new Meteor.Error('invalid-story', "You must set a title for your story");
    }

    var storyWithSameTitle = Stories.findOne({title: storyAttributes.title});
    if (storyWithSameTitle) {
      return {
        storyExists: true,
        _id: storyWithSameTitle._id
      }
    }

    var collaboratorList = [];
    if (storyAttributes.collaborators && storyAttributes.collaborators.length > 0) {
      collaboratorList = storyAttributes.collaborators.map(function(c) {
        matchedUser = Meteor.users.findOne({_id: c});
        return {userid: matchedUser._id, username: matchedUser.username};
      });
    }
    
    var user = Meteor.user();
    var story = {
      title: storyAttributes.title,
      collaborators: collaboratorList,
      userId: user._id, 
      author: user.username, 
      submitted: new Date()
    };
    
    var storyId = Stories.insert(story);
    
    return {
      _id: storyId
    };
  }
});