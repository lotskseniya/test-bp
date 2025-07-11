"use strict";

import { changeURL, initStateFromUrl } from "./customFunctions/paramsURL";

export const BACKGROUND_COLOR = 0xffffff;
export const ENVIRONMENT_MAP = "public/environment/neutral_2.hdr";
export const ENVIRONMENT_MAP_INTENSITY = 1.0;
export const SHADOW_TRANSPARENCY = 0.2;
export const TONE_MAPPING_EXPOSURE = 1;

export const settingsLouver = {
  countLouver: 0,
  width: 0,
  correction: 0,
  morphValueOrigin: 0,
};

export const log = false;
export let pdfImg = { img: "" };
export let pdfImgTop = { img: "" };

//#region URL AND STATE
let timer;

function triggerCallback() {
  clearTimeout(timer);

  timer = setTimeout(() => {
    changeURL();
  }, 0); // debounce
}

const proxyCache = new WeakMap();
const setProxyCache = new WeakMap();
const arrayProxyCache = new WeakMap();

function createNestedProxy(target) {
  if (proxyCache.has(target)) return proxyCache.get(target);
  const proxy = new Proxy(target, {
    set(target, key, value) {
      target[key] = value;
      triggerCallback();
      return true;
    },
    get(target, key) {
      const value = target[key];
      if (typeof value === "object" && value !== null) {
        if (value instanceof Set) return createSetProxy(value);
        if (Array.isArray(value)) return createArrayProxy(value);
        return createNestedProxy(value);
      }
      return value;
    },
  });
  proxyCache.set(target, proxy);
  return proxy;
}

function createSetProxy(set) {
  if (setProxyCache.has(set)) return setProxyCache.get(set);

  const proxy = new Proxy(set, {
    get(target, prop) {
      if (prop === "add") {
        return (value) => {
          target.add(value);
          triggerCallback();
          return target;
        };
      }

      if (prop === "delete") {
        return (value) => {
          const result = target.delete(value);
          triggerCallback();
          return result;
        };
      }

      if (prop === "clear") {
        return () => {
          target.clear();
          triggerCallback();
        };
      }

      if (prop === "has") {
        return (value) => {
          const result = target.has(value);
          triggerCallback();
          return result;
        };
      }

      if (prop === "forEach") {
        return (...args) => {
          target.forEach(...args);
          triggerCallback();
        };
      }

      if (prop === "from") {
        return (iterable) => {
          const newSet = Set.from(iterable);
          triggerCallback();
          return newSet;
        };
      }

      if (prop === "values" || prop === Symbol.iterator) {
        return () => {
          const iterator = target[Symbol.iterator]();
          triggerCallback();
          return iterator;
        };
      }

      return target[prop];
    },

    set(target, prop, value) {
      target[prop] = value;
      triggerCallback();
      return true;
    },
  });

  setProxyCache.set(set, proxy);
  return proxy;
}

function createArrayProxy(array) {
  if (arrayProxyCache.has(array)) return arrayProxyCache.get(array);

  const proxy = new Proxy(array, {
    set(target, key, value) {
      target[key] = value;
      triggerCallback();
      return true;
    },
    get(target, key) {
      if (
        key === "push" ||
        key === "pop" ||
        key === "shift" ||
        key === "unshift" ||
        key === "splice" ||
        key === "filter"
      ) {
        return (...args) => {
          const result = Array.prototype[key].apply(target, args);
          triggerCallback();
          return result;
        };
      }
      return target[key];
    },
  });

  arrayProxyCache.set(array, proxy);
  return proxy;
}

export const stateForProxy = {
  solidRoofElementWidth_m: {
    _0_plank: 0.1015, // 0,5 plank
    _1_plank: 0.203,
    _2_plank: 0.406,
    _3_plank: 0.61,
    _4_plank: 0.813,
    _5_plank: 1.02,
    _6_plank: 1.22,
    _7_plank: 0.14, // 0,75 plank
  },
  fanIntervalWidth: 20.5, // feets for 1 fan
  fanIntervalLength: 12.5, // feets for 1 fan
  lightIntervalWidth: 6, // feets for 1 light
  lightIntervalLength: 6, // feets for 1 light
  comboCenteXpoint: 0,
  roofSolidPlank8inch: false,
  skyLight: false,
  typePergola: 0,
  roofType: 0,
  postSize: 8,
  postType: 0,
  directionRoof: 0,
  roofColorType: 0,
  overhang: 16,
  currentRotationZ: 90,
  isRotated: false,
  rain: false,
  height: 8,
  length: 10,
  width: 10,
  maxHeight: 10,
  maxLength: 38,
  maxWidth: 26,
  beam: false,
  steel: false,
  wrapKit: false,
  beamSize: 1,
  tails: false,
  gutter: 0,
  postWidthInterval: 10.5,
  postDepthInterval: 12.5,
  louverInterval: 16.5,
  solidRoofSkylightWidth_m: 0.406,
  backWall: false,
  leftWall: false,
  rightWall: false,
  wallOption: 0,
  colorRoof: "#383E42",
  colorRoofSolid: "#383E42",
  colorBody: "#383E42",
  colorLed: "#FFFFFF",
  electro: new Set(),
  dayMode: true,
  spacing: 1,
  currentSubSystem: [],
  fanAvatarHeight: 0.4,
  fanAvatarWidth: 0.8,
  endCuts: 1,
  portalOption: 0,
  subSystem: new Set(),
  subSystemUrl: new Set(),
  fans: false,
  heaters: false,
  moodLight: false,
  ledLights: false,
  slatsSize: false,
  lastSpan: null,
  zipInput: 0,
  slidingDoorInput: 0,
  type3Dmodel: 0,
  thickness: 0,
  rafter: 0,
  removeLettice: 0,
  biFoldDoorShattersInput: 0,
  biFoldDoorShattersRotate: 0,
  midPointForScreenZ: 0,
  midPointForScreenX: 0,
  transparency: "10",
  colorZip: "#000000",
  currentActiveSystems: null,
  imgForPdf: null,
};

export const state = new Proxy(stateForProxy, {
  get(target, key) {
    const value = target[key];
    if (key === "currentActiveSystems") {
      console.log(value);
    }
    if (typeof value === "object" && value !== null) {
      if (value instanceof Set) {
        return createSetProxy(value); // COVER FOR SET
      } else if (Array.isArray(value)) {
        return createArrayProxy(value); // COVER FOR ARRAY
      } else {
        return createNestedProxy(value); // COVER FOR ANOTHER ...
      }
    }
    return value;
  },

  set(target, key, value) {
    target[key] = value;

    triggerCallback();

    return true;
  },
});

window.state = state;

await initStateFromUrl();
//#endregion

export const MODEL_PATHS = ["public/models/hide_away_01.glb"];

export const MODEL_CENTER_POSITION = -1;

export const DATA_CONCTRUCTION = {
  widthToPillar: 44, // inch
  depthToPillar: 24, // inch
  roofGlassWidthMin: 100 / 2.54, // inch
  roofGlassWidthMax: 150 / 2.54, // inch
};

export const MORPH_DATA = {
  width: {
    min: 6,
    initValue: state.width,
    max: state.maxWidth,
  },
  length: {
    min: 6,
    initValue: state.length,
    max: state.maxLength,
  },
  height: {
    min: 6,
    initValue: state.height,
    max: state.maxHeight,
  },
};

export const MORPH_DATA_SI = {
  width: {
    min: 1.21,
    max: 12.1844,
  },
  length: {
    min: 1.21,
    max: 12.1844,
  },
  height: {
    min: 2.65,
    max: 14.57,
  },
  frameWidth: {
    min: 1.21,
    max: 18.28,
  },
  frameLength: {
    min: 1.21,
    max: 18.28,
  },
  louverLength: {
    min: 1.67,
    max: 4.26,
  },
};

export const WALL_OFFSETS = {
  height_8: {
    sideWallOffsetY: 0,
    backWallOffsetY: 0,
  },
  height_9: {
    sideWallOffsetY: 0.0217,
    backWallOffsetY: 0.4015,
  },
  height_10: {
    sideWallOffsetY: 0.045,
    backWallOffsetY: 0.4965,
  },
  height_11: {
    sideWallOffsetY: 0.067,
    backWallOffsetY: 0.513,
  },
  height_12: {
    sideWallOffsetY: 0.09,
    backWallOffsetY: 0.5315,
  },
  height_13: {
    sideWallOffsetY: 0.035,
    backWallOffsetY: 0.5485,
  },
  height_14: {
    sideWallOffsetY: 0.0575,
    backWallOffsetY: 0.566,
  },
  height_15: {
    sideWallOffsetY: 0.0035,
    backWallOffsetY: 0.2,
  },
};

console.log(state);
