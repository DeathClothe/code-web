// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Importa componentes de PrimeVue
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';

// Importa estilos de PrimeVue

import 'primeicons/primeicons.css';
import Dialog from "primevue/dialog";
import i18n from "@/i18n.js";

const app = createApp(App);
app.use(i18n);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);


app.component('pv-button', Button);
app.component('pv-input-text', InputText);
app.component('pv-toast', Toast);
app.component('pv-dialog', Dialog)

app.mount('#app');
