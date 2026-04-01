import { useState } from "react";

const components = [
  {
    id: "app",
    label: "MYQStudio App",
    sublabel: "Web / Mobile",
    gcp: "Firebase Hosting",
    color: "#4285F4",
    icon: "📱",
    x: 40, y: 40,
    description: "The employee-facing interface. Employees browse recommended content, interact with it, and provide feedback (thumbs, saves). Built on Firebase Hosting for fast global delivery with zero server management.",
    cost: "Free tier covers most early-stage usage"
  },
  {
    id: "api",
    label: "API Gateway",
    sublabel: "Request Router",
    gcp: "Cloud Run",
    color: "#0F9D58",
    icon: "🔀",
    x: 40, y: 200,
    description: "Stateless REST API layer. Routes requests from the app to the recommendation engine or content DB. Scales to zero when idle — no requests, no cost.",
    cost: "Scales to zero — pay only per request"
  },
  {
    id: "engine",
    label: "Recommendation Engine",
    sublabel: "AI Scoring Logic",
    gcp: "Cloud Run (Python)",
    color: "#F4B400",
    icon: "🧠",
    x: 340, y: 200,
    description: "Core AI logic. Computes recommendation scores using: Semantic Similarity (50%) via cosine distance between embeddings, Interest Match (30%) from employee profile, Seniority Fit (20%) from role level. Returns ranked content list.",
    cost: "Container-based, scales to zero between requests"
  },
  {
    id: "embeddings",
    label: "Embedding Model",
    sublabel: "Text → Vectors",
    gcp: "Vertex AI (text-embedding-gecko)",
    color: "#DB4437",
    icon: "🔢",
    x: 340, y: 40,
    description: "Converts employee interest text and content descriptions into fixed-dimension vectors. Called during onboarding and whenever new content is added. Not called per recommendation request — vectors are pre-stored.",
    cost: "Pay per 1000 characters — minimal at this scale"
  },
  {
    id: "vectorstore",
    label: "Vector Store",
    sublabel: "Embedding Search",
    gcp: "Vertex AI Vector Search",
    color: "#DB4437",
    icon: "🔍",
    x: 640, y: 120,
    description: "Stores all content embeddings. At query time, takes the employee's interest vector and finds the top-K most semantically similar content items using approximate nearest neighbor search.",
    cost: "Pay per query + storage — cost-effective at <100K vectors"
  },
  {
    id: "db",
    label: "Data Store",
    sublabel: "Profiles + Content",
    gcp: "Firestore",
    color: "#0F9D58",
    icon: "🗄️",
    x: 640, y: 300,
    description: "Stores two collections: Employee Profiles (ID, seniority, interests, cached recommendations) and Content Records (title, topic, cluster, description, format, duration). NoSQL, serverless, generous free tier.",
    cost: "Free tier: 1GB storage, 50K reads/day"
  },
  {
    id: "scheduler",
    label: "Pre-compute Job",
    sublabel: "Nightly Batch",
    gcp: "Cloud Scheduler + Cloud Functions",
    color: "#9C27B0",
    icon: "⏰",
    x: 340, y: 380,
    description: "Runs nightly to pre-compute recommendations for all employees and cache them in Firestore. This means when the employee opens the app, recommendations load instantly — no real-time AI computation needed.",
    cost: "Cloud Scheduler: ~$0.10/job/month. Cloud Functions: free tier covers nightly runs"
  },
  {
    id: "feedback",
    label: "Feedback Collector",
    sublabel: "Signals Loop",
    gcp: "Firestore + Cloud Functions",
    color: "#9C27B0",
    icon: "👍",
    x: 40, y: 380,
    description: "Captures micro-signals from employees: thumbs up/down, saves, shares. These signals are written to Firestore and picked up by the nightly job to improve future recommendations for that employee.",
    cost: "Covered under Firestore free tier"
  },
];

const connections = [
  { from: "app", to: "api", label: "HTTP requests" },
  { from: "api", to: "engine", label: "Score request" },
  { from: "api", to: "db", label: "Fetch cached recs" },
  { from: "engine", to: "vectorstore", label: "Similarity search" },
  { from: "engine", to: "db", label: "Read profiles/content" },
  { from: "embeddings", to: "vectorstore", label: "Store vectors" },
  { from: "embeddings", to: "db", label: "On new content" },
  { from: "scheduler", to: "engine", label: "Trigger batch" },
  { from: "scheduler", to: "db", label: "Write cached recs" },
  { from: "app", to: "feedback", label: "User signals" },
  { from: "feedback", to: "scheduler", label: "Feeds next run" },
];

const W = 180, H = 70;

function getCenterX(c) { return c.x + W / 2; }
function getCenterY(c) { return c.y + H / 2; }

function getEdgePoint(from, to) {
  const fx = getCenterX(from), fy = getCenterY(from);
  const tx = getCenterX(to), ty = getCenterY(to);
  const dx = tx - fx, dy = ty - fy;
  const angle = Math.atan2(dy, dx);
  const ex = fx + (W / 2 + 4) * Math.cos(angle);
  const ey = fy + (H / 2 + 4) * Math.sin(angle);
  return [ex, ey];
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const compMap = Object.fromEntries(components.map(c => [c.id, c]));
  const sel = selected ? compMap[selected] : null;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#0e1117", minHeight: "100vh", color: "#e0e0e0", padding: "24px" }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#4285F4", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>MYQStudio · GCP Deployment</div>
          <h1 style={{ margin: "4px 0 4px", fontSize: 22, fontWeight: 700, color: "#fff" }}>AI Recommendation Engine — Architecture</h1>
          <div style={{ fontSize: 13, color: "#888" }}>Click any component to see details · Early-stage concept on Google Cloud Platform</div>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* SVG Diagram */}
          <div style={{ flex: "0 0 auto" }}>
            <svg width={860} height={500} style={{ background: "#161b22", borderRadius: 12, border: "1px solid #30363d" }}>
              {/* Grid lines */}
              {[0,1,2,3,4,5,6].map(i => (
                <line key={`vg${i}`} x1={i*140} y1={0} x2={i*140} y2={500} stroke="#1e2530" strokeWidth={1}/>
              ))}
              {[0,1,2,3,4].map(i => (
                <line key={`hg${i}`} x1={0} y1={i*120} x2={860} y2={i*120} stroke="#1e2530" strokeWidth={1}/>
              ))}

              {/* Zone labels */}
              <text x={20} y={490} fill="#ffffff18" fontSize={11} fontWeight={700} letterSpacing={1}>EMPLOYEE ZONE</text>
              <text x={300} y={490} fill="#ffffff18" fontSize={11} fontWeight={700} letterSpacing={1}>AI / LOGIC ZONE</text>
              <text x={600} y={490} fill="#ffffff18" fontSize={11} fontWeight={700} letterSpacing={1}>DATA ZONE</text>
              <rect x={0} y={0} width={290} height={500} fill="#4285F410" rx={0}/>
              <rect x={290} y={0} width={310} height={500} fill="#F4B40008" rx={0}/>
              <rect x={600} y={0} width={260} height={500} fill="#0F9D5808" rx={0}/>

              {/* Connections */}
              <defs>
                <marker id="arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill="#444"/>
                </marker>
              </defs>
              {connections.map((conn, i) => {
                const f = compMap[conn.from], t = compMap[conn.to];
                const [x1, y1] = getEdgePoint(f, t);
                const [x2, y2] = getEdgePoint(t, f);
                const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
                const isActive = selected === conn.from || selected === conn.to;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isActive ? "#ffffff55" : "#ffffff18"}
                      strokeWidth={isActive ? 1.5 : 1}
                      strokeDasharray={isActive ? "none" : "4,4"}
                      markerEnd="url(#arrow)"
                    />
                    <text x={mx} y={my - 4} fill={isActive ? "#aaa" : "#555"} fontSize={9} textAnchor="middle">{conn.label}</text>
                  </g>
                );
              })}

              {/* Nodes */}
              {components.map(c => {
                const isSelected = selected === c.id;
                const isRelated = selected && connections.some(conn =>
                  (conn.from === selected && conn.to === c.id) ||
                  (conn.to === selected && conn.from === c.id)
                );
                const opacity = selected && !isSelected && !isRelated ? 0.35 : 1;
                return (
                  <g key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : c.id)}>
                    <rect
                      x={c.x} y={c.y} width={W} height={H} rx={8}
                      fill={isSelected ? c.color + "40" : "#1e2530"}
                      stroke={isSelected ? c.color : isRelated ? c.color + "80" : "#30363d"}
                      strokeWidth={isSelected ? 2 : 1}
                      opacity={opacity}
                    />
                    <text x={c.x + 10} y={c.y + 20} fill={c.color} fontSize={16} opacity={opacity}>{c.icon}</text>
                    <text x={c.x + 32} y={c.y + 22} fill="#fff" fontSize={12} fontWeight={700} opacity={opacity}>{c.label}</text>
                    <text x={c.x + 32} y={c.y + 36} fill="#888" fontSize={10} opacity={opacity}>{c.sublabel}</text>
                    <text x={c.x + 10} y={c.y + 58} fill={c.color + "cc"} fontSize={9} fontWeight={600} opacity={opacity}>{c.gcp}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Detail panel */}
        <div style={{
          marginTop: 16,
          background: sel ? sel.color + "15" : "#161b22",
          border: `1px solid ${sel ? sel.color + "50" : "#30363d"}`,
          borderRadius: 10,
          padding: "16px 20px",
          minHeight: 80,
          transition: "all 0.2s"
        }}>
          {sel ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{sel.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{sel.label}</div>
                  <div style={{ fontSize: 11, color: sel.color, fontWeight: 600 }}>{sel.gcp}</div>
                </div>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{sel.description}</p>
              <div style={{ fontSize: 12, color: "#888", background: "#ffffff08", padding: "6px 10px", borderRadius: 6, display: "inline-block" }}>
                💰 {sel.cost}
              </div>
            </>
          ) : (
            <div style={{ color: "#555", fontSize: 13, paddingTop: 8 }}>← Click any component above to see what it does, which GCP service powers it, and estimated cost.</div>
          )}
        </div>

        {/* Flow summary */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { title: "🌙 Nightly Pre-compute Flow", color: "#9C27B0", steps: ["Cloud Scheduler triggers at midnight", "Cloud Function calls Recommendation Engine", "Engine reads all employee profiles from Firestore", "Fetches top-K similar content via Vector Search", "Scores and ranks using 50/30/20 formula", "Writes cached recommendations back to Firestore"] },
            { title: "⚡ On-demand Refresh Flow", color: "#4285F4", steps: ["Employee opens app → API Gateway called", "If cache is fresh → return instantly from Firestore", "If employee just completed onboarding or cache stale →", "API calls Recommendation Engine in real time", "Engine runs full scoring → returns fresh results", "Result cached in Firestore for next visit"] },
          ].map(flow => (
            <div key={flow.title} style={{ background: "#161b22", border: `1px solid ${flow.color}30`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: flow.color, marginBottom: 10 }}>{flow.title}</div>
              {flow.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                  <span style={{ color: flow.color, fontSize: 11, fontWeight: 700, minWidth: 16 }}>{i + 1}.</span>
                  <span style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
