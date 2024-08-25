import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// things to work on
// correct camera perspective on load
// loading screen?
// camera angle
// music

let resized = false;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, 1, 0.1 , 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio( window.devicePixelRatio );
camera.aspect = window.innerWidth / window.innerHeight;
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.set( 0, 0, 0 );
controls.update();
camera.updateProjectionMatrix();


// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);


// const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
// const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
// const torus = new THREE.Mesh( geometry, material );

// scene.add(torus);

// Lights
// const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
// directionalLight.position.set( -1, 0, 0)
// scene.add( directionalLight );

const pointLight = new THREE.PointLight(0xffffff, 100000, 300);
pointLight.position.set(-100,0,-100);
scene.add(pointLight);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh( geometry, material );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);

  const light = new THREE.PointLight(0xffffff, 100);
  light.position.set(x,y,z);

  // const lightHelper = new THREE.PointLightHelper(light);
  // scene.add(lightHelper);
  scene.add(star, light);
}

// Array(50).fill().forEach(addStar);

// const spaceTexture = new THREE.TextureLoader().load('2k_stars.jpg');
// scene.background = spaceTexture;
// let textureLoader = new THREE.TextureLoader();

// let galaxyGeometry = new THREE.SphereGeometry(800, 32, 32);
// let galaxyMaterial = new THREE.MeshBasicMaterial({
//   side: THREE.BackSide
// });
// let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

// // Load Galaxy Textures
// textureLoader.crossOrigin = true;
// // texture.repeat.set(2, 2);
// textureLoader.load(
//   '2k_stars.jpg',
//   function(texture) {
//     // texture.repeat.set(2, 2);
//     galaxyMaterial.map = texture;
//     scene.add(galaxy);
//   }
// );

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load your image texture
const texture = textureLoader.load('2k_stars.jpg');

// Set the repeat property to control tiling
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(3, 3); // This will repeat the texture image twice along both U and V axes

// Create a material using the texture
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });

// Create a geometry (e.g., a plane)
let galaxyGeometry = new THREE.SphereGeometry(800, 32, 32)

// Create a mesh with the material and geometry
let galaxy = new THREE.Mesh(galaxyGeometry, material);

// Add the mesh to your scene
scene.add(galaxy);


// avatar

// const alexTexture = new THREE.TextureLoader().load('ProfilePhoto.jpg');

// const alex = new THREE.Mesh(
//   new THREE.BoxGeometry(3,3,3),
//   new THREE.MeshBasicMaterial({ map: alexTexture })
// );
// scene.add(alex);

const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (item, loaded, total) => {
  const percentComplete = (loaded / total) * 100;
  console.log(`Loading ${item}: ${percentComplete.toFixed(2)}%`);
  loadingText.innerHTML = `Loading ${item}: ${percentComplete.toFixed(2)}%`;
};

loadingManager.onLoad = () => {
  console.log('All assets have been loaded.');
  // Add your code to start rendering or hide loading screen here
};

//  space station
// Instantiate a loader
const loader = new GLTFLoader(loadingManager);
let model;
// Load a glTF resource
loader.load(
	// resource URL
	'space_station_v_2001_a_space_odyssey/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {

    model = gltf.scene;
    model.scale.set(0.001, 0.001, 0.001); 
    model.position.set(10, 0, -60);
    model.rotation.y = Math.PI * 0.1;
    model.rotation.x = Math.PI * -0.05;
    scene.add(model);
    loadingScreen.style.display = 'none';


		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},

	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);



// moon
// const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const earthTexture = new THREE.TextureLoader().load('2k_earth_daymap.jpg');
const normalTexture = new THREE.TextureLoader().load('2k_earth_normal_map.tif');


const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ 
    map: earthTexture,
    normalMap: normalTexture
 })
);

const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(3.05, 32, 32),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('earthcloudmap.jpg'),
    // alphaMap: new THREE.TextureLoader().load('earthcloudmaptrans.jpg'),
    // side: THREE.DoubleSide,
    // transparent: true,
    // opacity: 0.75,
  })
);

let planet = new THREE.Object3D();
// planet.add(earth);
planet.add(clouds);

scene.add(planet);

planet.scale.setScalar(120);
planet.position.x = 500;
planet.position.y = 250; 
planet.position.z = -400;
// planet.position.setX(50); // same as earth.position.x = -10


// scene.add(earth);


function moveCamera(){
  let t = document.body.getBoundingClientRect().top;

    // earth.rotation.x += 0.05;
  earth.rotation.y += 0.05;
  // earth.rotation.z += 0.05;

  // alex.rotation.y += 0.01;
  // alex.rotation.x += 0.01;

  camera.position.z = t * 0.01;
  // if (camera.position.z < 0){
  //   camera.position.z = 0;
  // } 
  camera.position.x = t * -0.0002;
  if (camera.position.x < 0){
    camera.position.x = 0;
  } 
  camera.position.y = t * -0.0002;
  if (camera.position.y < 0){
    camera.position.y = 0;
  } 

  console.log("z", camera.position.z);
  console.log("x", camera.position.x);
  console.log("y", camera.position.y);
}

// document.body.onscroll = moveCamera;

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

// animation loop

function animate (){
  // controls.update();
  if (model) {
    model.position.x -= 0.005; // Move 0.01 units along the X-axis in each frame
    model.position.y -= 0.0015; 
    // model.position.z += 0.01;
    model.rotation.z -= 0.0005;
  }

  planet.rotation.y += 0.0001;

  camera.position.x += 0.001;

    camera.position.z -= 0.01;


  if (resized) resize();
  requestAnimationFrame( animate );

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;


  renderer.render( scene, camera );
}

animate();

function resetAnimation() {
  console.log('resetting animation');
  model.position.set(10, 0, -60);
  camera.position.set( 0, 0, 0 );
  camera.rotation.set( 0, 0, 0 );
  camera.updateProjectionMatrix();
};

// console log camera position every 2 seconds
setInterval(function(){ console.log(camera.position); }, 2000);



// // Function to handle screen size changes
// function handleResize() {
//   // Get the new width and height of the window
//   const newWidth = window.innerWidth;
//   const newHeight = window.innerHeight;

//   // You can add your logic here to respond to the screen size change
//   console.log(`Window size changed to ${newWidth}x${newHeight}`);
// }

// // Add an event listener for the 'resize' event
// window.addEventListener('resize', handleResize);

// // You might also want to call handleResize initially to get the initial screen size
// handleResize();




// resize event listener
window.addEventListener('resize', function() {
    resized = true
})

function resize() {
  resized = false

  // update the size
  // renderer.setSize( window.innerWidth, window.innerHeight );
  // renderer.setPixelRatio( window.devicePixelRatio );
  

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // update the camera
  // const canvas = renderer.domElement
  // camera.aspect = canvas.clientWidth/canvas.clientHeight
  // camera.updateProjectionMatrix()
}


const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading-text');


document.getElementById('resetButton').addEventListener('click', resetAnimation );

