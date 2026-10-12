let listData = { demons: [] };
let currentSelectedDemon = null;
let selectedPlayerName = null;

let currentPrimaryColor = localStorage.getItem('gd_theme_color') || '#2563eb';

let rouletteState = {
    active: false,
    currentPercentage: 1,
    currentDemon: null
};

function changeThemeColor(event) {
    currentPrimaryColor = event.target.value;
    localStorage.setItem('gd_theme_color', currentPrimaryColor);
    applyDynamicTheme();
}

function applyDynamicTheme() {
    const colorPicker = document.getElementById('color-picker');
    if (colorPicker) colorPicker.value = currentPrimaryColor;

    const header = document.getElementById('main-header');
    if (header) header.style.backgroundColor = currentPrimaryColor;

    const countEl = document.getElementById('total-demons-count');
    if (countEl) {
        countEl.style.backgroundColor = `${currentPrimaryColor}22`;
        countEl.style.color = currentPrimaryColor;
        countEl.style.borderColor = `${currentPrimaryColor}55`;
    }

    renderList();
    renderDetail();
    renderPlayers();
    updateRouletteUI();
}

async function loadConfig() {
    try {
        const response = await fetch('database/demonlistinfo.json');
        if (response.ok) {
            const config = await response.json();
            
            // Cargar el nombre de la Demon List
            if (config.name) {
                const titleEl = document.getElementById('header-title');
                if (titleEl) titleEl.innerText = config.name;
                document.title = config.name;
            }

            // Cargar la versión actual en el header de manera segura para HTTPS
            if (config.currentVersion) {
                const headerNav = document.querySelector('#main-header .flex.items-center.space-x-6');
                if (headerNav && !document.getElementById('version-badge')) {
                    const badge = document.createElement('div');
                    badge.id = 'version-badge';
                    badge.className = "text-xs bg-black/20 px-2.5 py-1 rounded-lg border border-white/20 font-mono";
                    badge.innerText = `v${config.currentVersion}`;
                    headerNav.prepend(badge);
                }
            }
        }
    } catch (e) {
        console.warn('Could not load demonlistinfo.json');
    }
}

async function loadDemonList() {
    await loadConfig();
    try {
        const listResponse = await fetch('database/List.json');
        if (!listResponse.ok) throw new Error("Could not load List.json");
        
        const levelNames = await listResponse.json();
        const demonsArray = [];

        if (Array.isArray(levelNames)) {
            for (let i = 0; i < levelNames.length; i++) {
                const levelName = levelNames[i];
                const fileName = levelName.toLowerCase().replace(/\s+/g, '') + '.json';
                
                try {
                    const response = await fetch(`database/${fileName}`);
                    if (response.ok) {
                        const levelData = await response.json();
                        levelData.position = i + 1;
                        demonsArray.push(levelData);
                    }
                } catch (e) {
                    console.warn(`Could not load level file ${fileName}`);
                }
            }
        }

        listData.demons = demonsArray;
        
        if (listData.demons.length > 0 && !currentSelectedDemon) {
            currentSelectedDemon = listData.demons[0];
        }

        applyDynamicTheme();
    } catch (error) {
        console.error('Error loading Demon List:', error);
        const container = document.getElementById('demon-list-container');
        if (container) {
            container.innerHTML = `<div class="p-4 text-xs text-red-500 italic">Error loading list / Error al cargar lista.</div>`;
        }
    }
}

function renderList() {
    const container = document.getElementById('demon-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (listData.demons.length === 0) {
        container.innerHTML = `<div class="p-4 text-xs text-gray-400 italic">No levels loaded / No hay niveles cargados.</div>`;
        return;
    }

    listData.demons.forEach(demon => {
        const isSelected = currentSelectedDemon && currentSelectedDemon.id === demon.id;
        const item = document.createElement('div');
        
        let customStyle = "display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; cursor: pointer; transition: all 0.2s;";
        if (isSelected) {
            customStyle += ` background-color: rgba(0, 0, 0, 0.05); border-left: 4px solid ${currentPrimaryColor};`;
        } else {
            customStyle += ` background-color: transparent;`;
        }

        item.style.cssText = customStyle;
        item.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="font-black text-gray-500 text-sm w-6 font-mono">#${demon.position}</span>
                <span class="font-bold text-black">${demon.name}</span>
            </div>
            <span class="text-xs text-white px-2.5 py-1 rounded-md font-bold shadow-sm" style="background-color: ${currentPrimaryColor};">#${demon.position}</span>
        `;
        item.onclick = () => {
            currentSelectedDemon = demon;
            renderList();
            renderDetail();
        };
        container.appendChild(item);
    });
}

function renderDetail() {
    const detailContainer = document.getElementById('demon-detail');
    if (!detailContainer) return;
    
    if (!currentSelectedDemon) {
        detailContainer.innerHTML = `<p class="text-gray-400 italic">Select a level / Selecciona un nivel.</p>`;
        return;
    }

    const d = currentSelectedDemon;
    let embedUrl = (d.verificationVideo || "").replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];

    detailContainer.innerHTML = `
        <div class="mb-6">
            <h2 class="text-4xl font-black text-black mb-3 tracking-tight">${d.name}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-1 text-xs font-extrabold tracking-wider text-gray-600 mb-6">
                <div>CREATOR & VERIFIER / CREADOR Y VERIFICADOR: <span class="text-black">${d.verifier || d.publisher}</span></div>
                <div>PUBLISHER / PUBLICADOR: <span class="text-black">${d.publisher}</span></div>
            </div>
        </div>

        <div class="mb-6 w-full aspect-video bg-black rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <iframe class="w-full h-full" src="${embedUrl}" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-8 text-center font-black tracking-wider uppercase text-xs">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-gray-500 mb-1 text-[10px]">Points / Puntos</div>
                <div class="text-base text-black font-mono">${d.points}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-gray-500 mb-1 text-[10px]">Level ID</div>
                <div class="text-base text-black font-mono">${d.levelId || 'N/A'}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div class="text-gray-500 mb-1 text-[10px]">Password / Contraseña</div>
                <div class="text-base text-black font-mono">${d.password || 'Free To Copy'}</div>
            </div>
        </div>

        <div>
            <h3 class="text-2xl font-black text-black mb-2">Records / Récords</h3>
            <p class="text-xs font-bold text-gray-500 mb-4">100% or better to qualify / 100% o más para calificar</p>
            <div class="space-y-3">
                ${d.records && d.records.length > 0 ? d.records.map(r => `
                    <div class="flex justify-between items-center bg-gray-50 px-5 py-3 rounded-xl border border-gray-200">
                        <div>
                            <span class="font-bold text-black">${r.player}</span>
                            <span class="text-xs text-gray-500 ml-2 font-mono">(${r.progress}%)</span>
                        </div>
                        <a href="${r.video}" target="_blank" style="color: ${currentPrimaryColor};" class="text-xs font-bold hover:underline">View Proof / Ver Prueba</a>
                    </div>
                `).join('') : `<p class="text-xs text-gray-400 italic">No records registered / No hay récords registrados.</p>`}
            </div>
        </div>
    `;
}

function renderPlayers() {
    const playersTableBody = document.getElementById('players-table-body');
    if (!playersTableBody) return;
    playersTableBody.innerHTML = '';
    const playerStats = {};

    listData.demons.forEach(demon => {
        if (demon.verifier) {
            if (!playerStats[demon.verifier]) {
                playerStats[demon.verifier] = { name: demon.verifier, totalPoints: 0, completedDemons: 0, records: [], verifications: [] };
            }
            playerStats[demon.verifier].verifications.push(demon);
        }

        if (demon.records) {
            demon.records.forEach(record => {
                if (!playerStats[record.player]) {
                    playerStats[record.player] = { name: record.player, totalPoints: 0, completedDemons: 0, records: [], verifications: [] };
                }
                playerStats[record.player].records.push({ demon, progress: record.progress, video: record.video });
                if (record.progress === 100) {
                    playerStats[record.player].totalPoints += demon.points;
                    playerStats[record.player].completedDemons += 1;
                }
            });
        }
    });

    const sortedPlayers = Object.values(playerStats).sort((a, b) => b.totalPoints - a.totalPoints);

    if (sortedPlayers.length === 0) {
        playersTableBody.innerHTML = `<tr><td colspan="3" class="py-8 text-center text-gray-400 italic">No records registered / No hay récords.</td></tr>`;
        return;
    }

    sortedPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-100 transition-all cursor-pointer";
        row.innerHTML = `
            <td class="py-4 px-6 font-black text-gray-500 font-mono">#${index + 1}</td>
            <td style="color: ${currentPrimaryColor};" class="py-4 px-6 font-bold">${player.name}</td>
            <td class="py-4 px-6 font-black text-black font-mono">${player.totalPoints} pts</td>
        `;
        row.onclick = () => renderPlayerDetail(player);
        playersTableBody.appendChild(row);
    });

    if (selectedPlayerName) {
        const activePlayer = sortedPlayers.find(p => p.name === selectedPlayerName);
        if (activePlayer) renderPlayerDetail(activePlayer);
    }
}

function renderPlayerDetail(player) {
    selectedPlayerName = player.name;
    const container = document.getElementById('player-detail');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-left w-full">
            <h3 class="text-2xl font-black text-black mb-1">${player.name}</h3>
            <p style="color: ${currentPrimaryColor};" class="text-xs font-bold mb-6 font-mono">Total Score / Puntuación: ${player.totalPoints} Pts | Demons: ${player.completedDemons}</p>
            
            <h4 class="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider font-mono">Verifications / Verificaciones</h4>
            <div class="space-y-2 mb-6 max-h-40 overflow-y-auto">
                ${player.verifications.length > 0 ? player.verifications.map(v => `
                    <div class="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center text-sm">
                        <span class="font-semibold text-black">#${v.position} -${v.name}</span>
                        <span style="color: ${currentPrimaryColor};" class="text-xs font-mono font-bold">+${v.points} pts</span>
                    </div>
                `).join('') : `<p class="text-xs text-gray-400 italic">None / Ninguna</p>`}
            </div>

            <h4 class="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider font-mono">Records / Récords</h4>
            <div class="space-y-2 max-h-48 overflow-y-auto">
                ${player.records.length > 0 ? player.records.map(r => `
                    <div class="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center text-sm">
                        <div>
                            <span class="font-semibold text-black">#${r.demon.position} -${r.demon.name}</span>
                            <span class="text-xs text-gray-500 ml-2 font-mono">(${r.progress}%)</span>
                        </div>
                        <a href="${r.video}" target="_blank" style="color: ${currentPrimaryColor};" class="text-xs font-bold hover:underline">View / Ver</a>
                    </div>
                `).join('') : `<p class="text-xs text-gray-400 italic">None / Ninguno</p>`}
            </div>
        </div>
    `;
}

function startRoulette() {
    if (listData.demons.length === 0) return;
    rouletteState.active = true;
    rouletteState.currentPercentage = 1;
    pickRandomDemonForRoulette();
}

function pickRandomDemonForRoulette() {
    const randomIndex = Math.floor(Math.random() * listData.demons.length);
    rouletteState.currentDemon = listData.demons[randomIndex];
    updateRouletteUI();
}

function updateRouletteUI() {
    const statusEl = document.getElementById('roulette-status');
    const infoEl = document.getElementById('roulette-level-info');
    const progressEl = document.getElementById('roulette-progress-target');
    const controlsEl = document.getElementById('roulette-controls');

    if (!statusEl || !controlsEl) return;

    if (!rouletteState.active) {
        statusEl.style.color = currentPrimaryColor;
        statusEl.innerText = "Press start to begin / Presiona iniciar";
        if (infoEl) infoEl.innerHTML = "";
        if (progressEl) progressEl.innerText = "Target / Objetivo: 1%";
        
        controlsEl.innerHTML = `<button onclick="startRoulette()" style="background-color: ${currentPrimaryColor}; color: #fff;" class="px-6 py-3 font-bold rounded-xl shadow-md transition-all cursor-pointer font-mono">Start Roulette / Iniciar</button>`;
        return;
    }

    statusEl.style.color = currentPrimaryColor;
    statusEl.innerText = "Assigned Level / Nivel Asignado:";
    if (infoEl) infoEl.innerHTML = `<span class="text-xl font-extrabold text-black">#${rouletteState.currentDemon.position} - ${rouletteState.currentDemon.name}</span><br><span class="text-xs text-gray-500">Creator / Creador: ${rouletteState.currentDemon.publisher}</span>`;
    if (progressEl) progressEl.innerText = `Target progress / Progreso: ${rouletteState.currentPercentage}%`;

    controlsEl.innerHTML = `
        <div class="flex flex-col items-center gap-3 w-full">
            <div class="flex items-center gap-2">
                <input type="number" id="roulette-input-progress" placeholder="Ex: ${rouletteState.currentPercentage}" class="bg-white border border-gray-300 rounded-xl px-4 py-2 text-black font-bold text-center w-36 focus:outline-none font-mono" />
                <span class="text-gray-700 font-bold">%</span>
            </div>
            <div class="flex gap-3">
                <button onclick="confirmRouletteProgress()" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer font-mono">Confirm / Confirmar</button>
                <button onclick="startRoulette()" class="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-xl border border-red-200 transition-all cursor-pointer font-mono">Restart / Reiniciar</button>
            </div>
        </div>
    `;
}

function confirmRouletteProgress() {
    const inputEl = document.getElementById('roulette-input-progress');
    if (!inputEl) return;

    const enteredValue = parseInt(inputEl.value);

    if (enteredValue !== rouletteState.currentPercentage) {
        alert(`You must enter exactly ${rouletteState.currentPercentage}% / Debes ingresar exactamente ${rouletteState.currentPercentage}%`);
        return;
    }

    if (rouletteState.currentPercentage >= 100) {
        alert("Congratulations! Completed 100% / ¡Felicidades! Completado 100%");
        rouletteState.active = false;
        updateRouletteUI();
        return;
    }

    rouletteState.currentPercentage += 1;
    pickRandomDemonForRoulette();
}

function exportRoulette() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rouletteState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "roulette_save.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importRoulette(event) {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = e => {
            try {
                const parsedData = JSON.parse(e.target.result);
                rouletteState = parsedData;
                updateRouletteUI();
                alert("Imported successfully / Importado con éxito");
            } catch (error) {
                alert("Invalid JSON / JSON no válido");
            }
        };
    }
}

function switchTab(tab) {
    const views = {
        list: document.getElementById('view-list'),
        players: document.getElementById('view-players'),
        roulette: document.getElementById('view-roulette')
    };

    const buttons = {
        list: document.getElementById('btn-list'),
        players: document.getElementById('btn-players'),
        roulette: document.getElementById('btn-roulette')
    };

    Object.keys(views).forEach(key => {
        if (views[key]) views[key].classList.remove('active-view');
        if (buttons[key]) {
            buttons[key].style.fontWeight = 'normal';
            buttons[key].style.textDecoration = 'none';
        }
    });

    if (views[tab]) views[tab].classList.add('active-view');
    if (buttons[tab]) {
        buttons[tab].style.fontWeight = 'bold';
        buttons[tab].style.textDecoration = 'underline';
    }
}

window.startRoulette = startRoulette;
window.confirmRouletteProgress = confirmRouletteProgress;
window.exportRoulette = exportRoulette;
window.importRoulette = importRoulette;
window.switchTab = switchTab;
window.changeThemeColor = changeThemeColor;

document.addEventListener('DOMContentLoaded', () => {
    loadDemonList();
});
