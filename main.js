/**
 * Twinforce Technologies Pte. Ltd. - Core Scripts
 * Handles Navigation, Modals, 3D Scroll FAB, and Multi-File RFQ (2x10MB)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollFab();
  initMultiFileUpload();
  initContactForm();
  initAutoYear();
});

/* 1. Mobile Hamburger Menu */
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

/* 2. Projects Filter Tabs */
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

/* 3. Lightbox Modal Controllers */
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

/* 4. 3D Worker Scroll Button */
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

/* 5. Multi-File Size Checker (2 Files, Max 10MB each, Total 20MB) */
function initMultiFileUpload() {
  const file1 = document.getElementById('uploadFile1');
  const file2 = document.getElementById('uploadFile2');
  const statusLabel = document.getElementById('fileSizeStatus');

  const MAX_EACH_MB = 10;
  const MAX_TOTAL_MB = 20;

  function updateStatus() {
    let size1 = file1 && file1.files[0] ? file1.files[0].size : 0;
    let size2 = file2 && file2.files[0] ? file2.files[0].size : 0;

    let totalBytes = size1 + size2;
    let totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

    if (statusLabel) {
      statusLabel.textContent = `Total Selected: ${totalMB} MB / ${MAX_TOTAL_MB} MB`;
      if (totalBytes > MAX_TOTAL_MB * 1024 * 1024) {
        statusLabel.style.color = '#DC2626';
      } else {
        statusLabel.style.color = '#C84B26';
      }
    }
  }

  function validateInput(input) {
    if (input && input.files[0]) {
      const file = input.files[0];
      if (file.size > MAX_EACH_MB * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 10MB limit. Please compress or select a smaller drawing.`);
        input.value = '';
      }
    }
    updateStatus();
  }

  if (file1) file1.addEventListener('change', () => validateInput(file1));
  if (file2) file2.addEventListener('change', () => validateInput(file2));
}

/* 6. Form Submission with AJAX & Base64 Multi-File Processing */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('submitSpinner');
  const statusMsg = document.getElementById('formStatus');

  if (!form) return;

  // 🔴 IMPORTANT: Replace this placeholder with your deployed Google Apps Script Web App URL!
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_DEPLOYED_APP_ID/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Reset Status
    statusMsg.className = 'form-status';
    statusMsg.style.display = 'none';
    statusMsg.textContent = '';

    // 2. Anti-Spam Honeypot Verification
    if (form.website_url && form.website_url.value.trim() !== '') {
      statusMsg.className = 'form-status success';
      statusMsg.textContent = 'Enquiry logged successfully. Our team will contact you.';
      form.reset();
      return;
    }

    // 3. Validation
    if (!form.checkValidity()) {
      statusMsg.className = 'form-status error';
      statusMsg.textContent = 'Please fill in all required fields accurately.';
      return;
    }

    // 4. File Size Verification
    const file1Input = document.getElementById('uploadFile1');
    const file2Input = document.getElementById('uploadFile2');
    let size1 = file1Input && file1Input.files[0] ? file1Input.files[0].size : 0;
    let size2 = file2Input && file2Input.files[0] ? file2Input.files[0].size : 0;

    if (size1 + size2 > 20 * 1024 * 1024) {
      statusMsg.className = 'form-status error';
      statusMsg.textContent = 'Combined file size exceeds the 20MB limit. Please reduce drawing file sizes.';
      return;
    }

    // Lock Button & Show Spinner
    submitBtn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');

    try {
      // Process File 1 (Base64)
      let fileData1 = null, fileName1 = '', fileType1 = '';
      if (file1Input && file1Input.files.length > 0) {
        const f1 = file1Input.files[0];
        fileName1 = f1.name;
        fileType1 = f1.type;
        fileData1 = await fileToBase64(f1);
      }

      // Process File 2 (Base64)
      let fileData2 = null, fileName2 = '', fileType2 = '';
      if (file2Input && file2Input.files.length > 0) {
        const f2 = file2Input.files[0];
        fileName2 = f2.name;
        fileType2 = f2.type;
        fileData2 = await fileToBase64(f2);
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
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        statusMsg.className = 'form-status success';
        statusMsg.innerHTML = `<strong>Enquiry Received:</strong> Reference ID <strong>#${result.ticketId}</strong> logged. Our engineering desk will review your scope.`;
        form.reset();
        document.getElementById('fileSizeStatus').textContent = 'Total Selected: 0 MB / 20 MB';
      } else {
        throw new Error(result.message || 'System encountered an error recording your scope.');
      }

    } catch (err) {
      console.error('Submission Error:', err);
      statusMsg.className = 'form-status error';
      statusMsg.textContent = err.message || 'Unable to submit enquiry online. Please WhatsApp +65 89585741 directly.';
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
    reader.onload = () => {
      const base64Data = reader.result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
}

/* 7. Auto Year */
function initAutoYear() {
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();
}
