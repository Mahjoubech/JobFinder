import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletAccount } from './delet-account';

describe('DeletAccount', () => {
  let component: DeletAccount;
  let fixture: ComponentFixture<DeletAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
