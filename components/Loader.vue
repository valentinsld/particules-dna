<template>
  <div :class="{ loader: true, '-endLoading': endLoading }">
    <p class="loader__value">{{ Math.floor(valueLoading) }} %</p>
    <progress
      id="file"
      max="100"
      :value="valueLoading"
      class="loader__progress"
    />
  </div>
</template>

<script>
import anime from 'animejs'
import WebGL from '~/webgl/index.js'

const DURATION_MINIMAL = 2000
const DURATION_ENDED = 400

export default {
  name: 'LoaderCanvas',
  data() {
    return {
      valueLoading: 0,
      animationValue: null,
      animationStarted: null,
      endLoading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.webgl = new WebGL()

      this.animationStarted = new Date()
      this.animationValue = anime({
        targets: this,
        valueLoading: 80,
        easing: 'easeOutQuart',
        duration: DURATION_MINIMAL,
      })

      if (this.webgl.started) {
        this.playLastAnimation()
      } else {
        this.webgl.on('endLoading', this.playLastAnimation.bind(this))
      }
    },
    playLastAnimation() {
      this.animationValue.pause()

      const timeElasped = new Date() - this.animationStarted
      const duration =
        timeElasped > DURATION_MINIMAL
          ? DURATION_ENDED
          : DURATION_MINIMAL - timeElasped

      anime({
        targets: this,
        valueLoading: 100,
        easing: 'easeOutQuart',
        duration,
        complete: () => {
          this.endLoading = true
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--white);
  background-color: var(--black);

  &__value {
    font-family: var(--font-family-serif);
    font-size: 30px;
  }
  &__progress {
    /* Reset the default appearance */
    -webkit-appearance: none;
    appearance: none;
    border: none;

    width: 200px;
    height: 4px;

    &,
    &::-webkit-progress-bar {
      background-color: var(--white);
    }
    &::-webkit-progress-value,
    &::-moz-progress-bar {
      background-color: var(--primary);
    }
  }

  //
  // animation end
  //
  transition: opacity 400ms var(--custom-ease);
  &.-endLoading {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
