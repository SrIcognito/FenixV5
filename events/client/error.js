module.exports = {
	name: 'error',
	run: async (client, error) => {
		client.logger.error(error);
	},
};