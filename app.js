// ==========================================================================
// PORTFOLIO APPLICATION STATE & INITIAL SEED DATA
// ==========================================================================

const INITIAL_LINKS = [
    {
        id: "seed-1",
        title: "Nike Store Redesign SaaS",
        url: "https://github.com",
        category: "project",
        theme: "violet",
        desc: "E-commerce platform modern dengan stack Next.js, Stripe, dan Tailwind CSS. Memiliki performa cepat dan integrasi checkout instant."
    },
    {
        id: "seed-2",
        title: "Developer Analytics Dashboard",
        url: "https://github.com",
        category: "project",
        theme: "cyan",
        desc: "Dashboard monitoring metrik server, beban CPU, dan grafik pengunjung realtime menggunakan WebSocket dan Chart.js."
    },
    {
        id: "seed-3",
        title: "LinkedIn Professional Profile",
        url: "https://linkedin.com",
        category: "social",
        theme: "cyan",
        desc: "Mari terhubung secara profesional di LinkedIn untuk berkolaborasi, berdiskusi tentang teknologi, atau membahas peluang karir."
    },
    {
        id: "seed-4",
        title: "Personal GitHub Repository",
        url: "https://github.com",
        category: "social",
        theme: "violet",
        desc: "Repositori tempat saya menyimpan semua kode sumber proyek open-source, eksperimen kecil, dan kontribusi komunitas saya."
    },
    {
        id: "seed-5",
        title: "Figma UI/UX Design Space",
        url: "https://figma.com",
        category: "other",
        theme: "rose",
        desc: "Koleksi mockup aplikasi web/mobile, sistem desain, dan wireframe kreatif yang saya rancang dengan fokus pada kegunaan."
    }
];

// Load links from LocalStorage or seed defaults
let portfolioLinks = JSON.parse(localStorage.getItem('rohim_portfolio_links'));
if (!portfolioLinks || portfolioLinks.length === 0) {
    portfolioLinks = INITIAL_LINKS;
    localStorage.setItem('rohim_portfolio_links', JSON.stringify(portfolioLinks));
}

// Current filter and edit state
let currentFilter = 'all';
const DEFAULT_PASSCODE = 'rohim123';

// ==========================================================================
// DOM ELEMENT REFERENCES
// ==========================================================================
const portfolioGrid = document.getElementById('portfolioGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Login modal elements
const loginModal = document.getElementById('loginModal');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
const adminPasscode = document.getElementById('adminPasscode');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const submitLoginBtn = document.getElementById('submitLoginBtn');
const loginErrorMsg = document.getElementById('loginErrorMsg');

// Dashboard modal elements
const dashboardModal = document.getElementById('dashboardModal');
const closeDashboardModalBtn = document.getElementById('closeDashboardModalBtn');
const logoutBtn = document.getElementById('logoutBtn');
const linkForm = document.getElementById('linkForm');
const editLinkId = document.getElementById('editLinkId');
const linkTitle = document.getElementById('linkTitle');
const linkUrl = document.getElementById('linkUrl');
const linkCategory = document.getElementById('linkCategory');
const linkTheme = document.getElementById('linkTheme');
const linkDesc = document.getElementById('linkDesc');
const saveLinkBtn = document.getElementById('saveLinkBtn');
const formTitle = document.getElementById('formTitle');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const adminLinksList = document.getElementById('adminLinksList');

// Toast notification
const toast = document.getElementById('notificationToast');

// ==========================================================================
// CARD RENDERING & WEB INTERFACE
// ==========================================================================

// Helper function to return matching Lucide icon names based on category/URL
function getIconForLink(category, url) {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes('github.com')) return 'github';
    if (lowercaseUrl.includes('linkedin.com')) return 'linkedin';
    if (lowercaseUrl.includes('instagram.com')) return 'instagram';
    if (lowercaseUrl.includes('figma.com')) return 'figma';
    if (lowercaseUrl.includes('dribbble.com')) return 'dribbble';
    if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) return 'twitter';
    
    // Category Fallbacks
    if (category === 'project') return 'cpu';
    if (category === 'social') return 'share-2';
    return 'external-link';
}

// Render dynamic portfolio cards to the home page grid
function renderPortfolioCards() {
    portfolioGrid.innerHTML = '';
    
    const filtered = portfolioLinks.filter(link => {
        if (currentFilter === 'all') return true;
        return link.category === currentFilter;
    });

    if (filtered.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="folder-open"></i>
                <h3>Belum ada link terpasang</h3>
                <p>Silakan masuk ke Admin Panel untuk menambahkan link atau proyek baru.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filtered.forEach((link, index) => {
        const iconName = getIconForLink(link.category, link.url);
        const cardHTML = `
            <article class="portfolio-card theme-${link.theme} fade-in" style="animation-delay: ${index * 0.08}s">
                <div class="card-glow-effect"></div>
                <div class="card-header">
                    <span class="card-category">${link.category === 'project' ? 'Proyek' : link.category === 'social' ? 'Sosmed' : 'Lainnya'}</span>
                    <div class="card-icon">
                        <i data-lucide="${iconName}"></i>
                    </div>
                </div>
                <div class="card-body">
                    <h3>${escapeHTML(link.title)}</h3>
                    <p>${escapeHTML(link.desc)}</p>
                </div>
                <div class="card-footer">
                    <a href="${escapeHTML(link.url)}" target="_blank" class="card-btn">
                        <span>Kunjungi Link</span>
                        <i data-lucide="arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
        portfolioGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Re-initialize Lucide Icons for dynamically generated elements
    lucide.createIcons();
}

// Utility to escape HTML and prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================================================
// FILTER FUNCTIONALITY
// ==========================================================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        currentFilter = btn.dataset.filter;
        renderPortfolioCards();
    });
});

// ==========================================================================
// ADMINISTRATIVE AUTHENTICATION (LOGIN DIALOG)
// ==========================================================================

// Check if user is already logged in for this browser session
function checkSessionAuth() {
    return sessionStorage.getItem('rohim_admin_authenticated') === 'true';
}

adminLoginBtn.addEventListener('click', () => {
    if (checkSessionAuth()) {
        openDashboard();
    } else {
        openLoginModal();
    }
});

function openLoginModal() {
    loginModal.classList.add('active');
    adminPasscode.value = '';
    loginErrorMsg.style.display = 'none';
    adminPasscode.focus();
}

function closeLoginModal() {
    loginModal.classList.remove('active');
}

closeLoginModalBtn.addEventListener('click', closeLoginModal);

// Toggle password display type
togglePasswordBtn.addEventListener('click', () => {
    const type = adminPasscode.getAttribute('type') === 'password' ? 'text' : 'password';
    adminPasscode.setAttribute('type', type);
    const icon = togglePasswordBtn.querySelector('i');
    if (type === 'text') {
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
});

// Handle Login submit
submitLoginBtn.addEventListener('click', handleLogin);
adminPasscode.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
    const entered = adminPasscode.value;
    if (entered === DEFAULT_PASSCODE) {
        sessionStorage.setItem('rohim_admin_authenticated', 'true');
        closeLoginModal();
        openDashboard();
        showToast('Login berhasil! Selamat datang di Dashboard.', 'success');
    } else {
        loginErrorMsg.style.display = 'block';
        adminPasscode.classList.add('shake');
        setTimeout(() => adminPasscode.classList.remove('shake'), 500);
    }
}

// ==========================================================================
// ADMIN DASHBOARD & CRUD LOGIC
// ==========================================================================

function openDashboard() {
    dashboardModal.classList.add('active');
    renderAdminLinksList();
    resetForm();
}

function closeDashboard() {
    dashboardModal.classList.remove('active');
}

closeDashboardModalBtn.addEventListener('click', closeDashboard);

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('rohim_admin_authenticated');
    closeDashboard();
    showToast('Berhasil keluar dari sesi admin.', 'success');
});

// Render the list of links inside the admin panel
function renderAdminLinksList() {
    adminLinksList.innerHTML = '';
    
    if (portfolioLinks.length === 0) {
        adminLinksList.innerHTML = `
            <div class="empty-state" style="padding: 20px;">
                <p>Belum ada link terpasang.</p>
            </div>
        `;
        return;
    }

    portfolioLinks.forEach(link => {
        const itemHTML = `
            <div class="admin-list-item">
                <div class="item-info">
                    <h5>${escapeHTML(link.title)}</h5>
                    <p>${escapeHTML(link.url)}</p>
                    <span class="item-category-tag">${link.category}</span>
                </div>
                <div class="item-actions">
                    <button class="action-btn edit-btn" onclick="initiateEdit('${link.id}')" title="Edit">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteLink('${link.id}')" title="Hapus">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
        adminLinksList.insertAdjacentHTML('beforeend', itemHTML);
    });

    lucide.createIcons();
}

// Reset form fields back to add mode
function resetForm() {
    editLinkId.value = '';
    linkTitle.value = '';
    linkUrl.value = '';
    linkCategory.value = 'project';
    linkTheme.value = 'violet';
    linkDesc.value = '';
    formTitle.textContent = 'Tambah Link Baru';
    saveLinkBtn.textContent = 'Simpan Link';
    cancelEditBtn.style.display = 'none';
}

cancelEditBtn.addEventListener('click', resetForm);

// Handle Form Submission (Create and Update)
linkForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = editLinkId.value;
    const newLinkData = {
        title: linkTitle.value.trim(),
        url: linkUrl.value.trim(),
        category: linkCategory.value,
        theme: linkTheme.value,
        desc: linkDesc.value.trim()
    };

    if (id) {
        // Edit Mode
        const index = portfolioLinks.findIndex(l => l.id === id);
        if (index !== -1) {
            portfolioLinks[index] = { ...portfolioLinks[index], ...newLinkData };
            showToast('Link berhasil diperbarui!', 'success');
        }
    } else {
        // Create Mode
        const newLink = {
            id: 'link-' + Date.now(),
            ...newLinkData
        };
        portfolioLinks.unshift(newLink);
        showToast('Link baru berhasil ditambahkan!', 'success');
    }

    // Save to LocalStorage
    localStorage.setItem('rohim_portfolio_links', JSON.stringify(portfolioLinks));
    
    // Refresh GUI Lists
    renderPortfolioCards();
    renderAdminLinksList();
    resetForm();
});

// Setup Edit trigger
window.initiateEdit = function(id) {
    const link = portfolioLinks.find(l => l.id === id);
    if (!link) return;

    editLinkId.value = link.id;
    linkTitle.value = link.title;
    linkUrl.value = link.url;
    linkCategory.value = link.category;
    linkTheme.value = link.theme;
    linkDesc.value = link.desc;

    formTitle.textContent = 'Edit Link';
    saveLinkBtn.textContent = 'Perbarui Link';
    cancelEditBtn.style.display = 'inline-flex';
    
    // Scroll form into view for smaller screens
    document.querySelector('.admin-form-panel').scrollTop = 0;
};

// Setup Delete trigger
window.deleteLink = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus link ini?')) {
        portfolioLinks = portfolioLinks.filter(l => l.id !== id);
        localStorage.setItem('rohim_portfolio_links', JSON.stringify(portfolioLinks));
        
        renderPortfolioCards();
        renderAdminLinksList();
        
        // If we were editing the deleted link, reset the form
        if (editLinkId.value === id) {
            resetForm();
        }

        showToast('Link berhasil dihapus.', 'success');
    }
};

// ==========================================================================
// TOAST NOTIFICATIONS TRIGGER
// ==========================================================================
function showToast(message, type = 'success') {
    const toastMsg = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toastMsg.textContent = message;
    
    if (type === 'success') {
        toast.style.borderColor = 'var(--color-emerald)';
        toastIcon.setAttribute('data-lucide', 'check-circle');
        toastIcon.style.color = 'var(--color-emerald)';
    } else {
        toast.style.borderColor = 'var(--color-rose)';
        toastIcon.setAttribute('data-lucide', 'alert-circle');
        toastIcon.style.color = 'var(--color-rose)';
    }
    
    lucide.createIcons();
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
}

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Render links grid
    renderPortfolioCards();
    
    // Close modal on background overlay click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeLoginModal();
        if (e.target === dashboardModal) closeDashboard();
    });
});
