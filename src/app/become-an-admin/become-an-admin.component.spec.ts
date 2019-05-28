import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAnAdminComponent } from './become-an-admin.component';

describe('BecomeAnAdminComponent', () => {
  let component: BecomeAnAdminComponent;
  let fixture: ComponentFixture<BecomeAnAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeAnAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeAnAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
