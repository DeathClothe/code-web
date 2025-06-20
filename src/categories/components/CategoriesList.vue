<template>
  <div class="categories-list">
    <CategorieCard
        v-for="categorie in categories"
        :key="categorie.id"
        :categorie="categorie"
        @click="goToCategoryDetail(categorie)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CategorieCard from "./CategorieCard.vue";
import httpInstance from "@/shared/services/http.instance.js";

const categories = ref([]);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const response = await httpInstance.get("/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const goToCategoryDetail = (categorie) => {
  router.push(`/categoria/${categorie.id}`);
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.categories-list {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}
</style>
