require('ts-node').register({ transpileOnly: true });

// Mock environments and modules
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Mock out the router and components that might use browser APIs
jest.mock('@tanstack/react-router', () => ({
  createFileRoute: () => () => ({})
}));
jest.mock('lucide-react', () => new Proxy({}, { get: () => 'div' }));
jest.mock('recharts', () => new Proxy({}, { get: () => 'div' }));
jest.mock('sonner', () => ({ toast: console.log }));

// We need to actually import it properly.
// Since it's a bit complex with aliases like @/components, let's use Vite or esbuild to bundle it and run it.
