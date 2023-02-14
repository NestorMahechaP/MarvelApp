import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import { CharacterListRoutingModule } from './character-list-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CharacterListRoutingModule, 
    NgxPaginationModule
  ]
})
export class CharacterListModule { }
