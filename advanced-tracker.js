// Advanced IMEI Tracker - Frontend JavaScript

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all tab buttons
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Activate button
    event.target.classList.add('active');
}

// Get API endpoint
function getApiEndpoint() {
    return document.getElementById('apiEndpoint').value || 'http://localhost:3000/api';
}

// Show error
function showError(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = '❌ ' + message;
    errorDiv.classList.add('show');
    setTimeout(() => errorDiv.classList.remove('show'), 5000);
}

// Single IMEI Tracking
async function trackSingle() {
    const imei = document.getElementById('imei-single').value.trim();
    const loadingDiv = document.getElementById('loading-single');
    const resultDiv = document.getElementById('result-single');
    const errorDiv = document.getElementById('error-single');
    
    // Reset
    resultDiv.innerHTML = '';
    errorDiv.classList.remove('show');
    
    if (!imei || !/^\d{15}$/.test(imei)) {
        showError('error-single', 'Please enter a valid 15-digit IMEI number');
        return;
    }
    
    loadingDiv.classList.add('show');
    
    try {
        const response = await fetch(`${getApiEndpoint()}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imei })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to track IMEI');
        }
        
        displaySingleResult(data);
    } catch (error) {
        showError('error-single', error.message);
    } finally {
        loadingDiv.classList.remove('show');
    }
}

function displaySingleResult(data) {
    const resultDiv = document.getElementById('result-single');
    
    const html = `
        <div class="result-grid">
            <div class="result-card">
                <h3>📱 Basic Information</h3>
                <div class="result-item">
                    <span class="result-label">IMEI:</span>
                    <span class="result-value">${data.imei}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Status:</span>
                    <span class="result-value">
                        <span class="status-badge status-valid">✓ Valid</span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">TAC:</span>
                    <span class="result-value">${data.components.tac}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Serial:</span>
                    <span class="result-value">${data.components.serialNumber}</span>
                </div>
            </div>
            
            <div class="result-card">
                <h3>📲 Device Details</h3>
                <div class="result-item">
                    <span class="result-label">Manufacturer:</span>
                    <span class="result-value">${data.device.manufacturer}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Model:</span>
                    <span class="result-value">${data.device.model}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Year:</span>
                    <span class="result-value">${data.device.year}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">OS:</span>
                    <span class="result-value">${data.device.os}</span>
                </div>
            </div>
            
            <div class="result-card">
                <h3>🔒 Security Status</h3>
                <div class="result-item">
                    <span class="result-label">Stolen:</span>
                    <span class="result-value">
                        <span class="status-badge ${data.status.stolen ? 'status-stolen' : 'status-valid'}">
                            ${data.status.stolen ? '⚠️ Reported' : '✓ Clean'}
                        </span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">Blacklisted:</span>
                    <span class="result-value">
                        <span class="status-badge ${data.status.blacklisted ? 'status-invalid' : 'status-valid'}">
                            ${data.status.blacklisted ? '❌ Yes' : '✓ No'}
                        </span>
                    </span>
                </div>
            </div>
            
            <div class="result-card">
                <h3>🛡️ Warranty Status</h3>
                <div class="result-item">
                    <span class="result-label">Status:</span>
                    <span class="result-value">
                        <span class="status-badge ${data.status.warranty.status === 'Active' ? 'status-active' : 'status-invalid'}">
                            ${data.status.warranty.status}
                        </span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">Expiry:</span>
                    <span class="result-value">${data.status.warranty.expiryDate}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Days Left:</span>
                    <span class="result-value">${data.status.warranty.remainingDays}</span>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = html;
}

// Batch Validation
async function trackBatch() {
    const imeiText = document.getElementById('imei-batch').value.trim();
    const loadingDiv = document.getElementById('loading-batch');
    const resultDiv = document.getElementById('result-batch');
    const errorDiv = document.getElementById('error-batch');
    
    resultDiv.innerHTML = '';
    errorDiv.classList.remove('show');
    
    if (!imeiText) {
        showError('error-batch', 'Please enter at least one IMEI number');
        return;
    }
    
    const imeis = imeiText.split('\n').map(i => i.trim()).filter(i => i);
    
    if (imeis.length > 50) {
        showError('error-batch', 'Maximum 50 IMEIs allowed per batch');
        return;
    }
    
    loadingDiv.classList.add('show');
    
    try {
        const response = await fetch(`${getApiEndpoint()}/batch-validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imeis })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to validate batch');
        }
        
        displayBatchResult(data);
    } catch (error) {
        showError('error-batch', error.message);
    } finally {
        loadingDiv.classList.remove('show');
    }
}

function displayBatchResult(data) {
    const resultDiv = document.getElementById('result-batch');
    
    let html = `
        <div style="margin-top: 30px;">
            <div class="result-card">
                <h3>📊 Batch Summary</h3>
                <div class="result-item">
                    <span class="result-label">Total:</span>
                    <span class="result-value">${data.total}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Valid:</span>
                    <span class="result-value"><span class="status-badge status-valid">${data.valid}</span></span>
                </div>
                <div class="result-item">
                    <span class="result-label">Invalid:</span>
                    <span class="result-value"><span class="status-badge status-invalid">${data.invalid}</span></span>
                </div>
            </div>
            
            <h3 style="margin: 30px 0 15px; color: #7e22ce;">📋 Results</h3>
            <div class="batch-results">
    `;
    
    data.results.forEach(result => {
        html += `
            <div class="batch-item">
                <div>
                    <strong>${result.imei}</strong><br>
                    <small style="color: #666;">${result.manufacturer} - ${result.model}</small>
                </div>
                <span class="status-badge ${result.valid ? 'status-valid' : 'status-invalid'}">
                    ${result.valid ? '✓ Valid' : '❌ Invalid'}
                </span>
            </div>
        `;
    });
    
    html += '</div></div>';
    resultDiv.innerHTML = html;
}

// Device History
async function trackHistory() {
    const imei = document.getElementById('imei-history').value.trim();
    const loadingDiv = document.getElementById('loading-history');
    const resultDiv = document.getElementById('result-history');
    const errorDiv = document.getElementById('error-history');
    
    resultDiv.innerHTML = '';
    errorDiv.classList.remove('show');
    
    if (!imei || !/^\d{15}$/.test(imei)) {
        showError('error-history', 'Please enter a valid 15-digit IMEI number');
        return;
    }
    
    loadingDiv.classList.add('show');
    
    try {
        const response = await fetch(`${getApiEndpoint()}/history/${imei}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch history');
        }
        
        displayHistoryResult(data);
    } catch (error) {
        showError('error-history', error.message);
    } finally {
        loadingDiv.classList.remove('show');
    }
}

function displayHistoryResult(data) {
    const resultDiv = document.getElementById('result-history');
    
    let html = `
        <div style="margin-top: 30px;">
            <h3 style="color: #7e22ce; margin-bottom: 20px;">📜 Device History (${data.totalEvents} events)</h3>
            <div class="history-timeline">
    `;
    
    data.history.forEach(event => {
        html += `
            <div class="history-item">
                <strong style="color: #7e22ce;">${event.event}</strong><br>
                <small style="color: #666;">📅 ${event.date}</small><br>
                <small style="color: #666;">📍 ${event.location}</small><br>
                <small style="color: #666;">📡 ${event.carrier}</small>
            </div>
        `;
    });
    
    html += '</div></div>';
    resultDiv.innerHTML = html;
}

// Carrier Lock Status
async function trackCarrier() {
    const imei = document.getElementById('imei-carrier').value.trim();
    const loadingDiv = document.getElementById('loading-carrier');
    const resultDiv = document.getElementById('result-carrier');
    const errorDiv = document.getElementById('error-carrier');
    
    resultDiv.innerHTML = '';
    errorDiv.classList.remove('show');
    
    if (!imei || !/^\d{15}$/.test(imei)) {
        showError('error-carrier', 'Please enter a valid 15-digit IMEI number');
        return;
    }
    
    loadingDiv.classList.add('show');
    
    try {
        const response = await fetch(`${getApiEndpoint()}/carrier-lock/${imei}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to check carrier lock');
        }
        
        displayCarrierResult(data);
    } catch (error) {
        showError('error-carrier', error.message);
    } finally {
        loadingDiv.classList.remove('show');
    }
}

function displayCarrierResult(data) {
    const resultDiv = document.getElementById('result-carrier');
    
    const html = `
        <div class="result-grid" style="margin-top: 30px;">
            <div class="result-card">
                <h3>🔒 Carrier Lock Status</h3>
                <div class="result-item">
                    <span class="result-label">IMEI:</span>
                    <span class="result-value">${data.imei}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Locked:</span>
                    <span class="result-value">
                        <span class="status-badge ${data.locked ? 'status-invalid' : 'status-valid'}">
                            ${data.locked ? '🔒 Locked' : '🔓 Unlocked'}
                        </span>
                    </span>
                </div>
                <div class="result-item">
                    <span class="result-label">Carrier:</span>
                    <span class="result-value">${data.carrier}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">SIM Lock:</span>
                    <span class="result-value">${data.simLockStatus}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Can Unlock:</span>
                    <span class="result-value">
                        <span class="status-badge ${data.canUnlock ? 'status-valid' : 'status-invalid'}">
                            ${data.canUnlock ? '✓ Yes' : '❌ No'}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = html;
}

// Auto-format IMEI inputs
document.querySelectorAll('input[id^="imei-"]').forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
});