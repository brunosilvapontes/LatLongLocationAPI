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

exports.getLocationDetails = async (req, res) => {
	try {
		const name = (req && req.params && req.params.name) ? req.params.name : null
		if (!name || name.length < 1) {
			return res.status(400).json({status: 400, message: 'Name is required.'}).end()	
		}

		const wantedFields = 'name latitude longitude additionalData'
		let location = await locationService.getLocation(standardizeLocationName(name), wantedFields)

		if (!location) return res.status(404).json({status: 404, message: 'Location name not found.'}).end()

		location.distanceToOfficeInKm = getDistanceToOfficeInKm(location.latitude, location.longitude)

		return res.status(200).json(location).end()
	} catch (err) {
		const errMsg = (err && err.message) ? err.message : err
		return res.status(500).json({status: 500, message: errMsg}).end()
	}
}

getDistanceToOfficeInKm = (_latitude, _longitude) => {
	if (!_latitude || !_longitude || typeof(_latitude) !== 'number' || typeof(_longitude) !== 'number') {
		return null
	}
	const officeLatitude = 52.502931
	const officeLongitude = 13.408249

	return getDistanceFromLatLonInKm(_latitude, _longitude, officeLatitude, officeLongitude)
}

// Reference: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula 
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = 
	  Math.sin(dLat/2) * Math.sin(dLat/2) +
	  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	  Math.sin(dLon/2) * Math.sin(dLon/2)
	  ; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
 }
 function deg2rad(deg) {
	return deg * (Math.PI/180)
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

