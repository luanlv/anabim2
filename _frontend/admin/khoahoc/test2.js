var IndexController = {};
var Header = require('./_header.msx');
var Menu = require('./_menu.msx');
var Index = require('./_indexbuilder.msx');
var Right = require('./_right.msx');
var fn = require('./fn.msx');

var postData = {"ok": "data"}

var Sortable = {};

Sortable.ListItems = function() {
  this.dragging = m.prop(undefined);
  this.colors = m.prop([
  ]);
};

Sortable.ListItems2 = function() {
  this.dragging = m.prop(undefined);
  this.name = m.prop("");
  this.product = m.prop([
  ]);
};


IndexController.controller = function(){
  var ctrl = this;
  ctrl.products = m.prop([]);
  this.items = new Sortable.ListItems();
  this.listProduct = new Sortable.ListItems2();
  
  // ==============================
  this.sort = function(colors, dragging) {
    this.items.colors(colors);
    this.items.dragging(dragging);
  };
  this.dragStart = function(e) {
    this.dragged = Number(e.currentTarget.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', null);
  };
  this.dragOver = function(e) {
    e.preventDefault();
    var over = e.currentTarget,
        dragging = this.items.dragging(),
        from = isFinite(dragging) ? dragging : this.dragged,
        to = Number(over.dataset.id);
    if((e.clientY - over.offsetTop) > (over.offsetHeight / 2)) to++;
    if(from < to) to--;
    
    var colors = this.items.colors();
    colors.splice(to, 0, colors.splice(from, 1)[0]);
    this.sort(colors, to);
  };
  this.dragEnd = function() {
    this.sort(this.items.colors(), undefined);
  };
  // ==============================
  
  
  // ==============================
  this.sort2 = function(colors, dragging) {
    this.listProduct.product(colors);
    this.listProduct.dragging(dragging);
  };
  this.dragStart2 = function(e) {
    this.dragged = Number(e.currentTarget.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', null);
  };
  this.dragOver2 = function(e) {
    e.preventDefault();
    var over = e.currentTarget,
        dragging = this.listProduct.dragging(),
        from = isFinite(dragging) ? dragging : this.dragged,
        to = Number(over.dataset.id);
    if((e.clientY - over.offsetTop) > (over.offsetHeight / 2)) to++;
    if(from < to) to--;
    
    var colors = this.listProduct.product();
    colors.splice(to, 0, colors.splice(from, 1)[0]);
    this.sort2(colors, to);
  };
  this.dragEnd2 = function() {
    this.sort2(this.listProduct.product(), undefined);
  };
  // ==============================
  
  ctrl.request = fn.requestWithFeedback({method: "GET", url: "/indexbuild"}, ctrl.items.colors, ctrl.setup);
  ctrl.setup = function(){
    m.redraw();
  }
  
  ctrl.setupProduct = function(){
    m.redraw();
  };
  ctrl.page = 1;
  ctrl.setupPrev = function(){
    if(ctrl.productsTmp().length > 0){
      ctrl.products(ctrl.productsTmp());
      ctrl.page -=1;
    }
    m.redraw();
  };
  ctrl.setupNext = function(){
    if(ctrl.productsTmp().length > 0){
      ctrl.products(ctrl.productsTmp());
      ctrl.page +=1;
    }
    m.redraw();
  };
  window.runApp();
  window.runNav();
};



IndexController.view = function(ctrl){
  return  [
    Header(ctrl),
    <div id="base">
      
      {Index(ctrl)}
      
      {Menu(ctrl)}
      
      {Right(ctrl)}
    
    </div>
  ]
};


module.exports = IndexController;