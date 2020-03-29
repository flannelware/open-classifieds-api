module.exports = {

	makeid: function makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},

	isValidJson: function validateJson(text) {
		if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
			return true;
		} else {
			return false;
		}
	},

	fixJson: function fixJson(text) {
		// preserve newlines, etc - use valid JSON
		text = //text.replace(/\\n/g, "\\n")
			text.replace(/\\'/g, "\\'")
				.replace(/\\"/g, '\\"')
				.replace(/\\&/g, "\\&")
				.replace(/\\r/g, "\\r")
				.replace(/\\t/g, "\\t")
				.replace(/\\b/g, "\\b")
				.replace(/\\f/g, "\\f");
		// remove non-printable and other non-valid JSON chars
		text = text.replace(/[\u0000-\u0019]+/g, "");
		// wrap key values with double quotes
		text = text.replace(/([\w]+):/g, '"$1":')
			.replace(/:([a-zA-Z_]+)/g, ':"$1"')
			.replace(/:([\d]+)/g, function (m, num) { return ':' + parseFloat(num) })
			.replace(/:([[{])/g, ':$1');
		return text;
	}
}