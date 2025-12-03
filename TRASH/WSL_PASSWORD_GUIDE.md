# WSL and Remote Server Password Management Guide

## Password Scenarios and Solutions

| Scenario             | Solution                                                 |
|----------------------|----------------------------------------------------------|
| It's your WSL        | Your WSL Linux password (set during WSL setup)           |
| It's a remote server | Whatever you configured for user scarm on that box       |
| Forgot it?           | Reset via `passwd scarm` if you have sudo access elsewhere |

## WSL-Specific Password Reset

If you forgot your WSL password, you can reset it from Windows PowerShell:

1. Open PowerShell as Administrator
2. Run the following command:
   ```powershell
   wsl -u root passwd scarm
   ```
3. Follow the prompts to set a new password

## Alternative for WSL Development

For development purposes in WSL, consider using the WSL extension in VS Code:

- **Benefits**: Simpler workflow, no password required
- **How to use**: Install the "Remote - WSL" extension in VS Code
- **Access**: Direct access to WSL files and terminal without SSH

## Additional Notes

- WSL passwords are separate from your Windows password
- The password is used for sudo operations within the WSL environment
- If you're only using WSL for development, you may not need to set a password at all
- For remote servers, password management depends on how the server was configured

## Troubleshooting

If you encounter issues:
1. Ensure WSL is properly installed (`wsl --list` to check)
2. Make sure you have administrative privileges on Windows
3. For remote servers, check your SSH configuration and access rights
