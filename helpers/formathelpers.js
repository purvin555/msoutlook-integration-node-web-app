var hbs = require('hbs');
var moment = require('moment');

var DateFormats = {
    short: "MMMM DD YYYY",
    long: "MMMM DD YYYY HH:mm"
};

module.exports = {

    register: function () {
        hbs.registerHelper("formatDate", function (datetime, format) {
            if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).format(format);
            }
            else {
                return datetime;
            }
        });
    }
}