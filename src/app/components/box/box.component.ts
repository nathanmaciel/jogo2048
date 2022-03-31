import { Component, DoCheck, Input, IterableDifferFactory, IterableDiffers, OnChanges, OnInit, SimpleChanges, ɵdefaultIterableDiffers, ɵisListLikeIterable } from '@angular/core';
import { BlockDetails } from 'src/app/models/block-ani-style';
import { BlockStyles } from 'src/app/models/block-styles';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements  DoCheck {

      //this page gets the resulting arrays from game movements and transform them into styling information to be sent to blockComponent

  @Input() animation: string = ''

    // array with block styles, from 0 (empty) to 12 (4096)
    blcSt: BlockStyles[] = [
      {
        backgroundColor: 'grey',
        number: '',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(156,220,188)',
        number: '2',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(224,219,177)',
        number: '4',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(100,205,179)',
        number: '8',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(211,168,151)',
        number: '16',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(63,181,175)',
        number: '32',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(140,84,52)',
        number: '64',
        fontSize: 'normal'
      },
      {
        backgroundColor: 'rgb(67,157,145)',
        number: '128',
        fontSize: 'medium'
      },
      {
        backgroundColor: 'rgb(97,58,35)',
        number: '256',
        fontSize: 'medium'
      },
      {
        backgroundColor: 'rgb(0,119,137)',
        number: '512',
        fontSize: 'medium'
      },
      {
        backgroundColor: 'rgb(220,156,211)',
        number: '1024',
        fontSize: 'large'
      },
      {
        backgroundColor: 'rgb(167,76,126)',
        number: '2048',
        fontSize: 'large'
      },
      {
        backgroundColor: 'rgb(137,0,107)',
        number: '4096',
        fontSize: 'large'
      }
    ]
    // represents the blocks -> curB[0] = 0 representa 1º bloco de cima, à direita com 2 elevado a 0, ou vazio
          // 0    1   2   3
          // 4    5   6   7
          // 8    9   10  11
          // 12   13  14  15
    @Input() curB: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    //this property can be used in the future for more animations
    @Input() popAnimation: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
    //this property keeps basic animation information
    @Input() quantityes: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
  
    //gets the blocks representations and applies style
    blocks: BlockDetails[][] = [
      [
        {
          blockStyle:this.blcSt[this.curB[0]],
          direction: this.popAnimation[0],
          quantity: this.quantityes[0],
        },
        {
          blockStyle:this.blcSt[this.curB[1]],
          direction: this.popAnimation[1],
          quantity: this.quantityes[1],
        },
        {
          blockStyle:this.blcSt[this.curB[2]],
          direction: this.popAnimation[2],
          quantity: this.quantityes[2],
        },
        {
          blockStyle:this.blcSt[this.curB[3]],
          direction: this.popAnimation[3],
          quantity: this.quantityes[3],
        }
      ],
      [
      {
          blockStyle:this.blcSt[this.curB[4]],
          direction: this.popAnimation[4],
          quantity: this.quantityes[4],
        },
        {
          blockStyle:this.blcSt[this.curB[5]],
          direction: this.popAnimation[5],
          quantity: this.quantityes[5],
        },
        {
          blockStyle:this.blcSt[this.curB[6]],
          direction: this.popAnimation[6],
          quantity: this.quantityes[6],
        },
        {
          blockStyle:this.blcSt[this.curB[7]],
          direction: this.popAnimation[7],
          quantity: this.quantityes[7],
        }
      ],
      [
      {
        blockStyle:this.blcSt[this.curB[8]],
        direction: this.popAnimation[8],
        quantity: this.quantityes[8],
      },
      {
        blockStyle:this.blcSt[this.curB[9]],
        direction: this.popAnimation[9],
        quantity: this.quantityes[9],
      },
      {
        blockStyle:this.blcSt[this.curB[10]],
        direction: this.popAnimation[10],
        quantity: this.quantityes[10],
      },
      {
        blockStyle:this.blcSt[this.curB[11]],
        direction: this.popAnimation[11],
        quantity: this.quantityes[11],
      }
      ],
      [{
        blockStyle:this.blcSt[this.curB[12]],
        direction: this.popAnimation[12],
        quantity: this.quantityes[12],
      },
      {
        blockStyle:this.blcSt[this.curB[13]],
        direction: this.popAnimation[13],
        quantity: this.quantityes[13],
      },
      {
        blockStyle:this.blcSt[this.curB[14]],
        direction: this.popAnimation[14],
        quantity: this.quantityes[14],
      },
      {
        blockStyle:this.blcSt[this.curB[15]],
        direction: this.popAnimation[15],
        quantity: this.quantityes[15],
      }
      ],
    ]

  constructor() {}

  //applies changes when they happen
  ngDoCheck(): void {

    this.blocks = [
      [
        {
          blockStyle:this.blcSt[this.curB[0]],
          direction: this.popAnimation[0],
          quantity: this.quantityes[0],
        },
        {
          blockStyle:this.blcSt[this.curB[1]],
          direction: this.popAnimation[1],
          quantity: this.quantityes[1],
        },
        {
          blockStyle:this.blcSt[this.curB[2]],
          direction: this.popAnimation[2],
          quantity: this.quantityes[2],
        },
        {
          blockStyle:this.blcSt[this.curB[3]],
          direction: this.popAnimation[3],
          quantity: this.quantityes[3],
        }
      ],
      [
      {
          blockStyle:this.blcSt[this.curB[4]],
          direction: this.popAnimation[4],
          quantity: this.quantityes[4],
        },
        {
          blockStyle:this.blcSt[this.curB[5]],
          direction: this.popAnimation[5],
          quantity: this.quantityes[5],
        },
        {
          blockStyle:this.blcSt[this.curB[6]],
          direction: this.popAnimation[6],
          quantity: this.quantityes[6],
        },
        {
          blockStyle:this.blcSt[this.curB[7]],
          direction: this.popAnimation[7],
          quantity: this.quantityes[7],
        }
      ],
      [
      {
        blockStyle:this.blcSt[this.curB[8]],
        direction: this.popAnimation[8],
        quantity: this.quantityes[8],
      },
      {
        blockStyle:this.blcSt[this.curB[9]],
        direction: this.popAnimation[9],
        quantity: this.quantityes[9],
      },
      {
        blockStyle:this.blcSt[this.curB[10]],
        direction: this.popAnimation[10],
        quantity: this.quantityes[10],
      },
      {
        blockStyle:this.blcSt[this.curB[11]],
        direction: this.popAnimation[11],
        quantity: this.quantityes[11],
      }
      ],
      [{
        blockStyle:this.blcSt[this.curB[12]],
        direction: this.popAnimation[12],
        quantity: this.quantityes[12],
      },
      {
        blockStyle:this.blcSt[this.curB[13]],
        direction: this.popAnimation[13],
        quantity: this.quantityes[13],
      },
      {
        blockStyle:this.blcSt[this.curB[14]],
        direction: this.popAnimation[14],
        quantity: this.quantityes[14],
      },
      {
        blockStyle:this.blcSt[this.curB[15]],
        direction: this.popAnimation[15],
        quantity: this.quantityes[15],
      }
      ],
    ]

    }
}
