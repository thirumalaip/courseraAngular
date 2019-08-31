import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishcommentsComponent } from './dishcomments.component';

describe('DishcommentsComponent', () => {
  let component: DishcommentsComponent;
  let fixture: ComponentFixture<DishcommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishcommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishcommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
