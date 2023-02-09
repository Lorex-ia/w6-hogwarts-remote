// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("w6-hogwarts-remote JS imported successfully!");
});



// Sorting hat quizz code
function submit_quizz(){
  var gryffindor =0;
  var slytherin =0;
  var hufflepuff =0;
  var ravenclaw =0;

//     var q1 = document.querySelector('input[name="animal"]:checked').value;
//     var q2 = document.querySelector('input[name="garden"]:checked').value;
//     var q3 = document.querySelector('input[name="death"]:checked').value;
//     var q4 = document.querySelector('input[name="road"]:checked').value;
//     var q5 = document.querySelector('input[name="night"]:checked').value;

// if (q1 == "gryffindor"){
//     gryffindor +=1;
// }else if (q1 == "slytherin"){
//     slytherin +=1;
// }else if (q1 == "hufflepuff"){
//     hufflepuff +=1;
// }else if (q1 == "ravenclaw"){
//     ravenclaw +=1;
// }
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

  alert("gryffindor: "+ gryffindor + "\n slytherin: "+ slytherin + "\n hufflepuff: "+ hufflepuff + "\n ravenclaw: "+ ravenclaw);

  // window.onload = submit_quizz;

}