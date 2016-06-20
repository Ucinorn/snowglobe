// Generators

// Generators consume and produce different resources. Some are natural, but most are man-mad and a result of industry
// Generators are a collection of consumers and producers, which target a single resource

var producerModel = Backbone.Model.extend({

  idAttribute: "name",

  defaults: {
    // Parent and target strings are needed to help us identify them later. 
    // We will need to find them to edit rates, counts and mutlipliers as the game goes on
    name: "",
    target: "",
    targetmodel: {},
    // the amount of total producers of this type. Total output will be multiplied by this.
    count: 1,
    // base increment value. If this is set to a negative number, the producer is consuming resources instead of producing them. 
    incrementvalue: 1,
    rate: 1,
    multiplier: 1,
    multis: {
      base: [1]
    },
  },

  initialize: function(parent, target) {
    // set up a listener to watch for changes to the multiplier. The rate will be updated automatically
    this.listenTo(this.multis, 'change', this.refresh);
    this.listenTo(this.incrementvalue, 'change', this.refresh);
  },

  loop: function() {
    // this is an empty placeholder function. Anything manually put in here 
  },

  getres: function(target) {
    if (target !== undefined) {
      return resources[target];
    } else {
      return resources[this.get('target')];
    }
  },

  // reset the multiplier, increment rate and other values. This is called by event listeners on multiplers and other values.
  refresh: function() {
    var m = 0;
    var multis = this.get('multis');
    for (var multi in multis) {
      m += multis[multi].reduce(function(a, b) {
        return a + b;
      });
    }
    this.set('multipler', m);
    this.set('rate', +(this.get('incrementvalue') * this.get('multiplier')));
  },

  // increase/decrease the value of the resource by the rate or a static value. The rate can be negative
  tick: function(amount) {
    var value = this.getres.get('value')
    if (typeof amount === 'number') {
      value += +((amount * this.get('rate')) * this.get('count'));
    } else {
      value += +(this.get('rate') * this.get('count'));
    }
    this.getres.set('value', value);
  },

  // Add a multiplier to the list of total multipliers. 
  // As the game matures, we will likely end up with lots of these that interact with one another. 
  // At the moment, these are ALL cumulative, with scope to add other functions that improve the array later.

  addmulti: function(amount, name) {
    var multis = this.get('multis');
    if (amount !== undefined) {
      if (name === undefined) {
        multis.base.push(amount);
      } else {
        if (multis[name]) {
          multis[name].push(amount);
        } else {
          multis[name] = [amount];
        }
      }
      // set the multis to whatever it has been changed to, or the original if nothing has changed
      this.set('multis', multis);
    } else {
      console.log('attempted to add a multiplier without an amount!')
    }
  },

  // set a multiplier that is named. This will overwrite a single value.
  setmulti: function(amount, name) {
    var multis = this.get('multis');
    if (amount !== undefined || name !== undefined) {
      if (multis[name]) {
        multis[name] = amount;
      } else {
        console.log('Attempted to set a multiplier on an unknown');
      }
      this.set('multis', multis);
    } else {
      console.log('attempted to set a multiplier without an amount or name!')
    }
  },


});

// Each Generator collection can contain multiple producers, each of which have different effects and rates. 
// Each producer effects a single resource and can be multiplied and modified independently
// Producers can have a negative effect! This allows systems that consume resources as well as create them. 
var geneneratorCollection = Backbone.Collection.extend({
  model: producerModel,
});

/*
 *** Create Generators here ***
 */

// The carbon cycle is largely dependent on biomass converting carbon to oxygen.
// Everything starts even then fluctuates naturally as the game goes on.
// Biomass sequesters carbon depending on how much if it exists.
// Biomass grows over time and captures higher and higher carbon amounts
// 
var carbonCycle = new geneneratorCollection();
carbonCycle.add([{
  name: 'Grow Biomass',
  target: 'biomass',
  incrementvalue: 1,
  // Biomass naturally grows over time into any wilderness that can take it.
  // Emptied land will regenerate quickly
  loop: function() {
    // calculation: total biomass over a biomass cap plus a pollution mofidier.
    var biomassdiff = round((this.getres.get('value') / (this.getres.get('base') * this.getres('wilderness').value)), 2);
    this.setmulti('base', biomassdiff);
  }
}, {
  name: 'Produce Oxygen',
  target: 'carbon dioxide',
  incrementvalue: -0.01,
  // this adjusts the multiplier for carbon dioxide reduction based on didderence between the amount of biomass its original base amount
  // as the difference between the two approaches zero, biomass has acheived maximum output (ie. 100% or above modifier)
  loop: function() {
    var biomassdiff = round((this.getres.get('value') / this.getres.get('base')), 2)
    this.setmulti('base', biomassdiff)
  }
}, {
  name: 'Biomass Decay',
  target: 'carbon dioxide',
  incrementvalue: 0.009,
  // this adjusts the multiplier for carbon dioxide reduction based on didderence between the amount of biomass its original base amount
  // as the difference between the two approaches zero, biomass has acheived maximum output (ie. 100% or above modifier)
  loop: function() {
    var biomassdiff = round((this.getres.get('value') / this.getres.get('base')), 2)
    this.setmulti('base', biomassdiff)
  }
}, ]);

// The effects of pollution on resources. Pollution contributes to the greenhouse effect
var pollutionEffects = new geneneratorCollection();
pollutionEffects.add([{
  }
}