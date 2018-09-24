var workspace = document.querySelector("content");



function scene1(){
    scene1 = document.querySelector("#scene1");
    scene1.classList.remove("hidden");
}
function load(){
    var loadProgress = document.querySelector("#loadProgressBar");
    var i = 100;
    function showLoadProgress(){
        loadProgress.style.background = "linear-gradient(to left, black " + i + "%, white " + i + "%)";
        loadProgress.style.opacity = i / 100;
        i = i - 2;
        if(i < 0){
            scene1();
        }
        else{
            requestAnimationFrame(showLoadProgress);
        }
    }
    var animation = requestAnimationFrame(showLoadProgress, 1000 / 60);
}

load();
