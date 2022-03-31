import { AfterViewChecked, AfterViewInit, Component, EventEmitter, HostListener, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'jogo2048';

  totalPoints: number = 0

  yourRecordStr: string | null = localStorage.getItem('record')
  yourRecord: number = (this.yourRecordStr != null? parseInt(this.yourRecordStr) : 0)

  lastGame: string | null = localStorage.getItem('lastgame')
  curB: number[] = (this.lastGame != null? (JSON.parse(this.lastGame)) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  calcArray: number[] = []

  popAnimation: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
  popNum: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  quantityes: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
  quantNum: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  defaultTouch = { x: 0, y: 0, time: 0 };
  place: string[] = []

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ){}

  openDialog() {
    this.dialog.open(DialogComponent);
  }


  ngAfterViewInit(): void {
    if(this.lastGame == null){
      this.putRandom()
      this.putRandom()
    }
  }

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

  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:touchend', ['$event'])
  @HostListener('document:touchcancel', ['$event'])
  handleTouch(event: any) {

    console.log(event.type)
      
      let touch = event.touches[0] || event.changedTouches[0]

      // console.log(place.includes('touch'))

      // check the events
      if (event.type === 'touchstart') {
        this.defaultTouch.x = touch.pageX;
        this.defaultTouch.y = touch.pageY;
        this.defaultTouch.time = event.timeStamp;

        for (let i = 0; i < 5; i++){
          this.place.push(event.path[i].classList.value)
        }
        console.log(this.place.some((el) => el == 'mask'))

    } else if (event.type === 'touchend') {
        let deltaX = touch.pageX - this.defaultTouch.x;
        let deltaY = touch.pageY - this.defaultTouch.y;
        let deltaTime = event.timeStamp - this.defaultTouch.time;
        console.log('end')
        console.log(deltaX)
        console.log(deltaY)
        console.log(deltaTime)

        // simulte a swipe -> less than 500 ms and more than 60 px
        if (deltaTime < 500) {
            // touch movement lasted less than 500 ms
            if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 40 && this.place.some((el) => el == 'mask')) {
                // delta x is at least 60 pixels
                if (deltaX > 0) {
                    this.rightArrow();
                } else {
                    this.leftArrow();
                }
            }

            if (Math.abs(deltaY) > 60 && Math.abs(deltaX) < 40 && this.place.some((el) => el == 'mask')) {
                // delta y is at least 60 pixels
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

  resetGame(){
    for(let i = 0; i < 16; i++){
      this.curB[i]=0
    }
    this.totalPoints = 0;
    this.putRandom()
  }

  putRandom(){
      let done = this.anySpaceLeft()
      let newBlock = 1;

      if(Math.random() > (1 - (this.totalPoints / 40000))) newBlock = 2;

      while (done == true){
        let random = Math.floor(Math.random() * 16)
        if (this.curB[random] == 0){
          this.curB[random] = newBlock;
          done = false
        } 
      }
  }

  anySpaceLeft(){
    for(let i of this.curB){
      if(i == 0) return true
    }
    return false
  }

  anyChangesInArray(array1: number[], array2: number[]){
    for(let i = 0; i < 16; i++){
      if(array1[i] != array2[i]) return true
    }
    return false
  }

  anyMovesLeft():boolean {
    if(this.anySpaceLeft() == true) return true

    for(let i = 0; i < 16; i++){
      if(i - 1 >= 0){
        if (this.curB[i] == this.curB[i - 1]) return true
      }
      if(i - 4 >= 0){
        if (this.curB[i] == this.curB[i - 4]) return true
      }
      if(i + 1 < 16){
        if (this.curB[i] == this.curB[i + 1]) return true
      }
      if(i + 4 < 16){
        if (this.curB[i] == this.curB[i + 4]) return true
      }
    }
    return false;
  }


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
      //making added blocks pop
      for(let i = 0; i < 16; i++){
        if(this.popNum[i] == 1){
          this.popAnimation[transform2(i)] = 'scale'
        }
      }
      this.popNum.fill(0, 0, 16)
    }, 350)

    //reseting pop function
    let timeOut2 = setTimeout(() => {
      this.popAnimation.fill('', 0, 16)
            // adding a random block if any changes where made 
            if(this.anyChangesInArray(auxArray, this.curB)){
              this.putRandom()
            }
    }, 500)

    //testing to make sure there are moves left to be done in the game, otherwise, game over!
    let timeOut3 = setTimeout(() => {
      if(this.anyMovesLeft() == false){
        this.snackBar.open('GAME OVER', 'ok',{
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
      }
      localStorage.setItem('lastgame', JSON.stringify(this.curB))
      if(this.totalPoints > this.yourRecord){
        this.yourRecord = this.totalPoints;
        localStorage.setItem('record', JSON.stringify(this.totalPoints));
      }
    },550)
    
  }

  //after transforming the array according to the arrow button pressed, interations between blocks are calculated
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
