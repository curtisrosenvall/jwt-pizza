# SQL Injection and CORS Vulnerability Report

## Team Members
- Curtis Rosenvall
- Ash Hammond

## Self Attack

| Item | Result |
|------|--------|
| Date | 04/14/2025 |
| Target | pizza-service.startupcode.net |
| Classification | Brute Force |
| Severity | 2 |
| Description | I did a brute force injection of 50 different passwords to the PUT/api/auth endpoint. |
| Images | ![Burp Intruder attack of pizza-service.startupcode.net](jwt-pizza/penetrationTests/self.png) |
| Impact | The admin password was discovered. Possible attack using admin credentials |
| Corrections | I set a rate limit on the /api/auth endpoint |


## Peer Attack

### Attack Record Curtis -> Ash: [Attack Name]

| Item | Result |
|------|--------|
| Date | [Date of Attack] |
| Target | [Target System/URL] |
| Classification | [Type of Vulnerability] |
| Severity | [Severity Level] |
| Description | [Detailed description of the attack and its execution] |
| Images | [Description or placeholder for relevant screenshots] |
| Impact | [Description of the impact on the system] |
| Corrections | [Recommended fixes to prevent this attack] |

### Attack Record Ash -> Curtis: [Attack Name]

| Item | Result |
|------|--------|
| Date | [Date of Attack] |
| Target | [Target System/URL] |
| Classification | [Type of Vulnerability] |
| Severity | [Severity Level] |
| Description | [Detailed description of the attack and its execution] |
| Images | [Description or placeholder for relevant screenshots] |
| Impact | [Description of the impact on the system] |
| Corrections | [Recommended fixes to prevent this attack] |

