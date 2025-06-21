<script>
export default {
  name: "EditProfileModal",
  props: {
    visible: Boolean,
    profile: Object
  },
  data() {
    return {
      form: {
        nombre: "",
        apellidos: "",
        direccion: "",
        tipo: "comprador",
        imageprofile: ""
      }
    };
  },
  watch: {
    profile: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            nombre: val.nombre || "",
            apellidos: val.apellidos || "",
            direccion: val.direccion || "",
            tipo: val.tipo || "comprador",
            imageprofile: val.imageprofile || ""
          };
        }
      }
    }
  },
  methods: {
    onSave() {
      this.$emit("save", { ...this.form });
      this.$emit("update:visible", false);
    },
    onCancel() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<template>
  <pv-dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      :closable="false"
      :style="{ width: '400px', background: '#fff', borderRadius: '20px' }"
  >
    <template #header>
      <h2 class="modal-title">Editar perfil</h2>
    </template>
    <form @submit.prevent="onSave">
      <div class="form-group">
        <label>Nombre:</label>
        <input v-model="form.nombre" type="text" required />
      </div>
      <div class="form-group">
        <label>Apellidos:</label>
        <input v-model="form.apellidos" type="text" required />
      </div>
      <div class="form-group">
        <label>Dirección:</label>
        <input v-model="form.direccion" type="text" />
      </div>
      <div class="form-group">
        <label>Tipo:</label>
        <select v-model="form.tipo">
          <option value="comprador">Comprador</option>
          <option value="vendedor">Vendedor</option>
        </select>
      </div>
      <div class="form-group">
        <label>Imagen de perfil (URL):</label>
        <input v-model="form.imageprofile" type="text" />
      </div>
      <div class="modal-actions">
        <button type="button" @click="onCancel" class="cancel-btn">Cancelar</button>
        <button type="submit" class="save-btn">Guardar</button>
      </div>
    </form>
  </pv-dialog>
</template>

<style>
.modal-title {
  text-align: center;
  width: 100%;
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 18px;
  color: #e4738f;
  letter-spacing: 1px;
}

form {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #b46e7e;
  font-size: 1rem;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e4738f;
  font-size: 1rem;
  background: #fff6f8;
  transition: border 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border: 1.5px solid #b46e7e;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background: #ffd2dd;
  border: none;
  padding: 8px 18px;
  border-radius: 12px;
  color: #b46e7e;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.cancel-btn:hover {
  background: #e4738f;
  color: #fff;
}

.save-btn {
  background: #e4738f;
  border: none;
  padding: 8px 18px;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.save-btn:hover {
  background: #b46e7e;
}

.p-dialog .p-dialog-header .p-dialog-header-icon {
  margin-right: 10px !important;
}

</style>