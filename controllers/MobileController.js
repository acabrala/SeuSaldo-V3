const errorResponse = function(message){
	return {
		error: true,
		message: message
	}
}

const successResponse = function(message){
	return {
		error: false,
		message: message
	}
}

class MobileController{
	constructor(Mobile){
		this.Mobile = Mobile;
	}

	create(mobile){
		return this.Mobile.create(mobile)
			.then(function(mobile){
				return successResponse('Mobile inserido com sucesso.');
			}).catch(function(err){
				return errorResponse(err.message);
			});
	}
}

module.exports = MobileController;