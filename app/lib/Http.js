var Http = {
	get : function(settings) {
		settings.verb = 'GET';
		Http.doRequest(settings);
	},
	getJSON : function(settings) {
		settings.verb = 'GET';
		settings.contentType = "application/json";
		Http.doRequest(settings);
	},
	post : function(settings) {
		settings.verb = 'POST';
		Http.doRequest(settings);
	},
	postJSON : function(settings) {
		settings.verb = 'POST';
		settings.contentType = "application/json";
		Http.doRequest(settings);
	},
	put : function(settings) {
		settings.verb = 'PUT';
		Http.doRequest(settings);
	},
	putJSON : function(settings) {
		settings.verb = 'PUT';
		settings.contentType = "application/json";
		Http.doRequest(settings);
	},
	doRequest : function(settings) {
		 if(!Titanium.Network.online){ 
			settings.error({
						code : 504,
						message : L('no_network')
					});
			Ti.App.NeedsToLogin = true; // Flip the switch that we detected a network outtage and now we need to login		
		} else {

			var xhr = Titanium.Network.createHTTPClient({
				onsendstream : function(e) {
					if(settings.onsendstream) {
						settings.onsendstream(e);
					}
				},
				ondatastream : function(e) {
					if(settings.ondatastream) {
						settings.ondatastream(e);
					}
				},
				onload : function(e) {
					var wasSuccess = (this.status >= 200 && this.status < 300) || this.status === 304;
					if(!wasSuccess) {
						xhr.onerror(e);
						return;
					
					} else {
						if (settings.contentType === "application/json") {
							try {
								var json = JSON.parse(this.responseText);
								settings.success(json);

							} catch (parse_error) {
								Titanium.API.error('Http.js : ' + settings.contentType + ' parse error: ' + parse_error.message);
								if (!this.status) {
									this.status = 'error_parse';
								}
								settings.error({
									code : this.status,
									message : 'Unable to parse JSON'
								});
							}
						} else {
							settings.success(this.responseText);
						}
					}

					if(settings.onload) {
						settings.onload(e);
					}
				},
				onerror : function(e) {
					var errorMsg = '';
					if(e.error) {
						errorMsg = e.error;
					} else {
						//errorMsg = this.status + ' - ' + this.statusText;
						errorMsg = this.statusText;
					}
					Titanium.API.info("Https.js : onerror : " + errorMsg);
					if(!this.status){
						this.status = 555;
						errorMsg =  'error_undefined'; // Hard Code an Unknown error message
					}
					settings.error({
						code : this.status,
						message : errorMsg
					});
					if(settings.onerror) {
						settings.onerror(e);
					}
				},
				timeout : 45000  /* in milliseconds */
			});

			Ti.API.info('Https.js : ' + settings.verb + ' - ' + settings.url);
			xhr.open(settings.verb, settings.url, true);
			xhr.setRequestHeader('Content-Type', settings.contentType);

			if(settings.headerParams) {
				for(var index = 0; index < settings.headerParams.length; index++) {
					xhr.setRequestHeader(settings.headerParams[index].name, settings.headerParams[index].value);
				}
			}

			Titanium.API.debug('Http.js : About to send URL: ' + settings.url + " VERB: " + settings.verb);
			if(settings.data) {
				xhr.send(settings.data);
			} else {
				xhr.send();
			}

		}

	}
};

exports.Http = Http;
