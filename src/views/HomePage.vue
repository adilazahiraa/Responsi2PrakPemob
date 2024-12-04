  <template>
    <ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-title>Recipes</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openAddModal">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <InputModal 
      v-model:isOpen="isOpen" 
      v-model:editingId="editingId" 
      :recipe="recipe" 
      @submit="handleSubmit" 
    />

    <ion-list>
      <ion-item-sliding v-for="recipe in recipes" :key="recipe.id">
        <ion-item>
          <ion-label>
            <h2>{{ recipe.name }}</h2>
            <!-- Memisahkan langkah-langkah ke dalam paragraf yang berbeda -->
            <p v-for="(step, index) in recipe.steps.split('\n')" :key="index">{{ step }}</p>
          </ion-label>
        </ion-item>

        <ion-item-options side="start">
          <ion-item-option color="danger" @click="handleDelete(recipe)">
            <ion-icon :icon="trash"></ion-icon>
          </ion-item-option>
        </ion-item-options>

        <ion-item-options side="end">
          <ion-item-option @click="handleEdit(recipe)">
            <ion-icon :icon="create"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </ion-content>
</ion-page>
  </template>

  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonItemSliding, IonItemOption, IonItemOptions, IonLabel } from '@ionic/vue';
  import { add, create, trash } from 'ionicons/icons';
  import InputModal from '@/components/InputModal.vue';
  import { onMounted, ref } from 'vue';
  import { firestoreService, type Recipe } from '@/utils/firestore';
  import { Timestamp } from 'firebase/firestore';


  const isOpen = ref(false);
  const editingId = ref<string | null>(null);
  const recipe = ref<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>({ name: '', steps: '' });
  const recipes = ref<Recipe[]>([]);

  const loadRecipes = async () => {
    recipes.value = await firestoreService.getRecipes();
  };

  onMounted(() => {
    loadRecipes();
  });

  const handleRefresh = async (event: any) => {
    await loadRecipes();
    event.target.complete();
  };

  const handleSubmit = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Menambahkan createdAt dan updatedAt
    const recipeWithTimestamps = {
      ...recipeData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (editingId.value && typeof editingId.value === 'string') {
      await firestoreService.updateRecipe(editingId.value, recipeWithTimestamps);
    } else {
      await firestoreService.addRecipe(recipeWithTimestamps); // pastikan data yang dikirimkan sudah sesuai
    }

    loadRecipes();
    isOpen.value = false;
  };



  const handleEdit = (recipe: Recipe) => {
    editingId.value = recipe.id || null; // Pastikan null jika id tidak ada
    recipe.name = recipe.name;
    recipe.steps = recipe.steps;
    isOpen.value = true;
  };


  const handleDelete = async (recipe: Recipe) => {
    if (recipe.id) {
      await firestoreService.deleteRecipe(recipe.id);
      loadRecipes();
    }
  };

  const openAddModal = () => {
    isOpen.value = true;
    editingId.value = null;
    recipe.value.name = '';
    recipe.value.steps = '';
  };
  </script>
