<template>
  <pv-toast />
  <Toolbar />
  <router-view />
</template>

<script>
import Toolbar from "./public/components/Toolbar.vue";
import LanguageSwitcher from "@/public/components/language-switcher.component.vue";

export default {
  components: {
    Toolbar,
    LanguageSwitcher
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
