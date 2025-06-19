<template>
  <div class="clothe-card-sale">
    <!-- Corazón arriba a la derecha -->
    <span class="heart-icon" @click.stop="toggleFavorite">
      {{ isFavorite ? "❤️" : "🖤" }}
    </span>

    <!-- Imagen clickeable -->
    <div class="clothing-card" @click="navigateToDetail">
      <img :src="clothe.imagen" :alt="clothe.nombre" />
    </div>

    <!-- Info de prenda -->
    <div class="clothe-info">
      <h3>{{ clothe.nombre }}</h3>
      <p>S/{{ clothe.precio }}</p>
    </div>
  </div>
</template>


<script>
import { useProfileStore } from "@/users/services/profile.store.js";
import { ProfileService } from "@/users/services/profile.service.js";

export default {
  name: "ClotheCardSale",
  props: {
    clothe: { type: Object, required: true }
  },
  data() {
    return {
      profileStore: useProfileStore(),
    };
  },
  computed: {
    isFavorite() {
      const profile = this.profileStore.profile;
      return profile?.favoritos?.includes(this.clothe.id);
    },
  },
  methods: {
    navigateToDetail() {
      this.$router.push(`/clothing/${this.clothe.id}`);
    },
    async toggleFavorite() {
      if (!this.profileStore.profile) {
        alert("Debes iniciar sesión para agregar favoritos.");
        return;
      }

      const updatedProfile = { ...this.profileStore.profile };
      if (!updatedProfile.favoritos) updatedProfile.favoritos = [];

      const index = updatedProfile.favoritos.indexOf(this.clothe.id);
      if (index >= 0) {
        updatedProfile.favoritos.splice(index, 1); // Quitar
      } else {
        updatedProfile.favoritos.push(this.clothe.id); // Agregar
      }

      try {
        const profileService = new ProfileService();
        await profileService.update(updatedProfile.id, updatedProfile);
        this.profileStore.setProfile(updatedProfile);
      } catch (e) {
        alert("Error al actualizar favoritos.");
        console.error(e);
      }
    },
  },
};
</script>

<style scoped>

.clothe-card-sale {
  position: relative;
  background: transparent;
  width: 240px; /* Más ancho */
  text-align: center;
  margin: 15px;
  padding: 8px;
}

/* Caja blanca más amplia */
.clothing-card {
  background: white;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  width: 200px;
  height: 230px;
}

/* Imagen más ancha y alta */
.clothing-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;

}
.clothing-card:hover img {
  transform: scale(1.05);
}

/* Texto más proporcional */
.clothe-info h3 {
  font-size: 1.1rem;
  margin: 10px 0 4px;
  color: #000;
}

.clothe-info p {
  margin: 0;
  font-size: 1rem;
  color: #444;
}

/* Corazón en posición */
.heart-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.7rem;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease;
}
.heart-icon:hover {
  transform: scale(1.25);
}
</style>
