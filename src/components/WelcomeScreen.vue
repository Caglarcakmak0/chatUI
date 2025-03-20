<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="welcome-image">
        <v-img
          src="https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg"
          width="250"
          aspect-ratio="1"
        ></v-img>
      </div>
      <h1 class="welcome-title">Mobil Cihazınız Bağlı Kalın</h1>
      <div class="welcome-text">
        <p>Mesajlarınızı görmek ve göndermek için soldaki bir sohbeti seçin.</p>
        <p>WhatsApp Web uygulamasını, bilgisayarınızda WhatsApp'ı açmak için kullanabilirsiniz.</p>
      </div>
      <div class="welcome-footer">
        <v-icon color="gray" size="small">mdi-lock</v-icon>
        <span class="encryption-text">Uçtan uca şifreleme ile güvenliğiniz sağlanır</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeScreen'
};
</script>

<style scoped lang="scss">
.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f0f2f5;
  width: 100%;
}

.welcome-content {
  max-width: 560px;
  text-align: center;
}

.welcome-image {
  margin: 0 auto 40px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 300;
  color: #41525d;
  margin-bottom: 20px;
}

.welcome-text {
  color: #667781;
  font-size: 14px;
  margin-bottom: 30px;
  
  p {
    margin-bottom: 10px;
  }
}

.welcome-footer {
  font-size: 14px;
  color: #8696a0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .encryption-text {
    margin-left: 5px;
  }
}
</style> 