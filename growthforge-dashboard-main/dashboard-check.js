
        const API_BASE = "http://localhost:10000";
        const API = `${API_BASE}/leads`;
        const CONV_API = `${API_BASE}/conversations`;
        const TEAM_PASSWORD = "growthforge2025";

        let allLeads = [];
        let currentLead = null;

        // AUTH
        function doLogin() {
            const val = document.getElementById('pwd-input').value;
            const err = document.getElementById('login-err');
            if (val === TEAM_PASSWORD) {
                sessionStorage.setItem('gf_auth', '1');
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('dashboard-screen').style.display = 'block';
                err.style.display = 'none';
                loadData();
            } else {
                err.style.display = 'block';
                document.getElementById('pwd-input').value = '';
                document.getElementById('pwd-input').focus();
            }
        }

        function doLogout() {
            sessionStorage.removeItem('gf_auth');
            location.reload();
        }

        if (sessionStorage.getItem('gf_auth') === '1') {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('dashboard-screen').style.display = 'block';
            loadData();
        }

        // HELPERS
        function fmtDate(str) {
            if (!str) return '-';
            return new Date(str).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        }

        function stageBadge(stage) {
            const s = stage || 'AWARENESS';
            return `<span class="s-badge s-${s}">${s.replace('_', ' ')}</span>`;
        }

        function intentPill(intent) {
            if (!intent) return '-';
            return `<span class="i-pill">${intent}</span>`;
        }

        function statusBadge(status) {
            const safeStatus = (status || 'new').toLowerCase();
            return `<span class="status-badge status-${safeStatus}">${safeStatus.replace('_', ' ')}</span>`;
        }

        function scoreBadge(score) {
            const s = score || 0;
            const color = s >= 8 ? '#00C48C' : s >= 5 ? '#FFD700' : s >= 3 ? '#1E90FF' : '#aaa';
            return `<span class="score-badge" style="
                background:${color}22;color:${color};
                border:1px solid ${color}44;">${s}/10</span>`;
        }

        function escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function normalizeIntent(intent) {
            const raw = (intent || 'General').toString().trim();
            if (!raw) return 'General';
            return raw
                .replace(/_/g, ' ')
                .toLowerCase()
                .replace(/\b\w/g, (ch) => ch.toUpperCase());
        }

        function getFilteredLeads() {
            const search = (document.getElementById('search-filter')?.value || '').trim().toLowerCase();
            const stage = document.getElementById('stage-filter')?.value || '';
            const status = document.getElementById('status-filter')?.value || '';
            const intent = document.getElementById('intent-filter')?.value || '';

            return allLeads.filter((lead) => {
                const searchable = [
                    lead.name,
                    lead.business,
                    lead.email,
                    lead.phone,
                    lead.conversation_summary,
                    lead.intent,
                    lead.stage
                ].join(' ').toLowerCase();

                const matchesSearch = !search || searchable.includes(search);
                const matchesStage = !stage || (lead.stage || '') === stage;
                const matchesStatus = !status || (lead.status || 'new') === status;
                const matchesIntent = !intent || normalizeIntent(lead.intent) === intent;

                return matchesSearch && matchesStage && matchesStatus && matchesIntent;
            });
        }

        function populateIntentFilter() {
            const select = document.getElementById('intent-filter');
            if (!select) return;

            const current = select.value;
            const intents = [...new Set(allLeads.map((lead) => normalizeIntent(lead.intent)).filter(Boolean))].sort();
            select.innerHTML = '<option value="">All intents</option>' +
                intents.map((intent) => `<option value="${escapeHtml(intent)}">${escapeHtml(intent)}</option>`).join('');

            if (intents.includes(current)) {
                select.value = current;
            }
        }

        function renderIntentChart(leads) {
            const target = document.getElementById('intent-chart');
            if (!target) return;

            if (!leads.length) {
                target.innerHTML = `<div class="empty-state" style="padding:20px 0;"><p>No intent data for the current filters.</p></div>`;
                return;
            }

            const counts = {};
            leads.forEach((lead) => {
                const label = normalizeIntent(lead.intent);
                counts[label] = (counts[label] || 0) + 1;
            });

            const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            const max = rows[0]?.[1] || 1;

            target.innerHTML = rows.map(([label, count]) => `
                <div class="intent-row">
                    <div class="intent-label">${escapeHtml(label)}</div>
                    <div class="intent-track">
                        <div class="intent-fill" style="width:${Math.max((count / max) * 100, 8)}%"></div>
                    </div>
                    <div class="intent-count">${count}</div>
                </div>
            `).join('');
        }

        function renderHotQueue(leads) {
            const target = document.getElementById('hot-queue');
            if (!target) return;

            const ranked = [...leads]
                .filter((lead) => (lead.lead_score || 0) >= 8 || lead.stage === 'DECISION' || (lead.status || 'new') === 'new')
                .sort((a, b) => {
                    const scoreDiff = (b.lead_score || 0) - (a.lead_score || 0);
                    if (scoreDiff !== 0) return scoreDiff;
                    return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
                })
                .slice(0, 5);

            if (!ranked.length) {
                target.innerHTML = `<div class="empty-state" style="padding:20px 0;"><p>No leads match this queue yet.</p></div>`;
                return;
            }

            target.innerHTML = ranked.map((lead) => {
                const summary = lead.conversation_summary || 'Fresh lead with limited summary.';
                const shortSummary = summary.length > 120 ? `${summary.slice(0, 117)}...` : summary;
                return `
                    <div class="hot-item" onclick="openPanel('${lead.session_id}')">
                        <div class="hot-topline">
                            <div class="hot-name">${escapeHtml(lead.name || lead.business || 'Anonymous Visitor')}</div>
                            ${scoreBadge(lead.lead_score)}
                        </div>
                        <div class="hot-summary">${escapeHtml(shortSummary)}</div>
                        <div class="hot-meta">
                            ${stageBadge(lead.stage)}
                            ${statusBadge(lead.status)}
                            ${intentPill(lead.intent)}
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderDashboard() {
            const visibleLeads = getFilteredLeads();
            const chartLeads = visibleLeads.length ? visibleLeads : allLeads;

            renderIntentChart(chartLeads);
            renderHotQueue(chartLeads);

            if (visibleLeads.length === 0) {
                document.getElementById('tbl-wrap').innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">...</div>
                        <p>No leads match your current filters.</p>
                    </div>`;
                document.getElementById('tl-wrap').innerHTML = `
                    <div class="empty-state">
                        <p>No timeline entries for the current view.</p>
                    </div>`;
                return;
            }

            const sorted = [...visibleLeads].sort((a, b) => {
                const sd = (b.lead_score || 0) - (a.lead_score || 0);
                if (sd !== 0) return sd;
                return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
            });

            let tbl = `<table><thead><tr>
                <th>#</th><th>Score</th><th>Name</th>
                <th>Business</th><th>Email</th><th>Phone</th>
                <th>Intent</th><th>Stage</th><th>Status</th><th>Summary</th>
                <th>Captured</th>
            </tr></thead><tbody>`;

            sorted.forEach((lead, i) => {
                const summary = lead.conversation_summary || '-';
                const truncated = summary.length > 52 ? `${summary.substring(0, 52)}...` : summary;

                tbl += `<tr onclick="openPanel('${lead.session_id}')">
                    <td style="color:var(--gf-faint);font-size:12px;">
                        ${sorted.length - i}
                    </td>
                    <td>${scoreBadge(lead.lead_score)}</td>
                    <td><strong>${escapeHtml(lead.name || '-')}</strong></td>
                    <td>${escapeHtml(lead.business || '-')}</td>
                    <td style="color:var(--gf-brand-deep);">${escapeHtml(lead.email || '-')}</td>
                    <td>${escapeHtml(lead.phone || '-')}</td>
                    <td>${intentPill(lead.intent)}</td>
                    <td>${stageBadge(lead.stage)}</td>
                    <td>${statusBadge(lead.status)}</td>
                    <td style="color:var(--gf-muted);font-size:12px;" title="${escapeHtml(summary)}">
                        ${escapeHtml(truncated)}
                    </td>
                    <td style="color:var(--gf-faint);font-size:12px;white-space:nowrap;">
                        ${fmtDate(lead.timestamp)}
                    </td>
                </tr>`;
            });

            tbl += `</tbody></table>`;
            document.getElementById('tbl-wrap').innerHTML = tbl;

            const chrono = [...visibleLeads].sort((a, b) =>
                new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
            let tl = '';
            chrono.forEach((lead) => {
                const isDecision = lead.stage === 'DECISION';
                const isCaptured = lead.stage === 'captured';
                const isObjec = lead.intent === 'OBJECTION';
                const cls = isCaptured ? 't-captured' :
                    isDecision ? 't-decision' :
                        isObjec ? 't-objection' : '';
                const score = lead.lead_score || 0;

                tl += `<div class="t-item ${cls}"
                    onclick="openPanel('${lead.session_id}')"
                    style="cursor:pointer;">
                    <div class="t-title">
                        ${escapeHtml(lead.name || 'Anonymous Visitor')}
                        ${lead.business
                            ? `<span style="color:var(--gf-muted);font-weight:500;">- ${escapeHtml(lead.business)}</span>` : ''}
                        ${stageBadge(lead.stage)}
                        ${scoreBadge(score)}
                    </div>
                    <div class="t-meta">
                        Intent: <strong style="color:var(--gf-text)">
                            ${escapeHtml(normalizeIntent(lead.intent))}
                        </strong> &nbsp;·&nbsp;
                        ${escapeHtml(lead.conversation_summary || 'No summary')}
                        &nbsp;·&nbsp; ${fmtDate(lead.timestamp)}
                        ${lead.email
                            ? `&nbsp;·&nbsp;<span style="color:var(--gf-brand-deep)">${escapeHtml(lead.email)}</span>` : ''}
                    </div>
                </div>`;
            });

            document.getElementById('tl-wrap').innerHTML =
                tl || '<div class="empty-state"><p>No data</p></div>';
        }

        // LOAD DATA
        async function loadData() {
            try {
                const res = await fetch(API);
                if (!res.ok) throw new Error(`Status: ${res.status}`);
                const data = await res.json();
                allLeads = data.leads || [];

                document.getElementById('last-updated').textContent =
                    'Updated ' + new Date().toLocaleTimeString();

                document.getElementById('s-total').textContent = data.total || 0;
                document.getElementById('s-decision').textContent =
                    allLeads.filter(l => l.stage === 'DECISION' || l.stage === 'captured').length;
                document.getElementById('s-consideration').textContent =
                    allLeads.filter(l => l.stage === 'CONSIDERATION').length;
                document.getElementById('s-hot').textContent =
                    allLeads.filter(l => (l.lead_score || 0) >= 8).length;
                const today = new Date().toDateString();
                document.getElementById('s-today').textContent =
                    allLeads.filter(l => l.timestamp &&
                        new Date(l.timestamp).toDateString() === today).length;

                populateIntentFilter();

                if (allLeads.length === 0) {
                    document.getElementById('intent-chart').innerHTML = `
                        <div class="empty-state" style="padding:20px 0;">
                            <p>No intent data yet.</p>
                        </div>`;
                    document.getElementById('hot-queue').innerHTML = `
                        <div class="empty-state" style="padding:20px 0;">
                            <p>No hot leads yet.</p>
                        </div>`;
                    document.getElementById('tbl-wrap').innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">...</div>
                            <p>No leads yet. Start a chat on the website.</p>
                        </div>`;
                    document.getElementById('tl-wrap').innerHTML = `
                        <div class="empty-state">
                            <p>Timeline appears as leads come in.</p>
                        </div>`;
                    return;
                }

                renderDashboard();

            } catch (err) {
                const errHTML = `<div class="empty-state">
                    <div class="empty-icon">!</div>
                    <p>Cannot connect to backend.</p>
                </div>`;
                const miniErrHTML = `<div class="empty-state" style="padding:20px 0;">
                    <p>Cannot connect to backend.</p>
                </div>`;
                const intentChart = document.getElementById('intent-chart');
                const hotQueue = document.getElementById('hot-queue');
                if (intentChart) intentChart.innerHTML = miniErrHTML;
                if (hotQueue) hotQueue.innerHTML = miniErrHTML;
                document.getElementById('tbl-wrap').innerHTML = errHTML;
                document.getElementById('tl-wrap').innerHTML = errHTML;
                console.error('Dashboard error:', err);
            }
        }

        // DETAIL PANEL
        // Fetches transcript from Supabase via /conversations endpoint
        async function openPanel(sessionId) {
            currentLead = allLeads.find(l => l.session_id === sessionId);
            if (!currentLead) return;

            const lead = currentLead;
            const panel = document.getElementById('detail-panel');
            const body = document.getElementById('panel-body');

            document.getElementById('panel-title').textContent =
                lead.name ? `${lead.name}'s Lead` : 'Lead Details';

            let html = '';

            html += `<div class="panel-section">
                <div class="panel-section-title">Lead Overview</div>
                <div class="lead-overview-strip">
                    ${scoreBadge(lead.lead_score)}
                    ${stageBadge(lead.stage)}
                    ${statusBadge(lead.status)}
                    ${intentPill(lead.intent)}
                </div>`;

            if (lead.conversation_summary) {
                html += `<div class="summary-box">
                    ${escapeHtml(lead.conversation_summary)}
                </div>`;
            } else {
                html += `<div class="faint-note">No summary available yet for this lead.</div>`;
            }
            html += `</div>`;

            if (lead.lead_score_reason || lead.next_action) {
                html += `<div class="panel-section">
                    <div class="panel-section-title">Why This Lead Matters</div>
                    ${lead.lead_score_reason
                        ? `<div class="summary-box" style="margin-bottom:12px;">${escapeHtml(lead.lead_score_reason)}</div>`
                        : ''}
                    ${lead.next_action
                        ? `<div class="detail-row">
                            <span class="detail-label">Next Action</span>
                            <span class="detail-value">${escapeHtml(lead.next_action)}</span>
                        </div>`
                        : ''}
                </div>`;
            }

            html += `<div class="panel-section">
                <div class="panel-section-title">Engagement Signals</div>`;
            const engagement = [
                ['Message Count', lead.message_count ?? '-'],
                ['Meaningful Messages', lead.meaningful_message_count ?? '-'],
                ['Objections Raised', lead.objection_count ?? '-'],
                ['Last Intent', normalizeIntent(lead.intent)],
            ];
            engagement.forEach(([label, value]) => {
                html += `<div class="detail-row">
                    <span class="detail-label">${label}</span>
                    <span class="detail-value">${escapeHtml(value)}</span>
                </div>`;
            });
            html += `</div>`;

            html += `<div class="panel-section">
                <div class="panel-section-title">Contact Details</div>`;
            const details = [
                ['Name', lead.name || '-'],
                ['Email', lead.email || '-'],
                ['Phone', lead.phone || '-'],
                ['Business', lead.business || '-'],
                ['Status', (lead.status || 'new').replace('_', ' ')],
                ['Captured', fmtDate(lead.timestamp)],
                ['Last Updated', fmtDate(lead.last_updated)],
            ];
            details.forEach(([label, value]) => {
                html += `<div class="detail-row">
                    <span class="detail-label">${label}</span>
                    <span class="detail-value">${escapeHtml(value)}</span>
                </div>`;
            });
            html += `</div>`;

            html += `<div class="panel-section" id="transcript-section">
                <div class="panel-section-title">
                    Full Conversation Transcript
                </div>
                <div id="transcript-content">
                    <div class="loading-transcript">Loading transcript...</div>
                </div>
            </div>`;

            body.innerHTML = html;
            panel.classList.add('open');
            document.getElementById('panel-overlay').classList.add('active');
            updateMarkButtonState(lead.status);

            try {
                const res = await fetch(`${CONV_API}/${sessionId}`);
                const data = await res.json();
                const history = data.history || [];

                const transcriptContent = document.getElementById('transcript-content');
                if (!transcriptContent) return;

                if (history.length > 0) {
                    const sectionTitle = document.querySelector('#transcript-section .panel-section-title');
                    if (sectionTitle) {
                        sectionTitle.textContent =
                            `Full Conversation Transcript (${Math.floor(history.length / 2)} exchanges)`;
                    }

                    let transcriptHTML = '<div class="transcript-wrap">';
                    history.forEach(msg => {
                        const isUser = msg.role === 'user';
                        transcriptHTML += `<div class="transcript-msg ${isUser ? 'user' : 'assistant'}">
                            <div class="transcript-role">${isUser ? 'Visitor' : 'Chanakya'}</div>
                            <div class="transcript-text">${escapeHtml(msg.content)}</div>
                        </div>`;
                    });
                    transcriptHTML += '</div>';
                    transcriptContent.innerHTML = transcriptHTML;
                } else {
                    transcriptContent.innerHTML = `
                        <div class="faint-note">
                            No conversation transcript is available yet. It appears after the first saved AI interaction.
                        </div>`;
                }
            } catch (e) {
                const transcriptContent = document.getElementById('transcript-content');
                if (transcriptContent) {
                    transcriptContent.innerHTML = `
                        <div class="faint-note">
                            Could not load transcript.
                        </div>`;
                }
                console.error('Transcript fetch error:', e);
            }
        }

        function updateMarkButtonState(status) {
            const btn = document.getElementById('mark-btn');
            if (!btn) return;

            const safeStatus = (status || 'new').toLowerCase();
            btn.disabled = safeStatus === 'contacted' || safeStatus === 'qualified' || safeStatus === 'closed_won';

            if (safeStatus === 'contacted') {
                btn.textContent = 'Already Contacted';
                btn.style.background = '#fff4da';
                btn.style.color = '#aa7614';
                btn.style.borderColor = 'rgba(240, 182, 75, 0.26)';
                return;
            }

            if (safeStatus === 'qualified' || safeStatus === 'closed_won') {
                btn.textContent = 'Lead Advanced';
                btn.style.background = '#e8f8f3';
                btn.style.color = '#168363';
                btn.style.borderColor = 'rgba(36, 178, 138, 0.24)';
                return;
            }

            btn.textContent = 'Mark Contacted';
            btn.style.background = '#fff';
            btn.style.color = 'var(--gf-muted)';
            btn.style.borderColor = 'var(--gf-line-strong)';
        }

        function closePanel() {
            document.getElementById('detail-panel').classList.remove('open');
            document.getElementById('panel-overlay').classList.remove('active');
            currentLead = null;
        }

        // EXPORT CHAT
        // Fetches transcript from API then downloads as .txt
        async function exportChat() {
            if (!currentLead) return;
            const lead = currentLead;

            // Show loading state on button
            const btn = document.getElementById('export-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Loading...';
            btn.disabled = true;

            try {
                const res = await fetch(`${CONV_API}/${lead.session_id}`);
                const data = await res.json();
                const history = data.history || [];
                downloadExport(lead, history);
            } catch (e) {
                console.error('Export fetch error:', e);
                downloadExport(lead, []);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }

        function downloadExport(lead, history) {
            let content = `GROWTHFORGE MEDIA - LEAD EXPORT\n`;
            content += `${'='.repeat(50)}\n\n`;
            content += `LEAD DETAILS\n`;
            content += `${'─'.repeat(30)}\n`;
            content += `Name:      ${lead.name || '-'}\n`;
            content += `Email:     ${lead.email || '-'}\n`;
            content += `Phone:     ${lead.phone || '-'}\n`;
            content += `Business:  ${lead.business || '-'}\n`;
            content += `Score:     ${lead.lead_score || 1}/10\n`;
            content += `Stage:     ${lead.stage || '-'}\n`;
            content += `Intent:    ${lead.intent || '-'}\n`;
            content += `Captured:  ${fmtDate(lead.timestamp)}\n`;
            content += `Updated:   ${fmtDate(lead.last_updated)}\n\n`;

            if (lead.conversation_summary) {
                content += `SUMMARY\n`;
                content += `${'─'.repeat(30)}\n`;
                content += `${lead.conversation_summary}\n\n`;
            }

            if (history.length > 0) {
                content += `CONVERSATION TRANSCRIPT\n`;
                content += `${'─'.repeat(30)}\n\n`;
                history.forEach(msg => {
                    const role = msg.role === 'user' ? 'VISITOR' : 'CHANAKYA';
                    content += `[${role}]\n${msg.content}\n\n`;
                });
            } else {
                content += `No conversation transcript available.\n`;
            }

            content += `${'='.repeat(50)}\n`;
            content += `Exported: ${new Date().toLocaleString()}\n`;
            content += `GrowthForge Media Lead Intelligence Dashboard\n`;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lead_${(lead.name || 'unknown').replace(/\s+/g, '_')}_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // MARK CONTACTED
        function markContacted() {
            if (!currentLead) return;
            if (['contacted', 'qualified', 'closed_won'].includes((currentLead.status || 'new').toLowerCase())) {
                updateMarkButtonState(currentLead.status);
                return;
            }

            const btn = document.getElementById('mark-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            fetch(`${API_BASE}/leads/${currentLead.session_id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'contacted' })
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error(`Status ${res.status}`);
                    }

                    currentLead.status = 'contacted';
                    currentLead.last_updated = new Date().toISOString();
                    const leadIndex = allLeads.findIndex(
                        l => l.session_id === currentLead.session_id
                    );
                    if (leadIndex >= 0) {
                        allLeads[leadIndex].status = 'contacted';
                        allLeads[leadIndex].last_updated = currentLead.last_updated;
                    }

                    updateMarkButtonState('contacted');
                    renderDashboard();
                })
                .catch((err) => {
                    console.error('Status update error:', err);
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        }

        // AUTO REFRESH
        setInterval(() => {
            if (sessionStorage.getItem('gf_auth') === '1') loadData();
        }, 30000);
    