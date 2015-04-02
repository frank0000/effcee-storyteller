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
  
  Passages.insert({
    storyId: storyOneId,
    userId: owlie._id,
    author: owlie.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'It was a dark and stormy night.  Things were said.  Stuff happened.'
  });
  
  var passage = {
    storyId: storyOneId,
    userId: stan._id,
    author: stan.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'And then the **shit** hit the fan.  The big one hit.  We were all really *shook*.\n\nAnd so it goes.'
  };
  passage._id = Passages.insert(passage);

  Activities.insert({
      userId: passage.userId,
      userName: passage.author,
      timeCompleted: passage.submittedTime,
      storyId: passage.storyId,
      passageId: passage._id,
      activityType: 'added passage'
  });

  Activities.insert({
      userId: owlie.userId,
      userName: owlie.profile.name,
      timeCompleted: new Date(now - 2 * 3600 * 1000),
      storyId: passage.storyId,
      passageId: passage._id,
      activityType: 'added comment',
      body: 'Threw a bit of curve ball at me Stan my man!'
  });

  Activities.insert({
      userId: passage.userId,
      userName: passage.author,
      timeCompleted: new Date(now - 1 * 3600 * 1000),
      storyId: passage.storyId,
      passageId: passage._id,
      activityType: 'added comment',
      body: 'Yup, interested in seeing where you go with that Poopie ol boy...'
  });


  Stories.insert({
    title: 'Tale of Two Monkeys',
    userId: stan._id,
    author: stan.profile.name,
    submitted: new Date(now - 10 * 3600 * 1000)
  });
  
}