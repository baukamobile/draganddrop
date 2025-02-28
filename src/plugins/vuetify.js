import { icons } from '@tabler/icons-vue';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework.mjs';

Vue.useAttrs(Vuetify);


export default new Vuetify({
    icons: {
        iconfont: 'fa' || 'md',
    }
})