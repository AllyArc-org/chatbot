const axios = require("axios");
exports.handler = function(context, event, callback) {
  console.log("STARTING SET SCORE")
  var model_answer=event.model_answer;
  var student_answer=event.answer
  var score=parseFloat(event.score)
  console.log("#############SCORE IS################"+score)

  const options = {
    method: 'GET',
    url: 'https://twinword-text-similarity-v1.p.rapidapi.com/similarity/',
    params: {
      text1: `${model_answer}`,
      text2: `${student_answer}`
    },
    headers: {
      'X-RapidAPI-Key': '715b99ad63mshdec036a24e0be79p1e48a7jsn7498c72e3105',
      'X-RapidAPI-Host': 'twinword-text-similarity-v1.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {

    const similarityScore = response.data.similarity;

    // Calculate score based on similarity score
    const baselineScore = 0.8; // Set baseline similarity score threshold
    let student_score;
    if (similarityScore >= baselineScore) {
      student_score = score; // Assign full score of 25 if similarity score meets or exceeds baseline
    } else {
      student_score = Math.round((similarityScore / baselineScore) * score); // Calculate partial score based on similarity score
    }
    console.log(student_score)
    console.log("ENDING SET SCORE")
    callback(null, {score : student_score});
  }).catch(function (error) {
    console.error(error);
    callback(error);
  });
};