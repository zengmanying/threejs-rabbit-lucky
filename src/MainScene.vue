<script setup>
  import { ref, onMounted, onUnmounted } from "vue"
  import Game from "./components/game"
  const gameContainerRef = ref(null)
  let game
  onMounted(() => {
    game = new Game(gameContainerRef.value)
  })
  onUnmounted(() => {
    game.destroy()
  })
</script>
<template>
  <div class="game-container" ref="gameContainerRef"></div>
</template>