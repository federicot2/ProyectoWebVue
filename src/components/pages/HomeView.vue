<template>
  <div class="d-flex justify-center align-center min-vh-100">
    <v-card
      class="mx-auto"
      prepend-icon="$vuetify"
      subtitle="Realidad Aumentada"
      width="400"
    >
      <template v-slot:title>
        <span class="font-weight-black">¡Bienvenido al proyecto!</span>
      </template>

      <v-card-text class="bg-surface-light pt-4">
        El proyecto UTP de realidad aumentada de flora y fauna, una iniciativa innovadora que combina la fascinante biodiversidad de la Universidad Tecnológica de Panamá con la última tecnología en el campo de la realidad aumentada.
      </v-card-text>
    </v-card>
  </div>
</template>

<style>
  .min-vh-100 {
    min-height: 100vh;
  }
</style>
