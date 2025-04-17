<script setup>
import { onMounted, ref } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import axios from 'axios';
import { useRoute } from 'vue-router';
const route = useRoute();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const bpmnContainer = ref(null);
const modeler = ref(null); // Сохраняем modeler
const selectedProcessId = ref(Number(route.params.processId));
onMounted(() => {
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: document },
  });
// Загрузка процессов
const loadProcesses = async () => {
  try {
    const response = await axios.get(`${API_BPM_PROCESS}`);
    processes.value = Array.isArray(response.data) ? response.data : [];
    console.log('Processes loaded:', processes.value);
  } catch (err) {
    console.error('Ошибка загрузки процессов:', err);
    processes.value = [];
  }
};

// Загрузка BPMN XML по ID диаграммы
const loadBpmnXml = async () => {
  if (!selectedProcessId.value) {
    console.warn('Process ID не указан:', selectedProcessId.value);
    return false;
  }

  try {
    // Получаем процесс
    const processResponse = await axios.get(`${API_BPM_PROCESS}${selectedProcessId.value}/`);
    const process = processResponse.data;
    if (!process.bpmn_xml) {
      throw new Error('bpmn_xml ID не найден');
    }

    // Получаем XML по ID диаграммы
    const diagramResponse = await axios.get(`${API_BPMNXML_PROCESS}${process.bpmn_xml}/`);
    const xml = diagramResponse.data.xml;
    if (!xml) {
      throw new Error('bpmn_xml.xml не найден');
    }

    await modeler.value.importXML(xml);
    console.log('BPMN загружен для процесса:', selectedProcessId.value);

    // Обновляем processes
    const existingProcess = processes.value.find(p => p.id === selectedProcessId.value);
    if (existingProcess) {
      existingProcess.bpmn_xml = process.bpmn_xml; // Сохраняем ID
    } else {
      processes.value.push(process);
    }

    modeler.value.get('canvas').zoom('fit-viewport');
    return true;
  } catch (err) {
    console.error('Ошибка загрузки XML:', err);
    return false;
  }
};

  const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0dtfz8f" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.23.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="8.5.0">
  <bpmn:process id="Process_038d7qw" isExecutable="false">
    <bpmn:sequenceFlow id="Flow_19zgnv4" />
    <bpmn:startEvent id="Event_07yykgk">
      <bpmn:outgoing>Flow_0fd914e</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_05y6hjc" name="helo">
      <bpmn:incoming>Flow_0fd914e</bpmn:incoming>
      <bpmn:outgoing>Flow_0fd914q</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="Activity_05y6hjv" name="helo12">
      <bpmn:incoming>Flow_0fd914q</bpmn:incoming>
      <bpmn:incoming>Flow_0fd914q</bpmn:incoming>
      <bpmn:outgoing>Flow_065gxk2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="Event_05iptkn">
      <bpmn:incoming>Flow_065gxk2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0fd914e" sourceRef="Event_07yykgk" targetRef="Activity_05y6hjc" />
    <bpmn:sequenceFlow id="Flow_0fd914q" sourceRef="Activity_05y6hjc" targetRef="Activity_05y6hjv" />
    <bpmn:sequenceFlow id="Flow_065gxk2" sourceRef="Activity_05y6hjv" targetRef="Event_05iptkn" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_038d7qw" >
      <bpmndi:BPMNShape id="Event_07yykgk_di" bpmnElement="Event_07yykgk" bioc:stroke="rgb(255, 254, 252)" bioc:fill="rgb(4, 255, 11)">
        <dc:Bounds x="152" y="122" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_05iptkn_di" bpmnElement="Event_05iptkn" bioc:stroke="rgb(255, 254, 252)" bioc:fill="rgb(245, 174, 228)">
        <dc:Bounds x="542" y="72" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_05y6hjc_di" bpmnElement="Activity_05y6hjc" bioc:stroke="rgb(255, 254, 252)" bioc:fill="rgb(80, 98, 235)">
        <dc:Bounds x="250" y="130" width="100" height="80" />
        <bpmndi:BPMNLabel />
         <bpmndi:BPMNStyle fill="#04FF0B"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_05y6hjv_di" bpmnElement="Activity_05y6hjv" bioc:stroke="rgb(255, 254, 252)" bioc:fill="rgb(212, 142, 72)">
        <dc:Bounds x="440" y="230" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0fd914e_di" bpmnElement="Flow_0fd914e">
        <di:waypoint x="188" y="140" />
        <di:waypoint x="219" y="140" />
        <di:waypoint x="219" y="170" />
        <di:waypoint x="250" y="170" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0fd914q_di" bpmnElement="Flow_0fd914q">
        <di:waypoint x="350" y="170" />
        <di:waypoint x="371" y="170" />
        <di:waypoint x="371" y="300" />
        <di:waypoint x="440" y="300" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_065gxk2_di" bpmnElement="Flow_065gxk2">
        <di:waypoint x="490" y="230" />
        <di:waypoint x="490" y="90" />
        <di:waypoint x="542" y="90" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

  modeler.value.importXML(initialDiagram).then(() => {
    console.log('BPMN загружен!');
    modeler.value.get('canvas').zoom('fit-viewport');
  }).catch(err => {
    console.error('Ошибка загрузки BPMN:', err);
  });
});

const saveDiagram = async () => {
  try {
    const { xml } = await modeler.value.saveXML({ format: true });
    console.log('Сохранённый XML:', xml);

    // Отправка на сервер`${API_URL}
    const response = await axios.post(`${API_BPMNXML_PROCESS}`, {
      xml:xml
    });

    console.log('Диаграмма успешно сохранена на сервере');
  } catch (err) {
    console.error('Ошибка сохранения:', err);
  }
};

const startProcess = () => {
  console.log('Запуск процесса...');
  // Логика для запуска процесса
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div ref="bpmnContainer" class="w-full h-[600px] border"></div>
    <div class="btn">
      <button @click="saveDiagram" class="mt-2 p-2 bg-blue-500 text-white self-start">
        Сохранить процесс
      </button>
      <br />
      <button @click="startProcess" class="mt-2 p-2 bg-green-500 text-white self-start">
        Запустить процесс
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep(.bjs-container) {
  height: 100%;
  width: 100%;
}
button {
  border-radius: 4px;
}
.w-full {
  background-color: rgb(234, 234, 235);
  color: black;
}
.btn {
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.bpmnContainer{
  display: flex; 
  background-color: blueviolet;
  
  justify-content: right;
}
</style>