function FacebookConnectPlugin() {
}

FacebookConnectPlugin.prototype.available = function (callback) {
  cordova.exec(function (avail) {
    callback(avail ? true : false);
  }, null, "FacebookConnectPlugin", "available", []);
};

FacebookConnectPlugin.prototype.getLoginStatus = function(s, f) {
    cordova.exec(s, f, "FacebookConnectPlugin", "getLoginStatus", []);
};

FacebookConnectPlugin.prototype.showDialog = function(options, s, f) {
    cordova.exec(s, f, "FacebookConnectPlugin", "showDialog", [options]);
};

FacebookConnectPlugin.prototype.login = function(permissions, s, f) {
    cordova.exec(s, f, "FacebookConnectPlugin", "login", permissions);
};

FacebookConnectPlugin.prototype.getAccessToken = function(s, f) {
    cordova.exec(s, f, "FacebookConnectPlugin", "getAccessToken", []);
};

FacebookConnectPlugin.prototype.logout = function(s, f) {
    cordova.exec(s, f, "FacebookConnectPlugin", "logout", []);
};

FacebookConnectPlugin.prototype.api = function(graphPath, permissions, s, f) {
        cordova.exec(s, f, "FacebookConnectPlugin", "graphApi", [graphPath, permissions]);
};

FacebookConnectPlugin.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.FacebookConnectPlugin = new FacebookConnectPlugin();
  return window.plugins.FacebookConnectPlugin;
};

cordova.addConstructor(FacebookConnectPlugin.install);

