import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import ENV from 'wordset/config/environment';

export default Base.extend({
  restore: function(properties) {
    var propertiesObject = Ember.Object.create(properties);

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(propertiesObject.get("username")) && !Ember.isEmpty(propertiesObject.get("auth_key"))) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },
  authenticate: function(credentials) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var data                 = {};
      data = {
        username:    credentials.identification,
        password:    credentials.password
      };
      _this.makeRequest(data).then(function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },
  invalidate: function() {
    return Ember.RSVP.resolve();
  },
  makeRequest: function(data) {
    return Ember.$.ajax({
      url:        ENV.api + '/auth/login',
      type:       'POST',
      data:       data,
      dataType:   'json',
      beforeSend: function(xhr, settings) {
        xhr.setRequestHeader('Accept', settings.accepts.json);
      }
    });
  }
});
