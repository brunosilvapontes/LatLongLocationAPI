const chai = require('chai')
const expect = chai.expect
const locationController = require('../controllers/location')
const config = require('../config')
const mongoose = require('mongoose')

describe("Upload location tests", function() {
	it("Reject lat/long as string", function(done) {
		console.log('Connecting to the database...');
		mongoose.connect(config.mongoDb.connectionString, {useNewUrlParser: true})
   		.then(mongoConnection => {
				console.log('Connected :)');
				let fakeStatusCode = null
				let fakeResponseBody = null
				let fakeResponse = {
					status: (_fakeStatusCode) => {
						fakeStatusCode = _fakeStatusCode
						let statusReturn = {
							json: (_fakeResponseBody) => {
								fakeResponseBody = _fakeResponseBody
								return {
									end: () => {
										expect(fakeStatusCode).to.equal(400)
										done()
									}
								}
							}
						}
						return statusReturn
					}
				}

				let fakeRequest = {
					params: {name: 'test12'},
					body: {latitude: "23.33", longitude: "10"}
				}

				locationController.uploadJson(fakeRequest, fakeResponse)
			})
			.catch(err => {
				console.log(err);
				console.log('Error on database connection :(');
				process.exit(0)
			})
	})
	it("Return HTTP 201 when doing a good request", function(done) {
		let fakeStatusCode = null
		let fakeResponseBody = null
		let fakeResponse = {
			status: (_fakeStatusCode) => {
				fakeStatusCode = _fakeStatusCode
				let statusReturn = {
					json: (_fakeResponseBody) => {
						fakeResponseBody = _fakeResponseBody
						return {
							end: () => {
								expect(fakeStatusCode).to.equal(201)
								done()
							}
						}
					}
				}
				return statusReturn
			}
		}

		let fakeRequest = {
			params: {name: 'test123'},
			body: {latitude: 23.33, longitude: 10}
		}

		locationController.uploadJson(fakeRequest, fakeResponse)
	})
})

describe("Get location names route", function() {
	it("Return Test123 and do not return Test12", function(done) {
		let fakeStatusCode = null
		let fakeResponseBody = null
		let fakeResponse = {
			status: (_fakeStatusCode) => {
				fakeStatusCode = _fakeStatusCode
				let statusReturn = {
					json: (_fakeResponseBody) => {
						fakeResponseBody = _fakeResponseBody
						return {
							end: () => {
								expect(fakeStatusCode).to.equal(200)
								expect(fakeResponseBody).to.be.an('array')
								expect(fakeResponseBody).to.include('Test123')
								expect(fakeResponseBody).to.not.include('Test12')
								done()
							}
						}
					}
				}
				return statusReturn
			}
		}

		locationController.getLocationNames(null, fakeResponse)
	})
})

describe("Get location details route", function() {
	it("Return HTTP 404 when searching for ISupposeToNotExist", function(done) {
		let fakeStatusCode = null
		let fakeResponseBody = null
		let fakeResponse = {
			status: (_fakeStatusCode) => {
				fakeStatusCode = _fakeStatusCode
				let statusReturn = {
					json: (_fakeResponseBody) => {
						fakeResponseBody = _fakeResponseBody
						return {
							end: () => {
								expect(fakeStatusCode).to.equal(404)
								done()
							}
						}
					}
				}
				return statusReturn
			}
		}

		locationController.getLocationDetails({params: {name: 'ISupposeToNotExist'}}, fakeResponse)
	})
	it("Return name, latitude, longitude and distanceToOfficeInKm (must be a number) fields", function(done) {
		let fakeStatusCode = null
		let fakeResponseBody = null
		let fakeResponse = {
			status: (_fakeStatusCode) => {
				fakeStatusCode = _fakeStatusCode
				let statusReturn = {
					json: (_fakeResponseBody) => {
						fakeResponseBody = _fakeResponseBody
						return {
							end: () => {
								expect(fakeStatusCode).to.equal(200)
								expect(fakeResponseBody).to.be.an('object')
								expect(fakeResponseBody).to.include.all.keys('name', 'latitude', 'longitude', 'distanceToOfficeInKm');
								expect(fakeResponseBody.distanceToOfficeInKm).to.be.an('number')
								done()
							}
						}
					}
				}
				return statusReturn
			}
		}

		locationController.getLocationDetails({params: {name: 'Test123'}}, fakeResponse)
	})
})