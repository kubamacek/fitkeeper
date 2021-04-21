import { FoodService } from './food.service';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Browser } from 'selenium-webdriver';

import { FoodbaseComponent } from './foodbase.component';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { of } from 'rxjs';
import { urls } from 'src/environments/environment';

describe('FoodbaseComponent', () => {
  let component: FoodbaseComponent;
  let fixture: ComponentFixture<FoodbaseComponent>;
  const foodSpy = {getData: jasmine.createSpy('getData')};
  foodSpy.getData.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule
      ],
      declarations: [ FoodbaseComponent ],
      providers: [
        {provide: FoodService, useValue: foodSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodbaseComponent);
    component = fixture.componentInstance;
    component.foodService = TestBed.inject(FoodService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a foodbase header', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Foodbase');
  });

  it('should get activities on init', () => {
    fixture.detectChanges();
    expect(foodSpy.getData).toHaveBeenCalledOnceWith(urls.foodbase);
  });

});
