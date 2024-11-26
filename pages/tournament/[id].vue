<template>
    <div class="pa-5">
    <v-row class="bg-blue-grey-lighten-1" no-gutters>
        <v-col class="pa-0">
            <v-tabs v-model="activeTab">
                <v-tab>
                    <v-icon icon="mdi-clock" />
                </v-tab>
                <v-tab>
                    <v-icon icon="mdi-cogs" />
                </v-tab>
                <v-tab>
                    <v-icon icon="mdi-account-multiple" />
                </v-tab>
                <v-tab>
                    <v-icon icon="mdi-cash" />
                </v-tab>
            </v-tabs>
        </v-col>
    </v-row>
    <tournament-overview-tab v-if="activeTab == 0" />
    <tournament-blinds-tab v-if="activeTab == 1" />
    <tournament-players-tab v-if="activeTab == 2" />
    </div>
</template>
<script lang="ts" setup>
const router = ref(useRouter())
const tournamentsStore = useTournamentsStore()

const activeTab = ref(0)

const tournament = computed(() => {
    return tournamentsStore.tournaments.find(t => t.id == router.value.currentRoute.params.id)
})
</script>