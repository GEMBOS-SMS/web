// GEMBOS Website Interactive JavaScript - Clean Version

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = 70;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // API Explorer functionality
    const apiLinks = document.querySelectorAll('.api-link');
    const apiContent = document.querySelector('.api-content');
    
    // API endpoints data
    const apiEndpointsData = {
        'auth-register': {
            method: 'POST',
            path: '/auth/register',
            description: 'Register a new user account with encrypted credentials.',
            requestBody: {
                username: 'string',
                email: 'string', 
                phoneNumber: 'string',
                password: 'string',
                publicKey: 'string'
            },
            response: {
                success: true,
                message: 'User registered successfully',
                data: {
                    accessToken: 'string',
                    refreshToken: 'string',
                    user: {
                        id: 1,
                        username: 'string',
                        email: 'string'
                    }
                }
            }
        },
        'auth-login': {
            method: 'POST',
            path: '/auth/login',
            description: 'Authenticate user credentials and return JWT tokens.',
            requestBody: {
                email: 'string',
                password: 'string'
            },
            response: {
                success: true,
                message: 'Login successful',
                data: {
                    accessToken: 'string',
                    refreshToken: 'string',
                    expiresIn: 86400000,
                    user: {
                        id: 1,
                        username: 'string',
                        email: 'string'
                    }
                }
            }
        },
        'auth-refresh': {
            method: 'POST',
            path: '/auth/refresh',
            description: 'Refresh access token using refresh token.',
            requestBody: {
                refreshToken: 'string'
            },
            response: {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    accessToken: 'string',
                    refreshToken: 'string',
                    expiresIn: 86400000
                }
            }
        },
        'msg-send': {
            method: 'POST',
            path: '/messages/send',
            description: 'Send an encrypted message to another user.',
            requestBody: {
                recipientId: 'number',
                encryptedContent: 'string',
                contentHash: 'string',
                transmissionMode: 'INTERNET | SMS'
            },
            response: {
                success: true,
                message: 'Message sent successfully',
                data: {
                    id: 1,
                    senderId: 1,
                    recipientId: 2,
                    encryptedContent: 'string',
                    messageStatus: 'SENT',
                    createdAt: '2025-06-20T10:30:00Z'
                }
            }
        },
        'msg-get': {
            method: 'GET',
            path: '/messages/{messageId}',
            description: 'Retrieve a specific message by ID.',
            parameters: {
                messageId: 'number (path parameter)'
            },
            response: {
                success: true,
                data: {
                    id: 1,
                    senderId: 1,
                    recipientId: 2,
                    encryptedContent: 'string',
                    contentHash: 'string',
                    isRead: true,
                    readAt: '2025-06-20T10:35:00Z',
                    createdAt: '2025-06-20T10:30:00Z'
                }
            }
        },
        'msg-conversation': {
            method: 'GET',
            path: '/messages/conversation/{userId}',
            description: 'Get conversation messages with another user.',
            parameters: {
                userId: 'number (path parameter)',
                page: 'number (query parameter, default: 0)',
                size: 'number (query parameter, default: 50)'
            },
            response: {
                success: true,
                data: {
                    content: [
                        {
                            id: 1,
                            senderId: 1,
                            recipientId: 2,
                            encryptedContent: 'string',
                            isRead: true,
                            createdAt: '2025-06-20T10:30:00Z'
                        }
                    ],
                    totalElements: 1,
                    totalPages: 1
                }
            }
        },
        'user-profile': {
            method: 'GET',
            path: '/users/me',
            description: 'Get current authenticated user profile information.',
            headers: {
                Authorization: 'Bearer {accessToken}'
            },
            response: {
                success: true,
                data: {
                    id: 1,
                    username: 'string',
                    email: 'string',
                    phoneNumber: 'string',
                    publicKey: 'string',
                    isVerified: true,
                    createdAt: '2025-06-20T08:00:00Z'
                }
            }
        },
        'user-search': {
            method: 'GET',
            path: '/users/search',
            description: 'Search users by username, email, or phone number.',
            parameters: {
                query: 'string (query parameter)',
                page: 'number (query parameter, default: 0)',
                size: 'number (query parameter, default: 20)'
            },
            response: {
                success: true,
                data: {
                    content: [
                        {
                            id: 1,
                            username: 'string',
                            email: 'string',
                            phoneNumber: 'string',
                            isVerified: true
                        }
                    ],
                    totalElements: 1
                }
            }
        },
        'otp-generate': {
            method: 'POST',
            path: '/otp/generate',
            description: 'Generate and send OTP for verification.',
            requestBody: {
                identifier: 'string (email or phone)',
                otpType: 'EMAIL_VERIFICATION | PHONE_VERIFICATION | PASSWORD_RESET'
            },
            response: {
                success: true,
                message: 'OTP sent successfully'
            }
        },
        'otp-verify': {
            method: 'POST',
            path: '/otp/verify',
            description: 'Verify OTP code.',
            requestBody: {
                identifier: 'string',
                otpCode: 'string'
            },
            response: {
                success: true,
                message: 'OTP verified successfully',
                data: true
            }
        }
    };
    
    // Generate API endpoint content
    const generateApiEndpointContent = (endpointId) => {
        const endpoint = apiEndpointsData[endpointId];
        if (!endpoint) return '';
        
        let content = '<div class="endpoint-header">';
        content += '<span class="method ' + endpoint.method.toLowerCase() + '">' + endpoint.method + '</span>';
        content += '<span class="path">' + endpoint.path + '</span>';
        content += '</div>';
        content += '<p>' + endpoint.description + '</p>';
        
        if (endpoint.parameters) {
            content += '<h5>Parameters</h5>';
            content += '<div class="code-block">';
            content += '<pre><code>' + JSON.stringify(endpoint.parameters, null, 2) + '</code></pre>';
            content += '</div>';
        }
        
        if (endpoint.headers) {
            content += '<h5>Headers</h5>';
            content += '<div class="code-block">';
            content += '<pre><code>' + JSON.stringify(endpoint.headers, null, 2) + '</code></pre>';
            content += '</div>';
        }
        
        if (endpoint.requestBody) {
            content += '<h5>Request Body</h5>';
            content += '<div class="code-block">';
            content += '<pre><code>' + JSON.stringify(endpoint.requestBody, null, 2) + '</code></pre>';
            content += '</div>';
        }
        
        content += '<h5>Response</h5>';
        content += '<div class="code-block">';
        content += '<pre><code>' + JSON.stringify(endpoint.response, null, 2) + '</code></pre>';
        content += '</div>';
        
        return content;
    };
    
    // Initialize API explorer
    if (apiContent && apiLinks.length > 0) {
        // Show first endpoint by default
        const firstEndpoint = apiLinks[0].getAttribute('href').substring(1);
        apiContent.innerHTML = '<div class="api-endpoint" id="' + firstEndpoint + '">' + generateApiEndpointContent(firstEndpoint) + '</div>';
        apiLinks[0].classList.add('active');
        
        apiLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                apiLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Generate and show content
                const endpointId = this.getAttribute('href').substring(1);
                const content = generateApiEndpointContent(endpointId);
                apiContent.innerHTML = '<div class="api-endpoint" id="' + endpointId + '">' + content + '</div>';
                
                // Re-add copy buttons to new content
                setTimeout(addCopyButtons, 100);
            });
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.overview-card, .doc-card, .repo-card, .team-member, .contribute-card'
    );
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Copy to clipboard functionality for code blocks
    const addCopyButtons = () => {
        const codeBlocks = document.querySelectorAll('.code-block, .code-preview');
        codeBlocks.forEach(block => {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg> Copy';
            
            copyButton.addEventListener('click', async () => {
                const code = block.querySelector('pre').textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"></polyline></svg> Copied';
                    setTimeout(() => {
                        copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg> Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code: ', err);
                }
            });
            
            // Position the copy button
            block.style.position = 'relative';
            copyButton.style.cssText = `
                position: absolute;
                top: 12px;
                right: 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #94a3b8;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.2s ease;
                z-index: 10;
                opacity: 0;
            `;
            
            copyButton.addEventListener('mouseenter', () => {
                copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
                copyButton.style.color = '#ffffff';
            });
            
            copyButton.addEventListener('mouseleave', () => {
                copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                copyButton.style.color = '#94a3b8';
            });
            
            block.appendChild(copyButton);
        });
    };
    
    // Add copy buttons after DOM is loaded
    setTimeout(addCopyButtons, 100);
    
    // Download tracking
    const downloadLinks = document.querySelectorAll('.doc-download');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function() {
            const fileName = this.getAttribute('href').split('/').pop();
            console.log('Downloaded: ' + fileName);
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'documentation',
                    'event_label': fileName
                });
            }
        });
    });
    
    // External link tracking
    const externalLinks = document.querySelectorAll('a[href^="https://github.com"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const url = this.getAttribute('href');
            console.log('External link clicked: ' + url);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'external_link',
                    'event_label': url
                });
            }
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Scroll progress indicator
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #3b82f6);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    };
    
    createScrollProgress();
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
    });
    
    // Online/offline status
    window.addEventListener('online', function() {
        console.log('Connection restored');
        showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', function() {
        console.log('Connection lost');
        showNotification('Connection lost - you are now offline', 'warning', 5000);
    });
});

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Notification system
const showNotification = (message, type = 'success', duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    let backgroundColor = '#10b981';
    switch (type) {
        case 'error':
            backgroundColor = '#ef4444';
            break;
        case 'warning':
            backgroundColor = '#f59e0b';
            break;
        case 'info':
            backgroundColor = '#3b82f6';
            break;
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
};

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .copy-button {
        opacity: 0;
        transition: opacity 0.2s ease;
    }
    
    .code-block:hover .copy-button,
    .code-preview:hover .copy-button {
        opacity: 1;
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .animate-in {
            animation: none;
        }
        
        * {
            transition: none !important;
            animation: none !important;
        }
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
    }
`;
document.head.appendChild(style);

// GitHub repository data fetching
const fetchGitHubStats = async (repoUrl, statElement) => {
    try {
        // Extract owner and repo from GitHub URL
        const urlParts = repoUrl.replace('https://github.com/', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];
        
        // GitHub API endpoint
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch repository data');
        }
        
        const data = await response.json();
        
        // Update the stats in the DOM
        const statsContainer = statElement.querySelector('.repo-stats');
        if (statsContainer) {
            const starsElement = statsContainer.querySelector('.stat:nth-child(1) span:nth-child(2)');
            const forksElement = statsContainer.querySelector('.stat:nth-child(2) span:nth-child(2)');
            const licenseElement = statsContainer.querySelector('.stat:nth-child(3) span:nth-child(2)');
            
            if (starsElement) starsElement.textContent = data.stargazers_count || '0';
            if (forksElement) forksElement.textContent = data.forks_count || '0';
            if (licenseElement && data.license) licenseElement.textContent = data.license.spdx_id || 'Unknown';
        }
        
        // Add last updated info
        const lastUpdated = new Date(data.updated_at).toLocaleDateString();
        const repoInfo = statElement.querySelector('.repo-info p');
        if (repoInfo && !repoInfo.dataset.updated) {
            repoInfo.innerHTML += `<br><small style="color: #94a3b8;">Updated: ${lastUpdated}</small>`;
            repoInfo.dataset.updated = 'true';
        }
        
    } catch (error) {
        console.warn('Could not fetch GitHub stats for:', repoUrl, error.message);
        // Fallback to default values if API fails
    }
};

// Fetch GitHub stats for all repository cards
const initializeGitHubStats = () => {
    const repoCards = document.querySelectorAll('.repo-card');
    
    repoCards.forEach(card => {
        const repoLink = card.querySelector('a[href^="https://github.com"]');
        if (repoLink) {
            const repoUrl = repoLink.getAttribute('href');
            fetchGitHubStats(repoUrl, card);
        }
    });
};

// Enhanced GitHub API functionality with rate limiting
const githubApiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchGitHubStatsWithCache = async (repoUrl, statElement) => {
    const cacheKey = repoUrl;
    const cached = githubApiCache.get(cacheKey);
    
    // Check if we have cached data that's still fresh
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        updateRepoStats(cached.data, statElement);
        return;
    }
    
    try {
        const urlParts = repoUrl.replace('https://github.com/', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];
        
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Add GitHub token if available (optional)
                ...(window.GITHUB_TOKEN && { 'Authorization': `token ${window.GITHUB_TOKEN}` })
            }
        });
        
        if (!response.ok) {
            if (response.status === 403) {
                console.warn('GitHub API rate limit exceeded');
                return;
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the data
        githubApiCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        updateRepoStats(data, statElement);
        
    } catch (error) {
        console.warn('Could not fetch GitHub stats for:', repoUrl, error.message);
    }
};

const updateRepoStats = (data, statElement) => {
    const statsContainer = statElement.querySelector('.repo-stats');
    if (!statsContainer) return;
    
    // Update stars
    const starsElement = statsContainer.querySelector('.stat:nth-child(1) span:nth-child(2)');
    if (starsElement) {
        const stars = data.stargazers_count || 0;
        starsElement.textContent = formatNumber(stars);
    }
    
    // Update forks
    const forksElement = statsContainer.querySelector('.stat:nth-child(2) span:nth-child(2)');
    if (forksElement) {
        const forks = data.forks_count || 0;
        forksElement.textContent = formatNumber(forks);
    }
    
    // Update license
    const licenseElement = statsContainer.querySelector('.stat:nth-child(3) span:nth-child(2)');
    if (licenseElement && data.license) {
        licenseElement.textContent = data.license.spdx_id || 'Unknown';
    }
    
    // Update language
    const langElement = statElement.querySelector('.repo-lang');
    if (langElement && data.language) {
        langElement.textContent = data.language;
    }
    
    // Add additional repo info
    const repoInfo = statElement.querySelector('.repo-info');
    if (repoInfo && !repoInfo.dataset.enhanced) {
        const description = repoInfo.querySelector('p');
        if (description && data.description && description.textContent.includes('Native')) {
            description.textContent = data.description;
        }
        
        // Add repo metrics
        const metricsDiv = document.createElement('div');
        metricsDiv.className = 'repo-metrics';
        metricsDiv.style.cssText = `
            display: flex;
            gap: 12px;
            margin-top: 8px;
            font-size: 12px;
            color: #94a3b8;
        `;
        
        const lastUpdated = new Date(data.updated_at).toLocaleDateString();
        const size = Math.round(data.size / 1024) || 1; // Convert KB to MB
        
        metricsDiv.innerHTML = `
            <span>📅 Updated: ${lastUpdated}</span>
            <span>💾 ${size} MB</span>
            ${data.open_issues_count ? `<span>🐛 ${data.open_issues_count} issues</span>` : ''}
        `;
        
        repoInfo.appendChild(metricsDiv);
        repoInfo.dataset.enhanced = 'true';
    }
    
    // Add loading animation completion
    statElement.classList.add('loaded');
};

// Format numbers for display (e.g., 1.2k instead of 1200)
const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

// Add loading states to repo cards
const addLoadingStates = () => {
    const repoCards = document.querySelectorAll('.repo-card');
    repoCards.forEach(card => {
        const stats = card.querySelectorAll('.stat span:nth-child(2)');
        stats.forEach(stat => {
            if (stat.textContent === '42' || stat.textContent === '12' || stat.textContent === '56' || stat.textContent === '38' || stat.textContent === '9' || stat.textContent === '18') {
                stat.textContent = '...';
                stat.style.opacity = '0.5';
            }
        });
    });
};

// Initialize GitHub stats fetching
document.addEventListener('DOMContentLoaded', function() {
    // Add loading states immediately
    addLoadingStates();
    
    // Fetch real GitHub stats after a short delay
    setTimeout(() => {
        const repoCards = document.querySelectorAll('.repo-card');
        repoCards.forEach(card => {
            const repoLink = card.querySelector('a[href^="https://github.com"]');
            if (repoLink) {
                const repoUrl = repoLink.getAttribute('href');
                fetchGitHubStatsWithCache(repoUrl, card);
            }
        });
    }, 1000);
});

// Export utilities
window.GEMBOS = {
    debounce,
    throttle,
    showNotification
};