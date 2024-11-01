import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from './App.vue'
import './main.scss';
import './style.css';
import 'primevue/resources/themes/aura-light-amber/theme.css'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog';


const app = createApp(App);
app.use(PrimeVue, {
    ripple:true
});
app.use(ToastService);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app');