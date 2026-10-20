/**
 * Twinforce Technologies Pte. Ltd. - Core Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollFab();
  initSleekFileUpload();
  initContactForm();
  initAutoYear();
});

/* 1. Mobile Menu */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', !isOpen);
  });
}

function closeMobile() {
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
}

/* 2. Projects Filter */
function filterProjects(event, category) {
  const tabButtons = document.querySelectorAll('.projects-tabs .tab-btn');
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  event.currentTarget.classList.add('active');
  event.currentTarget.setAttribute('aria-selected', 'true');

  const projectCards = document.querySelectorAll('#projectsGrid .project-card');
  projectCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* 3. Modals */
function openProjectModal(title, category, description) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  document.getElementById('projTitle').textContent = title;
  document.getElementById('projTag').textContent = category;
  document.getElementById('projDesc').textContent = description;
  modal.classList.add('active');
}

function openTeamModal(name, role, experience, email, phone) {
  const modal = document.getElementById('teamModal');
  if (!modal) return;
  document.getElementById('teamName').textContent = name;
  document.getElementById('teamRole').textContent = role;
  document.getElementById('teamExp').textContent = experience;

  const waBtn = document.getElementById('teamWa');
  const mailBtn = document.getElementById('teamMail');
  if (waBtn) waBtn.href = `https://wa.me/${phone}`;
  if (mailBtn) mailBtn.href = `mailto:${email}`;

  modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

window.addEventListener('click', (e) => {
  const projModal = document.getElementById('projectModal');
  const teamModal = document.getElementById('teamModal');
  if (e.target === projModal) projModal.classList.remove('active');
  if (e.target === teamModal) teamModal.classList.remove('active');
});

/* 4. Scroll FAB */
function initScrollFab() {
  const fab = document.getElementById('scrollWorkerFab');
  if (!fab) return;

  fab.addEventListener('click', () => {
    const totalHeight = document.documentElement.scrollHeight;
    const currentPos = window.scrollY + window.innerHeight;

    if (currentPos >= totalHeight - 200) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  });
}

/* 5. Sleek File Upload Listener with Background Validation */
let selectedFilesCache = [];

function initSleekFileUpload() {
  const fileInput = document.getElementById('sleekFileInput');
  const fileNameDisplay = document.getElementById('sleekFileName');

  if (!fileInput || !fileNameDisplay) return;

  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);

    // Rule 1: Max 2 Files
    if (files.length > 2) {
      alert("You can attach a maximum of 2 files only.");
      fileInput.value = "";
      fileNameDisplay.textContent = "No files selected";
      selectedFilesCache = [];
      return;
    }

    // Rule 2: Each file max 10MB
    for (let f of files) {
      if (f.size > 10 * 1024 * 1024) {
        alert(`File "${f.name}" exceeds 10MB limit. Please attach a smaller file.`);
        fileInput.value = "";
        fileNameDisplay.textContent = "No files selected";
        selectedFilesCache = [];
        return;
      }
    }

    // Rule 3: Total max 20MB
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 20 * 1024 * 1024) {
      alert("Total files size exceeds 20MB limit.");
      fileInput.value = "";
      fileNameDisplay.textContent = "No files selected";
      selectedFilesCache = [];
      return;
    }

    selectedFilesCache = files;
    if (files.length === 1) {
      fileNameDisplay.textContent = files[0].name;
    } else if (files.length === 2) {
      fileNameDisplay.textContent = `${files[0].name}, ${files[1].name}`;
    } else {
      fileNameDisplay.textContent = "No files selected";
    }
  });
}

/* 6. Form Submission */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('submitSpinner');
  const statusMsg = document.getElementById('formStatus');

  if (!form) return;

  // Apps Script Web App URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_DEPLOYED_APP_ID/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusMsg.className = 'form-status';
    statusMsg.style.display = 'none';

    // Honeypot check
    if (form.website_url && form.website_url.value.trim() !== '') {
      statusMsg.className = 'form-status success';
      statusMsg.textContent = 'Enquiry logged successfully.';
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      statusMsg.className = 'form-status error';
      statusMsg.textContent = 'Please fill in all required fields accurately.';
      return;
    }

    submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');

    try {
      let fileData1 = null, fileName1 = '', fileType1 = '';
      let fileData2 = null, fileName2 = '', fileType2 = '';

      if (selectedFilesCache.length > 0) {
        fileName1 = selectedFilesCache[0].name;
        fileType1 = selectedFilesCache[0].type;
        fileData1 = await fileToBase64(selectedFilesCache[0]);
      }

      if (selectedFilesCache.length > 1) {
        fileName2 = selectedFilesCache[1].name;
        fileType2 = selectedFilesCache[1].type;
        fileData2 = await fileToBase64(selectedFilesCache[1]);
      }

      const payload = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service.value,
        message: form.message.value.trim(),
        fileData1: fileData1,
        fileName1: fileName1,
        fileType1: fileType1,
        fileData2: fileData2,
        fileName2: fileName2,
        fileType2: fileType2
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        statusMsg.className = 'form-status success';
        statusMsg.innerHTML = `<strong>Enquiry Received:</strong> Reference ID <strong>#${result.ticketId}</strong> logged. We will contact you shortly.`;
        form.reset();
        document.getElementById('sleekFileName').textContent = "No files selected";
        selectedFilesCache = [];
      } else {
        throw new Error(result.message || 'Error logging scope.');
      }

    } catch (err) {
      console.error(err);
      statusMsg.className = 'form-status error';
      statusMsg.textContent = err.message || 'Unable to submit online. Please WhatsApp +65 89585741.';
    } finally {
      submitBtn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
    }
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

function initAutoYear() {
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();
}
