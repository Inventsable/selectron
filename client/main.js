var csInterface = new CSInterface();
loadUniversalJSXLibraries();
loadJSX('compile.jsx');
window.Event = new Vue();

// FIX
// Total tags has duplicates
// Create comp sync toggle
// Create dynamic JSON context menu
// Create dynamic JSON flyout menu

// Needs to flush UI if cursor leaves panel -- axo-esque wake/sleep states
// ? Parent sometimes not applied correctly

// Selection scan should return parent of layer if already has parent,
// tags should dynamically assume/assign siblings to same parent

// Needs Codecore [Cursorcore, Findcore, Rigcore, Codecore]
// Needs placeholder components when taglist or screen is empty.
  // taglist - Nothing is selected bodymovin animation
  // screen - should display info about full comp. All families, all tags.

  // Needs to jigsaw entire family tree
// Needs to read all layers and construct master selection.
// Should read all props of all layers and count how many color controls are manual.
  // Should keep track of hasExpression and canExpression, further regex if already autorig

// Needs fleshed out controls
// Needs config and options.
// Needs a toolbar for screen -- families, custom expression, custom script snippet



Vue.component('character', {
  // props: ['num'],
  template: `
    <div class="ballWrap">
      <div id="char1"></div>
      <div id="char2"></div>
    </div>
  `,

})

// @mouseover="activateAnim" @mouseout="deactivateAnim"

Vue.component('anim-noselection', {
  template: `
    <div id="tags-anim" class="anim-noselection flexmid">
      <svg v-if="showMock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 30">
        <rect data-name="bg" class="animFrame" x="0" y="0" width="140" height="30"/>
        <g id="boundingbox">
          <g id="borderbox">
            <rect class="animBBox" x="24.45" y="8.2" width="102.22" height="14.66"/>
            <rect class="animNode" x="22.8" y="6.56" width="3.29" height="3.29"/>
            <rect class="animNode" x="73.91" y="6.56" width="3.29" height="3.29"/>
            <rect class="animNode" x="125.02" y="6.56" width="3.29" height="3.29"/>
            <rect class="animNode" x="22.8" y="21.22" width="3.29" height="3.29"/>
            <rect class="animNode" x="73.91" y="21.22" width="3.29" height="3.29"/>
            <rect class="animNode" x="125.02" y="21.22" width="3.29" height="3.29"/>
            <rect class="animNode" x="22.8" y="13.47" width="3.29" height="3.29"/>
            <rect class="animNode" x="125.02" y="13.47" width="3.29" height="3.29"/>
          </g>
        </g>
        <g id="cursor">
          <path id="cursor-2" data-name="cursor" class="animCursor" d="M8.58,20.91l3.18-3.18a.24.24,0,0,1,.17-.07h4.49a.24.24,0,0,0,.17-.41l-8-8a.24.24,0,0,0-.41.17l0,11.31A.24.24,0,0,0,8.58,20.91Z" transform="translate(0.5 0.5)"/>
        </g>
      </svg>
    </div>
  `,
  data() {
    return {
      msg: 'Hello there',
      bom: {},
      cursorList: ['start', 'orb', 'cursor', 'find'],
      // currentid: this.$root.idnum,
      currLoop: '1',
      isActive: false,
      showMock: false,
    }
  },
  computed: {
    currentid: function() {
      return this.$root.idnum;
    }
  },
  methods: {
    playFirstFrames: function() {
      // this.bom.play();
      this.bom.playSegments([0,2], true);
      console.log('Trying to boot');
    },
    checkAnimation: function(state) {
      // console.log(state);
      if (state) {this.activateAnim();}
      else {this.deactivateAnim();}
    },
    activateAnim: function() {
      this.bom.play();
      console.log('turning on');
    },
    deactivateAnim: function() {
      console.log('turning off');
      this.bom.pause();
      // this.bom.goToAndStop(1,true);
    },
    updateCursor: function() {
      for (var i = 0; i < this.cursorList.length; i++) {
        console.log(`rolled ${this.currentid}`);
        var current = this.cursorList[i];
        if (i !== this.currentid) {
          this.$root.setCSS('anim-' + current + '-opacity', 0)
        } else {
          this.$root.setCSS('anim-' + current + '-opacity', 1)
        }

      }
      // console.log('changed cursor to ' + res);
    },
    buildBodyMovin: function(elt, which) {
      var result = false;
      var bMovin = document.getElementById(elt);
      var animData = {
          wrapper: bMovin,
          animType: 'svg',
          loop: true,
          prerender: true,
          autoplay: false,
          path: '../assets/animations/tags-noselectionSeq.json'
      };
      var bm = bodymovin.loadAnimation(animData);
      return bm;
    }
  },
  mounted() {
    var self = this;
    this.bom = this.buildBodyMovin('tags-anim');
    Event.$on('updateAnimation', this.updateCursor);
    Event.$on('tagAnimation', this.checkAnimation);
    // this.playFirst();
    // this.playFirstFrames();
    this.updateCursor();
    this.bom.pause();
    // this.bom.addEventListener('DOMLoaded', function(){self.bom.goToAndStop(2,true)})
    console.log(this.bom);
    // console.log();
  }
})

// This could also display code DNA
Vue.component('anno', {
  template: `
    <div class="main-Anno">
      <span>{{anno}}</span>
    </div>
  `,
  data() {
    return {
      anno: 'Start',
      prefix: ['select', 'find', 'auto'],
    }
  },
  methods: {
    updateAnno: function(msg) {
      console.log(msg);
      this.anno = msg;
    },
    parseAnno: function(msg) {
      console.log('hello there');
      return msg;
    },
  },
  mounted() {
    var self = this;
    Event.$on('updateAnno', self.updateAnno);
  }
})

Vue.component('family-branch', {
  props: {
    parent: Object,
    anno: String,
    pool: Object,
  },
  template: `
    <div class="family-branch">
      <div class="family-anno">{{anno}}</div>
      <div class="family-branch-wrap">
        <div v-for="piece in section" :class="addClass">{{piece.index}}</div>
      </div>
    </div>
  `,
  data() {
    return {
      section: {},
    }
  },
  // computed: {
  //   section: function() {
  //     return this.parent[]
  //   }
  // },
  methods: {
    getSection: function() {
      var label = this.pool;
      console.log(this.parent[label]);
      this.section = this.parent[label];
    },
    addClass: function() {
      // var style = 'family' + this.section + 'flexmid test'
      var style = 'family-' + this.pool + ' flexmid test'
    }
  },
  mounted() {
    this.getSection();
  }
})

Vue.component('familydesc', {
  template: `
    <div class="screen-family">
      <div class="family-header">
        <div class="family-index flexmid">#</div>
        <div class="family-name flexmid">name</div>
      </div>
      <div class="family-tree">
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div class="family-desc flexmid test">parent</div>
          </div>
        </div>
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div class="family-desc flexmid test">child</div>
          </div>
        </div>
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div  class="family-desc flexmid test">sibling</div>
          </div>
        </div>
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div class="family-desc flexmid test">cousin</div>
          </div>
        </div>
      </div>
      <div class="family-tags flexmid"></div>
    </div>
  `,
})

Vue.component('tag-details', {
  template: `
    <div class="screen-Tags-Details">
    {{details}}
    </div>
  `,
  data() {
    return {
      details: 'something here'
    }
  },
  methods: {
    setDetails: function(msg) {
      this.details = msg;
    },
    getDetails: function() {
      var str = 'hello';
      // console.log('hello?');
      var ulength = this.$root.comp.relations.unique.length;
      var rlength = this.$root.comp.relations.raw.length;
      var layerlength = this.$root.comp.layers.cloned.length;
      console.log(`layers: ${layerlength}
        unique: ${ulength}
        raw: ${rlength} `);
      // var lines = ['Project has', layerlength + ' layers', ulength + ' types of relations', rlength + ' relations']
      // for (var i = 0; i < lines.length; i++) {
      //   str += '\r\n' + lines[i]
      // }
      // this.setDetails(str);
      return str;
    }
  },
  mounted() {
    var self = this;
    Event.$on('allTags', self.setDetails)
    Event.$on('updateCompFamily', self.getDetails)
  }
})

Vue.component('family', {
  props: ['clone'],
  // props: {
  //   model: Object
  // },
  // <family-branch :parent="family" :pool="family.parent" anno="parent"></family-branch>
  template: `
    <div class="screen-family">
      <div class="family-header">
        <div class="family-index flexmid">{{index}}</div>
        <div class="family-name flexmid">{{name}}</div>
      </div>
      <div class="family-tree">
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div v-for="parent in family.parent" class="family-parent flexmid test">{{parent.index}}</div>
          </div>
        </div>
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div v-for="child in family.children" class="family-child flexmid test">{{child.index}}</div>
          </div>
        </div>
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div v-for="sibling in family.siblings" class="family-sibling flexmid test">{{sibling.index}}</div>
          </div>
        </div>
        <div class="family-branch">
          <div class="family-branch-wrap">
            <div v-for="cousin in family.cousins" class="family-cousin flexmid test">{{cousin.index}}</div>
          </div>
        </div>
      </div>
      <div class="family-tags flexmid"></div>
    </div>
  `,
  data() {
    return {
      index: 0,
      name: '',
      family: {
        parent: {},
        children: {},
        siblings: {},
        cousins: {},
      }
    }
  },
  methods: {
    getFamily: function() {
      var key = this.clone;
      console.log(key);
      var target = this.$root.selection.layers.cloned[key];
      console.log(target.name);
      this.family.parent = target.family.parent;
      this.family.children = target.family.children;
      this.family.siblings = target.family.siblings;
      this.family.cousins = target.family.cousins;
      this.index = target.index;
      this.name = target.name;
      this.tags = target.tags;
    },
  },
  mounted() {
    this.getFamily();
  }
})

Vue.component('placeholder', {
  template: `
    <div class="placeholder">
      <taglist-full></taglist-full>
      <tag-details v-if="details"></tag-details>
    </div>
  `,
  data() {
    return {
      msg: 'hello',
      details: true,
    }
  },
})

Vue.component('screen', {
  template: `
  <div class="screenwrap">
    <div class="screen-content">
      <placeholder v-if="!show.families"></placeholder>
      <familydesc v-if="show.families"></familydesc>
      <family v-if="show.families" v-for="layer in layers" :key="layer.index" :clone="layer.id"></family>
    </div>
  </div>
  `,
  data() {
    return {
      msg: 'nothing is selected',
      layers: [],
      show: {
        placeholder: true,
        families: false,
      },
      count: 0,
    }
  },
  methods: {
    clearFamilies: function() {
      // for (var i = 0; i < this.families.length; i++) {
      //   this.families.pop();
      // }
      this.layers = [];
      this.count = 0;
      // this.show.families = false;
    },
    getFamilies: function() {
      this.clearFamilies();
      this.show.families = true;
      var totalLength = this.$root.selection.layers.cloned.length;
      for (var i = 0; i < this.$root.selection.layers.cloned.length; i++) {
        var targ = this.$root.selection.layers.cloned[i];
        this.count = this.count + 1;
        // console.log(this.count);
        this.layers.push(targ);
      }
      this.setFamilyCSS(totalLength);
      // console.log(totalLength);
    },
    setFamilyCSS: function(length) {
      var self = this;
      // console.log(`Setting css to ${length}`);
      this.$root.setCSS('screen-cols', length);
    },
    reset: function() {
      this.show.families = false;
    },
    togglePlaceholder: function() {
      this.placeholder = !this.placeholder;
    },
  },
  mounted() {
    var self = this;
    Event.$on('soloSelection', self.togglePlaceholder)
    Event.$on('updateFamilies', self.getFamilies);
    Event.$on('clearSelection', self.clearFamilies);
    Event.$on('clearSelection', self.reset);
  }
})

// Fix scroll turning off via body
// @mouseover="checkScroll"
// @mouseout="activateScroll">
Vue.component('taglist', {
  template: `
    <div class="head-Tags-Body" @mouseover="activateAnim" @mouseout="deactivateAnim">
      <div class="head-Tags-Content">
      <anim-noselection v-if="!tagList.length"></anim-noselection>
        <div v-for="tag in tagList"
          @mouseover="hover(tag, true, $event)"
          @mouseout="hover(tag, false, $event)"
          class="tagwrap"
          @click="toggleState(tag, tag.isActive)">
          <span :class="tagBtn(tag)">{{tag.name}}</span>
        </div>
      </div>
    </div>
  `,
  // <div class="bTags-footer">
  // <span class="bTags-footer-data">{{tagData}}</span>
  // </div>
  data() {
    return {
      tagList: [
        {
          name: 'buddy',
          key: 0,
          type: 'prop',
          isActive: false,
          isHover: false,
        },
      ],
    }
  },
  methods: {
    activateAnim: function() {
      // console.log('Hello');
      Event.$emit('tagAnimation', true);
    },
    deactivateAnim: function() {
      // console.log('Goodbye');
      Event.$emit('tagAnimation', false);
    },
    checkScroll: function(evt) {
      console.log(`[${evt.clientX}, ${evt.clientY}]`);
      console.log(`[${window.innerWidth}, ${window.innerHeight}]`);
      if ((evt.clientX < 10) && (evt.clientY < 14)) {
        console.log('outside');
        this.deactivateScroll();
      } else if ((evt.clientX > 10) && (evt.clientY < 14)) {
        console.log('outside');
        this.deactivateScroll();
      } else if ((evt.clientX > (window.innerWidth - 14)) && (evt.clientY > (window.innerHeight - 14))) {
        console.log('outside');
        this.deactivateScroll();
      } else if ((evt.clientX > (window.innerWidth - 14)) && (evt.clientY < (window.innerHeight - 14))) {
        console.log('outside');
        this.deactivateScroll();
      } else {
        console.log('inside');
      }
    },
    activateScroll: function() {
      console.log('activating');
      this.$root.canScroll = true;
    },
    deactivateScroll: function() {
      console.log('deactivating');
      this.$root.canScroll = false;
    },
    checkKey: function(evt) {
      console.log('Checking key');
      console.log(evt);
    },
    parseAnnotation: function(tag, state) {
      var pass = 'updateAnno', word, key = this.$root.idnum - 1;
      var vprefix, vsuffix;
      var prefix = {
        hover: ['prep', 'select', 'find'],
        active: ['rig', 'deselect', 'replace'],
        Shift: ['add', 'add', 'find every'],
        Ctrl: ['find', 'replace', 'find relatives of'],
        Alt: ['create new', 'select', 'replace']
      }
      var suffix = {
        hover: ['for rigging', '', 'in selection'],
        active: ['recipe', 'deselect', 'in selection'],
        Shift: ['to controller', 'to selection', 'in comp'],
        Ctrl: ['controls', 'in selection', 'in comp'],
        Alt: ['controller', 'controller', 'in comp']
      }
      if (this.$root.Shift) {
        vprefix = prefix.Shift[key];
        vsuffix = suffix.Shift[key];
      } else if (this.$root.Ctrl) {
        vprefix = prefix.Ctrl[key];
        vsuffix = suffix.Ctrl[key];
      } else if (this.$root.Alt) {
        vprefix = prefix.Alt[key];
        vsuffix = suffix.Alt[key];
      } else {
        vprefix = prefix.hover[key];
        vsuffix = suffix.hover[key];
      }
      if (!tag.isActive) {
        word = vprefix + ' ' + tag.name + ' ' + vsuffix
      } else {
        word = vprefix + ' ' + tag.name + ' ' + vsuffix
      }
      if ((!state) && (this.$root.hasAction))
        word = this.$root.action;
        // word = 'Nothing is selected'
      Event.$emit(pass, word);
    },
    // recheckMods: function(evt) {
    //   Event.$emit('checkMods', evt);
    // },
    toggleState: function(tag, state) {
      tag.isActive = !state;
      console.log(`${!state}`);
      this.setActive(tag, tag.isActive);
    },
    setActive: function(tag, state) {
      if (!this.$root.Shift)
        this.clearActive();
      console.log(`Activating ${tag.name}`);
      tag.isActive = state;
    },
    hover: function(tag, state, evt) {
      // Event.$emit('checkMods', evt);
      tag.isHover = state;
      this.parseAnnotation(tag, state);
      console.log(state);
      if (state)
        this.activateScroll();
      else
        this.deactivateScroll();
    },
    clearActive: function() {
      for (var i = 0; i < this.tagList.length; i++)
        this.tagList[i].isActive = false;
    },
    tagBtn: function(tag) {
      var style = 'tag-' + tag.type + '-';
      if (!tag.isActive) {
        if (tag.isHover)
          style += 'hover'
        else
          style += 'idle'
      } else {
        style += 'active';
      }
      return style
    },
    clearTags: function() {
      this.tagList = [];
    },
    constructTags: function() {
      this.tagList = [], child = {};
      for (var i = 0; i < this.$root.tags.layers.length; i++) {
        child = {
          key: i,
          name: this.$root.tags.layers[i],
          type: 'layer',
          isActive: false,
          isHover: false,
        }
        this.tagList.push(child);
      }
      for (var e = 0; e < this.$root.tags.props.length; e++) {
        child = {
          key: e,
          name: this.$root.tags.props[e],
          type: 'prop',
          isActive: false,
          isHover: false,
        }
        this.tagList.push(child);
      }
      // console.log('Current tags are:');
      // console.log(this.$root.tags.master);
    }
  },
  computed: {
    tagData: function() {
      var desc = this.tagList.length
      if (this.tagList.length > 1)
        desc += ' tags selected'
      else if (this.tagList.length > 0)
        desc += ' tag selected'
      else
        desc = 'No selection'
      return desc;
    },
    activeTags: function() {
      for (var i = 0; i < this.tagList.length; i++) {

      }
    }
  },
  mounted() {
    Event.$on('updateTags', this.constructTags);
    Event.$on('clearTags', this.clearTags);
    // this.$on('recheckMods', this.recheckMods);
  }
})

Vue.component('taglist-full', {
  template: `
    <div class="screen-Tags-Body">
      <div class="screen-Tags-Content">
        <div v-for="tag in tagList"
          @mouseover="hover(tag, true, $event)"
          @mouseout="hover(tag, false, $event)"
          class="tagwrap"
          @click="toggleState(tag, tag.isActive)">
          <span :class="tagBtn(tag)">{{tag.name}}</span>
        </div>
      </div>
      <div class="screen-Tags-Anno">{{tagList.length}} tags detected</div>
    </div>
  `,
  data() {
    return {
      tagList: [
        {
          name: 'buddy',
          key: 0,
          type: 'prop',
          isActive: false,
          isHover: false,
        },
      ],
      desc: '',
    }
  },
  methods: {
    toggleState: function(tag, state) {
      tag.isActive = !state;
      console.log(`${!state}`);
      this.setActive(tag, tag.isActive);
    },
    setActive: function(tag, state) {
      if (!this.$root.Shift)
        this.clearActive();
      console.log(`Activating ${tag.name}`);
      tag.isActive = state;
    },
    hover: function(tag, state, evt) {
      // Event.$emit('checkMods', evt);
      tag.isHover = state;
      // this.parseAnnotation(tag, state);
      // console.log(state);
      // if (state)
      //   this.activateScroll();
      // else
      //   this.deactivateScroll();
    },
    clearActive: function() {
      for (var i = 0; i < this.tagList.length; i++)
        this.tagList[i].isActive = false;
    },
    tagBtn: function(tag) {
      var style = 'tag-' + tag.type + '-';
      if (!tag.isActive) {
        if (tag.isHover)
          style += 'hover'
        else
          style += 'idle'
      } else {
        style += 'active';
      }
      return style
    },
    clearTags: function() {
      this.tagList = [];
    },
    constructTags: function() {
      this.tagList = [], child = {};
      for (var i = 0; i < this.$root.tags.comp.length; i++) {
        child = {
          key: i,
          name: this.$root.tags.comp[i],
          type: 'layer',
          isActive: false,
          isHover: false,
        }
        this.tagList.push(child);
      }
      // for (var e = 0; e < this.$root.tags.props.length; e++) {
      //   child = {
      //     key: e,
      //     name: this.$root.tags.props[e],
      //     type: 'prop',
      //     isActive: false,
      //     isHover: false,
      //   }
      //   this.tagList.push(child);
      // }
      // console.log('Current tags are:');
      // console.log(this.$root.tags.master);
    }
  },
  mounted() {
    Event.$on('allTags', this.constructTags)
  }
})

Vue.component('selectron', {
  template: `
    <div
      v-mousemove-outside="onMouseOutside"
      class="head-Selectron-Wrap">
      <svg id="selectron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.05 26.05">
        <path class="Selectron-odB" d="M203.64,24.89A12.08,12.08,0,0,1,191.54,37v-2.2a9.9,9.9,0,0,0,9.89-9.89A9.74,9.74,0,0,0,200.11,20l1.9-1.12A12,12,0,0,1,203.64,24.89Z" transform="translate(-178.52 -11.87)"/>
        <path class="Selectron-odG" d="M202,18.85,200.11,20A9.85,9.85,0,0,0,183,20l-1.93-1.12a12.09,12.09,0,0,1,20.95,0Z" transform="translate(-178.52 -11.87)"/>
        <path class="Selectron-odR" d="M191.54,34.79V37a12.09,12.09,0,0,1-10.48-18.14L183,20a9.65,9.65,0,0,0-1.34,4.93A9.9,9.9,0,0,0,191.54,34.79Z" transform="translate(-178.52 -11.87)"/>
        <path class="Selectron-idB" d="M186.13,24.88a5.42,5.42,0,0,1,5.4-5.42V14.92a10,10,0,0,0-10,10,9.79,9.79,0,0,0,1.33,5l4-2.28A5.37,5.37,0,0,1,186.13,24.88Z" transform="translate(-178.52 -11.87)"/>
        <path class="Selectron-idG" d="M196.23,27.59a5.38,5.38,0,0,1-9.36,0l-4,2.28a9.93,9.93,0,0,0,17.26,0Z" transform="translate(-178.52 -11.87)"/>
        <path class="Selectron-idR" d="M191.54,14.92v4.54h0a5.39,5.39,0,0,1,4.68,8.13l3.93,2.26a9.94,9.94,0,0,0-8.62-14.93Z" transform="translate(-178.52 -11.87)"/>
        <rect class="Selectron-frame" x="0.25" y="0.25" width="25.55" height="25.55"/>
        <circle v-if="core.orb" @click="toggleSync" :class="coreClass" cx="13.02" cy="13.02" r="2.4"/>
        <path v-if="core.cursor" @click="toggleSync" :class="coreClass" d="M189.89,28.54l2-2a.14.14,0,0,1,.1-.05h2.82a.15.15,0,0,0,.11-.25l-5-5a.15.15,0,0,0-.26.11v7.1A.14.14,0,0,0,189.89,28.54Z" transform="translate(-178.52 -11.87)"/>
        <path v-if="core.find" @click="toggleSync" :class="coreClass" d="M194.19,22.24a2.12,2.12,0,0,0-3.28,2.66L189,26.84a.45.45,0,0,0,.31.76.5.5,0,0,0,.32-.13l1.94-1.95a2,2,0,0,0,1.14.35,2.13,2.13,0,0,0,1.51-3.63Zm-.63,2.38a1.24,1.24,0,0,1-1.75-1.75,1.27,1.27,0,0,1,1.75,0A1.24,1.24,0,0,1,193.56,24.62Z" transform="translate(-178.52 -11.87)"/>
      </svg>
    </div>
  `,
  data() {
    return {
      scanning: false,
      scanningMods: false,
      familyMode: false,
      count: 0,
      syncing: false,
      timer: {
        selection: null,
        modifiers: null,
      },
    }
  },
  computed: {
    coreClass: function() {
      var style = 'Selectron-core-' + this.syncing
      return style
    },
    core: function() {
      var num = this.$root.idnum;
      var shadowcore = {
        roll: ['config', 'orb', 'cursor', 'find'],
        orb: false,
        cursor: false,
        find: false,
      };
      var prop = shadowcore.roll[num];
      shadowcore[prop] = true;
      return shadowcore;
    },
    total: function() {
      return this.$root.selection.layers.length
       // + this.$root.selection.props.length;
    },
    anno: function() {
      return this.$root.anno;
    },
  },
  mounted() {
    this.toggleScan();
    Event.$on('updateComp', this.compCheck);
    Event.$on('updateTags', this.updateTags);
    Event.$on('updateSelectron', this.updateSelectron);
  },
  methods: {
    // was going to limit compRead with this
    toggleSync: function() {
      // console.log(`togging ${this.syncing} to ${!this.syncing}`);
      // this.syncing = !this.syncing;
    },
    onMouseOutside: function(e, el) {
      this.$root.parseModifiers(e);
      // console.log(e);
    },
    updateSelectron: function() {
      var self = this, types = ['R', 'G', 'B']
      var count = this.$root.idnum;
      // console.log(count);
      if (this.$root.idnum == 1)
        this.$root.setCSS('color-idR', self.$root.getCSS('color-material-active'));
      else
        this.$root.setCSS('color-idR', self.$root.getCSS('color-material-idle'));
      if (this.$root.idnum == 2)
        this.$root.setCSS('color-idG', self.$root.getCSS('color-material-active'));
      else
        this.$root.setCSS('color-idG', self.$root.getCSS('color-material-idle'));
      if (this.$root.idnum == 3)
        this.$root.setCSS('color-idB', self.$root.getCSS('color-material-active'));
      else
        this.$root.setCSS('color-idB', self.$root.getCSS('color-material-idle'));

      var lastColor = this.$root.getCSS('color-animChosen');
      var modColor = this.$root.getCSS('color-material-ultra');
      if (this.$root.Ctrl) {
        this.$root.setCSS('color-odR', self.$root.getCSS('color-R'));
        modColor = this.$root.getCSS('color-R');
      } else {
        this.$root.setCSS('color-odR', self.$root.getCSS('color-material-idle'));
      }
      if (this.$root.Shift) {
        modColor = this.$root.getCSS('color-G');
        this.$root.setCSS('color-odG', self.$root.getCSS('color-G'));
      } else {
        this.$root.setCSS('color-odG', self.$root.getCSS('color-material-idle'));
      }
      if (this.$root.Alt) {
        modColor = this.$root.getCSS('color-B');
        this.$root.setCSS('color-odB', self.$root.getCSS('color-B'));
      } else {
        this.$root.setCSS('color-odB', self.$root.getCSS('color-material-idle'));
      }
      // if ((!this.$root.Ctrl) && (!this.$root.Shift) && (!this.$root.Alt)) {
      //   modColor = this.$root.getCSS('color-material-idle');
      // }
      if (lastColor !== modColor) {
        console.log(modColor);
        this.$root.setCSS('color-animChosen', modColor)
      }
      // console.log('Updated CSS variables');
    },
    displayAllFamilies: function() {
      for (var i = 0; i < this.$root.selection.layers.cloned.length; i++) {
        var layer = this.$root.selection.layers.cloned[i];
        var family = layer.family;
        console.log(`\r\n${layer.name}'s family is:`)
        for (let [key, value] of Object.entries(family)) {
          if (value.length) {
            console.log(key);
            var str = '';
            for (var v = 0; v < value.length; v++) {
              str += '\t' + value[v].name + '\r\n'
            }
            console.log(str);
          }
        }
      }
    },
    sharesFamily: function(a, b) {
      var self = this;
      var family = {
        indices: [a.index, b.index],
        genes: self.difference(a.tags, b.tags),
        relation: [],
      }
      if (family.genes.length) {
        if ((a.tags.length == family.genes.length) && (b.tags.length > family.genes.length))
          family.relation = ['parent', 'child'];
        else if ((b.tags.length == family.genes.length) && (a.tags.length > family.genes.length))
          family.relation = ['child', 'parent']
        if ((family.genes.length == a.tags.length - 1) && (family.genes.length == b.tags.length - 1))
          family.relation = ['sibling', 'sibling'];
        if (family.genes.length == a.tags.length - 1) {
          if (b.tags.length > a.tags.length)
            family.relation = ['distant', 'distant'];
        }
        if (family.genes.length == b.tags.length - 1) {
          if (a.tags.length > b.tags.length)
            family.relation = ['distant', 'distant'];
        }
        if ((!family.relation.length) && (family.genes.length))
          family.relation = ['cousin', 'cousin'];
      } else {
        family.relation = [];
      }
      return family;
    },
    notInFamily: function(person, branch) {
      var result = false;
      if (branch.length) {
        for (var i = 0; i < branch.length; i++) {
          if (branch[i] == person) {
            result = true;
            break;
          }
        }
      } else {
        result = true;
      }
      return result;
    },
    layerMsg: function() {
      console.log('hello');
    },
    chooseSelectionAction: function() {
      // var length = this.$root.selection.layers.cloned.length;
      // console.log(length);
      // if (length > 1)
        this.selectedFamilies();
      // else if (length == 1)
      // this.layerMsg();
      // else if (length == 0)
        // Event.$emit('updateComp');
    },
    // BROKEN
    compFamilies: function() {
      // console.log('tried');
      var families = [], self = this, newRelation = 0, totalRelations = [];
      if (this.$root.comp.layers.cloned.length > 1) {
        // console.log('correct');
        for (var i = 0; i < this.$root.comp.layers.cloned.length; i++) {
          for (var c = 0; c < this.$root.comp.layers.cloned.length; c++) {
            if (i !== c) {
              var paul = this.$root.comp.layers.cloned[i], john = this.$root.comp.layers.cloned[c];
              // console.log(paul.tags);
              // console.log(john.tags);
              var family = this.sharesFamily(paul, john);
              // console.log(family);
              if (family.relation.length) {
                var johnboy = {name: john.name, index: john.index}, paulboy = {name: paul.name, index: paul.index};
                var clones = [johnboy, paulboy], cloneFam = [john.family, paul.family];
                for (var p = 0; p < clones.length; p++) {
                  var inverse = (p) ? 0 : 1;
                  var types = [['parent', 'parent'], ['children', 'child'], ['siblings', 'sibling'], ['cousins', 'cousin']]
                  for (var t = 0; t < types.length; t++) {
                    var role = types[t][1], branch = types[t][0];
                    if (family.relation[p] == role) {
                      try {
                        if (this.notInFamily(clones[inverse], cloneFam[p][branch])) {
                          // console.log(`${clones[inverse].name} is ${role} in ${clones[p].name}'s ${branch}`);
                          newRelation++;
                          cloneFam[p][branch].push(clones[inverse]);
                          totalRelations.push(role);
                        } else {
                          // console.log(`${clones[inverse].name} is already a ${role} in ${clones[p].name}'s ${branch}`);
                        }
                      } catch (err){}
                    }
                  }
                }
              } else {
                // console.log('These are not related');
              }
            }
          }
          // var tree = this.$root.selection.layers.cloned[i];
          // console.log(tree.name);
          // console.log(tree.family);
        }
        // console.log('hello?');
        var uniqueRelations = this.$root.removeDuplicateKeywords(totalRelations);
        // console.log(`${newRelation} individual relations:`);
        // console.log(totalRelations);
        // console.log(uniqueRelations);
        this.$root.comp.relations.count = newRelation;
        this.$root.comp.relations.unique = uniqueRelations;
        this.$root.comp.relations.raw = totalRelations;
        Event.$emit('updateCompFamily');
      }
    },
    selectedFamilies: function() {
      var families = [], self = this, newRelation = 0, totalRelations = [];
      if (this.$root.selection.layers.cloned.length > 1) {
        for (var i = 0; i < this.$root.selection.layers.cloned.length; i++) {
          for (var c = 0; c < this.$root.selection.layers.cloned.length; c++) {
            if (i !== c) {
              var paul = this.$root.selection.layers.cloned[i], john = this.$root.selection.layers.cloned[c];
              var family = this.sharesFamily(paul, john);
              if (family.relation.length) {
                var johnboy = {name: john.name, index: john.index}, paulboy = {name: paul.name, index: paul.index};
                var clones = [johnboy, paulboy], cloneFam = [john.family, paul.family];
                for (var p = 0; p < clones.length; p++) {
                  var inverse = (p) ? 0 : 1;
                  var types = [['parent', 'parent'], ['children', 'child'], ['siblings', 'sibling'], ['cousins', 'cousin']]
                  // console.log(`checking ${clones[inverse].name}'s role in ${clones[p].name}'s family`);
                  for (var t = 0; t < types.length; t++) {
                    var role = types[t][1], branch = types[t][0];
                    if (family.relation[p] == role) {
                      if (this.notInFamily(clones[inverse], cloneFam[p][branch])) {
                        // console.log(`${clones[inverse].name} is ${role} in ${clones[p].name}'s ${branch}`);
                        newRelation++;
                        cloneFam[p][branch].push(clones[inverse]);
                        totalRelations.push(role);
                      } else {
                        // console.log(`${clones[inverse].name} is already a ${role} in ${clones[p].name}'s ${branch}`);
                      }
                    }
                  }
                }
              } else {
                // console.log('These are not related');
              }
            }
          }
          // var tree = this.$root.selection.layers.cloned[i];
          // console.log(tree.name);
          // console.log(tree.family);
        }
        var uniqueRelations = this.$root.removeDuplicateKeywords(totalRelations);
        this.familyMode = true;
        console.log(`${newRelation} individual relations:`);
        console.log(totalRelations);
        console.log(uniqueRelations);
        this.displayAllFamilies();
        Event.$emit('updateFamilies');
      } else if (this.$root.selection.layers.cloned.length == 1) {
        this.layerMsg();
      } else if (this.$root.selection.layers.cloned.length == 0) {
        Event.$emit('clearSelection');
        this.familyMode = false;
        // this.$root.clearSelection();
        console.log('Clear relations');
        Event.$emit('updateComp');

      }
    },
    updateTags: function(data) {
      console.log('update');
      this.chooseSelectionAction();
      // this.selectedFamilies();
      // console.log(this.$root.selection.layers.cloned);
    },
    selectedTagsList: function() {
      var self = this, layers = [], props = [];
      var results = {
        layers: [],
        props: [],
        all: [],
      }
      var shadowLayers = this.$root.selection.layers.cloned;
      for (var i = 0; i < shadowLayers.length; i++) {
        var tags = shadowLayers[i].tags;
        results.layers = [].concat(results.layers, tags);
        for (var p = 0; p < shadowLayers[i].props.length; p++) {
          var prop = shadowLayers[i].props[p].name;
          results.props.push(prop);
        }
      }
      results.layers = this.$root.removeDuplicateKeywords(results.layers);
      results.props = this.$root.removeDuplicateKeywords(results.props);
      results.all = [].concat(results.layers, results.props);
      return results;
    },
    compTagsList: function() {
      var self = this, layers = [], props = [];
      var results = {
        layers: [],
        props: [],
        all: [],
      };
      var shadowLayers = this.$root.comp.layers.cloned;
      for (var i = 0; i < shadowLayers.length; i++) {
        var tags = shadowLayers[i].tags;
        results.layers = [].concat(results.layers, tags);
        // for (var p = 0; p < shadowLayers[i].props.length; p++) {
        //   var prop = shadowLayers[i].props[p].name;
        //   results.props.push(prop);
        // }
      }
      results.layers = this.$root.removeDuplicateKeywords(results.layers);
      results.layers = this.$root.removeEmptyValues(results.layers);
      // results.props = this.$root.removeDuplicateKeywords(results.props);
      // results.all = [].concat(results.layers, results.props);
      return results;
    },
    generateTags: function(name) {
      return this.$root.getKeyWordsMono(name);
    },
    compClone: function(child, id) {
      var clone = {}, self = this;
      for (attr in child) {
        clone[attr] = child[attr];
      }
      clone['tags'] = self.generateTags(child.name);
      return clone;
    },
    selectionClone: function(child, type, id) {
      var mirror = [], self = this;
      var clone = {
        name: child.name,
        index: child.index,
        tags: self.generateTags(child.name),
        locked: false,
      }
      if (type == 'layer') {
        clone['locked'] = child.locked;
        clone['id'] = id;
        clone['props'] = self.constructPropMsg(child.props);
        clone['family'] = {
          parent: [],
          children: [],
          cousins: [],
          siblings: [],
        }
      } else if (type == 'prop') {
        clone['depth'] = child.depth;
        clone['parent'] = child.parent;
        clone['layer'] = child.layer;
      }
      return clone;
    },
    constructPropMsg: function(msg) {
      var newProps = []
      if (msg.length) {
        for (var p = 0; p < msg.length; p++) {
          var clone = this.selectionClone(msg[p], 'prop');
          newProps.push(clone)
        }
      }
      return newProps;
    },
    constructLayerMsg: function(msg) {
      var newLayers = [];
      if (msg.length) {
        for (var i = 0; i < msg.length; i++) {
          var clone = this.selectionClone(msg[i], 'layer', i);
          newLayers.push(clone);
        }
      }
      return newLayers;
    },
    constructCompMsg: function(msg) {
      var newLayers = [];
      if (msg.length) {
        for (var i = 0; i < msg.length; i++) {
          var clone = this.compClone(msg[i], i);
          newLayers.push(clone);
        }
      }
      return newLayers;
    },
    selectionRead: function(result) {
      var msg = JSON.parse(result), self = this;
      this.$root.selection.layers.length = msg.layers.length;
      var shadowlayers = this.$root.selection.layers.raw;
      if (this.$root.isEqual(shadowlayers, msg.layers.raw)) {
        // console.log('No change');
      } else {
        // JSX will return typeof var(msg)
        // console.log(msg);
        this.$root.selection.layers.raw = msg.layers.raw;
        this.$root.selection.layers.cloned = this.constructLayerMsg(msg.layers.raw);
        var tags = this.selectedTagsList();
        this.$root.tags.master = tags.all;
        this.$root.tags.layers = tags.layers;
        this.$root.tags.props = tags.props;
        Event.$emit('updateTags');
      }
    },
    selectionCheck: function() {
      var self = this;
      // csInterface.evalScript(`propSelection()`, self.selectionFake)
      csInterface.evalScript(`scanSelection()`, self.selectionRead)
    },
    compRead: function(result) {
      // console.log('reading');
      var msg = JSON.parse(result), self = this;
      // console.log(msg);
      this.$root.comp.layers.length = msg.layers.length;
      var shadowlayers = this.$root.comp.layers.raw;
      if (this.$root.isEqual(shadowlayers, msg.layers.raw)) {
        // console.log('No change');
      } else {
        // JSX will return typeof var(msg)
        // console.log(msg);
        this.$root.comp.layers.raw = msg.layers.raw;
        this.$root.comp.layers.cloned = this.constructCompMsg(msg.layers.raw);
        var tags = this.compTagsList();
        console.log('tags via comp:');
        console.log(tags.layers);
        this.$root.tags.comp = tags.layers;
        Event.$emit('allTags');
        // this.displayLayers();
      }
      this.compFamilies();
    },
    displayProps: function(layer) {
      var self = this;
      if (layer.props.length) {
        for (var i = 0; i < layer.props.length; i++) {
          var targ = layer.props[i];
          console.log(targ.name);
        }
      }
    },
    displayLayers: function() {
      for (var i = 0; i < this.$root.comp.layers.cloned.length; i++) {
        var layer = this.$root.comp.layers.cloned[i];
        this.displayProps(layer);
      }
    },
    msgRead: function(msg) {
      var result = JSON.parse(msg);
      console.log(msg);
      console.log(result);
    },
    compCheck: function() {
      var self = this;
      console.log('Checking comp');
      // csInterface.evalScript(`checkPropsOnSelected()`, self.msgRead)
      csInterface.evalScript(`scanComp()`, self.compRead)
    },
    scanLayers: function(state) {
      var self = this;
      if (state)
        this.timer.selection = setInterval(self.selectionCheck, 500);
    },
    stopLayersScan: function() {
      clearInterval(this.timer.selection);
    },
    toggleScan: function(e) {
      this.scanning = !this.scanning;
      if (this.scanning)
        this.scanLayers(this.scanning);
      else
        this.stopLayersScan();
    },

    test: function() {
      console.log('This is blank and does nothing');
    },
    difference: function(a,b) {
      var sorted_a = a.concat().sort(), sorted_b = b.concat().sort();
      var common = [], a_i = 0, b_i = 0;
      while (a_i < a.length && b_i < b.length) {
        if (sorted_a[a_i] === sorted_b[b_i]) {
          common.push(sorted_a[a_i]);
          a_i++;
          b_i++;
        } else if(sorted_a[a_i] < sorted_b[b_i]) {
          a_i++;
        } else {
          b_i++;
        }
      }
      // common.reverse()
      return common;
    },
  }
})


var app = new Vue({
  el: '#app',
  data: {
      // for mods / UI of selectron
      Ctrl: false,
      Shift: false,
      Alt: false,
      canScroll: true,
      idnum: 1,
      idmax: 3,
      anno: 'action',
      hasAction: true,
      action: 'contextual action',
      // for tagging system
      rx: {
       keysort: /((\d*\_)|^(\#.*)|^(\..*)|\d{1,3}|[a-z](?=[A-Z])|[a-z]*\s|[A-Z][a-z]*)/gm,
       ifoneword: /^((\d*\_*)|([A-Za-z]))[a-z]*$/,
       onesort: /[^\_]*$/,
       keywordOld: /([a-z]|[A-Z])[a-z]*(?=[A-Z]|\s)/gm,
      },
      comp: {
        relations: {
          raw: [],
          unique: [],
          count: 0,
        },
        layers: {
          show: true,
          cloned: [],
          length: 0,
        },
      },
      selection: {
        layers: {
          show: true,
          cloned: [],
          length: 0,
        },
      },
      context: {
        menu: [{
                id: "refresh",
                label: "Refresh menu",
                enabled: "true",
                checkable: "true",
                checked: "false",
              },
              {
                label: "---"
              },
              {
                id: "menuItemId3",
                label: "testExample3",
                enabled: "false",
                checkable: "true",
                checked: "false"
              }
       ],
      },
     tags: {
       // Revamp this to differentiate between layers/props
       master: [],
       layers: [],
       props: [],
       comp: [],
     },
  },
  mounted: function () {
    var self = this;
    console.log(`Root instance mounted`);
    Event.$on('checkMods', self.parseModifiers)
    document.addEventListener('mousewheel', this.handleScroll);
    console.log(this.menu);
    var stringified = JSON.stringify(self.context);
    // var total = {
    //   menu: JSON.stringify(self.menu),
    // }
    console.log(stringified);
    this.rollSelectionID(2);
    // csInterface.setContextMenuByJSON(stringified, self.contextMenuAction)
    // csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", setPanelCallback);
    // document.addEventListener('mouseover', function(e){
    //   // console.log('Hover over');
    // })
    // document.addEventListener('mouseout', function(e) {
    //   // console.log('escape');
    // })
  },
  methods: {
    contextMenuAction: function(evt) {
      console.log(evt);
    },
    clearSelection: function() {
      console.log('Clear');
      for (var i = this.selection.layers.cloned.length; i > 0; i--) {
        this.selection.layers.cloned.pop();
      };
    },
    activateScroll: function() {
      this.canScroll = true;
    },
    // deactivateScroll: function() {
    //   this.canScroll = false;
    // },
    handleScroll: function(evt, tag) {
      var self = this;
      if (this.canScroll) {
        evt.preventDefault();
        var roll = self.idnum
        if (evt.deltaY < -1) {
          if (roll < this.idmax) {
            roll++;
          } else {
            roll = 1;
          }
        } else if (evt.deltaY > 1) {
          if (roll > 1) {
            roll--;
          } else {
            roll = this.idmax;
          }
        }
        this.rollSelectionID(roll);
      }
    },
    rollSelectionID: function(number) {
      var types = ['R', 'G', 'B'];
      var target = types[(number - 1)];
      console.log(`Rolling ${number} for ${target}`);
      this.idnum = number;
      Event.$emit('updateSelectron');
      Event.$emit('updateAnimation');
    },
    parseModifiers: function(evt) {
      // console.log(evt);
      if (evt.ctrlKey)
        this.Ctrl = true;
      else
        this.Ctrl = false;
      if (evt.shiftKey)
        this.Shift = true;
      else
        this.Shift = false;
      if (evt.altKey) {
        evt.preventDefault();
        this.Alt = true;
      } else {
        this.Alt = false;
      }
      Event.$emit('updateSelectron')
    },
    getKeyWordsMono: function(name) {
      var allKeyWords = [];
      if (this.rx.ifoneword.test(name)) {
        var matches = name.match(this.rx.onesort);
        matches = matches[0];
        allKeyWords.push(matches);
      } else if (this.rx.keysort.test(name)) {
        var matches = name.match(this.rx.keysort);
        for (var n = 0; n < matches.length; n++) {
          allKeyWords.push(matches[n]);
        }
      }
      return allKeyWords;
    },
    getKeyWords: function(nameList) {
      var allKeyWords = [];
      for (var i = 0; i < nameList.length; i++) {
        if (this.rx.ifoneword.test(nameList[i])) {
          var matches = nameList[i].match(this.rx.onesort);
          matches = matches[0];
          allKeyWords.push(matches);
        } else if (this.rx.keysort.test(nameList[i])) {
          var matches = nameList[i].match(this.rx.keysort);
          for (var n = 0; n < matches.length; n++) {
            allKeyWords.push(matches[n]);
          }
        }
      }
      return this.removeDuplicateKeywords(allKeyWords);
    },
    removeEmptyValues: function(keyList, mirror = []) {
      // console.log(keyList);
      for (var i = 0; i < keyList.length; i++) {
        var targ = keyList[i];
        console.log(targ);
        if (/\s/.test(targ)) {
          // console.log('Empty');
        } else {
          mirror.push(targ);
        }
      }
      return mirror;
    },
    removeDuplicateKeywords: function(keyList) {
      var uniq = keyList
      .map((name) => {
        return {count: 1, name: name}
      })
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count
        return a
      }, {})
      return sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])
    },
    getCSS(prop) {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop);
    },
    setCSS(prop, data) {
      document.documentElement.style.setProperty('--' + prop, data);
    },
    // https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
    isEqual(value, other) {
    	var type = Object.prototype.toString.call(value), self = this;
    	if (type !== Object.prototype.toString.call(other)) return false;
    	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    	if (valueLen !== otherLen) return false;
    	var compare = function (item1, item2) {
    		var itemType = Object.prototype.toString.call(item1);
    		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
    			if (!self.isEqual(item1, item2)) return false;
    		}	else {
    			if (itemType !== Object.prototype.toString.call(item2)) return false;
    			if (itemType === '[object Function]') {
    				if (item1.toString() !== item2.toString()) return false;
    			} else {
    				if (item1 !== item2) return false;
    			}
    		}
    	};
    	if (type === '[object Array]') {
    		for (var i = 0; i < valueLen; i++) {
    			if (compare(value[i], other[i]) === false) return false;
    		}
    	} else {
    		for (var key in value) {
    			if (value.hasOwnProperty(key)) {
    				if (compare(value[key], other[key]) === false) return false;
    			}
    		}
    	}
    	return true;
    }
  }
});
