getAllStoriesForCurrentUser = function() {
  return Stories.find({}, {sort: {submitted: -1}});
};

getAuthoringStoriesForCurrentUser = function() {
  return Stories.find({'currentAuthorId': Meteor.userId()}, {sort: {submitted: -1}});
};

getOwnedStoriesForCurrentUser = function() {
  return Stories.find({'userId': Meteor.userId()}, {sort: {submitted: -1}});
};

getCollaboratingStoriesForCurrentUser = function() {
    return Stories.find({'collaborators.userId': Meteor.userId()}, {sort: {submitted: -1}});
};