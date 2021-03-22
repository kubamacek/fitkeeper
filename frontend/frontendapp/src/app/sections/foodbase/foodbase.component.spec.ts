import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodbaseComponent } from './foodbase.component';

describe('FoodbaseComponent', () => {
  let component: FoodbaseComponent;
  let fixture: ComponentFixture<FoodbaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodbaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
