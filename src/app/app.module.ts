import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockComponent } from './components/block/block.component';
import { BoxComponent } from './components/box/box.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { GameOverComponent } from './components/game-over/game-over.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    BoxComponent,
    DialogComponent,
    GameOverComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
