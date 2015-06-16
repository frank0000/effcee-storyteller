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

getCollaboratorDiffs = function(oldCollabList, newCollabList) {

  collabDiffsList = [];
  var oldIdx = 0, newIdx = 0;
  var oldCollabListSorted = sortCollaboratorsList(oldCollabList, 'userName');
  var newCollabListSorted = sortCollaboratorsList(newCollabList, 'userName');
  var oldCurCollab = (oldIdx < oldCollabListSorted.length? oldCollabListSorted[oldIdx++] : {userName: null});
  var newCurCollab = (newIdx < newCollabListSorted.length? newCollabListSorted[newIdx++] : {userName: null});

  while (true) {

    if (oldCurCollab.userName === null && newCurCollab.userName === null) {
      break;
    }
    if (oldCurCollab.userName === newCurCollab.userName) {
      oldCurCollab = (oldIdx < oldCollabListSorted.length? oldCollabListSorted[oldIdx++] : {userName: null});
      newCurCollab = (newIdx < newCollabListSorted.length? newCollabListSorted[newIdx++] : {userName: null});
      continue;
    }
    if (newCurCollab.userName == null || oldCurCollab.userName < newCurCollab.userName) {
      collabDiffsList.push({action: 'remove', 
        userId: oldCurCollab.userId, 
        userName: oldCurCollab.userName});
      oldCurCollab = (oldIdx < oldCollabListSorted.length? oldCollabListSorted[oldIdx++] : {userName: null});
      continue;
    }
    if (oldCurCollab.userName == null || oldCurCollab.userName > newCurCollab.userName) {
      collabDiffsList.push({action: 'add', 
        userId: newCurCollab.userId, 
        userName: newCurCollab.userName});
      newCurCollab = (newIdx < newCollabListSorted.length? newCollabListSorted[newIdx++] : {userName: null});
      continue;
    }
  }
  
  return collabDiffsList;
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
};

sortCollaboratorsList = function(collaboratorsList, sortField) {
  return collaboratorsList.sort(function(a, b) {
    if (a[sortField] < b[sortField]) {
      return -1;
    }
    if (a[sortField] > b[sortField]) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });
};