<template>
  <div class="recommendations-wrapper">
    <div v-if="recommendedClothes.length">
      <!-- Primera sección -->
      <div class="recommendation-section">
        <h2 class="section-subtitle">Basados en tus favoritos:</h2>
        <div class="section-card">
          <div class="recommendations-grid">
            <ClotheCardSale
                v-for="item in recommendedClothes.slice(0, 6)"
                :key="item.id"
                :clothe="item"
            />
          </div>
        </div>
      </div>

      <!-- Segunda sección -->
      <div class="recommendation-section">
        <h2 class="section-subtitle">Otras recomendaciones:</h2>
        <div class="section-card">
          <div class="recommendations-grid">
            <ClotheCardSale
                v-for="item in recommendedClothes.slice(6, 12)"
                :key="item.id"
                :clothe="item"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-recommendations">
      <p>No hay recomendaciones por ahora.</p>
    </div>
  </div>
</template>

<script>

import { ClotheService } from "../services/clothe.service.js";
import { ProfileService } from "@/users/services/profile.service.js";
import { useProfileStore } from "@/users/services/profile.store.js";
import ClotheCardSale from "@/sales/components/clothe-card-sale.vue";

export default {
  name: "Recommendations",
  components: {
    ClotheCardSale
  },
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
  background-color: #ffebed;
  padding: 40px 20px;
  font-family: 'K2D', sans-serif;
}

.recommendations-title {
  font-size: 2.3rem;
  color: #b94665;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
}

.recommendation-section {
  margin-bottom: 50px;
}

.section-subtitle {
  font-size: 1.5rem;
  font-weight: bold;
  color: #7a3030;
  margin: 10px 0 20px 20px;
}

.section-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.recommendations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.no-recommendations {
  margin-top: 60px;
  text-align: center;
  font-size: 1.3rem;
  color: #b46e7e;
  background: #fff6fa;
  padding: 30px 60px;
  border-radius: 20px;
  box-shadow: 0 2px 12px #f5b9cb33;
}
</style>
