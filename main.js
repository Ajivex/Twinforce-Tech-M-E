/**
 * Twinforce Technologies Pte. Ltd. - Core Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCapabilityTabs();
  initSpecModals();
  initScopeEstimator();
  initAutoYear();
});

/* 1. Mobile Navigation */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', isExpanded);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* 2. Capability Switcher Tabs */
function initCapabilityTabs() {
  const btnMechanical = document.getElementById('btnMechanical');
  const btnElectrical = document.getElementById('btnElectrical');
  const cards = document.querySelectorAll('.capability-card');

  if (!btnMechanical || !btnElectrical) return;

  function filterCards(targetCategory) {
    cards.forEach(card => {
      if (card.getAttribute('data-category') === targetCategory) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  btnMechanical.addEventListener('click', () => {
    btnMechanical.classList.add('active');
    btnMechanical.setAttribute('aria-selected', 'true');
    btnElectrical.classList.remove('active');
    btnElectrical.setAttribute('aria-selected', 'false');
    filterCards('mechanical');
  });

  btnElectrical.addEventListener('click', () => {
    btnElectrical.classList.add('active');
    btnElectrical.setAttribute('aria-selected', 'true');
    btnMechanical.classList.remove('active');
    btnMechanical.setAttribute('aria-selected', 'false');
    filterCards('electrical');
  });
}

/* 3. Technical Specs Modal */
const SPEC_DATA = {
  'modal-piping': {
    category: 'ASME Process Piping',
    title: 'Process & Utility High-Pressure Piping Specs',
    content: `
      <h4>Applicable Engineering Codes</h4>
      <ul>
        <li>ASME B31.3 (Chemical Plant & Petroleum Refinery Piping)</li>
        <li>ASME B31.1 (Power & Utility Steam Piping)</li>
      </ul>
      <h4>Metallurgy & Dimensional Scope</h4>
      <ul>
        <li>A106 Gr. B / A53 Carbon Steel (Sch 40 to Sch 160 / XXS)</li>
        <li>ASTM A312 TP304L / TP316L Stainless Steel</li>
        <li>Sizes: 1/2" up to 48" Nominal Bore (NB)</li>
      </ul>
      <h4>NDT & QA/QC Documentation</h4>
      <ul>
        <li>100% Traceability with EN 10204 3.1 Material Test Reports (MTR)</li>
        <li>Weld mapping, Radiographic Testing (RT), and Dye Penetrant Examination (PT)</li>
      </ul>
    `
  },
  'modal-skids': {
    category: 'Structural Fabrication',
    title: 'Modular Skid & Structural Steel Specs',
    content: `
      <h4>Structural Design & Fabrication</h4>
      <ul>
        <li>Structural steel welding certified to AWS D1.1 / D1.1M</li>
        <li>Hot-dip galvanizing to ISO 1461 or industrial 3-coat marine epoxy systems</li>
      </ul>
      <h4>Engineering Verification</h4>
      <ul>
        <li>Lifting lug calculations & non-destructive magnetic particle inspection (MPI)</li>
        <li>Pre-commissioning skid static alignment and vibration baseline tests</li>
      </ul>
    `
  },
  'modal-hydro': {
    category: 'Hydrostatic & Shutdown',
    title: 'Hydrostatic Proof Testing & Turnaround Protocols',
    content: `
      <h4>Pressure Testing Capacity</h4>
      <ul>
        <li>Standard shop and field hydro tests up to 350+ Bar (5,000+ PSI)</li>
        <li>Pneumatic testing protocols per ASME B31.3 Section 345.5</li>
      </ul>
      <h4>Instrumentation & Safety Compliance</h4>
      <ul>
        <li>Dual calibrated chart recorders and digital quartz pressure logs</li>
        <li>Singapore MOM-certified safety release valves installed on test manifolds</li>
      </ul>
    `
  },
  'modal-power': {
    category: 'Electrical Distribution',
    title: 'LV/HV Power Distribution & Switchgear Specs',
    content: `
      <h4>Standards Compliance</h4>
      <ul>
        <li>Singapore Standard SS 638 (formerly CP 5) electrical safety code</li>
        <li>IEC 61439-1/2 for Low-Voltage switchgear and controlgear assemblies</li>
      </ul>
      <h4>Installation & Injection Testing</h4>
      <ul>
        <li>Primary and secondary current injection testing of protective relays</li>
        <li>Thermographic infrared imaging and insulation resistance certification</li>
      </ul>
    `
  },
  'modal-lew': {
    category: 'LEW Licensing',
    title: 'Licensed Electrical Worker (LEW) Services',
    content: `
      <h4>Licensing Grade Coverage</h4>
      <ul>
        <li>EMA Grade 7, 8, and Grade 9 (High Voltage up to 22kV / 66kV)</li>
      </ul>
      <h4>Mandatory Statutory Deliverables</h4>
      <ul>
        <li>Single Line Diagram (SLD) preparation, endorsement, and annual submission</li>
        <li>EMA Operating License renewal inspections and emergency fault attendance</li>
      </ul>
    `
  },
  'modal-ei': {
    category: 'Instrumentation & ELV',
    title: 'E&I Control Panels & Hazardous Area Systems',
    content: `
      <h4>Explosion Proof & Hazardous Zones</h4>
      <ul>
        <li>IECEx and ATEX certified Ex-d, Ex-e, and Ex-i junction boxes and panels</li>
      </ul>
      <h4>Instrumentation Loops & SCDF Fire Alarms</h4>
      <ul>
        <li>Loop checks for pressure, differential, temperature, and radar flow meters</li>
        <li>SCDF code-compliant addressable multi-loop fire alarm integrations</li>
      </ul>
    `
  }
};

function initSpecModals() {
  const modal = document.getElementById('specModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalActionBtn = document.getElementById('modalActionBtn');
  const triggers = document.querySelectorAll('.modal-trigger');

  if (!modal || !modalClose) return;

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      const data = SPEC_DATA[modalKey];

      if (data) {
        modalCategory.textContent = data.category;
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modal.showModal();
      }
    });
  });

  modalClose.addEventListener('click', () => modal.close());
  modalActionBtn.addEventListener('click', () => modal.close());

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      modal.close();
    }
  });
}

/* 4. Scope Estimator & RFQ Submission */
function initScopeEstimator() {
  const form = document.getElementById('rfqForm');
  const submitBtn = document.getElementById('submitBtn');
  const spinner = document.getElementById('submitSpinner');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  // Apps Script endpoint (Replace with actual deployment URL when ready)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_DEPLOYED_APP_ID/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    feedback.className = 'form-feedback hidden';
    feedback.textContent = '';

    // Honeypot check
    if (form.website_url.value) {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Enquiry received successfully.';
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Please fill in all required fields.';
      return;
    }

    submitBtn.disabled = true;
    spinner.classList.remove('hidden');

    try {
      const fileInput = document.getElementById('drawingFile');
      let base64File = null;
      let fileName = '';
      let fileType = '';

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 15 * 1024 * 1024) {
          throw new Error('File size exceeds 15MB limit.');
        }
        fileName = file.name;
        fileType = file.type;
        base64File = await fileToBase64(file);
      }

      const payload = {
        discipline: form.discipline.value,
        material: form.material.value,
        facility: form.facility.value,
        location: form.location.value,
        clientName: form.clientName.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        scopeNotes: form.scopeNotes.value.trim(),
        fileData: base64File,
        fileName: fileName,
        fileType: fileType
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<strong>Enquiry Logged:</strong> Scope ID <strong>#${result.ticketId}</strong> generated. Confirmation email sent.`;
        form.reset();
      } else {
        throw new Error(result.message || 'Error recording scope.');
      }

    } catch (err) {
      console.error(err);
      feedback.className = 'form-feedback error';
      feedback.textContent = err.message || 'Submission error. Please call +65 89585741 directly.';
    } finally {
      submitBtn.disabled = false;
      spinner.classList.add('hidden');
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

/* 5. Year Update */
function initAutoYear() {
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();
}
