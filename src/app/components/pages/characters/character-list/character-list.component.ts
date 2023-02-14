import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '@app/shared/services/character.service';
import {PaginationInstance} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap'
import { take } from 'rxjs';
import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit{
  constructor(private characterService : CharacterService, private route: ActivatedRoute, private modalService: NgbModal, private toastr:ToastrService){}

  ngOnInit(): void {
    this.loadCharactersList();
    this.favourites = this.get();
    this.characterService.setFavourite(this.favourites);
  }

  private query : string = '';
  private orderBy : string = '';
  keyOption : string = 'Sort By';
  options: { [key: string]: string } = {
    'name' : 'Name (A-Z)',
    '-name' : 'Name (Z-A)',
    'modified' : 'Date (Asc)',
    '-modified' : 'Date (Desc)'
  };
  characterList:any=[];
  loading: boolean = true;
  //Comic Modal
  comic:any;
  btnImgAdd='';
  btncolAdd: boolean = false;
  favourites: any=[];
  titlebutton ='';
  closeResult = '';
  //Character Modal
  character:any;
  characterComic:any;
  display : boolean = false;
  displayId : number = 0;
  openModal : boolean = false;
  //Paginate
  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };

  onPageChange(number: number) {
    this.config.currentPage = number;
  }
  public labels: any = {
    previousLabel: '<',
    nextLabel: '>',
  };

  private loadCharactersList(){
    this.route.params.subscribe(params => {
      this.query = params['query'];
      this.getCharactersData();
    });
  }

  private async getCharactersData(){
    this.loading = true;
    this.characterList = await this.characterService.searchCharacters(this.query, this.orderBy);
    this.loading = false;
  }

  orderAs(type = '')
  {
    this.orderBy = type;
    this.keyOption = this.options[type];
    this.getCharactersData();
  }

  comicArrays(character:any): any[]{
    let comicArray: any[] = [];
    let comics = character.comics?.items;
    if(comics)
    {
      for(var val of comics){
        comicArray.push(val);
      }
    }
    if(comicArray.length == 0)
      comicArray.push("No comics found.")
    return comicArray;
  }

  validateDescription(text:String){
    return text.length > 143 ? text.slice(0,140)+ "..." : text;
  }

  validateComic(text:String){
    return text?.length > 43 ? text?.slice(0,40)+ "..." : text;
  }
  
  replaceDefaultImage(img:any){
    var urlDefaultImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    var actualImg = img.path + "." + img.extension;
    return actualImg != urlDefaultImg ? actualImg : "assets/super-hero.jpg";
  }
  modalCharacter(characterId: number, characterModal:TemplateRef<any>){
    this.displayId = characterId;
    this.loading = true;
    if (this.display){
      this.characterService.getStories(characterId)
        .pipe(take(1))
        .subscribe((res:any) =>{
          this.characterComic = res.data.results;
          this.loading = false;
          if (!this.openModal){
            this.openCharacterModal(characterModal);
            this.openModal = true;
          } 
        });
    }
    else{
      this.characterService.getDetails(characterId)
      .pipe(take(1))
      .subscribe((res: any) =>{
        this.character = res.data.results;
        console.log(this.character);
        this.characterService.getComics(characterId)
        .pipe(take(1))
        .subscribe((res:any) =>{
          this.characterComic = res.data.results;
          this.loading = false;
          if (!this.openModal){
            this.openCharacterModal(characterModal);
            this.openModal = true;
          } 
        });
      });
    }
  }

  changeState(characterId: number,characterModal:TemplateRef<any>){
    this.display = !this.display;
    this.modalCharacter(characterId,characterModal);
  }

  openCharacterModal(characterModal:TemplateRef<any>){
    this.modalService.open(characterModal, {ariaLabelledBy: 'modal-basic-title', centered: true, size:'lg', modalDialogClass:'dark-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;}, 
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  modalComic(urlComic: string, comicModal:TemplateRef<any>){
    this.loading = true;
    this.characterService.getComicDetailsByUrl(urlComic) 
    .pipe(take(1))
    .subscribe((res: any) =>{
      this.comic= Object.values(res.data.results);
      this.btncolAdd=false;
      this.btnImgAdd="assets/btn-favourites-default.png";
      this.titlebutton="ADD TO FAVOURITES"
      for(let element of this.favourites)
      {
        if (element.id == this.comic[0].id)
        {
          this.btncolAdd=true;
          this.btnImgAdd="assets/btn-favourites-primary.png";
          this.titlebutton="ADDED TO FAVOURITES"
          break;
        }
      } 
      this.modalService.open(comicModal, {ariaLabelledBy: 'modal-basic-title', centered: true, size:'lg', modalDialogClass:'dark-modal'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;}, 
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.loading = false;
    })
  }
  private getDismissReason(reason: any): string {
    this.openModal = false;
    this.display = false;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  addFavorites(){
    this.btncolAdd=!this.btncolAdd;
    if(this.btncolAdd){
      this.btnImgAdd="assets/btn-favourites-primary.png";
      this.titlebutton="ADDED TO FAVOURITES";
      this.favourites.push(this.comic[0]);
      this.characterService.setFavourite(this.favourites);
      this.toastr.success('Comic Favourites', 'Added', {timeOut:2000})
    } else{
      this.btnImgAdd="assets/btn-favourites-default.png";
      this.titlebutton="ADD TO FAVOURITES";
      var cont:number=0;
      var index:number=-1;
      for(let element of this.favourites)
      {
        if(element.id==this.comic[0].id)
        {
          index=cont;
          break;
        }
        cont=cont+1;
      }
      if(index>-1)
      {
        this.favourites.splice(index,1)
        this.toastr.info('Comic Favourites', 'Deleted', {timeOut:2000})
      }
    }
    this.save(this.favourites);
    this.get();
  }

  save(fav :any){
    sessionStorage.setItem('favourites', JSON.stringify (fav))
  }

  get(){
    var favouritesArray : any=[];
    favouritesArray=sessionStorage.getItem('favourites');
    if (favouritesArray==null || favouritesArray.length==0)
      return [];
    return JSON.parse(favouritesArray);
  }
} 