# ⚡ UniversalDownloader (Universal Media Extractor)

[🇹🇷 Türkçe](#türkçe) | [🇬🇧 English](#english)

---

<a id="english"></a>
## 🇬🇧 English

A sleek, self-hosted, all-in-one media downloader built on Node.js. Extract high-quality Video, Music, and Images from almost any platform (YouTube, Spotify, Instagram, X/Twitter, SoundCloud) directly via a beautiful, unified web interface.

### ✨ Features
- **3-in-1 Dashboard:** Single unified interface with tabs for Video, Music, and Photos.
- **Studio Quality Audio:** Uses `spotdl` and `ffmpeg` to embed original metadata and album arts.
- **1080p Video Merge:** Uses `yt-dlp` to intelligently merge the best video and audio streams.
- **Gallery Extraction:** Automatically falls back to `gallery-dl` if the target is an image gallery instead of a video.
- **Live Terminal UI:** Watch exactly what the backend Python engines are doing in real-time via Server-Sent Events (SSE).
- **Graceful Abortion:** Easily send `SIGKILL` to hung processes to prevent RAM/CPU leaks.

### 🛠️ Prerequisites
This project acts as an orchestrator for several powerful Python CLI tools. You must have them installed on your host machine:

1. **Python 3.10+**
2. **FFmpeg** (Ensure it is in your system PATH or defined in `.env`)
3. Install the required Python packages:
   ```bash
   pip install yt-dlp spotdl gallery-dl
   ```

### 🚀 Setup & Run
1. Clone the repository and install Node dependencies:
   ```bash
   git clone https://github.com/RedRiveRR/UniversalDownloader.git
   cd UniversalDownloader
   npm install
   ```
2. Copy `.env.example` to `.env` and configure your paths:
   ```bash
   cp .env.example .env
   ```
   *Edit the `.env` file to point to your Python Scripts folder and FFmpeg bin folder if they are not in your default system PATH.*
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3050`

### 🍪 Advanced Bypass (Cookies)
To download age-restricted or private/login-required media (like private Instagram posts or age-gated YouTube videos), export your browser cookies to `txt` format (using extensions like "Get cookies.txt LOCALLY") and place them in the root directory:
- `youtube_cookies.txt`
- `instagram_cookies.txt`

---

<a id="türkçe"></a>
## 🇹🇷 Türkçe

Node.js üzerinde inşa edilmiş, şık, tek başına barındırılabilen (self-hosted) "hepsi bir arada" (all-in-one) medya indirme aracıdır. YouTube, Spotify, Instagram, X/Twitter, SoundCloud gibi platformlardan yüksek kaliteli Video, Müzik ve Görselleri tek bir web arayüzü üzerinden kolayca indirebilirsiniz.

### ✨ Özellikler
- **3'ü 1 Arada Kontrol Paneli:** Video, Müzik ve Fotoğraflar için sekmeli, modern ve tek parça arayüz.
- **Stüdyo Kalitesinde Ses:** Orijinal şarkı etiketlerini (metadata) ve albüm kapaklarını eklemek için `spotdl` ve `ffmpeg` kullanır.
- **1080p Video Birleştirme:** En iyi video ve ses akışlarını kayıpsız birleştirmek için `yt-dlp` motorundan faydalanır.
- **Galeri Çıkarma:** Hedefte video yerine çoklu görsel galerisi varsa (örn. Instagram kaydırmalı post), sistem otomatik olarak `gallery-dl` motoruna geçer.
- **Canlı Sanal Terminal:** Arka planda çalışan Python motorlarının ne yaptığını Server-Sent Events (SSE) sayesinde gerçek zamanlı ve Türkçe loglar halinde izleyebilirsiniz.
- **Zorla Durdurma:** Takılı kalan veya uzun süren işlemlere tek tuşla `SIGKILL` göndererek RAM ve İşlemci yorgunluğunu engelleyebilirsiniz.

### 🛠️ Gereksinimler
Bu proje, güçlü Python CLI araçlarının bir orkestratörü olarak çalışır. Aşağıdaki programların sisteminizde kurulu olması gerekir:

1. **Python 3.10+**
2. **FFmpeg** (Sistem yolunuza [PATH] ekli olduğundan veya `.env` dosyasında tanımlı olduğundan emin olun)
3. Gerekli Python paketlerini kurun:
   ```bash
   pip install yt-dlp spotdl gallery-dl
   ```

### 🚀 Kurulum ve Başlatma
1. Depoyu klonlayın ve Node modüllerini yükleyin:
   ```bash
   git clone https://github.com/RedRiveRR/UniversalDownloader.git
   cd UniversalDownloader
   npm install
   ```
2. `.env.example` dosyasını kopyalayıp `.env` adıyla kaydedin ve yollarınızı yapılandırın:
   ```bash
   cp .env.example .env
   ```
   *Not: Eğer FFmpeg veya Python Script klasörleriniz standart sistem yolunuzda (PATH) değilse `.env` dosyası üzerinden yerlerini özel olarak belirtebilirsiniz.*
3. Sunucuyu başlatın:
   ```bash
   npm start
   ```
4. Tarayıcınızı açın ve `http://localhost:3050` adresine gidin.

### 🍪 Gelişmiş Erişim (Çerezler / Cookies)
Yaş kısıtlamalı veya giriş yapılması gereken (Örn: Gizli Instagram hesapları veya kısıtlamalı YouTube videoları) içerikleri indirebilmek için tarayıcınızdaki çerezleri `txt` formatında dışa aktarın ("Get cookies.txt LOCALLY" gibi uzantılar kullanabilirsiniz) ve ana dizine yerleştirin:
- `youtube_cookies.txt`
- `instagram_cookies.txt`
Sistem arka planda bu dosyaları otomatik olarak tanıyacak ve indirme sırasında platformlara iletecektir.

---
## 📝 License
MIT
