<template>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="parent"
      offset-y
    >
      <v-card>
        <v-list>
          <v-list-item
            tabindex="0"
            v-for="action in actions"
            :key="action.id"
            @click="emitAction(action)"
          >
            <template v-slot:prepend>
              <v-icon>{{ action.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ action.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  // Props for dynamic actions
  defineProps({
    actions: {
      type: Array as () => Array<{ id: string; label: string; icon: string }>,
      required: true,
    },
  });
  
  // Emits for triggering events
  const emit = defineEmits(['action-clicked']);
  
  // Menu state
  const menu = ref(false);
  
  function emitAction(action: { id: string; label: string; icon: string }) {
    // Validate action
    if (!action || !action.id) {
      console.error('Invalid action:', action);
      return;
    }
    console.log(`Action triggered: ${action.label}`);
    emit('action-clicked', action);
    menu.value = false; // Close menu after action
  }
  </script>
  
  <style scoped>
  .v-list-item:hover {
    background-color: var(--v-theme-primary-lighten5);
    cursor: pointer;
  }
  </style>
  