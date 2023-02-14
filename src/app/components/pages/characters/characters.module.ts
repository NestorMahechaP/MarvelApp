import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterListComponent } from '@characters/character-list/character-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FavouritesComponent } from './favourites/favourites.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const myComponents=[CharacterListComponent, FavouritesComponent];

@NgModule({
  declarations: [...myComponents],
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    NgbModule
  ],
  exports:[...myComponents]
})
export class CharactersModule { }
