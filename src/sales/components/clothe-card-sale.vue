<template>
  <div class="clothe-card-sale">
    <router-link :to="`/clothe/${clothe.id}`">
      <img :src="clothe.imagen" :alt="clothe.nombre" class="clothe-image" />
    </router-link>
    <div class="clothe-info">
      <h3>{{ clothe.nombre }}</h3>
      <p>Precio: S/{{ clothe.precio }}</p>
      <!-- Corazón clickeable -->
      <button @click="toggleFavorite">
        <span class="heart-icon">{{ isFavorite ? "❤️" : "🤍" }}</span>
      </button>
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
.heart-icon {
  font-size: 1.8rem;
  cursor: pointer;
  user-select: none;
  margin-left: 10px;
}
.clothe-card-sale {
  position: relative;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.clothe-image {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.clothe-info {
  text-align: center;
}

.clothe-info h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #333;
}

.clothe-info p {
  font-size: 0.95rem;
  color: #555;
  margin: 2px 0;
}
</style>
