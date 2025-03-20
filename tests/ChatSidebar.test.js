import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ChatSidebar from '../src/components/ChatSidebar.vue';

// Mock verileri
const mockChats = [
  {
    id: 1,
    contact: {
      id: 1,
      name: "Ahmet Yılmaz",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    unread: 2,
    lastMessage: {
      text: "Merhaba, nasılsın?",
      timestamp: "2023-09-10T14:30:00"
    }
  },
  {
    id: 2,
    contact: {
      id: 2,
      name: "Ayşe Demir",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    unread: 0,
    lastMessage: {
      text: "Raporları inceledim, yarın konuşalım.",
      timestamp: "2023-09-09T16:45:00"
    }
  }
];

describe('ChatSidebar', () => {
  it('should render the component', () => {
    const wrapper = mount(ChatSidebar, {
      props: {
        chats: mockChats,
        selectedChat: null
      },
      global: {
        stubs: ['v-avatar', 'v-img', 'v-icon', 'v-btn', 'v-text-field']
      }
    });
    
    expect(wrapper.exists()).toBe(true);
  });
  
  it('should display the correct number of chat items', () => {
    const wrapper = mount(ChatSidebar, {
      props: {
        chats: mockChats,
        selectedChat: null
      },
      global: {
        stubs: ['v-avatar', 'v-img', 'v-icon', 'v-btn', 'v-text-field']
      }
    });
    
    const chatItems = wrapper.findAll('.chat-item');
    expect(chatItems.length).toBe(mockChats.length);
  });
  
  it('should display the contact name and message preview', () => {
    const wrapper = mount(ChatSidebar, {
      props: {
        chats: mockChats,
        selectedChat: null
      },
      global: {
        stubs: ['v-avatar', 'v-img', 'v-icon', 'v-btn', 'v-text-field']
      }
    });
    
    const firstChatItem = wrapper.findAll('.chat-item')[0];
    const contactName = firstChatItem.find('.chat-name').text();
    const messagePreview = firstChatItem.find('.message-preview').text();
    
    expect(contactName).toBe('Ahmet Yılmaz');
    expect(messagePreview).toBe('Merhaba, nasılsın?');
  });
  
  it('should filter chats when searching', async () => {
    const wrapper = mount(ChatSidebar, {
      props: {
        chats: mockChats,
        selectedChat: null
      },
      global: {
        stubs: ['v-avatar', 'v-img', 'v-icon', 'v-btn', 'v-text-field']
      }
    });
    
    // searchQuery değerini Ayşe olarak değiştiriyoruz
    await wrapper.setData({ searchQuery: 'Ayşe' });
    
    // Vue'nun DOM'u güncellemesi için bekleyelim
    await wrapper.vm.$nextTick();
    
    // Sadece Ayşe ile eşleşen sohbet gösterilmeli
    const chatItems = wrapper.findAll('.chat-item');
    expect(chatItems.length).toBe(1);
    
    const contactName = chatItems[0].find('.chat-name').text();
    expect(contactName).toBe('Ayşe Demir');
  });
  
  it('should emit select-chat event when clicking on a chat', async () => {
    const wrapper = mount(ChatSidebar, {
      props: {
        chats: mockChats,
        selectedChat: null
      },
      global: {
        stubs: ['v-avatar', 'v-img', 'v-icon', 'v-btn', 'v-text-field']
      }
    });
    
    const firstChatItem = wrapper.findAll('.chat-item')[0];
    await firstChatItem.trigger('click');
    
    // select-chat olayı tetiklenmeli ve doğru veri gönderilmeli
    expect(wrapper.emitted('select-chat')).toBeTruthy();
    expect(wrapper.emitted('select-chat')[0][0]).toEqual(mockChats[0]);
  });
}); 