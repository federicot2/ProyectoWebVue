<template>
  <div class="container">
    <!-- Título general -->
    <h1 class="title">Proyecto de Realidad Aumentada</h1>
    
    <!-- Descripción -->
    <p class="description">
      El proyecto UTP de realidad aumentada de flora y fauna es una iniciativa innovadora que combina la fascinante biodiversidad de la Universidad Tecnológica de Panamá con la última tecnología en el campo de la realidad aumentada.
    </p>

    <!-- Tarjetas de información -->
    <div class="cards-container">
      <!-- Tarjeta 1 -->
      <v-card class="card">
        <template v-slot:title>
          <span class="card-title">Arbol Panamá</span>
        </template>
        <v-card-text>
          Un árbol grande de 30-40 metros, nativo de América Central y del Sur, con madera ligera usada en muebles y semillas comestibles.
        </v-card-text>
      </v-card>
      
      <!-- Tarjeta 2 -->
      <v-card class="card">
        <template v-slot:title>
          <span class="card-title">Iguana Verde</span>
        </template>
        <v-card-text>
          Reptil de hasta 2 metros, que vive en selvas tropicales y se alimenta de hojas, flores y frutas.
        </v-card-text>
      </v-card>
      
      <!-- Tarjeta 3 -->
      <v-card class="card">
        <template v-slot:title>
          <span class="card-title">Roble</span>
        </template>
        <v-card-text>
          Árbol robusto del hemisferio norte, conocido por su madera dura y duradera, usada en muebles y barriles.
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 2em;
}

.description {
  margin-bottom: 40px;
  max-width: 600px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  margin: 10px;
  width: 300px;
}

.card-title {
  font-weight: bold;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5em;
  }

  .description {
    font-size: 1em;
    margin-bottom: 20px;
  }

  .card {
    width: 100%;
    max-width: 300px;
  }
}
</style>
