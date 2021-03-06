// Set Up Model Structure

// Resource model that increases and decreases over over time, 
var resmodel = Backbone.Model.extend({

  idAttribute: "name",
  
  defaults: {
    // display attributes: these determine when and where they are visible in the view. 
    name: "",
    visible: true,
    unlocked: true,
    description: true,
    // increment values
    base: 0,
    value: 0,
    // other attributes
  },

  initialize: function() {
    this.set('value', +(this.get('value') + this.get('base')));
  },

});

// Collection for our resources so they can be fetched and iterated
var rescollection = Backbone.Collection.extend({
  model: resmodel,
});


/*
 *** Create Actual objects here ***
 */
var resources = new rescollection();
resources.add([
  // world resources
  // biomass converts carbon dioxide to more biomass
  {
    name: "biomass",
    base: 100000,
    description: "The collective forests, grasslands and plant matter that fill your world. Biomass is always growing to fill empty space, consuming carbon dioxide from the air and sotring it as wood and soil.",
  },
  {
    name: "carbon dioxide",
    base: 280,
    incrementvalue: 0.01,
    description: "Carbon dioxide is an airborne greenhouse gas measured in ppm (parts per million). it is generated from man-made industry and the natural decay of sequestered carbon in biomass.",
  },
  {
    name: "temp",
    base: 14,
    incrementvalue: 0.0001,
    description: "The global average temperature is 14 degrees. Temperature rises and falls with the level of carbon and pullution in the air, which trap heat from the sun and prevent it escaping. The  rate of temperature change is very slow, but will gradiaually come up to meet the cap set by CO2 levels.",
  },
  // fossil fuels are generated by anchient biomass and sit dormant beneath the earth until extracted. Limited resource (unless you wait illions of years)
  {
    name: "fossil fuels",
    base: 100000
  },
  // Water: effects the total land available via sea levels.
  {
    name: "water",
    base: 50000
  },
  // ice is static until the temp comes up. 
  {
    name: "ice",
    base: 1000
  },
  // Land is divided up into types which can be used for different things. 
  {
    name: "land",
    base: 100000
  },
  // Humans develop and farm on arable land. All of the below are represented as percentages and fluctuate.
  {
    name: "arable",
    base: 0.10
  }, {
    name: "developed",
    base: 0
  },
  // Has the highest concentration of biomass 
  {
    name: "wilderness",
    base: 0.85
  },
  // Inhospitable is land rendered unusable due to pollution, overfarming or simple geography (mountains)
  // Is can be generated by humans and decays over time. 
  // Geographically locked land can be developed or made arable at great cost. 
  {
    name: "inhospitable",
    base: 0.05
  },

  // Human resources
  // the currency of human inspiration - the way you unlock upgrades
  {
    name: "inspiration"
  },
  // extracted and stored wood from biomass
  {
    name: "wood"
  },
  // extracted and stored fossil fuels.
  {
    name: "fossil fuels"
  },
  // pollution is generated by human processes such as farming and manufacturing
  {
    name: "pollution"
  },
]);

// A view for the inventory collection. It should render a line for each inventory item in order.
var inventoryview = Backbone.View.extend({
  template: _.template($('#inventory_template').html()),
  render: function() {
    console.log(this.collection);
    this.$el.html(this.template({
      collection: this.collection.toJSON()
    }));
  }
});

// create inventory views
var inventory = new inventoryview({
  collection: resources,
  el: '#inventory'
});
inventory.render();