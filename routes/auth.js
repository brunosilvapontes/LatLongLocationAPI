exports.validateBodyType = (req, res, next) => {
	if (!req) {
		const error = {
			status: 400,
			Message: 'Invalid request.'
		}
		return res.status(400).json(error).end()	
	}

	if (!req.body) {
		const error = {
			status: 400,
			Message: 'The location data must be sent through the body of the request.'
		}
		return res.status(400).json(error).end()	
	}

	if (typeof(req.body) !== 'object' || 
		!req.headers || 
		req.headers['content-type'] !== 'application/json'
	) {
		const error = {
			status: 415,
			Message: 'The location data must be a JSON object and your request must has the value application/json on content-type header.'
		}
		return res.status(415).json(error).end()	
	}

	return next()
}

exports.validateApiToken = (req, res, next) => {
	if (req && req.headers && req.headers['apitoken'] === 'internal') return next()
	return res.status(401).json({status: 401, message: 'This route needs access token.'}).end()	
}