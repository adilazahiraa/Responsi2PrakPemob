<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? 'Edit' : 'Add' }} Recipe</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input v-model="recipe.name" label="Recipe Name" label-placement="floating" placeholder="Enter Recipe Name"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea v-model="recipe.steps" label="Steps" label-placement="floating" placeholder="Enter Cooking Steps" :autogrow="true" :rows="3"></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button type="button" @click="submitForm" shape="round" color="primary" expand="block">
            {{ editingId ? 'Edit' : 'Add' }} Recipe
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonItem,
  IonContent,
  IonTextarea,
} from '@ionic/vue';
import { close } from 'ionicons/icons';
import { Recipe, firestoreService } from '@/utils/firestore';
import { watch, ref } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'update:editingId': [value: string | null];
  'submit': [item: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>];
}>();

const cancel = () => {
  emit('update:isOpen', false);
  emit('update:editingId', null);
  resetRecipe();
};

const submitForm = () => {
  emit('submit', props.recipe);  // Mengirimkan data tanpa id, createdAt, dan updatedAt
  cancel();
};

const resetRecipe = () => {
  props.recipe.name = '';
  props.recipe.steps = '';
};

// Watch editingId untuk perubahan
watch(
  () => props.editingId,
  async (newEditingId) => {
    if (newEditingId) {
      try {
        const recipe = await firestoreService.getRecipeById(newEditingId);
        if (recipe) {
          props.recipe.name = recipe.name;
          props.recipe.steps = recipe.steps;
        }
      } catch (error) {
        console.error('Failed to fetch recipe data:', error);
      }
    } else {
      resetRecipe();
    }
  },
  { immediate: true }
);
</script>
