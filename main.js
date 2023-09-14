import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
let resized = false;
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, 1, 0.1 , 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});


function resizeCanvasToDisplaySize(force) {
  const canvas = renderer.domElement;
  // console.log(canvas.width);
  // console.log(canvas.clientWidth);
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (force || width !== window.innerWidth || height !== window.innerHeight) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false );
    canvas.width = width;
    canvas.height = height;
    renderer.setPixelRatio( window.devicePixelRatio );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // update any render target sizes here
  }
}
resizeCanvasToDisplaySize(true);







renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(-100000);


const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

// Lights

// const pointLight = new THREE.PointLight(0xffffff, 10);
// pointLight.position.set(0,0,0);
// scene.add(pointLight);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


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

Array(50).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


// avatar

const alexTexture = new THREE.TextureLoader().load('ProfilePhoto.jpg');

const alex = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: alexTexture })
);

scene.add(alex);

//  space station
// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'space_station_v_2001_a_space_odyssey/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {

    gltf.scene.scale.set(0.001, 0.001, 0.001); 
    const root = gltf.scene;
    scene.add(root);

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
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');


const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ 
    map: moonTexture,
    normalMap: normalTexture
 })
);

moon.position.z = 30;
moon.position.setX(-10); // same as moon.position.x = -10


scene.add(moon);


function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  alex.rotation.y += 0.01;
  alex.rotation.x += 0.01;

  camera.position.z = t * -0.01;
  if (camera.position.z < 0){
    camera.position.z = 0;
  } 
  camera.position.x = t * -0.0002;
  if (camera.position.x < 0){
    camera.position.x = 0;
  } 
  camera.position.y = t * -0.0002;
  if (camera.position.y < 0){
    camera.position.y = 0;
  } 

  // console.log("z", camera.position.z);
  // console.log("x", camera.position.x);
  // console.log("y", camera.position.y);
}

document.body.onscroll = moveCamera;



// animation loop

function animate (){


  // resizeCanvasToDisplaySize();
  if (resized) resize();
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

animate();


// Function to handle screen size changes
function handleResize() {
  // Get the new width and height of the window
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // You can add your logic here to respond to the screen size change
  console.log(`Window size changed to ${newWidth}x${newHeight}`);
}

// Add an event listener for the 'resize' event
window.addEventListener('resize', handleResize);

// You might also want to call handleResize initially to get the initial screen size
handleResize();




// resize event listener
window.addEventListener('resize', function() {
    resized = true
})

function resize() {
  resized = false

  // update the size
  renderer.setSize(window.innerWidth, window.innerHeight)

  // update the camera
  const canvas = renderer.domElement
  camera.aspect = canvas.clientWidth/canvas.clientHeight
  camera.updateProjectionMatrix()
}