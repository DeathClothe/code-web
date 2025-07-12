<template>
  <div class="wardrobe-wrapper">
    <h1 class="page-title">{{ $t('wardrobe.title') }}</h1>

    <div class="wardrobe-container">
      <div class="filters">
        <button
            v-for="option in categories"
            :key="option.value"
            :class="{ active: selectedCategory === option.value }"
            @click="selectedCategory = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="clothes-scroll-container">
        <button class="arrow left" @click="scrollLeft">
          <img src="/public/FLECHAIZQUIERDA.png" />
        </button>

        <div ref="scrollable" class="clothes-grid">
          <ClotheCardWardrobe
              v-for="item in filteredClothes"
              :key="item.id"
              :clothe="item"
              @edit="selectedClothe = $event"
              @trash="removeFromWardrobe"
          />
        </div>

        <button class="arrow right" @click="scrollRight">
          <img src="/public/FlechaContinuar.png" />
        </button>
      </div>
    </div>

    <!-- Modal de Edición -->
    <EditClotheModal
        v-if="selectedClothe"
        :clothe="selectedClothe"
        @close="selectedClothe = null"
        @save="handleUpdate"
        @sell="openSaleForm"
    />
    <ClotheAddForm
        v-if="showAddForm"
        @close="showAddForm = false"
        @create="addNewClothe"
    />

    <ClotheSaleForm
        v-if="showSaleForm"
        :clothe="saleClothe"
        @close="showSaleForm = false"
        @confirm="publishClothe"
    />

    <!-- Botón Agregar Prendas -->
    <button class="add-clothe-btn" @click="showAddForm = true">{{ $t('wardrobe.button') }}</button>
  </div>
</template>
<script>
import ClotheCardWardrobe from "../components/clothe-card-wardrobe.vue";
import EditClotheModal from "../components/clothe-edit-form.vue";
import { ClotheService } from "@/sales/services/clothe.service.js";
import { useProfileStore } from "@/users/services/profile.store.js";
import { ProfileService } from "@/users/services/profile.service.js";
import ClotheSaleForm from "@/sales/components/clohe-sale-form.vue";
import ClotheAddForm from "../components/add-clothe-form.vue";

export default {
  components: {
    ClotheSaleForm,
    ClotheCardWardrobe,
    EditClotheModal,
    ClotheAddForm,
  },
  data() {
    return {
      clothes: [],
      profile: null,
      selectedClothe: null,
      showSaleForm: false,
      saleClothe: null,
      showAddForm: false,
      selectedCategory: 'ALL',
      categories: [
        { label: "ALL", value: "ALL" },
        { label: "TOPS", value: "TOPS" },
        { label: "BOTTOMS", value: "BOTTOMS" },
        { label: "FOOTWEAR", value: "FOOTWEAR" },
      ]
    };
  },
  computed: {
    userClothes() {
      if (!this.profile) return [];
      return this.clothes.filter(clothe =>
          this.profile.armario?.includes(String(clothe.id))
      );
    },
    filteredClothes() {
      const categoryMap = {
        TOPS: ['polo', 'blusa', 'gabardina', 'camisa', 'casaca', 'chaqueta'],
        BOTTOMS: ['pantalón', 'falda', 'short'],
        FOOTWEAR: ['zapatillas', 'zapatos', 'botines']
      };

      if (this.selectedCategory === 'ALL') return this.userClothes;

      return this.userClothes.filter(clothe =>
          categoryMap[this.selectedCategory].includes(clothe.tipo?.toLowerCase())
      );
    }
  },
  methods: {
    addNewClothe(newClothe) {
      const clotheService = new ClotheService();
      const profileService = new ProfileService();

      const finalClothe = {
        ...newClothe,
        usuario: this.profile.id,
        apiId: "v1"
      };

      clotheService.create(finalClothe)
          .then((created) => {
            this.clothes.push(created);
            if (!this.profile.armario.includes(created.id)) {
              this.profile.armario.push(String(created.id));
            }
            return profileService.update(this.profile.id, this.profile);
          })
          .then(() => {
            return profileService.getById(this.profile.id);
          })
          .then((freshProfile) => {
            this.profile = freshProfile;
            useProfileStore().setProfile(freshProfile);
            this.showAddForm = false;
          })
          .catch(err => {
            alert("Error al agregar la prenda.");
            console.error(err);
          });
    },

    // Corregir la función publishClothe para recargar los datos después de mover la prenda
    async publishClothe(updatedClothe) {
      try {
        // Asegurarse de que el profile esté cargado correctamente
        if (!this.profile) {
          throw new Error('El perfil no está disponible.');
        }

        const profileService = new ProfileService();

        // Mover ID de armario a publicados
        this.profile.armario = this.profile.armario.filter(id => id !== updatedClothe.id);
        if (!this.profile.publicados.includes(updatedClothe.id)) {
          this.profile.publicados.push(updatedClothe.id);
        }

        // Actualizar perfil en el backend
        await profileService.update(this.profile.id, this.profile);

        // Recargar datos del perfil
        await this.loadProfileData();
        useProfileStore().setProfile(this.profile); // Actualizar en el store y localStorage

        this.$toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Prenda puesta en venta',
          life: 3000
        });
      } catch (error) {
        console.error('Error al poner en venta la prenda:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo poner en venta',
          life: 3000
        });
      }
    },

    openSaleForm(clothe) {
      this.saleClothe = { ...clothe };
      this.selectedClothe = null;
      this.showSaleForm = true;
    },

    scrollLeft() {
      this.$refs.scrollable.scrollBy({ left: -300, behavior: "smooth" });
    },
    scrollRight() {
      this.$refs.scrollable.scrollBy({ left: 300, behavior: "smooth" });
    },

    removeFromWardrobe(clothe) {
      const profileService = new ProfileService();

      const updatedArmario = this.profile.armario.filter(id => id !== clothe.id);
      const updatedProfile = {
        ...this.profile,
        armario: updatedArmario
      };

      profileService.update(this.profile.id, updatedProfile)
          .then(() => {
            return profileService.getById(this.profile.id);
          })
          .then(freshProfile => {
            this.profile = freshProfile;
            useProfileStore().setProfile(freshProfile);
          })
          .catch(err => {
            alert("Error al eliminar del armario.");
            console.error(err);
          });
    },

    handleUpdate(updated) {
      const clotheService = new ClotheService();

      clotheService.update(updated)
          .then(res => {
            const index = this.clothes.findIndex(c => c.id === res.id);
            if (index !== -1) {
              this.clothes[index] = res;
            }
            this.selectedClothe = null;
          })
          .catch(err => {
            alert("No se pudo actualizar la prenda.");
            console.error(err);
          });
    },

    // Función para cargar los datos del perfil y prendas
    async loadProfileData() {
      try {
        const profileService = new ProfileService();
        const profile = await profileService.getById(this.profile.id);
        this.profile = profile;
        useProfileStore().setProfile(profile);
      } catch (error) {
        console.error("Error al cargar los datos del perfil", error);
      }
    }
  },
  created() {
    const clotheService = new ClotheService();
    const profileStore = useProfileStore();
    profileStore.initialize();

    if (!profileStore.profile) {
      console.warn("No hay usuario logueado.");
      return;
    }

    this.profile = profileStore.profile;

    clotheService.getAll()
        .then(clothes => {
          this.clothes = clothes;
        })
        .catch(error => {
          console.error("Error cargando prendas:", error);
        });
  }
};
</script>




<style scoped>
.wardrobe-wrapper {
  background-color: #f5b9cb;
  padding: 40px 0;
  min-height: 100vh;
  position: relative;
}

.page-title {
  text-align: center;
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 30px;
  color: black;
  font-family: 'K2D', sans-serif;
}

.wardrobe-container {
  background-color: white;
  border-radius: 50px;
  padding: 40px;
  max-width: 95%;
  margin: 0 auto;
  box-sizing: border-box;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
}

.filters button {
  background-color: #E5E5E5;
  border: 2px solid transparent;
  color: #000;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  transition: border 0.3s;
}

.filters button.active,
.filters button:hover {
  border: 2px solid #E4738F;
}

.clothes-scroll-container {
  position: relative;
  display: flex;
  align-items: center;
}

.arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  z-index: 2;
}

.arrow img {
  width: 32px;
  height: 32px;
}

.clothes-grid {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 20px;
  padding: 10px 0;
  flex: 1;
}

.clothes-grid::-webkit-scrollbar {
  display: none;
}

.add-clothe-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #E4738F;
  color: white;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 100;
}
</style>
