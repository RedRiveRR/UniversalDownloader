const terminal = document.getElementById('terminal');
const urlInput = document.getElementById('urlInput');
const downloadBtn = document.getElementById('downloadBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formatOptions = document.getElementById('formatOptions');
const tabBtns = document.querySelectorAll('.tab-btn');

let currentTaskId = null;
let currentTab = 'video';

const formatConfigs = {
    video: `
        <label for="formatSelect">Quality:</label>
        <select id="formatSelect">
            <option value="best_mp4">Maximum Quality (MP4)</option>
            <option value="1080p">1080p Limit (MP4)</option>
        </select>
    `,
    music: `
        <label for="formatSelect">Format:</label>
        <select id="formatSelect">
            <option value="mp3">MP3 (320kbps)</option>
            <option value="m4a">M4A (Studio Original)</option>
        </select>
    `,
    photo: `
        <label for="formatSelect">Format:</label>
        <select id="formatSelect">
            <option value="photo">Original Quality</option>
        </select>
    `
};

function updateFormatOptions() {
    formatOptions.innerHTML = formatConfigs[currentTab];
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        updateFormatOptions();
        log(`> Switched module: ${currentTab.toUpperCase()} EXTRACTOR`, 'log-system');
    });
});

// Init options
updateFormatOptions();

function log(message, type = '') {
    const el = document.createElement('div');
    el.className = `log-line ${type}`;
    el.textContent = message;
    terminal.appendChild(el);
    terminal.scrollTop = terminal.scrollHeight;
    return el;
}

const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let spinnerInterval = null;
let spinnerEl = null;

function startSpinner(text) {
    if (spinnerEl) spinnerEl.remove();
    let i = 0;
    spinnerEl = log(`${spinnerFrames[0]} ${text}`, 'log-spinner');
    spinnerInterval = setInterval(() => {
        i = (i + 1) % spinnerFrames.length;
        spinnerEl.textContent = `${spinnerFrames[i]} ${text}`;
    }, 80);
}

function stopSpinner() {
    if (spinnerInterval) clearInterval(spinnerInterval);
    if (spinnerEl) spinnerEl.remove();
    spinnerEl = null;
}

downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return log('> Error: URL cannot be empty', 'log-error');

    urlInput.disabled = true;
    downloadBtn.disabled = true;
    cancelBtn.style.display = 'inline-block';
    
    const formatSelect = document.getElementById('formatSelect');
    const format = formatSelect ? formatSelect.value : 'best_mp4';
    
    log(`> Initiating Sequence: ${url} (Target: ${format.toUpperCase()})`, 'log-system');
    startSpinner('Connecting to UniversalDownloader API...');

    try {
        const endpoint = currentTab === 'music' ? '/api/download/hybrid' : '/api/download/video';
        
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, format })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Server error');
        }

        const { taskId } = await res.json();
        currentTaskId = taskId;
        log(`> Task ID: ${taskId} generated. Opening live socket...`, 'log-system');
        startSpinner('Processing targets (This may take a while)...');

        const eventSource = new EventSource(`/api/download/status?taskId=${taskId}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.status === 'log') {
                log(data.message);
                if (spinnerEl) {
                    terminal.appendChild(spinnerEl);
                    terminal.scrollTop = terminal.scrollHeight;
                }
            } else if (data.status === 'done') {
                stopSpinner();
                eventSource.close();
                log('> Extraction Complete! Transmitting payload to device...', 'log-success');
                window.location.href = `/api/download/file?taskId=${taskId}`;
                
                setTimeout(() => {
                    log('> Operation finished. Temporary server buffers securely wiped.', 'log-system');
                    resetUI();
                }, 3000);
            } else if (data.status === 'error') {
                stopSpinner();
                eventSource.close();
                log(`> Process Failed or Aborted.`, 'log-error');
                resetUI();
            }
        };

        eventSource.onerror = () => {
            stopSpinner();
            eventSource.close();
            log('> Lost connection to status stream.', 'log-error');
            resetUI();
        };

    } catch (err) {
        stopSpinner();
        log(`> Error: ${err.message}`, 'log-error');
        resetUI();
    }
});

cancelBtn.addEventListener('click', async () => {
    if (!currentTaskId) return;
    try {
        cancelBtn.disabled = true;
        await fetch('/api/download/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: currentTaskId })
        });
        stopSpinner();
        cancelBtn.style.display = 'none';
        cancelBtn.disabled = false;
        currentTaskId = null;
    } catch (e) {
        log(`> Cancel error: ${e.message}`, 'log-error');
    }
});

function resetUI() {
    urlInput.disabled = false;
    downloadBtn.disabled = false;
    cancelBtn.style.display = 'none';
    urlInput.value = '';
    currentTaskId = null;
}
