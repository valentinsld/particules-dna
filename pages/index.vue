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
        this.DNA.rotationTarget += ev.wheelDelta * 0.01
      })
    },
  },
}
</script>
