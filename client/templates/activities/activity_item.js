Template.activityItem.helpers({
  submittedText: function() {
    return this.timeCompleted.toString();
  },
  doPassageReference: function(parentContext) {
    return (parentContext.storyId == null && this.passageId != null);
  },
  getPassageReference: function() {
    return Router.routes.passagePage.path({storyId: this.storyId, _id: this.passageId});
  },
  getPassageReferenceLabel: function() {
    if (this.activityType.startsWith("added comment")) {
      return "about passage ";
    }
  },
  getPassageExcerpt: function() {
    if (!this.passageId) {
      return "";
    }
    var refPassage = Passages.findOne({_id: this.passageId});
    if (!refPassage || !refPassage.body) {
      return "";
    }
    return refPassage.body.trim().substr(0, 19) + "...";
  },
  isContext: function(contextName) {
    return this.context === contextName;
  }

});