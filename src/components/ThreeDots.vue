<template>
  <div class="three-dots-menu" v-if="show">
    <ul class="menu-list">
      <li class="menu-item" @click="handleAction('profile')">Kişi Bilgisi</li>
      <li class="menu-item" @click="handleAction('block')">
        {{ isBlocked ? 'Engeli Kaldır' : 'Engelle' }}
      </li>
      <li class="menu-item" @click="handleAction('report')">Şikayet Et</li>
      <li class="menu-item" @click="handleAction('delete')">Sohbeti Sil</li>
    </ul>
    
    <!-- Engelleme Bildirimi -->
    <v-snackbar
      v-model="showBlockNotification"
      :timeout="3000"
      color="success"
      location="top"
    >
      {{ blockNotificationText }}
    </v-snackbar>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
export default {
  name: 'ThreeDots',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    contact: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const isBlocked = ref(false);
    const showBlockNotification = ref(false);
    const blockNotificationText = ref('');

    const handleAction = (action) => {
      if (action === 'block') {
        isBlocked.value = !isBlocked.value;
        blockNotificationText.value = isBlocked.value
          ? `${props.contact.name} kişisi engellendi. Bu kişi artık size mesaj gönderemez.`
          : `${props.contact.name} kişisinin engeli kaldırıldı.`;
        showBlockNotification.value = true;
        emit('block-contact', { contactId: props.contact.id, blocked: isBlocked.value });
      }
      emit('menu-action', action);
      emit('update:show', false); //menü otomatikkapanır
    };

    const handleClickOutside = (event) => {
      if (props.show && !event.target.closest('.three-dots-menu') && !event.target.closest('.menu-trigger')) {
        emit('update:show', false);
      }
    };
    onMounted(() => {   
      document.addEventListener('click', handleClickOutside);//dışarı tıklanmafonksiyonu
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    return {
      handleAction,
      isBlocked,
      showBlockNotification,
      blockNotificationText
    };
  }
};
</script>
<style scoped lang="scss">
.three-dots-menu {
  position: absolute;
  top: 50px;
  right: 10px;
  width: 180px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .menu-item {
    padding: 12px 16px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
    &:active {
      background-color: #e0e0e0;
    }
  }
}
</style>