<template>
  <div class="actionbar">
    <sl-button
      v-if="boneState.multiple && !readonly"
      variant="danger"
      :disabled="boneState.isEmpty"
      :title="$t('bone.del')"
      outline
      class="delete-btn"
      @click="removeMultipleEntries(index, lang)"
    >
      <sl-icon name="x"></sl-icon>
    </sl-button>

    <sl-combobox
      :source="getList"
      hoist
      @sl-item-select="addMultipleEntry(lang, { dest: state.skels?.[$event.detail.item.value], rel: null })"
    ></sl-combobox>
    <sl-button
      v-if="boneState.multiple && !readonly"
      variant="success"
      :title="$t('bone.add')"
      outline
      class="add-btn"
      @click="openSelector(lang)"
    >
      <sl-icon name="plus"></sl-icon> {{ $t("bone.add") }}
    </sl-button>
  </div>

  <relational-selector
    :open="state.openedSelection"
    :name="boneState.bonestructure['descr']"
    :tab-id="handlerState.tabId"
    :handler="state.moduleInfo['handlerComponent']"
    :module="boneState?.bonestructure['module']"
    :rowselect="2"
    @close="relationCloseAction"
  >
  </relational-selector>
</template>

<script lang="ts">
//@ts-nocheck
import { reactive, defineComponent, onMounted, inject, computed } from "vue"
import { Request } from "@viur/vue-utils"
import relationalSelector from "../components/relationalSelector.vue"
import { useDBStore } from "../../stores/db"

export default defineComponent({
  props: {
    name: String,
    value: Object,
    index: Number,
    lang: String,
    readonly: Boolean,
    params: Object
  },
  components: { relationalSelector },
  emits: ["change", "delete"],
  setup(props, context) {
    const boneState = inject("boneState")
    const handlerState = inject("handlerState")
    const addMultipleEntry = inject("addMultipleEntry")
    const removeMultipleEntries = inject("removeMultipleEntries")
    const formatString = inject("formatString")
    const dbStore = useDBStore()
    const state = reactive({
      skels: {},
      openedSelection: false,
      moduleInfo: computed(() => dbStore.getConf(boneState?.bonestructure["module"])),
      hasUsing: computed(() => boneState?.bonestructure["using"])
    })

    function getList(search: String) {
      let params = ""
      if (boneState.bonestructure["type"] === "relational.tree.leaf.file") {
        params = "skelType=leaf&"
      } else if (boneState.bonestructure["type"] === "relational.tree.node.file") {
        params = "skelType=node&"
      }
      let filter = `&search=${search.toLowerCase()}`

      if (!search || search.length < 2) {
        filter = ""
      }

      return Request.get(`/json/${boneState.bonestructure["module"]}/list?${params}limit=99${filter}`).then(
        async (resp) => {
          const data = await resp.json()
          state.skels = data["skellist"].reduce((acc, curr) => ((acc[curr["key"]] = curr), acc), {})

          return data["skellist"]?.map((d: any) => {
            return { text: formatString(boneState.bonestructure["format"], { dest: d }), value: d.key, data: d }
          })
        }
      )
    }
    function openSelector(lang) {
      state.openedSelection = true
    }

    function relationCloseAction(selection) {
      state.openedSelection = false
      if (selection) {
        for (let entry of selection) {
          let relDefault = null
          if (state.hasUsing) {
            relDefault = undefined
          }
          addMultipleEntry(props.lang, { dest: entry, rel: relDefault })
        }
      }
    }

    onMounted(() => {
      if (props.value === null || props.value.length === 0) {
        context.emit("change", props.name, [], props.lang) //init
      }
    })

    return {
      state,
      boneState,
      handlerState,
      addMultipleEntry,
      removeMultipleEntries,
      openSelector,
      getList,
      relationCloseAction
    }
  }
})
</script>

<style scoped>
.actionbar {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

sl-combobox {
  width: 100%;
}

.delete-btn {
  margin-right: var(--sl-spacing-x-small);

  &::part(base) {
    aspect-ratio: 1;
  }
}

.add-btn {
  margin-left: var(--sl-spacing-x-small);

  & sl-icon {
    margin-right: var(--sl-spacing-x-small);
  }
}
</style>
