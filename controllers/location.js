const locationService = require('../services/location')

exports.uploadJson = async (req, res) => {
	try {
		// Validate request
		const fileName = req.params ? standardizeLocationName(req.params.name) : null
		if (!fileName || fileName.length < 1) {
			const badRequestResponse = {
				status: 400,
				message: 'Request parameter name is required.'
			}
			return res.status(400).json(badRequestResponse).end()
		}
		const errorMsg = latLongHasError(req.body)
		if (errorMsg) {
			const badRequestResponse = {
				status: 400,
				message: errorMsg
			}
			return res.status(400).json(badRequestResponse).end()
		}

		// Register location on database
		const location = await locationService.updateOrCreate(fileName, req.body)

		// Success on registration
		if (location && location._id && location.name) {
			const successResponse = {
				status: 201,
				message: location.name + ' created/updated successfully.'
			}
			return res.status(201).json(successResponse).end()	
		}

		return res.status(520).json({status: 520, message: 'Invalid response from database.'}).end()	
	} catch (err) {
		const errMsg = (err && err.message) ? err.message : err
		return res.status(500).json({status: 500, message: errMsg}).end()
	}
}

exports.getLocationNames = async (req, res) => {
	try {
		const locations = await locationService.getNames()

		if (!locations || typeof(locations) !== 'object' || locations.length < 1) {
			return res.status(200).json([]).end()
		}

		const locationNames = locations.map(location => {return location.name})

		return res.status(200).json(locationNames).end()
	} catch (err) {
		const errMsg = (err && err.message) ? err.message : err
		return res.status(500).json({status: 500, message: errMsg}).end()
	}
}

standardizeLocationName = (_name) => {
	if (!_name || _name.length < 1) return null
	let name = _name.toString().trim().toLowerCase()
	// Capitalize only the first letter
	return name.charAt(0).toUpperCase() + name.slice(1);
}

latLongHasError = (_locationData) => {
	let errorMsg = ''
	if (!_locationData) return errorMsg

	if (!_locationData.latitude) errorMsg += 'Latitude is required. '
	if (!_locationData.longitude) errorMsg += 'Longitude is required. '
	if (typeof(_locationData.latitude) !== 'number') {
		errorMsg += 'Latitude must be a number. '
	}
	if (typeof(_locationData.longitude) !== 'number') {
		errorMsg += 'Longitude must be a number. '
	}
	
	if (errorMsg.length > 1) return errorMsg
	return false
}

