import { render } from '@testing-library/react';

import ReactMonorepoOrders from './orders';

describe('ReactMonorepoOrders', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactMonorepoOrders />);
    expect(baseElement).toBeTruthy();
  });
});
