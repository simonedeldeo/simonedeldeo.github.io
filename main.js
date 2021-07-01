//import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
//import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { OBJLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/MTLLoader.js'

const scene = new THREE.Scene();
const bgLoader = new THREE.TextureLoader();
const bgTexture = bgLoader.load('space.png');
scene.background = bgTexture;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#backg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.setY(20);
camera.position.setZ(30);

renderer.render(scene, camera);

//const tgeom = new THREE.TorusGeometry(10, 3, 16, 100);
const geometry = new THREE.DodecahedronGeometry(10, 0);
const material = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
    wireframe: false,
    reflectivity: 0.9
});
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
//scene.add(mesh);
mesh.position.set(0, 15, -10);

// 0x8888ff 0x2222a0
const pointlight1 = new THREE.PointLight(0xaaaaaa, 1, 200);
pointlight1.position.set(20, 50, 0);
pointlight1.castShadow = true;
pointlight1.shadowDarkness = 0.5;
const pointlight2 = new THREE.PointLight(0xffffff, 1, 200);
pointlight2.position.set(-10, 40, 0);
pointlight2.castShadow = true;
pointlight2.shadowDarkness = 0.5;
scene.add(pointlight1, pointlight2);

//const ambientlight = new THREE.AmbientLight(0xffffff);
//scene.add(ambientlight);

//const gridhelper = new THREE.GridHelper(200, 50);
//scene.add(gridhelper);

//const controls = new OrbitControls(camera, renderer.domElement);

let voronoi;
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();
mtlLoader.load(
    'voronoi.mtl',
    (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load(
            "voronoi.obj",
            function ( obj ) {
                voronoi = obj;
                obj.scale.set(15, 15, 15);
                obj.position.set(7, 15, 0);
                obj.traverse(function(child){child.castShadow = true;});
                scene.add( obj );
            }
        );
    }
);

var groundTexture = new THREE.TextureLoader().load('moon_fin.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set( 30, 50 );
groundTexture.anisotropy = 64;
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
var groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    normalMap: normalTexture
});
var planemesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1000, 1000 ), groundMaterial );
planemesh.position.y = 0.0;
planemesh.rotation.x = - Math.PI / 2;
planemesh.receiveShadow = true;
scene.add( planemesh );

function animate() {
    requestAnimationFrame(animate);
    voronoi.rotation.x += 0.03;
    voronoi.rotation.y += 0.02;
    voronoi.rotation.z += 0.01;
    //camera.rotation.x += 0.02;
    //camera.rotation.y -= 0.02;
    //camera.rotation.z += 0.02;
    renderer.render(scene, camera);
}

animate();