Accounts.onCreateUser(function(options, user) {
  // creating a profile object pre-populated with name
  user.profile = options.profile? options.profile : {};
  if (!user.profile.name) {
    user.profile.name = options.username;
  }
  return user;
});
