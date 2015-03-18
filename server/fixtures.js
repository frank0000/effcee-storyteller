if (Stories.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var owlieId = Meteor.users.insert({
    profile: { name: 'Owlie' }
  });
  var owlie = Meteor.users.findOne(owlieId);
  var stanId = Meteor.users.insert({
    profile: { name: 'Stan the Man' }
  });
  var stan = Meteor.users.findOne(stanId);

  var storyOneId = Stories.insert({
    title: '50 Blades of Grass',
    userId: owlie._id,
    author: owlie.profile.name,
    submitted: new Date(now - 7 * 3600 * 1000)
  });
  
  StoryBlurbs.insert({
    storyId: storyOneId,
    userId: owlie._id,
    author: owlie.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'It was a dark and stormy night.  Things were said.  Stuff happened. '
  });
  
  StoryBlurbs.insert({
    storyId: storyOneId,
    userId: stan._id,
    author: stan.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'And then the shit hit the fan.  The big one hit.  We were all really shook.'
  });

  Stories.insert({
    title: 'Tale of Two Monkeys',
    userId: stan._id,
    author: stan.profile.name,
    submitted: new Date(now - 10 * 3600 * 1000)
  });
  
}