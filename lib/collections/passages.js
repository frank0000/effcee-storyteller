Passages = new Mongo.Collection('passages');

Passages.allow({
  update: function(userId, passage, fieldNames) { 
    return ownsDocument(userId, passage); // || _.without(fieldNames, 'nextPassageId').length == 0; 
  }
});

Passages.deny({
  update: function(userId, passage, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'body').length > 0);
  }
});

validatePassage = function (passage) {
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

currentUserCanAddToStory = function(story) {
  if (Meteor.user() === null) {
    return false;
  } 
  if (Meteor.user()._id === story.userId) {
    return true;
  }
  if (Stories.findOne({'_id': story._id, 'collaborators.userId': Meteor.user()._id})) {
    return true;
  }
  return false;
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

    if (!currentUserCanAddToStory(story)) {
      throw new Meteor.Error('invalid-user', 'You must be the owner or a collaborator to add a passage');
    }
    
    var passage = _.extend(passageAttributes, {
      userId: user._id,
      author: user.profile.name,
      submitted: new Date()
    });

    var prevPassage = Passages.findOne({storyId: passage.storyId}, {sort: {submitted: -1}});
    if (prevPassage) {
      passage.prevPassageId = prevPassage._id;
    }
    
    passage._id = Passages.insert(passage);
    if (prevPassage) {
      Passages.update(prevPassage._id, {$set: {"nextPassageId" : passage._id}}); // todo: do something if error here
    }

    createPassageActivity(passage);

    return passage._id;

  }
});