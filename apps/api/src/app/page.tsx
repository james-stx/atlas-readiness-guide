export default function ApiRoot() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Atlas Readiness Guide API</h1>
      <p>This is the API server. Available endpoints:</p>
      <ul>
        <li>
          <code>POST /api/session</code> - Create session
        </li>
        <li>
          <code>GET /api/session/:id</code> - Get session
        </li>
        <li>
          <code>POST /api/chat</code> - Send message
        </li>
        <li>
          <code>POST /api/snapshot/generate</code> - Generate snapshot
        </li>
        <li>
          <code>GET /api/export/pdf</code> - Download PDF
        </li>
      </ul>
    </main>
  );
}
