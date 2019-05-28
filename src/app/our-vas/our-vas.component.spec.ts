import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurVasComponent } from './our-vas.component';

describe('OurVasComponent', () => {
  let component: OurVasComponent;
  let fixture: ComponentFixture<OurVasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurVasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurVasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
