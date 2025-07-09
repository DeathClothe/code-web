<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <button class="back-btn" @click="$emit('close')">←</button>
      <h2 class="title">Agregar Nueva Prenda</h2>

      <div class="form-group" v-for="(field, key) in fieldLabels" :key="key" v-if="key !== 'categorias'">
        <label>{{ field.label }}:</label>
        <input :type="field.type || 'text'" v-model="newClothe[key]" />
        <p v-if="errors[key]" class="error-message">{{ errors[key] }}</p>
      </div>

      <!-- Checkboxes para categorías -->
      <div class="form-group">
        <label>Categorías:</label>
        <div class="checkbox-list">
          <label v-for="cat in categoryOptions" :key="cat.id" class="checkbox-item">
            <input
                type="checkbox"
                :value="cat.id"
                v-model="newClothe.categorias"
            />
            {{ cat.nombre }}
          </label>
        </div>
        <p v-if="errors.categorias" class="error-message">{{ errors.categorias }}</p>
      </div>

      <div class="modal-actions">
        <button class="btn-save" @click="submitClothe">Agregar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClotheAddForm",
  data() {
    return {
      newClothe: {
        id: '',
        nombre: '',
        descripcion: '',
        precio: 0,
        tipo: '',
        talla: '',
        color: '',
        usuario: 0,
        imagen: '',
        categorias: [],
        apiId: 'v1'
      },
      errors: {},
      tallasValidas: ["XS", "S", "M", "L", "XL"],
      coloresValidos: ["blanco", "negro", "rojo", "azul", "verde", "amarillo", "rosado", "gris", "beige", "café"],
      categoryOptions: [
        { id: "C001", nombre: "pantalones" },
        { id: "C002", nombre: "vestidos" },
        { id: "C003", nombre: "zapatillas" },
        { id: "C004", nombre: "gabardinas" },
        { id: "C005", nombre: "polos" },
        { id: "C006", nombre: "chaquetas" },
        { id: "C007", nombre: "camisas" },
        { id: "C008", nombre: "accesorios" },
        { id: "C009", nombre: "suéteres" }
      ],
      fieldLabels: {
        nombre: { label: "Nombre" },
        descripcion: { label: "Descripción" },
        tipo: { label: "Tipo" },
        talla: { label: "Talla" },
        color: { label: "Color" },
        precio: { label: "Precio", type: "number" },
        imagen: { label: "Imagen (URL)" },
      }
    };
  },
  methods: {
    validateForm() {
      const e = {};
      if (!this.newClothe.nombre.trim()) e.nombre = "El nombre es obligatorio.";
      if (!this.newClothe.tipo.trim()) e.tipo = "El tipo es obligatorio.";
      if (!this.newClothe.talla.trim() || !this.tallasValidas.includes(this.newClothe.talla.toUpperCase()))
        e.talla = "Talla inválida. Usa XS, S, M, L o XL.";
      if (!this.newClothe.color.trim() || !this.coloresValidos.includes(this.newClothe.color.toLowerCase()))
        e.color = "Color inválido.";
      if (this.newClothe.precio < 0) e.precio = "El precio no puede ser negativo.";
      if (this.newClothe.categorias.length === 0) e.categorias = "Debe seleccionar al menos una categoría.";
      return e;
    },
    submitClothe() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length > 0) return;

      this.$emit('create', { ...this.newClothe });
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: white;
  border-radius: 40px;
  padding: 40px 30px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  font-family: 'K2D', sans-serif;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #E4738F;
}

.title {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #222;
}

.form-group {
  text-align: left;
  margin: 12px 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #444;
}

.form-group input {
  background: #f5b9cb;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  width: 100%;
  font-size: 14px;
  color: #000;
}

.checkbox-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  background: #f5b9cb;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
}

.checkbox-item input {
  margin: 0;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.btn-save {
  background-color: #E4738F;
  border: none;
  padding: 10px 20px;
  border-radius: 16px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-save:hover {
  background-color: #c85a75;
}
</style>
