import { render } from '@testing-library/react';

import ReactMonorepoCatalog from './catalog';

describe('ReactMonorepoCatalog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactMonorepoCatalog />);
    expect(baseElement).toBeTruthy();
  });
});
