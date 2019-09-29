import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealviewComponent } from './dealview.component';

describe('DealviewComponent', () => {
  let component: DealviewComponent;
  let fixture: ComponentFixture<DealviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
