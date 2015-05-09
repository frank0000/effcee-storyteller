getCollaboratorTagInputConfig = function() {
  return {
    itemValue: 'userId',
    itemText: 'userName',
    typeahead: {
      source: function() {
        var collabsList = Meteor.users.find({_id: {$ne: Meteor.user()._id}}).fetch().map(function(u){ 
          return {'userId': u._id, 'userName': getUserName(u)}; 
        });
        return collabsList;
      },
      displayKey: 'userName'
    }
  };
};

getCollaboratorInputTagValue = function(collab) {
  return {'userId': collab.userId, 'userName': collab.userName};
};


currentAuthorIsValid = function(authorId, creatorId, collaborators) {
  if (!authorId) {
    return false;
  }
   
  if (authorId === creatorId) {
    return true;
  }

  for (var i=0, len=(collaborators? collaborators.length : 0); i < len; i++) {
    if (authorId === collaborators[i].userId) {
      return true;
    }
  }
  
  return false;
};

getPopulatedCollaboratorsList = function(collabIdsList) {
  var collaboratorsList = [];
  if (collabIdsList && collabIdsList.length > 0) {
    collaboratorsList = collabIdsList.map(function(c) {
      matchedUser = Meteor.users.findOne({_id: c});
      return {userId: matchedUser._id, userName: getUserName(matchedUser)};
    });
  }
  return collaboratorsList;
}