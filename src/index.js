import * as posenet from '@tensorflow-models/posenet';
import cl from './helper.js';
import $ from 'jquery';

class Check {
    constructor () {
        this.bindEvents();
    }

    bindEvents() {
        const self = this;

        $('.j-photo-input').on('change', (event) => self.photoCheck(event));
    }

    photoCheck(event) {
        const self = this;
        const imageClass = 'j-photo-image';

        this.readURL(event.target, imageClass);

        const image = document.getElementsByClassName(imageClass)[0];

        this.estimatePoseOnImage(image, self.net).then(pose => this.addMarkersForImage(pose, self.net))
    }

    addMarkersForImage(pose) {
        const keyPoints = pose.keypoints;

        keyPoints.map((keyPoint) => {
            this.addMarker(keyPoint);
        })
    }

    addMarker(keyPoint) {
        const photoWrapper = $('.j-photo-wrapper');
        const markerTemplate = `<div class="photo-point" ` +
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

        return await net.estimateSinglePose(image, 0.5, false, 32);
    }
}

const check = new Check();
