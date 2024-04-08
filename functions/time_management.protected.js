function erf(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y =
      1 -
      (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
    return Math.sign(x) * y;
  }
  
  exports.handler = function(context, event, callback) {
    console.log("STARTING TIME MANAGEMENT")
    const startTimestamp = JSON.parse(event.start_timestamp);
    const endTimestamp =JSON.parse(event.end_timestamp)
    const start = new Date(startTimestamp.isoTimestamp);
    const end = new Date(endTimestamp.isoTimestamp);
    const diffMs = Math.abs(end - start); // absolute difference in milliseconds
    const diffSecs = Math.floor(diffMs / 1000); // difference in seconds
    const diffMins = Math.floor(diffMs / (1000 * 60)); // difference in minutes
  
    const timeTakenObj = {minutes: diffMins, seconds: diffSecs % 60};
  
    const timeTaken=timeTakenObj.seconds
  
    const marks=parseInt(event.score);
  
    const timeManagementSkill = marks / timeTaken;
  
    // Define the mean and standard deviation for the time management skill
    const mean = 0.5; // Set the mean to 0.5
    const stdDev = 0.15; // Set the standard deviation to 0.15
  
    // Calculate the z-score for the time management skill
    const zScore = (timeManagementSkill - mean) / stdDev;
  
    // Map the z-score to a value between 0 and 1 using the cumulative distribution function (CDF) of the standard normal distribution
    const timeManagementSkillNormalized = (1 + erf(zScore / Math.sqrt(2))) / 2;
  
    const results={
      start: {
        date:startTimestamp.date,
        time:startTimestamp.time
      },
      end: {
        date:endTimestamp.date,
        time:endTimestamp.time
      },
      timeScore:timeManagementSkillNormalized
    }
  
    console.log(`results`)
    console.log(results)
  
    console.log("ENDING TIME MANAGEMENT")
    callback(null, {time_score: results});
  };
  