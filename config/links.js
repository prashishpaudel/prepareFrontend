module.exports = {
	backendlink:'http://localhost:1338',
	trainAuthorizationPasswordLink : 'http://localhost:1338/trainAuthorization',
	scriptOpenCLoseAPILink:'http://192.168.1.95:5002',
	medicalSynonymnAPILink:'http://192.168.1.95:5004/get-medical-synonyms',
	// multicastStreamAPILink:'http://192.168.1.95:5008/set-multicast-group', //Windows Laptop
	multicastStreamAPILink:'http://192.168.1.70:5001/set-multicast-group', // Mac Laptop
	scenarioTrainingAPILink:'http://192.168.1.95:5006/train-online',
	eventDetectionAPILink:'http://192.168.1.95:5003/send-lookup',
	// Status API
	checkMedicalSynonymnAPI:'http://192.168.1.95:5004',
	// checkMulticastStreamAPI:'http://192.168.1.95:5008', //Windows Laptop
	checkMulticastStreamAPI:'http://192.168.1.70:5001',   // Mac Laptop
	checkScenarioTrainingAPI:'http://192.168.1.95:5006',
	checkEventDetectionAPI:'http://192.168.1.95:5003'
}



  