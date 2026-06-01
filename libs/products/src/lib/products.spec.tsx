import { render } from '@testing-library/react';

import ReactMonorepoProducts from './products';

describe('ReactMonorepoProducts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactMonorepoProducts />);
    expect(baseElement).toBeTruthy();
  });
});
