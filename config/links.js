module.exports = {
	backendlink:'http://localhost:1338',
	trainAuthorizationPasswordLink : 'http://localhost:1338/trainAuthorization',
	scriptOpenCLoseAPILink:'http://192.168.1.95:5002',
	medicalSynonymnAPILink:'http://192.168.1.95:5004/get-medical-synonyms',
	multicastTranscriptionStreamAPILink:'http://192.168.1.95:5007/set-multicast-group', //Windows Laptop
	// multicastTranscriptionStreamAPILink:'http://192.168.1.70:5007/set-multicast-group', // Mac Laptop
	scenarioTrainingAPILink:'http://192.168.1.95:5006/train-online',
	eventDetectionAPILink:'http://192.168.1.95:5003/detect-event',
	stopEventDetectionAPILink:'http://192.168.1.95:5003/stop-processing',
	// Status API
	checkMedicalSynonymnAPI:'http://192.168.1.95:5004',
	checkMulticastTranscriptionStreamAPI:'http://192.168.1.95:5007', //Windows Laptop
	// checkMulticastTranscriptionStreamAPI:'http://192.168.1.70:5007',   // Mac Laptop 
	checkScenarioTrainingAPI:'http://192.168.1.95:5006',
	checkEventDetectionAPI:'http://192.168.1.95:5003',
}





  