async function loadContent() {
    const response = await fetch('content.json', { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Falha ao carregar content.json (${response.status})`);
    }
    return response.json();
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function markdownLinkToHtml(value) {
    if (!value) return '';
    const match = String(value).match(/^\[(.+)\]\((.+)\)$/);
    if (!match) return escapeHtml(value);
    const [, label, url] = match;
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function markdownLinkUrl(value) {
    if (!value) return '';
    const match = String(value).match(/^\[(.+)\]\((.+)\)$/);
    return match ? match[2] : String(value);
}

function normalizePhoneDigits(value) {
    return String(value ?? '').replace(/\D/g, '');
}

function whatsappUrl(phone, brandName) {
    const digits = normalizePhoneDigits(phone);
    if (!digits) return '#contato';
    const intlDigits = digits.startsWith('55') ? digits : `55${digits}`;
    const message = encodeURIComponent(`Olá! Vim pelo site da ${brandName || 'TrevoMind'} e quero agendar uma reunião.`);
    return `https://wa.me/${intlDigits}?text=${message}`;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? '';
}

function setHtml(id, html) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html;
}

function menuAnchors(items) {
    const anchors = [
        ['Início', '#home'],
        ['Quem Somos', '#quem-somos'],
        ['Serviços', '#quem-somos'],
        ['Diferenciais', '#diferenciais'],
        ['Cases', '#cases'],
        ['Contato', '#contato'],
    ];

    if (!Array.isArray(items) || !items.length) return anchors;
    return items.map((label, index) => [label, anchors[index]?.[1] || '#home']);
}

function renderMainMenu(items) {
    return menuAnchors(items).map(([label, href], index) => `
    <li class="nav-item">
      <a class="nav-link p-0 ${index === 0 ? 'active' : ''}" href="${href}">${escapeHtml(label)}</a>
    </li>
  `).join('');
}

function renderFooterMenu(items) {
    return menuAnchors(items).map(([label, href]) => `
    <li><i class="fa-solid fa-arrow-right"></i><a href="${href}" class="text-decoration-none">${escapeHtml(label)}</a></li>
  `).join('');
}

function renderHeroBadges(items) {
    return (items || []).map((item) => `
    <li class="position-relative d-inline-block"><i class="fa-solid fa-circle-check"></i>${escapeHtml(item)}</li>
  `).join('');
}

function renderKeywords(items) {
    return (items || []).slice(0, 5).map((item, index) => `
    <figure class="trevomind-keyword-item trevomind-delay-${index + 1} wow fadeInRight" data-wow-duration="2s" data-wow-delay="${0.6 + (index * 0.4)}s"><span>${escapeHtml(item)}</span></figure>
  `).join('');
}

function renderPillars(items) {
    const imageMap = [
        {
            boxClass: '',
            titleClass: '',
            descClass: '',
            icons: ``,
            figure: `<figure><img src="assets/images/feature-img1.png" alt="feature image" class="img-fluid"></figure>`
        },
        {
            boxClass: 'bg-green',
            titleClass: '',
            descClass: '',
            icons: `
        <img src="assets/images/feature-img2-icon1.png" alt="feature image" class="img-fluid position-absolute feature-icon2">
        <img src="assets/images/feature-img2-icon2.png" alt="feature image" class="img-fluid position-absolute feature-icon3">
        <img src="assets/images/feature-img2-icon3.png" alt="feature image" class="img-fluid position-absolute feature-icon4">
        <img src="assets/images/feature-img2-icon4.png" alt="feature image" class="img-fluid position-absolute feature-icon5">
      `,
            figure: `<figure><img src="assets/images/feature-img2.png" alt="feature image" class="img-fluid"></figure>`
        },
        {
            boxClass: '',
            titleClass: '',
            descClass: '',
            icons: `
        <img src="assets/images/feature-img3-icon1.png" alt="feature image" class="img-fluid position-absolute feature-icon6">
        <img src="assets/images/elipse-blue.png" alt="feature image" class="img-fluid position-absolute blue-elipse">
      `,
            figure: `<figure><img src="assets/images/feature-img3.png" alt="feature image" class="img-fluid feature-img3"></figure>`
        }
    ];

    return (items || []).slice(0, 3).map((item, index) => {
        const visual = imageMap[index] || imageMap[0];
        return `
      <div class="col-lg-4 col-md-6 all_column mb-4 wow ${index === 0 ? 'fadeInLeft' : index === 1 ? 'fadeInUp' : 'fadeInRight'}" data-wow-duration="2s" data-wow-delay="0.5s">
        <div class="feature-box position-relative all_boxes ${visual.boxClass}">
          <h4>${escapeHtml(item.title)}</h4>
          <p class="mb-0">${escapeHtml(item.description)}</p>
          ${visual.icons}
          ${visual.figure}
          <a href="#contato"><img src="assets/images/up-right-arrow.png" alt="arrow" class="img-fluid"></a>
        </div>
      </div>
    `;
    }).join('');
}

function renderProcessSteps(items) {
    return (items || []).slice(0, 3).map((item, index) => `
    <li class="position-relative d-flex align-items-center wow fadeInUp" data-wow-duration="2s" data-wow-delay="${0.6 + (index * 0.1)}s">
      <span class="d-block color-blue">${escapeHtml(item.number || `0${index + 1}`)}</span>
      <div class="work-content-inner-con">
        <h5>${escapeHtml(item.title)}</h5>
        <p class="mb-0">${escapeHtml(item.description)}</p>
      </div>
    </li>
  `).join('');
}

function renderDifferentials(items) {
    const iconFiles = [
        'choose-icon1.png',
        'choose-icon2.png',
        'choose-icon3.png',
        'choose-icon4.png',
        'choose-icon5.png'
    ];
    return (items || []).slice(0, 5).map((item, index) => `
    <div class="choose-box wow fadeInUp" data-wow-duration="2s" data-wow-delay="${0.4 + (index * 0.1)}s">
      <figure><img src="assets/images/${iconFiles[index] || iconFiles[0]}" alt="icon" class="img-fluid"></figure>
      <h6>${escapeHtml(item.title)}</h6>
      <p class="mb-0">${escapeHtml(item.description)}</p>
    </div>
  `).join('');
}

function renderWorkModels(items) {
    return (items || []).map((item, index) => `
    <div class="col-lg-4 col-md-6 all_column mb-4 wow fadeInUp" data-wow-duration="2s" data-wow-delay="${0.5 + (index * 0.1)}s">
      <div class="pricing-box w-100 all_boxes">
        <div class="plan-content">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="generic-price d-inline-block">
            <span class="d-block starting-at">Modelo:</span>
            <span class="d-inline-block price-text font-weight-600">${escapeHtml(item.number)}</span>
          </div>
        </div>
        <div class="plan-listing">
          <ul class="list-unstyled p-0">
            <li class="position-relative"><i class="fa-solid fa-check"></i>${escapeHtml(item.title)}</li>
            <li class="position-relative"><i class="fa-solid fa-check"></i>${escapeHtml(item.description)}</li>
          </ul>
          <a href="{{WHATSAPP_URL}}" class="text-decoration-none primary_btn" target="_blank" rel="noopener noreferrer">Agendar reunião</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCases(items) {
    const expanded = [];
    while (expanded.length < 6) {
        for (const item of items || []) {
            expanded.push(item);
            if (expanded.length >= 6) break;
        }
        if (!(items || []).length) break;
    }

    return expanded.map((item) => `
    <div class="item">
      <div class="testimonial-box">
        <figure><img src="assets/images/star-icon.png" alt="stars" class="img-fluid"></figure>
        <p>${escapeHtml(item.description)}</p>
        <span class="d-block customer font-weight-600">${escapeHtml(item.title)}</span>
        <span class="d-block designation font-weight-500">${escapeHtml(item.result)}</span>
      </div>
    </div>
  `).join('');
}

function renderFaq(items) {
    return (items || []).slice(0, 4).map((item, index) => {
        const isOpen = index === 1;
        const collapseId = `collapse${index + 1}`;
        const headingId = `heading${index + 1}`;
        return `
      <div class="accordion-card wow fadeInUp" data-wow-duration="2s" data-wow-delay="${0.2 + (index * 0.1)}s">
        <div class="card-header" id="${headingId}">
          <a href="#" class="btn btn-link ${isOpen ? '' : 'collapsed'}" data-toggle="collapse"
            data-target="#${collapseId}" aria-expanded="${isOpen ? 'true' : 'false'}"
            aria-controls="${collapseId}">
            <h6>${escapeHtml(item.question)}</h6>
          </a>
        </div>
        <div id="${collapseId}" class="${isOpen ? 'show ' : ''}collapse" aria-labelledby="${headingId}" data-parent="#faq_accordion1">
          <div class="card-body">
            <p class="text-size-16 text-left mb-0">${escapeHtml(item.answer)}</p>
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function renderFooterContacts(project, footerItems) {
    const items = footerItems || [project.website, project.email, project.phone, project.instagram];
    return items.map((item) => {
        if (String(item).includes('mailto:')) {
            return `<li class="text"><i class="fa-solid fa-envelope"></i>${markdownLinkToHtml(item)}</li>`;
        }
        if (String(item).includes('http')) {
            return `<li class="text"><i class="fa-solid fa-globe"></i>${markdownLinkToHtml(item)}</li>`;
        }
        if (String(item).includes('@')) {
            return `<li class="text"><i class="fa-brands fa-instagram"></i><span>${escapeHtml(item)}</span></li>`;
        }
        return `<li class="text"><i class="fa-solid fa-phone-volume"></i><span>${escapeHtml(item)}</span></li>`;
    }).join('');
}

function startTypingLoop(elementId, text, options = {}) {
    const element = document.getElementById(elementId);
    if (!element || !text) return;

    const typeSpeed = options.typeSpeed || 42;
    const eraseSpeed = options.eraseSpeed || 26;
    const holdBeforeErase = options.holdBeforeErase || 1400;
    const holdBeforeType = options.holdBeforeType || 350;
    let index = 0;
    let direction = 1;

    function tick() {
        element.textContent = text.slice(0, index);

        if (direction === 1) {
            if (index < text.length) {
                index += 1;
                setTimeout(tick, typeSpeed);
                return;
            }
            direction = -1;
            setTimeout(tick, holdBeforeErase);
            return;
        }

        if (index > 0) {
            index -= 1;
            setTimeout(tick, eraseSpeed);
            return;
        }

        direction = 1;
        setTimeout(tick, holdBeforeType);
    }

    tick();
}

function hydrateSite(content) {
    const { project, branding, hero, about, process, differentials, work_models: workModels, cases, cta_section: cta, template_mapping: mapping } = content;
    const meetingUrl = whatsappUrl(project.phone, project.brand_name);

    document.title = `${project.brand_name} | ${project.tagline}`;

    setText('brandName', project.brand_name);
    setText('footerBrandName', project.brand_name);
    setHtml('mainMenu', renderMainMenu(mapping?.header?.menu_items));
    setHtml('footerMenu', renderFooterMenu(mapping?.header?.menu_items));
    setText('headerCta', mapping?.header?.button_text || project.cta_primary);
    const headerCta = document.getElementById('headerCta');
    if (headerCta) {
        headerCta.href = meetingUrl;
        headerCta.target = '_blank';
        headerCta.rel = 'noopener noreferrer';
    }

    setHtml('heroBadges', renderHeroBadges(mapping?.banner?.badge_items || hero.support_points));
    setHtml('heroTitle', `${escapeHtml(hero.title)} <span class="d-inline-block font-weight-bold color-blue">${escapeHtml(hero.subtitle)}</span>`);
    setText('heroDescription', mapping?.banner?.description || hero.description);
    setText('heroPrimary', mapping?.banner?.primary_button || hero.primary_button);
    setText('heroSecondary', mapping?.banner?.secondary_button || hero.secondary_button);
    const heroPrimary = document.getElementById('heroPrimary');
    if (heroPrimary) {
        heroPrimary.href = meetingUrl;
        heroPrimary.target = '_blank';
        heroPrimary.rel = 'noopener noreferrer';
    }
    setText('heroBubbleOne', '');
    setText('heroBubbleTwo', '');
    startTypingLoop('heroBubbleOne', branding.value_proposition, {
        typeSpeed: 38,
        eraseSpeed: 22,
        holdBeforeErase: 1500,
        holdBeforeType: 500
    });
    startTypingLoop('heroBubbleTwo', branding.signature_phrase, {
        typeSpeed: 34,
        eraseSpeed: 20,
        holdBeforeErase: 1700,
        holdBeforeType: 900
    });

    setText('shortPitch', project.short_pitch);
    setHtml('brandingKeywords', renderKeywords(branding.keywords));

    setText('aboutSectionTitle', about.section_title);
    setText('aboutHeadline', about.headline);
    setHtml('aboutPillars', renderPillars(mapping?.features_cards || about.pillars));

    setText('processSectionTitle', process.section_title);
    setText('processHeadline', 'Como a TrevoMind deveria atuar do diagnóstico ao resultado');
    setHtml('processSteps', renderProcessSteps(process.steps));
    setText('processCta', project.cta_primary);
    const processCta = document.getElementById('processCta');
    if (processCta) {
        processCta.href = meetingUrl;
        processCta.target = '_blank';
        processCta.rel = 'noopener noreferrer';
    }

    setText('diffSectionTitle', differentials.section_title);
    setText('diffSubtitle', differentials.subtitle);
    setHtml('differentialsItems', renderDifferentials(differentials.items));
    setText('diffCta', project.cta_primary);
    const diffCta = document.getElementById('diffCta');
    if (diffCta) {
        diffCta.href = meetingUrl;
        diffCta.target = '_blank';
        diffCta.rel = 'noopener noreferrer';
    }

    setText('workModelsSectionTitle', workModels.section_title);
    setText('workModelsHeadline', 'Modelos flexíveis para cada necessidade de comunicação');
    setHtml('workModelsItems', renderWorkModels(workModels.items).replaceAll('{{WHATSAPP_URL}}', meetingUrl));

    setText('casesSectionTitle', cases.section_title);
    setText('casesHeadline', 'Resultados, campanhas e posicionamentos que viraram referência');
    setHtml('casesCarousel', renderCases(cases.items));

    setText('faqHeadline', 'Perguntas frequentes sobre a atuação da TrevoMind');
    setHtml('faqItems', renderFaq(mapping?.faq_suggestions || []));

    setText('ctaHeadline', cta.headline);
    setText('ctaDescription', cta.description);
    setText('ctaButton', cta.button_text);
    setText('contactButton', 'Falar com a TrevoMind');

    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.href = meetingUrl;
        ctaButton.target = '_blank';
        ctaButton.rel = 'noopener noreferrer';
    }

    const contactButton = document.getElementById('contactButton');
    if (contactButton) contactButton.href = markdownLinkUrl(project.website || '#');

    setText('footerAbout', mapping?.footer?.about_text || project.description);
    setHtml('footerContacts', renderFooterContacts(project, mapping?.footer?.contact_items));
    setText('signaturePhrase', branding.signature_phrase);
    setText('footerClosing', project.closing_phrase);
    setText('copyrightLine', `Copyright © ${new Date().getFullYear()} ${project.brand_name}. ${project.closing_phrase}`);

    if (typeof WOW === 'function') {
        try {
            new WOW().init();
        } catch (_) {
            // Keep the page usable even if WOW initialization fails.
        }
    }

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
        const carousel = window.jQuery('#casesCarousel');
        if (carousel.hasClass('owl-loaded')) {
            carousel.trigger('destroy.owl.carousel');
            carousel.removeClass('owl-loaded');
            carousel.find('.owl-stage-outer').children().unwrap();
        }
        carousel.owlCarousel({
            loop: true,
            margin: 24,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 3500,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                1200: { items: 3 }
            }
        });
    }
}

loadContent()
    .then(hydrateSite)
    .catch((error) => {
        document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px;font-family:Arial,sans-serif;background:#f8faf9;color:#102018;">
        <div style="max-width:680px;background:#fff;padding:40px;border-radius:24px;box-shadow:0 20px 40px rgba(16,32,24,.1);">
          <h1 style="font-size:32px;line-height:1.2;margin-bottom:16px;">TrevoMind</h1>
          <p style="margin:0;font-size:18px;line-height:1.6;">Não foi possível carregar o conteúdo do site agora.</p>
          <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#52605a;">${escapeHtml(error.message)}</p>
        </div>
      </div>
    `;
    });
