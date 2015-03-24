Passages = new Mongo.Collection('passages');

getContributorCounts = function(story) {
  return Passages.aggregate([
    {
      $match: {
        storyId: story._id
      }
    },
   {
      $group : {
        _id: "$userId",
        numPassages: { $sum: 1 }
      }
    }
  ]);

};

Meteor.methods({
  passageInsert: function(passageAttributes) {
    check(this.userId, String);
    check(passageAttributes, {
      storyId: String,
      body: String
    });
    
    var user = Meteor.user();
    var story = Stories.findOne(passageAttributes.storyId);

    if (!story) {
      throw new Meteor.Error('invalid-passage', 'You must add to a valid story');
    }
    
    passage = _.extend(passageAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    passage._id = Passages.insert(passage);

    createPassageActivity(passage);

    return passage._id;

  }
});