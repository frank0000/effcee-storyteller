Stories = new Mongo.Collection('stories');

Stories.allow({
  insert: function(userId, doc) {
    // only allow creation of new stories if you are logged in
    return !! userId;
  }
});