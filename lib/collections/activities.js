Activities = new Mongo.Collection('activities');
Activities.allow({
  // updates and deletes not allowed to activities
});

createPassageActivity = function(passage) {

  // var passage = Passages.findOne(passage._id);
  // TODO: handle not able to find post case

  var activity = {
      userId: passage.userId,
      userName: passage.author,
      timeCompleted: passage.submitted,
      storyId: passage.storyId,
      passageId: passage._id,
      activityType: "added passage"
  }

  Activities.insert(activity);

  createActivityNotification(activity);
};