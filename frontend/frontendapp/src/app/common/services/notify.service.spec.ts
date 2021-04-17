import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotifyService } from './notify.service';

describe('NotifyService', () => {
  let service: NotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ]
    });
    service = TestBed.inject(NotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call open method', () => {
    spyOn(service, 'notify_user');
    service.notify_user('hello');
    expect(service.notify_user).toHaveBeenCalledWith('hello');
  });
});
