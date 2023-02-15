// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
// -> event fires when the HTML document has been completely parsed, and all deferred scripts (<script defer src="…"> and <script type="module">) have downloaded and executed. It doesn't wait for other things like images, subframes, and async scripts to finish loading.

//the hogwarts music library - another vesrion is with embed in index layout

// const song = new Audio();    
// song.src = " audio/HogwartsMusic.mp3 " ;
// song.volume = 0.3 ;

document.addEventListener("DOMContentLoaded", () => {
  console.log("w6-hogwarts-remote JS imported successfully!");

  //play hogwarts music

  // song.play();
});

