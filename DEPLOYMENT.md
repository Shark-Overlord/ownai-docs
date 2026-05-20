# Deployment

This site is built by GitHub Actions and deployed as static files to Nginx.

## Production target

- Host: `101.200.91.81`
- SSH user: `deploy`
- Web root: `/www/wwwroot/ownai-docs`
- Nginx config: `/www/server/panel/vhost/nginx/ownai-docs.conf`

## Required GitHub secret

Create this repository secret in GitHub:

- `DEPLOY_SSH_KEY`: private key content from `C:\Users\xue\.ssh\ownai_docs_github_actions`

The matching public key has already been added to `/home/deploy/.ssh/authorized_keys` on the server.

## Deploy flow

Push to `master`, or run the `Deploy docs site` workflow manually.

The workflow runs:

```bash
npm ci
npm run build
rsync -az --delete dist/ deploy@101.200.91.81:/www/wwwroot/ownai-docs/
```

## Network

Nginx is already serving the site locally on the server. For public access, the cloud security group must allow inbound TCP `80`. Add TCP `443` later when a domain and HTTPS certificate are configured.
