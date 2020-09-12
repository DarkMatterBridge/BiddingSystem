import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidSymbolComponent } from './bid-symbol.component';

describe('BidSymbolComponent', () => {
  let component: BidSymbolComponent;
  let fixture: ComponentFixture<BidSymbolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidSymbolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
