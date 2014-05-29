
(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    DemoViewModel = kendo.data.ObservableObject.extend({

        checkValidCertificate: function () {
            if (!this.checkSimulator()) {
                var server             = "https://github.com";
                var validFingerprint   = "A0 C4 A7 46 00 ED A7 2D C0 BE CB 9A 8C B6 07 CA 58 EE 74 5E"; // valid until April 2016
                var invalidFingerprint = "00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF 00 11 22 33";

                window.plugins.sslCertificateChecker.check(
                    this.onSuccess,
                    this.onError,
                    server,
                    validFingerprint,
                	invalidFingerprint);
            }
        },

        // TODO sync the fork and update the plugin
        checkInvalidCertificate: function () {
            if (!this.checkSimulator()) {
                var server             = "https://build.phonegap.com"; // .. failed..?
                var invalidFingerprint = "A0 C4 A7 46 00 ED A7 2D C0 BE CB 9A 8C B6 07 CA 58 EE 74 5E";

                window.plugins.sslCertificateChecker.check(
                    this.onSuccess,
                    this.onError,
                    server,
                    invalidFingerprint);
            }
        },

        checkSimulator: function() {
            if (window.plugins === undefined) {
                alert('Plugin not available. Are you running in the simulator?');
                return true;
            }
            return false;
        },

        // callbacks
        onSuccess: function(msg) {
            // 'msg' is always: CONNECTION_SECURE.
            // Now do something with the trusted server.
            navigator.notification.alert(msg, null, 'Success Callback', 'Close');
        },

        onError: function(msg) {
            if (msg == "CONNECTION_NOT_SECURE") {
                navigator.notification.alert(msg + '\n\nThere is likely a man in the middle attack going on, be careful!', null, 'Error Callback', 'Close');
            } else if (msg.indexOf("CONNECTION_FAILED") > -1) {
                navigator.notification.alert(msg + '\n\nThere was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.', null, 'Error Callback', 'Close');
            } else {
                navigator.notification.alert(msg);
            }
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);