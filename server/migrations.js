
Migrations.add({
  version: 1,
  name: 'Adds default value of false for isPrivate field in existing stories',
  up: function() {
    Stories.update({isPrivate: null}, {$set: {isPrivate: true}}, {multi: true});
  },
  down: function() {
    //code to migrate down to version 0
  }
});

Meteor.startup(function () {
  // migrations code to run on server at startup
  Migrations.migrateTo('latest');
});
