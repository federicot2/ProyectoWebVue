<template>
    <div ref="container" id="container"></div>
    <div ref="annotation" class="annotation">Anotación</div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as THREE from 'three';
  
  const container = ref(null);
  const annotation = ref(null);
  
  onMounted(() => {
    // Crear la escena, la cámara y el renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.value.appendChild(renderer.domElement);
  
    // Crear un cubo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  
    camera.position.z = 5;
  
    // Actualizar la posición de la anotación
    function updateAnnotationPosition() {
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(cube.matrixWorld);
      vector.project(camera);
  
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
  
      annotation.value.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }
  
    // Animar la escena
    function animate() {
      requestAnimationFrame(animate);
  
      cube.rotation.x += 0.09;
      cube.rotation.y += 0.09;
  
      renderer.render(scene, camera);
      updateAnnotationPosition();
    }
  
    animate();
  
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  });
  </script>
  
  <style>
  .annotation {
    position: absolute;
    background-color: white;
    padding: 5px;
    border: 1px solid black;
    border-radius: 3px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    pointer-events: none; /* Para permitir interacciones con la escena 3D */
  }
  </style>
  