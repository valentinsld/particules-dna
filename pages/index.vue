<template>
  <div />
</template>

<script>
import WebGL from '~/webgl'

export default {
  name: 'IndexPage',
  mounted() {
    this.DNA = new WebGL().DNA

    this.initScroll()
  },
  methods: {
    initScroll() {
      window.addEventListener('wheel', (ev) => {
        this.DNA.rotationTarget +=
          Math.max(Math.min(ev.wheelDelta, 40), -40) * 0.01
      })
    },
  },
}
</script>
