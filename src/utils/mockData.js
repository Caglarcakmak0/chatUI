// Mock data generator for chats and contacts
export function DummyData() {
  // Ortak gruplar için veri
  const commonGroups = [
    { id: 1, name: "Arkadaşlar Grubu" },
    { id: 2, name: "İş Arkadaşları" },
    { id: 3, name: "Aile" },
    { id: 4, name: "Okul Arkadaşları" }
  ];
  
  // Kişiler listesi
  const contacts = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      phone: "+90 555 123 4567",
      status: "Merhaba, ben WhatsApp kullanıyorum!",
      commonGroups: [commonGroups[0], commonGroups[1]],
      media: [
        { id: 1, type: "image", url: "https://picsum.photos/id/237/200/300", date: "2023-05-15" },
        { id: 2, type: "image", url: "https://picsum.photos/id/238/200/300", date: "2023-05-10" }
      ]
    },
    {
      id: 2,
      name: "Ayşe Demir",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      phone: "+90 555 987 6543",
      status: "Toplantıdayım, sonra dönerim.",
      commonGroups: [commonGroups[1]],
      media: [
        { id: 3, type: "image", url: "https://picsum.photos/id/239/200/300", date: "2023-06-15" }
      ]
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      phone: "+90 555 456 7890",
      status: "Sadece acil durumlar için arayın!",
      commonGroups: [commonGroups[0], commonGroups[2]],
      media: []
    },
    {
      id: 4,
      name: "Zeynep Yıldız",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      phone: "+90 555 234 5678",
      status: "Hayat kısa, kuşlar uçuyor ✨",
      commonGroups: [commonGroups[3]],
      media: [
        { id: 4, type: "image", url: "https://picsum.photos/id/240/200/300", date: "2023-07-05" },
        { id: 5, type: "image", url: "https://picsum.photos/id/241/200/300", date: "2023-07-01" }
      ]
    },
    {
      id: 5,
      name: "Can Öztürk",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      phone: "+90 555 345 6789",
      status: "Geziyorum 🌍",
      commonGroups: [commonGroups[0], commonGroups[3]],
      media: [
        { id: 6, type: "image", url: "https://picsum.photos/id/242/200/300", date: "2023-08-12" }
      ]
    }
  ];
  
  // Sohbetler ve mesajlar
  const chats = [
    {
      id: 1,
      contact: contacts[0],
      unread: 2,
      lastMessage: {
        text: "Yarın buluşacak mıyız?",
        timestamp: "2023-09-10T14:30:00"
      },
      messages: [
        {
          id: 1,
          text: "Merhaba, nasılsın?",
          timestamp: "2023-09-10T10:00:00",
          sender: "contact",
          status: "read"
        },
        {
          id: 2,
          text: "İyiyim, sen nasılsın?",
          timestamp: "2023-09-10T10:05:00",
          sender: "me",
          status: "read"
        },
        {
          id: 3,
          text: "Ben de iyiyim, teşekkürler. Bu hafta sonu planın var mı?",
          timestamp: "2023-09-10T10:10:00",
          sender: "contact",
          status: "read"
        },
        {
          id: 4,
          text: "Şu an için yok, neden sordun?",
          timestamp: "2023-09-10T10:15:00",
          sender: "me",
          status: "read"
        },
        {
          id: 5,
          text: "Yarın buluşacak mıyız?",
          timestamp: "2023-09-10T14:30:00",
          sender: "contact",
          status: "received"
        }
      ]
    },
    {
      id: 2,
      contact: contacts[1],
      unread: 0,
      lastMessage: {
        text: "Raporları inceledim, yarın konuşalım.",
        timestamp: "2023-09-09T16:45:00"
      },
      messages: [
        {
          id: 6,
          text: "Merhaba Ayşe, rapor hakkında konuşabilir miyiz?",
          timestamp: "2023-09-09T15:30:00",
          sender: "me",
          status: "read"
        },
        {
          id: 7,
          text: "Tabii ki, hangi rapor hakkında?",
          timestamp: "2023-09-09T15:35:00",
          sender: "contact",
          status: "read"
        },
        {
          id: 8,
          text: "Q3 satış raporu. Bazı rakamlar bana tutarsız geldi.",
          timestamp: "2023-09-09T15:40:00",
          sender: "me",
          status: "read"
        },
        {
          id: 9,
          text: "Raporları inceledim, yarın konuşalım.",
          timestamp: "2023-09-09T16:45:00",
          sender: "contact",
          status: "read"
        }
      ]
    },
    {
      id: 3,
      contact: contacts[2],
      unread: 5,
      lastMessage: {
        text: "Acil beni ara!",
        timestamp: "2023-09-10T09:15:00"
      },
      messages: [
        {
          id: 10,
          text: "Selam, müsait misin?",
          timestamp: "2023-09-10T09:00:00",
          sender: "contact",
          status: "received"
        },
        {
          id: 11,
          text: "Acil durum var!",
          timestamp: "2023-09-10T09:05:00",
          sender: "contact",
          status: "received"
        },
        {
          id: 12,
          text: "Beni duyuyor musun?",
          timestamp: "2023-09-10T09:07:00",
          sender: "contact",
          status: "received"
        },
        {
          id: 13,
          text: "Lütfen cevap ver",
          timestamp: "2023-09-10T09:10:00",
          sender: "contact",
          status: "received"
        },
        {
          id: 14,
          text: "Acil beni ara!",
          timestamp: "2023-09-10T09:15:00",
          sender: "contact",
          status: "received"
        }
      ]
    },
    {
      id: 4,
      contact: contacts[3],
      unread: 0,
      lastMessage: {
        text: "Görüşürüz 👋",
        timestamp: "2023-09-08T20:30:00"
      },
      messages: [
        {
          id: 15,
          text: "Merhaba Zeynep, yarınki toplantı saati değişti mi?",
          timestamp: "2023-09-08T19:00:00",
          sender: "me",
          status: "read"
        },
        {
          id: 16,
          text: "Evet, 14:00'e alındı.",
          timestamp: "2023-09-08T19:10:00",
          sender: "contact",
          status: "read"
        },
        {
          id: 17,
          text: "Teşekkür ederim, orada olacağım.",
          timestamp: "2023-09-08T19:15:00",
          sender: "me",
          status: "read"
        },
        {
          id: 18,
          text: "Görüşürüz 👋",
          timestamp: "2023-09-08T20:30:00",
          sender: "contact",
          status: "read"
        }
      ]
    },
    {
      id: 5,
      contact: contacts[4],
      unread: 1,
      lastMessage: {
        text: "Fotoğrafları gördün mü? Nasıllar?",
        timestamp: "2023-09-10T11:45:00"
      },
      messages: [
        {
          id: 19,
          text: "Merhaba, tatil fotoğraflarını gönderdim e-posta ile",
          timestamp: "2023-09-10T11:30:00",
          sender: "contact",
          status: "received"
        },
        {
          id: 20,
          text: "Fotoğrafları gördün mü? Nasıllar?",
          timestamp: "2023-09-10T11:45:00",
          sender: "contact",
          status: "received"
        }
      ]
    }
  ];
  
  return { chats, contacts, commonGroups };
} 