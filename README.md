# Offline Mesajlaşma Arayüzü

Bu proje, Vue.js 3 ve Vuetify kullanılarak geliştirilmiş bir offline mesajlaşma arayüzüdür. WhatsApp benzeri bir kullanıcı deneyimi sağlayan bu uygulama, responsive tasarımı ile farklı cihazlarda sorunsuz çalışır.

## Özellikler

- **Sohbet Listesi**: Kullanıcılar tüm sohbetlerini görüntüleyebilir ve arama yapabilir
- **Mesajlaşma**: Kullanıcılar mesaj gönderebilir ve alabilir
- **Profil Bilgileri**: Kişilerin profil bilgilerini, ortak gruplarını ve medyalarını görüntüleme
- **Mesaj Arama**: Sohbet içinde arama yapma ve sonuçları vurgulama
- **Responsive Tasarım**: Mobil, tablet ve masaüstü görünümleri destekler

## Kullanılan Teknolojiler

- Vue.js 3 (Composition API)
- Vuetify 3
- SCSS
- Vite
- Vitest (Test için)

## Kurulum

Projeyi yerel makinenizde çalıştırmak için:

```bash
# Depoyu klonlayın
git clone https://github.com/username/chatappui.git
cd chatappui

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Proje Yapısı

```
src/
├── assets/         # Stiller ve resimler
├── components/     # Vue bileşenleri
│   ├── ChatSidebar.vue    # Sohbet listesi
│   ├── ChatArea.vue       # Mesajlaşma alanı
│   ├── ProfilePanel.vue   # Profil bilgileri paneli
│   └── WelcomeScreen.vue  # Karşılama ekranı
├── utils/          # Yardımcı fonksiyonlar
│   └── mockData.js # Sahte veri oluşturucu
├── App.vue         # Ana uygulama bileşeni
└── main.js         # Uygulama giriş noktası
```

## Testler

Testleri çalıştırmak için:

```bash
# Tek seferlik test çalıştırma
npm run test

# İzleme modunda test çalıştırma
npm run test:watch

# Test kapsama raporu
npm run test:coverage
```

## Notlar

- Bu uygulama sadece frontend tarafını içermektedir ve gerçek bir backend bağlantısı yoktur.
- Veriler, uygulamanın her başlatılışında yeniden oluşturulan mock verilerdir.
- WhatsApp Web uygulaması referans alınarak tasarlanmıştır.
