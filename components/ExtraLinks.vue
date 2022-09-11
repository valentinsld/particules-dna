<template>
  <div class="extraLinks">
    <a href="https://github.com/valentinsld/boilerplate-nuxt-three"
      >Boilerplate on Github</a
    >
    <a href="https://www.valentinsld.fr">by Valentin Sld</a>
  </div>
</template>

<script>
export default {
  name: 'ExtraLinks',
}
</script>

<style lang="scss" scoped>
.extraLinks {
  position: absolute;
  z-index: 10;
  bottom: 20px;
  right: 40px;
  display: flex;

  transition: opacity 400ms var(--custom-ease);

  &:hover a {
    opacity: 0.5;
  }
}

.extraLinks a {
  --padding-x: 10px;
  padding-left: var(--padding-x);
  padding-right: var(--padding-x);
  color: var(--primary);

  &::after {
    left: var(--padding-x);
    right: var(--padding-x);
  }

  &:hover {
    opacity: 1 !important;
  }
}
</style>
