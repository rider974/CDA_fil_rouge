import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation Swagger pour BeginnersAppDev',
      version: '0.0.1',
      description: 'API documentation for BeginnersAppDev. This API provides endpoints for managing comments, users, and other resources.',
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT'
      },
      contributors: [
        {
          name: 'Florence Martin',
          email: 'florence.martin@gmail.com',
          role: 'Product owner / dev'
        },
        {
          name: 'Pascal Minatchy',
          email: 'minatchy.pascal@protonmail.com',
          role: 'tech lead / dev'
        },
        {
          name: 'Legrand Thomas',
          email: 'pro.legrand.thomas@gmail.com',
          role: 'scrum master / dev'
        }
      ]
    },
    servers: [
      {
        url: 'http://45.81.84.133:9015/',
        description: 'Production server (VPS Florence)'
      },
      {
        url: 'http://45.81.84.133:9019/',
        description: 'Production server (VPS Pascal)'
      },
      {
        url: 'http://45.81.84.133:9069/',
        description: 'Production server (VPS Thomas)'
      },
      {
        url: 'http://localhost:3001/',
        description: 'stagging local'
      }
    ],
    tags: [
      {
        name: 'roles',
        description: 'Endpoints related to roles'
      },
      {
        name: 'Users',
        description: 'Endpoints related to user management'
      },
      {
        name: 'Follows',
        description: 'Endpoints related to user follow relationships'
      },
      {
        name: 'Comments',
        description: 'Endpoints related to comments'
      },
      {
        name: 'RessourceTypes',
        description: 'Endpoints related to resource types'
      },
      {
        name: 'RessourceStatus',
        description: 'Endpoints related to resource statuses'
      },
      {
        name: 'Ressources',
        description: 'Endpoints related to resources'
      },
      {
        name: 'Tags',
        description: 'Endpoints related to tags'
      },
      {
        name: 'have',
        description: 'Endpoints related to associations between a tag and a resource'
      },
      {
        name: 'refer',
        description: 'Endpoints related to associations between a tag and a sharing session'
      },
      {
        name: 'References',
        description: 'Endpoints related to references between resources'
      },
      {
        name: 'Sharing session',
        description: 'Endpoints related to sharing sessions'
      }
    ],
  },
  apiFolder: 'src/pages/api',
});

export default swaggerHandler();
