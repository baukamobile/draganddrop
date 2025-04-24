

const HIGH_PRIORITY = 1500;

const containerEl = document.getElementById('container'),
      qualityAssuranceEl = document.getElementById('quality-assurance'),
      suitabilityScoreEl = document.getElementById('suitability-score'),
      lastCheckedEl = document.getElementById('last-checked'),
      okayEl = document.getElementById('okay'),
      formEl = document.getElementById('form'),
      warningEl = document.getElementById('warning');

// hide quality assurance if user clicks outside
window.addEventListener('click', (event) => {
  const { target } = event;

  if (target === qualityAssuranceEl || qualityAssuranceEl.contains(target)) {
    return;
  }

  qualityAssuranceEl.classList.add('hidden');
});

// create modeler
const bpmnModeler = new bpmn_js_lib_Modeler__WEBPACK_IMPORTED_MODULE_3__["default"]({
  container: containerEl,
  additionalModules: [
    _custom__WEBPACK_IMPORTED_MODULE_1__["default"]
  ],
  moddleExtensions: {
    qa: _resources_qa__WEBPACK_IMPORTED_MODULE_2__
  }
});

// import XML
bpmnModeler.importXML(_resources_diagram_bpmn__WEBPACK_IMPORTED_MODULE_0__["default"]).then(() => {
  const moddle = bpmnModeler.get('moddle'),
        modeling = bpmnModeler.get('modeling');
  let analysisDetails,
      businessObject,
      element,
      suitabilityScore;

// validate suitability score
function validate() {
    const { value } = suitabilityScoreEl;

    if (isNaN(value)) {
      warningEl.classList.remove('hidden');
      okayEl.disabled = true;
    } else {
      warningEl.classList.add('hidden');
      okayEl.disabled = false;
    }
  }

  // open quality assurance if user right clicks on element
  bpmnModeler.on('element.contextmenu', HIGH_PRIORITY, (event) => {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();

    qualityAssuranceEl.classList.remove('hidden');

    ({ element } = event);

    // ignore root element
    if (!element.parent) {
      return;
    }

    businessObject = (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_4__.getBusinessObject)(element);

    let { suitable } = businessObject;

    suitabilityScoreEl.value = suitable ? suitable : '';

    suitabilityScoreEl.focus();

    analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');

    lastCheckedEl.textContent = analysisDetails ? analysisDetails.lastChecked : '-';

    validate();
  });

  // set suitability core and last checked if user submits
  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();

    suitabilityScore = Number(suitabilityScoreEl.value);

    if (isNaN(suitabilityScore)) {
      return;
    }

    const extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

    if (!analysisDetails) {
      analysisDetails = moddle.create('qa:AnalysisDetails');

      extensionElements.get('values').push(analysisDetails);
    }

    analysisDetails.lastChecked = new Date().toISOString();

    modeling.updateProperties(element, {
      extensionElements,
      suitable: suitabilityScore
    });

    qualityAssuranceEl.classList.add('hidden');
  });

  // close quality assurance if user presses escape
  formEl.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      qualityAssuranceEl.classList.add('hidden');
    }
  });

  // validate suitability score if user inputs value
  suitabilityScoreEl.addEventListener('input', validate);

}).catch((err) => {
  console.error(err);
});

export function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}
// })();

// /******/ })()
;
//# sourceMappingURL=app.js.map