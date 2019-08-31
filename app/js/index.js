var app = angular.module("image", ["ngImgCrop"]);

app.directive("ngCanplay", function($parse){
    return {
        restrict : "A", //[A=>(Attribute), E=>(Element), C=>(Class), M=>(Comment)]
        compile : function($elements, attrs){
            var fun = $parse(attrs["ngCanplay"], null, true);
            return function ngEventHandler(scope, element){
                element.on("canplay", function(event){
                    scope.$apply(function(){
                        fun(scope, {$event : event});
                    })
                })
            }
        }
    }
});

app.directive("ngFileread", function($parse){
    return {
        restrict : "A",
        compile : function($elements, attrs){
            var fun = $parse(attrs['ngFileread'], null, true);
            return function ngEventHandler(scope, element){
                element.on("change", function(event){
                    scope.$apply(function(){
                        fun(scope, {$event : event});
                    })
                })
            }
        }
    }
})

function compress(){
    var source = document.getElementById("picture").src;
    var img = new Image();
    img.src = source;
    var canvas = document.createElement("canvas");
    canvas.width = 50;
    canvas.height = 50;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    document.getElementById("nano-picture").src = canvas.toDataURL("image/png"); 
}

function dataUrlToBlob(dataURI, filename){
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    var blob = new Blob([ab], {type: mimeString});
    blob.name = filename;
    return blob;
}

function uploadFile(file, response){
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', response.signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    resolve(response.url);
                }
                else{
                    reject("Image Could Not Uploaded");
                }
            }
        };
        xhr.send(file);
    })
}

function getSignRequest(file){
    return new Promise((resolve, reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/signRequest?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                }
                else{
                    reject("Image Could Not Got Signed Request")
                }
            }
        };
        xhr.send();
    })
}

app.controller("main", function($scope){
    var vm = this;
    vm.mode = "default";
    vm.cropped = "";
    vm.select = "";
    var string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFIklEQVR4Xu3VsRHAMAzEsHj/pTOBXbB9pFchyLycz0eAwFXgsCFA4C4gEK+DwENAIJ4HAYF4AwSagD9IczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhEQyMihrdkEBNLcTI0ICGTk0NZsAgJpbqZGBAQycmhrNgGBNDdTIwICGTm0NZuAQJqbqREBgYwc2ppNQCDNzdSIgEBGDm3NJiCQ5mZqREAgI4e2ZhMQSHMzNSIgkJFDW7MJCKS5mRoREMjIoa3ZBATS3EyNCAhk5NDWbAICaW6mRgQEMnJoazYBgTQ3UyMCAhk5tDWbgECam6kRAYGMHNqaTUAgzc3UiIBARg5tzSYgkOZmakRAICOHtmYTEEhzMzUiIJCRQ1uzCQikuZkaERDIyKGt2QQE0txMjQgIZOTQ1mwCAmlupkYEBDJyaGs2AYE0N1MjAgIZObQ1m4BAmpupEQGBjBzamk1AIM3N1IiAQEYObc0mIJDmZmpEQCAjh7ZmExBIczM1IiCQkUNbswkIpLmZGhH4AStUAMmSuOW2AAAAAElFTkSuQmCC";
    
    $scope.$watch("vm.select", function(value){
        if(value == ""){
            vm.mode = "default";
        }
    })
    
    $scope.$watch("vm.cropped", function(value){
        if(value == string && vm.mode !== "video"){
            vm.mode = "default";
        }
        else{
            vm.mode = "crop";
        }
    })
    
    $scope.$watch("vm.mode", function(val){
        if(val == "default"){
            vm.select = "";
            $("#crop-img").css("display", "none");
            $("#video-camera").css("display", "none");
            $("#select-img").css("display", "block");
        }
        else if(val == "crop"){
            $("#select-img").css("display", "none");
            $("#video-camera").css("display", "none");
            $("#crop-img").css("display", "block");
        }
        else if(val == "video"){
            $("#select-img").css("display", "none");
            $("#crop-img").css("display", "none");
            $("#video-camera").css("display", "block");
        }
    })
    
    vm.upload = function(){
        if(vm.select){
            var filename = Date.now();
            var medium = document.getElementById("picture").src;
            var small = document.getElementById("nano-picture").src;
            var mediumBlob = dataUrlToBlob(medium, filename+"medium");
            var smallBlob = dataUrlToBlob(small, filename+"small");
            getSignRequest(mediumBlob).then((response)=>{
                uploadFile(mediumBlob, response).then((fileUrlMedium)=>{
                    getSignRequest(smallBlob).then((response)=>{
                        uploadFile(smallBlob, response).then((fileUrlSmall)=>{
                            alert("Upload Done...")
                        })
                    })
                })
            })   
        }
    }
    
    vm.process = function(){
        var file = document.getElementById("browsed-image");
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        reader.onload = function(event){
            $scope.$apply(function(){
                vm.select = event.target.result;
            })
        }
    }

    vm.startCamera = function(){
        if(vm.mode !== "video"){
            var video = document.getElementById("video-camera");
            navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
                video.srcObject = stream;
                video.play();
            }).catch(function(err) {
                alert("Error" + err);
            });  
        }
    }
    
    vm.snapShot = function(){
        var video = document.getElementById("video-camera");
        if(video.srcObject !== null && video.srcObject.active){
            var canvas = document.createElement("canvas");
            var context = canvas.getContext('2d');
            canvas.width = 320;
            canvas.height = video.videoHeight/(video.videoWidth/canvas.width);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function(blob){  /*Change Required*/
                $scope.$apply(function(){
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = function(event){
                        $scope.$apply(function(){
                            vm.select = event.target.result;    
                        })
                    }
                    video.srcObject.getTracks()[0].stop();
                })
            })   
        }
    }
    
    vm.done = function(){
        var video = document.getElementById("video-camera");
        var width = 320;
        var height =  video.videoHeight / (video.videoWidth/width);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        vm.mode = "video";
    }
    
    vm.reset = function(){
        vm.select = "";
        vm.mode = "default";
        var video = document.getElementById("video-camera");
        if(video.srcObject !== null){
            video.srcObject.getTracks()[0].stop();   
            video.srcObject = null;
        }
    }
})