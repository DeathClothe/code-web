<template>
  <div class="explore-container">
    <h2>Explorar Prendas</h2>

    <!-- ✅ Carrusel de Categorías -->
    <div class="section">
      <h3>Categorías</h3>
      <div class="categories-carousel">
        <button class="carousel-arrow left" @click="scrollLeft('categories')">
          <img src="/public/FLECHAIZQUIERDA.png" alt="left arrow" />
        </button>

        <div class="carousel-items" ref="categoriesCarousel">
          <CategoriesList />
        </div>

        <button class="carousel-arrow right" @click="scrollRight('categories')">
          <img src="/public/FlechaContinuar.png" alt="right arrow" />
        </button>
      </div>
    </div>

    <!-- ✅ Carrusel de Ofertas -->
    <div class="section">
      <h3>Ofertas</h3>
      <div class="offers-carousel">
        <button class="carousel-arrow left" @click="scrollLeft('offers')">
          <img src="/public/FLECHAIZQUIERDA.png" alt="left arrow" />
        </button>

        <div class="carousel-items" ref="offersCarousel">
          <ClothingCard
              v-for="item in novedades"
              :key="item.id"
              :clothe="item"
              context="explore"
          />
        </div>

        <button class="carousel-arrow right" @click="scrollRight('offers')">
          <img src="/public/FlechaContinuar.png" alt="right arrow" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ClothingCard from "../components/clothe-card-sale.vue";
import CategoriesList from "/src/categories/components/CategoriesList.vue";
import { ClotheService } from "../services/clothe.service.js";
import { ProfileService } from "@/users/services/profile.service.js";

export default {
  components: { ClothingCard, CategoriesList },
  data() {
    return {
      offers: [],
      novedades: [],
    };
  },
  mounted() {
    const clotheService = new ClotheService();
    const profileService = new ProfileService();

    Promise.all([clotheService.getAll(), profileService.getAll()])
        .then(([clothes, profilesResponse]) => {
          const profiles = profilesResponse.data || profilesResponse;
          const publicadosIds = profiles.flatMap(
              (profile) => profile.publicados || []
          );
          this.novedades = clothes.filter((clothe) =>
              publicadosIds.includes(clothe.id)
          );
        })
        .catch((error) => {
          console.error("Error cargando prendas o perfiles:", error);
        });
  },
  methods: {
    scrollLeft(target) {
      const refName =
          target === "categories" ? "categoriesCarousel" : "offersCarousel";
      const carousel = this.$refs[refName];
      if (carousel) {
        carousel.scrollBy({ left: -200, behavior: "smooth" });
      }
    },
    scrollRight(target) {
      const refName =
          target === "categories" ? "categoriesCarousel" : "offersCarousel";
      const carousel = this.$refs[refName];
      if (carousel) {
        carousel.scrollBy({ left: 200, behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
.explore-container {
  background-color: #ffebed;
  padding: 20px;
}

.section {
  margin-bottom: 30px;
}

h2,
h3 {
  font-family: "K2D", sans-serif;
  color: #333;
  margin: 10px 0;
}

/* Carrusel de categorías */
.categories-carousel,
.offers-carousel {
  display: flex;
  align-items: center;
  background-color: #ffebed;
  border-radius: 12px;
  padding: 16px;
  overflow: hidden;
}

/* Contenedor scrollable de tarjetas */
.carousel-items {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;
}

/* Ocultar scrollbars */
.carousel-items::-webkit-scrollbar {
  display: none;
}
.carousel-items {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* Flechas de navegación */
.carousel-arrow {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s ease;
  z-index: 1;
}

.carousel-arrow:hover {
  transform: scale(1.15);
}

.carousel-arrow img {
  width: 50px;
  height: 50px;
}
</style>
