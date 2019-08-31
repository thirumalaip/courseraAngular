import { Component, OnInit, Inject} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  dishErrMess: string;

  constructor(
    private fb: FormBuilder, 
    private dishService: DishService, 
    private location: Location, 
    private route: ActivatedRoute,
    @Inject('BaseURL') private BaseURL){
    this.createForm();
  }
  formErrors = {
    'author': '',
    'comment': '',
  }

  validationMessages = {
    'author': {
      'required': 'name is required.',
      'minlength': 'name must be more then 2 charaters',
      'maxlength': 'name not more then 25 charaters'
    },
    'comment': {
      'required': 'comments required.'
    }
  };

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds, disherrMess => this.dishErrMess = <any>disherrMess);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish, this.setPrevNext(dish.id) });
      this.dishErrMess= "test error"
      console.log("dish erro mes", this.dishErrMess)

  }
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: [0, [Validators.required, Validators.pattern]],
      date: [''],
      comment: ''
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data), disherrmess => this.dishErrMess = <any>disherrmess);
    this.onValueChanged(); // re(set) form validation messages
  };

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message if any
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    this.commentForm.reset();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length]
  }

  goBack(): void {
    this.location.back();
  }

}
