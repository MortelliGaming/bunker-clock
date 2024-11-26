<template>
    <div v-if="visible" class="overlay">
      <div class="coin">
        <div
          v-if="blindsText !== 'Pause'"
          class="front"
          :style="{ backgroundImage: `url(${coinImage})`, paddingTop: '40px' }"
        >
          <span class="text-content">Blinds UP</span>
        </div>
        <div
          v-else
          class="front"
          :style="{ backgroundImage: `url(${coinImage})`, paddingTop: '40px' }"
        >
          <span class="text-content">{{ blindsText }}</span>
        </div>
        <div
          class="back"
          :style="{ backgroundImage: `url(${coinImage})`, paddingTop: '40px' }"
        >
          <span class="text-content">{{ blindsText }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  const props = defineProps({
    blindsText: String,
  });
  const visible = ref(true); // Control visibility
  
  // Path to your coin image
  import coinImage from "@/assets/icons/bunker-logo-nur-muenze.png";
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap'); /* Clean modern font */
  
  /* Overlay styles */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  /* Coin container */
  .coin {
    width: 400px;
    height: 400px;
    position: relative;
    transform-style: preserve-3d; /* Enables 3D perspective */
    animation: spin 3s infinite linear;
    perspective: 1000px; /* Adds depth */
  }
  
  /* Coin styles */
  .coin > div {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    font-family: 'Oswald', sans-serif; /* Clean font */
    font-size: 40px; /* Adjust size */
    font-weight: 700; /* Ensure bold text */
    color: transparent; /* Set color to transparent to use gradient */
    letter-spacing: 2px;/* Single-color dark outline */
    text-rendering: geometricPrecision; /* Ensure sharp rendering */
  }
  
  /* Gradient effect using text-shadow */
  .text-content {
    background: linear-gradient(45deg, #ffd700, #f2d742, #ffd700); /* Gradient colors */
    -webkit-background-clip: text; /* Apply gradient only to text */
    background-clip: text; /* Ensure gradient is clipped properly */
    color: transparent; /* Text should be transparent so the gradient shows */
    font-size: 40px; /* Make text large enough */
    font-weight: 700;/* Single-color outline for better sharpness */
    text-align: center;
  }
  
  /* Front side */
  .front {
    transform: rotateY(0deg);
  }
  
  /* Back side */
  .back {
    transform: rotateY(180deg);
  }
  
  /* Spinning animation */
  @keyframes spin {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
  </style>
  