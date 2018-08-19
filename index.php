<html>
<head>
    <!-- Load TensorFlow.js -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.11.7"></script>
    <!-- Load Posenet -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@0.1.2"></script>
</head>

<body>

<img id='cat' src='/031.jpg '/>



</body>
<script>
    var imageScaleFactor = 0.5;
    var outputStride = 16;
    var flipHorizontal = false;

    var imageElement = document.getElementById('cat');

    posenet.load().then(function(net){
        return net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride)
    }).then(function(pose){
        console.log(pose);
    })
</script>
</html>


