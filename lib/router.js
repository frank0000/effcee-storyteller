Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { 
    return [Meteor.subscribe('stories'), Meteor.subscribe('notifications'), Meteor.subscribe('users')];
  }
});

Router.route('/', {name: 'storiesList'});
Router.route('/stories/:_id', {
  name: 'storyPage',
  waitOn: function() {
    return Meteor.subscribe('passages', this.params._id);
  },

  data: function() { return Stories.findOne(this.params._id); }
});

Router.route('/stories/:_id/edit', {
  name: 'storyEdit',
  data: function() { return Stories.findOne(this.params._id); }
});

Router.route('/submit', {name: 'storySubmit'});

Router.route('/stories/:storyId/passages/:_id', {
  name: 'passagePage',
  waitOn: function() {
    return [Meteor.subscribe('passages', this.params.storyId), Meteor.subscribe('activities', this.params._id)];
  },

  data: function() { return Passages.findOne(this.params._id); }
});

Router.route('/stories/:storyId/passages/:_id/edit', {
  name: 'passageEdit',
   waitOn: function() {
    return [Meteor.subscribe('passages', this.params.storyId), Meteor.subscribe('activities', this.params._id)];
  },
  data: function() { return Passages.findOne(this.params._id); }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: ['storyPage', 'passagePage']});
Router.onBeforeAction(requireLogin, {only: 'storySubmit'});
