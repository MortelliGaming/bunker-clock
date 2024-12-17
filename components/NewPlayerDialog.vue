<template>
    <!-- Dialog component -->
    <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
          <v-card-title class="text-h6">Spielername</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="username"
              label="Username"
              outlined
              clearable
              :rules="usernameRules"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="storeUsername">Save</v-btn>
            <v-btn @click="close">Cancel</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  const emit = defineEmits(['save'])
  // State
  const dialog = ref(false);
  const username = ref('');
  const usernameRules = [
    (value: string) => !!value || 'Username is required',
  ];
  
  function reset() {
    username.value = '';
  }
  // Methods
  function open() {
    reset();
    dialog.value = true;
  }
  
  function close() {
    dialog.value = false;
    reset()
  }
  
  function storeUsername() {
    if (!username.value) return; // Validation handled by rules
    // Emit the username or handle it here
    emit('save', username.value)
    close();
  }
  
  // Expose open method
  defineExpose({
    open,
  });
  </script>
  