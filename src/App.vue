<template>
  <v-app class="chat-application">
    <v-main>
      <div class="chat-container">
        <!-- Sol taraftaki sohbet listesi -->
        <chat-sidebar 
          :chats="chats"
          :selectedChat="selectedChat"
          @select-chat="selectChat"
          :class="{ 'mobile-hidden': isMobile && selectedChat }"
        />
        <!-- Orta kısım - mesajlaşma alanı -->
        <chat-area 
          v-if="selectedChat"
          :chat="selectedChat"
          :messages="filteredMessages"
          :searchTerm="searchTerm"
          :isMobile="isMobile"
          @back-to-chats="backToChats"
          @toggle-profile="toggleProfile"
          @send-message="sendMessage"
          @search-messages="searchMessages"
          class="chat-area-component"
        />
        <welcome-screen v-else />
        <!-- Sağ taraftaki profil paneli -->
        <profile-panel 
          v-if="selectedChat"
          :profile="selectedChat.contact"
          :isOpen="isProfileOpen"
          @close="closeProfile"
        />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import ChatSidebar from './components/ChatSidebar.vue';
import ChatArea from './components/ChatArea.vue';
import ProfilePanel from './components/ProfilePanel.vue';
import WelcomeScreen from './components/WelcomeScreen.vue';
import { DummyData,  } from './utils/mockData';

export default {
  name: 'App',
  components: {
    ChatSidebar,
    ChatArea,
    ProfilePanel,
    WelcomeScreen
  },
  setup() {
    const mockData = DummyData();
    
    const chats = ref(mockData.chats);
    const selectedChat = ref(null);
    const isProfileOpen = ref(false);
    const searchTerm = ref('');
    const isMobile = ref(window.innerWidth < 768);
    
    const filteredMessages = computed(() => {
      if (!selectedChat.value) return [];
      
      if (!searchTerm.value) return selectedChat.value.messages;
      
      return selectedChat.value.messages.filter(message => 
        message.text.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });
    
    const selectChat = (chat) => {
      selectedChat.value = chat;
      searchTerm.value = '';
      
      if (isMobile.value) {
        const chatArea = document.querySelector('.chat-area-component');
        if (chatArea) {
          chatArea.style.display = 'flex';
        }
      }
    };
    const toggleProfile = () => {
      isProfileOpen.value = !isProfileOpen.value;
    };
    
    const closeProfile = () => {
      isProfileOpen.value = false;
    };   
    const backToChats = () => {
      if (isMobile.value) {
        selectedChat.value = null;
        
        const chatArea = document.querySelector('.chat-area-component');
        const sidebar = document.querySelector('.chat-sidebar');
        
        if (chatArea) {
          chatArea.style.display = 'none';
        }
        
        if (sidebar) {
          sidebar.classList.remove('hidden', 'mobile-hidden');
          sidebar.style.display = 'flex';
        }
      }
    };
    const searchMessages = (term) => {
      searchTerm.value = term;
    };
    const sendMessage = (text) => {
      if (!text.trim() || !selectedChat.value) return;
      
      const newMessage = {
        id: Date.now(),
        text,
        timestamp: new Date().toISOString(),
        sender: 'me',
        status: 'sent'
      };
      
      selectedChat.value.messages.push(newMessage);
      
      // Son mesajı güncelle
      selectedChat.value.lastMessage = {
        text,
        timestamp: new Date().toISOString()
      };
    };
    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 768;
    };
    const resizeHandler = () => {
      checkScreenSize();
    };
    onMounted(() => {
      window.addEventListener('resize', resizeHandler);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandler);
    });
    return {
      chats,
      selectedChat,
      isProfileOpen,
      searchTerm,
      isMobile,
      filteredMessages,
      selectChat,
      toggleProfile,
      closeProfile,
      backToChats,
      searchMessages,
      sendMessage
    };
  }
};
</script>
<style scoped lang="scss">
.chat-application {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.chat-container {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.mobile-hidden {
  @media (max-width: 768px) {
    display: none !important;
  }
}
:deep(.v-application__wrap) {
  min-height: 100vh;
  height: 100%;
}
:deep(.v-main) {
  height: 100vh;
  overflow: hidden;
}
:deep(.v-main__wrap) {
  height: 100%;
}
</style>
