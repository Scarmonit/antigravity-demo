# 🐳 Docker Deployment Guide

## Quick Start

### Running with Docker

```bash
# Build the image
docker build -t antigravity-demo .

# Run the container
docker run -d -p 8080:80 --name antigravity-demo antigravity-demo:latest

# Access the app
open http://localhost:8080
```

### Running with Docker Compose

```bash
# Production mode
docker-compose up web

# Development mode (with hot-reload)
docker-compose up dev

# Run tests
docker-compose up test

# Stop all services
docker-compose down
```

## 📦 Available Images

### Production (nginx)
- **Image**: `antigravity-demo:latest`
- **Size**: ~25-30 MB
- **Server**: nginx alpine
- **Port**: 80 → 8080 (mapped)
- **Use**: Production deployments

### Development (node)
- **Image**: `antigravity-demo:dev`
- **Size**: ~1 GB (includes dev tools)
- **Server**: Vite dev server
- **Port**: 5174 (hot-reload enabled)
- **Use**: Local development

## 🚀 Deployment Options

### 1. GitHub Container Registry

Images are automatically built and pushed on every commit to main:

```bash
# Pull from registry
docker pull ghcr.io/scarmonit/antigravity-demo:latest

# Run
docker run -d -p 8080:80 ghcr.io/scarmonit/antigravity-demo:latest
```

### 2. Azure Container Apps

```bash
# Login to Azure
az login

# Create container app
az containerapp create \
  --name antigravity-demo \
  --resource-group myResourceGroup \
  --image ghcr.io/scarmonit/antigravity-demo:latest \
  --target-port 80 \
  --ingress external

# Get URL
az containerapp show \
  --name antigravity-demo \
  --resource-group myResourceGroup \
  --query properties.configuration.ingress.fqdn
```

### 3. Google Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy antigravity-demo \
  --image ghcr.io/scarmonit/antigravity-demo:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 4. AWS ECS Fargate

Use the AWS console or CLI to create an ECS service using the image from GitHub Container Registry.

### 5. Local Kubernetes

```bash
# Create deployment
kubectl create deployment antigravity-demo \
  --image=ghcr.io/scarmonit/antigravity-demo:latest

# Expose service
kubectl expose deployment antigravity-demo \
  --type=LoadBalancer \
  --port=80

# Get service URL
kubectl get service antigravity-demo
```

## 🛠️ Development

### Dev Container (VS Code)

1. Open project in VS Code
2. Install "Dev Containers" extension
3. Press `F1` → "Dev Containers: Reopen in Container"
4. Wait for container to build
5. Run `npm run dev` inside container

Benefits:
- Identical environment for all developers
- All tools pre-installed
- Git configuration preserved

### Hot Reload Development

```bash
# Start dev server with hot-reload
docker-compose up dev

# Make changes to src/ files
# Browser automatically refreshes
```

## 🔍 Troubleshooting

### Build Failures

```bash
# Clear build cache
docker builder prune

# Rebuild without cache
docker build --no-cache -t antigravity-demo .
```

### Container Won't Start

```bash
# View logs
docker logs antigravity-demo

# Check health
docker inspect antigravity-demo | grep -A 10 Health
```

### Port Conflicts

```bash
# Use different port
docker run -p 9090:80 antigravity-demo:latest

# Find what's using port 8080
netstat -an | findstr :8080  # Windows
lsof -i :8080                # macOS/Linux
```

## 📊 Image Information

### Size Optimization

Multi-stage build reduces image size:
- **With node_modules**: ~1 GB
- **Production image**: ~25 MB (98% smaller!)

### Security Features

- Non-root user
- Minimal alpine base
- Security headers (CSP, HSTS, etc.)
- Regular security scans (Trivy)
- Read-only filesystem where possible

### Health Checks

Built-in health endpoint:
```bash
curl http://localhost:8080/health
# Response: "healthy"
```

## 🔐 Environment Variables

For custom configuration:

```bash
# With docker run
docker run -p 8080:80 \
  -e VITE_API_URL=https://api.example.com \
  antigravity-demo:latest

# With docker-compose.yml
environment:
  - VITE_API_URL=${API_URL}
```

## 📝 Best Practices

1. **Use docker-compose** for local development
2. **Tag images** with version numbers in production
3. **Use secrets** for sensitive data (not ARG/ENV)
4. **Monitor health** checks in production
5. **Update base** images regularly for security
6. **Scan images** with Trivy before deployment

## 🎯 Next Steps

- [ ] Set up continuous deployment to cloud platform
- [ ] Configure custom domain
- [ ] Set up monitoring and logging
- [ ] Implement blue-green deployments
- [ ] Add caching layer (CDN)

## 📚 Related Documentation

- [Dockerfile](../Dockerfile) - Production build configuration
- [docker-compose.yml](../docker-compose.yml) - Multi-service orchestration
- [nginx.conf](../nginx/nginx.conf) - Web server configuration
- [GitHub Actions](./.github/workflows/docker-deploy.yml) - Automated builds
