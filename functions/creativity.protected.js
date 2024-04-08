//5d2fbc5d17msh584cfe7f08c4597p102a02jsnf529067ad473

const axios = require("axios");
exports.handler = function(context, event, callback) {
  var userAnswer=event.answer
  console.log("STARTING CREATIVITY")
  // Initialize variables for each aspect of creativity
  let fluency = 0;
  let flexibility = 0;
  let originality = 0;
  let elaboration = 0;
  let riskTaking = 0;

  const options = {
    method: 'POST',
    url: 'https://sentino.p.rapidapi.com/score/text',
    headers: {
      'content-type': 'application/json',
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '715b99ad63mshdec036a24e0be79p1e48a7jsn7498c72e3105',
      'X-RapidAPI-Host': 'sentino.p.rapidapi.com'
    },
    data: `{"text": "${userAnswer}","inventories": ["big5", "neo"],"lang": "en"}`
  };

  axios.request(options).then(function (response) {
    const traits = response.data.scoring.big5;

    // Update fluency and flexibility based on big 5 scores
    fluency = traits.extraversion && traits.extraversion.score ? traits.extraversion.score : 0;
    flexibility = traits.openness && traits.openness.score ? traits.openness.score : 0;

    // Update originality based on high openness to experience score
    if (traits.openness && traits.openness.score > 0.6) {
      originality = 1;
    }

    // Update elaboration based on high conscientiousness score
    if (traits.conscientiousness && traits.conscientiousness.score > 0.6) {
      elaboration = userAnswer.length;
    }

    // Check for risk-taking based on low agreeableness score
    if (traits.agreeableness && traits.agreeableness.score < 0.4) {
      riskTaking = 1;
    }

    // Calculate the creativity score
    const creativityScore = (fluency + flexibility + originality + elaboration + riskTaking) / 5;

    // Map the creativity score to a range between 0 and 1 using standard deviation and z-score
    const creativityMean = 0.5;
    const creativityStdDev = 0.15;
    const creativityZScore = (creativityScore - creativityMean) / creativityStdDev;
    const creativitySkill = Math.max(0, Math.min(1, 0.5 + creativityZScore));

    const results={
      fluency: fluency,
      flexibility: flexibility,
      originality: originality,
      elaboration: elaboration,
      riskTaking: riskTaking,
      creativitySkill: creativitySkill
    }
    
    // Output score
    
    console.log("ENDING CREATIVITY")
    callback(null, {creativity: results});
  }).catch(function (error) {
    console.error(error);
    callback(error);
  });
};

