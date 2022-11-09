import './shoelaceConfig'

console.log("base")
//Vue
import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

//element plus
//import ElementPlus from 'element-plus'
//app.use(ElementPlus)

import router from './routes'
import {createPinia} from 'pinia'
import {createI18n} from "vue-i18n";
import en from "./translations/en"
import de from "./translations/de"

const pinia = createPinia()
app.use(pinia)

app.use(router)


const i18n = createI18n({
    locale: "de",
    fallbackLocale: "en",
    messages: {"en": en, "de": de}
})

app.use(i18n)

app.mount('#app')