/**
 * Twinforce Technologies Pte. Ltd. - Core Scripts
 * Dynamic Direction Scroll, Sleek File Upload, and Modal Management
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmartScroll();
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

/* 4. Smart Direct Scroll (Top to Bottom / Bottom to Top) */
function initSmartScroll() {
  const fab = document.getElementById('smartScrollFab');
  const tooltip = document.getElementById('fabTooltip');

  if (!fab || !tooltip) return;

  function checkPosition() {
    const scrollPos = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Paadhi page-kku mela scroll pannitta "Back to Top" nu maathum
    if (scrollPos > maxScroll * 0.4) {
      tooltip.textContent = 'Back to Top';
      fab.setAttribute('data-action', 'top');
    } else {
      tooltip.textContent = 'Scroll to Bottom';
      fab.setAttribute('data-action', 'bottom');
    }
  }

  window.addEventListener('scroll', checkPosition, { passive: true });

  fab.addEventListener('click', () => {
    const action = fab.getAttribute('data-action');
    if (action === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Direct-a page-oda end-kku (Footer/Contact-kku) smooth-a pogum
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });

  checkPosition();
}

/* 5. Sleek File Upload Listener with Silent Validation */
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
/* 6. Form Submission (Bulleted Safe Logic) */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('submitSpinner');
  const statusMsg = document.getElementById('formStatus');

  if (!form) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhZ9l5y1ycVevXhcZ6vP8i1lPKIPmeXO5EsVwY5Ysj338e7EoE5ApRyf_r-JeHDjYF/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusMsg.style.display = 'none';
    statusMsg.className = 'form-status';
    statusMsg.textContent = '';

    // Anti-spam check
    if (form.website_url && form.website_url.value.trim() !== '') {
      statusMsg.style.display = 'block';
      statusMsg.style.background = '#DCFCE7';
      statusMsg.style.color = '#14532D';
      statusMsg.textContent = 'Enquiry logged successfully.';
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = '#FEE2E2';
      statusMsg.style.color = '#991B1B';
      statusMsg.textContent = 'Please fill in all required fields accurately.';
      return;
    }

    // Lock button
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'SUBMITTING...';
    if (spinner) spinner.classList.remove('hidden');

    try {
      const file1Input = document.getElementById('fileSlot1');
      const file2Input = document.getElementById('fileSlot2');

      let fileData1 = null, fileName1 = '', fileType1 = '';
      let fileData2 = null, fileName2 = '', fileType2 = '';

      // Convert File 1
      if (file1Input && file1Input.files.length > 0) {
        const f1 = file1Input.files[0];
        if (f1.size > 10 * 1024 * 1024) throw new Error('File 1 exceeds 10MB limit.');
        fileName1 = f1.name;
        fileType1 = f1.type;
        fileData1 = await fileToBase64(f1);
      }

      // Convert File 2
      if (file2Input && file2Input.files.length > 0) {
        const f2 = file2Input.files[0];
        if (f2.size > 10 * 1024 * 1024) throw new Error('File 2 exceeds 10MB limit.');
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

      // Direct POST call to Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#DCFCE7';
        statusMsg.style.color = '#14532D';
        statusMsg.style.border = '1px solid #86EFAC';
        statusMsg.innerHTML = `✅ <strong>Submitted Successfully!</strong><br>Reference ID: <strong>#${result.ticketId}</strong>. We have sent a confirmation email.`;
        form.reset();
      } else {
        throw new Error(result.message || 'System encountered an error logging enquiry.');
      }

    } catch (err) {
      console.error('Submission Failed:', err);
      statusMsg.style.display = 'block';
      statusMsg.style.background = '#FEE2E2';
      statusMsg.style.color = '#991B1B';
      statusMsg.style.border = '1px solid #FCA5A5';
      statusMsg.textContent = err.message || 'Failed to submit enquiry. Please call or WhatsApp +65 89585741 directly.';
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'REQUEST QUOTATION';
      if (spinner) spinner.classList.add('hidden');
    }
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
