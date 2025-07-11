import $ from "jquery";
import { capitalize } from "lodash";
import { MORPH_DATA, state } from "../../core/settings";
import { summaryButtonComponent } from "../summary/summary-button/summaryButton";
import interfaceHTML from "./interface.html";
import "./interface.scss";
import { interfaceGroupComponent } from "./interfaceItems/interfaceGroup/interfacGroup";
import {
  interfaceGroupInputsComponent,
  typesInputs,
  updateTextParam,
} from "./interfaceItems/interfaceGroup/interfaceGroupInputs/interfaceGroupInputs";
import { typesDirection } from "./interfaceItems/interfaceGroup/interfaceGroupInputs/range/generateRange";

export const step = !state.model ? 17 : 20;

state.backWall = true;
const textWall = updateTextParam(state, null, false, true);
const textElectro = updateTextParam(state, this, true, true);
const textAccessories = updateTextParam(state, this, true, true);
const textSub = updateTextParam(state, this, true, true, true);

export function deleteActiveClassFromContainerRadioType(
  container,
  firstSelector,
  activeClass
) {
  container.find(firstSelector).each(function () {
    $(this).closest(firstSelector).removeClass(activeClass);
  });
}

export const stringTypeModel = {
  0: "Villa Pergola 2.0",
  1: "Weatherproof",
};

export const stringMountedType = {
  0: "Back Wall",
  1: "Left Wall",
  2: "Right Wall",
};

export const stringTypePegola = {
  0: "Residential",
  1: "Commercial",
};

export const stringRoofType = {
  0: "Lattice",
  1: "Solid",
  2: "Combo",
};

export const stringPostType = {
  0: state.wrapKit || state.roofType === 2 ? "Santa Fe" : "Classic",
  1: "Square Column",
  2: "Round Column",
};

export const stringEndCuts = {
  0: "Bevel",
  1: "Mitre",
  2: "Corbel",
  3: "Scallop",
};

export const stringColorType = {
  0: `Standart Colors`,
  1: `Wood Colors`,
};

export const groups = [
  {
    title: "Model",
    param: stringTypeModel[state.type3Dmodel],
    type: typesInputs.modelType,
  },
  {
    title: "Mounted",
    param: updateTextParam(state, this, false, true),
    type: typesInputs.mountedType,
  },
  {
    title: "Dimensions",
    param: `${state.width}' x ${state.length}' x ${state.height}'`,
    type: typesInputs.range,
    ranges: [
      {
        title: capitalize(typesDirection.width),
        labelMin: `${MORPH_DATA.width.min}'`,
        labelMax: `${MORPH_DATA.width.max}'`,
        min: MORPH_DATA.width.min,
        max: MORPH_DATA.width.max,
        step: 1,
        thumb: true,
        initialValue: state.width,
        showLabels: true,
        showSwitchAngle: false,
        inch: true,
      },
      {
        title: capitalize(typesDirection.length),
        labelMin: `${MORPH_DATA.length.min}'`,
        labelMax: `${MORPH_DATA.length.max}'`,
        min: MORPH_DATA.length.min,
        max: MORPH_DATA.length.max,
        step: 1,
        thumb: true,
        initialValue: state.length,
        showLabels: true,
        showSwitchAngle: false,
        inch: true,
      },
      {
        title: capitalize(typesDirection.height),
        labelMin: `${MORPH_DATA.height.min}'`,
        labelMax: `${MORPH_DATA.height.max}'`,
        min: MORPH_DATA.height.min,
        max: MORPH_DATA.height.max,
        step: 1,
        thumb: true,
        initialValue: state.height,
        showLabels: true,
        showSwitchAngle: false,
        inch: true,
      },
    ],
  },
  {
    title: "Frame Color",
    param: state.colorBody,
    type: typesInputs.colorsButton,
  },
  {
    title: "Roof Color",
    param: state.colorRoof,
    type: typesInputs.colorsButton,
  },
  {
    title: "Accessories",
    param: textAccessories,
    type: typesInputs.electronic,
  },
  {
    title: "Electrical options",
    param: textSub,
    type: typesInputs.subSystem,
  },
];

export function interfaceComponent(container) {
  const componentContent = $(
    '<div class="interface-container" id="interface"></div>'
  );

  const interfaceElement = $(interfaceHTML);

  groups.forEach((group) => {
    const groupComponent = interfaceGroupComponent(group.title, group.param);
    const groupComponentInputs = $(
      '<div class="interface__group__inputs"></div>'
    );
    groupComponentInputs.append(
      interfaceGroupInputsComponent(
        group.type,
        group?.ranges,
        group?.initValuePostSize,
        group.title
      )
    );
    groupComponent.append(groupComponentInputs);

    groupComponentInputs.hide();

    interfaceElement.append(groupComponent);
  });

  $(componentContent).append(interfaceElement);

  summaryButtonComponent(componentContent);
  $(container).append(componentContent);
}
