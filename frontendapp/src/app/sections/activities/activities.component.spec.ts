import { ActivityService } from './activity.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ActivitiesComponent } from './activities.component';
import { MatInputModule } from '@angular/material/input';
import { Observable, of } from 'rxjs';
import { urls } from 'src/environments/environment';

describe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;
  let activitySpy = {getData: jasmine.createSpy('getData')};
  activitySpy.getData.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      declarations: [ ActivitiesComponent ],
      providers: [
        {provide: ActivityService, useValue: activitySpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    component.activityService = TestBed.inject(ActivityService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an activities header', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Activities');
  });

  it('should get activities on init', () => {
    fixture.detectChanges();
    expect(activitySpy.getData).toHaveBeenCalledOnceWith(urls.activities);
  });
});
