import { FaturaAngular4Page } from './app.po';

describe('fatura-angular4 App', function() {
  let page: FaturaAngular4Page;

  beforeEach(() => {
    page = new FaturaAngular4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
