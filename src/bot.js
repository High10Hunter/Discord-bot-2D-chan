const { Client, GatewayIntentBits } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { sfw_categories } = require('../command_params/SFW_categories.json');
const { nsfw_categories } = require('../command_params/NSFW_categories.json');
const commands = require('./commands');
const {
	getAnimeGirl,
	randomSFW,
	randomNSFW,
	getHelp,
	getTypes,
	getCategoriesByType,
} = require('./functions');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands,
		});

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'rand-sfw') {
		const response = await randomSFW();
		await interaction.reply(response);
	}

	if (interaction.commandName === 'rand-nsfw') {
		const response = await randomNSFW();
		await interaction.reply(response);
	}

	if (interaction.commandName === 'help') {
		const available_commands = getHelp();
		available_commands.then(data => {
			interaction.reply(data);
		});
	}

	if (interaction.commandName === 'type') {
		const types = getTypes();
		await interaction.reply(`types: ${types}`);
	}

	if (interaction.commandName === 'category-sfw') {
		const categories = getCategoriesByType('sfw');
		await interaction.reply(`SFW categories: ${categories}`);
	}

	if (interaction.commandName === 'category-nsfw') {
		const categories = getCategoriesByType('nsfw');
		await interaction.reply(`NSFW categories: ${categories}`);
	}
});

client.on('messageCreate', message => {
	if (message.content.startsWith('#g')) {
		const args = message.content.split('-');
		const [command, type, category] = args;

		if (command === '#g') {
			if (type === 'sfw') {
				if (sfw_categories.includes(category)) {
					getAnimeGirl(type, category)
						.then(url => message.reply(url))
						.catch(err => console.log(err));
				} else {
					message.reply('Invalid category');
				}
			} else if (type === 'nsfw') {
				if (nsfw_categories.includes(category)) {
					getAnimeGirl(type, category)
						.then(url => message.reply(url))
						.catch(err => console.log(err));
				} else {
					message.reply('Invalid category');
				}
			} else {
				message.reply('Invalid type');
			}
		} else {
			message.reply('Invalid command');
		}
	}
});

client.login(process.env.BOT_TOKEN);
