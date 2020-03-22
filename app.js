const axios = require('axios');
const cheerio = require('cheerio');
const stringHelper = require('string-helper');

module.exports.handler = async (event, context, callback) => {
	const query = event.pathParameters.query;
	const kslUrl = `https://classifieds.ksl.com/search/keyword/${query}/expandSearch/1/Private/Sale/Has-Photos/30DAYS/perPage/1000`;
	// Load Classified page and pass a custom User-Agent as the KSL server throws a "403 Unauthorized" otherwise.
	const res = await axios.get(kslUrl, { headers: { 'User-Agent': stringHelper.makeid(10) } });

	const $ = cheerio.load(res.data, { xmlMode: false, ignoreWhitespace: true, });
	const data = $('script:not([src])').get()[12].children[0].data
	console.log("data:", data);
	let response = {
		statusCode: 404,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({ "listings": [], "kslUrl": kslUrl })
	};

	if (data.indexOf("window.renderSearchSection") !== -1) {
		let listingJson = data.match(/listings: (\[.*?\])/g)[0];
		listingJson = listingJson.replace('listings: ', '');
		console.log("unformatted listings", listingJson);
		if (stringHelper.isValidJson(listingJson)) {
			json = JSON.parse(listingJson);
		}

		response = {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify({ "listings": json, "kslUrl": kslUrl }),
		};
	}

	return response;
};