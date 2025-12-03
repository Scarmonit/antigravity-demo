export interface Workflow {
  id: string;
  title: string;
  description: string;
}

export const workflows: Workflow[] = [
  {
    id: 'create-webapp',
    title: '📱 create-webapp',
    description: 'Scaffold full-stack applications',
  },
  {
    id: 'browser-testing',
    title: '🌐 browser-testing',
    description: 'Automated testing workflows',
  },
  {
    id: 'build-mcp-server',
    title: '🔌 build-mcp-server',
    description: 'Custom MCP server development',
  },
  {
    id: 'setup-cicd',
    title: '🚀 setup-cicd',
    description: 'GitHub Actions pipelines',
  },
];
