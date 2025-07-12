<script>
export default {
  name: "language-switcher",
  data() {
    return {
      languages: [],
    }
  },
  created() {
    this.languages = this.$i18n.availableLocales;
  },
  computed: {
    currentLang() {
      return this.$i18n.locale;
    }
  },
  methods: {
    setLang(lang) {
      this.$i18n.locale = lang;
    }
  }
}
</script>

<template>
  <div class="lang-switcher">
    <button
        v-for="lang in languages"
        :key="lang"
        :class="{ active: currentLang === lang }"
        @click="setLang(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>

.lang-switcher {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.lang-switcher button {
  background: #fff;
  color: #c4456b;
  border: none;
  border-radius: 20px;
  padding: 6px 18px;
  margin-right: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  outline: none;
}

.lang-switcher button.active {
  background: #c4456b;
  color: #fff;
}

.lang-switcher button:last-child {
  margin-right: 0;
}

</style>