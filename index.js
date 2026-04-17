const tokenInput = document.getElementById('token');
const loadBtn = document.getElementById('loadBtn');
const selectAll = document.getElementById('selectAll');
const videoList = document.getElementById('videoList');
const deleteBtn = document.getElementById('deleteBtn');

let videos = [];

loadBtn.addEventListener('click', async () => {
    const token = tokenInput.value.trim();
    if (!token) {
        alert('⚠️ Por favor, insira o token API.');
        return;
    }

    loadBtn.disabled = true;
    loadBtn.textContent = '⏳ Carregando...';

    try {
        const response = await fetch(`https://api-v2.pandavideo.com.br/videos?status=FAILED`, {
            headers: {
                'accept': 'application/json',
                'Authorization': token
            }
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        videos = data.videos ? data.videos : [];

        renderVideos();
    } catch (error) {
        alert('❌ Erro ao carregar vídeos: ' + error.message);
    } finally {
        loadBtn.disabled = false;
        loadBtn.textContent = '📥 Carregar Vídeos Failed';
    }
});

function renderVideos() {
    videoList.innerHTML = '';
    if (videos.length === 0) {
        videoList.innerHTML = '<li class="video-item"><span>📭 Nenhum vídeo failed encontrado.</span></li>';
        return;
    }
    videos.forEach(video => {
        const li = document.createElement('li');
        li.className = 'video-item';
        li.innerHTML = `
            <input type="checkbox" class="video-checkbox" data-id="${video.id}">
            <span>🎬 ${video.title || 'Vídeo sem título'} (ID: ${video.id})</span>
        `;
        videoList.appendChild(li);
    });
}

selectAll.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.video-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
});

deleteBtn.addEventListener('click', async () => {
    const token = tokenInput.value.trim();
    if (!token) {
        alert('⚠️ Por favor, insira o token API.');
        return;
    }

    const selected = document.querySelectorAll('.video-checkbox:checked');
    if (selected.length === 0) {
        alert('⚠️ Selecione pelo menos um vídeo para deletar.');
        return;
    }

    const confirmDelete = confirm(`🗑️ Tem certeza que deseja deletar ${selected.length} vídeo(s)? Esta ação não pode ser desfeita.`);
    if (!confirmDelete) return;

    deleteBtn.disabled = true;
    deleteBtn.textContent = '⏳ Deletando...';

    let deletedCount = 0;
    for (const cb of selected) {
        const videoId = cb.dataset.id;
        try {
            const response = await fetch('https://api-v2.pandavideo.com.br/videos', {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ video_id: videoId })
            });

            if (response.ok) {
                deletedCount++;
            } else {
                throw new Error(`Erro ao deletar vídeo ${videoId}: ${response.status}`);
            }
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }

    alert(`✅ ${deletedCount} vídeo(s) deletado(s) com sucesso.`);
    deleteBtn.disabled = false;
    deleteBtn.textContent = '🗑️ Deletar Selecionados';

    // Recarregar lista
    loadBtn.click();
});
