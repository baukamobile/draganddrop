<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import CustomPaletteProvider from '@/views/pages/reports/CustomPaletteProvider';
import { useRoute } from 'vue-router';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const route = useRoute();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null);

// Реактивные данные для формы
const isFormVisible = ref(false);
const suitabilityScore = ref('');
const lastChecked = ref('-');
const isWarningVisible = ref(false);
const selectedElement = ref(null);
const selectedView = ref('');
const formRef = ref(null);

// Валидация Suitability Score
const validateSuitabilityScore = () => {
  const value = suitabilityScore.value;
  isWarningVisible.value = isNaN(value) || value === '';
};

// Обработчик отправки формы
const handleFormSubmit = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (isWarningVisible.value || !selectedElement.value) return;

  const modeling = modeler.value.get('modeling');
  const moddle = modeler.value.get('moddle');

  const businessObject = selectedElement.value.businessObject;
  let extensionElements = businessObject.extensionElements;
  
  // Создаем extensionElements если их нет
  if (!extensionElements) {
    extensionElements = moddle.create('bpmn:ExtensionElements');
    extensionElements.values = [];
  }

  // Проверяем наличие values и создаем при необходимости
  if (!extensionElements.values) {
    extensionElements.values = [];
  }

  // let analysisDetails = 1;
  // extensionElements.values.find(
  //   (ext) => ext.$type === 'qa:AnalysisDetails'
  // );
  
  // if (!analysisDetails) {
  //   analysisDetails = moddle.create('qa:AnalysisDetails');
  //   extensionElements.values.push(analysisDetails);
  // }

  // analysisDetails.lastChecked = new Date().toISOString();

  modeling.updateProperties(selectedElement.value, {
    extensionElements,
    suitable: Number(suitabilityScore.value)
  });

  isFormVisible.value = false;
};

// Закрытие формы при нажатии Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isFormVisible.value) {
    isFormVisible.value = false;
  }
};

// Закрытие формы при клике вне
const handleClickOutside = (event) => {
  // Проверяем только если форма открыта
  if (!isFormVisible.value) return;
  
  // Проверяем, был ли клик на форме или её элементах
  if (formRef.value && (formRef.value === event.target || formRef.value.contains(event.target))) {
    return; // Клик внутри формы, ничего не делаем
  }
  
  // Клик был вне формы, закрываем
  isFormVisible.value = false;
};

onMounted(() => {
  // Добавляем обработчик клавиш
  window.addEventListener('keydown', handleKeydown);
  
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
    additionalModules: [
      {
        paletteProvider: ['value', null]
      },
      {
        __init__: ['customPaletteProvider'],
        customPaletteProvider: ['type', CustomPaletteProvider]
      }
    ]
  });

  const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.23.0">
  <bpmn:process id="Process_1" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

  modeler.value.importXML(initialDiagram).then(() => {
    console.log('BPMN loaded!');

    // Обработчик правого клика - контекстное меню
    modeler.value.on('element.contextmenu', 1500, (event) => {
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();

      const { element } = event;
      if (!element.parent) return; // Игнорируем корневой элемент

      // Сохраняем ссылку на выбранный элемент
      selectedElement.value = element;
      const businessObject = element.businessObject;

      // Заполняем данные формы
      suitabilityScore.value = businessObject.suitable || '';
      // const analysisDetails = businessObject.extensionElements?.values?.find(
      //   (ext) => ext.$type === 'qa:AnalysisDetails'
      // );
      // lastChecked.value = analysisDetails?.lastChecked || '-';
      selectedView.value = ''; // Сбрасываем выбор в выпадающем списке

      // Показываем форму
      isFormVisible.value = true;
      
      // Валидируем поле оценки
      validateSuitabilityScore();
      
      // Добавляем слушатель клика с задержкой, чтобы избежать мгновенного закрытия
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside);
      }, 100);
    });

    // Существующая логика оверлея и календаря
    const overlays = modeler.value.get('overlays');
    overlays.add('Process_038d7qw', 'note', {
      position: {
        top: -30,
        right: 10,
      },
    });

    const taskElement = modeler.value.get('elementRegistry').get('Activity_05y6hjc');
    if (taskElement) {
      const taskShape = modeler.value.get('canvas').getGraphics(taskElement);
      const calendarContainer = document.createElement('div');
      flatpickr(calendarContainer, {
        dateFormat: 'Y-m-d',
        onChange: (selectedDates, dateStr) => {
          console.log('Selected date:', dateStr);
          taskElement.businessObject.dueDate = dateStr;
        }
      });
      taskShape.appendChild(calendarContainer);
    }

    modeler.value.get('canvas').zoom('fit-viewport');
  }).catch(err => {
    console.error('Error loading BPMN:', err);
  });
});

// Очищаем обработчики событий при размонтировании компонента
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <PageWrapper>
    <div id="container">
      <div class="panel hint">
        <!-- <h1>Click <b>right mouse button</b> to edit properties.</h1> -->
      </div>
      <div class="flex flex-col h-full">
        <div ref="bpmnContainer" class="w-full h-[600px] border">
          <!-- Форма редактирования свойств - теперь использует v-show вместо класса -->
          <div class="panel quality-assurance" v-show="isFormVisible" ref="formRef">
            <form @submit="handleFormSubmit" @keydown.stop>
              <p>
                <b>Suitability Score</b>
              </p>
              <br />
              <input
                v-model="suitabilityScore"
                type="text"
                placeholder="100"
                autocomplete="off"
                @input="validateSuitabilityScore"
                @click.stop
              >
              <br />
              <p v-show="isWarningVisible" class="warning">
                Suitability Score must be a number
              </p>
              <br />
              <!-- <p>
                 <b>Last Checked</b> -->
              <!-- </p>  -->
              <!-- <br /> -->
              <!-- <p class="last-checked"> -->
                <!-- {{ lastChecked }} -->
              <!-- </p> -->
              <br />
              <select
                v-model="selectedView"
                class="dropdown"
                style="padding: 5px; border-radius: 5px; background-color: greenyellow;"
                @click.stop
              >
                <option value="">Select View</option>
                <option value="view1">user 1</option>
                <option value="view2">user 2</option>
                <option value="view3">user 3</option>
              </select>
              <br />
              <label class="label-name">Конец:</label>
                  <input type="date" />
              <br />
              <input
                type="submit"
                value="Okay"
                :disabled="isWarningVisible"
                @click.stop
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<style>
:deep(.bjs-container) {
  height: 100%;
  width: 100%;
}
.w-full {
  background-color: rgb(234, 234, 235);
  color: black;
}
* {
  box-sizing: border-box;
  margin: 0;
  outline: none;
  padding: 0;
}

html, body, #container {
  height: 100%;
}

.panel {
  background-color: #fafafa;
  border: solid 1px #ccc;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;
  padding: 10px;
}

.djs-label {
  font-family: 'Arial', sans-serif;
}

.bpmn-icon-task.red {
  color: #cc0000 !important;
}

.bpmn-icon-task.yellow {
  color: #ffc800 !important;
}

.bpmn-icon-task.green {
  color: #52B415 !important;
}

.quality-assurance {
  color: #111;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* Обеспечивает отображение поверх других элементов */
}

.quality-assurance form input {
  border: solid 1px #ccc;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;
  padding: 10px;
}

.quality-assurance form input[type=text] {
  width: 100%;
}

.quality-assurance form .warning {
  background-color: rgba(255, 0, 0, 0.25);
  border-radius: 2px;
  padding: 10px;
}

.quality-assurance form input[type=submit] {
  background-color: #fafafa;
  color: #111;
}

.hint {
  bottom: 20px;
  left: 20px;
  position: absolute;
}
</style>