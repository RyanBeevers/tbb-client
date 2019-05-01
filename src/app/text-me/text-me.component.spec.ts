import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMeComponent } from './text-me.component';

describe('TextMeComponent', () => {
  let component: TextMeComponent;
  let fixture: ComponentFixture<TextMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
