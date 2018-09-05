import * as posenet from '@tensorflow-models/posenet';
import cl from './helper.js';
import $ from 'jquery';

class Check {
    constructor() {

        /* estimateSinglePose configuration */
        this.ESPPConfig = {
            imageScaleFactor: 0.5,  // 0.2 ... 1. - What to scale the image by before feeding it through the network.

            flipHorizontal: false,  /* true/false. - If the poses should be flipped/mirrored horizontally. This should be set
                                       to true for videos where the video is by default flipped horizontally.*/
            outputStride: 16,        /*  8/16/32. - The desired stride for the outputs when feeding the image through the model.
                                         The higher the number, the faster the performance but slower the accuracy, and visa versa */
        };

        /* render points configuration */
        this.minPointScor = 0.1; // from 0 to 1


        this.bindEvents();
    }


    bindEvents() {
        const self = this;

        $('.j-photo-input').on('change', (event) => self.photoCheck(event));
    }

    photoCheck(event) {
        const imageClass = 'j-photo-image';
        /* render image from input */
        this.readURL(event.target, imageClass);

        const image = $(`.${imageClass}`)[0];

        /* run estimateSinglePose */
        this.estimatePoseOnImage(image)
            .then(pose => this.addMarkersForImage(pose)) // add markers on image
    }

    addMarkersForImage(pose) {
        cl('pose: ', pose); // you can see whai si in the pose data object

        const keyPoints = pose.keypoints;

        $('.j-photo-marker').remove(); // remove old markers from DOM if you download new image for pose estimating

        keyPoints.map((keyPoint) => {
            if(keyPoint.score >= this.minPointScor) {
                this.addMarker(keyPoint);
            }
        });
    }

    addMarker(keyPoint) {
        const photoWrapper = $('.j-photo-wrapper');
        const markerTemplate = `<div class="photo-point j-photo-marker" ` +
            `style="top:${keyPoint.position.y}px;left:${keyPoint.position.x}px" ` +
            `title="${keyPoint.part}"></div>`;

        photoWrapper.append(markerTemplate)
    }

    readURL(input, imageClass) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                $(`.${imageClass}`).attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    async estimatePoseOnImage(image) {
        const net = await posenet.load();

        return await net.estimateSinglePose(image, this.ESPPConfig.imageScaleFactor , this.ESPPConfig.flipHorizontal, this.ESPPConfig.outputStride);
    }
}

const check = new Check();
