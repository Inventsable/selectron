Vue.component('mock', {
  template: `
    <div class="imgWrap">
      <div class="mock"></div>
    </div>
  `,
})

// scanModifiers: function(state) {
//   var self = this;
//   if (state)
//     this.timer.selection = setInterval(self.modifierCheck, 500);
// },
// stopModifiersScan: function() {
//   clearInterval(this.timer.selection);
// },
// toggleScanMods: function(e) {
//   this.scanningMods = !this.scanningMods;
//   if (this.scanningMods)
//     this.scanModifiers(this.scanningMods);
//   else
//     this.stopModifiersScan();
// },

// onKeyDownOutside: function(e, el) {
//     console.log('keydown:', e);
//     this.$root.parseModifiers(e);
// },
// onKeyUpOutside: function(e, el) {
//     console.log('keyup:', e);
//     this.$root.parseModifiers(e);
// },
// updateKeys: function(evt) {
//   console.log('Updating keys');
//   console.log(evt);
// },
// modifierCheck: function(e) {
//   if (this.count < 2) {
//     this.count = this.count + 1;
//     // this.$el.dispatchEvent(new Event('change'));
//   }
//   // console.log(this.$root);
//   // console.log('Checking');
// },
