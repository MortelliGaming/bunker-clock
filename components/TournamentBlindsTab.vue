<template>
  <v-row class="fill-height">
    <v-col cols="12" sm="6">
      <v-spacer style="height: 95px;" />
      <blind-settings />
    </v-col>
    <v-col cols="12" sm="6">
      <v-row>
        <v-col class="text-right">
          <v-btn class="ma-1" @click="addLevel">Ebene hinzufügen</v-btn>
          <v-btn class="ma-1" @click="addBreak">Pause hinzufügen</v-btn>
          <v-btn class="ma-1" @click="">Vorlage Speichern</v-btn>
          <v-btn class="ma-1" @click="">Vorlage Laden</v-btn>
        </v-col>
      </v-row>
      <v-spacer class="pt-2" />
      <v-table>
        <thead>
          <tr>
            <th>Zeit</th>
            <th>SB</th>
            <th>BB</th>
            <th width="50px"></th>
          </tr>
        </thead>
        <tbody class="levels-table">
          <tr
            v-for="(level, i) in levels"
            :key="level.id"
            class="level-item"
            draggable="true"
            @dragstart="onDragStart($event, i)"
            @dragover="onDragOver($event)"
            @drop="onDrop($event, i)"
          >
            <td>
              <v-text-field
                @input="saveLevels"
                v-model.number="level.time" density="compact"/>
            </td>
            <td v-if="!level.isBreak" class="d-flex align-center">
              <v-text-field
                @input="saveLevels"
                v-model="level.smallBlind" density="compact"/>
            </td>
            <td v-if="!level.isBreak">
              <v-text-field
                @input="saveLevels"
                v-model="level.bigBlind" density="compact"/>
            </td>
            <td colspan="2" class="text-center" v-if="level.isBreak">Pause</td>
            <td class="text-right">
              <v-btn @click.stop="() => removeLevel(i)" icon="mdi-trash-can-outline" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const router = ref(useRouter());

const { updateTournament } = useTournamentsStore();
const { tournaments } = storeToRefs(useTournamentsStore());

const tournament = computed(() => {
  return tournaments.value.find(
    (t) => t.id == router.value.currentRoute.params.id
  );
});
const levels: Ref<(TournamentLevel & { id: number })[]> = ref([]);
let draggedIndex: number | null = null;

loadLevels();

function loadLevels() {
  if (tournament.value) {
    if (!tournament.value.settings.levels) {
      tournament.value.settings.levels = [];
    }
    levels.value = tournament.value.settings.levels.map((l) => ({
      id: Date.now(),
      ...l,
    }));
  }
}

function saveLevels() {
  if (tournament.value) {
    tournament.value.settings.levels = levels.value;
    updateTournament(tournament.value.id, {
      settings: tournament.value.settings,
    });
    loadLevels();
  }
}

function removeLevel(index: number) {
  if (tournament.value) {
    tournament.value.settings.levels.splice(index, 1);
    updateTournament(tournament.value.id, {
      settings: tournament.value.settings,
    });
    loadLevels();
  }
}

function addLevel() {
  if (tournament.value) {
    tournament.value.settings.levels.push({
      time: 30,
      smallBlind: 5,
      bigBlind: 10,
      isBreak: false,
    });
    updateTournament(tournament.value.id, {
      settings: tournament.value.settings,
    });
    loadLevels();
  }
}

function addBreak() {
  if (tournament.value) {
    tournament.value.settings.levels.push({
      time: 15,
      smallBlind: 0,
      bigBlind: 0,
      isBreak: true,
    });
    updateTournament(tournament.value.id, {
      settings: tournament.value.settings,
    });
    loadLevels();
  }
}

function onDragStart(event: DragEvent, index: number) {
  draggedIndex = index;
  event.dataTransfer?.setData("text/plain", `${index}`);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
}

function onDrop(event: DragEvent, index: number) {
  event.preventDefault();
  if (draggedIndex !== null) {
    const draggedItem = levels.value[draggedIndex];
    levels.value.splice(draggedIndex, 1);
    levels.value.splice(index, 0, draggedItem);
    draggedIndex = null;
    if (tournament.value) {
      saveLevels();
    }
  }
}
</script>

<style scoped lang="scss">
.level-item {
  cursor: grab;
}

.level-item:active {
  cursor: grabbing;
}

.levels-table .v-input__details {
  display: none;
}
</style>
