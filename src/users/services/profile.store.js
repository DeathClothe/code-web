import { defineStore } from "pinia";
import { Profile } from "../model/profile.entity.js";
import { profileService } from "./profile.service.js";

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: null
    }),
    actions: {
        setProfile(profileData) {
            this.profile = new Profile(profileData);
            // Actualizar siempre el localStorage con el perfil más reciente
            localStorage.setItem('profile', JSON.stringify(profileData));
        },
        clearProfile() {
            this.profile = null;
            localStorage.removeItem('profile');
        },
        initialize() {
            const savedProfile = localStorage.getItem('profile');
            if (savedProfile) {
                try {
                    this.profile = new Profile(JSON.parse(savedProfile));
                } catch (e) {
                    console.error("Error loading profile:", e);
                    this.clearProfile();
                }
            }
        },
        async fetchProfileById(id) {
            console.log("📣 Llamando a fetchProfileById con ID:", id);
            const response = await profileService.getById(id);
            console.log("🧾 Respuesta del backend:", response);

            const profile = new Profile(response);
            console.log("🧠 Perfil instanciado:", profile);

            this.setProfile(profile); // Llamamos a setProfile para actualizar el store y el localStorage
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.profile
    }
});
