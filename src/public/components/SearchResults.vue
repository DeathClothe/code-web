<template>
  <div class="search-results">
    <h2>Resultados para "{{ query }}"</h2>

    <div class="filters">
      <select v-model="selectedType">
        <option value="">Tipo</option>
        <option value="polo">Polo</option>
        <option value="pantalón">Pantalón</option>
        <option value="vestido">Vestido</option>
        <option value="zapatillas">Zapatillas</option>
        <option value="chaqueta">Chaqueta</option>
        <!-- Agrega más tipos si lo necesitas -->
      </select>

      <select v-model="selectedSize">
        <option value="">Talla</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>

      <select v-model="selectedColor">
        <option value="">Color</option>
        <option value="negro">Negro</option>
        <option value="blanco">Blanco</option>
        <option value="rojo">Rojo</option>
        <option value="azul">Azul</option>
        <option value="gris">Gris</option>
        <!-- Agrega más colores si lo necesitas -->
      </select>
    </div>

    <div v-if="filteredClothes.length" class="results-grid">
      <ClotheCardSale
          v-for="clothe in filteredClothes"
          :key="clothe.id"
          :clothe="clothe"
      />
    </div>

    <div v-else class="no-results">No se encontraron resultados.</div>
  </div>
</template>

<script>
import { ClotheService } from "@/sales/services/clothe.service.js";
import ClotheCardSale from "@/sales/components/clothe-card-sale.vue";

export default {
  components: {
    ClotheCardSale
  },

  data() {
    return {
      clothes: [],
      query: this.$route.query.q || '',
      selectedType: '',
      selectedSize: '',
      selectedColor: '',
    };
  },
  computed: {
    filteredClothes() {
      return this.clothes.filter(item => {
        const nameMatch = item.nombre.toLowerCase().includes(this.query.toLowerCase());
        const typeMatch = this.selectedType ? item.tipo === this.selectedType : true;
        const sizeMatch = this.selectedSize ? item.talla === this.selectedSize : true;
        const colorMatch = this.selectedColor ? item.color === this.selectedColor : true;
        return nameMatch && typeMatch && sizeMatch && colorMatch;
      });
    }
  },
  async created() {
    const service = new ClotheService();
    this.clothes = await service.getAll();
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.query = newQuery;
    }
  },
  methods: {
    goToDetail(clothe) {
      this.$router.push(`/clothing/${clothe.id}`);
    }
  }
};
</script>

<style scoped>
.search-results {
  background: #ffebed;
  padding: 2rem;
  min-height: 100vh;
  font-family: 'K2D', sans-serif;
}
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.filters select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}
.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.clothe-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  width: 180px;
  cursor: pointer;
  text-align: center;
  background: #f9f9f9;
}
.clothe-img {
  width: 100%;
  height: 200px;
  object-fit: contain;
}
.info {
  padding: 10px;
}
.no-results {
  margin-top: 2rem;
  font-style: italic;
  color: #666;
}
</style>
