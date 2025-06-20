<template>
  <div class="category-detail-wrapper">
    <div v-if="category">
      <!-- Título con nombre e imagen -->
      <div class="category-header">
        <img :src="category.imagen" :alt="category.nombre" class="category-image" />
        <h1 class="category-title">{{ category.nombre }}</h1>
      </div>

      <!-- Lista de prendas -->
      <div class="clothes-grid" v-if="filteredClothes.length">
        <ClotheCardSale
            v-for="clothe in filteredClothes"
            :key="clothe.id"
            :clothe="clothe"
        />
      </div>
      <div v-else class="no-items">
        <p>No hay prendas disponibles en esta categoría.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import httpInstance from "@/shared/services/http.instance.js";
import ClotheCardSale from "@/sales/components/clothe-card-sale.vue";


const route = useRoute();
const categoryId = route.params.id;

const category = ref(null);
const clothes = ref([]);

const fetchCategory = async () => {
  const res = await httpInstance.get("/categories");
  category.value = res.data.find((c) => c.id === categoryId);
};

const fetchClothes = async () => {
  const res = await httpInstance.get("/clothes");
  clothes.value = res.data;
};

const filteredClothes = computed(() =>
    clothes.value.filter((c) => c.categorias.includes(categoryId))
);

onMounted(() => {
  fetchCategory();
  fetchClothes();
});
</script>

<style scoped>
.category-detail-wrapper {
  background-color: #ffebed;
  min-height: 100vh;
  padding: 20px;
}

.category-header {
  text-align: center;
  margin-bottom: 30px;
}

.category-image {
  max-width: 160px;
  max-height: 160px;
  object-fit: contain;
  margin-bottom: 10px;
  border-radius: 12px;
  background-color: #ffebed;
}

.category-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.clothes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.no-items {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
  color: #888;
}
</style>
