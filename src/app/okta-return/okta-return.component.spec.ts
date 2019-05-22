import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OktaReturnComponent } from './okta-return.component';

describe('OktaReturnComponent', () => {
  let component: OktaReturnComponent;
  let fixture: ComponentFixture<OktaReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OktaReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OktaReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
