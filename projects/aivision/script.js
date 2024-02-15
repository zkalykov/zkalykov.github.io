var title = document.getElementById("title");
title.innerHTML = "Welcome to Hand-Gesture";
var count_title = 1;

function myFunction() {
    if (count_title === 1) {
        title.innerHTML = "Hand Gesture Detector";
        count_title = 2;
    } else if (count_title === 2) {
        title.innerHTML = "Version 0.1";
        count_title = 1;
    }
}

setInterval(myFunction, 6000);

// for welcoming 
function showLoading() {
            document.getElementById('loading').style.display = 'block';
        }

      

        function printWordsSequentially() {
            const words = ["Meet", "new", "AI", "Vision"];

            // Display each word sequentially
            for (let i = 0; i < words.length; i++) {
                setTimeout(function() {
                    document.getElementById("words").innerHTML += (i > 0 ? " " : "") + words[i];
                }, 1000 * i );
            }

            // Schedule the movement after all words have been displayed
            setTimeout(function() {
                var wordsElement = document.getElementById('words');
                wordsElement.style.transform = 'translateY(-20vh)';
            }, 1000 * words.length);

            // Show the image after the words have been moved
            setTimeout(function() {
                document.getElementById("img").style.display = 'block';
            }, 1000 * words.length + 500);

            setTimeout(function() {
                showLoading(); // This will show the loading animation
            }, 1000 * words.length + 1000); // Adjusted to show after the transition


        }

        printWordsSequentially();

