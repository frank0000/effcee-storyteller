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


findInCollaboratorsList = function(collab, collabsList, collabField) {
  if (!collab[collabField]) {
    return null;
  }
  
  for (var i=0, len=(collabsList? collabsList.length : 0); i < len; i++) {
    if (collab[collabField] === collabsList[i][collabField]) {
      return collabsList[i];
    }
  }
  
  return null;
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