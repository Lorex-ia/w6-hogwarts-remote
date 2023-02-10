// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("w6-hogwarts-remote JS imported successfully!");
});

function submit_quizz(){
  var gryffindor =0;
  var slytherin =0;
  var hufflepuff =0;
  var ravenclaw =0;
// the above code (unfinished) is the same as doing it with a for loop:
  var questions = ['animal', 'garden', 'death', 'road', 'night'];

  for (var i = 0; i < questions.length; i++) {
      var q = document.querySelector('input[name="' + questions[i] + '"]:checked').value;

      if (q == "gryffindor") {
          gryffindor += 1;
      } else if (q == "slytherin") {
          slytherin += 1;
      } else if (q == "hufflepuff") {
          hufflepuff += 1;
      } else if (q == "ravenclaw") {
          ravenclaw += 1;
      }
  }

  var maxHouse = "gryffindor";
  var maxScore = gryffindor;

  if (slytherin > maxScore) {
      maxHouse = "slytherin";
      maxScore = slytherin;
  }

  if (hufflepuff > maxScore) {
      maxHouse = "hufflepuff";
      maxScore = hufflepuff;
  }

  if (ravenclaw > maxScore) {
      maxHouse = "ravenclaw";
      maxScore = ravenclaw;
  }


  user.house = maxHouse;

  user.save(function(err) {
    if (err) {
      console.log(err);
      alert("There was an error saving the user's house.");
    } else {
      alert("gryffindor: "+ gryffindor + "\n slytherin: "+ slytherin + "\n hufflepuff: "+ hufflepuff + "\n ravenclaw: "+ ravenclaw + "\n\nThe house with the highest score is " + maxHouse + " with " + maxScore + " points.\nYour house has been saved.");
    }
  });
}
