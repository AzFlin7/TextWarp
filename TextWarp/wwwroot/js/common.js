function mediaIdGenerator(type) {
	if (!type) type = "RASTER";
	return type.substr(0, 2).toUpperCase() + GenerateRNDString(10);
}
function GenerateRNDString(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
function fixFloat(number, decimal) {
	return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
}