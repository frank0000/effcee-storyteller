Accounts.onCreateUser(function(options, user) {
  // creating a profile object pre-populated with name
  user.profile = options.profile ? options.profile : {name: options.username};
  return user;
});