<template>
  <div class="character-sheet fill-height">
    <v-fade-transition mode="out-in">
      <div
        v-if="!$subReady.singleCharacter"
        key="character-loading"
        class="fill-height layout justify-center align-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
      </div>
      <div
        v-else-if="!creature"
      >
        <v-layout
          column
          align-center
          justify-center
        >
          <h2 style="margin: 48px 28px 16px">
            Character not found
          </h2>
          <h3>
            Either this character does not exist, or you don't have permission
            to view it.
          </h3>
        </v-layout>
      </div>
      <div
        v-else
        key="character-tabs"
        class="fill-height"
      >
        <v-tabs-items
          :value="$store.getters.tabById($route.params.id)"
          @change="e => $store.commit(
            'setTabForCharacterSheet',
            {id: $route.params.id, tab: e}
          )"
        >
          <v-tab-item>
            <stats-tab :creature-id="creatureId" />
          </v-tab-item>
          <v-tab-item>
            <features-tab :creature-id="creatureId" />
          </v-tab-item>
          <v-tab-item>
            <inventory-tab :creature-id="creatureId" />
          </v-tab-item>
          <v-tab-item>
            <spells-tab :creature-id="creatureId" />
          </v-tab-item>
          <v-tab-item>
            <character-tab :creature-id="creatureId" />
          </v-tab-item>
          <v-tab-item>
            <tree-tab :creature-id="creatureId" />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
  //TODO add a "no character found" screen if shown on a false address
  // or on a character the user does not have permission to view
	import Creatures from '/imports/api/creature/Creatures.js';
	import StatsTab from '/imports/ui/creature/character/characterSheetTabs/StatsTab.vue';
	import FeaturesTab from '/imports/ui/creature/character/characterSheetTabs/FeaturesTab.vue';
	import InventoryTab from '/imports/ui/creature/character/characterSheetTabs/InventoryTab.vue';
	import SpellsTab from '/imports/ui/creature/character/characterSheetTabs/SpellsTab.vue';
	import CharacterTab from '/imports/ui/creature/character/characterSheetTabs/CharacterTab.vue';
  import TreeTab from '/imports/ui/creature/character/characterSheetTabs/TreeTab.vue';
  import { assertEditPermission } from '/imports/api/creature/creaturePermissions.js';
  import CreatureLogs from '/imports/api/creature/log/CreatureLogs.js';

	export default {
		components: {
			StatsTab,
			FeaturesTab,
			InventoryTab,
			SpellsTab,
			CharacterTab,
			TreeTab,
		},
		props: {
			creatureId: {
        type: String,
        required: true,
      },
		},
    reactiveProvide: {
      name: 'context',
      include: ['creatureId', 'editPermission'],
    },
    computed: {
      activeTab: {
        get(){
          return this.tabs;
        },
        set(newTab){
          this.$emit('update:tabs', newTab);
        },
      },
    },
    watch: {
      'creature.name'(value){
        this.$store.commit('setPageTitle', value || 'Character Sheet');
      },
    },
    mounted(){
      this.$store.commit('setPageTitle', this.creature && this.creature.name || 'Character Sheet');
      let that = this;
      this.logObserver = CreatureLogs.find({
        creatureId: this.creatureId,
      }).observe({
        added(doc){
          if (!that.$subReady.singleCharacter) return;
          if (that.$store.state.rightDrawer) return;
          that.$store.dispatch('snackbar', {
            text: doc.name,
            showCloseButton: true,
          });
        },
      });
    },
    beforeDestroy(){
      this.logObserver.stop();
    },
		meteor: {
			$subscribe: {
        'singleCharacter'(){
					return [this.creatureId];
				},
			},
			creature(){
				return Creatures.findOne(this.creatureId, {
          fields: {variables: 0}
        });
			},
      editPermission(){
        try {
          assertEditPermission(this.creature, Meteor.userId());
          return true;
        } catch (e) {
          return false;
        }
      },
		},
	}
</script>

<style>
  .character-sheet .v-window-item {
    min-height: calc(100vh - 96px);
    overflow: hidden;
  }
</style>
