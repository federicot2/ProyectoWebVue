<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { XRButton } from 'three/examples/jsm/webxr/XRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const showModal = ref(false);
const threeContainer = ref(null);

let camera, scene, renderer, controller1, controller2, controllerGrip1, controllerGrip2, raycaster, controls, group;
const intersected = [];

onMounted(() => {
    init();
    animate();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onWindowResize);
});

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    controls = new OrbitControls(camera, threeContainer.value);
    controls.target.set(0, 1.6, 0);
    controls.update();

    const floorGeometry = new THREE.PlaneGeometry(6, 6);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.3;
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    scene.add(new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 3;
    light.shadow.camera.bottom = -3;
    light.shadow.camera.right = 3;
    light.shadow.camera.left = -3;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    group = new THREE.Group();
    scene.add(group);

    const loader = new GLTFLoader();
    loader.load(
        '/model/GuachaAr.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.y = 1;
            group.add(model);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% Cargado');
        },
        (error) => {
            console.error('Error al cargar el modelo GLB', error);
        }
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    threeContainer.value.appendChild(renderer.domElement);

    document.body.appendChild(XRButton.createButton(renderer, { 'optionalFeatures': ['depth-sensing'] }));

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

    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;
    controller1.add(line.clone());
    controller2.add(line.clone());

    raycaster = new THREE.Raycaster();

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
    if (controller.userData.targetRayMode === 'screen') return;
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

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    cleanIntersected();
    intersectObjects(controller1);
    intersectObjects(controller2);
    renderer.render(scene, camera);
}
</script>





<template>
    <div>
        <v-dialog v-model="showModal" max-width="500">
            <v-card>

                <v-card-title>
                    <span class="headline">Información del Guachapali</span>
                    <v-spacer></v-spacer>
                </v-card-title>

                <v-card-text>
                    <div class="imagen">
                        <!--<img src="/img/rob.jpg" alt="roble" />-->
                    </div>
                    <p>
                        Árbol mediano, caducifolio, de copa extendida e irregular.
                        El fuste es generalmente negruzco, retorcido, muy fisurado
                        y ramificado a baja altura. La corteza es llamativa y con
                        largas fisuras verde amarillentas, que contrastan con el color
                        café oscuro de la corteza interna, con lomos prominentes y muy áspera.
                        Las hojas son imparipinnadas, alternas, presentan frecuentemente de 9 a 21
                        hojuelas membranáceas, verde brillante en la superficie superior, pálidas
                        por debajo, de 1,5 a 3,5 cm de largo.
                        Las flores son amarillas, muy vistosas, en racimos axilares, muy atrayentes,
                        cubren completamente el árbol al final de la época lluviosa.
                        Su floración es una fuente de néctar y de polen, siendo esta especie visitada
                        por abejas grandes de las llamadas carpinteras.
                    </p>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="primary" text @click="showModal = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <div style="position: relative; height: 100vh;">

            <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); color: white;">
                <h1>Guachapali</h1>
            </div>

            <div ref="threeContainer"></div>

            <div class="button-container">
                <v-btn @click="showModal = true" class="pauseButton">Info</v-btn>
            </div>

        </div>




    </div>
</template>

<style>
.titlePosition {
    text-align: center;
}

.pauseButton {
    margin: 10px;
}

.imagen {
    text-align: center;
    margin-bottom: 20px;
}

.descripcion {
    margin-top: 20px;
}

.modal-content {
    padding: 20px;
}

.informacion {
    text-align: justify;
}


.button-container {
    position: absolute;
    bottom: 20px;
    left: 20px;
}

@media (max-width: 768px) {
    .button-container {
        bottom: 10px; /* Ajusta la posición si es necesario para dispositivos móviles */
        left: 10px;   /* Ajusta la posición si es necesario para dispositivos móviles */
    }


}
</style>