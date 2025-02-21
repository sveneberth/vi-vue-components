<template>
  <div class="home">
    <h1 class="main-headline">Hallo {{ state.name }}</h1>

    <div class="main-box" v-if="false && userStore.favoriteModules?.length > 0">
      <h2 class="headline">Deine Favoriten</h2>
      <div class="home-grid">
        <widget-small
          v-for="i in userStore.favoriteModules"
          :icon="i['icon']"
          :library="i['library']"
          :to="i['to']"
        >
          {{ i["name"] }}
        </widget-small>
      </div>
    </div>

    <div class="main-box" v-if="localStore.state.lastEntries.length > 0">
      <h2 class="headline">Zuletzt bearbeitet
        <sl-icon name="x" @click="localStore.removeAllEntries()"></sl-icon>
      </h2>

      <div class="home-grid">
        <widget-small
          v-for="i in localStore.state.lastEntries"
          :icon="i['icon']"
          :name="i['name']"
          :library="i['library']"
          :to="i['to']"
        >
          {{ i["name"] }}
        </widget-small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive, computed } from "vue"
import { useRoute } from "vue-router"
import { useUserStore } from "../stores/user"
import { useLocalStore} from "../stores/local"
import Utils from "../utils"
import WidgetSmall from "../dashboard/WidgetSmall.vue"

export default defineComponent({
  props: {},
  components: { WidgetSmall },
  setup(props, context) {
    const route = useRoute()
    const userStore = useUserStore()
    const localStore = useLocalStore()
    const state = reactive({
      name: computed(() => {
        let name = ""
        if (!userStore.state.user) return name

        if (userStore.state.user["firstname"] && userStore.state.user["lastname"]) {
          name = userStore.state.user["firstname"] + " " + userStore.state.user["lastname"]
        } else {
          name = userStore.state.user["name"]
        }
        return name
      })
    })

    function createInitials(name: string) {
      return Utils.nameToInitials(name)
    }

    return {
      state,
      route,
      userStore,
      localStore,
      createInitials
    }
  }
})
</script>

<style scoped>
.home {
  padding: 15px 30px;
  margin: 0 auto;
  width: 100%;
  max-width: 1280px;
  flex: 1;
  overflow-y: auto;
  color: var(--vi-foreground-color);
}

.main-headline {
  font-size: 2em;
  margin-bottom: 15px;
  font-weight: 600;
}

.headline {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  font-size: 1.3em;
  margin-bottom: 15px;
  font-weight: 600;

  &:hover{
     & sl-icon{
        opacity: 1;
      }
  }

  & sl-icon{
    font-size: .52em;
    margin-top: .35em;
    margin-left: auto;
    opacity: .3;
    transition: all ease .3s;
    cursor: pointer;

    &:hover{
        color: var(--sl-color-primary-500);
     }
  }
}

.main-box{
  padding: var(--sl-spacing-medium) var(--sl-spacing-large);
  background-color: var(--sl-color-neutral-0);
  border-radius: var(--sl-border-radius-medium);
  border: 1px solid var(--sl-color-neutral-300);
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: 1fr;
  grid-gap: 15px;
}
</style>
