const passport = require('passport');
const Strategy = require('passport-jwt').Strategy,
   	  ExtractJwt = require('passport-jwt').ExtractJwt;

const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-plus-token');

module.exports = function(app){
	const Usuario = app.datasource.models.Usuario;
	const opts = {};

	opts.secretOrKey = app.config.jwtSecret;
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

	const strategy = new Strategy(opts, function(payload, done){
		Usuario.findById(payload.id)
			.then(function(usuario){
				if(usuario){
					return done(null, {
						id: usuario.id
					});
				}
				return done(null, false);
			}).catch(function(err){	
				done(err, null);
			});
	});

	// Facebook Strategy
    const facebookStrategy = new FacebookTokenStrategy({
        clientID: app.configFacebookAuth.clientID,
        clientSecret: app.configFacebookAuth.clientSecret,
        profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
    }, function(accessToken, refreshToken, profile, done){
    	console.log(accessToken)
        try{            let userEmail = profile.emails[0].value;            if(userEmail === 'undefined' || !userEmail){
                userEmail = null;
            }            var user = {
                id: profile.id,
                nome: profile.displayName,
                sexo: profile.gender,
                email: userEmail,
            };            Usuario.findById(profile.id)
            .then(function(usuario){
                if(usuario){
                    user.hasUser = true;
                    return done(null,user);
                }
                user.hasUser = false;
                user.is_facebook = true;
                return done(null, user);
            }).catch(function(err){    
                done(err, null);
            });
        }catch(err){
            done(err, null);
        }
    });

	// Google Strategy
	const googleStrategy = new GoogleTokenStrategy({
		clientID: app.configGoogleAuth.clientID,
		clientSecret: app.configGoogleAuth.clientSecret
	}, function(accessToken, refreshToken, profile, done){
		console.log(accessToken)
		try{

			var user = {
				id: profile.id,
				nome: profile.displayName,
				sexo: profile.gender,
				email: profile.emails[0].value,
			};

			Usuario.findById(profile.id)
			.then(function(usuario){
				if(usuario){
					user.hasUser = true;
					return done(null,user);
				}
				user.hasUser = false;
				user.is_google = true;
				return done(null, user);
			}).catch(function(err){	
				done(err, null);
			});
		}catch(err){
			done(err, null);
		}			
	});

	passport.use(strategy);
	passport.use('facebookToken', facebookStrategy);
	passport.use('googleToken', googleStrategy);

	return {
		initialize: function(){
			return passport.initialize();
		},
		authenticate: function(){
			return (req, res, next) => {
				passport.authenticate('jwt', app.config.jwtSession, function(err, usr, info){
					if(err || info){
						res.json({
							error: true,
							message: "Acesso negado. Token inválido."
						});
					}else{
						next();
					}
				})(req, res, next);
			};
		},
		authenticateFacebook: function(){
			return passport.authenticate('facebookToken', app.config.jwtSession);
		},
		authenticateGoogle: function(){
			return passport.authenticate('googleToken', app.config.jwtSession);
		}
	}
}


