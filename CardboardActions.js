/**
 * @author crazyh / https://github.com/crazyh2
 */

// roll 55+ deg left for undo
// roll 55+ deg right for select
// look up for home

class CardboardActions {
    constructor(camera) {
        this.camera = camera;

        this.onBack = function(e) {};
        this.onSelect = function(e) {};
        this.onHome = function(e) {};
    };

    update() {
        var { x, y, z } = this.camera.rotation;

        if (x < -55) {
            this.onBack({ camera: this.camera, x: x, y: y, z: z });
        } else if (x > 55) {
            this.onSelect({ camera: this.camera, x: x, y: y, z: z });
        } else if (y > 55) {
            this.onHome({ camera: this.camera, x: x, y: y, z: z });
        }
    };
};
