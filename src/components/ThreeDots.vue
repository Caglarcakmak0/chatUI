<template>
  <div class="three-dots-menu" v-if="show">
    <ul class="menu-list">
      <li class="menu-item" @click="handleAction('profile')">Kişi Bilgisi</li>
      <li class="menu-item" @click="handleAction('block')">Engelle</li>
      <li class="menu-item" @click="handleAction('report')">Şikayet Et</li>
      <li class="menu-item" @click="handleAction('delete')">Sohbeti Sil</li>
    </ul>
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
    }
  },
  setup(props, { emit }) {
    const handleAction = (action) => {
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
      handleAction
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
  border-radius: 4px;
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