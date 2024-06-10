import './assets/main.css'

import { createApp } from 'vue';
import Auth from './Auth.vue';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPencil, faTrash);

createApp(Auth)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
