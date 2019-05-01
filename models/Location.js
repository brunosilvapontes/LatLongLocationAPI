const mongoose = require('mongoose')
const Schema = mongoose.Schema;
 
const locationSchema = new Schema({
	name: String,
	latitude: Number,
	longitude: Number,
	additionalData: {},
	created_at: {type: Date, default: Date.now},
	updated_at: Date
}, { collection: 'Location' });

locationSchema.pre('save', function () { this.updated_at = new Date(); });

locationSchema.pre('update', function () { this.update({}, {$set: {updated_at: new Date()}}); });

locationSchema.pre('findOneAndUpdate', function () { this.update({}, {$set: {updated_at: new Date()}}); });

function Location() {
	return mongoose.model('Location', locationSchema);
};

module.exports = Location;