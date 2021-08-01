//console.log(window.teste);
import * as THREE from './three.module.js';


let scene = new THREE.Scene();
//scene.background = new THREE.Color( 0xf0f0f0 ); //alpha must be false
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference: 'high-performance'});
renderer.setSize( window.innerWidth, window.innerHeight );
const renderDiv = document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let camPos = [0, 0, 1.3];
camera.position.set( camPos[0], camPos[1], camPos[2]);
camera.lookAt( 0, 0, 0 );

function addLights() {
	const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	scene.add( light );

	const spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 0, 0, 1.3 );

	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;

	scene.add( spotLight );
}
addLights();


import { GLTFLoader } from './GLTFLoader.js';
const loader = new GLTFLoader();

document.getElementById('file3D').addEventListener('change' ,function (event) {
	event.preventDefault();
	//console.log(event.currentTarget.files[0]);
	let filename = event.currentTarget.files[0];
	let reader = new FileReader();
	reader.onload = fileRead;
    reader.readAsText(filename);
	//console.log(reader);
	function fileRead(e) {
        let texto = e.target.result;
        loader.parse(texto, '', function ( gltf ) {
			scene = new THREE.Scene();
			addLights();
			gltf.scene.scale.x = 1;
			gltf.scene.scale.y = 1;
			gltf.scene.scale.z = 1;

			scene.add( gltf.scene );
			
			//console.log(gltf);
			const animate = function () {
				requestAnimationFrame( animate );
				
				renderer.render( scene, camera );
			};

			animate();
			let isDrawing = false;
			let x = 0;
			let y = 0;
			renderDiv.addEventListener('mousedown', function (event) {
				x = event.offsetX;
				y = event.offsetY;
				isDrawing = true;
			});
			renderDiv.addEventListener('mousemove', function (event) {
				if (isDrawing === true) {
					gltf.scene.rotation.y += ((x - event.offsetX) * -0.001);
					gltf.scene.rotation.x += ((y - event.offsetY) * -0.001);
					x = event.offsetX;
					y = event.offsetY;
				}
			});
			renderDiv.addEventListener('mouseup', function (event) {
				x = 0;
				y = 0;
				isDrawing = false;
			});
			
			renderDiv.addEventListener('wheel', function (event) {
				event.preventDefault();
				//console.log(event);
				if (event.ctrlKey) camPos[0] -= event.wheelDelta * 0.001;
				else if (event.shiftKey) camPos[1] -= event.wheelDelta * 0.001;
				else camPos[2] -= event.wheelDelta * 0.001;
				camera.position.set( camPos[0], camPos[1], camPos[2]);
			});

			}, undefined, function ( error ) {

				console.error( error );

		});
	}
	
});
/*
loader.load( './static/escrivaninha.glb', function ( gltf ) {
	
	gltf.scene.scale.x = 1;
	gltf.scene.scale.y = 1;
	gltf.scene.scale.z = 1;

	scene.add( gltf.scene );
	
	console.log(gltf);
	const animate = function () {
		requestAnimationFrame( animate );
		
		renderer.render( scene, camera );
	};

	animate();
	let isDrawing = false;
	let x = 0;
	let y = 0;
	renderDiv.addEventListener('mousedown', function (event) {
		x = event.offsetX;
		y = event.offsetY;
		isDrawing = true;
	});
	renderDiv.addEventListener('mousemove', function (event) {
		if (isDrawing === true) {
			gltf.scene.rotation.y += ((x - event.offsetX) * -0.001);
			gltf.scene.rotation.x += ((y - event.offsetY) * -0.001);
			x = event.offsetX;
			y = event.offsetY;
		}
	});
	renderDiv.addEventListener('mouseup', function (event) {
		x = 0;
		y = 0;
		isDrawing = false;
	});

}, undefined, function ( error ) {

	console.error( error );

} );*/

