// import fetch from 'node-fetch';
const fetch = require('node-fetch');
const { readFile } = require('fs');
const { sfw_categories } = require('../command_params/SFW_categories.json');
const { nsfw_categories } = require('../command_params/NSFW_categories.json');

const getAnimeGirl = async (type, category) => {
	const response = await fetch(`https://api.waifu.pics/${type}/${category}`);
	const data = await response.json();

	return data['url'];
};

const randomSFW = async () => {
	const randomCategory = await sfw_categories[
		Math.floor(Math.random() * sfw_categories.length)
	];
	const response = await getAnimeGirl('sfw', randomCategory);

	return response;
};

const randomNSFW = async () => {
	const randomCategory = await nsfw_categories[
		Math.floor(Math.random() * nsfw_categories.length)
	];
	const response = await getAnimeGirl('nsfw', randomCategory);

	return response;
};

const getText = path => {
	return new Promise((resolve, reject) => {
		readFile(path, 'utf-8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

const getHelp = async () => {
	const data = await getText('./command_params/help.txt');

	return data;
};

const getTypes = () => {
	const types = ['sfw', 'nsfw'].join(' | ');
	return types;
};

const getCategoriesByType = type => {
	if (type === 'sfw') {
		return sfw_categories.join(' | ');
	} else if (type === 'nsfw') {
		return nsfw_categories.join(' | ');
	} else {
		return 'Invalid type';
	}
};

module.exports = {
	getAnimeGirl,
	randomSFW,
	randomNSFW,
	getHelp,
	getTypes,
	getCategoriesByType,
};
