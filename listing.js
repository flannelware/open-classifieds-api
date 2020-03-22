const axios = require('axios');
const cheerio = require('cheerio');
const stringHelper = require('string-helper');

module.exports.handler = async (event, context, callback) => {
	const listingId = event.pathParameters.id;
	const kslUrl = `https://classifieds.ksl.com/listing/${listingId}`;
	// Load Classified page and pass a custom User-Agent as the KSL server throws a "403 Unauthorized" otherwise.
	const res = await axios.get(kslUrl, { headers: { 'User-Agent': stringHelper.makeid(10) } });

	const $ = cheerio.load(res.data, { xmlMode: false, ignoreWhitespace: true, });
	const data = $('script:not([src])').get()[7].children[0].data
	console.log("data:", data);
	let response = {
		statusCode: 404,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({ "listing": {}, "kslUrl": kslUrl })
	};

	if (data.indexOf("window.detailPage = window.detailPage") !== -1) {
		let listingJson = data.match(/detailPage.listingData = ({[^;]*})/g)[0];

		// remove invalid json stuff
		listingJson = listingJson.replace('detailPage.listingData = ', '')
			.replace('dealershipId: 0,', 'dealershipId: 0')
			.replace("'normal'", '"normal"')
			.replace("''", '""');
		console.log("unformatted listing:", listingJson);

		doctoredJson = stringHelper.fixJson(listingJson);
		console.log("doctored json:", doctoredJson);

		if (stringHelper.isValidJson(doctoredJson)) {
			json = JSON.parse(doctoredJson);
		}

		response = {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({ "listing": json, "kslUrl": kslUrl }),
		};
	}

	return response;
};