import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBSComponent } from './manage-bs.component';

describe('ManageBSComponent', () => {
  let component: ManageBSComponent;
  let fixture: ComponentFixture<ManageBSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
