"use client";

export default function ShareableCard({ data }) {
  const stats = data.summary;

  return (
    <div
      id="shareable-card"
      style={{
        width: "600px",
        minHeight: "800px",
        background: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)",
        padding: "32px",
        borderRadius: "16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "1px solid #3f3f46",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #4ade80 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          League Wrapped 2024
        </h1>
        <p
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          {data.gameName}
        </p>
      </div>

      {/* Stats Container */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        {/* Best Role */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#27272a",
            border: "1px solid #3f3f46",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>
            Best Role
          </span>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#4ade80" }}>
            {stats.bestRole}
          </span>
        </div>

        {/* Best Role Winrate */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#27272a",
            border: "1px solid #3f3f46",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>
            Best Role Winrate
          </span>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#f87171" }}>
            {stats.bestRoleWinrate}%
          </span>
        </div>

        {/* Champions Played */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#27272a",
            border: "1px solid #3f3f46",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>
            Champions Played
          </span>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#60a5fa" }}>
            {stats.champsPlayed}
          </span>
        </div>

        {/* Time Played */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#27272a",
            border: "1px solid #3f3f46",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>
            Time Played
          </span>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#c084fc" }}>
            {stats.hoursPlayed}h
          </span>
        </div>

        {/* Most Played Champion */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#27272a",
            border: "1px solid #3f3f46",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#ffffff" }}>
            Most Played
          </span>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "#fbbf24" }}>
            {stats.topChamp}
          </span>
        </div>
      </div>

      {/* Top 3 Champions */}
      <div
        style={{
          backgroundColor: "#27272a",
          border: "1px solid #3f3f46",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            color: "#ffffff",
            fontWeight: "500",
            marginBottom: "16px",
            fontSize: "16px",
          }}
        >
          Top 3 Champions
        </p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {stats.top3Champs &&
            stats.top3Champs.map((champ, index) => (
              <div key={champ.name} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <p style={{ fontWeight: "bold", color: "#ffffff", fontSize: "14px", marginBottom: "2px" }}>
                  {champ.name}
                </p>
                <p style={{ fontSize: "12px", color: "#a1a1aa", marginBottom: "2px" }}>
                  {champ.games} games
                </p>
                <p style={{ fontSize: "12px", color: "#a1a1aa" }}>
                  {champ.winrate}% WR
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #3f3f46",
        }}
      >
        <p style={{ color: "#71717a", fontSize: "12px" }}>
          leaguewrapped.gg • Season 2024
        </p>
      </div>
    </div>
  );
}