(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.NativeEmoji = factory());
}(this, (function () { 'use strict';

    class NativeEmoji {
        static get isInline() { return true; }

        constructor({api}) {
            this.api = api;
            this.button = null;
            this.picker = null;
            this.savedRange = null;
            this.emojis = ['😀', '😂', '😍', '👍', '🔥', '🤔', '😎', '✨', '🚀', '🎉', '🛠️', '🚗', '🍺', '🎬', '📸', '💯'];
            
            this.closePicker = (e) => {
                if (this.picker && this.picker.style.display === 'grid') {
                    if (!this.button.contains(e.target) && !this.picker.contains(e.target)) {
                        this.picker.style.display = 'none';
                    }
                }
            };
        }

        render() {
            this.button = document.createElement('button');
            this.button.type = 'button';
            this.button.innerHTML = '😀';
            this.button.classList.add(this.api.styles.inlineToolButton);

            this.picker = document.createElement('div');
            this.picker.style.cssText = `
                display: none;
                position: fixed; 
                background: #ffffff;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                grid-template-columns: repeat(8, 32px);
                gap: 2px;
                padding: 8px;
                z-index: 999999; 
                width: fit-content;
            `;

            this.emojis.forEach(emoji => {
                let item = document.createElement('span');
                item.innerHTML = emoji;
                item.style.cssText = `
                    cursor: pointer; 
                    font-size: 20px; 
                    width: 32px; 
                    height: 32px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    border-radius: 4px;
                    transition: all 0.15s ease;
                `;

                item.onmouseover = () => { 
                    item.style.backgroundColor = '#f0f0f0'; 
                    item.style.transform = 'scale(1.15)';
                };
                item.onmouseout = () => { 
                    item.style.backgroundColor = 'transparent'; 
                    item.style.transform = 'scale(1)';
                };

                item.onmousedown = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.savedRange) {
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(this.savedRange);
                        document.execCommand('insertText', false, emoji);
                        this.savedRange = selection.getRangeAt(0).cloneRange();
                    }
                    this.picker.style.display = 'none';
                    this.api.toolbar.close();
                };
                this.picker.appendChild(item);
            });

            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.picker.style.display !== 'grid') {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        this.savedRange = selection.getRangeAt(0).cloneRange();
                    }
                    const rect = this.button.getBoundingClientRect();
                    this.picker.style.display = 'grid';
                    this.picker.style.top = (rect.top - this.picker.offsetHeight - 10) + 'px';
                    this.picker.style.left = (rect.left + (rect.width / 2) - 140) + 'px';
                } else {
                    this.picker.style.display = 'none';
                }
            });

            window.addEventListener('mousedown', this.closePicker);
            document.body.appendChild(this.picker);
            return this.button;
        }

        destroy() {
            window.removeEventListener('mousedown', this.closePicker);
            if (this.picker && this.picker.parentNode) {
                this.picker.parentNode.removeChild(this.picker);
            }
        }

        save() { return {}; }
    }

    return NativeEmoji;

})));