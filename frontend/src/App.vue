<script setup lang="ts">
import { reactive } from "vue";

const signupForm = reactive({
  isPassenger: false,
  step: 1,
});

function calculateProgress(): number {
  let progress = 0;
  if (signupForm.isPassenger) progress += 25;
  return progress;
}

function next(): void {
  signupForm.step++;
}
</script>

<template>
  <div class="step">Step {{ signupForm.step }}</div>
  <div class="progress">{{ calculateProgress() }}%</div>
  <input
    type="checkbox"
    name="is-passnger"
    id="input-is-passenger"
    v-model="signupForm.isPassenger"
  />
  Passenger

  <button class="button-next" @click="next()">Next</button>
</template>

<style scoped></style>
