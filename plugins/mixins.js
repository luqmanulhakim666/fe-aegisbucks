import Vue from "vue";
import alert from "@/mixins/alert";
import meta from "@/mixins/meta";
import pipe from "@/mixins/pipe";
import routes from "@/mixins/routes";
import screen from "@/mixins/screen";
import utils from "@/mixins/utils";

Vue.mixin(alert);
Vue.mixin(meta);
Vue.mixin(pipe);
Vue.mixin(routes);
Vue.mixin(screen);
Vue.mixin(utils);
