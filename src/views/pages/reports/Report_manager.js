import { getProjects } from "@/api/tasks";
import { useRoute } from "vue-router";
import { onMounted, ref, reactive } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import CustomPaletteProvider from '@/views/pages/reports/CustomPaletteProvider';
import axios from 'axios';
import qaModdleExtension from '@/views/pages/reports/qa';
import { getBpmTask } from "@/api/bpm_data";
export function ProjectsManager (){
const projects = ref([]);
const route = useRoute();
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
const API_BPMN_TASK = import.meta.env.VITE_API_BPM_TASK;


const newBpmnTask = reactive({
  process: '',
  assigned_to: '',
  assigned_department: '',
  status: '',
  return_reason: '',
  deadline: '',
  created_at: '',
  updated_at: '',
  completed_at: '',
  bpmn_task_id: null,
  is_complete: false,
  
});
const priority = {
  1: { priority_name: "НИЗКИЙ", color: "green" },
  2: { priority_name: "СРЕДНИЙ", color: "blue" },
  3: { priority_name: "ВЫСОКИЙ", color: "orange" },
  4: { priority_name: "КРИТИЧЕСКИЙ", color: "red" },
};

// QA functionality

// Set up BPMN modeler and event handlers
}