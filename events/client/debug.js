module.exports = {
	name: 'debug',
	run: async (client, error) => {
		client.logger.debug(error);
	},
};