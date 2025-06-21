<script>

export default {
  name: "page-not-found",

  data() {
    return {
      unavailableRoute: null,
    }
  },
  created() {
    this.unavailableRoute = this.$route.path;
  }
}
</script>

<template>
  <div class="w-full">
    <h1>Pagina no encontrada</h1>
    <p>La ruta {{ unavailableRoute }} no es valida.</p>
    <router-link to="/start">Ir al inicio</router-link>
  </div>
</template>

<style scoped>
.w-full{
  width: 100%;
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
h1{
  font-size: 4rem;
}
p{
  font-size: 2rem;
}
</style>