Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('stories'); }
});

Router.route('/', {name: 'storiesList'});
Router.route('/stories/:_id', {
  name: 'storyPage',
  data: function() { return Stories.findOne(this.params._id); }
});

Router.route('/submit', {name: 'storySubmit'});

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

Router.onBeforeAction('dataNotFound', {only: 'storyPage'});
Router.onBeforeAction(requireLogin, {only: 'storySubmit'});
