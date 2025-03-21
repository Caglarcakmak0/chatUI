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
            <span class="contact-status">Çevrim içi</span>
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
        <template v-for="(messageGroup, date) in groupedMessages" :key="date">
          <div class="date-batch-wrapper">
            <div class="date-batch">
              {{ formatDateBatch(date) }}
            </div>
          </div>
          <div 
            v-for="message in messageGroup" 
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
        </template>
      </div>
    </div>
    <div class="message-input-container">
      <v-btn icon variant="text" @click="toggleEmojiPicker">
        <v-icon>mdi-emoticon-outline</v-icon>
      </v-btn>
      <div class="emoji-picker-wrapper" :class="{ show: showEmojiPicker }">
        <div v-if="showEmojiPicker" class="picker-container">
          <VEmojiPicker @select="onEmojiSelect" />
        </div>
      </div>
      <v-btn icon variant="text" class="attachment-trigger" @click="showAttachmentMenu = !showAttachmentMenu">
        <v-icon>mdi-paperclip</v-icon>
      </v-btn>
      <AttachmentMenu v-model:show="showAttachmentMenu" @attachment-action="handleAttachmentAction" />
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
import AttachmentMenu from './AttachmentMenu.vue';
import VEmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

export default {
  name: 'ChatArea',
  components: {
    ThreeDots,
    AttachmentMenu,
    VEmojiPicker
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
    const showAttachmentMenu = ref(false);
    const searchValue = ref('');
    const messagesContainer = ref(null);
    const showEmojiPicker = ref(false);
    
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
    const sendMessage = () => {
      if (newMessage.value.trim() === '') return;
      
      emit('send-message', newMessage.value);
      newMessage.value = '';   
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
    watch(() => props.messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }, { deep: true });   
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
    
    const handleAttachmentAction = (action) => {
      // Eklenti eylemlerini işle
      console.log(`Eklenti eylemi: ${action}`);
      switch(action) {
        case 'photo':
          // Fotoğraf/video galerisi göster
          emit('show-media-gallery');
          break;
        case 'camera':
          // Kamerayı aç
          emit('open-camera');
          break;
        case 'document':
          // Belge seçiciyi aç
          emit('open-document-picker');
          break;
        case 'contact':
          // Kişi seçiciyi aç
          emit('open-contact-picker');
          break;
        case 'poll':
          // Anket oluşturucuyu aç
          emit('create-poll');
          break;
        case 'drawing':
          // Çizim alanını aç
          emit('open-drawing');
          break;
      }
    };
    
    const onEmojiSelect = (emoji) => {
      console.log('Emoji seçildi:', emoji);
      // Emoji nesnesinden unicode karakterini alıyoruz
      if (typeof emoji === 'object' && emoji.data) {
        newMessage.value += emoji.data;
      } else if (typeof emoji === 'object' && emoji.i) {
        newMessage.value += emoji.i;
      } else if (typeof emoji === 'string') {
        newMessage.value += emoji;
      }
      showEmojiPicker.value = false;
    };
    
    const toggleEmojiPicker = () => {
      console.log('Emoji picker toggle:', !showEmojiPicker.value);
      showEmojiPicker.value = !showEmojiPicker.value;
    };
    
    const groupedMessages = computed(() => {
      const groups = {};
      
      props.messages.forEach(message => {
        const date = new Date(message.timestamp);
        const dateKey = date.toDateString(); // Her gün için benzersiz bir anahtar
        
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        
        groups[dateKey].push(message);
      });
      
      return groups;
    });

    const formatDateBatch = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Bugün';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Dün';
      } else {
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
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
      showAttachmentMenu,
      searchValue,
      messagesContainer,
      sendMessage,
      clearSearch,
      highlightText,
      formatTime,
      goBack,
      handleMenuAction,
      handleAttachmentAction,
      showEmojiPicker,
      toggleEmojiPicker,
      onEmojiSelect,
      formatDateBatch,
      groupedMessages
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
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: calc(100% - 120px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/bg.png');
    background-repeat: repeat;
    opacity: 0.5;
    z-index: 0;
  }

  .messages-list {
    position: relative;
    z-index: 1;
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
}

.message.received:after {
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
}
.message {
  max-width: 65%;
  &.sent {
    align-self: flex-end;
    .message-content {
      background-color: #dcf8c6;
      border-radius: 8px 8px 0px 8px;
      padding: 0.3rem 0.6rem 0.2rem 1rem;
    display: flex;
    gap: 1rem;

    }
  }
  &.received {
    align-self: flex-start; 
    .message-content {
      background-color: white;
      border-radius: 8px 8px 8px 0px;
      padding: 0.3rem 0.6rem 0.2rem 1rem;
    display: flex;
    gap: 1rem;
    }
  }
}

.message-content {
  padding: 8px 12px;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
}
.message.sent:after {
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
  position: relative;
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
    padding: 1px;
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
.emoji-picker-wrapper {
  position: absolute;
  bottom: 70px;
  left: 10px;
  z-index: 9999;
  display: none;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  padding: 8px;

  &.show {
    display: block;
  }

  .picker-container {
    width: 320px;
    
    :deep(.v3-emoji-picker) {
      width: 100% !important;
      border: none !important;
      box-shadow: none !important;
    }
  }

  @media (max-width: 768px) {
    left: 0;
    right: 0;
    bottom: 60px;
    width: 100%;
    border-radius: 12px 12px 0 0;
    
    .picker-container {
      width: 100%;
    }
  }
}
.date-batch-wrapper {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 8px 0;
  background: transparent;
}

.date-batch {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #5bb5ff;
  color: white;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow:0 7px 9.5px rgba(0, 0, 0, 0.13);
}
</style> 