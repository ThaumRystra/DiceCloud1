<template lang="html">
  <div class="class-form">
    <div class="layout column align-center">
      <text-field
        label="Level"
        type="number"
        class="base-value-field text-xs-center large-format no-flex"
        :value="model.level"
        :error-messages="errors.level"
        @change="change('level', ...arguments)"
      />
    </div>
    <div class="layout row wrap">
      <text-field
        ref="focusFirst"
        label="Name"
        :value="model.name"
        :error-messages="errors.name"
        @change="change('name', ...arguments)"
      />
      <text-field
        label="Class variable name"
        :value="model.variableName"
        style="flex-basis: 300px;"
        hint="This should be the same for each level in a class"
        :error-messages="errors.variableName"
        @change="change('variableName', ...arguments)"
      />
    </div>

    <text-area
      label="Description"
      hint="A brief description of what this class level gives a character"
      :value="model.description"
      :error-messages="errors.description"
      @change="change('description', ...arguments)"
    />
    <calculation-error-list :calculations="model.descriptionCalculations" />
    
    <text-field
      label="Condition"
      hint="A caclulation to determine if this can be added to the character"
      placeholder="Always active"
      :value="model.slotFillerCondition"
      :error-messages="errors.slotFillerCondition"
      @change="change('slotFillerCondition', ...arguments)"
    />
    <smart-combobox
      label="Tags"
      multiple
      chips
      deletable-chips
      :value="model.tags"
      :error-messages="errors.tags"
      @change="change('tags', ...arguments)"
    />
  </div>
</template>

<script>
  import propertyFormMixin from '/imports/ui/properties/forms/shared/propertyFormMixin.js';
  import CalculationErrorList from '/imports/ui/properties/forms/shared/CalculationErrorList.vue';

	export default {
    components: {
      CalculationErrorList,
    },
    mixins: [propertyFormMixin],
	};
</script>

<style lang="css" scoped>
</style>
