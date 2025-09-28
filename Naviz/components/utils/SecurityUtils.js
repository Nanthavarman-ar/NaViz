export class SecurityUtils {
    static sanitizeForLog(input) {
        return input.replace(/[\r\n\t]/g, '_').substring(0, 200);
    }
    static sanitizeHTML(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    static validateInput(input, maxLength = 1000) {
        if (typeof input !== 'string')
            return '';
        return input.substring(0, maxLength).trim();
    }
}
