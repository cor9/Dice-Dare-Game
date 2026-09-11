class DiceDareGame {
    constructor() {
        this.dares = this.initializeDares();
        this.eliminatedDares = new Set();
        this.rolledNumbers = new Set();
        this.currentRole = 'roller';
        this.gameStarted = false;
        this.faceLimits = {
            roller: false,
            master: false
        };
        this.cameraStream = null;

        this.initializeEventListeners();
        this.updateDareDisplay();
    }

    initializeDares() {
        const baseDares = [
            { number: 1, text: "The game master may choose any two dares from the full dare list", type: "master" },
            { number: 2, text: "The roller must be the game master's camslave for 30 minutes (limits respected)", type: "roller" },
            { number: 3, text: "The roller must strip naked and finger their ass for 5 minutes while showing face", type: "roller" },
            { number: 4, text: "The roller must strip naked and cum while showing face", type: "roller" },
            { number: 5, text: "The roller must strip naked, then cum and eat it", type: "roller" },
            { number: 6, text: "The roller must strip naked and finger their ass for 5 minutes", type: "roller" },
            { number: 7, text: "The roller must strip naked and slap their balls/vagina five times", type: "roller" },
            { number: 8, text: "The roller must complete a dare from GD, chosen by the game master (limits respected)", type: "roller" },
            { number: 9, text: "The roller must strip naked and masturbate until they cum", type: "roller" },
            { number: 10, text: "The roller must strip naked and spank their ass twenty times on each cheek", type: "roller" },
            { number: 11, text: "The roller must strip naked and edge for ten minutes", type: "roller" },
            { number: 12, text: "The roller must strip naked and edge two times", type: "roller" },
            { number: 13, text: "The roller must strip naked and masturbate for 5 minutes", type: "roller" },
            { number: 14, text: "The roller must strip completely naked", type: "roller" },
            { number: 15, text: "The roller must strip down to their underwear", type: "roller" },
            { number: 16, text: "The game master must strip down to their underwear", type: "master" },
            { number: 17, text: "The game master must strip completely naked", type: "master" },
            { number: 18, text: "The game master must strip naked and masturbate until they cum", type: "master" },
            { number: 19, text: "The game master must strip naked and cum while showing face", type: "master" },
            { number: 20, text: "The game master must be the roller's camslave for 30 minutes (limits respected)", type: "master" }
        ];

        return baseDares;
    }

    applyFaceLimits() {
        if (this.faceLimits.roller) {
            // Replace dares 3 and 4 for roller face limit
            this.dares[2] = { number: 3, text: "The roller must strip naked and finger their ass for 20 minutes", type: "roller" };
            this.dares[3] = { number: 4, text: "The roller must strip naked and cum, then finger their ass for 5 minutes using the cum as lube", type: "roller" };
        }

        if (this.faceLimits.master) {
            // Replace dares 16-19 for master face limit
            this.dares[15] = { number: 16, text: "The game master must strip completely naked", type: "master" };
            this.dares[16] = { number: 17, text: "The game master must strip naked and masturbate until they cum", type: "master" };
            this.dares[17] = { number: 18, text: "The game master must strip naked and masturbate until they cum", type: "master" };
            this.dares[18] = { number: 19, text: "The roller must strip naked and cum, then finger their ass for 5 minutes using the cum as lube", type: "roller" };
        }
    }

    initializeEventListeners() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Roll dice button
        document.getElementById('roll-dice').addEventListener('click', () => {
            this.rollDice();
        });

        // Take center dare button
        document.getElementById('take-center-dare').addEventListener('click', () => {
            this.takeCenterDare();
        });

        // Reset game button
        document.getElementById('reset-game').addEventListener('click', () => {
            this.resetGame();
        });

        // Show rules button
        document.getElementById('show-rules').addEventListener('click', () => {
            this.showModal('rules-modal');
        });

        // Face limit checkboxes
        document.getElementById('roller-face-limit').addEventListener('change', (e) => {
            this.faceLimits.roller = e.target.checked;
        });

        document.getElementById('master-face-limit').addEventListener('change', (e) => {
            this.faceLimits.master = e.target.checked;
        });

        // Role selection
        document.querySelectorAll('input[name="role"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentRole = e.target.value;
                this.updateCurrentRoleDisplay();
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.hideModal(e.target.closest('.modal'));
            });
        });

        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });

        // Camera controls
        document.getElementById('start-camera').addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('stop-camera').addEventListener('click', () => {
            this.stopCamera();
        });

        document.getElementById('capture-photo').addEventListener('click', () => {
            this.capturePhoto();
        });
    }

    startGame() {
        if (window.__onlineActive) return; // online flow owns this
        this.gameStarted = true;
        this.applyFaceLimits();

        document.querySelector('.game-setup').style.display = 'none';
        document.querySelector('.game-area').style.display = 'block';

        this.updateDareDisplay();
        this.updateCenterDare();
        this.updateGameStats();
        this.updateCurrentRoleDisplay();
    }

    rollDice() {
        if (window.__onlineActive) return; // online flow owns the roll button
        if (!this.gameStarted) return;

        const dice = document.getElementById('dice');
        const rollButton = document.getElementById('roll-dice');

        // Disable button during roll
        rollButton.disabled = true;
        dice.classList.add('rolling');

        // Simulate dice roll animation
        setTimeout(() => {
            const rollResult = Math.floor(Math.random() * 20) + 1;
            dice.textContent = rollResult;
            dice.classList.remove('rolling');

            this.processRoll(rollResult);
            rollButton.disabled = false;
        }, 600);
    }

    processRoll(rollResult) {
        if (this.rolledNumbers.has(rollResult)) {
            // Number already rolled, show message
            this.showMessage(`Number ${rollResult} was already rolled! Roll again.`);
            return;
        }

        this.rolledNumbers.add(rollResult);

        // Find and eliminate the dare
        const dareToEliminate = this.dares.find(dare => dare.number === rollResult);
        if (dareToEliminate) {
            this.eliminatedDares.add(rollResult);
            this.showMessage(`Dare #${rollResult} eliminated: ${dareToEliminate.text}`);
        }

        this.updateDareDisplay();
        this.updateCenterDare();
        this.updateGameStats();

        // Check if game should end
        if (this.getRemainingDares().length === 1) {
            this.endGame();
        }
    }

    takeCenterDare() {
        if (window.__onlineActive) return; // online flow owns this
        if (!this.gameStarted) return;

        const remainingDares = this.getRemainingDares();
        if (remainingDares.length === 0) return;

        const centerDare = this.getCenterDare();
        this.endGameWithDare(centerDare);
    }

    getRemainingDares() {
        return this.dares.filter(dare => !this.eliminatedDares.has(dare.number));
    }

    getCenterDare() {
        const remainingDares = this.getRemainingDares();
        if (remainingDares.length === 0) return null;

        const sortedNumbers = remainingDares.map(dare => dare.number).sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedNumbers.length / 2);

        if (sortedNumbers.length % 2 === 0) {
            // Even number of dares - use lower of the two center dares
            return remainingDares.find(dare => dare.number === sortedNumbers[middleIndex - 1]);
        } else {
            // Odd number of dares - use the center dare
            return remainingDares.find(dare => dare.number === sortedNumbers[middleIndex]);
        }
    }

    updateCenterDare() {
        const centerDare = this.getCenterDare();
        const centerDareText = document.getElementById('center-dare-text');
        const takeCenterButton = document.getElementById('take-center-dare');

        if (centerDare) {
            centerDareText.textContent = `Dare #${centerDare.number}: ${centerDare.text}`;
            takeCenterButton.disabled = false;
        } else {
            centerDareText.textContent = "No dares remaining";
            takeCenterButton.disabled = true;
        }
    }

    updateDareDisplay() {
        const dareList = document.getElementById('dare-list');
        dareList.innerHTML = '';

        this.dares.forEach(dare => {
            const dareElement = document.createElement('div');
            dareElement.className = 'dare-item';

            if (this.eliminatedDares.has(dare.number)) {
                dareElement.classList.add('eliminated');
            }

            dareElement.innerHTML = `
                <div class="dare-number">Dare #${dare.number}</div>
                <div class="dare-text">${dare.text}</div>
                <div class="dare-type ${dare.type}">${dare.type === 'roller' ? 'Roller' : 'Game Master'}</div>
            `;

            dareList.appendChild(dareElement);
        });
    }

    updateGameStats() {
        const remainingCount = document.getElementById('remaining-count');
        const rolledCount = document.getElementById('rolled-count');

        remainingCount.textContent = this.getRemainingDares().length;
        rolledCount.textContent = this.rolledNumbers.size;
    }

    updateCurrentRoleDisplay() {
        const currentRoleElement = document.getElementById('current-role');
        const selectedRole = document.querySelector('input[name="role"]:checked').value;

        if (selectedRole === 'roller') {
            currentRoleElement.textContent = '🎲 Roller';
        } else {
            currentRoleElement.textContent = '👑 Game Master';
        }
    }

    endGame() {
        const remainingDares = this.getRemainingDares();
        if (remainingDares.length === 1) {
            this.endGameWithDare(remainingDares[0]);
        }
    }

    endGameWithDare(dare) {
        const resultContent = document.getElementById('result-content');
        resultContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: #667eea; margin-bottom: 20px;">🎯 Game Over!</h3>
                <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: #4a5568; margin-bottom: 10px;">Final Dare:</h4>
                    <p style="font-size: 1.1rem; line-height: 1.5; color: #2d3748;">
                        <strong>Dare #${dare.number}:</strong> ${dare.text}
                    </p>
                    <div style="margin-top: 15px;">
                        <span class="dare-type ${dare.type}" style="font-size: 1rem;">
                            ${dare.type === 'roller' ? '🎲 Roller' : '👑 Game Master'}
                        </span>
                    </div>
                </div>
                <p style="color: #718096; font-style: italic;">
                    This dare must be completed on camera!
                </p>
            </div>
        `;

        this.showModal('result-modal');

        // Disable game controls
        document.getElementById('roll-dice').disabled = true;
        document.getElementById('take-center-dare').disabled = true;
    }

    resetGame() {
        if (window.__onlineActive) return; // online flow owns this
        this.eliminatedDares.clear();
        this.rolledNumbers.clear();
        this.gameStarted = false;
        this.dares = this.initializeDares();

        // Stop camera if running
        this.stopCamera();

        document.querySelector('.game-setup').style.display = 'block';
        document.querySelector('.game-area').style.display = 'none';

        // Reset dice display
        document.getElementById('dice').textContent = '?';

        // Reset buttons
        document.getElementById('roll-dice').disabled = false;
        document.getElementById('take-center-dare').disabled = false;

        this.updateDareDisplay();
        this.updateGameStats();
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
    }

    hideModal(modal) {
        modal.style.display = 'none';
    }

    showMessage(message) {
        // Create a temporary message element
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #667eea;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            font-weight: 600;
            animation: slideDown 0.3s ease-out;
        `;
        messageElement.textContent = message;

        document.body.appendChild(messageElement);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageElement.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }

    async startCamera() {
        try {
            const video = document.getElementById('camera-video');
            const placeholder = document.getElementById('camera-placeholder');
            const startBtn = document.getElementById('start-camera');
            const stopBtn = document.getElementById('stop-camera');
            const captureBtn = document.getElementById('capture-photo');

            // Request camera access
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });

            video.srcObject = this.cameraStream;
            video.style.display = 'block';
            placeholder.style.display = 'none';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
            captureBtn.style.display = 'inline-block';
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showMessage('Unable to access camera. Please check permissions.');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }

        const video = document.getElementById('camera-video');
        const placeholder = document.getElementById('camera-placeholder');
        const startBtn = document.getElementById('start-camera');
        const stopBtn = document.getElementById('stop-camera');
        const captureBtn = document.getElementById('capture-photo');

        video.srcObject = null;
        video.style.display = 'none';
        placeholder.style.display = 'block';
        startBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        captureBtn.style.display = 'none';
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Create download link
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dare-photo-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showMessage('Photo captured and downloaded!');
        }, 'image/png');
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.__diceGame = new DiceDareGame();
});


/* ============================================================
   ONLINE MODE — P2P cams + chat + synced dare board (p2p.js)
   Everyone runs the same deterministic logic; the Roller
   broadcasts each resolved roll so boards never diverge.
   ============================================================ */
(function () {
    const ROOM_PREFIX = 'dice';

    let p2p = null;
    let chat = null;

    window.__onlineActive = false;

    const S = {
        phase: 'lobby',      // lobby | play
        players: [],         // [{id,name}]
        rollerId: null,      // the person doing the dares
        limits: { roller: false, master: false }
    };

    const tiles = new Map(); // identity -> { name, stream, muted }
    let lk = null;

    const $ = (id) => document.getElementById(id);
    const game = () => window.__diceGame;
    const me = () => p2p && p2p.me;
    const isHost = () => p2p && p2p.isHost;
    const isRoller = () => S.rollerId === (me() && me().id);
    const canDrive = () => isRoller() || isHost();
    const rollerName = () => (S.players.find((p) => p.id === S.rollerId) || {}).name || '…';

    /* ---------------- connect ---------------- */

    async function connect(asHost, code) {
        const name = $('online-name').value.trim() || 'Gooner ' + Math.floor(Math.random() * 90 + 10);
        $('connect-status').textContent = 'Getting your cam ready…';

        p2p = new P2PRoom({ prefix: ROOM_PREFIX, requireMedia: false }); // data channels only
        p2p.onRosterChange = () => { renderLobby(); };
        p2p.onPeerGone = (id, who) => {
            chat && chat.addMessage({ name: '', text: `${who} left the room`, system: true });
            if (S.phase === 'play' && id === S.rollerId) {
                chat && chat.addMessage({ name: '', text: '⚠️ The roller left!', system: true });
            }
        };
        p2p.onHostGone = () => {
            alert('The host left — game over.');
            location.hash = '';
            location.reload();
        };
        p2p.onHostMessage = onHostMessage;
        p2p.onPeerMessage = () => {}; // no peer actions needed; roller drives locally
        p2p.onAnyMessage = (peerId, msg) => {
            if (msg && msg.type === 'chat') chat && chat.addMessage({ name: msg.name, text: msg.text, self: false });
            // peers relay roller events through the mesh too
            if (msg && msg.type === 'gameEvent') applyGameEvent(msg.event);
        };
        p2p.onError = (err) => { $('connect-status').textContent = '⚠️ ' + err.message; };

        try {
            if (asHost) {
                const link = await p2p.host(name);
                $('share-link').textContent = link;
                p2p.setRoomMeta({ title: "Dice Dare Room", password: $("passwordInput").value.trim() });
                // hub directory connects in the background so it never blocks the room
                p2p.advertiseWhenReady();
            } else {
                $('connect-status').textContent = 'Joining room…';
                await p2p.join(name, code, $("passwordInput").value.trim());
            }
        } catch (err) {
            $('connect-status').textContent = '⚠️ ' + (err.message || 'Could not connect.');
            return;
        }

        chat = mountChatUI($('chat-root'), {
            selfName: name,
            onSend: (text) => {
                p2p.sendAll({ type: 'chat', name: me().name, text });
                chat.addMessage({ name: me().name, text, self: true });
            }
        });

        // ---- LiveKit cams (media layer) ----
        lk = new LKMedia();
        lk.onTile = (id, label, stream, isLocal) => {
            tiles.set(id, { name: label, stream, muted: isLocal });
            addTile(id, label, stream, isLocal);
        };
        lk.onRemoveTile = (id) => { tiles.delete(id); removeTile(id); };
        lk.onError = (err) => { $('connect-status').textContent = '⚠️ ' + err.message; };
        await lk.connect(p2p.hostId, p2p.me.id, name);

        window.__onlineActive = true;
        $('media-bar').style.display = '';
        document.querySelector('.game-setup').style.display = 'none';
        $('online-lobby').style.display = 'block';
        if (isHost()) $('start-online-game').style.display = '';
        else $('waiting-host-note').style.display = '';
        setTiles();
        renderLobby();
        renderLobby();
        $('connect-status').textContent = '';
    }

    /* ---------------- tiles ---------------- */

    function activeGrid() {
        return getComputedStyle(document.querySelector('.game-area')).display !== 'none'
            ? $('video-grid-game')
            : $('video-grid-lobby');
    }

    function setTiles() {
        const grid = activeGrid();
        if (!grid) return;
        grid.innerHTML = '';
        tiles.forEach((t, id) => addTile(id, t.name, t.stream, t.muted));
    }

    function addTile(peerId, label, stream, muted) {
        const grid = activeGrid();
        if (!grid) return;
        let tile = grid.querySelector(`[data-peer="${peerId}"]`);
        if (!tile) {
            tile = document.createElement('div');
            tile.className = 'video-tile';
            tile.dataset.peer = peerId;
            tile.innerHTML = '<video autoplay playsinline></video><span class="tile-label"></span>';
            grid.appendChild(tile);
        }
        const v = tile.querySelector('video');
        v.muted = muted;
        if (v.srcObject !== stream) v.srcObject = stream;
        tile.querySelector('.tile-label').textContent = label;
    }

    function removeTile(peerId) {
        document.querySelectorAll(`[data-peer="${peerId}"]`).forEach((t) => t.remove());
    }

    /* ---------------- lobby ---------------- */

    function renderLobby() {
        if (!p2p) return;
        const wrap = $('lobby-players');
        wrap.innerHTML = '';
        p2p.roster.forEach((p, i) => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = (i === 0 ? '👑 ' : '') + p.name + (p.id === me().id ? ' (you)' : '');
            wrap.appendChild(chip);
        });
    }

    /* ---------------- game events (mesh broadcast, everyone applies) ---------------- */

    function broadcastEvent(event) {
        p2p.sendAll({ type: 'gameEvent', event });
    }

    function onHostMessage(msg) {
        // gameEvent is handled ONLY in onAnyMessage (avoid double-applying).
        // 'state' snapshots are unused (start flows through gameEvent).
        void msg;
    }

    function applyGameEvent(event) {
        switch (event.kind) {
            case 'start':
                S.players = event.players;
                S.rollerId = event.rollerId;
                S.limits = event.limits;
                netStartGame(false);
                break;
            case 'roll':
                netApplyRoll(event.rollResult, event.number);
                break;
            case 'center':
                game().endGameWithDare(game().dares.find((d) => d.number === event.number));
                lockControlsForViewers();
                break;
            case 'reset':
                netReset();
                break;
        }
    }

    /* ---------------- host/roller actions ---------------- */

    function hostStartGame() {
        const rollerId = p2p.roster.length > 1 ? p2p.roster[1].id : me().id;
        const event = {
            kind: 'start',
            players: p2p.roster.map((p) => ({ id: p.id, name: p.name })),
            rollerId,
            limits: {
                roller: $('net-roller-face-limit').checked,
                master: $('net-master-face-limit').checked
            }
        };
        Object.assign(S, { players: event.players, rollerId, limits: event.limits });
        broadcastEvent(event);
        netStartGame(false);
    }

    function isDrivingThisDevice() { return canDrive(); }

    function netStartGame() {
        const g = game();
        g.gameStarted = true;
        g.dares = g.initializeDares();
        g.eliminatedDares.clear();
        g.rolledNumbers.clear();
        g.faceLimits = { roller: S.limits.roller, master: S.limits.master };
        g.applyFaceLimits();

        $('online-lobby').style.display = 'none';
        document.querySelector('.game-setup').style.display = 'none';
        document.querySelector('.game-area').style.display = 'block';
        document.querySelector('.camera-section').style.display = 'none'; // p2p cams instead
        document.querySelector('.role-selector').style.display = 'none';

        $('current-role').textContent = '🎲 Roller: ' + rollerName();
        $('net-players').style.display = '';
        $('dice').textContent = '?';

        g.updateDareDisplay();
        g.updateCenterDare();
        g.updateGameStats();
        setTiles();
        lockControlsForViewers();
        renderNetChips();
    }

    function renderNetChips() {
        const wrap = $('net-players');
        wrap.innerHTML = '';
        S.players.forEach((p) => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            if (p.id === S.rollerId) chip.classList.add('up-next');
            const roleTag = p.id === S.rollerId ? '🎲 ' : '👑 ';
            chip.textContent = roleTag + p.name + (p.id === (me() && me().id) ? ' (you)' : '');
            wrap.appendChild(chip);
        });
    }

    function lockControlsForViewers() {
        const locked = !canDrive();
        $('roll-dice').style.display = locked ? 'none' : '';
        $('take-center-dare').style.display = locked ? 'none' : '';
        $('reset-game').style.display = isHost() ? '' : 'none';
    }

    function netRoll() {
        const g = game();
        const dice = $('dice');
        const rollButton = $('roll-dice');
        rollButton.disabled = true;
        dice.classList.add('rolling');

        setTimeout(() => {
            const rollResult = Math.floor(Math.random() * 20) + 1;
            dice.textContent = rollResult;
            dice.classList.remove('rolling');
            rollButton.disabled = false;

            if (g.rolledNumbers.has(rollResult)) {
                g.showMessage(`Number ${rollResult} was already rolled! Roll again.`);
                broadcastEvent({ kind: 'chatRoll', rollResult, note: 'duplicate' });
                return;
            }
            broadcastEvent({ kind: 'roll', rollResult, number: rollResult });
            netApplyRoll(rollResult, rollResult);
        }, 600);
    }

    function netApplyRoll(rollResult, number) {
        const g = game();
        $('dice').textContent = rollResult;

        g.rolledNumbers.add(number);
        const dare = g.dares.find((d) => d.number === number);
        if (dare) {
            g.eliminatedDares.add(number);
            g.showMessage(`Dare #${number} eliminated: ${dare.text}`);
        }
        g.updateDareDisplay();
        g.updateCenterDare();
        g.updateGameStats();

        if (g.getRemainingDares().length === 1) {
            g.endGame(); // deterministic for everyone: same eliminated set
            lockControlsForViewers();
        }
    }

    function netTakeCenter() {
        const center = game().getCenterDare();
        if (!center) return;
        broadcastEvent({ kind: 'center', number: center.number });
        game().endGameWithDare(center);
        lockControlsForViewers();
    }

    function netReset() {
        const g = game();
        g.eliminatedDares.clear();
        g.rolledNumbers.clear();
        g.dares = g.initializeDares();
        g.faceLimits = { ...S.limits };
        g.applyFaceLimits();
        $('dice').textContent = '?';
        g.updateDareDisplay();
        g.updateCenterDare();
        g.updateGameStats();
        lockControlsForViewers();
    }

    /* ---------------- events ---------------- */

    function init() {
        $('host-room').addEventListener('click', () => connect(true));
        $('join-room').addEventListener('click', () => {
            const code = $('join-code').value.trim().toLowerCase();
            if (code.length !== 6) { $('connect-status').textContent = 'Enter the 6-character room code.'; return; }
            connect(false, code);
        });

        const m = location.hash.match(/#join=([a-z0-9]{6})/i);
        if (m) {
            $('join-code').value = m[1].toLowerCase();
            $('connect-status').textContent = 'Link loaded — enter your name and hit Join.';
            $('online-name').focus();
        }

        $('copy-link').addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText($('share-link').textContent);
                $('copy-link').textContent = 'Copied!';
                setTimeout(() => ($('copy-link').textContent = 'Copy'), 1500);
            } catch (_) {}
        });
        $('text-link').addEventListener('click', async () => {
            const url = $('share-link').textContent;
            if (navigator.share) {
                try { await navigator.share({ title: 'Dice Dare Room', text: 'Roll for me — join the dare room:', url }); return; } catch (_) {}
            }
            try { await navigator.clipboard.writeText(url); alert('Link copied — text it to your buds!'); } catch (_) {}
        });

        $('start-online-game').addEventListener('click', hostStartGame);
        $('leave-lobby').addEventListener('click', () => { p2p && p2p.destroy(); location.hash = ''; location.reload(); });

        // override shared buttons (class methods early-return when online)
        $('roll-dice').addEventListener('click', () => {
            if (!window.__onlineActive) return;
            if (canDrive() && game().gameStarted) netRoll();
        });
        $('take-center-dare').addEventListener('click', () => {
            if (!window.__onlineActive) return;
            if (canDrive()) netTakeCenter();
        });
        $('reset-game').addEventListener('click', () => {
            if (!window.__onlineActive) return;
            if (!isHost()) return;
            broadcastEvent({ kind: 'reset' });
            netReset();
        });

        $('toggle-mic').addEventListener('click', async () => {
            const on = lk ? await lk.toggleMic() : false;
            $('toggle-mic').classList.toggle('media-off', !on);
        });
        $('toggle-cam').addEventListener('click', async () => {
            const on = lk ? await lk.toggleCam() : false;
            $('toggle-cam').classList.toggle('media-off', !on);
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();


