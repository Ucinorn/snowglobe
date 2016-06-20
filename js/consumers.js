// Set Up Model Structure

// Resource model that increases and decreases over over time, 
var resource = Backbone.Model.extend({

  defaults: {
    // display attributes: these determine when and where they are visible in the view. 
    visible: true,
    unlocked: true,
    // increment values
    value: 0,
    base: 1,
    multiplier: 1,
    multis: {base:[1]},
    rate: 1,
  },
  
  initialize: function () {
        // set up a listener to watch for changes to the multiplier. The rate will be updated.
        this.listenTo(this.multiplier, 'change', this.refresh);
   },
                      
  // reset the multiplier, increment rate and other values. This is called by event listeners on multiplers and other values.
  refresh: function() {
    var m = 0;
    for (var multi in this.multis) {
        m += this.multis[multi].reduce(function(a, b) {
        return a + b;
      });
    }
    this.multiplier = m;
    this.rate = +(this.base * this.multiplier);
  },
  
  // increase the value of the resource by the ate, set 
  inc: function(amount) {
    if (typeof amount === 'number') {
      this.value += +(amount * this.rate);
    } else {
      this.value += this.rate;
    }
  },
  
  addmulti: function(amount, name) {
    if (amount !== undefined) {
      if (name === undefined) {
        this.multis.base.push(amount);
      } else {
        if (this.multis[name]) {
          this.multis[name].push(amount);
        } else {
          this.multis[name] = [amount];
        }
      }
    } else {
      console.log('attempted to apply a multiplier without an amount!')
    }
  },
});

// Collection for our resources so they can be fetched and iterated
var rescollection = Backbone.Collection.extend({
  model: resource,
});

// A view for the inventory collection. It should render a line for each inventory item in order.
var inventoryview = Backbone.View.extend({
  el: '#inventory',
  template: _.template($('#inventory_template').html()),
  render: function() {
    console.log(this.$el);
    this.$el.html(this.template({
        collection: this.collection.toJSON()
    }));
  }
});

var resources = new rescollection();
resources.add([
  // carbon based
  {name: "carbon"},
  {name: "carbon dioxide"},
  {name: "wood"},
  {name: "food"},  
  {name: "fossil fuels"},
  // land
  {name: "arable"},
  {name: "developed"},
  {name: "wilderness"},
  {name: "inhospitable"},
  // natural
  {name: "salt water"},
  {name: "fresh water"},

]);
console.log(resources);
// create inventory view. it should render itself via initialize
var inventory = new inventoryview({collection: resources});
inventory.render();