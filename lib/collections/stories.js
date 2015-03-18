Stories = new Mongo.Collection('stories');

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