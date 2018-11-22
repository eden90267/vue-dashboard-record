import Vue from 'vue';

Vue.prototype.$bus = new Vue(); // 將 Event Bug 掛在 Vue 的原型下

// Message
// vm.$bus.$emit('message:push', message, status);
// message(string): 訊息內容
// status(string): Alert 的樣式
