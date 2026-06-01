import { render } from '@testing-library/react';

import ReactMonorepoUi from './ui';

describe('ReactMonorepoUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactMonorepoUi />);
    expect(baseElement).toBeTruthy();
  });
});
