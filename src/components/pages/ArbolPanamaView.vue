<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { XRButton } from 'three/examples/jsm/webxr/XRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let container;
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;

let raycaster;

const intersected = [];

let controls, group;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    controls = new OrbitControls(camera, container);
    controls.target.set(0, 1.6, 0);
    controls.update();

    const floorGeometry = new THREE.PlaneGeometry(6, 6);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.25, blending: THREE.CustomBlending, transparent: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.y = -0.3;
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    scene.add(new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 3;
    light.shadow.camera.bottom = - 3;
    light.shadow.camera.right = 3;
    light.shadow.camera.left = - 3;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    group = new THREE.Group();
    scene.add(group);

    // Cargar modelo GLB
    const loader = new GLTFLoader();
    loader.load(
        '/model/panama.glb',
        function (gltf) {
            const model = gltf.scene;

            //model.scale.set(0.1, 0.1, 0.1);
            model.position.y = 1;
            group.add(model);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% Cargado');
        },
        function (error) {
            console.error('Error al cargar el modelo GLB', error);
        }
    );

    //

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(XRButton.createButton(renderer, { 'optionalFeatures': ['depth-sensing'] }));

    // controllers

    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    //

    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

    raycaster = new THREE.Raycaster();

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onSelectStart(event) {

    const controller = event.target;

    const intersections = getIntersections(controller);

    if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.b = 1;
        controller.attach(object);

        controller.userData.selected = object;

    }

    controller.userData.targetRayMode = event.data.targetRayMode;

}

function onSelectEnd(event) {

    const controller = event.target;

    if (controller.userData.selected !== undefined) {

        const object = controller.userData.selected;
        object.material.emissive.b = 0;
        group.attach(object);

        controller.userData.selected = undefined;

    }

}

function getIntersections(controller) {

    controller.updateMatrixWorld();

    raycaster.setFromXRController(controller);

    return raycaster.intersectObjects(group.children, false);

}

function intersectObjects(controller) {

    // Do not highlight in mobile-ar

    if (controller.userData.targetRayMode === 'screen') return;

    // Do not highlight when already selected

    if (controller.userData.selected !== undefined) return;

    const line = controller.getObjectByName('line');
    const intersections = getIntersections(controller);

    if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.r = 1;
        intersected.push(object);

        line.scale.z = intersection.distance;

    } else {

        line.scale.z = 5;

    }

}

function cleanIntersected() {

    while (intersected.length) {

        const object = intersected.pop();
        object.material.emissive.r = 0;

    }

}

//

function animate() {

    renderer.setAnimationLoop(render);

}

function render() {

    cleanIntersected();

    intersectObjects(controller1);
    intersectObjects(controller2);

    renderer.render(scene, camera);

}



// Obtén el botón y la ventana modal
const openModalButton = document.getElementById('openModalButton');
const modal = document.getElementById('modal');

// Agrega un evento de clic al botón para abrir la ventana modal
openModalButton.addEventListener('click', function () {
    modal.style.display = 'block';
});

// Agrega un evento de clic al botón de cierre para cerrar la ventana modal
document.querySelector('.close').addEventListener('click', function () {
    modal.style.display = 'none';
});

// Cierra la ventana modal si el usuario hace clic fuera de ella
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

</script>

<template>
    <button id="openModalButton" class="pauseButton">Info</button>

    <h1 class="title titlePosition">Arbol Panamá</h1>

    <div id="modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>

            <div class="imagen">
                <!--<img src="/img/rob.jpg" alt="roble" />-->
            </div>
            <p>
                Es un árbol adaptado al trópico húmedo y trópico sub-húmedo.El árbol Panamá, árbol nacional
                de Panamá es originario de América Central. Se extiende desde el sur de México y Centroamérica
                hasta Perú y Brasil. Se ha naturalizado en Jamaica y Trinidad y se ha sembrado en el sur de Florida
                (Estados Unidos), Cuba, La Española, Puerto Rico e Islas Vírgenes.

                Crece a orilla de carreteras, en potreros, pendientes, terrenos planos, pendientes
                pronunciadas y relictos de selva. Donde alcanza su máximo desarrollo es a lo largo
                de los ríos. Prospera tanto en suelos someros derivados de material calizo, como
                en suelos lateríticos profundos derivados de aluviones antiguos; alcanzando su
                máximo desarrollo en este tipo de suelos: arcilloso profundo, negro con abundantes
                rocas, arenoso, rojo-arcilloso con basalto. Es tolerante a suelos con mal drenaje.
                Tiene buen comportamiento y rápido crecimiento en zonas secas. Es común en los
                reductos de bosque seco tropical de la vertiente Pacífico del Istmo de Panamá.
            </p>
        </div>
    </div>

    <p class="descripcion informacion">
        El nombre científico del árbol Panamá es, Sterculia apetala. Pertenece a la
        familias de árboles denominada Malvaceaea. Este árbol fue descrito por primera
        vez en la publicación Florae Columbiae terraumque adjacentium specimina selecta
        in peregrinatione duodecim annorum observata delineavit et descripsit2: 35, pl. 118. 1869.
    </p>

</template>