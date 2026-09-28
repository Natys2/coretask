const CoreSecurity = {
    sanitize: function(input) {
        if (typeof input !== 'string') return input;
        const decoder = document.createElement('div');
        decoder.textContent = input;
        return decoder.innerHTML;
    },

    setSecureContent: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    },

    validateInput: function(input, minLength = 1) {
        return input && input.trim().length >= minLength;
    },

    escapeHTML: function(str) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
};
Object.freeze(CoreSecurity);