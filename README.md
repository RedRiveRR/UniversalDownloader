<div align="center">
  
# ⚡ UniversalDownloader
**The Ultimate Self-Hosted Media Extraction Terminal**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🇹🇷 Türkçe](#türkçe) | [🇬🇧 English](#english)

<br/>

*Extract high-quality Video, Music, and Images from almost any platform directly via a beautiful, unified web interface.*

<br/>
</div>

---

<a id="english"></a>
## 🇬🇧 English

**UniversalDownloader** is a sleek, self-hosted, all-in-one media downloader built on Node.js. It acts as a powerful web orchestrator for CLI tools like `yt-dlp`, `spotdl`, and `gallery-dl`, bringing their raw power into a cyberpunk-styled, easy-to-use dashboard.

### 🌐 Supported Platforms
Thanks to our multi-engine architecture, we support downloading from virtually anywhere:

![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)
![X](https://img.shields.io/badge/X_Twitter-000000?style=for-the-badge&logo=x&logoColor=white)
![TikTok](https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white)
![SoundCloud](https://img.shields.io/badge/SoundCloud-FF3300?style=for-the-badge&logo=soundcloud&logoColor=white)
![Pinterest](https://img.shields.io/badge/Pinterest-E60023?style=for-the-badge&logo=pinterest&logoColor=white)
![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![Twitch](https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white)

*...and 1000+ other websites natively supported by `yt-dlp` and `gallery-dl`!*

### ✨ Features
- 🚀 **3-in-1 Dashboard:** Single unified interface with dedicated tabs for Video, Music, and Photos.
- 🎵 **Studio Quality Audio:** Uses `spotdl` and `ffmpeg` to embed original metadata and album arts.
- 🎬 **1080p Video Merge:** Uses `yt-dlp` to intelligently merge the best video and audio streams seamlessly.
- 🖼️ **Gallery Extraction:** Automatically falls back to `gallery-dl` if the target is an image gallery (e.g., Instagram carousel).
- 💻 **Live Terminal UI:** Watch exactly what the backend Python engines are doing in real-time via Server-Sent Events (SSE).
- 🛑 **Graceful Abortion:** Easily send `SIGKILL` to hung processes to prevent RAM/CPU leaks.

### 🛠️ Prerequisites
This project acts as an orchestrator for several powerful Python CLI tools. You must have them installed on your host machine:

1. **Python 3.10+**
2. **FFmpeg** (Ensure it is in your system PATH or defined in `.env`)
3. Install the required Python packages:
   ```bash
   pip install yt-dlp spotdl gallery-dl
   ```

### 🚀 Setup & Run
1. **Clone the repository** and install Node dependencies:
   ```bash
   git clone https://github.com/RedRiveRR/UniversalDownloader.git
   cd UniversalDownloader
   npm install
   ```
2. **Configure Environment:** Copy `.env.example` to `.env` and configure your paths:
   ```bash
   cp .env.example .env
   ```
   > *Edit the `.env` file to point to your Python Scripts folder and FFmpeg bin folder if they are not in your default system PATH.*
3. **Start the server:**
   ```bash
   npm start
   ```
4. **Access the UI:** Open your browser and navigate to `http://localhost:3050`

### 🍪 Advanced Bypass (Cookies)
To download age-restricted or private/login-required media (like private Instagram posts or age-gated YouTube videos), export your browser cookies to `txt` format (using extensions like "Get cookies.txt LOCALLY") and place them in the root directory:
- `youtube_cookies.txt`
- `instagram_cookies.txt`

---

<a id="türkçe"></a>
## 🇹🇷 Türkçe

**UniversalDownloader**, Node.js üzerinde inşa edilmiş, şık, tek başına barındırılabilen (self-hosted) "hepsi bir arada" bir medya indirme aracıdır. Güçlü komut satırı programlarını (`yt-dlp`, `spotdl` vb.) tek bir siberpunk web arayüzünde toplayarak kullanımlarını basitleştirir.

### 🌐 Desteklenen Platformlar
Çoklu-motor mimarimiz sayesinde internetteki neredeyse her yerden indirme yapabilirsiniz:

![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)
![X](https://img.shields.io/badge/X_Twitter-000000?style=for-the-badge&logo=x&logoColor=white)
![TikTok](https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white)
![SoundCloud](https://img.shields.io/badge/SoundCloud-FF3300?style=for-the-badge&logo=soundcloud&logoColor=white)
![Pinterest](https://img.shields.io/badge/Pinterest-E60023?style=for-the-badge&logo=pinterest&logoColor=white)
![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![Twitch](https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white)

*...ve `yt-dlp` ile `gallery-dl` tarafından desteklenen 1000+ fazla websitesi!*

### ✨ Özellikler
- 🚀 **3'ü 1 Arada Kontrol Paneli:** Video, Müzik ve Fotoğraflar için sekmeli, modern ve tek parça arayüz.
- 🎵 **Stüdyo Kalitesinde Ses:** Orijinal şarkı etiketlerini (metadata) ve albüm kapaklarını eklemek için `spotdl` ve `ffmpeg` kullanır.
- 🎬 **1080p Video Birleştirme:** En iyi video ve ses akışlarını kayıpsız birleştirmek için `yt-dlp` motorundan faydalanır.
- 🖼️ **Galeri Çıkarma:** Hedefte video yerine çoklu görsel galerisi varsa (örn. Instagram kaydırmalı post), sistem otomatik olarak `gallery-dl` motoruna geçer.
- 💻 **Canlı Sanal Terminal:** Arka planda çalışan Python motorlarının ne yaptığını Server-Sent Events (SSE) sayesinde gerçek zamanlı ve Türkçe loglar halinde izleyebilirsiniz.
- 🛑 **Zorla Durdurma:** Takılı kalan veya uzun süren işlemlere tek tuşla `SIGKILL` göndererek RAM ve İşlemci yorgunluğunu engelleyebilirsiniz.

### 🛠️ Gereksinimler
Bu proje, güçlü Python CLI araçlarının bir arayüzü olarak çalışır. Aşağıdaki programların sisteminizde kurulu olması gerekir:

1. **Python 3.10+**
2. **FFmpeg** (Sistem yolunuza [PATH] ekli olduğundan veya `.env` dosyasında tanımlı olduğundan emin olun)
3. Gerekli Python paketlerini kurun:
   ```bash
   pip install yt-dlp spotdl gallery-dl
   ```

### 🚀 Kurulum ve Başlatma
1. **Depoyu klonlayın** ve Node modüllerini yükleyin:
   ```bash
   git clone https://github.com/RedRiveRR/UniversalDownloader.git
   cd UniversalDownloader
   npm install
   ```
2. **Ortamı Ayarlayın:** `.env.example` dosyasını kopyalayıp `.env` adıyla kaydedin ve yollarınızı yapılandırın:
   ```bash
   cp .env.example .env
   ```
   > *Not: Eğer FFmpeg veya Python Script klasörleriniz standart sistem yolunuzda (PATH) değilse `.env` dosyası üzerinden yerlerini özel olarak belirtebilirsiniz.*
3. **Sunucuyu başlatın:**
   ```bash
   npm start
   ```
4. **Arayüze Erişin:** Tarayıcınızı açın ve `http://localhost:3050` adresine gidin.

### 🍪 Gelişmiş Erişim (Çerezler / Cookies)
Yaş kısıtlamalı veya giriş yapılması gereken (Örn: Gizli Instagram hesapları veya kısıtlamalı YouTube videoları) içerikleri indirebilmek için tarayıcınızdaki çerezleri `txt` formatında dışa aktarın ("Get cookies.txt LOCALLY" gibi uzantılar kullanabilirsiniz) ve ana dizine yerleştirin:
- `youtube_cookies.txt`
- `instagram_cookies.txt`
Sistem arka planda bu dosyaları otomatik olarak tanıyacak ve indirme sırasında platformlara iletecektir.

---
<div align="center">
  <p>Built with ❤️ by <b>RedRiveRR</b></p>
</div>
