/**
 * Twinforce Technologies Pte. Ltd. - Core Scripts
 * Dynamic Direction Scroll, Dual-File Upload, and Form Management
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmartScroll();
  initContactForm();
  initAutoYear();
  
  // Page load aagum podhey "All" tab-la first 6 projects mattum show pannum
  filterProjects(null, 'all');
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

/* 2. Projects Filter (All -> Max 6, Mechanical/Electrical -> Category full) */
function filterProjects(event, category) {
  const tabButtons = document.querySelectorAll('.projects-tabs .tab-btn');
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
    event.currentTarget.setAttribute('aria-selected', 'true');
  } else {
    // Initial page load fallback to 'All' tab button
    const defaultAllBtn = document.querySelector('.projects-tabs .tab-btn');
    if (defaultAllBtn) {
      defaultAllBtn.classList.add('active');
      defaultAllBtn.setAttribute('aria-selected', 'true');
    }
  }

  const projectCards = document.querySelectorAll('#projectsGrid .project-card');
  let allCount = 0;

  projectCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');

    if (category === 'all') {
      // 'All' click panna strictly first 6 projects mattum display pannum
      if (allCount < 6) {
        card.style.display = 'flex';
        allCount++;
      } else {
        card.style.display = 'none';
      }
    } else {
      // 'Mechanical' or 'Electrical' click panna antha category mothamum kaattum
      if (cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
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

/* 4. Smart Direct Scroll Button */
function initSmartScroll() {
  const fab = document.getElementById('smartScrollFab');
  const tooltip = document.getElementById('fabTooltip');

  if (!fab) return;

  function checkPosition() {
    const scrollPos = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollPos > maxScroll * 0.4) {
      if (tooltip) tooltip.textContent = 'Back to Top';
      fab.setAttribute('data-action', 'top');
    } else {
      if (tooltip) tooltip.textContent = 'Scroll to Bottom';
      fab.setAttribute('data-action', 'bottom');
    }
  }

  window.addEventListener('scroll', checkPosition, { passive: true });

  fab.addEventListener('click', () => {
    const action = fab.getAttribute('data-action');
    if (action === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  });

  checkPosition();
}

/* 5. Form Submission */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusMsg = document.getElementById('formStatus');

  if (!form) return;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhZ9l5y1ycVevXhcZ6vP8i1lPKIPmeXO5EsVwY5Ysj338e7EoE5ApRyf_r-JeHDjYF/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (statusMsg) {
      statusMsg.style.display = 'none';
      statusMsg.textContent = '';
    }

    if (form.website_url && form.website_url.value.trim() !== '') {
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#FEE2E2';
        statusMsg.style.color = '#991B1B';
        statusMsg.textContent = 'Please fill in all required fields accurately.';
      }
      return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>SUBMITTING...</span>';

    try {
      const file1Input = document.getElementById('fileSlot1');
      const file2Input = document.getElementById('fileSlot2');

      let fileData1 = null, fileName1 = '', fileType1 = '';
      let fileData2 = null, fileName2 = '', fileType2 = '';

      if (file1Input && file1Input.files.length > 0) {
        const f1 = file1Input.files[0];
        if (f1.size > 10 * 1024 * 1024) throw new Error('File 1 exceeds 10MB limit.');
        fileName1 = f1.name;
        fileType1 = f1.type;
        fileData1 = await fileToBase64(f1);
      }

      if (file2Input && file2Input.files.length > 0) {
        const f2 = file2Input.files[0];
        if (f2.size > 10 * 1024 * 1024) throw new Error('File 2 exceeds 10MB limit.');
        fileName2 = f2.name;
        fileType2 = f2.type;
        fileData2 = await fileToBase64(f2);
      }

      const payload = {
        name: form.name.value.trim(),
        company: form.company ? form.company.value.trim() : '',
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        service: form.service ? form.service.value : '',
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
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.style.background = '#DCFCE7';
          statusMsg.style.color = '#14532D';
          statusMsg.style.border = '1px solid #86EFAC';
          statusMsg.innerHTML = `✅ <strong>Submitted Successfully!</strong><br>Reference ID: <strong>#${result.ticketId}</strong>. We will review your scope shortly.`;
        }
        form.reset();
      } else {
        throw new Error(result.message || 'System encountered an issue.');
      }

    } catch (err) {
      console.error('Submission Error:', err);
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#FEE2E2';
        statusMsg.style.color = '#991B1B';
        statusMsg.style.border = '1px solid #FCA5A5';
        statusMsg.textContent = err.message || 'Submission failed. Please WhatsApp +65 84645246 directly.';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* 6. Base64 Converter Function */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/* 7. Dynamic Year */
function initAutoYear() {
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();
}
