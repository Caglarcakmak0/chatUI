<template>
  <div class="attachment-menu" v-if="show">
    <ul class="menu-list">
      <li class="menu-item" @click="handleAction('photo')">
        <v-icon class="menu-icon">mdi-image</v-icon>
        Medya
      </li>
      <li class="menu-item" @click="handleAction('camera')">
        <v-icon class="menu-icon">mdi-camera</v-icon>
        Kamera
      </li>
      <li class="menu-item" @click="handleAction('document')">
        <v-icon class="menu-icon">mdi-file-document-outline</v-icon>
        Belge
      </li>
      <li class="menu-item" @click="handleAction('contact')">
        <v-icon class="menu-icon">mdi-account</v-icon>
        Kişi
      </li>
      <li class="menu-item" @click="handleAction('poll')">
        <v-icon class="menu-icon">mdi-poll</v-icon>
        Anket
      </li>
      <li class="menu-item" @click="handleAction('drawing')">
        <v-icon class="menu-icon">mdi-draw</v-icon>
        Çizim
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue';

export default {
  name: 'AttachmentMenu',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    const handleAction = (action) => {
      emit('attachment-action', action);
      emit('update:show', false); // Menüyü otomatik kapat
    };

    const handleClickOutside = (event) => {
      if (props.show && 
          !event.target.closest('.attachment-menu') && 
          !event.target.closest('.attachment-trigger')) {
        emit('update:show', false);
      }
    };
    
    onMounted(() => {   
      document.addEventListener('click', handleClickOutside); // Dışarı tıklanma fonksiyonu
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      handleAction
    };
  }
};
</script>

<style scoped lang="scss">
.attachment-menu {
  position: absolute;
  bottom: 70px;
  left: 10px;
  width: 200px;
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
    display: flex;
    align-items: center;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }
    
    &:active {
      background-color: #e0e0e0;
    }
  }
  
  .menu-icon {
    margin-right: 12px;
    font-size: 20px;
  }
}
</style> 