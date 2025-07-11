<script>
import { ProfileService } from "@/users/services/profile.service.js";

export default {
  name: "SellClotheModal",
  props: {
    visible: { type: Boolean, default: false },
    clothe: { type: Object, required: true }
  },
  data() {
    return {
      email: "",
      error: "",
      loading: false,
      profileService: new ProfileService()
    };
  },
  methods: {
    async confirm() {
      this.error = "";
      this.loading = true;
      try {
        // Obtener todos los perfiles de usuario
        const profiles = await this.profileService.getAll();

        // Filtrar el comprador por correo electrónico
        const comprador = profiles.find(profile => profile.email.toLowerCase() === this.email.toLowerCase());

        // Si no se encuentra el comprador
        if (!comprador) {
          this.error = "Correo no encontrado. Ingresa un correo válido.";
          this.loading = false;
          return;
        }

        // Ahora pasamos el correo del comprador a la función onConfirmSell
        console.log("Correo recibido para comprador:", this.email); // Verificar si el correo es correcto
        this.$emit("confirm", { correoComprador: this.email, clothe: this.clothe });
      } catch (e) {
        this.error = "Error al buscar el correo.";
        console.error(e);
      }
      this.loading = false;
    },close() {
      this.$emit("close");
    }
  }

};
</script>

<template>
  <div v-if="visible" class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <div class="modal-title">Vender Prenda</div>
      <div class="form-group">
        <label>Correo del comprador:</label>
        <input v-model="email" type="email" placeholder="correo@ejemplo.com"/>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
      <button class="confirm-btn" @click="confirm" :disabled="loading">
        Confirmar venta
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 30px 20px;
  min-width: 400px;
  min-height: 200px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #b46e7e;
  cursor: pointer;
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #b46e7e;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input[type="email"] {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ffd2dd;
}

.error {
  color: #f44336;
  font-size: 0.9rem;
}

.confirm-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.1rem;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
