<template>
  <nuxt-link to="/" class="logo">
    <h1>
      <div>Boilerplate</div>
      <span>Nuxt</span><span class="dash">-</span><span>ThreeJS</span>
    </h1>
  </nuxt-link>
</template>

<script>
export default {
  name: 'LogoBoilerplate',
}
</script>

<style lang="scss" scoped>
.logo {
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 1;

  &::after {
    content: none;
  }
}

h1 {
  font-family: var(--font-family-serif);
  font-size: 24px;
  line-height: 1.2;

  text-shadow: 0 0 4px var(--primary);
  transition: text-shadow 400ms cubic-bezier(0, 0.44, 0.33, 1.24);

  div {
    font-size: 121%;
  }
  span {
    color: var(--primary);

    &.dash {
      font-weight: 800;
      color: white;
      text-shadow: 1px 1px 0 white;
    }
  }

  &:hover {
    text-shadow: 0 0 14px var(--primary);
  }
}
</style>
