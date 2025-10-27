# Test Plan

1. Run server: `node server/server.js`
2. Run client: `node client/client.js`
3. Check:
   - Client receives decrypted message response.
   - `logs_audit.txt` contains action logs.
4. Test invalid JWT → should get 401 Unauthorized.
5. Test wrong role → should get 403 Forbidden.
