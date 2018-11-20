<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
    this.$http.get(api).then((res) => {
      console.log(res.data);
    })
  },
}
</script>

<style lang="scss">
@import "./assets/all";
</style>
