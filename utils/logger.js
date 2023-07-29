const Logger = require('leekslazylogger-fastify');

module.exports = new Logger({
	debug: false,
	directory: './logs',
	keepFor: 30,
	levels: {
		basic: { format: '&f&!7{timestamp} {text}' },
		debug: { format: '&f&!7{timestamp}&r &1[DEBUG] &9{text}' },
		error: { format: '&f&!7{timestamp}&r &4[ERROR] &c{text}' },
		info: { format: '&f&!7{timestamp}&r &3[INFO] &b{text}' },
		notice: { format: '&f&!7{timestamp}&r &0&!6[NOTICE] {text}' },
		success: { format: '&f&!7{timestamp}&r &2[SUCCESS] &a{text}' },
		warn: { format: '&f&!7{timestamp}&r &6[WARN] &e{text}' },
	},
	logToFile: true,
	name: 'Cubed',
	splitFile: true,
	timestamp: 'YYYY-MM-DD HH:mm:ss'
});