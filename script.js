function renderCompanyEntry(name, count) {
    const entry = document.createElement('div');
    entry.className = 'company-entry';
    entry.innerHTML = `
        <div class="button-column">
            <button onclick="updateCount('${name}', 1)">+</button>
            <button onclick="updateCount('${name}', -1)">-</button>
            <button onclick="undo('${name}')">Undo</button>
            <button onclick="deleteCompany('${name}')" style="background-color:#FF0000;">Delete</button>
        </div>
        <div class="company-name"><strong>${name}</strong></div>
        <div class="count-tile" id="count-${name}">${count}</div>
    `;
    return entry;
}

function addCompany() {
    const name = document.getElementById('companyName').value.trim();
    const count = document.getElementById('recruiterCount').value.trim();

    if (!name || isNaN(count) || count < 0) return;

    fetch('/add_company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, count })
    }).then(() => {
        document.getElementById('companyName').value = '';
        document.getElementById('recruiterCount').value = '';
        loadCompanies();
    });
}

function loadCompanies() {
    fetch('/graph_data')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('companyList');
            list.innerHTML = '';
            Object.keys(data).forEach(name => {
                const entry = renderCompanyEntry(name, data[name]);
                list.appendChild(entry);
            });
        });
}

function updateCount(name, change) {
    fetch('/update_count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, change })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`count-${name}`).innerText = data.count;
        });
}

function undo(name) {
    fetch('/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`count-${name}`).innerText = data.count;
        });
}

function deleteCompany(name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    fetch('/delete_company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }).then(() => {
        loadCompanies();
    });
}

function uploadCSV() {
    const fileInput = document.getElementById('csvFile');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/upload_csv', {
        method: 'POST',
        body: formData
    }).then(() => {
        fileInput.value = '';
        loadCompanies();
    });
}

function searchCompanies() {
    const query = document.getElementById('search').value;
    fetch(`/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('companyList');
            list.innerHTML = '';
            Object.keys(data).forEach(name => {
                const entry = renderCompanyEntry(name, data[name]);
                list.appendChild(entry);
            });
        });
}

document.addEventListener('DOMContentLoaded', loadCompanies);
