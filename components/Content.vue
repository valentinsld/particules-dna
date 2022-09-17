<template>
  <div class="content">
    <h1 class="content__title">Particules <span>DNA</span></h1>
    <p class="content__text">
      Training project with particules.
    </p>
    <p class="content__text">
      It's inspired from the website of <a href="https://dnacapital.com/" target="_blank">DNA Capital</a>
    </p>
    <p class="content__text -last">
      Developement by <a href="https://valentinsld.fr" target="_blank">valentinsld</a>
    </p>

    <p ref="scroll" class="content__scroll">
      Scroll</br>to rotate
    </p>
  </div>
</template>

<script>
import WebGL from '~/webgl'

export default {
  name: 'TextsContent',
  mounted() {
    this.initScroll()
  },
  methods: {
    initScroll() {
      const scroll = this.$refs.scroll
      const DNA = new WebGL().DNA

      DNA.addScrollElement(scroll)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  position: absolute;
  top: 42vh;
  left: 12vw;
  transform: translate3d(0, -50%, 0);

  &__title {
    margin-bottom: 30px;

    font-family: var(--font-family-serif);
    font-size: 3em;

    text-shadow: 0 0 20px #1242bd;

    span {
      background: linear-gradient(135deg,#1954ec,#293583);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__text {
    margin-top: 0;
    margin-bottom: 7px;

    font-size: 18px;

    &.-last {
      margin-bottom: 60px;
    }
  }

  &__scroll {
    position: relative;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    width: 80px;
    height: 80px;

    font-size: 16px;
    line-height: 24px;
    text-shadow: 0 0 20px #1242bd53;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    &::before {
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transform: scale(1.2);
    }
    &::after {
      background: radial-gradient(#1242bd53 0%, #1242bd00 75%);
      transform: scale(1.4);
    }
  }
}
</style>
