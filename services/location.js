const LocationModel = require('../models/Location')

exports.updateOrCreate = (_fileName, _locationData) => {
   if (!_fileName) return Promise.reject('File name is required.')
   if (!_locationData) return Promise.reject('Location data is required.')

   // Make sure we register only allowed fields on database
   let locationData = {
      name: _fileName,
      latitude: _locationData.latitude,
      longitude: _locationData.longitude
   }
   if (_locationData.additionalData && 
      typeof(_locationData.additionalData) === 'object'
   ) {
      locationData.additionalData = _locationData.additionalData
   }

   return LocationModel().findOneAndUpdate(
      {name: _fileName},
      {$set: locationData},
      {new: true, upsert: true, setDefaultsOnInsert: true, useFindAndModify: false}
   ).lean().exec()
}

exports.getNames = () => {
	return LocationModel().find({}).select('name').lean().exec()
}

exports.getLocation = (_name, _fields) => {
	let fields = _fields ? _fields : 'name latitude longitude additionalData'
	return LocationModel().findOne({name: _name}).select(fields).lean().exec()
		.then(_location => {
			if (!_location) return null
			
			let location = _location

			// Remove mongo id if it's not requested
			if (fields.indexOf('_id') < 0 && location._id) delete location._id

			return location
		})
}