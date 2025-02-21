<template>
  <sl-button
    variant="danger"
    size="small"
    :disabled="!state.active || !state.canDelete"
    :title="$t('actions.delete')"
    @click="openDeletePopup"
  >
    <sl-icon
      slot="prefix"
      name="trash"
    ></sl-icon>
  </sl-button>

  <teleport
    v-if="state.opened"
    to="#dialogs"
    :disabled="!state.opened"
  >
    <sl-dialog
      id="dialog-delete"
      :open="state.opened"
      :label="$t('actions.delete.text')"
    >
      {{ $t("actions.delete.msg", { amount: state.count })
      }}<!--TODO Translate-->
      <sl-button
        slot="footer"
        variant="primary"
        :title="$t('actions.delete')"
        @click="deleteEntries"
      >
        {{ $t("actions.delete.text") }}
      </sl-button>
    </sl-dialog>
  </teleport>
</template>

<script lang="ts">
//@ts-nocheck
import { reactive, defineComponent, inject, computed } from "vue"
import { Request } from "@viur/vue-utils"
import { useMessageStore } from "../stores/message"
import { useDBStore } from "../stores/db"
import { useRoute } from "vue-router"
import { useUserStore } from "../stores/user"

export default defineComponent({
  props: {},
  components: {},
  setup(props, context) {
    const handlerState: any = inject("handlerState")
    const tableReload: any = inject("reloadAction")
    const messageStore = useMessageStore()
    const userStore = useUserStore()
    const route = useRoute()
    const state = reactive({
      active: computed(() => {
        return handlerState.currentSelection && handlerState.currentSelection.length > 0
      }),
      count: computed(() => {
        if (handlerState.currentSelection) {
          return handlerState.currentSelection.length
        }
        return 0
      }),
      canDelete: computed(() => {
        if (userStore.state.user.access.indexOf("root") !== -1) {
          return true
        }
        return userStore.state.user.access.indexOf(`${handlerState.module}-delete`) > -1
      }),
      opened: false
    })

    async function deleteEntries() {
      state.opened = false

      for (const entry of handlerState.currentSelection) {
        let url = `/vi/${handlerState.module}/delete`
        let dataObj = { key: entry.key }
        if (handlerState.type === "hierarchyhandler" || handlerState.type === "treehandler") {
          dataObj["skelType"] = handlerState?.currentSelectionType
        }

        await Request.securePost(url, { dataObj: dataObj })
      }
      messageStore.addMessage("success", `Delete`, "Entry deleted successfully")
      tableReload()
    }

    function openDeletePopup() {
      state.opened = true
    }

    return { state, deleteEntries, openDeletePopup }
  }
})
</script>

<style scoped></style>
