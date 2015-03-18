Stories = new Mongo.Collection('stories');

Stories.allow({
  update: function(userId, story) { return ownsDocument(userId, story); },
  remove: function(userId, story) { return ownsDocument(userId, story); }
});

Stories.deny({
  update: function(userId, story, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
  }
});

Stories.deny({
  update: function(userId, story, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title').length > 0);
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
      title: String
    });

    var errors = validateStory(storyAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-story', "You must set a title for your story");
    }

    var storyWithSameTitle = Stories.findOne({title: storyAttributes.title});
    if (storyWithSameTitle) {
      return {
        storyExists: true,
        _id: storyWithSameTitle._id
      }
    }
    
    var user = Meteor.user();
    var story = _.extend(storyAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date()
    });
    
    var storyId = Stories.insert(story);
    
    return {
      _id: storyId
    };
  }
});