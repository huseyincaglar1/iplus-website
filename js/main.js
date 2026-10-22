/** Yayın öncesi güncelleyin. Boş alanlar arayüzde gizlenir. */
const siteContact = {
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  instagram: "",
  youtube: "",
};

const LANG_STORAGE_KEY = "iplus-language";

let currentLang = "tr";

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return stored === "en" || stored === "tr" ? stored : "tr";
  } catch (error) {
    return "tr";
  }
}

function setLanguage(lang) {
  currentLang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (error) {
    // Ignore storage failures in restricted environments.
  }

  document.documentElement.lang = lang;
  document.querySelectorAll("[data-tr][data-en]").forEach((el) => {
    const value = el.dataset[lang];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll(".lang").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
    b.setAttribute("aria-pressed", b.dataset.lang === lang ? "true" : "false");
  });
  const scrollLabel = document.querySelector(".scroll-cue__label");
  if (scrollLabel) {
    scrollLabel.textContent = lang === "tr" ? "AŞAĞI KAYDIR" : "SCROLL DOWN";
  }
  document.title =
    lang === "tr"
      ? "IPLUS | Otomasyon ve Yazılım Çözümleri"
      : "IPLUS | Industrial Automation & Software";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content =
      lang === "tr"
        ? "IPLUS Otomasyon ve Yazılım Çözümleri. Endüstriyel otomasyon, robotik entegrasyon, makine görüşü, yapay zekâ ve izlenebilirlik sistemleri."
        : "IPLUS delivers industrial automation, robotics integration, machine vision, AI-powered inspection and traceability software for manufacturing.";
  }
}

function applyContactDetails() {
  const emailEl = document.getElementById("footer-email");
  const phoneEl = document.getElementById("footer-phone");
  const addressEl = document.getElementById("footer-address");
  const ctaEmail = document.getElementById("cta-email");
  const socialWrap = document.getElementById("footer-social");

  if (siteContact.email) {
    const mail = siteContact.email;
    if (emailEl) {
      emailEl.hidden = false;
      emailEl.querySelector("a").href = `mailto:${mail}`;
      emailEl.querySelector("a").textContent = mail;
    }
    if (ctaEmail) {
      ctaEmail.href = `mailto:${mail}`;
    }
  } else {
    if (emailEl) emailEl.hidden = true;
    if (ctaEmail) ctaEmail.href = "contact.html";
  }

  if (siteContact.phone && phoneEl) {
    phoneEl.hidden = false;
    phoneEl.querySelector("a").href = `tel:${siteContact.phone.replace(/\s/g, "")}`;
    phoneEl.querySelector("a").textContent = siteContact.phone;
  } else if (phoneEl) phoneEl.hidden = true;

  if (siteContact.address && addressEl) {
    addressEl.hidden = false;
    addressEl.textContent = siteContact.address;
  } else if (addressEl) addressEl.hidden = true;

  if (!socialWrap) return;
  const links = [
    { key: "linkedin", label: "LinkedIn" },
    { key: "instagram", label: "Instagram" },
    { key: "youtube", label: "YouTube" },
  ];
  links.forEach(({ key, label }) => {
    const a = socialWrap.querySelector(`[data-social="${key}"]`);
    if (!a) return;
    if (siteContact[key]) {
      a.href = siteContact[key];
      a.hidden = false;
      a.setAttribute("aria-label", label);
    } else {
      a.hidden = true;
    }
  });
}

function initLanguage() {
  const savedLang = getStoredLanguage();
  setLanguage(savedLang);

  document.querySelectorAll(".lang").forEach((b) => {
    b.addEventListener("click", () => setLanguage(b.dataset.lang));
  });
}

function initMobileNav() {
  const hamb = document.getElementById("hamb");
  const mobile = document.getElementById("mobileLinks");
  if (!hamb || !mobile) return;

  hamb.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    hamb.setAttribute("aria-expanded", open ? "true" : "false");
  });

  mobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobile.classList.remove("open");
      hamb.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      mobile.classList.remove("open");
      hamb.setAttribute("aria-expanded", "false");
    }
  });
}

function initScrollSpy() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".links a, .mobile-links a")];

  window.addEventListener(
    "scroll",
    () => {
      let active = "home";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 140) active = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${active}`);
      });
    },
    { passive: true }
  );
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  const initialHash = window.location.hash;

  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }

  if (!initialHash) {
    window.scrollTo(0, 0);
  } else {
    requestAnimationFrame(() => {
      const target = document.querySelector(initialHash);
      if (!target) return;

      const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
      window.scrollTo({ top, behavior: "auto" });
    });
  }

  applyContactDetails();
  initLanguage();
  initMobileNav();
  initScrollSpy();
  initHeader();
  initReveal();
});
