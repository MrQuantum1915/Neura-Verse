# Database Ping Documentation

## Weekly Supabase Database Ping

This repository includes a GitHub Action that automatically pings the Supabase database on a weekly schedule to maintain connection health and monitor database availability.

### How it works

- **Schedule**: Runs every Sunday at 12:00 UTC
- **Purpose**: Keeps the Supabase database connection active and monitors database health
- **Method**: Performs a simple database query to test connectivity

### Manual Testing

You can test the database ping functionality locally:

```bash
# Test the ping script (requires environment variables)
node scripts/test-database-ping.js

# Test without environment variables (validation only)
node scripts/test-database-ping.js
```

### Required Secrets

The workflow requires the following GitHub repository secrets to be configured:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (admin access)

### Workflow File

The workflow is defined in `.github/workflows/database-ping.yml` and includes:

- Automatic dependency installation
- Database connectivity testing
- Error handling and reporting
- Manual trigger capability for testing

### Monitoring

The workflow will:
- ✅ Report success when the database is reachable
- ❌ Fail with details when the database cannot be reached
- 📊 Log connection status and timestamp information