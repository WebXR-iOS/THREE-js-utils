/**
 * @author crazyh / https://github.com/crazyh2
 */

( function () {

	const _zee = new THREE.Vector3( 0, 0, 1 );

	const _euler = new THREE.Euler();

	const _q0 = new THREE.Quaternion();

	const _q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis


	const _changeEvent = {
		type: 'change'
	};

	class DeviceMotionControls extends THREE.EventDispatcher {

		constructor( object ) {

			super();

			if ( window.isSecureContext === false ) {

				console.error( 'THREE.DeviceMotionControls: DeviceMotionEvent is only available in secure contexts (https)' );

			}

			const scope = this;
			this.object = object;
			this.enabled = true;
            this.deviceMotion = {};
            this.accelerationAmount = {
                x: 0,
                y: 0,
                z: 0
            };

            const onDeviceMotionEvent = function ( event ) {

				scope.deviceMotion = event;
				scope.accelerationAmount = {
					x: event.acceleration.x,
					y: event.acceleration.y,
					z: event.acceleration.z
				};

			};

			this.connect = function () {

				// iOS 13+

				if ( window.DeviceMotionEvent !== undefined && typeof window.DeviceMotionEvent.requestPermission === 'function' ) {

					window.DeviceMotionEvent.requestPermission().then( function ( response ) {

						if ( response == 'granted' ) {

							window.addEventListener( 'devicemotion', onDeviceMotionEvent );

						}

					} ).catch( function ( error ) {

						console.error( 'THREE.DeviceMotionControls: Unable to use DeviceMotion API:', error );

					} );

				} else {

					window.addEventListener( 'devicemotion', onDeviceMotionEvent );

				}

				scope.enabled = true;

			};

			this.disconnect = function () {

				window.removeEventListener( 'devicemotion', onDeviceMotionEvent );
				scope.enabled = false;

			};

			this.update = function () {

				if ( scope.enabled === false ) return;
				const device = scope.deviceMotion;

				if ( device && scope.accelerationAmount ) {

					const interval = device.interval;
					const amountInSec = Math.floor(1 / interval);

					const accelerationX = device ? scope.accelerationAmount.x : 0;

					const accelerationY = device ? scope.accelerationAmount.y : 0;
					
					const accelerationZ = device ? scope.accelerationAmount.z : 0;

					const distanceX = accelerationX / amountInSec;

					const distanceY = accelerationY / amountInSec;

					const distanceZ = accelerationZ / amountInSec;

                    this.object.translateX(distanceX);

                    this.object.translateY(distanceY);

                    this.object.translateZ(distanceZ);

                    device = undefined;
					scope.accelerationAmount = {
						x: 0,
						y: 0,
						z: 0
					};

				}

			};

			this.dispose = function () {

				scope.disconnect();

			};

			this.connect();

		}

	}

	THREE.DeviceMotionControls = DeviceMotionControls;

} )();