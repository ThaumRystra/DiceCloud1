<template lang="html">
  <v-card>
    <template v-if="!result">
      <v-btn-toggle v-model="advantage">
        <v-btn flat>
          Advantage
        </v-btn>
        <v-btn flat>
          Disadvantage
        </v-btn>
      </v-btn-toggle>
      <v-card-text>
        <div class="layout row justify-center align-center">
          <v-btn
            large
            fab
            outline
            @click="makeRoll"
          >
            <div class="display-1">
              {{ numberToSignedString(bonus) }}
            </div>
          </v-btn>
        </div>
      </v-card-text>
    </template>
    <template v-else>
      <div>
        <div class="title">
          <span
            v-for="(roll, index) of rolls"
            :key="index"
            class="roll"
            :class="{strikethrough: index !== chosenRollIndex}"
          >
            {{ roll }}
          </span>
          <span class="ml-1">
            {{ numberToSignedString(bonus) }}
          </span>
        </div>
        <div class="display-1">
          {{ result }}
        </div>
      </div>
    </template>
  </v-card>
</template>

<script>
import numberToSignedString from '/imports/ui/utility/numberToSignedString.js';
export default {
  props: {
    attributeVarName: {
      type: String,
      default: '',
    },
    attributeName: {
      type: String,
      default: '',
    },
    creatureId: {
      type: String,
      default: '',
    },
    bonus: {
      type: Number,
      required: true,
    },
  },
  data(){return {
    advantage: undefined,
    result: undefined,
    rolls: undefined,
    chosenRoll: undefined,
    chosenRollIndex: undefined,
  }},
  methods: {
    makeRoll(){
      //let {rolls, bonus, chosenRoll, result} = doCheckWork.call();
      this.rolls = [12, 8];
      if (this.advantage === 1){
        this.chosenRoll = 8;
      } else {
        this.chosenRoll = 12;
      }
      this.result = this.chosenRoll + this.bonus;
      this.chosenRollIndex = this.rolls.indexOf(this.chosenRoll);
    },
    numberToSignedString,
  }
}
</script>

<style lang="css" scoped>
  .strikethrough {
    text-decoration: line-through;
  }
</style>
