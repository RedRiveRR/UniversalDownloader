# ⚡ OmniDownloader (Universal Media Extractor)

A sleek, self-hosted, all-in-one media downloader built on Node.js. Extract high-quality Video, Music, and Images from almost any platform (YouTube, Spotify, Instagram, X/Twitter, SoundCloud) directly via a beautiful, unified web interface.

## ✨ Features
- **3-in-1 Dashboard:** Single unified interface with tabs for Video, Music, and Photos.
- **Studio Quality Audio:** Uses `spotdl` and `ffmpeg` to embed original metadata and album arts.
- **1080p Video Merge:** Uses `yt-dlp` to intelligently merge the best video and audio streams.
- **Gallery Extraction:** Automatically falls back to `gallery-dl` if the target is an image gallery instead of a video.
- **Live Terminal UI:** Watch exactly what the backend Python engines are doing in real-time via Server-Sent Events (SSE).
- **Graceful Abortion:** Easily send `SIGKILL` to hung processes to prevent RAM/CPU leaks.

## 🛠️ Prerequisites
This project acts as an orchestrator for several powerful Python CLI tools. You must have them installed on your host machine:

1. **Python 3.10+**
2. **FFmpeg** (Ensure it is in your system PATH or defined in `.env`)
3. Install the required Python packages:
   ```bash
   pip install yt-dlp spotdl gallery-dl
   ```

## 🚀 Setup & Run

1. Clone the repository and install Node dependencies:
   ```bash
   git clone https://github.com/YourUsername/OmniDownloader.git
   cd OmniDownloader
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

## 🍪 Advanced Bypass (Cookies)
To download age-restricted or private/login-required media (like private Instagram posts or age-gated YouTube videos), export your browser cookies to `txt` format (using extensions like "Get cookies.txt LOCALLY") and place them in the root directory:
- `youtube_cookies.txt`
- `instagram_cookies.txt`
The system will automatically detect and use them.

## 📝 License
MIT
