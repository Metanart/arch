# JavaScript Node.js Rules
Follow general JavaScript rules.
Apply these rules to Node.js runtime environments.

# Environment
Access configuration through environment variables.
Validate required environment variables at application startup.
Avoid hardcoded environment-specific values.

# I/O Operations
Prefer asynchronous APIs.
Avoid blocking the event loop.
Use non-blocking file and network operations.

# File System
Handle filesystem errors explicitly.
Avoid synchronous filesystem methods in production code.
Prefer streaming for large files.
Avoid loading large files fully into memory.

# Concurrency
Control concurrency when processing large collections.
Avoid spawning excessive parallel operations.
Limit concurrent I/O tasks.

# Resource Management
Close resources when finished:
- file handles
- streams
- database connections
- network sockets
Avoid resource leaks.

# Process Safety
Handle process-level errors:
- `uncaughtException`
- `unhandledRejection`
Log errors before terminating the process.

# Logging
Use structured logging.
Avoid excessive console output in production.
Do not log sensitive information.

# Module Structure
Keep modules small and focused.
Avoid large monolithic files.
Export clear module interfaces.
Avoid exporting internal helpers unnecessarily.

# Error Handling
Propagate errors instead of silently ignoring them.
Use consistent error handling patterns across modules.