<template>
  <div class="recommendations-wrapper">
    <h1 class="recommendations-title">✨ Recomendaciones para ti</h1>
    <div v-if="recommendedClothes.length" class="recommendations-grid">
      <div v-for="item in recommendedClothes" :key="item.id" class="recommendation-card">
        <img :src="item.imagen" :alt="item.nombre" class="recommendation-image" />
        <div class="recommendation-info">
          <h2 class="recommendation-name">{{ item.nombre }}</h2>
          <p class="recommendation-price">S/{{ item.precio }}</p>
          <p class="recommendation-category">{{ item.categorias?.join(', ') }}</p>
        </div>
      </div>
    </div>
    <div v-else class="no-recommendations">
      <p>No hay recomendaciones por ahora.</p>
    </div>
  </div>
</template>

<script>

import ClothingCard from "../components/clothe-card-sale.vue";
import { ClotheService } from "../services/clothe.service.js";
import { ProfileService } from "@/users/services/profile.service.js";
import { useProfileStore } from "@/users/services/profile.store.js";
export default {
  name: "Recommendations",
  data() {
    return {
      allClothes: [],
      recommendedClothes: [],
      profile: null,
    };
  },
  async created() {
    const clotheService = new ClotheService();
    const profileService = new ProfileService();
    const profileStore = useProfileStore();
    profileStore.initialize();

    const userId = profileStore.profile?.id;
    if (!userId) return;

    const [allClothes, userProfile] = await Promise.all([
      clotheService.getAll(),
      profileService.getById(userId)
    ]);
    this.allClothes = allClothes;
    this.profile = userProfile;

    this.recommendedClothes = this.getRecommendedClothes();
  },
  methods: {
    getRecommendedClothes() {
      if (!this.profile || !this.profile.favoritos?.length) {
        return this.allClothes;
      }

      const favoriteIds = this.profile.favoritos;
      const favoriteClothes = this.allClothes.filter(c => favoriteIds.includes(c.id));

      return this.allClothes
          .map(clothe => {
            let score = 0;
            for (const fav of favoriteClothes) {
              if (clothe.tipo === fav.tipo) score += 2;
              if (clothe.color === fav.color) score += 1;
              if (clothe.categorias?.some(cat => fav.categorias?.includes(cat))) score += 1;
            }
            return { ...clothe, score };
          })
          .sort((a, b) => b.score - a.score);
    }
  }
};
</script>

<style scoped>
.recommendations-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff1f4, #ffd6e0);
  padding: 40px 0;
  font-family: 'K2D', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recommendations-title {
  font-size: 2.5rem;
  color: #d96d85;
  font-weight: bold;
  margin-bottom: 30px;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #ffe4ec;
}

.recommendations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  width: 90%;
  max-width: 1200px;
}

.recommendation-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(217, 109, 133, 0.15);
  padding: 20px;
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.recommendation-card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 8px 32px rgba(217, 109, 133, 0.25);
}

.recommendation-image {
  width: 150px;
  height: 180px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px #ffd6e055;
}

.recommendation-info {
  text-align: center;
}

.recommendation-name {
  font-size: 1.2rem;
  color: #b55f6f;
  font-weight: 700;
  margin-bottom: 8px;
}

.recommendation-price {
  color: #d96d85;
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.recommendation-category {
  color: #7a3030;
  font-size: 0.95rem;
}

.no-recommendations {
  margin-top: 60px;
  color: #b46e7e;
  font-size: 1.3rem;
  background: #fff6fa;
  padding: 30px 60px;
  border-radius: 20px;
  box-shadow: 0 2px 12px #f5b9cb33;
}
</style>
