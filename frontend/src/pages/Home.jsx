import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/*
  Auto-loads every image in src/assets/images (jpg, jpeg, png, webp).
  Just drop new pictures into that folder, no code changes needed.
  last_year_champs is used for the hero and is left out of the gallery.
*/
const found = import.meta.glob(
  "../assets/images/*.{jpg,jpeg,png,webp,JPG,PNG}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const entries = Object.entries(found).sort(([a], [b]) =>
  a.localeCompare(b, undefined, { numeric: true }),
);

const champsEntry = entries.find(([p]) => p.includes("last_year_champs"));
const champsSrc = champsEntry ? champsEntry[1] : null;

// Optional: give a photo a caption using its file name.
const captions = {
  // "students2.jpg": "The Rockets",
};

const photos = entries
  .filter(([p]) => !p.includes("last_year_champs"))
  .map(([p, src]) => {
    const file = p.split("/").pop();
    return { src, name: captions[file] || "" };
  });

const phrases = [
  "Who wants to be the champ?",
  "Think fast. Answer faster.",
  "Your team. Your moment.",
  "One trophy. Will it be yours?",
  "Last year's champs are waiting for you.",
];

function Home() {
  const [open, setOpen] = useState(null);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setPhrase((p) => (p + 1) % phrases.length),
      3500,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (open === null || photos.length === 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setOpen((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* HERO */}
      <main className="home-hero">
        <span className="shape shape-triangle" aria-hidden="true" />
        <span className="shape shape-diamond" aria-hidden="true" />
        <span className="shape shape-circle" aria-hidden="true" />
        <span className="shape shape-square" aria-hidden="true" />

        <div className="home-text">
          <h1 className="home-title">
            Breath
            <br />
            Contest
          </h1>
          <p key={phrase} className="home-sub home-phrase">
            {phrases[phrase]}
          </p>
          <div className="home-actions">
            <Link to="/login" className="btn btn-warning btn-lg btn-pulse">
              Login
            </Link>
            <Link to="/register" className="btn btn-light btn-lg">
              Register
            </Link>
          </div>
        </div>

        {champsSrc && (
          <figure className="home-photo">
            <img src={champsSrc} alt="Last year's champions" />
            <figcaption className="home-badge">
              🏆 Last year's champions
            </figcaption>
          </figure>
        )}
      </main>

      {/* MOVING PHOTO STRIP */}
      {photos.length > 0 && (
        <div className="strip" aria-hidden="true">
          <div className="strip-track">
            {[...photos, ...photos].map((p, i) => (
              <img
                key={i}
                src={p.src}
                alt=""
                className={`strip-img tile-${i % 4}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* HYPE BANNER */}
      <section className="hype">
        <h2 className="hype-title">Will your team be next?</h2>
        <p className="hype-text">
          Every champion started in this hall, nervous and ready. Grab your
          team, hit the buzzer first and get your photo on this page.
        </p>
        <Link to="/register" className="btn btn-warning btn-lg btn-pulse">
          Join the contest
        </Link>
      </section>

      {/* GALLERY */}
      {photos.length > 0 && (
        <section className="gallery">
          <h2 className="gallery-title">Last year's teams</h2>
          <p className="gallery-sub">Click a photo to see it full screen.</p>
          <div className="gallery-grid">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                className={`gallery-tile tile-${i % 4}`}
                onClick={() => setOpen(i)}
                aria-label="Open photo"
              >
                <img
                  src={p.src}
                  alt={p.name || "Contest team"}
                  loading="lazy"
                />
                {p.name && <span className="gallery-name">{p.name}</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      {open !== null && photos[open] && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <img
            src={photos[open].src}
            alt={photos[open].name || "Contest team"}
          />
          {photos[open].name && (
            <p className="lightbox-name">{photos[open].name}</p>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-brand">🏆 Ezz Contest</div>
        <div className="footer-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className="footer-note">
          © {new Date().getFullYear()} Ezz Contest · Made for our school
        </div>
      </footer>
    </>
  );
}

export default Home;
