// THIS IS FOR CHANGABLE TEXT
const changeableText = document.querySelector('.changeable-text');
const words = ['Full-Stack Developer', 'Data Analyst', 'Graphic Designer','Software Engineer'];
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

   
    animate();



 // FOR CIRCLES

// Get the container and circles
const container_circle = document.getElementById('container_circle');
const circles = document.querySelectorAll('.circle');

// Function to generate a random number within a range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to initialize circles
function initializeCircles() {
  const circleData = [];

  circles.forEach(circle => {
    const initialX = randomInRange(0, container_circle.clientWidth - circle.clientWidth);
    const initialY = randomInRange(0, container_circle.clientHeight - circle.clientHeight);
    const velocityX = 1 * (Math.random() > 0.5 ? 1 : -1);
    const velocityY = 1 * (Math.random() > 0.5 ? 1 : -1);

    circleData.push({
      element: circle,
      x: initialX,
      y: initialY,
      velocityX,
      velocityY,
    });
  });

  return circleData;
}

// Function to handle collision between circles
function handleCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 100) {
    // Swap velocities to change direction upon collision
    const tempVelocityX = circle1.velocityX;
    const tempVelocityY = circle1.velocityY;

    circle1.velocityX = circle2.velocityX;
    circle1.velocityY = circle2.velocityY;

    circle2.velocityX = tempVelocityX;
    circle2.velocityY = tempVelocityY;
  }
}

// Function to update circles
function updateCircles(circleData) {
  circleData.forEach(circle => {
    circle.x += circle.velocityX;
    circle.y += circle.velocityY;

    // Check collision with container boundaries
    if (circle.x < 0 || circle.x > container_circle.clientWidth - circle.element.clientWidth) {
      circle.velocityX = -circle.velocityX;
    }

    if (circle.y < 0 || circle.y > container_circle.clientHeight - circle.element.clientHeight) {
      circle.velocityY = -circle.velocityY;
    }

    // Check collision with other circles
    circleData.forEach(otherCircle => {
      if (circle !== otherCircle) {
        handleCollision(circle, otherCircle);
      }
    });

    // Update the circle's position
    circle.element.style.left = circle.x + 'px';
    circle.element.style.top = circle.y + 'px';
  });

  // Request the next animation frame
  requestAnimationFrame(() => updateCircles(circleData));
}

// Initialize circles
const circleData = initializeCircles();

// Start the animation loop
updateCircles(circleData);






