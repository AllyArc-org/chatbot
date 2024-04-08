exports.handler = function(context, event, callback) {
    const now = new Date();
    const isoTimestamp = now.toISOString();
    const timestampDate = new Date(isoTimestamp);
    const options = {timeZone: 'Asia/Kolkata', hour12: false};
    const date = timestampDate.toLocaleDateString("en-IN", {day: "numeric", month: "numeric", year: "2-digit", timeZone: 'Asia/Kolkata'});
    const time = timestampDate.toLocaleTimeString("en-IN", options);
    const timestamp = {date: date, time: time, isoTimestamp: isoTimestamp};
    callback(null, {timestamp: timestamp});
  };
  