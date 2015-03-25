Passages = new Mongo.Collection('passages');

Passages.allow({
  update: function(userId, passage) { return ownsDocument(userId, passage); }
});

Passages.deny({
  update: function(userId, story, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'body').length > 0);
  }
});

validatePassage = function (story) {
  var errors = {};

  if (!passage.body) {
    errors.body = "Passage empty, please write some content";
  }
  
  return errors;
}

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