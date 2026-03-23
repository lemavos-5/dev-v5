/**
 * ============================================================================
 * FRONTEND SECURITY GUIDELINES: JWT Token Storage & Cookie Configuration
 * ============================================================================
 * 
 * O backend retorna:
 * {
 *   "accessToken": "<short-lived token, 15 min>",
 *   "refreshToken": "<long-lived token, 7 dias>",
 *   "userId": "...",
 *   "username": "...",
 *   "email": "...",
 *   "plan": "..."
 * }
 * 
 * ============================================================================
 * RECOMMENDED: Bearer Token Strategy (Memory + Secure Refresh)
 * ============================================================================
 * 
 * 1. Store AccessToken ONLY in Memory (JavaScript variable or React state)
 *    - NEVER use localStorage/sessionStorage (vulnerable to XSS)
 *    - Example: const [accessToken, setAccessToken] = useState(null);
 *
 * 2. Store RefreshToken in HttpOnly Secure Cookie (Backend sets this via Set-Cookie)
 *    - Frontend should REQUEST the server to set the cookie (POST /api/auth/login)
 *    - Browser automatically sends cookie on requests with credentials
 *
 * ============================================================================
 * COOKIE CONFIGURATION (Optional: Backend can set via Response Header)
 * ============================================================================
 *
 * If implementing cookie-based refresh token, use EXACT format:
 * 
 * Set-Cookie: refreshToken=<token value>; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=604800
 *
 * Flags explanation:
 * - HttpOnly: Cookie NOT accessible from JavaScript (prevents XSS theft)
 * - Secure: Cookie only sent over HTTPS (prevents MITM)
 * - SameSite=Strict: Cookie only sent to same origin (prevents CSRF)
 * - Path=/api: Cookie only sent to API calls
 * - Max-Age=604800: 7 days (same as refresh token expiration)
 *
 * ============================================================================
 * FRONTEND IMPLEMENTATION EXAMPLE (React)
 * ============================================================================
 *
 * // 1. LOGIN
 * const login = async (email, password) => {
 *   try {
 *     const res = await fetch('/api/auth/login', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       credentials: 'include', // ⚠️ IMPORTANT: Send cookies with request
 *       body: JSON.stringify({ email, password })
 *     });
 *
 *     const data = await res.json();
 *     setAccessToken(data.accessToken);
 *     // RefreshToken is automatically stored in HttpOnly cookie by Set-Cookie header
 *   } catch (error) {
 *     console.error('Login failed', error);
 *   }
 * };
 *
 * // 2. API REQUEST WITH ACCESS TOKEN
 * const fetchWithAuth = async (url, options = {}) => {
 *   return fetch(url, {
 *     ...options,
 *     headers: {
 *       ...options.headers,
 *       'Authorization': `Bearer ${accessToken}`
 *     },
 *     credentials: 'include' // Send HttpOnly cookie
 *   });
 * };
 *
 * // 3. REFRESH TOKEN
 * const refreshAccessToken = async () => {
 *   try {
 *     const res = await fetch('/api/auth/refresh', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       credentials: 'include', // Browser sends HttpOnly cookie
 *       body: JSON.stringify({}) // RefreshToken sent in cookie, not body
 *     });
 *
 *     if (!res.ok) throw new Error('Refresh failed');
 *     const data = await res.json();
 *     setAccessToken(data.accessToken);
 *     // New RefreshToken in Set-Cookie header
 *   } catch (error) {
 *     // Redirect to login if refresh fails
 *     logout();
 *   }
 * };
 *
 * // 4. LOGOUT
 * const logout = async () => {
 *   try {
 *     await fetch('/api/auth/logout', {
 *       method: 'POST',
 *       headers: { 'Authorization': `Bearer ${accessToken}` },
 *       credentials: 'include'
 *     });
 *   } finally {
 *     setAccessToken(null);
 *     // HttpOnly cookie will be cleared by Set-Cookie: refreshToken=; Max-Age=0
 *   }
 * };
 *
 * ============================================================================
 * ALTERNATIVE: Token in Body Strategy (Less Secure, Not Recommended)
 * ============================================================================
 *
 * If you MUST store token in localStorage (NOT RECOMMENDED):
 * 
 * RISKS:
 * - Vulnerable to XSS attacks (any JS code can access localStorage)
 * - No protection against CSRF
 * - Exposed if attacker runs JavaScript in your app context
 *
 * ONLY use if:
 * - You have strong XSS protection (CSP headers, React/Vue sanitization)
 * - You understand the trade-off between simplicity and security
 *
 * Implementation:
 * localStorage.setItem('accessToken', data.accessToken);
 * localStorage.setItem('refreshToken', data.refreshToken);
 *
 * ============================================================================
 * SECURITY CHECKLIST
 * ============================================================================
 *
 * ✅ AccessToken stored in memory only
 * ✅ RefreshToken stored in HttpOnly Secure SameSite cookie
 * ✅ AccessToken is short-lived (15 min)
 * ✅ RefreshToken rotates on each use (old token revoked)
 * ✅ POST /api/auth/logout revokes both tokens
 * ✅ Token blacklist checked on every request
 * ✅ CORS with credentials: 'include'
 * ✅ Frontend sends Authorization: Bearer <token> on API calls
 * ✅ No sensitive data in JWT payload (no passwords, secrets)
 * ✅ CSP headers to prevent XSS
 *
 * ============================================================================
 */
