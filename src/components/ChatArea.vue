<template>
  <div class="chat-main">
    <!-- Sohbet başlığı -->
    <div class="chat-header">
      <div class="header-left">
        <v-btn v-if="isMobile" icon variant="text" class="back-button" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div class="contact-info" @click="$emit('toggle-profile')">
          <v-avatar size="40">
            <v-img :src="chat.contact.avatar" alt="avatar"></v-img>
          </v-avatar>
          <div class="contact-details">
            <h3 class="contact-name">{{ chat.contact.name }}</h3>
            <span class="contact-status">Çevrimiçi</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <v-btn icon variant="text" @click="showSearch = !showSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon variant="text" class="menu-trigger">
          <v-icon @click="showThreeDots = !showThreeDots">mdi-dots-vertical</v-icon>
        </v-btn>
        <ThreeDots v-model:show="showThreeDots" @menu-action="handleMenuAction" />
      </div>
    </div>
    <div v-if="showSearch" class="search-bar">
      <v-text-field
        v-model="searchValue"
        prepend-inner-icon="mdi-magnify"
        append-inner-icon="mdi-close"
        placeholder="Sohbette ara"
        variant="outlined"
        density="compact"
        hide-details
        class="search-input"
        @click:append-inner="clearSearch"
        @update:model-value="$emit('search-messages', searchValue)"
      ></v-text-field>
      <div v-if="searchTerm" class="search-results">
        <div class="results-count">{{ messages.length }} sonuç bulundu</div>
        <v-btn icon size="small" variant="text" class="nav-btn">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn icon size="small" variant="text" class="nav-btn">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="messages-container" ref="messagesContainer">
      <div class="messages-list">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="message"
          :class="[message.sender === 'me' ? 'sent' : 'received']"
        >
          <div class="message-content">
            <div class="message-text" v-html="highlightText(message.text)"></div>
            <div class="message-meta">
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              <span v-if="message.sender === 'me'" class="message-status">
                <v-icon
                  size="small"
                  :color="message.status === 'read' ? 'primary' : 'grey'"
                >
                  {{ message.status === 'read' ? 'mdi-check-all' : 'mdi-check' }}
                </v-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
        <div class="message-input-container">
      <v-btn icon variant="text">
        <v-icon>mdi-emoticon-outline</v-icon>
      </v-btn>
      <v-btn icon variant="text">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
      <div class="message-input">
        <v-textarea
          v-model="newMessage"
          placeholder="Mesaj yazın"
          rows="1"
          auto-grow
          hide-details
          density="compact"
          class="message-textarea"
          @keydown.enter.prevent="sendMessage"
        ></v-textarea>
      </div>
      <v-btn icon variant="text" @click="sendMessage">
        <v-icon>{{ newMessage.trim() ? 'mdi-send' : 'mdi-microphone' }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import ThreeDots from './ThreeDots.vue';
export default {
  name: 'ChatArea',
  components: {
    ThreeDots
  },
  props: {
    chat: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    searchTerm: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const newMessage = ref('');
    const showSearch = ref(false);
    const showThreeDots = ref(false);
    const searchValue = ref('');
    const messagesContainer = ref(null);
    const goBack = () => {
      emit('back-to-chats');  
      setTimeout(() => {
        const sidebar = document.querySelector('.chat-sidebar');
        if (sidebar) {
          sidebar.classList.remove('hidden');
        }
      }, 100);
    }
    // Arama terimini izle
    watch(() => props.searchTerm, (newVal) => {
      searchValue.value = newVal;
    });
    // Mesaj gönderme
    const sendMessage = () => {
      if (newMessage.value.trim() === '') return;
      
      emit('send-message', newMessage.value);
      newMessage.value = '';   
      // Mesaj gönderildikten sonra mesajların en altına kaydır
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }; 
    const clearSearch = () => {
      searchValue.value = '';
      emit('search-messages', '');
      showSearch.value = false;
    };
    const highlightText = (text) => {
      if (!props.searchTerm) return text;
      
      const regex = new RegExp(`(${props.searchTerm})`, 'gi');
      return text.replace(regex, '<span class="highlight">$1</span>');
    };  
  const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };  
    // Mesajlar güncellendiğinde en alta kaydır
    watch(() => props.messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }, { deep: true });   
    // Menü aksiyonlarını işle
    const handleMenuAction = (action) => {
      switch(action) {
        case 'profile':
          emit('toggle-profile');
          break;
        case 'block':
          emit('block-contact', props.chat.contact.id);
          break;
        case 'report':
          emit('report-contact', props.chat.contact.id);
          break;
        case 'delete':
          emit('delete-chat', props.chat.id);
          break;
      }
    };   
    onMounted(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }    
      if (props.isMobile) {
        const sidebar = document.querySelector('.chat-sidebar');
        if (sidebar) {
          sidebar.classList.add('hidden');
        }
      }
    });

    return {
      newMessage,
      showSearch,
      showThreeDots,
      searchValue,
      messagesContainer,
      sendMessage,
      clearSearch,
      highlightText,
      formatTime,
      goBack,
      handleMenuAction
    };
  }
};
</script>




<style scoped lang="scss">
.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1100;
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #f0f2f5;
  border-left: 1px solid #d1d7db;
  z-index: 2;
  min-height: 60px;
  
  .back-button {
    margin-right: 10px;
  }
}
.header-left {
  display: flex;
  align-items: center;
}

.contact-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.contact-details {
  margin-left: 15px;
}

.contact-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.contact-status {
  font-size: 13px;
  color: #667781;
}

.search-bar {
  display: flex;
  padding: 8px 16 px;
  background-color: #f0f2f5;
  border-bottom: 1px solid #d1d7db;
  align-items: center;
  
  .search-input {
    flex: 1;
  }
  
  .search-results {
    display: flex;
    align-items: center;
    margin-left: 10px;
    font-size: 14px;
    
    .results-count {
      margin-right: 8px;
    }
  }
}
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: calc(100% - 120px); // Adjust based on header + input heights
}

.messages-list {
  display: flex;
  flex-direction: column;
}



.message {
  max-width: 65%;
  &.sent {
    align-self: flex-end;
    .message-content {
      background-color: #dcf8c6;
      border-radius: 8px 0 8px 8px;
    }
  }
  &.received {
    align-self: flex-start; 
    .message-content {
      background-color: white;
      border-radius: 0 8px 8px 8px;
    }
  }
}

.message-content {
  padding: 8px 12px;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
}

.message-text {
  font-size: 14px;
  margin-bottom: 5px;
  white-space: pre-wrap;
  word-break: break-word;
  
  :deep(.highlight) {
    background-color: #ffeb3b;
    border-radius: 2px;
    padding: 0 2px;
  }
}
.message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  color: #667781;
}
.message-time {
  margin-right: 4px;
}
.message-input-container {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #f0f2f5;
  border-top: 1px solid #d1d7db;
  min-height: 60px;
  width: 100%;
}
.message-input {
  flex: 1;
  margin: 0 10px;
  background-color: #f0f2f5;
  border-radius: 2px;
  overflow: hidden;
  max-height: 150px;
  
  .message-textarea {
    
    max-height: 100px;
  }
}
@media (max-width: 768px) {
  .chat-header {
    padding: 8px 12px;
    min-height: 50px;
    border-left: none;
  }
  .back-button {
    margin-right: 5px;
  }
  .contact-info {
    margin-left: 0;
  }
  .message {
    padding: 15px;
    max-height: calc(100% - 110px);
  }
  .message-input-container {
    padding: 8px 12px;
    min-height: 50px;
  }
}
@media (max-width: 480px) {
  .chat-header {
    padding: 6px 8px;
  }
  .contact-details {
    margin-left: 8px;
  }
  .message {
    max-width: 85%;
  }
  .messages-container {
    padding: 10px;
  }
  .message-input-container {
    padding: 6px 8px;
  }
}
</style> 