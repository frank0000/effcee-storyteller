StoryBlurbs = new Mongo.Collection('storyblurbs');

Meteor.methods({
  storyBlurbInsert: function(blurbAttributes) {
    check(this.userId, String);
    check(blurbAttributes, {
      storyId: String,
      body: String
    });
    
    var user = Meteor.user();
    var story = Stories.findOne(blurbAttributes.storyId);

    if (!story)
      throw new Meteor.Error('invalid-blurb', 'You must add to a valid story');
    
    blurb = _.extend(blurbAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    return StoryBlurbs.insert(blurb);
  }
});