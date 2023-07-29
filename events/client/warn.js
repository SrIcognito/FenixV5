module.exports = {
	name: 'warn',
	run: async (client, error) => {
		client.logger.warn(error);
	},
};