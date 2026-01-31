let boxes = document.querySelectorAll(".box");
let start = document.querySelector(".start");
let pause = document.querySelector(".pause");
let restart = document.querySelector(".re-start");
let result = document.querySelector("#res");

let isPaused = true;
let isGameOver = false;

let initialColor = [];
let initialTextContent = [];

//storing the initial value & color:

boxes.forEach((box , index)=>{
     initialColor[index] = window.getComputedStyle(box).backgroundColor;//The Window.getComputedStyle() method returns an object containing the values of all CSS properties of an element
     initialTextContent[index] = box.textContent;
});

//changing value & color on click:

boxes.forEach(box=>{

  let iv = parseInt(box.textContent.replace("+",""));

   box.addEventListener("click",()=>{

    if(isPaused || isGameOver) return;

    let currcolor = window.getComputedStyle(box).backgroundColor;//returns an object containing the values of all CSS properties of the element
    initialTextContent[index] = box.textContent;

    let rgbValue = currcolor.match(/\d+/g).map(Number);//turning the rgb values into arr

    let lighterrgb = rgbValue.map(value=>Math.min(value+40,255));//increases the rgb values by 40 till it reaches 255

    box.style.backgroundColor= `rgb(${lighterrgb.join(",")})`;//makes arr of the new rgb values


    
    if(iv>0){
      iv = iv-1;
      box.textContent = `+${iv}`;
    }   

   });
});

//start button:

start.addEventListener("click",()=>{

  if(isGameOver) return;//This prevents running the game logic (starting animations, updating text, etc.) when the game is already over.

   result.textContent = "Game Start";

    isPaused = false;

    boxes.forEach(box=>{
      box.style.animationPlayState = "running";
    });
  
    requestAnimationFrame(boxMonitor);
  
});

pause.addEventListener("click",()=>{

  isPaused = true;//disables bgc change

  boxes.forEach(box=>{
    box.style.animationPlayState = "paused";
    
  });
});

restart.addEventListener("click", ()=>{

  isPaused = true;
  isGameOver = false;
  result.textContent = "try again";
  
  boxes.forEach((box,index)=>{

   box.style.backgroundColor = initialColor[index];//reset to original color
   box.textContent = initialTextContent[index];


    let delay = window.getComputedStyle(box).animationDelay;//accessing the delays

    box.style.animation = "none";
    
    void box.offsetWidth;//triggers reflow to reset animation, When you set an element's animation property to "none", the animation is cleared. However, immediately reapplying the same animation property (e.g., "moving 5s") doesn't always work because the browser optimizes rendering and may ignore the change if it thinks nothing has visually changed.

    //By accessing offsetWidth (or any property that forces a reflow), you ensure the browser acknowledges that something has changed, effectively resetting the animation.
    //Using void simply ensures the value is not stored or used, as it’s only accessed for its side effect of triggering a reflow.

    box.style.animation = `moving 5s steps(12) ${delay} forwards`;
    box.style.animationPlayState = "paused";


    let iv = parseInt(box.textContent.replace("+",""));

   box.onclick = ()=>{

    if(isPaused || isGameOver) return;

    let currcolor = window.getComputedStyle(box).backgroundColor;//accessing the bgc of the boxes

    let rgbValue = currcolor.match(/\d+/g).map(Number);//turning the rgb values into arr

    let lighterrgb = rgbValue.map(value=>Math.min(value+40,255));//increases the rgb values by 20 till it reaches 255

    box.style.backgroundColor= `rgb(${lighterrgb.join(",")})`;//makes arr of the new rgb values


    
    if(iv>0){
      iv = iv-1;
      box.textContent = `+${iv}`;
    }   
  }
  })
})

function boxMonitor(){
  if(isPaused||isGameOver) return;//stop monitoring boxes if the game is paused or over

   let baseY = document.querySelector(".base").getBoundingClientRect().top;//accessing the position of the top of base
   let allZero = true;//lets assume all boxes will contain zero on reaching the top of base

  boxes.forEach(box=>{
    let boxY = box.getBoundingClientRect();//accessing the box position
    let iv = parseInt(box.textContent.replace("+",""));

    if(boxY.bottom >= baseY){
      if(iv>0){
        result.textContent = 'Game Over';
        isGameOver = true;
        isPaused = true;
      }
     
    }  else { allZero = false; }
  })

  if(isGameOver){
    boxes.forEach(box=>{
      box.style.animationPlayState = "paused"; // Pause all animations
    })
    return;
  }
  
  if(allZero && !isGameOver){
    result.textContent = 'Winner!';
    isGameOver = true;

    boxes.forEach(box=>{
      box.style.animationPlayState = "paused";
    })
      
  }

  if(!isGameOver){requestAnimationFrame(boxMonitor);}
}