ServiceConfiguration.configurations.upsert(
  { service: "google" },
  {
    $set: {
      clientId: Meteor.settings.googleAuthClientId,
      secret: Meteor.settings.googleAuthSecret,
      loginStyle: "popup"
    }
  }
);
ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: Meteor.settings.facebookAuthAppId,
      secret: Meteor.settings.facebookAuthSecret,
      loginStyle: "popup"
    }
  }
);
ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: Meteor.settings.twitterAuthConsumerKey,
      secret: Meteor.settings.twitterAuthSecret,
      loginStyle: "popup"
    }
  }
);