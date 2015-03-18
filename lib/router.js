Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('stories'); }
});

Router.route('/', {name: 'storiesList'});