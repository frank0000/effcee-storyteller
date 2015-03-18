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

Meteor.methods({
  storyInsert: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String
    });
    
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