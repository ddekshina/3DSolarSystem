//GLOBAL VARIABLES

let scene, camera, renderer, clock;
let sun, stars;
let globalSpeed = 1;
let animationPaused = false;
let currentTheme = 'dark';

// raycaster for mouse interaction
let raycaster, mouse;
let hoveredPlanet = null;

// solar system data 
const solarSystemData = {
    sun: {
        radius: 3,
        color: 0xFDB813,
        rotationSpeed: 0.1,
        name: 'Sun',
        info: {
            diameter: '1.39 million km',
            mass: '1.99 × 10³⁰ kg',
            temperature: '5,778 K',
            type: 'G-type main-sequence star'
        }
    },
    planets: [
        { 
            name: 'Mercury', 
            radius: 0.3, 
            distance: 8, 
            color: 0x8C7853, 
            speed: 4.15, 
            rotationSpeed: 0.02,
            info: {
                diameter: '4,879 km',
                distance: '57.9 million km from Sun',
                day: '58.6 Earth days',
                year: '88 Earth days'
            }
        },
        { 
            name: 'Venus', 
            radius: 0.4, 
            distance: 11, 
            color: 0xFF6B47, 
            speed: 1.62, 
            rotationSpeed: 0.018,
            info: {
                diameter: '12,104 km',
                distance: '108.2 million km from Sun',
                day: '243 Earth days (retrograde)',
                year: '225 Earth days'
            }
        },
        { 
            name: 'Earth', 
            radius: 0.5, 
            distance: 15, 
            color: 0x4F94CD, 
            speed: 1.0, 
            rotationSpeed: 0.02,
            info: {
                diameter: '12,756 km',
                distance: '149.6 million km from Sun',
                day: '24 hours',
                year: '365.25 days'
            }
        },
        { 
            name: 'Mars', 
            radius: 0.4, 
            distance: 20, 
            color: 0xCD5C5C, 
            speed: 0.53, 
            rotationSpeed: 0.019,
            info: {
                diameter: '6,792 km',
                distance: '227.9 million km from Sun',
                day: '24.6 hours',
                year: '687 Earth days'
            }
        },
        { 
            name: 'Jupiter', 
            radius: 1.2, 
            distance: 30, 
            color: 0xD2691E, 
            speed: 0.084, 
            rotationSpeed: 0.04,
            info: {
                diameter: '142,984 km',
                distance: '778.5 million km from Sun',
                day: '9.9 hours',
                year: '12 Earth years'
            }
        },
        { 
            name: 'Saturn', 
            radius: 1.0, 
            distance: 40, 
            color: 0xB8860B, 
            speed: 0.034, 
            rotationSpeed: 0.038,
            info: {
                diameter: '120,536 km',
                distance: '1.43 billion km from Sun',
                day: '10.7 hours',
                year: '29 Earth years'
            }
        },
        { 
            name: 'Uranus', 
            radius: 0.7, 
            distance: 50, 
            color: 0x4FD0E7, 
            speed: 0.012, 
            rotationSpeed: 0.03,
            info: {
                diameter: '51,118 km',
                distance: '2.87 billion km from Sun',
                day: '17.2 hours (retrograde)',
                year: '84 Earth years'
            }
        },
        { 
            name: 'Neptune', 
            radius: 0.7, 
            distance: 60, 
            color: 0x4169E1, 
            speed: 0.006, 
            rotationSpeed: 0.032,
            info: {
                diameter: '49,528 km',
                distance: '4.50 billion km from Sun',
                day: '16.1 hours',
                year: '165 Earth years'
            }
        }
    ]
};

// Arrays to store planets and their orbit groups
let planets = [];
let orbitGroups = [];

// Camera controls
let cameraControls = {
    isRotating: false,
    isPanning: false,
    lastMouseX: 0,
    lastMouseY: 0,
    rotationX: 0,
    rotationY: 0,
    distance: 80,
    targetDistance: 80,
    panX: 0,
    panY: 0
};

// INITIALIZATION
function init() {
    console.log('🚀 Initializing Solar System...');
    
    document.getElementById('status').textContent = 'Initializing...';
   
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(
        75,                                          
        window.innerWidth / window.innerHeight,     
        0.1,                                        
        1000                                        
    );
    
    camera.position.set(0, 20, cameraControls.distance);
    camera.lookAt(0, 0, 0);
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,           
        alpha: true                
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    updateRendererBackground();
    
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    clock = new THREE.Clock();
    
    // Create background stars
    createStars();
    
    // Create sun and planets
    createSun();
    createPlanets();
    

    setupLighting();

    setupControls();
    
    setupCameraControls();
    
    setupMouseInteraction();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
    
    // Update status
    document.getElementById('status').textContent = 'Ready! 🌟';
    
    console.log('✅ Solar System initialized successfully!');
}

// CREATE BACKGROUND STARS
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        // Random position in a large sphere
        const radius = 400 + Math.random() * 400;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Random star color (slightly blue to yellow)
        const color = new THREE.Color();
        color.setHSL(0.15 + Math.random() * 0.1, 0.2 + Math.random() * 0.3, 0.8 + Math.random() * 0.2);
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    console.log('✨ Background stars created');
}

// CREATE SUN
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(
        solarSystemData.sun.radius,  
        32,                          
        32                           
    );
    
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: solarSystemData.sun.color,
    });
    
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);  
    sun.userData = { 
        type: 'sun', 
        data: solarSystemData.sun 
    };
    
    scene.add(sun);
    
    console.log('☀️ Sun created at center');
}

// CREATE PLANETS
function createPlanets() {
    solarSystemData.planets.forEach((planetData, index) => {
        const planetGeometry = new THREE.SphereGeometry(planetData.radius, 16, 16);
        
        const planetMaterial = new THREE.MeshLambertMaterial({ 
            color: planetData.color 
        });
        
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Store planet data for interaction
        planet.userData = { 
            type: 'planet', 
            data: planetData 
        };
        
        // Create orbit group (invisible container that will rotate)
        const orbitGroup = new THREE.Group();
        
        // Position planet at its orbital distance from center
        planet.position.x = planetData.distance;
        planet.position.y = 0;
        planet.position.z = 0;
        
        orbitGroup.add(planet);
        

        scene.add(orbitGroup);
        
        // Store references for animation
        planets.push({
            mesh: planet,
            data: planetData,
            orbitGroup: orbitGroup,
            orbitAngle: Math.random() * Math.PI * 2,  // Random starting position
            speedMultiplier: 1.0  // Individual speed control
        });
        
        orbitGroups.push(orbitGroup);
        
        console.log(`🪐 ${planetData.name} created at distance ${planetData.distance}`);
    });
    
    console.log(`✅ Created ${planets.length} planets`);
}

//LIGHTING SETUP
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 200);
    sunLight.position.set(0, 0, 0);  
    sunLight.castShadow = true;
    scene.add(sunLight);
    
    // Additional directional light for better visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    console.log('✅ Lighting setup complete');
}

//THEME

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.textContent = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    updateRendererBackground();
    
    // Update stars opacity based on theme
    if (stars) {
        stars.material.opacity = currentTheme === 'dark' ? 0.8 : 0.3;
    }
    
    console.log(`Theme switched to: ${currentTheme}`);
}

function updateRendererBackground() {
    const bgColor = currentTheme === 'dark' ? 0x0a0a0a : 0xf0f0f0;
    renderer.setClearColor(bgColor, 1);
}

//CONTROLS SETUP

function setupControls() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Global speed control
    const speedSlider = document.getElementById('global-speed');
    speedSlider.addEventListener('input', (e) => {
        globalSpeed = parseFloat(e.target.value);
        console.log('Global speed changed to:', globalSpeed);
    });
    
    // Pause/Resume button
    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.addEventListener('click', () => {
        animationPaused = !animationPaused;
        pauseBtn.textContent = animationPaused ? '▶️ Resume' : '⏸️ Pause';
        console.log('Animation', animationPaused ? 'paused' : 'resumed');
    });
    
    // Create individual planet speed controls
    createPlanetSpeedControls();
    
    console.log('✅ Controls setup complete');
}

// CREATE PLANET SPEED CONTROLS
function createPlanetSpeedControls() {
    const planetControlsContainer = document.getElementById('planet-controls');
    
    planets.forEach((planetObj, index) => {
        // Create container for this planet's controls
        const planetControl = document.createElement('div');
        planetControl.className = 'planet-control';
        
        // Planet color indicator
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'planet-color';
        colorIndicator.style.backgroundColor = `#${planetObj.data.color.toString(16).padStart(6, '0')}`;
        
        // Planet name
        const planetName = document.createElement('span');
        planetName.className = 'planet-name';
        planetName.textContent = planetObj.data.name;
        
        // Speed slider
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0';
        speedSlider.max = '3';
        speedSlider.step = '0.1';
        speedSlider.value = '1';
        speedSlider.style.flex = '1';
        
        // Speed value display
        const speedValue = document.createElement('span');
        speedValue.textContent = '1.0x';
        speedValue.style.minWidth = '35px';
        speedValue.style.fontSize = '11px';
        speedValue.style.color = 'var(--text-muted)';
        
        // Add event listener for real-time speed changes
        speedSlider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            planetObj.speedMultiplier = newSpeed;
            speedValue.textContent = `${newSpeed.toFixed(1)}x`;
            console.log(`${planetObj.data.name} speed changed to: ${newSpeed}x`);
        });
        
        // Assemble the control
        planetControl.appendChild(colorIndicator);
        planetControl.appendChild(planetName);
        planetControl.appendChild(speedSlider);
        planetControl.appendChild(speedValue);
        
        // Add to container
        planetControlsContainer.appendChild(planetControl);
    });
    
    console.log('✅ Individual planet speed controls created');
}

//MOUSE INTERACTION SETUP
function setupMouseInteraction() {
    const canvas = renderer.domElement;
    
    // hover detection
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseout', onMouseOut);
    
    console.log('✅ Mouse interaction setup complete');
}

function onMouseMove(event) {
    // Don't show tooltip if currently dragging
    if (cameraControls.isRotating || cameraControls.isPanning) {
        hideTooltip();
        return;
    }
    
    // Calculate mouse position in normalized device coordinates
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with planets and sun
    const intersectableObjects = [sun, ...planets.map(p => p.mesh)];
    const intersects = raycaster.intersectObjects(intersectableObjects);
    
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        
        if (intersectedObject !== hoveredPlanet) {
            hoveredPlanet = intersectedObject;
            showTooltip(event.clientX, event.clientY, intersectedObject.userData.data);
        }
        
        // Change cursor to pointer
        canvas.style.cursor = 'pointer';
    } else {
        if (hoveredPlanet) {
            hoveredPlanet = null;
            hideTooltip();
        }
        canvas.style.cursor = 'default';
    }
}

function onMouseOut() {
    hideTooltip();
    hoveredPlanet = null;
}

// TOOLTIP MANAGEMENT
function showTooltip(x, y, data) {
    const tooltip = document.getElementById('planet-tooltip');
    const content = document.getElementById('tooltip-content');
    
    let html = `<h4>${data.name}</h4>`;
    
    if (data.info) {
        html += `<div class="planet-info" style="border-left-color: #${data.color.toString(16).padStart(6, '0')}">`;
        html += `<p><strong>Diameter:</strong> ${data.info.diameter}</p>`;
        if (data.name !== 'Sun') {
            html += `<p><strong>Distance:</strong> ${data.info.distance}</p>`;
            html += `<p><strong>Day Length:</strong> ${data.info.day}</p>`;
            html += `<p><strong>Year Length:</strong> ${data.info.year}</p>`;
        } else {
            html += `<p><strong>Mass:</strong> ${data.info.mass}</p>`;
            html += `<p><strong>Temperature:</strong> ${data.info.temperature}</p>`;
            html += `<p><strong>Type:</strong> ${data.info.type}</p>`;
        }
        html += `</div>`;
    }
    
    content.innerHTML = html;
    
    // Position tooltip
    tooltip.style.left = (x + 15) + 'px';
    tooltip.style.top = (y - 10) + 'px';
    
    tooltip.classList.add('visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('planet-tooltip');
    tooltip.classList.remove('visible');
}

// CAMERA CONTROLS SETUP
function setupCameraControls() {
    const canvas = renderer.domElement;
    
    // Mouse event listeners
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onCameraMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onMouseWheel);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu
    
    // Touch event listeners for mobile
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);
    
    console.log('✅ Camera controls setup complete');
}

// MOUSE CONTROLS
function onMouseDown(event) {
    if (event.button === 0) { // Left mouse button
        cameraControls.isRotating = true;
    } else if (event.button === 2) { // Right mouse button
        cameraControls.isPanning = true;
    }
    
    cameraControls.lastMouseX = event.clientX;
    cameraControls.lastMouseY = event.clientY;
    
    // Hide tooltip when dragging
    hideTooltip();
    
    // Prevent context menu on right click
    event.preventDefault();
}

function onCameraMouseMove(event) {
    if (!cameraControls.isRotating && !cameraControls.isPanning) return;
    
    const deltaX = event.clientX - cameraControls.lastMouseX;
    const deltaY = event.clientY - cameraControls.lastMouseY;
    
    if (cameraControls.isRotating) {
        cameraControls.rotationY += deltaX * 0.01;
        cameraControls.rotationX += deltaY * 0.01;
        
        // Limit vertical rotation
        cameraControls.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraControls.rotationX));
    }
    
    if (cameraControls.isPanning) {
        cameraControls.panX -= deltaX * 0.1;
        cameraControls.panY += deltaY * 0.1;
    }
    
    cameraControls.lastMouseX = event.clientX;
    cameraControls.lastMouseY = event.clientY;
}

function onMouseUp(event) {
    cameraControls.isRotating = false;
    cameraControls.isPanning = false;
}

function onMouseWheel(event) {
    cameraControls.targetDistance += event.deltaY * 0.01;
    cameraControls.targetDistance = Math.max(10, Math.min(200, cameraControls.targetDistance));
    event.preventDefault();
}

// TOUCH CONTROLS
function onTouchStart(event) {
    if (event.touches.length === 1) {
        cameraControls.isRotating = true;
        cameraControls.lastMouseX = event.touches[0].clientX;
        cameraControls.lastMouseY = event.touches[0].clientY;
    }
    hideTooltip();
    event.preventDefault();
}

function onTouchMove(event) {
    if (event.touches.length === 1 && cameraControls.isRotating) {
        const deltaX = event.touches[0].clientX - cameraControls.lastMouseX;
        const deltaY = event.touches[0].clientY - cameraControls.lastMouseY;
        
        cameraControls.rotationY += deltaX * 0.01;
        cameraControls.rotationX += deltaY * 0.01;
        
        cameraControls.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraControls.rotationX));
        
        cameraControls.lastMouseX = event.touches[0].clientX;
        cameraControls.lastMouseY = event.touches[0].clientY;
    }
    event.preventDefault();
}

function onTouchEnd(event) {
    cameraControls.isRotating = false;
    cameraControls.isPanning = false;
}

// UPDATE CAMERA
function updateCamera() {
    // Smooth zoom
    cameraControls.distance += (cameraControls.targetDistance - cameraControls.distance) * 0.1;
    
    // Calculate camera position based on rotation and distance
    const x = Math.cos(cameraControls.rotationX) * Math.sin(cameraControls.rotationY) * cameraControls.distance;
    const y = Math.sin(cameraControls.rotationX) * cameraControls.distance;
    const z = Math.cos(cameraControls.rotationX) * Math.cos(cameraControls.rotationY) * cameraControls.distance;
    
    camera.position.set(x + cameraControls.panX, y + cameraControls.panY, z);
    camera.lookAt(cameraControls.panX, cameraControls.panY, 0);
}

// ANIMATION LOOP
function animate() {

    requestAnimationFrame(animate);
    
    updateCamera();
    
    if (!animationPaused) {
        // Get time delta for smooth animation
        const deltaTime = clock.getDelta();
        
        // Rotate the sun
        if (sun) {
            sun.rotation.y += deltaTime * solarSystemData.sun.rotationSpeed * globalSpeed;
        }
        
        // Slowly rotate stars for subtle background movement
        if (stars) {
            stars.rotation.y += deltaTime * 0.01 * globalSpeed;
        }
        
        // Animate planets
        planets.forEach((planetObj) => {
            // Update orbit angle using both global speed and individual speed
            planetObj.orbitAngle += deltaTime * planetObj.data.speed * globalSpeed * planetObj.speedMultiplier;
            
            // Rotate the orbit group to make planet revolve around sun
            planetObj.orbitGroup.rotation.y = planetObj.orbitAngle;
            
            // Rotate planet on its own axis
            planetObj.mesh.rotation.y += deltaTime * planetObj.data.rotationSpeed * globalSpeed;
        });
    }
    
    renderer.render(scene, camera);
}

// WINDOW RESIZE HANDLER
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Hide tooltip on resize
    hideTooltip();
    
    console.log('✅ Window resized');
}

//START APPLICATION
document.addEventListener('DOMContentLoaded', init);