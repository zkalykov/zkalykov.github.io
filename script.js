const changeableText = document.querySelector('.changeable-text');
const words = ['Full-Stack Web Developer', 'Data Analyst', 'Graphic Designer','Software Engineer'];
let currentWord = 0;
const changeWord = () => {
    currentWord++;
	if (currentWord >= words.length) {
		currentWord = 0;
    }
	const newWord = words[currentWord];
	changeableText.innerHTML = newWord;
};
setInterval(changeWord, 2000);


// THIS IS FOR EARTH


// Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true for a transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x00000000, 0); // Set clearColor to fully transparent black
    document.getElementById('earth-container').appendChild(renderer.domElement);

    // Create a sphere (globe)
    const earthRadius = 3; // Set the initial Earth radius
    const geometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('earth-dark.jpg');
    const material = new THREE.MeshStandardMaterial({ map: texture, color: 0x915eff, transparent: true }); // Set the color to "#915eff" and make material transparent
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Set camera position
    camera.position.z = 10;

    // Add ambient light for uniform lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 10); // Adjust intensity as needed
    scene.add(ambientLight);

    // Touch interaction variables
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };

    // Add event listeners for touch interactions
    renderer.domElement.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        globe.rotation.y += deltaX * 0.005;
        globe.rotation.x += deltaY * 0.005;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });

    // Animation
    const animate = function () {
        requestAnimationFrame(animate);

        // Rotate the globe
        if (!isDragging) {
            globe.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
    };

    // Handle window resize
    window.addEventListener('resize', function () {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });

    // Function to change Earth size
    function changeEarthSize(newRadius) {
        globe.geometry.dispose();
        globe.geometry = new THREE.SphereGeometry(newRadius, 32, 32);
    }
    animate();








// HERE GOES SCRIPT FOR CIRCLES


const container_circle = document.getElementById('container_circle');
    const circles = document.querySelectorAll('.circle');

    // Get the width and height of the container
    const containerWidth_circle = container_circle.clientWidth;
    const containerHeight_circle = container_circle.clientHeight;

    // Create an array to store the circle positions
    const circlePositions = [];

    // Create an array to store the circle velocities
    const circleVelocities = [];

    // Initialize the circle positions and velocities
    for (let i = 0; i < circles.length; i++) {
      circlePositions.push({
        x: Math.random() * containerWidth_circle,
        y: Math.random() * containerHeight_circle
      });

      circleVelocities.push({
        x: Math.random() * 2,
        y: Math.random() * 2
      });
    }

    // Update the circle positions and velocities
    function updateCircles() {
      for (let i = 0; i < circles.length; i++) {
        // Update the circle position
        circlePositions[i].x += circleVelocities[i].x;
        circlePositions[i].y += circleVelocities[i].y;

        // Check if the circle has hit a wall
        if (circlePositions[i].x < 0 || circlePositions[i].x > containerWidth_circle) {
          circleVelocities[i].x = -circleVelocities[i].x;
        }

        if (circlePositions[i].y < 0 || circlePositions[i].y > containerHeight_circle) {
          circleVelocities[i].y = -circleVelocities[i].y;
        }

        // Check if the circle has hit another circle
        for (let j = 0; j < circles.length; j++) {
          if (i !== j) {
            const dx = circlePositions[i].x - circlePositions[j].x;
            const dy = circlePositions[i].y - circlePositions[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              circleVelocities[i].x = -circleVelocities[i].x;
              circleVelocities[i].y = -circleVelocities[i].y;
              circleVelocities[j].x = -circleVelocities[j].x;
              circleVelocities[j].y = -circleVelocities[j].y;
            }
          }
        }

        // Update the circle's position on the screen
        circles[i].style.left = circlePositions[i].x + 'px';
        circles[i].style.top = circlePositions[i].y + 'px';
      }

      // Request the next animation frame
      requestAnimationFrame(updateCircles);
    }

    // Start the animation loop
    updateCircles();





