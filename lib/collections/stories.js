// TODO: create a class for Stories

Stories = new Mongo.Collection('stories');

Stories.allow({
  update: function(userId, story) { return ownsDocument(userId, story); },
  remove: function(userId, story) { return ownsDocument(userId, story); }
});

Stories.deny({
  update: function(userId, story, fieldNames) {
    var mylength = _.without(fieldNames, 'title', 'isPrivate', 'collaborators', 'currentAuthorId', 'currentAuthorName').length;
    // may only edit the following two fields:
    return mylength > 0;
  }
});

validateStory = function (story) {

  var errors = {};

  if (!story.title || story.title.trim().length == 0) {
    errors.title = "Please provide a story title";
  }
  
  return errors;
},

Meteor.methods({
  storyInsert: function(storyAttributes) {
    check(Meteor.userId(), String);
    check(storyAttributes, {
      title: String,
      isPrivate: Boolean,
      collaborators: [String]
    });

    var errors = validateStory(storyAttributes);
    if (errors.title) {
      throw new Meteor.Error('invalid-story', "You must set a title for your story");
    }

    var collaboratorsList = getPopulatedCollaboratorsList(storyAttributes.collaborators);
    
    var user = Meteor.user();
    var story = {
      title: storyAttributes.title.trim(),
      collaborators: collaboratorsList,
      userId: user._id, 
      author: getUserName(user),
      currentAuthorId: user._id,
      currentAuthorName: getUserName(user),
      submitted: new Date(),
      isPrivate: storyAttributes.isPrivate
    };

    // title must be unique for the creator
    if (Stories.findOne({title: story.title, userId: story.userId})) {
      throw new Meteor.Error('invalid-story-title', "You already have a story with this title");
    }
    
    story._id = Stories.insert(story);

    collaboratorsList.forEach(function (collab) {
      createAddCollaboratorActivity(story, collab);
    });
    
    return {
      _id: story._id
    };
  },

  storyUpdate: function(updatedStoryAttributes) {

    check(Meteor.userId(), String);
    check(updatedStoryAttributes, {
      _id: String,
      title: Match.Optional(String),
      isPrivate: Match.Optional(Boolean),
      collaborators: Match.Optional([String]),
      currentAuthorId: Match.Optional(String)
    });

    // get current story
    var currentStory = Stories.findOne({_id: updatedStoryAttributes._id});

    // check if valid and user owns the story first
    if (!currentStory || !ownsDocument(Meteor.userId(), currentStory)) {
      throw new Meteor.Error('invalid-story', "You don't have permissions to update this story");
    }

    var updatedStory = {};
    
    // update story fields from input attributes
    updatedStory.title = 
      (updatedStoryAttributes.title != null? updatedStoryAttributes.title.trim() : currentStory.title);
    updatedStory.isPrivate = 
      (updatedStoryAttributes.isPrivate != null? updatedStoryAttributes.isPrivate: currentStory.isPrivate);
    updatedStory.collaborators = (
      updatedStoryAttributes.collaborators != null? 
      getPopulatedCollaboratorsList(updatedStoryAttributes.collaborators) :
      currentStory.collaborators);
    
    // update story's current author from input attributes
    if (updatedStoryAttributes.currentAuthorId) {
      var foundUserForAuthor = Meteor.users.findOne({_id: updatedStoryAttributes.currentAuthorId});
      if (!foundUserForAuthor) {
        throw new Meteor.Error('invalid-current-author', "Attempt to set invalid current author");
      }
      updatedStory.currentAuthorId = foundUserForAuthor._id;
      updatedStory.currentAuthorName = getUserName(foundUserForAuthor);
    } else {
      updatedStory.currentAuthorId = currentStory.currentAuthorId;
      updatedStory.currentAuthorName =currentStory.currentAuthorName;
    }

    // if current author is not in the list of possible authors, reset to current user
    if (!currentAuthorIsValid(updatedStory.currentAuthorId, currentStory.userId, updatedStory.collaborators)) {
      updatedStory.currentAuthorId = Meteor.userId();
      updatedStory.currentAuthorName = getUserName(Meteor.user());
    }

    var errors = validateStory(updatedStory);
    if (errors.title) {
      throw new Meteor.Error('invalid-story', "You must set a title for your story");
    }

    // title must be unique for the creator
    if (Stories.findOne({_id: {$ne: currentStory._id}, title: updatedStory.title, userId: currentStory.userId})) {
       throw new Meteor.Error('invalid-story-title', "You already have a story with this title");
    }

    Stories.update(currentStory._id, {$set: updatedStory});

    var newStory = Stories.findOne({_id: currentStory._id});

    if (newStory.currentAuthorId !== currentStory.currentAuthorId) {
      // changed the current author, add an activity for this
      createCurrentAuthorActivity(newStory);
    }

    var collabDiffs = getCollaboratorDiffs(currentStory.collaborators, newStory.collaborators);
    collabDiffs.forEach(function (collabDiff) {
      if (!collabDiff) {
        return;
      }
      if (collabDiff.action === "add") {
        createAddCollaboratorActivity(newStory, collabDiff);
      }
      if (collabDiff.action === "remove") {
        createRemoveCollaboratorActivity(newStory, collabDiff);
      }
    });

    return {
      _id: newStory._id
    }
  }
    
});