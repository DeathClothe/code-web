<template>
  <div class="login-container">
    <div class="welcome-section">
      <h1>{{ $t('login.title') }}</h1>
      <p>
        {{ $t('login.description') }}
      </p>
      <div class="image-container">
        <img src="/LOGO.png" alt="Bienvenido" />
        <p class="highlight">
          {{ $t('login.highlight') }}
        </p>
      </div>
    </div>

    <div class="form-section">
      <div class="tab-buttons">
        <button :class="{ active: !isRegister }" @click="isRegister = false">{{ $t('login.login') }}</button>
        <button :class="{ active: isRegister }" @click="goToRegister">{{ $t('login.register') }}</button>
      </div>

      <div class="login-form">
        <div class="field">
          <label for="email">{{ $t('login.email') }}</label>
          <input type="email" id="email" v-model="email" placeholder="email@hotmail.com" />
        </div>
        <div class="field">
          <label for="password">{{ $t('login.password') }}</label>
          <input type="password" id="password" v-model="password" placeholder="********" />
          <a href="#" class="forgot-password">{{ $t('login.forgot') }}</a>
        </div>
        <div class="checkbox">
          <input type="checkbox" id="remember" v-model="rememberMe" />
          <label for="remember">{{ $t('login.remember') }}</label>
        </div>
        <button class="login-button" @click="login">{{ $t('login.login') }}</button>
        <p v-if="loginError" class="error">{{ loginError }}</p>

        <div class="social-login">
          <p>{{ $t('login.continue') }}</p>
          <button class="social-btn facebook">Facebook</button>
          <button class="social-btn google">Google</button>
          <button class="social-btn email">Email</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthenticationStore } from "@/iam/services/authentication.store.js";
import { SignInRequest } from "@/iam/model/sign-in.request.js";
import { useProfileStore } from "@/users/services/profile.store.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      loginError: "",
      isRegister: false
    };
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const authenticationStore = useAuthenticationStore();
    const profileStore = useProfileStore();

    return { router, toast, authenticationStore, profileStore };
  },
  methods: {
    async login() {
      try {
        const request = new SignInRequest(this.email, this.password);

        // ✅ Esperamos el resultado del login
        const signInResponse = await this.authenticationStore.signIn(request, this.router);

        if (signInResponse?.id > 0) {
          localStorage.setItem('authToken', signInResponse.token)

          await this.profileStore.fetchProfileById(signInResponse.id); // ✅ usamos el id devuelto
        } else {
          throw new Error("Inicio de sesión fallido: ID no válido.");
        }



        await this.router.push("/start");

      } catch (error) {
        console.error(" Error al iniciar sesión:", error);
        this.loginError = "Correo o contraseña incorrectos.";
      }
    },
    goToRegister() {
      this.router.push("/register");
    }
  }
};
</script>



<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  background-color: #ffebed;
  font-family: 'K2D', sans-serif;
}

.welcome-section {
  width: 50%;
  padding: 20px;
  text-align: center;
}

.welcome-section h1 {
  font-size: 36px;
  color: #000;
  margin-bottom: 20px;
  font-weight: bold;
}

.welcome-section p {
  margin: 10px 0;
  color: #000;
}

.image-container {
  margin-top: 20px;
}

.image-container img {
  width: 250px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.highlight {
  background-color: #e4738f;
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-weight: bold;
}

.form-section {
  width: 45%;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-buttons {
  display: flex;
  margin-bottom: 20px;
}

.tab-buttons button {
  background-color: #fcd5ce;
  color: #000;
  border: none;
  padding: 15px 20px;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  width: 50%;
  font-weight: bold;
  transition: background-color 0.3s;
}

.tab-buttons button.active {
  background-color: #e4738f;
  color: #fff;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  color: #000;
  font-weight: bold;
}

.field input {
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #e4738f;
  border-radius: 5px;
}

.forgot-password {
  color: #e4738f;
  font-size: 14px;
  text-align: right;
  display: block;
  margin-bottom: 15px;
}

.checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox label {
  margin-left: 10px;
  color: #000;
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #e4738f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #d72323;
}

.social-login {
  text-align: center;
}

.social-login p {
  margin-bottom: 15px;
  color: #000;
}

.social-btn {
  width: 100px;
  margin: 5px;
  background-color: #e4738f;
  color: #fff;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
}

.social-btn.facebook {
  background-color: #3b5998;
}

.social-btn.google {
  background-color: #db4437;
}

.social-btn.email {
  background-color: #333;
}

.error {
  color: #d72323;
  margin-bottom: 10px;
  font-weight: bold;
  text-align: center;
}
</style>

