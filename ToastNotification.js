        class ToastNotification {
            constructor() {
                this.toasts = new Map();
                this.queue = [];
                this.containers = new Map();
                this.defaultOptions = {
                    message: '',
                    color: 'info',
                    title: '',
                    duration: 4000,
                    position: 'top-right',
                    icon: '',
                    dismissible: true,
                    pauseOnHover: true,
                    animation: 'fade',
                    rtl: false,
                    customClass: '',
                    maxVisible: 5,
                    queue: true,
                    onClick: null,
                    id: null
                };
                this.icons = {
                    info: 'ℹ️',
                    success: '✅',
                    warning: '⚠️',
                    error: '❌'
                };
            }

            // Create or get container for specific position
            getContainer(position) {
                if (!this.containers.has(position)) {
                    const container = document.createElement('div');
                    container.className = `toast-container ${position}`;
                    document.body.appendChild(container);
                    this.containers.set(position, container);
                }
                return this.containers.get(position);
            }

            // Generate unique ID for toast
            generateId() {
                return 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }

            // Get visible toasts count for a position
            getVisibleCount(position) {
                const container = this.containers.get(position);
                return container ? container.children.length : 0;
            }

            // Create toast element
            createToastElement(options) {
                const toast = document.createElement('div');
                const id = options.id || this.generateId();
                
                toast.className = `toast ${options.color} ${options.customClass}`;
                toast.id = id;
                
                if (options.rtl) {
                    toast.classList.add('rtl');
                }

                // Create toast content
                let content = '';
                
                if (options.title || options.icon) {
                    content += '<div class="toast-header">';
                    if (options.icon) {
                        content += `<span class="toast-icon">${options.icon}</span>`;
                    } else if (this.icons[options.color]) {
                        content += `<span class="toast-icon">${this.icons[options.color]}</span>`;
                    }
                    if (options.title) {
                        content += `<div class="toast-title">${options.title}</div>`;
                    }
                    content += '</div>';
                }
                
                content += `<div class="toast-message">${options.message}</div>`;
                
                if (options.dismissible) {
                    content += '<button class="toast-close" aria-label="Close">&times;</button>';
                }
                
                if (options.duration > 0) {
                    content += '<div class="toast-progress"></div>';
                }
                
                toast.innerHTML = content;

                // Add click handler
                if (options.onClick) {
                    toast.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('toast-close')) {
                            options.onClick(toast, options);
                        }
                    });
                }

                // Add close button handler
                const closeBtn = toast.querySelector('.toast-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.hide(id);
                    });
                }

                return { toast, id };
            }

            // Show toast with animation
            show(options = {}) {
                const config = { ...this.defaultOptions, ...options };
                const container = this.getContainer(config.position);
                
                // Check if we need to queue
                if (config.queue && this.getVisibleCount(config.position) >= config.maxVisible) {
                    this.queue.push(config);
                    return null;
                }

                const { toast, id } = this.createToastElement(config);
                
                // Store toast reference
                this.toasts.set(id, {
                    element: toast,
                    options: config,
                    timer: null,
                    startTime: null,
                    remainingTime: config.duration
                });

                // Add to container
                container.appendChild(toast);

                // Apply enter animation
                this.applyAnimation(toast, config.animation, 'in', config.position);

                // Setup auto-dismiss timer
                if (config.duration > 0) {
                    this.startTimer(id);
                }

                // Setup hover pause
                if (config.pauseOnHover && config.duration > 0) {
                    toast.addEventListener('mouseenter', () => this.pauseTimer(id));
                    toast.addEventListener('mouseleave', () => this.resumeTimer(id));
                }

                return id;
            }

            // Hide toast with animation
            hide(id) {
                const toastData = this.toasts.get(id);
                if (!toastData) return;

                const { element, options } = toastData;
                
                // Clear timer
                if (toastData.timer) {
                    clearTimeout(toastData.timer);
                }

                // Apply exit animation
                this.applyAnimation(element, options.animation, 'out', options.position);

                // Remove from DOM after animation
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                    this.toasts.delete(id);
                    
                    // Process queue
                    this.processQueue(options.position);
                }, 300);
            }

            // Apply animations based on type and position
            applyAnimation(element, animation, direction, position) {
                element.classList.remove('fade-in', 'fade-out', 'slide-in', 'slide-out', 'slide-in-left', 'slide-out-left', 'bounce-in', 'bounce-out');
                
                let animationClass = '';
                
                switch (animation) {
                    case 'slide':
                        if (position.includes('left')) {
                            animationClass = direction === 'in' ? 'slide-in-left' : 'slide-out-left';
                        } else {
                            animationClass = direction === 'in' ? 'slide-in' : 'slide-out';
                        }
                        break;
                    case 'bounce':
                        animationClass = direction === 'in' ? 'bounce-in' : 'bounce-out';
                        break;
                    case 'fade':
                    default:
                        animationClass = direction === 'in' ? 'fade-in' : 'fade-out';
                        break;
                }
                
                element.classList.add(animationClass);
            }

            // Timer management
            startTimer(id) {
                const toastData = this.toasts.get(id);
                if (!toastData || toastData.options.duration <= 0) return;

                toastData.startTime = Date.now();
                
                // Update progress bar
                const progressBar = toastData.element.querySelector('.toast-progress');
                if (progressBar) {
                    progressBar.style.width = '100%';
                    progressBar.style.transition = `width ${toastData.remainingTime}ms linear`;
                    setTimeout(() => {
                        progressBar.style.width = '0%';
                    }, 10);
                }

                toastData.timer = setTimeout(() => {
                    this.hide(id);
                }, toastData.remainingTime);
            }

            pauseTimer(id) {
                const toastData = this.toasts.get(id);
                if (!toastData || !toastData.timer) return;

                clearTimeout(toastData.timer);
                toastData.remainingTime -= Date.now() - toastData.startTime;
                
                // Pause progress bar
                const progressBar = toastData.element.querySelector('.toast-progress');
                if (progressBar) {
                    progressBar.style.transition = 'none';
                }
            }

            resumeTimer(id) {
                const toastData = this.toasts.get(id);
                if (!toastData || toastData.remainingTime <= 0) return;

                this.startTimer(id);
            }

            // Process queued toasts
            processQueue(position) {
                if (this.queue.length === 0) return;
                
                const container = this.getContainer(position);
                if (container.children.length < this.defaultOptions.maxVisible) {
                    const nextToast = this.queue.shift();
                    if (nextToast.position === position) {
                        this.show(nextToast);
                    } else {
                        this.queue.unshift(nextToast); // Put it back if wrong position
                    }
                }
            }

            // Clear all toasts
            clear(position = null) {
                if (position) {
                    const container = this.containers.get(position);
                    if (container) {
                        Array.from(container.children).forEach(toast => {
                            this.hide(toast.id);
                        });
                    }
                } else {
                    this.toasts.forEach((_, id) => {
                        this.hide(id);
                    });
                }
                this.queue = [];
            }

            // Convenience methods
            info(message, options = {}) {
                return this.show({ ...options, message, color: 'info' });
            }

            success(message, options = {}) {
                return this.show({ ...options, message, color: 'success' });
            }

            warning(message, options = {}) {
                return this.show({ ...options, message, color: 'warning' });
            }

            error(message, options = {}) {
                return this.show({ ...options, message, color: 'error' });
            }
        }

        // Initialize toast system
        const toast = new ToastNotification();

        // Demo functions
        function showBasicToasts() {
            toast.info('This is an info message', { title: 'Information' });
            setTimeout(() => toast.success('Operation completed successfully!', { title: 'Success' }), 200);
            setTimeout(() => toast.warning('Please check your input', { title: 'Warning' }), 400);
            setTimeout(() => toast.error('Something went wrong', { title: 'Error' }), 600);
        }

        function showSuccessToast() {
            toast.success('Your changes have been saved successfully!', {
                title: 'Saved',
                duration: 3000,
                icon: '💾'
            });
        }

        function showWarningToast() {
            toast.warning('Your session will expire in 5 minutes', {
                title: 'Session Warning',
                duration: 6000,
                pauseOnHover: true
            });
        }

        function showErrorToast() {
            toast.error('Failed to connect to server. Please try again.', {
                title: 'Connection Error',
                duration: 0, // Persistent
                icon: '🔌'
            });
        }

        function showPositionToasts() {
            const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
            positions.forEach((position, index) => {
                setTimeout(() => {
                    toast.info(`Toast from ${position}`, {
                        position: position,
                        duration: 3000
                    });
                }, index * 300);
            });
        }

        function showAnimationToasts() {
            const animations = ['fade', 'slide', 'bounce'];
            animations.forEach((animation, index) => {
                setTimeout(() => {
                    toast.success(`${animation.charAt(0).toUpperCase() + animation.slice(1)} animation`, {
                        animation: animation,
                        position: 'top-center',
                        duration: 3000
                    });
                }, index * 800);
            });
        }

        function showRTLToast() {
            toast.info('این یک پیام تست برای زبان‌های راست به چپ است', {
                title: 'پیام فارسی',
                rtl: true,
                position: 'top-left',
                duration: 5000
            });
        }

        function showCustomToast() {
            const style = document.createElement('style');
            style.textContent = `
                .custom-toast {
                    background: linear-gradient(45deg, #ff6b6b, #feca57) !important;
                    color: white !important;
                    border: none !important;
                    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3) !important;
                }
                .custom-toast .toast-title,
                .custom-toast .toast-message {
                    color: white !important;
                }
            `;
            document.head.appendChild(style);

            toast.show({
                message: 'This is a custom styled toast with gradient background!',
                title: 'Custom Style',
                customClass: 'custom-toast',
                icon: '🎨',
                duration: 4000
            });
        }

        function showQueueToasts() {
            // Set max visible to 2 for demo
            toast.defaultOptions.maxVisible = 2;
            
            for (let i = 1; i <= 6; i++) {
                toast.info(`Queued toast #${i}`, {
                    title: `Toast ${i}`,
                    duration: 2000
                });
            }
            
            // Reset max visible
            setTimeout(() => {
                toast.defaultOptions.maxVisible = 5;
            }, 1000);
        }

        function showPersistentToast() {
            toast.warning('This toast will stay until you close it manually', {
                title: 'Persistent Toast',
                duration: 0,
                icon: '📌'
            });
        }

        function showClickableToast() {
            toast.info('Click me to see an alert!', {
                title: 'Interactive Toast',
                duration: 8000,
                onClick: (element, options) => {
                    alert('Toast clicked! You can perform any action here.');
                },
                icon: '👆'
            });
        }

        function clearAllToasts() {
            toast.clear();
        }

        // Show welcome toast on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                toast.success('Welcome to the Toast Notification System!', {
                    title: 'Welcome',
                    duration: 4000,
                    icon: '👋'
                });
            }, 500);
        });