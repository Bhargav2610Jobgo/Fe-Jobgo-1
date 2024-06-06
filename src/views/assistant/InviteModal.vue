<template>
    <div>
    <hp-modal class="invite-modal invite" style="width: 55%;" :isOpen="isInviteModalVisible"
        @close="isInviteModalVisible = false">
        <generic-modal class="" title="Invite" subtitle="Invite other people in conversation">
            <div class=" invite__container" v-for="(item, index) of users">
                <div style="display: flex;justify-content:space-between;align-items: center;">
                    <div class="invite__container_input">
                        <input ref="username" style="margin-right: 10px;" :class="`username${index}`"
                            v-isInviteModalVisible="item.userName" name="username" placeholder="Enter your username" label="username"
                            type="text" />
                        <div v-if="item.userNameError" class="error">{{ item.userNameError }}
                        </div>
                    </div>
                    <div class="invite__container_input">
                        <input ref="email" name="email" placeholder="Enter your email" label="email"
                            :class="`email${index}`" type="text" v-isInviteModalVisible="item.email" />
                        <div v-if="item.emailError" class="error">{{ item.emailError }}
                        </div>
                    </div>
                </div>
                <div>

                    <div style="display: flex;justify-content:space-between;align-items: center; margin-bottom: 15px;">
                        <hp-icon v-if="index + 1 == users.length" @click="addRow" class="invite_icon"
                            style="display: cursor !important;" name="plus"></hp-icon>
                        <hp-icon @click="deleteRow(index)" v-if="index != 0" class="invite_icon"
                            style="display: cursor !important" name="delete"></hp-icon>
                    </div>
                </div>
            </div>
            <template #actions>
                <hp-button label="Send Invite" @handleClick="sendInvite">
                </hp-button>
                <!-- <hp-button
            :to="`/reports/${candidate.key}`"
            label="Visit report"
            icon="share"
          >
          </hp-button> -->
            </template>
        </generic-modal>
    </hp-modal>
    </div>
</template>

<script setup>
//vendor
import GenericModal from "@/components/modals/generic-modal.vue";
import HpModal from "@/components/hp-modal.vue";
import { ref, onMounted } from "vue";
import { usePost, useGet } from "@/composables/useHttp";
import HpIcon from "@/components/hp-icon.vue";
import HpButton from "@/components/hp-button.vue";

const props=defineProps({
    isInviteModalVisible: Boolean
})
//state
const users = ref([{
    userName: null,
    userNameError: null,
    email: null,
    emailError: null,
}])
const addRow = (() => {
    users.value.push({
        userName: "",
        email: "",
    })
})


//methods
const sendInvite = async () => {
    users.value.forEach((user, index) => {
        console.log("user", user);
        user.userNameError = null
        user.emailError = null
    })
    for (let index = 0; index < users.value.length; index++) {
        const user = users.value[index];
        console.log("user12")
        if (!user.userName) {
            user.userNameError = "User Name is required"
            const inputElement = document.querySelector(`.username${index}`);
            inputElement.focus();
            return
        }
        if (!user.email) {
            user.emailError = "Email is required"
            const inputElement = document.querySelector(`.email${index}`);
            inputElement.focus();
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            user.emailError = "Email is invalid"
            const inputElement = document.querySelector(`.email${index}`);
            inputElement.focus();
            return
        }
    }
    const userNamesAndEmails = users.value.map(user => {
        console.log(user)
        return { userName: user.userName, email: user.email };
    });


    const body = {
        room: roomId.value,
        thread: threadId.value,
        users: userNamesAndEmails
    }
    const sendInvite = usePost("chat/invite");
    await sendInvite.post(body);

    setToast({
        type: "positive",
        title: "Success!",
        message: "Invite Successfully",
    });
  // ?  isInviteModalVisible.value = false
    users.value = [{
        userName: "",
        email: "",
    }]
}
const deleteRow = ((index) => {
    users.value.splice(index, 1)
})
</script>

<style lang="scss" scoped>
.invite {
    &__container {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &_input {
            display: flex;
            flex-direction: column;
            height: 60px;

            input {
                outline: none !important;

                border: 2px solid grey !important;
                padding: 8px;
                border-radius: 10px;
                background-color: transparent !important;
                color: white;
                margin-top: 10px;


            }

            .error {
                color: red;
                padding-left: 15px;
                padding-top: 2px;
                font-size: 1rem
            }


        }
    }

    &_icon {
        cursor: pointer;
    }


}
</style>