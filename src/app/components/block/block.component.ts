import { Component, Input, OnInit } from '@angular/core';
import { BlockStyles } from 'src/app/models/block-styles';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {

  tileNumber: number = 2

  @Input() blockStyles: BlockStyles = {
    backgroundColor: 'background-color: white;',
    number: '2',
    fontSize: 'normal'
  }

  @Input() scaleWhenFussion: number[] = []

  @Input() animation: string = ''


  constructor() { }

  ngOnInit(): void {
  }

}
