<template>
    <div>
        <div class="droppable">
            <h4>Todo</h4>
            <div class="dragabble">
                <h5>task</h5>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted } from 'vue'
export default{
    name: 'App',
}
,script>
onMounted(() => {
    // document.getElementById('loading')?.remove() // Сразу убираем элемент
})
</script>

<!-- <template>
    <router-view />
    <h1>Some thing</h1>
</template> -->
