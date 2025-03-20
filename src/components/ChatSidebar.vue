<template>
  <div class="chat-sidebar">
    <!-- Başlık ve arama -->
    <div class="sidebar-header ">
      <div class="user-avatar">
        <v-avatar size="40" color="green">
          <v-icon icon="mdi-account"></v-icon>
        </v-avatar>
      </div>
      <div class="header-actions">
        <v-btn icon variant="text">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
        <v-btn icon variant="text">
          <v-icon>mdi-message-outline</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Arama kutusu -->
    <div class="sidebar-search">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Sohbetlerde ara"
        variant="outlined"
        density="compact"
        hide-details
        class="search-input"
      ></v-text-field>
    </div>



    <!-- Sohbet listesi -->
    <div class="chats-list">
      <div
        v-for="chat in filteredChats"
        :key="chat.id"
        class="chat-item"
        :class="{ 'selected': selectedChat && selectedChat.id === chat.id }"
        @click="onChatSelect(chat)"
      >
        <div class="avatar">
          <v-avatar size="50">
            <v-img :src="chat.contact.avatar" alt="avatar"></v-img>
            <span v-if="chat.unread" class="unread-badge">{{ chat.unread }}</span>
          </v-avatar>
        </div>
        <div class="chat-details">
          <div class="chat-header">
            <h3 class="chat-name">{{ chat.contact.name }}</h3>
            <span class="chat-time">{{ formatTime(chat.lastMessage.timestamp) }}</span>
          </div>
          <div class="chat-message">
            <p class="message-preview">{{ chat.lastMessage.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ChatSidebar',
  props: {
    chats: {
      type: Array,
      required: true
    },
    selectedChat: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const searchQuery = ref('');
    
    // Arama filtrelemesi
    const filteredChats = computed(() => {
      if (!searchQuery.value) return props.chats;
      
      const query = searchQuery.value.toLowerCase();
      return props.chats.filter(chat => {
        return chat.contact.name.toLowerCase().includes(query) || 
               chat.lastMessage.text.toLowerCase().includes(query);
      });
    });
    const onChatSelect = (chat) => {
      emit('select-chat', chat);
      
      if (window.innerWidth < 768) {
        setTimeout(() => {
          const sidebar = document.querySelector('.chat-sidebar');
          if (sidebar) {
            sidebar.classList.add('hidden');
          }
        }, 250); //gecikme
      }
    };
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    };
    return {
      searchQuery,
      filteredChats,
      onChatSelect,
      formatTime
    };
  }
};
</script>

<style scoped lang="scss">
.chat-sidebar {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-width: 280px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    
    &.hidden {
      display: none !important;
    }
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #f0f2f5;
  min-height: 60px;
}

.header-actions {
  display: flex;
}

.sidebar-search {
  padding: 8px 12px;
  background-color: #f0f2f5;
  
  .search-input {
    background-color: white;
  }
}

.chats-list {
  overflow-y: auto;
  flex: 1;
  height: calc(100% - 100px);
  }

.chat-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.selected {
    background-color: #ebebeb;
  }
  
  @media (max-width: 768px) {
    &:active, &:hover {
      background-color: #ebebeb;
    }
  }
}

.avatar {
  margin-right: 15px;
  position: relative;
  
  .unread-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #25D366;
    color: white;
    font-size: 12px;
    min-width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
}

.chat-details {
  flex: 1;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.chat-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.chat-time {
  font-size: 12px;
  color: #667781;
}

.message-preview {
  margin: 0;
  font-size: 14px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 992px) {
  .chat-item {
    padding: 10px 12px;
  } 
  .chat-name {
    font-size: 15px;
  }
  .message-preview {
    font-size: 13px;
  }
  .avatar {
    margin-right: 10px;
  }
  .chats-list {
    height: calc(100% - 100px);
  }
}

@media (max-width: 768px) {
  .sidebar-header {
    min-height: 50px;
    padding: 8px 12px;
  }
  .sidebar-search {
    padding: 6px 8px;
  }
  .chats-list {
    height: calc(100% - 100px);
  }
  
  .chat-item {
    padding: 12px 16px;
    -webkit-tap-highlight-color: transparent;
    
    &:active {
      background-color: #ebebeb;
    }
  }
}

@media (max-width: 480px) {
  .chat-item {
    padding: 10px 12px;
  }
  .chat-name {
    font-size: 14px;
  }
  .message-preview {
    font-size: 12px;
  }
}
</style> 