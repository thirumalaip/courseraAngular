import { ViewChild, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { Dish } from '../shared/dish'; 
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishcomments',
  templateUrl: './dishcomments.component.html',
  styleUrls: ['./dishcomments.component.scss']
})
export class DishcommentsComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  commentForm: FormGroup;
  comment: Comment;
 
 // @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'author':'',
    'comment':'',
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

    constructor(private fb: FormBuilder, private dishService: DishService, private route: ActivatedRoute) {
    this.createForm();
   }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => this.dish = dish);
         
  }

 createForm() {
  this.commentForm = this.fb.group({
    author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    rating: [0, [Validators.required, Validators.pattern]],
    date:[''],
    comment: ''
  });

  this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
  this.onValueChanged(); // re(set) form validation messages
 };

 onValueChanged(data?: any){
  if(!this.commentForm) { return;}
  const form = this.commentForm;
  for(const field in this.formErrors) {
    if (this.formErrors.hasOwnProperty(field)){
      // clear previous error message if any
      this.formErrors[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field]+= messages[key] + '';
          }
        }
      }
    }
  }
}

onSubmit() {
  let newDate = new Date();
  this.comment = this.commentForm.value
  this.dish.comments.push({rating: this.comment.rating, comment: this.comment.comment,  author: this.comment.author,  date: newDate.toString()})
  this.commentForm.reset();
}

}
