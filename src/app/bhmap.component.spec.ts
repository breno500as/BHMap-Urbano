import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhMapComponent } from './bhmap.component';

describe('BhmapComponent', () => {
  let component: BhMapComponent;
  let fixture: ComponentFixture<BhMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
