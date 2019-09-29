import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemdownloadComponent } from './systemdownload.component';

describe('SystemdownloadComponent', () => {
  let component: SystemdownloadComponent;
  let fixture: ComponentFixture<SystemdownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemdownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemdownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
