<template>
  <div class="profile-panel" :class="{ 'open': isOpen }">
    <div class="panel-header">
      <v-btn icon variant="text" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <h2 class="panel-title">Kişi Bilgileri</h2>
    </div>
    
    <div class="panel-content">
      <!-- Profil bilgileri -->
      <div class="profile-info">
        <div class="profile-avatar">
          <v-avatar size="150">
            <v-img :src="profile.avatar" alt="Profil" />
          </v-avatar>
        </div>
        <h3 class="profile-name">{{ profile.name }}</h3>
        <p class="profile-phone">{{ profile.phone }}</p>
      </div>
      
      <!-- Hakkında bilgisi -->
      <div class="profile-section">
        <div class="section-header">
          <h4 class="section-title">Hakkında</h4>
        </div>
        <p class="section-content status-text">{{ profile.status }}</p>
      </div>
      
      <!-- Medya bölümü -->
      <div class="profile-section">
        <div class="section-header">
          <h4 class="section-title">Medya, Bağlantılar ve Belgeler</h4>
          <v-btn variant="text" density="comfortable" class="section-action">
            {{ profile.media.length }} <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <div class="media-grid" v-if="profile.media.length > 0">
          <div v-for="media in displayedMedia" :key="media.id" class="media-item">
            <v-img
              :src="media.url"
              aspect-ratio="1"
              cover
              class="media-image"
            ></v-img>
          </div>
        </div>
        <p v-else class="no-media">Medya yok</p>
      </div>
      
      <!-- Ortak gruplar -->
      <div class="profile-section">
        <div class="section-header">
          <h4 class="section-title">Ortak gruplar</h4>
          <v-btn variant="text" density="comfortable" class="section-action">
            {{ profile.commonGroups.length }} <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <div class="groups-list">
          <div v-for="group in profile.commonGroups" :key="group.id" class="group-item">
            <v-avatar size="50" color="primary" class="group-avatar">
              <v-icon size="large" color="white">mdi-account-group</v-icon>
            </v-avatar>
            <div class="group-details">
              <h5 class="group-name">{{ group.name }}</h5>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Eylemler -->
      <div class="profile-actions">
        <v-btn color="error" prepend-icon="mdi-block-helper" block @click="handleBlock">
          {{ profile.name }} kişisi {{ isBlocked ? 'engelli' : 'engelle' }}
        </v-btn>
        <v-btn color="error" prepend-icon="mdi-alert" class="mt-2" block>
          {{ profile.name }} kişisini bildir
        </v-btn>
      </div>

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
  </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  name: 'ProfilePanel',
  props: {
    profile: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const isBlocked = ref(false);
    const showBlockNotification = ref(false);
    const blockNotificationText = ref('');

    // En fazla 3 medya göster
    const displayedMedia = computed(() => {
      return props.profile.media.slice(0, 3);
    });

    const handleBlock = () => {
      isBlocked.value = !isBlocked.value;
      blockNotificationText.value = isBlocked.value
        ? `${props.profile.name} kişisi engellendi. Bu kişi artık size mesaj gönderemez.`
        : `${props.profile.name} kişisinin engeli kaldırıldı.`;
      showBlockNotification.value = true;
      emit('block-contact', { contactId: props.profile.id, blocked: isBlocked.value });
    };
    
    return {
      displayedMedia,
      isBlocked,
      showBlockNotification,
      blockNotificationText,
      handleBlock
    };
  }
};
</script>

<style scoped lang="scss">
.profile-panel {
  background-color: white;
  height: 100%;
  width: 360px;
  position: absolute;
  top: 0;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1200;
  &.open {
    transform: translateX(0);
  }
  @media (max-width: 992px) {
    width: 350px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
}
.panel-header {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #008069;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}
.panel-title {
  margin-left: 15px;
  font-size: 19px;
  font-weight: 500;
}
.panel-content {
  padding: 20px;
}
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}
.profile-avatar {
  margin-bottom: 15px;
}
.profile-name {
  margin: 10px 0 5px;
  font-size: 22px;
  font-weight: 500;
}

.profile-phone {
  margin: 0;
  color: #667781;
  font-size: 14px;
}

.profile-section {
  margin-bottom: 25px;
  border-bottom: 1px solid #f0f2f5;
  padding-bottom: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #008069;
}

.section-content {
  margin: 0;
  font-size: 14px;
}
.status-text {
  color: #3b4a54;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
  margin-bottom: 10px;
}
.media-item {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.no-media {
  color: #667781;
  font-size: 14px;
  text-align: center;
  margin: 20px 0;
}
.groups-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.group-item {
  display: flex;
  align-items: center;
}

.group-avatar {
  margin-right: 15px;
}
.group-name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.profile-actions {
  margin-top: 30px;
  width: 100%;
}

.section-action {
  color: #667781;
  font-size: 14px;
}

@media (max-width: 768px) {
  .panel-header {
    padding: 10px;
  }
  .panel-content {
    padding: 15px;
  }
  .profile-avatar {
    margin-bottom: 10px;
  }
  .profile-info {
    margin-bottom: 20px;
  }
}
@media (max-width: 480px) {
  .panel-header {
    padding: 8px;
  } 
.panel-content {
    padding: 12px;
  }
  .profile-section {
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
}
</style> 