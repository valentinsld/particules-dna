<template>
  <div>
    <!-- TODO : <Loader /> -->

    <Nuxt style="position: relative; z-index: 1" />
  </div>
</template>

<script>
import WebGL from '~/webgl/index'

export default {
  name: 'LayoutDefault',
  transition: 'fade',
  data() {
    return {
      webgl: null,
    }
  },
  mounted() {
    this.webgl = new WebGL()
    this.webgl.appendCanvas(this.$el.parentElement)
  },
  destroyed() {
    this.webgl.destroy()
  },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
