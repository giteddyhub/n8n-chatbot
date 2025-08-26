// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: min(680px, 92vw);
            height: min(80vh, 760px);
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 92%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .n8n-chat-widget .chat-message.bot .message-text a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            word-break: break-all;
        }
        .n8n-chat-widget .chat-message.bot .links-preview {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(133, 79, 255, 0.15);
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .n8n-chat-widget .chat-message.bot .links-preview a {
            font-size: 12px;
            color: var(--chat--color-primary);
            text-decoration: underline;
            background: rgba(133, 79, 255, 0.06);
            padding: 4px 6px;
            border-radius: 6px;
        }
        /* Typing indicator styles */
        .n8n-chat-widget .chat-message.bot.typing {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .n8n-chat-widget .chat-message.bot.typing .dot {
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background: var(--chat--color-font);
            opacity: 0.4;
            animation: n8nChatTyping 1.2s infinite ease-in-out;
        }
        .n8n-chat-widget .chat-message.bot.typing .dot:nth-child(2) { animation-delay: 0.2s; }
        .n8n-chat-widget .chat-message.bot.typing .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes n8nChatTyping {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.3; }
            40% { transform: scale(1); opacity: 0.8; }
        }
        .n8n-chat-widget .chat-message.bot .message-text ul,
        .n8n-chat-widget .chat-message.bot .message-text ol {
            margin: 8px 0;
            padding-left: 20px;
        }
        .n8n-chat-widget .chat-message.bot .message-text li {
            margin: 4px 0;
        }
        .n8n-chat-widget .chat-message.bot .message-text p {
            margin: 8px 0 0 0;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 16px; /* Prevent iOS zoom by ensuring >=16px */
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /* Mobile full-bleed */
        @media (max-width: 640px) {
            .n8n-chat-widget .chat-container {
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw;
                height: 100vh;
                border-radius: 0;
            }
            .n8n-chat-widget .chat-toggle { right: 16px; bottom: 16px; }
            .n8n-chat-widget .chat-message { max-width: 100%; }
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            welcomeButtonText: 'Send us a message',
            initialGreeting: '',
            poweredBy: {
                text: '',
                link: ''
            }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                ${config.branding.welcomeButtonText || 'Send us a message'}
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Type your message here..." rows="1"></textarea>
                <button type="submit">Send</button>
            </div>
            ${config.branding.poweredBy.text ? `<div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>` : ''}
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Safely convert plain text to HTML with clickable links (bot messages only)
    function escapeHTML(unsafeText) {
        const div = document.createElement('div');
        div.textContent = unsafeText ?? '';
        return div.innerHTML;
    }

    function looksLikeHtml(text) {
        return /<\s*[a-zA-Z][\s\S]*>/.test(text || '');
    }

    function sanitizeHtmlAndCollectLinks(unsafeHtml) {
        const allowedTags = new Set(['a','strong','em','b','i','u','p','br','ul','ol','li']);
        const container = document.createElement('div');
        container.innerHTML = unsafeHtml || '';
        const links = [];

        const isHttpUrl = (href) => /^https?:\/\//i.test(href || '');
        const normalizeUrl = (raw) => {
            if (!raw) return null;
            let href = String(raw).trim();
            if (href.startsWith('www.')) href = `https://${href}`;
            if (!isHttpUrl(href)) return null;
            return href;
        };

        const walk = (node) => {
            // Remove script/style and comment nodes
            if (node.nodeType === Node.COMMENT_NODE) {
                node.parentNode && node.parentNode.removeChild(node);
                return;
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node;
                const tag = el.tagName.toLowerCase();
                if (!allowedTags.has(tag)) {
                    // Replace unknown element with its text content
                    const text = document.createTextNode(el.textContent || '');
                    el.parentNode && el.parentNode.replaceChild(text, el);
                    return;
                }
                // Sanitize anchors
                if (tag === 'a') {
                    const href = el.getAttribute('href') || '';
                    if (!isHttpUrl(href)) {
                        // drop unsafe hrefs
                        el.removeAttribute('href');
                    } else {
                        links.push(href);
                        el.setAttribute('target','_blank');
                        el.setAttribute('rel','noopener noreferrer');
                    }
                    // remove any inline handlers
                    [...el.attributes].forEach(attr => {
                        if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
                    });
                }
                // Recurse children; convert <br> to allowed as-is
                const children = Array.from(el.childNodes);
                children.forEach(walk);
                return;
            }
            // text nodes: no-op
        };
        Array.from(container.childNodes).forEach(walk);

        // Second pass: convert markdown emphasis in text nodes, then linkify bare URLs
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
        const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
        const textNodes = [];
        let n; while ((n = walker.nextNode())) textNodes.push(n);
        textNodes.forEach((textNode) => {
            const original = textNode.nodeValue || '';
            // Step 1: apply emphasis to the text node by generating small HTML
            let emphasizedHtml = escapeHTML(original)
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/__(.+?)__/g, '<strong>$1</strong>')
                .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>')
                .replace(/(^|[^_])_([^_]+)_(?!_)/g, '$1<em>$2</em>');

            const temp = document.createElement('span');
            temp.innerHTML = emphasizedHtml;

            // Step 2: within this span, linkify bare URLs while preserving the emphasis elements
            const innerWalker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null);
            const innerTextNodes = [];
            let t; while ((t = innerWalker.nextNode())) innerTextNodes.push(t);
            innerTextNodes.forEach((tn) => {
                const text = tn.nodeValue || '';
                if (!urlRegex.test(text)) return; urlRegex.lastIndex = 0;
                const frag = document.createDocumentFragment();
                let lastIndex = 0; let m;
                while ((m = urlRegex.exec(text))) {
                    const [raw] = m;
                    const before = text.slice(lastIndex, m.index);
                    if (before) frag.appendChild(document.createTextNode(before));
                    const safe = normalizeUrl(raw);
                    if (safe) {
                        const a = document.createElement('a');
                        a.href = safe; a.target = '_blank'; a.rel = 'noopener noreferrer';
                        a.textContent = raw; links.push(safe);
                        frag.appendChild(a);
                    } else {
                        frag.appendChild(document.createTextNode(raw));
                    }
                    lastIndex = m.index + raw.length;
                }
                const after = text.slice(lastIndex);
                if (after) frag.appendChild(document.createTextNode(after));
                tn.parentNode && tn.parentNode.replaceChild(frag, tn);
            });

            // Replace original text node with the processed fragment
            const replacementFrag = document.createDocumentFragment();
            Array.from(temp.childNodes).forEach((child) => replacementFrag.appendChild(child));
            textNode.parentNode && textNode.parentNode.replaceChild(replacementFrag, textNode);
        });

        return { html: container.innerHTML, links };
    }

    function linkifyAndExtractLinks(plainText) {
        // If HTML is provided by n8n, sanitize and use it directly
        if (looksLikeHtml(plainText)) {
            return sanitizeHtmlAndCollectLinks(plainText);
        }
        const links = [];
        const sanitizeUrl = (raw) => {
            if (!raw) return null;
            let href = raw.trim();
            if (href.startsWith('www.')) href = `https://${href}`;
            if (!/^https?:\/\//i.test(href)) return null; // block non-http(s)
            return href;
        };

        const processInline = (text) => {
            // escape first
            let out = escapeHTML(text);

            // markdown emphasis:
            // handle nested emphasis safely using non-greedy, avoid matching across spaces-only
            // strong first, then em
            out = out.replace(/\*\*([^*][\s\S]*?)\*\*/g, '<strong>$1</strong>');
            out = out.replace(/__([^_][\s\S]*?)__/g, '<strong>$1</strong>');
            // italics; avoid double-asterisk sequences and underscores part of words
            out = out.replace(/(?<!\*)\*([^*][\s\S]*?)\*(?!\*)/g, '<em>$1</em>');
            out = out.replace(/(?<!_)_([^_][\s\S]*?)_(?!_)/g, '<em>$1</em>');

            // markdown links [text](url)
            const mdLink = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi;
            out = out.replace(mdLink, (_, label, url) => {
                const safeUrl = sanitizeUrl(url);
                if (!safeUrl) return _;
                links.push(safeUrl);
                return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
            });

            // replace bare URLs outside existing anchors
            const splitByAnchors = out.split(/(<a [^>]+>.*?<\/a>)/gi);
            const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
            for (let i = 0; i < splitByAnchors.length; i += 2) { // non-anchor segments at even indexes
                if (splitByAnchors[i] === undefined) continue;
                splitByAnchors[i] = splitByAnchors[i].replace(urlRegex, (match) => {
                    const safeUrl = sanitizeUrl(match);
                    if (!safeUrl) return match;
                    links.push(safeUrl);
                    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${match}</a>`;
                });
            }
            out = splitByAnchors.join('');
            return out;
        };

        // Build simple paragraphs and lists from markdown-like text
        // Normalize newlines. Some sources send literal "\n" sequences – convert them to real newlines.
        const normalized = (plainText || '')
            .replace(/\r\n/g, '\n')
            .replace(/\\n/g, '\n');
        // Heuristic: inline bullets separated by " - " in a single line
        if (!/\n/.test(normalized) && /\s-\s/.test(normalized)) {
            const parts = normalized.split(/\s-\s/);
            const intro = parts.shift();
            const htmlPartsInline = [];
            if (intro && intro.trim()) htmlPartsInline.push(`<p>${processInline(intro.trim())}</p>`);
            if (parts.length) {
                htmlPartsInline.push('<ul>');
                parts.forEach(item => {
                    const t = item.trim();
                    if (t) htmlPartsInline.push(`<li>${processInline(t)}</li>`);
                });
                htmlPartsInline.push('</ul>');
            }
            return { html: htmlPartsInline.join(''), links };
        }

        const lines = normalized.split('\n');
        let htmlParts = [];
        let listType = null; // 'ul' | 'ol' | null
        let paragraphBuffer = [];

        const flushParagraph = () => {
            if (paragraphBuffer.length) {
                const paragraph = processInline(paragraphBuffer.join(' '));
                htmlParts.push(`<p>${paragraph}</p>`);
                paragraphBuffer = [];
            }
        };
        const openList = (type) => {
            if (listType !== type) {
                if (listType) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>');
                flushParagraph();
                listType = type;
                htmlParts.push(type === 'ul' ? '<ul>' : '<ol>');
            }
        };
        const closeList = () => {
            if (listType) {
                htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>');
                listType = null;
            }
        };

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) {
                // Blank line: do not close an active list. Just separate paragraphs if not in a list
                if (!listType) {
                    flushParagraph();
                }
                continue;
            }

            // Headings like "### Title" → paragraph with strong
            const headingMatch = /^#{1,6}\s+(.+)$/.exec(line);
            if (headingMatch) {
                closeList();
                htmlParts.push(`<p><strong>${processInline(headingMatch[1])}</strong></p>`);
                continue;
            }

            const ulMatch = /^(?:[-*]|•)\s+(.+)$/.exec(line);
            const olMatch = /^(\d+)\.\s+(.+)$/.exec(line);
            if (ulMatch) {
                openList('ul');
                htmlParts.push(`<li>${processInline(ulMatch[1])}</li>`);
            } else if (olMatch) {
                openList('ol');
                htmlParts.push(`<li>${processInline(olMatch[2])}</li>`);
            } else {
                closeList();
                paragraphBuffer.push(line);
            }
        }
        closeList();
        flushParagraph();

        return { html: htmlParts.join(''), links };
    }

    function appendBotMessage(messageText) {
        if (!messageText || !messageText.trim()) return;
        const { html, links } = linkifyAndExtractLinks(messageText);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = html;
        botMessageDiv.appendChild(textDiv);

        if (Array.isArray(links) && links.length > 0) {
            const linksDiv = document.createElement('div');
            linksDiv.className = 'links-preview';
            links.forEach((href) => {
                const a = document.createElement('a');
                a.href = href;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = href.replace(/^https?:\/\//, '');
                linksDiv.appendChild(a);
            });
            botMessageDiv.appendChild(linksDiv);
        }

        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chat-message bot typing';
        typing.setAttribute('data-typing', 'true');
        typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typing;
    }

    function hideTypingIndicator(typingEl) {
        if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        
        // Show chat interface first
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');

        // Show initial greeting if configured (fallback to welcomeText)
        const greetingMessage = (config.branding.initialGreeting && config.branding.initialGreeting.trim())
            ? config.branding.initialGreeting
            : (config.branding.welcomeText && config.branding.welcomeText.trim())
                ? config.branding.welcomeText
                : '';
        if (greetingMessage) {
            appendBotMessage(greetingMessage);
        }

        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            const typingEl = showTypingIndicator();
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            hideTypingIndicator(typingEl);
            
            // Only show webhook response if it's different from greeting or if no greeting is set
            const webhookMessage = Array.isArray(responseData) ? responseData[0]?.output : responseData?.output;
            if (webhookMessage && webhookMessage.trim() && (!greetingMessage || webhookMessage !== greetingMessage)) {
                appendBotMessage(webhookMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            // Remove typing if present on error
            const t = chatContainer.querySelector('.chat-message.bot.typing[data-typing="true"]');
            if (t) hideTypingIndicator(t);
            // If webhook fails but we have a greeting, that's still fine
            if (!config.branding.initialGreeting) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'chat-message bot';
                errorDiv.textContent = 'Sorry, I encountered an error. Please try again.';
                messagesContainer.appendChild(errorDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const typingEl = showTypingIndicator();
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            hideTypingIndicator(typingEl);
            
            const botMessage = Array.isArray(data) ? data[0]?.output : data?.output;
            if (botMessage && botMessage.trim()) {
                appendBotMessage(botMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            const t = chatContainer.querySelector('.chat-message.bot.typing[data-typing="true"]');
            if (t) hideTypingIndicator(t);
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });
})();
