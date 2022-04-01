import { AfterViewChecked, AfterViewInit, Component, EventEmitter, HostListener, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from './components/dialog/dialog.component';
import { GameOverComponent } from './components/game-over/game-over.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'jogo2048';

  //OBS: note that the most important functions are the last two in this files. those that come before are preparing the properties to get to them and be transformed.

                                  //PROPERTIES INICIALIZATION

  //initializing the score
  totalPointsStr: string | null = localStorage.getItem('points')
  totalPoints: number = (this.totalPointsStr != null? parseInt(this.totalPointsStr) : 0)
  //initializing the record
  yourRecordStr: string | null = localStorage.getItem('record')
  yourRecord: number = (this.yourRecordStr != null? parseInt(this.yourRecordStr) : 0)
  //recovering last time game was played, if it isn't the first time
  lastGame: string | null = localStorage.getItem('lastgame')
  curB: number[] = (this.lastGame != null? (JSON.parse(this.lastGame)) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  //below, a test for the GAME OVER dialog window
  // curB: number[] = [2, 1, 5, 8, 5, 3, 5, 7, 10, 2, 1, 6, 7, 3, 8, 1]

  //the calc array is the array we use to calculate the moves, before applying it to the board
  calcArray: number[] = []
  //these quantities array manages the ANIMATION, each item keeps how much each moved block has to translate through the board to reach a new position
  quantityes: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
  quantNum: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  //this properies are used to access which kind of finger moviment was done by the user
  defaultTouch = { x: 0, y: 0, time: 0 };
  place: string[] = []
  //we are using a Angular Material dialog box for the rules and a snack bar for the GAME OVER window.
  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ){}

                              //END AND BEGGINING OF GAME FUNCTIONS

  //shows the game rules
  openDialog() {
    this.dialog.open(DialogComponent);
  }

  //if user never played, game is itialized
  ngAfterViewInit(): void {
    if(this.lastGame == null){
      this.putRandom()
      this.putRandom()
    }
  }

    //resets the game
    resetGame(){
      for(let i = 0; i < 16; i++){
        this.curB[i]=0
      }
      this.totalPoints = 0;
      this.putRandom()
      localStorage.setItem('lastgame', JSON.stringify(this.curB))
      localStorage.setItem('points', JSON.stringify(this.totalPoints))
    }
  
    //includes new tiles
    putRandom(){
        let done = this.anySpaceLeft()
        let newBlock = 1;
        //the farthest the player gets, greater is the chance a tile with "4" is put
        if(Math.random() > (1 - (this.totalPoints / 40000))) newBlock = 2;
  
        while (done == true){
          let random = Math.floor(Math.random() * 16)
          if (this.curB[random] == 0){
            this.curB[random] = newBlock;
            done = false
          } 
        }
    }

                          //LISTENING TO USER INTERACTIONS

  //DESKTOP
  //this listener is used when game is played on desktop
  @HostListener('document:keyup', ['$event'])
  handleKeyEvent(event: KeyboardEvent){
    if (event.key == "ArrowLeft"){
      this.leftArrow()
    }
    if (event.key == "ArrowRight"){
      this.rightArrow()
    }
    if (event.key == "ArrowDown"){
      this.downArrow()
    }
    if (event.key == "ArrowUp"){
      this.upArrow()
    }
  }

  //TOUCH SCREEN DEVICES
  ///these listeners are used when game is played on touch screen devices
  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:touchend', ['$event'])
  @HostListener('document:touchcancel', ['$event'])
  handleTouch(event: any) {
      let touch = event.touches[0] || event.changedTouches[0]
      // check the events
      if (event.type === 'touchstart') {
        this.defaultTouch.x = touch.pageX;
        this.defaultTouch.y = touch.pageY;
        this.defaultTouch.time = event.timeStamp;
        for (let i = 0; i < 5; i++){
          this.place.push(event.path[i].classList.value)
        }
    } else if (event.type === 'touchend') {
        let deltaX = touch.pageX - this.defaultTouch.x;
        let deltaY = touch.pageY - this.defaultTouch.y;
        let deltaTime = event.timeStamp - this.defaultTouch.time;

        // simulte a swipe -> less than 500 ms and more than 60 px, we also test if the swipe is near the board table. checking if the div with class "mask" is touched
        if (deltaTime < 500) {
            // touch movement lasted less than 500 ms 
            if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 50 && this.place.some((el) => el == 'mask')) {
                if (deltaX > 0) {
                    this.rightArrow();
                } else {
                    this.leftArrow();
                }
            }
            if (Math.abs(deltaY) > 60 && Math.abs(deltaX) < 50 && this.place.some((el) => el == 'mask')) {
                if (deltaY > 0) {
                    this.downArrow();
                } else {
                    this.upArrow();
                }
            }
        }
        this.place = [''];
    }
}
                               //SUPPORT FUNCTIONS

  //verifies if there are any empty blocks
  anySpaceLeft(){
    for(let i of this.curB){
      if(i == 0) return true
    }
    return false
  }

  //checks if two arrays are different
  anyChangesInArray(array1: number[], array2: number[]){
    for(let i = 0; i < 16; i++){
      if(array1[i] != array2[i]) return true
    }
    return false
  }
  //checks if it's game over
  anyMovesLeft():boolean {
    if(this.anySpaceLeft() == true) return true
    for(let i = 0; i < 16; i++){
      if(i - 1 >= 0){
        if (this.curB[i] === this.curB[i - 1]) return true
      }
      if(i - 4 >= 0){
        if (this.curB[i] === this.curB[i - 4]) return true
      }
      if(i + 1 < 16){
        if (this.curB[i] === this.curB[i + 1]) return true
      }
      if(i + 4 < 16){
        if (this.curB[i] === this.curB[i + 4]) return true
      }
    }
    return false;
  }

  //in order to access the function that calculate the new board table and the animations, a tranformation must be made in the array. the generic movement function treats every move as a move to the left, so if you want to make a different move, the array must be transformed and then "untransformed". note that only when the movement is down, we need two different fuctions, one to transform, and another to 'untransform'
  leftTranform(index: number): number{
    return index
  }
  rightTranform(index: number): number{
    return (index + 3 - 2 * (index % 4))
  }
  upTranform(index: number): number{
    return ((index % 4) * 4 + Math.floor(index / 4))
  }
  downTranform(index: number): number{
    return (3 - Math.floor(index / 4) + 4 * (index % 4) )
  }
  downTranform2(index: number): number{
    return (Math.floor(index / 4) + 12 - 4 * (index % 4))
  }

                                //MAIN MOVEMENT FUNCTIONS
                                
  //these functions call changes on the board depending on which direction was chosen by player
  leftArrow(){
    this.genericArrow(this.leftTranform,this.leftTranform, 'moveLeft')
  }
  rightArrow(){
    this.genericArrow(this.rightTranform, this.rightTranform, 'moveRight')
  }
  upArrow(){
    this.genericArrow(this.upTranform, this.upTranform, 'moveUp')
  }
  downArrow(){
    this.genericArrow(this.downTranform, this.downTranform2, 'moveDown')
  }


                                   //MAIN GAME FUNCTIONS

  //this function handles the game movement, it is the brain of the game, it calls every function needed to make game work. this is the MOST IMPORTANT FUNCTION IN THIS FILE!
  genericArrow(transform: (i: number) => number, transform2: (i: number) => number, move: string){
    //creating a base for comparioson and reseting array of animation
    let auxArray: number[] = []
    for(let i of this.curB){
      auxArray.push(i);
    }
    this.quantNum.fill(0, 0, 16);
    //calculating the resulting array to pass through fussions
    let calcArray: number[] = []
    for(let i = 0; i < 16; i++) calcArray.push(0)
    for(let i = 0; i < 16; i++) calcArray[transform(i)] = this.curB[i]
    for(let i = 0; i < 16; i++) this.calcArray[i] = calcArray[i]
    //passing through fussions
    calcArray = this.genericRound(calcArray)
    // creating the array containing the orders for animation
    for(let i = 0; i < 16; i++){
      if(this.quantNum[i] > 0){
        this.quantityes[transform2(i)] = move + ' n' + this.quantNum[i]; 
      }
    }
    //undoing calculation after passing through fussions
    let timeOut = setTimeout(() => {
      this.quantityes.fill('', 0, 16)
      for(let i = 0; i < 16; i++) this.curB[transform2(i)] = calcArray[i]
    }, 350)
    let gameoverReCheck = true;
    let timeOut2 = setTimeout(() => {
            // adding a random block if any changes where made 
            if(this.anyChangesInArray(auxArray, this.curB)){
              this.putRandom()
            } else if(!this.anySpaceLeft() && !this.anyChangesInArray(auxArray, this.curB)){
              gameoverReCheck = false;
              this.snackBar.openFromComponent(GameOverComponent,{
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000
            })}
    }, 500)
    //testing to make sure there are moves left to be done in the game, otherwise, game over!
    let timeOut3 = setTimeout(() => {
      if(this.anyMovesLeft() == false && gameoverReCheck){
        this.snackBar.openFromComponent(GameOverComponent,{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000
        })
      } 
      localStorage.setItem('lastgame', JSON.stringify(this.curB))
      localStorage.setItem('points', JSON.stringify(this.totalPoints))
      if(this.totalPoints > this.yourRecord){
        this.yourRecord = this.totalPoints;
        localStorage.setItem('record', JSON.stringify(this.totalPoints));
      }
    },550)
    
  }

  //after transforming the array according to the arrow button pressed, interations between blocks are calculated. this function handles the calculations.
  genericRound(transfArray: number[]){
    //for each line
    for (let i = 0; i < 13; i = i + 4){
      //for each block
      let wall = 0
      for (let j = 0; j < 3; j++){
        let k = j
        //it's necessary to look at all the precending blocks, but when there is one fussion, another fussion is no longer possible
        let haveFussed = false;
        while(k >= wall){
          if(transfArray[i + k] == 0){
            transfArray[i + k] = transfArray[i + k + 1];
            transfArray[i + k + 1] = 0;
            if (this.calcArray[i + j + 1] > 0) this.quantNum[i + j + 1]++;
          } 
          if(transfArray[i + k] == transfArray[i + k + 1] && transfArray[i + k] != 0 && haveFussed == false){
            transfArray[i + k] = transfArray[i + k] + 1;
            transfArray[i + k + 1] = 0;
            this.totalPoints += (2 ** transfArray[i + k])
            if (this.calcArray[i + j + 1] > 0) this.quantNum[i + j + 1]++;
            haveFussed = true;
            wall++;
          }
          k--;
        }
      }
    }
    return transfArray
  }
}
