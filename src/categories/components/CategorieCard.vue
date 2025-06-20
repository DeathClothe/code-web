<!-- CategoryCard.vue -->
<template>
  <div class="categorie-card" @click="$emit('select', categorie)">
    <div class="categorie-image-box">
      <img :src="categorie.imagen" alt="categoria imagen" />
    </div>
    <div class="categorie-title">{{ categorie.nombre }}</div>
  </div>
</template>


<script setup>
defineProps({
  categorie: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.categorie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  margin: 0 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.categorie-card:hover {
  transform: scale(1.05);
}

.categorie-image-box {
  background-color: #f5b9cb;
  border-radius: 16px;
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

.categorie-image-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.categorie-title {
  margin-top: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #000;
  text-align: center;
}
</style>
