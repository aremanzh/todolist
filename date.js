

exports.getDate = function() {
    const date = new Date();

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString("en-MY", options);
};


exports.getDay = function () {
    const date = new Date();

    const options = {
        weekday: 'long',
    };
    return date.toLocaleDateString("en-MY", options);
};