<template lang="html">
  <div class="skill-viewer">
    <v-layout
      column
      align-center
    >
      <div
        v-if="model.value !== undefined"
        class="display-1 layout row align-center"
      >
        <v-icon class="mr-4">
          {{ icon }}
        </v-icon>
        <div v-if="isFinite(model.value)">
          {{ numberToSignedString(model.value) }}
        </div>
      </div>
    </v-layout>
    <property-name :value="model.name" />
    <property-variable-name :value="model.variableName" />
    <property-field
      name="Ability"
      :value="model.ability"
    />
    <property-field
      name="Type"
      :value="model.skillType"
    />
    <property-field
      name="Base value"
      :value="model.baseValue"
    />
    <property-field
      name="Base proficiency"
      :value="model.baseProficiency"
    />
    <property-description
      :string="model.description"
      :calculations="model.descriptionCalculations"
      :inactive="model.inactive"
    />

    <effect-viewer
      v-if="context.creatureId && model.baseValue"
      :model="{
        name: 'Base value',
        result: model.baseValue,
        operation: 'base'
      }"
    />
    <effect-viewer
      v-for="effect in effects"
      :key="effect._id"
      :model="effect"
    />
  </div>
</template>

<script>
import propertyViewerMixin from '/imports/ui/properties/viewers/shared/propertyViewerMixin.js';
import numberToSignedString from '/imports/ui/utility/numberToSignedString.js';
import CreatureProperties from '/imports/api/creature/creatureProperties/CreatureProperties.js';
import EffectViewer from '/imports/ui/properties/viewers/EffectViewer.vue';

export default {
  components: {
    EffectViewer,
  },
	mixins: [propertyViewerMixin],
  inject: {
    context: { default: {} }
  },
  computed: {
    displayedModifier(){
			let mod = this.model.value;
			if (this.model.fail){
				return 'fail';
			} else {
				return numberToSignedString(mod);
			}
		},
    icon(){
			if (this.model.proficiency == 0.5){
				return 'brightness_2';
			} else if (this.model.proficiency == 1) {
				return 'brightness_1'
			} else if (this.model.proficiency == 2){
				return 'album'
			} else {
				return 'radio_button_unchecked';
			}
		},
  },
  methods: {
    numberToSignedString,
    isFinite: Number.isFinite,
  },
  meteor: {
    effects(){
      if (this.context.creatureId){
        let creatureId = this.context.creatureId;
        return CreatureProperties.find({
          'ancestors.id': creatureId,
          stats: this.model.variableName,
          type: 'effect',
          removed: {$ne: true},
        });
      } else {
        return [];
      }
    },
  },
}
</script>

<style lang="css" scoped>
</style>
