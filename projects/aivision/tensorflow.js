    var letthemknow_elemet  = document.getElementById("letknow");
      var print_pos = document.getElementById("print_pos");
      const video = document.getElementById('webcam');
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      // Set video width and height
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      
      // Adjust canvas size to match the video. Remove explicit positioning to rely on CSS.
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      resolve(video);
    };
  });
}


      async function loadModel() {
        const model = await handpose.load();
        console.log("Handpose model loaded");
        letthemknow_elemet.innerHTML="<h2>Model laoded Successfully!</h2>";
        document.getElementById('loading').style.display = 'none';
        document.getElementById('welcome').style.display = 'none';
        return model;
      }

      function connect(ctx, landmarks, start, end) {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];
        ctx.beginPath();
        ctx.moveTo(startPoint[0], startPoint[1]);
        ctx.lineTo(endPoint[0], endPoint[1]);
        ctx.stroke();
      }

      function drawHandWeb(ctx, landmarks) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;

        // Thumb
        connect(ctx, landmarks, 0, 1);
        connect(ctx, landmarks, 1, 2);
        connect(ctx, landmarks, 2, 3);
        connect(ctx, landmarks, 3, 4);

        // Index finger
        connect(ctx, landmarks, 0, 5);
        connect(ctx, landmarks, 5, 6);
        connect(ctx, landmarks, 6, 7);
        connect(ctx, landmarks, 7, 8);

        // Middle finger
        connect(ctx, landmarks, 0, 9);
        connect(ctx, landmarks, 9, 10);
        connect(ctx, landmarks, 10, 11);
        connect(ctx, landmarks, 11, 12);

        // Ring finger
        connect(ctx, landmarks, 0, 13);
        connect(ctx, landmarks, 13, 14);
        connect(ctx, landmarks, 14, 15);
        connect(ctx, landmarks, 15, 16);

        // Pinky
        connect(ctx, landmarks, 0, 17);
        connect(ctx, landmarks, 17, 18);
        connect(ctx, landmarks, 18, 19);
        connect(ctx, landmarks, 19, 20);

        // Draw the landmarks as circles
        for (let i = 0; i < landmarks.length; i++) {
          const x = landmarks[i][0];
          const y = landmarks[i][1];
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);          
          ctx.fillStyle = 'cyan';
          ctx.fill();
        }
      }
      function interpretHandSign(landmarks) {

        const thumbToPalmThresholdA = 30; 
        const thumbToIndexTipThresholdO = 25; 
        const maxFingertipDistanceO = 50; 
        let to_print = "";
        let cc = 0;
        let cc2 = 0;
        let fingerNames = ["THUMB", "INDEX", "MIDDLE", "RING", "LITTLE"]; // Names of the fingers

        for (let i = 0; i < landmarks.length; i++) {
          cc++;
          const x = Math.trunc(landmarks[i][0]/10); // Take only the integer part of x
          const y = Math.trunc(landmarks[i][1]/10);
          let fingerName = fingerNames[cc2]; // Get the current finger name based on cc2

          if (cc === 1) {
            to_print += fingerName + "<br>A - x: " + x + " y: " + y + "<br>";
          } else if (cc === 2) {
            to_print += "B - x: " + x + " y: " + y + "<br>";
          } else if (cc === 3) {
            to_print += "C - x: " + x + " y: " + y + "<br>";
          } else if (cc === 4) {
            to_print += "D - x: " + x + " y: " + y + "<br><br>";
          }

          if (cc === 4) {
            cc2++;
            cc = 0;
          }

          if (cc2 >= fingerNames.length) {
            break; // Stop the loop if we've processed all fingers
          }
        }
        print_pos.innerHTML = "<br>"+to_print;

        // Detect Thumbs Up
        let thumbTipY = landmarks[3][1];
        let fingersExtended = false;
        let otherFingerTipsY = [landmarks[7][1], landmarks[11][1], landmarks[15][1], landmarks[19][1]];
        let extendedFingersCount = otherFingerTipsY.filter(fingerTipY => fingerTipY < thumbTipY).length;
        fingersExtended = extendedFingersCount > 0;
        let isThumbsUp = !fingersExtended && thumbTipY < otherFingerTipsY.reduce((a, b) => a < b ? a : b);

        if (isThumbsUp) {
          return "Thumbs Up";
        }

        // Detect Thumbs Down
        let isThumbsDown = !fingersExtended && thumbTipY > otherFingerTipsY.reduce((a, b) => a > b ? a : b);

        if (isThumbsDown) {
          return "Thumbs Down";
        }

        // Detect Okay Gesture
        let thumbTipToIndexTipDistance = Math.sqrt(Math.pow(landmarks[4][0] - landmarks[8][0], 2) + Math.pow(landmarks[4][1] - landmarks[8][1], 2));
        let isOkay = thumbTipToIndexTipDistance < thumbToIndexTipThresholdO && extendedFingersCount === 3; // Assuming the thumb and index form a circle and three other fingers are extended

        if (isOkay) {
          return "Okay";
        }

        // Detect 'A' Gesture
        const thumbTipToPalmDistance = Math.sqrt(Math.pow(landmarks[4][0] - ((landmarks[0][0] + landmarks[9][0]) / 2), 2) + Math.pow(landmarks[4][1] - ((landmarks[0][1] + landmarks[9][1]) / 2), 2));
        
        if (thumbTipToPalmDistance < thumbToPalmThresholdA) {
          return 'A';
        }

        // Detect 'O' Gesture
        const indexToFingerDistances = [];
        for (let i = 8; i <= 20; i += 4) {
          for (let j = i + 4; j <= 20; j += 4) {
            const dx = landmarks[i][0] - landmarks[j][0];
            const dy = landmarks[i][1] - landmarks[j][1];
            indexToFingerDistances.push(Math.sqrt(dx * dx + dy * dy));
          }
        }
        
        const isCircle = indexToFingerDistances.every(distance => distance < maxFingertipDistanceO);
        if (thumbTipToIndexTipDistance < thumbToIndexTipThresholdO && isCircle) {
          return 'O';
        }

        // If no specific gesture is detected
        return 'Searching for gesture...';
}

async function detectHands(model, video) {
    const signOutput = document.getElementById('signOutput');
    
    async function detect() {
        const predictions = await model.estimateHands(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Always clear the canvas first

        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                drawHandWeb(ctx, predictions[i].landmarks);
                // Update this line to call your actual sign interpretation function
                const letter = interpretHandSign(predictions[i].landmarks);
                signOutput.textContent = letter;
            }
        } else {

            // No hands detected, so perform the following actions:
            signOutput.textContent = 'No hand detected'; // Update UI to indicate no hand detected
            // Optionally, you can also perform other actions like logging, alerts, etc.
            
        }
        requestAnimationFrame(detect); // Continue the detection loop
    }

    detect();
}


      (async function main() {
        await setupCamera();
        video.play();
        const model = await loadModel();
        detectHands(model, video);
      })();