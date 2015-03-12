if (Stories.find().count() === 0) {
  Stories.insert({
    title: '50 Blades of Grass'
  });
  Stories.insert({
    title: 'Tale of Two Monkeys'
  });
  Stories.insert({
    title: 'The Meteor Book'
  });
}