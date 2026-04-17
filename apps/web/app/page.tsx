export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Assignment 4</p>
        <h1>Realtime Weather Dashboard</h1>
        <p className="lede">
          A multi-service system that collects live weather data, stores it in
          Supabase, and delivers realtime updates to a Next.js frontend.
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Frontend</h2>
          <p>Next.js application designed for deployment on Vercel.</p>
        </article>
        <article className="card">
          <h2>Worker</h2>
          <p>Node.js background worker responsible for polling live weather data.</p>
        </article>
        <article className="card">
          <h2>Database</h2>
          <p>Supabase stores weather snapshots and broadcasts realtime changes.</p>
        </article>
      </section>
    </main>
  );
}
